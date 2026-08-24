import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DeliveryZone, Shop } from '../../types';
import {
  Shield,
  Store,
  MapPin,
  TrendingUp,
  ShoppingBag,
  Plus,
  CheckCircle2,
  XCircle,
  Power,
  Users,
  Search,
  Filter,
  Trash2,
} from 'lucide-react';
import { motion } from 'motion/react';

export const AdminDashboard: React.FC = () => {
  const {
    shops,
    products,
    orders,
    deliveryZones,
    adminAddDeliveryZone,
    adminUpdateDeliveryZone,
    adminUpdateShopStatus,
    adminDeleteDeliveryZone,
    updateShopProfile,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'shops' | 'zones' | 'orders'>('overview');
  const [shopSearch, setShopSearch] = useState('');

  // New Zone Form
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneCity, setNewZoneCity] = useState('Bengaluru');
  const [newZonePincodes, setNewZonePincodes] = useState('');
  const [newZoneDeliveryFee, setNewZoneDeliveryFee] = useState('25');

  // Platform Metrics
  const totalGMV = orders
    .filter((o) => o.orderStatus !== 'Cancelled' && o.orderStatus !== 'Rejected')
    .reduce((sum, o) => sum + o.grandTotal, 0);

  const totalProductSales = orders
    .filter((o) => o.orderStatus !== 'Cancelled' && o.orderStatus !== 'Rejected')
    .reduce((sum, o) => sum + o.productSubtotal, 0);

  const totalDeliveryRevenue = orders
    .filter((o) => o.orderStatus !== 'Cancelled' && o.orderStatus !== 'Rejected')
    .reduce((sum, o) => sum + o.deliveryCharge, 0);

  const activeShopsCount = shops.filter((s) => s.status === 'active' && s.isOpen).length;
  const totalServiceableZones = deliveryZones.filter((z) => z.isActive).length;

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName || !newZonePincodes) return;

    const pincodeList = newZonePincodes
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    adminAddDeliveryZone({
      name: newZoneName,
      city: newZoneCity,
      pincodes: pincodeList,
      minimumOrderAmount: 150,
      standardDeliveryCharge: parseFloat(newZoneDeliveryFee) || 25,
      isActive: true,
      estimatedTimeMin: 20,
    });

    setNewZoneName('');
    setNewZonePincodes('');
  };

  const filteredShops = shops.filter(
    (s) =>
      !shopSearch ||
      s.name.toLowerCase().includes(shopSearch.toLowerCase()) ||
      s.area.toLowerCase().includes(shopSearch.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center shadow-xs">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">Platform Administration</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              HOMESALE Hyperlocal Operations & Multi-Store Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
            Live Hyperlocal Network
          </span>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-medium">Total Platform GMV</p>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900">₹{totalGMV}</p>
          <span className="text-[10px] text-emerald-700 font-bold">
            ₹{totalProductSales} Goods + ₹{totalDeliveryRevenue} Delivery
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-medium">Total Lifetime Orders</p>
          <p className="text-xl sm:text-2xl font-extrabold text-purple-700">{orders.length}</p>
          <span className="text-[10px] text-slate-400">All local routes</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-medium">Registered Shops</p>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{shops.length}</p>
          <span className="text-[10px] text-emerald-700 font-bold">{activeShopsCount} currently open</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-medium">Active Delivery Zones</p>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{totalServiceableZones}</p>
          <span className="text-[10px] text-slate-400">Validated Clusters</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Marketplace Overview
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('shops')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'shops'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Shops Management ({shops.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('zones')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'zones'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Service Delivery Zones ({deliveryZones.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Orders Audit ({orders.length})
        </button>
      </div>

      {/* TAB 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top performing shops */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Top Hyperlocal Stores</h3>
              <div className="space-y-2.5">
                {shops.map((shop) => {
                  const shopOrderCount = orders.filter((o) => o.shopId === shop.id).length;
                  return (
                    <div
                      key={shop.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={shop.logo}
                          alt={shop.name}
                          className="w-9 h-9 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{shop.name}</p>
                          <p className="text-[11px] text-slate-500">
                            {shop.category} • {shop.area}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-extrabold text-slate-900">{shopOrderCount} orders</p>
                        <span className="text-[10px] text-emerald-700 font-bold">{shop.rating} ★</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Platform Health Rules */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Platform Business Policies</h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                  <p className="font-bold">Minimum Order Requirement</p>
                  <p className="text-[11px]">Enforced strictly at ₹150 product subtotal before separate delivery fee.</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-950">
                  <p className="font-bold">Single Store Cart Constraint</p>
                  <p className="text-[11px]">Carts are restricted to 1 merchant at a time for 15-min delivery speed.</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                  <p className="font-bold">Delivery Zone Geofencing</p>
                  <p className="text-[11px]">Orders only permissible in active validated pincodes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Shops Management */}
      {activeTab === 'shops' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={shopSearch}
              onChange={(e) => setShopSearch(e.target.value)}
              placeholder="Search merchants..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Store Details</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Area / Pincode</th>
                    <th className="p-3.5">Rating</th>
                    <th className="p-3.5">Delivery Fee</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredShops.map((shop) => (
                    <tr key={shop.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={shop.logo}
                            alt={shop.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{shop.name}</p>
                            <p className="text-[11px] text-slate-400">{shop.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-medium text-slate-700">{shop.category}</td>
                      <td className="p-3.5 text-slate-600">
                        {shop.area} ({shop.pincode})
                      </td>
                      <td className="p-3.5 font-bold text-slate-800">{shop.rating} ★</td>
                      <td className="p-3.5 font-bold text-slate-800">₹{shop.deliveryCharge}</td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            shop.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {shop.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            adminUpdateShopStatus(
                              shop.id,
                              shop.status === 'active' ? 'suspended' : 'active'
                            )
                          }
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-[11px] font-bold cursor-pointer"
                        >
                          {shop.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Delivery Zones */}
      {activeTab === 'zones' && (
        <div className="space-y-5">
          {/* Add Zone Card */}
          <form
            onSubmit={handleAddZone}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
          >
            <h3 className="font-bold text-slate-900 text-sm">Add New Serviceable Delivery Zone</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                required
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                placeholder="Zone / Area (e.g. Koramangala Cluster)"
                className="px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
              <input
                type="text"
                required
                value={newZoneCity}
                onChange={(e) => setNewZoneCity(e.target.value)}
                placeholder="City (e.g. Bengaluru)"
                className="px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
              <input
                type="text"
                required
                value={newZonePincodes}
                onChange={(e) => setNewZonePincodes(e.target.value)}
                placeholder="Pincodes comma separated (560034, 560095)"
                className="px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono text-[11px]"
              />
              <input
                type="number"
                required
                min="0"
                value={newZoneDeliveryFee}
                onChange={(e) => setNewZoneDeliveryFee(e.target.value)}
                placeholder="Delivery Fee ₹"
                className="px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Delivery Zone</span>
            </button>
          </form>

          {/* Existing Zones List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {deliveryZones.map((zone) => (
              <div
                key={zone.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">
                      {zone.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                        zone.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {zone.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    {zone.city} • Pincodes: <span className="font-mono">{zone.pincodes.join(', ')}</span>
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Delivery: ₹{zone.standardDeliveryCharge} • Min Order: ₹{zone.minimumOrderAmount}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      adminUpdateDeliveryZone(zone.id, { isActive: !zone.isActive })
                    }
                    className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-[11px] font-bold text-slate-700 cursor-pointer"
                  >
                    {zone.isActive ? 'Disable' : 'Enable'}
                  </button>
                  {deliveryZones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => adminDeleteDeliveryZone(zone.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                      title="Delete Zone"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Orders Audit */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Shop</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Goods Subtotal</th>
                  <th className="p-3.5">Delivery Fee</th>
                  <th className="p-3.5">Grand Total</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-mono font-bold text-slate-900">{o.orderNumber}</td>
                    <td className="p-3.5 font-semibold text-slate-800">{o.shopName}</td>
                    <td className="p-3.5 text-slate-600">
                      {o.customerName} ({o.deliveryAddress.area})
                    </td>
                    <td className="p-3.5 font-bold text-slate-800">₹{o.productSubtotal}</td>
                    <td className="p-3.5 font-bold text-slate-800">₹{o.deliveryCharge}</td>
                    <td className="p-3.5 font-extrabold text-emerald-700">₹{o.grandTotal}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold text-[10px]">
                        {o.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
