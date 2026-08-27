import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Transaction, OrderStatus } from '../types';

export const transactionService = {
  /**
   * Fetch transactions
   */
  fetchTransactions: async (filter?: {
    customerId?: string;
    shopId?: string;
  }): Promise<Transaction[]> => {
    if (!isSupabaseConfigured()) return [];

    try {
      let query = supabase.from('transactions').select('*').order('created_at', { ascending: false });

      if (filter?.customerId) {
        query = query.eq('customer_id', filter.customerId);
      }
      if (filter?.shopId) {
        query = query.eq('shop_id', filter.shopId);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching transactions:', error);
        return [];
      }

      return (data || []).map((t: any) => ({
        id: t.id,
        transactionId: t.transaction_id,
        orderId: t.order_id,
        orderNumber: t.order_number,
        customerId: t.customer_id,
        customerName: t.customer_name,
        shopId: t.shop_id,
        shopName: t.shop_name,
        productAmount: Number(t.amount),
        deliveryCharge: Number(t.delivery_charge),
        totalAmount: Number(t.total_amount),
        paymentMethod: t.payment_method,
        paymentStatus: t.payment_status,
        orderStatus: t.order_status as OrderStatus,
        timestamp: t.created_at,
      }));
    } catch (err) {
      console.error('Transactions fetch exception:', err);
      return [];
    }
  },
};
