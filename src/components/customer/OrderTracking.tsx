import React from 'react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Store,
  Bike,
  ShieldCheck,
  ArrowLeft,
  XCircle,
  Play,
  Navigation,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';

export const OrderTracking: React.FC = () => {
  const {
    trackingOrderId,
    orders,
    setCustomerView,
    updateOrderStatus,
    cancelOrder,
    setTrackingOrderId,
  } = useApp();

  const currentOrder = orders.find((o) => o.id === trackingOrderId) || orders[0];

  if (!currentOrder) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center space-y-4">
        <Clock className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="font-bold text-slate-900 text-lg">No Active Order Selected</h3>
        <button
          type="button"
          onClick={() => setCustomerView('order-history')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer"
        >
          View Order History
        </button>
      </div>
    );
  }

  // Define full timeline stages in order
  const timelineStages: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'Order Placed', label: 'Order Placed', desc: 'Received by shopkeeper' },
    { status: 'Shopkeeper Accepted', label: 'Order Accepted', desc: 'Shopkeeper confirmed inventory' },
    { status: 'Preparing', label: 'Preparing', desc: 'Packing fresh items securely' },
    { status: 'Ready for Pickup', label: 'Ready for Pickup', desc: 'Bag sealed & ready' },
    { status: 'Delivery Partner Assigned', label: 'Rider Assigned', desc: 'Rider reaching shop' },
    { status: 'Picked Up', label: 'Picked Up', desc: 'Package collected from store' },
    { status: 'Out for Delivery', label: 'Out for Delivery', desc: 'Rider on the way to your door' },
    { status: 'Delivered', label: 'Delivered', desc: 'Enjoy your fresh products!' },
  ];

  const currentStatusIndex = timelineStages.findIndex((s) => s.status === currentOrder.orderStatus);
  const isCancelled = currentOrder.orderStatus === 'Cancelled' || currentOrder.orderStatus === 'Rejected';

  // Demo simulator helper to advance order state
  const handleSimulateNextStep = () => {
    if (isCancelled || currentStatusIndex >= timelineStages.length - 1) return;
    const nextStatus = timelineStages[currentStatusIndex + 1].status;
    updateOrderStatus(currentOrder.id, nextStatus, `Simulated step: ${nextStatus}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setCustomerView('order-history')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-colors shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Orders</span>
        </button>

        {/* Demo Fast-Forward Simulation Pill */}
        {!isCancelled && currentOrder.orderStatus !== 'Delivered' && (
          <button
            type="button"
            onClick={handleSimulateNextStep}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 font-bold text-xs hover:bg-amber-100 transition-colors shadow-xs cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
            <span>Simulate Next Step (Live Demo)</span>
          </button>
        )}
      </div>

      {/* Main Tracking Status Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-mono">
                {currentOrder.orderNumber}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500">{new Date(currentOrder.createdAt).toLocaleString()}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {isCancelled
                ? 'Order Cancelled'
                : currentOrder.orderStatus === 'Delivered'
                ? 'Order Delivered Successfully!'
                : `Status: ${currentOrder.orderStatus}`}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              From <strong className="text-slate-800">{currentOrder.shopName}</strong> • Delivery to {currentOrder.deliveryAddress.area}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Estimated Time</p>
            <p className="text-lg font-extrabold text-emerald-700">
              {isCancelled ? 'N/A' : currentOrder.estimatedDeliveryTime}
            </p>
          </div>
        </div>

        {/* Live Delivery Route Visualizer / Map Placeholder */}
        {!isCancelled && (
          <div className="relative h-44 sm:h-52 w-full rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center p-4">
            {/* Grid styling to emulate map terrain */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/60 via-slate-50/30 to-emerald-50/60" />

            <div className="relative z-10 w-full max-w-lg flex items-center justify-between px-4 sm:px-8">
              {/* Shop Pin */}
              <div className="flex flex-col items-center text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg ring-4 ring-white">
                  <Store className="w-5 h-5" />
                </div>
                <p className="text-[11px] font-bold text-slate-900 max-w-[90px] truncate">{currentOrder.shopName}</p>
                <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">Pickup</span>
              </div>

              {/* Connecting animated route line */}
              <div className="flex-1 mx-3 relative flex items-center justify-center">
                <div className="w-full h-1 bg-slate-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-700"
                    style={{
                      width: `${Math.max(10, ((currentStatusIndex + 1) / timelineStages.length) * 100)}%`,
                    }}
                  />
                </div>
                {/* Rider Icon moving on path */}
                <div
                  className="absolute -top-3.5 transition-all duration-700"
                  style={{
                    left: `${Math.min(90, Math.max(5, ((currentStatusIndex + 1) / timelineStages.length) * 100))}%`,
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md animate-bounce">
                    <Bike className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Customer Pin */}
              <div className="flex flex-col items-center text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center shadow-lg ring-4 ring-white">
                  <MapPin className="w-5 h-5" />
                </div>
                <p className="text-[11px] font-bold text-slate-900 max-w-[90px] truncate">{currentOrder.deliveryAddress.area}</p>
                <span className="text-[9px] font-semibold text-slate-700 bg-slate-200 px-1.5 py-0.2 rounded">Destination</span>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Stepper */}
        <div className="space-y-4 pt-2">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Live Order Timeline</h3>
          
          <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {timelineStages.map((stage, idx) => {
              const isPast = currentStatusIndex > idx;
              const isCurrent = currentStatusIndex === idx && !isCancelled;
              const isFuture = currentStatusIndex < idx;

              return (
                <div key={stage.status} className="relative flex items-start gap-3.5 pl-1">
                  {/* Step Indicator */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all z-10 ${
                      isPast
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-[10px]">{idx + 1}</span>
                    )}
                  </div>

                  <div className="flex-1 pb-1">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-xs font-bold ${
                          isCurrent
                            ? 'text-emerald-800 text-sm'
                            : isPast
                            ? 'text-slate-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {stage.label}
                      </p>
                      {isPast && (
                        <span className="text-[10px] text-slate-400">Completed</span>
                      )}
                      {isCurrent && (
                        <span className="text-[10px] font-extrabold text-emerald-700 animate-pulse bg-emerald-50 px-2 py-0.5 rounded">
                          In Progress
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{stage.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stakeholder Contacts (Shopkeeper & Delivery Partner) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs">
          {/* Shopkeeper */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{currentOrder.shopName}</p>
                <p className="text-[11px] text-slate-500">{currentOrder.shopAddress}</p>
              </div>
            </div>
            <a
              href={`tel:${currentOrder.shopPhone}`}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300"
              title="Call Shopkeeper"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Delivery Partner */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                <Bike className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">
                  {currentOrder.deliveryPartnerName || 'Rajesh Kumar'} (Rider)
                </p>
                <p className="text-[11px] text-slate-500">EV Scooter • 4.9 ★</p>
              </div>
            </div>
            <a
              href={`tel:${currentOrder.deliveryPartnerPhone || '+919123456789'}`}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-300"
              title="Call Rider"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Order Details & Pricing Breakdown */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Ordered Items</h4>
          <div className="space-y-2">
            {currentOrder.items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-7 h-7 rounded-md object-cover"
                  />
                  <span>
                    {item.quantity} × {item.productName} ({item.unit})
                  </span>
                </div>
                <span className="font-semibold text-slate-900">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Product Subtotal</span>
              <span className="font-bold text-slate-900">₹{currentOrder.productSubtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="font-bold text-slate-900">₹{currentOrder.deliveryCharge}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-200">
              <span>Grand Total</span>
              <span className="text-emerald-700">₹{currentOrder.grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Cancellation CTA if pending */}
        {!isCancelled && currentOrder.orderStatus !== 'Delivered' && currentStatusIndex < 3 && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => cancelOrder(currentOrder.id, 'Customer requested cancellation before packing')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
            >
              Cancel this order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
