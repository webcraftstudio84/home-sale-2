import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import {
  Clock,
  Store,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react';
import { motion } from 'motion/react';

export const OrderHistoryPage: React.FC = () => {
  const { orders, setCustomerView, setTrackingOrderId, addToCart, products } = useApp();
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'completed'>('all');

  const activeOrders = orders.filter(
    (o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled' && o.orderStatus !== 'Rejected'
  );
  const completedOrders = orders.filter(
    (o) => o.orderStatus === 'Delivered' || o.orderStatus === 'Cancelled' || o.orderStatus === 'Rejected'
  );

  const displayedOrders =
    filterTab === 'active'
      ? activeOrders
      : filterTab === 'completed'
      ? completedOrders
      : orders;

  const handleTrackOrder = (orderId: string) => {
    setTrackingOrderId(orderId);
    setCustomerView('order-tracking');
  };

  const handleReorder = (order: Order) => {
    // Add all valid products from this order to cart
    order.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        addToCart(prod, item.quantity);
      }
    });
    setCustomerView('checkout');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            My Orders
          </h2>
          <p className="text-xs text-slate-500">
            Track active live deliveries and view invoice history
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterTab === 'active' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active ({activeOrders.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterTab === 'completed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({completedOrders.length})
          </button>
        </div>
      </div>

      {displayedOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h4 className="font-bold text-slate-800 text-base">No orders found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't placed any orders in this category yet. Explore nearby kirana and shops to get started!
          </p>
          <button
            type="button"
            onClick={() => setCustomerView('shops')}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
          >
            Browse Shops
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedOrders.map((order) => {
            const isActive =
              order.orderStatus !== 'Delivered' &&
              order.orderStatus !== 'Cancelled' &&
              order.orderStatus !== 'Rejected';

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">{order.shopName}</h3>
                        <span className="font-mono text-xs font-bold text-slate-400">
                          {order.orderNumber}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'Cancelled' || order.orderStatus === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-900 animate-pulse'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-3">
                    {order.items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                      >
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-8 h-8 rounded-lg object-cover bg-white shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{item.productName}</p>
                          <p className="text-[10px] text-slate-500">
                            {item.quantity} × ₹{item.price} ({item.unit})
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown Footer */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4 text-slate-600">
                    <div>
                      <span>Subtotal: </span>
                      <strong className="text-slate-900">₹{order.productSubtotal}</strong>
                    </div>
                    <div>
                      <span>Delivery: </span>
                      <strong className="text-slate-900">₹{order.deliveryCharge}</strong>
                    </div>
                    <div>
                      <span>Total: </span>
                      <strong className="text-emerald-700 text-sm">₹{order.grandTotal}</strong>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      ({order.paymentMethod} • {order.paymentStatus})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <button
                        type="button"
                        onClick={() => handleTrackOrder(order.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Live Track</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleTrackOrder(order.id)}
                          className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
                        >
                          View Receipt
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReorder(order)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reorder</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
