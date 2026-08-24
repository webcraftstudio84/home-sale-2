import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import {
  Bike,
  Navigation,
  Phone,
  Store,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Power,
  PackageCheck,
} from 'lucide-react';
import { motion } from 'motion/react';

export const DeliveryDashboard: React.FC = () => {
  const {
    orders,
    currentDeliveryPartner,
    acceptDelivery,
    updateDeliveryProgress,
    currentUser,
  } = useApp();

  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'history'>('available');

  const rider = currentDeliveryPartner || {
    id: 'dp-1',
    name: currentUser?.name || 'Rajesh Kumar',
    phone: currentUser?.phone || '+91 91234 56789',
    rating: 4.9,
    totalDeliveries: 148,
    vehicleType: 'EV',
    todayEarnings: 450,
  };

  // Orders available for pickup (Ready for Pickup or Shopkeeper Accepted and unassigned)
  const availableOrders = orders.filter(
    (o) =>
      (o.orderStatus === 'Ready for Pickup' || o.orderStatus === 'Shopkeeper Accepted') &&
      (!o.deliveryPartnerId || o.deliveryPartnerId === rider.id)
  );

  // Active delivery trips in progress for this rider
  const activeOrders = orders.filter(
    (o) =>
      (o.orderStatus === 'Delivery Partner Assigned' ||
        o.orderStatus === 'Picked Up' ||
        o.orderStatus === 'Out for Delivery') &&
      (o.deliveryPartnerId === rider.id || !o.deliveryPartnerId)
  );

  // Completed deliveries
  const completedOrders = orders.filter(
    (o) => o.orderStatus === 'Delivered'
  );

  // Earnings calculation (Delivery Charges per order)
  const totalEarnings = completedOrders.reduce((sum, o) => sum + o.deliveryCharge, 0);

  const handleAccept = (order: Order) => {
    acceptDelivery(order.id, rider.id);
    setActiveTab('active');
  };

  const handleConfirmPickup = (order: Order) => {
    updateDeliveryProgress(order.id, 'Picked Up');
  };

  const handleStartDelivery = (order: Order) => {
    updateDeliveryProgress(order.id, 'Out for Delivery');
  };

  const handleConfirmDelivered = (order: Order) => {
    updateDeliveryProgress(order.id, 'Delivered');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Rider Header & Online Toggle */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center shadow-xs">
            <Bike className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">{rider.name}</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Delivery Partner
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {rider.vehicleType} Fleet • {rider.rating} ★ ({rider.totalDeliveries} Deliveries) • Zone: Koramangala
            </p>
          </div>
        </div>

        {/* Online / Offline switch */}
        <button
          type="button"
          onClick={() => setIsOnline(!isOnline)}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
            isOnline
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-slate-800 hover:bg-slate-900 text-slate-200'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{isOnline ? 'ONLINE (Ready for Tasks)' : 'OFFLINE (Resting)'}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-medium">Delivery Payouts</p>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-700">₹{totalEarnings}</p>
          <span className="text-[10px] text-slate-400">Direct instant payout</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-medium">Completed</p>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{completedOrders.length}</p>
          <span className="text-[10px] text-slate-400">Trips finished</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-medium">Active Trips</p>
          <p className="text-xl sm:text-2xl font-extrabold text-blue-600">{activeOrders.length}</p>
          <span className="text-[10px] text-slate-400">In progress</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-medium">Avg Delivery Time</p>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900">18 min</p>
          <span className="text-[10px] text-emerald-700 font-bold">Top 5% speed</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('available')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'available'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Available Orders ({availableOrders.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'active'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Active Deliveries ({activeOrders.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Trip History ({completedOrders.length})
        </button>
      </div>

      {/* TAB 1: Available Pickups */}
      {activeTab === 'available' && (
        <div className="space-y-4">
          {!isOnline ? (
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 text-center text-amber-900 text-xs">
              You are currently <strong>Offline</strong>. Toggle online above to accept new delivery orders.
            </div>
          ) : availableOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
              No orders waiting for pickup in your area right now. Check back in a moment.
            </div>
          ) : (
            <div className="space-y-4">
              {availableOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 font-mono text-sm">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800">
                          {order.orderStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Distance: approx <strong>1.8 km</strong> • Payout: <strong className="text-emerald-700">₹{order.deliveryCharge}</strong>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAccept(order)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Bike className="w-4 h-4" />
                      <span>Accept Delivery Task</span>
                    </button>
                  </div>

                  {/* Locations Pickup and Drop */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <Store className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Pickup: {order.shopName}</span>
                      </div>
                      <p className="text-slate-500">{order.shopAddress}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span>Deliver to: {order.customerName}</span>
                      </div>
                      <p className="text-slate-500">
                        {order.deliveryAddress.houseFlat}, {order.deliveryAddress.area}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Active Trips */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {activeOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
              No active delivery trips in progress. Accept an available order above to start delivery.
            </div>
          ) : (
            <div className="space-y-4">
              {activeOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border-2 border-blue-200 p-5 shadow-md space-y-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <span className="font-extrabold text-slate-900 font-mono text-sm">
                        {order.orderNumber}
                      </span>
                      <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-900">
                        {order.orderStatus}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700">
                      Rider Earning: ₹{order.deliveryCharge}
                    </span>
                  </div>

                  {/* Route step cards */}
                  <div className="space-y-3 text-xs">
                    {/* Step A: Shop Pickup */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <Store className="w-4 h-4 text-emerald-600" />
                          <span>1. Collect from {order.shopName}</span>
                        </div>
                        <p className="text-slate-500">{order.shopAddress}</p>
                      </div>
                      <a
                        href={`tel:${order.shopPhone}`}
                        className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-emerald-700"
                        title="Call Store"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* Step B: Customer Delivery */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span>2. Deliver to {order.customerName}</span>
                        </div>
                        <p className="text-slate-500">
                          {order.deliveryAddress.houseFlat}, {order.deliveryAddress.area}
                        </p>
                        {order.deliveryAddress.deliveryInstructions && (
                          <p className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded mt-1">
                            Note: {order.deliveryAddress.deliveryInstructions}
                          </p>
                        )}
                      </div>
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-700"
                        title="Call Customer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Rider Action Stepper Buttons */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    {order.orderStatus === 'Delivery Partner Assigned' && (
                      <button
                        type="button"
                        onClick={() => handleConfirmPickup(order)}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <PackageCheck className="w-4 h-4" />
                        <span>Confirm Package Collected from Store</span>
                      </button>
                    )}

                    {order.orderStatus === 'Picked Up' && (
                      <button
                        type="button"
                        onClick={() => handleStartDelivery(order)}
                        className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Start Ride to Customer Doorstep</span>
                      </button>
                    )}

                    {order.orderStatus === 'Out for Delivery' && (
                      <button
                        type="button"
                        onClick={() => handleConfirmDelivered(order)}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Delivery to Customer • Collect ₹{order.grandTotal}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: History */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {completedOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
              No completed trips recorded yet.
            </div>
          ) : (
            completedOrders.map((o) => (
              <div
                key={o.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span>{o.orderNumber}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      Delivered
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    From {o.shopName} to {o.deliveryAddress.area}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-emerald-700 text-sm">
                    +₹{o.deliveryCharge}
                  </span>
                  <p className="text-[10px] text-slate-400">Earned</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
