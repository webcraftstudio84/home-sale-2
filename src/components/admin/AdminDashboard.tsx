import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DeliveryZone, Shop, DeliveryPartner } from '../../types';
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
  Bike,
  Clock,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Check,
  X,
  LogOut,
  Phone,
  Mail,
  Calendar,
  Eye,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDashboard: React.FC = () => {
  const {
    shops,
    products,
    orders,
    deliveryZones,
    deliveryPartners,
    adminAddDeliveryZone,
    adminUpdateDeliveryZone,
    adminDeleteDeliveryZone,
    adminApproveShop,
    adminRejectShop,
    adminSuspendShop,
    adminActivateShop,
    adminApproveDeliveryPartner,
    adminRejectDeliveryPartner,
    adminSuspendDeliveryPartner,
    adminActivateDeliveryPartner,
    logoutUser,
    setAuthView,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'shops' | 'riders' | 'zones' | 'orders'>('overview');
  const [shopFilter, setShopFilter] = useState<'all' | 'pending' | 'active' | 'suspended' | 'rejected'>('all');
  const [riderFilter, setRiderFilter] = useState<'all' | 'pending' | 'active' | 'suspended' | 'rejected'>('all');
  const [shopSearch, setShopSearch] = useState('');
  const [riderSearch, setRiderSearch] = useState('');

  // New Zone Form
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneCity, setNewZoneCity] = useState('Bengaluru');
  const [newZonePincodes, setNewZonePincodes] = useState('');
  const [newZoneDeliveryFee, setNewZoneDeliveryFee] = useState('25');

  // Counts
  const pendingShopsCount = shops.filter((s) => s.status === 'pending').length;
  const pendingRidersCount = deliveryPartners.filter((dp) => dp.approvalStatus === 'pending').length;
  const activeShopsCount = shops.filter((s) => s.status === 'active').length;
  const activeRidersCount = deliveryPartners.filter((dp) => dp.approvalStatus === 'active').length;

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

  const filteredShops = shops.filter((s) => {
    const matchesFilter = shopFilter === 'all' || s.status === shopFilter;
    const matchesSearch =
      !shopSearch ||
      s.name.toLowerCase().includes(shopSearch.toLowerCase()) ||
      s.area.toLowerCase().includes(shopSearch.toLowerCase()) ||
      (s.ownerName && s.ownerName.toLowerCase().includes(shopSearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const filteredRiders = deliveryPartners.filter((dp) => {
    const matchesFilter = riderFilter === 'all' || dp.approvalStatus === riderFilter;
    const matchesSearch =
      !riderSearch ||
      dp.name.toLowerCase().includes(riderSearch.toLowerCase()) ||
      dp.phone.includes(riderSearch) ||
      (dp.vehicleNumber && dp.vehicleNumber.toLowerCase().includes(riderSearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight text-white">HOMESALE Admin Console</h2>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-900/80 border border-purple-700 text-purple-300">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Platform Governance, Shop Approvals, Fleet Verification & Financial Auditing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              logoutUser();
              setAuthView(null);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 border border-slate-700 hover:border-rose-700 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Logout Admin</span>
          </button>
        </div>
      </div>

      {/* Pending Approvals Alert Banner */}
      {(pendingShopsCount > 0 || pendingRidersCount > 0) && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-800">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold text-sm text-amber-900">
                Action Required: Pending Platform Approvals
              </p>
              <p className="text-[11px] text-amber-700">
                {pendingShopsCount > 0 && `${pendingShopsCount} new shop registration(s)`}
                {pendingShopsCount > 0 && pendingRidersCount > 0 && ' and '}
                {pendingRidersCount > 0 && `${pendingRidersCount} delivery rider application(s)`} waiting for your review.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {pendingShopsCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('shops');
                  setShopFilter('pending');
                }}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
              >
                Review Shops ({pendingShopsCount})
              </button>
            )}
            {pendingRidersCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('riders');
                  setRiderFilter('pending');
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
              >
                Review Riders ({pendingRidersCount})
              </button>
            )}
          </div>
        </div>
      )}

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
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">Shops Network</p>
            {pendingShopsCount > 0 && (
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {pendingShopsCount} Pending
              </span>
            )}
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{shops.length}</p>
          <span className="text-[10px] text-emerald-700 font-bold">{activeShopsCount} verified & active</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">Delivery Fleet</p>
            {pendingRidersCount > 0 && (
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {pendingRidersCount} Pending
              </span>
            )}
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-blue-700">{deliveryPartners.length}</p>
          <span className="text-[10px] text-slate-500">{activeRidersCount} approved partners</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-medium">Total Orders Placed</p>
          <p className="text-xl sm:text-2xl font-extrabold text-purple-700">{orders.length}</p>
          <span className="text-[10px] text-slate-400">{totalServiceableZones} active zones</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Overview
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('shops')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'shops'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Shop Approvals & Shops ({shops.length})</span>
          {pendingShopsCount > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
              {pendingShopsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('riders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'riders'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bike className="w-3.5 h-3.5" />
          <span>Rider Fleet & Approvals ({deliveryPartners.length})</span>
          {pendingRidersCount > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
              {pendingRidersCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('zones')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'zones'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Delivery Zones ({deliveryZones.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
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
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-slate-900">{shop.name}</p>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                                shop.status === 'active'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : shop.status === 'pending'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {shop.status}
                            </span>
                          </div>
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

      {/* TAB 2: Shops Management & Approvals */}
      {activeTab === 'shops' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative max-w-md flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={shopSearch}
                onChange={(e) => setShopSearch(e.target.value)}
                placeholder="Search by shop name, owner, area..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            {/* Status Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setShopFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  shopFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({shops.length})
              </button>
              <button
                type="button"
                onClick={() => setShopFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                  shopFilter === 'pending'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>Pending ({shops.filter((s) => s.status === 'pending').length})</span>
              </button>
              <button
                type="button"
                onClick={() => setShopFilter('active')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  shopFilter === 'active'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                }`}
              >
                Active ({shops.filter((s) => s.status === 'active').length})
              </button>
              <button
                type="button"
                onClick={() => setShopFilter('suspended')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  shopFilter === 'suspended'
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Suspended ({shops.filter((s) => s.status === 'suspended').length})
              </button>
              <button
                type="button"
                onClick={() => setShopFilter('rejected')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  shopFilter === 'rejected'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-100 text-rose-900 hover:bg-rose-200'
                }`}
              >
                Rejected ({shops.filter((s) => s.status === 'rejected').length})
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Shop & Owner</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Location & Pincode</th>
                    <th className="p-3.5">Username / Login</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Approval Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredShops.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        No shops found matching the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredShops.map((shop) => (
                      <tr key={shop.id} className="hover:bg-slate-50/50">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={shop.logo}
                              alt={shop.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                            />
                            <div>
                              <p className="font-bold text-slate-900 text-[13px]">{shop.name}</p>
                              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                                <span className="font-semibold text-slate-700">
                                  Owner: {shop.ownerName || 'Merchant'}
                                </span>
                                <span>•</span>
                                <span>{shop.phone}</span>
                              </div>
                              {shop.ownerEmail && (
                                <p className="text-[10px] text-slate-400">{shop.ownerEmail}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 font-medium text-slate-700">
                          <span className="bg-slate-100 px-2 py-0.5 rounded-md font-semibold text-slate-800">
                            {shop.category}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600">
                          <p className="font-semibold text-slate-800">{shop.area}</p>
                          <p className="text-[11px] text-slate-400">{shop.address}, {shop.pincode}</p>
                        </td>
                        <td className="p-3.5">
                          <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-lg">
                            {shop.username || 'n/a'}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                              shop.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : shop.status === 'pending'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : shop.status === 'suspended'
                                ? 'bg-slate-150 text-slate-700 border border-slate-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}
                          >
                            {shop.status === 'pending' ? 'Pending Approval' : shop.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {shop.status === 'pending' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => adminApproveShop(shop.id)}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer transition-all active:scale-95"
                                  title="Approve Shop Registration"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => adminRejectShop(shop.id, 'Store documentation verification failed')}
                                  className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                                  title="Reject Registration"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Reject</span>
                                </button>
                              </>
                            )}

                            {shop.status === 'active' && (
                              <button
                                type="button"
                                onClick={() => adminSuspendShop(shop.id)}
                                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                              >
                                Suspend
                              </button>
                            )}

                            {shop.status === 'suspended' && (
                              <button
                                type="button"
                                onClick={() => adminActivateShop(shop.id)}
                                className="px-2.5 py-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs cursor-pointer"
                              >
                                Re-Activate
                              </button>
                            )}

                            {shop.status === 'rejected' && (
                              <button
                                type="button"
                                onClick={() => adminApproveShop(shop.id)}
                                className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs cursor-pointer"
                              >
                                Re-Approve
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Delivery Partners Management & Approvals */}
      {activeTab === 'riders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative max-w-md flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={riderSearch}
                onChange={(e) => setRiderSearch(e.target.value)}
                placeholder="Search by rider name, phone, vehicle number..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            {/* Status Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setRiderFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  riderFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({deliveryPartners.length})
              </button>
              <button
                type="button"
                onClick={() => setRiderFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                  riderFilter === 'pending'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>Pending ({deliveryPartners.filter((dp) => dp.approvalStatus === 'pending').length})</span>
              </button>
              <button
                type="button"
                onClick={() => setRiderFilter('active')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  riderFilter === 'active'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-900 hover:bg-blue-200'
                }`}
              >
                Approved ({deliveryPartners.filter((dp) => dp.approvalStatus === 'active').length})
              </button>
              <button
                type="button"
                onClick={() => setRiderFilter('suspended')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  riderFilter === 'suspended'
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Suspended ({deliveryPartners.filter((dp) => dp.approvalStatus === 'suspended').length})
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Rider Details</th>
                    <th className="p-3.5">Vehicle & Number</th>
                    <th className="p-3.5">Preferred Area</th>
                    <th className="p-3.5">Username</th>
                    <th className="p-3.5">Approval Status</th>
                    <th className="p-3.5 text-right">Approval Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRiders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        No delivery partners found matching the filter.
                      </td>
                    </tr>
                  ) : (
                    filteredRiders.map((partner) => (
                      <tr key={partner.id} className="hover:bg-slate-50/50">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={partner.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                              alt={partner.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                            />
                            <div>
                              <p className="font-bold text-slate-900 text-[13px]">{partner.name}</p>
                              <p className="text-[11px] text-slate-500">{partner.phone}</p>
                              {partner.email && (
                                <p className="text-[10px] text-slate-400">{partner.email}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-slate-800 block">
                            {partner.vehicleType}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">
                            {partner.vehicleNumber}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600 font-medium">
                          {partner.preferredArea || 'Koramangala & HSR'}
                        </td>
                        <td className="p-3.5">
                          <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg">
                            {partner.username || 'n/a'}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                              partner.approvalStatus === 'active'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : partner.approvalStatus === 'pending'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : partner.approvalStatus === 'suspended'
                                ? 'bg-slate-150 text-slate-700 border border-slate-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}
                          >
                            {partner.approvalStatus === 'pending' ? 'Pending Approval' : partner.approvalStatus}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {partner.approvalStatus === 'pending' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => adminApproveDeliveryPartner(partner.id)}
                                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer transition-all active:scale-95"
                                  title="Approve Rider Application"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => adminRejectDeliveryPartner(partner.id, 'Vehicle documentation mismatch')}
                                  className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                                  title="Reject Application"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Reject</span>
                                </button>
                              </>
                            )}

                            {partner.approvalStatus === 'active' && (
                              <button
                                type="button"
                                onClick={() => adminSuspendDeliveryPartner(partner.id)}
                                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                              >
                                Suspend
                              </button>
                            )}

                            {partner.approvalStatus === 'suspended' && (
                              <button
                                type="button"
                                onClick={() => adminActivateDeliveryPartner(partner.id)}
                                className="px-2.5 py-1 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold text-xs cursor-pointer"
                              >
                                Re-Activate
                              </button>
                            )}

                            {partner.approvalStatus === 'rejected' && (
                              <button
                                type="button"
                                onClick={() => adminApproveDeliveryPartner(partner.id)}
                                className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs cursor-pointer"
                              >
                                Re-Approve
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Delivery Zones */}
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

      {/* TAB 5: Orders Audit */}
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

