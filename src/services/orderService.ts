import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Order, OrderStatus, CartItem, Address } from '../types';

export const orderService = {
  /**
   * Fetch orders from Supabase
   */
  fetchOrders: async (filters?: {
    customerId?: string;
    shopId?: string;
    deliveryPartnerId?: string;
  }): Promise<Order[]> => {
    if (!isSupabaseConfigured()) return [];

    try {
      let query = supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });

      if (filters?.customerId) {
        query = query.eq('customer_id', filters.customerId);
      }
      if (filters?.shopId) {
        query = query.eq('shop_id', filters.shopId);
      }
      if (filters?.deliveryPartnerId) {
        query = query.eq('delivery_partner_id', filters.deliveryPartnerId);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching orders:', error);
        return [];
      }

      return (data || []).map((o: any) => ({
        id: o.id,
        orderNumber: o.order_number,
        customerId: o.customer_id,
        customerName: o.customer_name,
        customerPhone: o.customer_phone,
        shopId: o.shop_id,
        shopName: o.shop_name,
        shopAddress: o.shop_address,
        shopPhone: o.shop_phone,
        deliveryPartnerId: o.delivery_partner_id,
        deliveryPartnerName: o.delivery_partner_name,
        deliveryPartnerPhone: o.delivery_partner_phone,
        items: (o.order_items || []).map((item: any) => ({
          productId: item.product_id || item.id,
          productName: item.product_name_snapshot,
          unit: item.unit_snapshot || '1 unit',
          price: Number(item.price_snapshot),
          quantity: Number(item.quantity),
          image: item.image_snapshot || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80',
        })),
        productSubtotal: Number(o.subtotal),
        deliveryCharge: Number(o.delivery_charge),
        grandTotal: Number(o.grand_total),
        deliveryAddress: o.delivery_address_json as Address,
        paymentMethod: o.payment_method,
        paymentStatus: o.payment_status,
        orderStatus: o.order_status as OrderStatus,
        createdAt: o.created_at,
        estimatedDeliveryTime: o.estimated_delivery_time || '25 mins',
        statusHistory: o.status_history || [],
        cancellationReason: o.cancellation_reason,
      }));
    } catch (err) {
      console.error('Orders fetch exception:', err);
      return [];
    }
  },

  /**
   * Create new Order + order_items + transaction
   */
  createOrder: async (orderPayload: any): Promise<{ order?: Order; error?: string }> => {
    const subtotal = Number(orderPayload.subtotal ?? orderPayload.productSubtotal ?? 0);
    const deliveryCharge = Number(orderPayload.deliveryCharge ?? 0);
    const grandTotal = Number(orderPayload.grandTotal ?? subtotal + deliveryCharge);

    if (!isSupabaseConfigured()) {
      const newOrder: Order = {
        id: orderPayload.id || 'ord_' + Date.now(),
        orderNumber: orderPayload.orderNumber,
        customerId: orderPayload.customerId,
        customerName: orderPayload.customerName,
        customerPhone: orderPayload.customerPhone,
        shopId: orderPayload.shopId,
        shopName: orderPayload.shopName,
        shopAddress: orderPayload.shopAddress,
        shopPhone: orderPayload.shopPhone,
        items: (orderPayload.items || []).map((it: any) => ({
          productId: it.productId || it.product?.id,
          productName: it.productName || it.product?.name,
          unit: it.unit || it.product?.unit || '1 unit',
          price: it.price ?? it.product?.price ?? 0,
          quantity: it.quantity || 1,
          image: it.image || it.product?.image || '',
        })),
        productSubtotal: subtotal,
        deliveryCharge: deliveryCharge,
        grandTotal: grandTotal,
        deliveryAddress: orderPayload.deliveryAddress,
        paymentMethod: orderPayload.paymentMethod,
        paymentStatus: orderPayload.paymentStatus || (orderPayload.paymentMethod === 'COD' ? 'Pending' : 'Paid'),
        orderStatus: orderPayload.orderStatus || 'Order Placed',
        createdAt: orderPayload.createdAt || new Date().toISOString(),
        estimatedDeliveryTime: orderPayload.estimatedDeliveryTime || '25-35 mins',
        statusHistory: orderPayload.statusHistory || [
          {
            status: 'Order Placed',
            timestamp: new Date().toISOString(),
            note: 'Order submitted by customer',
          },
        ],
      };
      return { order: newOrder };
    }

    try {
      const initialHistory = orderPayload.statusHistory || [
        {
          status: 'Order Placed',
          timestamp: new Date().toISOString(),
          note: 'Order placed by customer via HOMESALE',
        },
      ];

      // Insert Order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            order_number: orderPayload.orderNumber,
            customer_id: orderPayload.customerId,
            customer_name: orderPayload.customerName,
            customer_phone: orderPayload.customerPhone,
            shop_id: orderPayload.shopId,
            shop_name: orderPayload.shopName,
            shop_address: orderPayload.shopAddress,
            shop_phone: orderPayload.shopPhone,
            delivery_address_json: orderPayload.deliveryAddress,
            subtotal: subtotal,
            delivery_charge: deliveryCharge,
            grand_total: grandTotal,
            payment_method: orderPayload.paymentMethod,
            payment_status: orderPayload.paymentStatus || (orderPayload.paymentMethod === 'COD' ? 'Pending' : 'Paid'),
            order_status: orderPayload.orderStatus || 'Order Placed',
            estimated_delivery_time: orderPayload.estimatedDeliveryTime || '25 mins',
            status_history: initialHistory,
          },
        ])
        .select()
        .single();

      if (orderError || !orderData) {
        return { error: orderError?.message || 'Failed to place order' };
      }

      // Insert Order Items with immutable price snapshots
      const itemsToInsert = (orderPayload.items || []).map((it: any) => {
        const prodId = it.productId || it.product?.id;
        const prodName = it.productName || it.product?.name;
        const unit = it.unit || it.product?.unit || '1 unit';
        const image = it.image || it.product?.image || '';
        const price = Number(it.price ?? it.product?.price ?? 0);
        const qty = Number(it.quantity || 1);

        return {
          order_id: orderData.id,
          product_id: prodId,
          product_name_snapshot: prodName,
          unit_snapshot: unit,
          image_snapshot: image,
          price_snapshot: price,
          quantity: qty,
          subtotal: price * qty,
        };
      });

      if (itemsToInsert.length > 0) {
        const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
        if (itemsError) {
          console.warn('Warning: Order items insertion error:', itemsError);
        }
      }

      // Insert Transaction record
      const txId = 'TXN' + Math.floor(10000000 + Math.random() * 90000000);
      await supabase.from('transactions').insert([
        {
          transaction_id: txId,
          order_id: orderData.id,
          order_number: orderPayload.orderNumber,
          customer_id: orderPayload.customerId,
          customer_name: orderPayload.customerName,
          shop_id: orderPayload.shopId,
          shop_name: orderPayload.shopName,
          amount: subtotal,
          delivery_charge: deliveryCharge,
          total_amount: grandTotal,
          payment_method: orderPayload.paymentMethod,
          payment_status: 'Success',
          order_status: 'Order Placed',
        },
      ]);

      const formattedOrder: Order = {
        id: orderData.id,
        orderNumber: orderData.order_number,
        customerId: orderData.customer_id,
        customerName: orderData.customer_name,
        customerPhone: orderData.customer_phone,
        shopId: orderData.shop_id,
        shopName: orderData.shop_name,
        shopAddress: orderData.shop_address,
        shopPhone: orderData.shop_phone,
        items: (orderPayload.items || []).map((it: any) => ({
          productId: it.productId || it.product?.id,
          productName: it.productName || it.product?.name,
          unit: it.unit || it.product?.unit || '1 unit',
          price: Number(it.price ?? it.product?.price ?? 0),
          quantity: Number(it.quantity || 1),
          image: it.image || it.product?.image,
        })),
        productSubtotal: Number(orderData.subtotal),
        deliveryCharge: Number(orderData.delivery_charge),
        grandTotal: Number(orderData.grand_total),
        deliveryAddress: orderData.delivery_address_json as Address,
        paymentMethod: orderData.payment_method,
        paymentStatus: orderData.payment_status,
        orderStatus: orderData.order_status,
        createdAt: orderData.created_at,
        estimatedDeliveryTime: orderData.estimated_delivery_time,
        statusHistory: orderData.status_history,
      };

      return { order: formattedOrder };
    } catch (err: any) {
      return { error: err?.message || 'Order creation exception' };
    }
  },


  /**
   * Update Order Status
   */
  updateOrderStatus: async (
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
    existingHistory: any[] = []
  ): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured()) return {};

    try {
      const updatedHistory = [
        ...existingHistory,
        {
          status: newStatus,
          timestamp: new Date().toISOString(),
          note: note || `Status changed to ${newStatus}`,
        },
      ];

      const { error } = await supabase
        .from('orders')
        .update({
          order_status: newStatus,
          status_history: updatedHistory,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) return { error: error.message };

      // Also update transaction status if applicable
      await supabase
        .from('transactions')
        .update({ order_status: newStatus })
        .eq('order_id', orderId);

      return {};
    } catch (err: any) {
      return { error: err?.message || 'Failed to update order status' };
    }
  },

  /**
   * Assign Delivery Partner to Order
   */
  assignDeliveryPartner: async (
    orderId: string,
    partnerId: string,
    partnerName: string,
    partnerPhone: string,
    existingHistory: any[] = []
  ): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured()) return {};

    try {
      const updatedHistory = [
        ...existingHistory,
        {
          status: 'Delivery Partner Assigned' as OrderStatus,
          timestamp: new Date().toISOString(),
          note: `Assigned to delivery partner ${partnerName}`,
        },
      ];

      const { error } = await supabase
        .from('orders')
        .update({
          delivery_partner_id: partnerId,
          delivery_partner_name: partnerName,
          delivery_partner_phone: partnerPhone,
          order_status: 'Delivery Partner Assigned',
          status_history: updatedHistory,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err?.message || 'Failed to assign delivery partner' };
    }
  },
};
