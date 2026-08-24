import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DeliveryZone, Shop, DeliveryPartner, User } from '../../types';
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
  Edit2,
  DollarSign,
  PieChart,
  BarChart3,
  Layers,
  Settings,
  CreditCard,
  UserCheck,
  CheckSquare,
  KeyRound,
  FileText,
  Sliders,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    shops,
    products,
    orders,
    deliveryZones,
    deliveryPartners,
    adminAddShop,
    adminEditShop,
    adminDeleteShop,
    adminAssignShopkeeper,
    adminAddDeliveryZone,
    adminUpdateDeliveryZone,
    adminDeleteDeliveryZone,
    adminAddDeliveryPartner,
    adminUpdateDeliveryPartner,
    adminDeleteDeliveryPartner,
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

  const [activeTab, setActiveTab] = useState<
    'overview' | 'shops' | 'shopkeepers' | 'customers' | 'riders' | 'orders' | 'transactions' | 'reports' | 'zones' | 'settings'
  >('overview');

  // Filters & searches
  const [shopFilter, setShopFilter] = useState<'all' | 'pending' | 'active' | 'suspended' | 'rejected'>('all');
  const [riderFilter, setRiderFilter] = useState<'all' | 'pending' | 'active' | 'suspended' | 'rejected'>('all');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [shopSearch, setShopSearch] = useState('');
  const [shopkeeperSearch, setShopkeeperSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [riderSearch, setRiderSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Modals state
  const [isAddShopModalOpen, setIsAddShopModalOpen] = useState(false);
  const [isEditShopModalOpen, setIsEditShopModalOpen] = useState(false);
  const [selectedShopForEdit, setSelectedShopForEdit] = useState<Shop | null>(null);

  const [isAssignShopkeeperModalOpen, setIsAssignShopkeeperModalOpen] = useState(false);
  const [selectedShopForAssignment, setSelectedShopForAssignment] = useState<Shop | null>(null);

  const [isAddRiderModalOpen, setIsAddRiderModalOpen] = useState(false);
  const [isEditRiderModalOpen, setIsEditRiderModalOpen] = useState(false);
  const [selectedRiderForEdit, setSelectedRiderForEdit] = useState<DeliveryPartner | null>(null);

  // New Shop Form State
  const [newShopName, setNewShopName] = useState('');
  const [newShopCategory, setNewShopCategory] = useState('Grocery & Kirana');
  const [newShopTagline, setNewShopTagline] = useState('');
  const [newShopAddress, setNewShopAddress] = useState('');
  const [newShopArea, setNewShopArea] = useState('Koramangala');
  const [newShopCity, setNewShopCity] = useState('Bengaluru');
  const [newShopPincode, setNewShopPincode] = useState('560034');
  const [newShopPhone, setNewShopPhone] = useState('');
  const [newShopOpeningTime, setNewShopOpeningTime] = useState('07:00 AM');
  const [newShopClosingTime, setNewShopClosingTime] = useState('10:00 PM');
  const [newShopDeliveryCharge, setNewShopDeliveryCharge] = useState('25');
  const [newShopLogo, setNewShopLogo] = useState('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80');
  const [newShopBanner, setNewShopBanner] = useState('https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1000&q=80');
  // Initial shopkeeper credentials for new shop
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newOwnerPhone, setNewOwnerPhone] = useState('');
  const [newOwnerEmail, setNewOwnerEmail] = useState('');
  const [newOwnerUsername, setNewOwnerUsername] = useState('');
  const [newOwnerPassword, setNewOwnerPassword] = useState('shop@123');

  // Assign shopkeeper form state
  const [assignName, setAssignName] = useState('');
  const [assignPhone, setAssignPhone] = useState('');
  const [assignEmail, setAssignEmail] = useState('');
  const [assignUsername, setAssignUsername] = useState('');
  const [assignPassword, setAssignPassword] = useState('shop@123');

  // Add Rider Form State
  const [newRiderName, setNewRiderName] = useState('');
  const [newRiderPhone, setNewRiderPhone] = useState('');
  const [newRiderEmail, setNewRiderEmail] = useState('');
  const [newRiderVehicleType, setNewRiderVehicleType] = useState<'Bike' | 'Scooter' | 'Bicycle' | 'EV'>('Bike');
  const [newRiderVehicleNumber, setNewRiderVehicleNumber] = useState('KA-01-AB-1234');
  const [newRiderPreferredArea, setNewRiderPreferredArea] = useState('Koramangala & HSR');
  const [newRiderUsername, setNewRiderUsername] = useState('');
  const [newRiderPassword, setNewRiderPassword] = useState('rider@123');

  // Edit Rider Form State
  const [editRiderName, setEditRiderName] = useState('');
  const [editRiderPhone, setEditRiderPhone] = useState('');
  const [editRiderVehicleType, setEditRiderVehicleType] = useState<'Bike' | 'Scooter' | 'Bicycle' | 'EV'>('Bike');
  const [editRiderVehicleNumber, setEditRiderVehicleNumber] = useState('');
  const [editRiderPreferredArea, setEditRiderPreferredArea] = useState('');

  // New Zone Form State
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneCity, setNewZoneCity] = useState('Bengaluru');
  const [newZonePincodes, setNewZonePincodes] = useState('');
  const [newZoneDeliveryFee, setNewZoneDeliveryFee] = useState('25');

  // Counts & Calculations
  const pendingShopsCount = shops.filter((s) => s.status === 'pending').length;
  const pendingRidersCount = deliveryPartners.filter((dp) => dp.approvalStatus === 'pending').length;
  const activeShopsCount = shops.filter((s) => s.status === 'active').length;
  const activeRidersCount = deliveryPartners.filter((dp) => dp.approvalStatus === 'active').length;

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

  // Lists of users by role
  const shopkeeperUsers = users.filter((u) => u.role === 'shopkeeper');
  const customerUsers = users.filter((u) => u.role === 'customer');

  // Add Zone Handler
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

  // Add Shop Handler
  const handleCreateShop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShopName || !newShopPhone || !newShopAddress) return;

    adminAddShop({
      name: newShopName,
      category: newShopCategory,
      tagline: newShopTagline || `Best ${newShopCategory} in ${newShopArea}`,
      description: `Verified merchant in ${newShopArea}, providing fresh goods and fast doorstep delivery.`,
      address: newShopAddress,
      area: newShopArea,
      city: newShopCity,
      pincode: newShopPincode,
      phone: newShopPhone,
      openingTime: newShopOpeningTime,
      closingTime: newShopClosingTime,
      deliveryCharge: parseFloat(newShopDeliveryCharge) || 25,
      logo: newShopLogo,
      banner: newShopBanner,
      assignedShopkeeper: newOwnerUsername
        ? {
            name: newOwnerName || `${newShopName} Owner`,
            phone: newOwnerPhone || newShopPhone,
            email: newOwnerEmail || `${newOwnerUsername}@homesale.in`,
            username: newOwnerUsername,
            password: newOwnerPassword,
          }
        : undefined,
    });

    setIsAddShopModalOpen(false);
    // Reset
    setNewShopName('');
    setNewShopPhone('');
    setNewShopAddress('');
    setNewOwnerName('');
    setNewOwnerUsername('');
  };

  // Edit Shop Save Handler
  const handleSaveEditedShop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShopForEdit) return;

    adminEditShop(selectedShopForEdit.id, {
      name: selectedShopForEdit.name,
      category: selectedShopForEdit.category,
      tagline: selectedShopForEdit.tagline,
      address: selectedShopForEdit.address,
      area: selectedShopForEdit.area,
      phone: selectedShopForEdit.phone,
      openingTime: selectedShopForEdit.openingTime,
      closingTime: selectedShopForEdit.closingTime,
      deliveryCharge: selectedShopForEdit.deliveryCharge,
    });

    setIsEditShopModalOpen(false);
    setSelectedShopForEdit(null);
  };

  // Assign Shopkeeper Handler
  const handleSaveAssignShopkeeper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShopForAssignment || !assignUsername || !assignName) return;

    adminAssignShopkeeper(selectedShopForAssignment.id, {
      name: assignName,
      phone: assignPhone || selectedShopForAssignment.phone,
      email: assignEmail || `${assignUsername}@homesale.in`,
      username: assignUsername,
      password: assignPassword,
    });

    setIsAssignShopkeeperModalOpen(false);
    setSelectedShopForAssignment(null);
    setAssignName('');
    setAssignUsername('');
  };

  // Add Delivery Partner Handler
  const handleCreateRider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRiderName || !newRiderPhone || !newRiderUsername) return;

    adminAddDeliveryPartner({
      name: newRiderName,
      phone: newRiderPhone,
      email: newRiderEmail || `${newRiderUsername}@rider.homesale.in`,
      vehicleType: newRiderVehicleType,
      vehicleNumber: newRiderVehicleNumber,
      preferredArea: newRiderPreferredArea,
      username: newRiderUsername,
      password: newRiderPassword,
    });

    setIsAddRiderModalOpen(false);
    setNewRiderName('');
    setNewRiderPhone('');
    setNewRiderUsername('');
  };

  // Save Edited Rider Handler
  const handleSaveEditedRider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRiderForEdit) return;

    adminUpdateDeliveryPartner(selectedRiderForEdit.id, {
      name: editRiderName,
      phone: editRiderPhone,
      vehicleType: editRiderVehicleType,
      vehicleNumber: editRiderVehicleNumber,
      preferredArea: editRiderPreferredArea,
    });

    setIsEditRiderModalOpen(false);
    setSelectedRiderForEdit(null);
  };

  // Filtered queries
  const filteredShops = shops.filter((s) => {
    const matchesFilter = shopFilter === 'all' || s.status === shopFilter;
    const matchesSearch =
      !shopSearch ||
      s.name.toLowerCase().includes(shopSearch.toLowerCase()) ||
      s.area.toLowerCase().includes(shopSearch.toLowerCase()) ||
      (s.ownerName && s.ownerName.toLowerCase().includes(shopSearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const filteredShopkeepers = shopkeeperUsers.filter((u) => {
    const linkedShop = shops.find((s) => s.id === u.shopId || s.ownerId === u.id);
    return (
      !shopkeeperSearch ||
      u.name.toLowerCase().includes(shopkeeperSearch.toLowerCase()) ||
      (u.username && u.username.toLowerCase().includes(shopkeeperSearch.toLowerCase())) ||
      u.phone.includes(shopkeeperSearch) ||
      (linkedShop && linkedShop.name.toLowerCase().includes(shopkeeperSearch.toLowerCase()))
    );
  });

  const filteredCustomers = customerUsers.filter((u) => {
    return (
      !customerSearch ||
      u.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      (u.username && u.username.toLowerCase().includes(customerSearch.toLowerCase())) ||
      u.phone.includes(customerSearch)
    );
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

  const filteredOrders = orders.filter((o) => {
    const matchesFilter =
      orderFilter === 'all' ||
      (orderFilter === 'pending' && (o.orderStatus === 'Order Placed' || o.orderStatus === 'Shopkeeper Accepted' || o.orderStatus === 'Preparing')) ||
      (orderFilter === 'ready' && o.orderStatus === 'Ready for Pickup') ||
      (orderFilter === 'transit' && (o.orderStatus === 'Delivery Partner Assigned' || o.orderStatus === 'Picked Up' || o.orderStatus === 'Out for Delivery')) ||
      (orderFilter === 'delivered' && o.orderStatus === 'Delivered') ||
      (orderFilter === 'cancelled' && (o.orderStatus === 'Cancelled' || o.orderStatus === 'Rejected'));

    const matchesSearch =
      !orderSearch ||
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.shopName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-16">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center shadow-lg shrink-0">
            <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">HOMESALE Admin Console</h2>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-900/80 border border-purple-700 text-purple-300">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Platform Governance, Shop Registration, Fleet Management & Transaction Auditing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => {
              logoutUser();
              setAuthView(null);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 border border-slate-700 hover:border-rose-700 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Logout Admin</span>
          </button>
        </div>
      </div>

      {/* Pending Approvals Alert Banner */}
      {(pendingShopsCount > 0 || pendingRidersCount > 0) && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-900">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold text-sm text-amber-950">Action Required: Pending Platform Approvals</p>
              <p className="text-[11px] text-amber-800">
                {pendingShopsCount > 0 && `${pendingShopsCount} new shop registration(s)`}
                {pendingShopsCount > 0 && pendingRidersCount > 0 && ' and '}
                {pendingRidersCount > 0 && `${pendingRidersCount} delivery rider application(s)`} waiting for your verification.
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

      {/* 10 Navigation Tabs (Scrollable on mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'shops', label: 'Shops', icon: Store, count: shops.length, badge: pendingShopsCount },
          { id: 'shopkeepers', label: 'Shopkeepers', icon: KeyRound, count: shopkeeperUsers.length },
          { id: 'customers', label: 'Customers', icon: Users, count: customerUsers.length },
          { id: 'riders', label: 'Riders', icon: Bike, count: deliveryPartners.length, badge: pendingRidersCount },
          { id: 'orders', label: 'Orders', icon: ShoppingBag, count: orders.length },
          { id: 'transactions', label: 'Transactions', icon: CreditCard, count: orders.length },
          { id: 'reports', label: 'Reports', icon: PieChart },
          { id: 'zones', label: 'Zones', icon: MapPin, count: deliveryZones.length },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge ? (
                <span className="bg-amber-400 text-slate-900 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                  {tab.badge}
                </span>
              ) : tab.count !== undefined ? (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === tab.id ? 'bg-purple-800 text-purple-100' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* Analytics KPI Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <p className="text-xs text-slate-500 font-medium">Total Platform GMV</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900">₹{totalGMV}</p>
              <span className="text-[10px] text-emerald-700 font-bold block truncate">
                ₹{totalProductSales} Goods + ₹{totalDeliveryRevenue} Delivery
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">Shops Network</p>
                {pendingShopsCount > 0 && (
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                    {pendingShopsCount} Pending
                  </span>
                )}
              </div>
              <p className="text-xl sm:text-2xl font-black text-slate-900">{shops.length}</p>
              <span className="text-[10px] text-emerald-700 font-bold block">{activeShopsCount} verified active</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">Delivery Fleet</p>
                {pendingRidersCount > 0 && (
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                    {pendingRidersCount} Pending
                  </span>
                )}
              </div>
              <p className="text-xl sm:text-2xl font-black text-blue-700">{deliveryPartners.length}</p>
              <span className="text-[10px] text-slate-500 block">{activeRidersCount} approved partners</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <p className="text-xs text-slate-500 font-medium">Orders Placed</p>
              <p className="text-xl sm:text-2xl font-black text-purple-700">{orders.length}</p>
              <span className="text-[10px] text-slate-400 block">{totalServiceableZones} active zones</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Hyperlocal Shops */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="font-extrabold text-slate-900 text-sm">Top Hyperlocal Stores</h3>
              <div className="space-y-2.5">
                {shops.slice(0, 5).map((shop) => {
                  const shopOrderCount = orders.filter((o) => o.shopId === shop.id).length;
                  return (
                    <div
                      key={shop.id}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={shop.logo} alt={shop.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-slate-900 truncate">{shop.name}</p>
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
                          <p className="text-[11px] text-slate-500 truncate">{shop.category} • {shop.area}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 pl-2">
                        <p className="font-extrabold text-slate-900">{shopOrderCount} orders</p>
                        <span className="text-[10px] text-emerald-700 font-bold">{shop.rating} ★</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Platform Health Rules */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="font-extrabold text-slate-900 text-sm">Platform Business Governance</h3>
              <div className="space-y-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-0.5">
                  <p className="font-bold">Minimum Order Requirement (₹150)</p>
                  <p className="text-[11px] text-emerald-800">Enforced strictly at ₹150 product subtotal before separate delivery fee.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 space-y-0.5">
                  <p className="font-bold">Single-Merchant Cart Isolation</p>
                  <p className="text-[11px] text-blue-800">Carts are restricted to 1 merchant at a time for 15-min delivery speed.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 space-y-0.5">
                  <p className="font-bold">Role-Based Access Enforcement</p>
                  <p className="text-[11px] text-purple-800">Admin controls platform & creation; shopkeepers are strictly locked to their single shop.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SHOPS MANAGEMENT & CREATION */}
      {activeTab === 'shops' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={shopSearch}
                onChange={(e) => setShopSearch(e.target.value)}
                placeholder="Search by shop name, area, owner..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddShopModalOpen(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Shop</span>
              </button>
            </div>
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'all', label: `All (${shops.length})` },
              { id: 'pending', label: `Pending (${shops.filter((s) => s.status === 'pending').length})`, icon: Clock },
              { id: 'active', label: `Active (${shops.filter((s) => s.status === 'active').length})` },
              { id: 'suspended', label: `Suspended (${shops.filter((s) => s.status === 'suspended').length})` },
              { id: 'rejected', label: `Rejected (${shops.filter((s) => s.status === 'rejected').length})` },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setShopFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1 ${
                  shopFilter === f.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {f.icon && <f.icon className="w-3 h-3 text-amber-500" />}
                <span>{f.label}</span>
              </button>
            ))}
          </div>

          {/* Shops Mobile Cards & Desktop Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredShops.map((shop) => (
              <div
                key={shop.id}
                className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={shop.logo} alt={shop.name} className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-slate-100" />
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-slate-900 text-sm truncate">{shop.name}</h4>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {shop.category}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                        shop.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : shop.status === 'pending'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {shop.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                    <p className="truncate">
                      <strong className="text-slate-800">Owner:</strong> {shop.ownerName || 'Merchant'} ({shop.phone})
                    </p>
                    <p className="truncate">
                      <strong className="text-slate-800">Area:</strong> {shop.area} ({shop.pincode})
                    </p>
                    <p className="truncate">
                      <strong className="text-slate-800">Login:</strong> <span className="font-mono">{shop.username || 'n/a'}</span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5 text-xs">
                  <div className="flex items-center gap-1">
                    {shop.status === 'pending' && (
                      <>
                        <button
                          type="button"
                          onClick={() => adminApproveShop(shop.id)}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => adminRejectShop(shop.id, 'Documents mismatch')}
                          className="px-2 py-1 bg-rose-50 text-rose-700 rounded-lg font-bold text-[11px] cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {shop.status === 'active' && (
                      <button
                        type="button"
                        onClick={() => adminSuspendShop(shop.id)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] cursor-pointer"
                      >
                        Suspend
                      </button>
                    )}
                    {shop.status === 'suspended' && (
                      <button
                        type="button"
                        onClick={() => adminActivateShop(shop.id)}
                        className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-[11px] cursor-pointer"
                      >
                        Activate
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedShopForAssignment(shop);
                        setAssignName(shop.ownerName || '');
                        setAssignPhone(shop.phone || '');
                        setAssignUsername(shop.username || '');
                        setIsAssignShopkeeperModalOpen(true);
                      }}
                      className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg cursor-pointer"
                      title="Assign / Change Shopkeeper"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedShopForEdit(shop);
                        setIsEditShopModalOpen(true);
                      }}
                      className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                      title="Edit Shop Details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => adminDeleteShop(shop.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                      title="Delete Shop"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SHOPKEEPERS LIST & ASSIGNMENT */}
      {activeTab === 'shopkeepers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={shopkeeperSearch}
                onChange={(e) => setShopkeeperSearch(e.target.value)}
                placeholder="Search by shopkeeper name, username, shop..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
            <p className="text-xs text-slate-500 font-semibold">
              Total Assigned Shopkeepers: {shopkeeperUsers.length}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredShopkeepers.map((user) => {
              const linkedShop = shops.find((s) => s.id === user.shopId || s.ownerId === user.id);
              return (
                <div
                  key={user.id}
                  className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">
                      <Store className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-extrabold text-slate-900 text-xs truncate">{user.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{user.phone} • {user.email || 'No email'}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Assigned Shop:</span>
                      <span className="font-bold text-slate-900 truncate max-w-[140px]">
                        {linkedShop ? linkedShop.name : 'Unassigned'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Username:</span>
                      <span className="font-mono font-bold text-slate-800">{user.username || 'n/a'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Password:</span>
                      <span className="font-mono text-slate-500 tracking-widest font-bold">••••••••</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOMERS DIRECTORY */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="Search registered customers..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
            <p className="text-xs text-slate-500 font-semibold">
              Total Customers: {customerUsers.length}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredCustomers.map((c) => {
              const customerOrders = orders.filter((o) => o.customerId === c.id);
              return (
                <div key={c.id} className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-800 font-bold flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-extrabold text-slate-900 text-xs truncate">{c.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{c.phone} • {c.email || 'No email'}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Username:</span>
                      <span className="font-mono font-bold text-slate-800">{c.username || c.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Orders Placed:</span>
                      <span className="font-bold text-emerald-700">{customerOrders.length} orders</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Password:</span>
                      <span className="font-mono text-slate-500 tracking-widest font-bold">••••••••</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: RIDERS (DELIVERY PARTNERS) */}
      {activeTab === 'riders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={riderSearch}
                onChange={(e) => setRiderSearch(e.target.value)}
                placeholder="Search riders by name, vehicle, phone..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsAddRiderModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Delivery Partner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredRiders.map((rider) => (
              <div
                key={rider.id}
                className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0">
                        <Bike className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-slate-900 text-xs truncate">{rider.name}</h4>
                        <p className="text-[11px] text-slate-500 truncate">{rider.vehicleType} • {rider.vehicleNumber}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                        rider.approvalStatus === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rider.approvalStatus === 'pending'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {rider.approvalStatus}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-xs space-y-1 text-slate-600">
                    <p className="truncate">
                      <strong className="text-slate-800">Phone:</strong> {rider.phone}
                    </p>
                    <p className="truncate">
                      <strong className="text-slate-800">Area:</strong> {rider.preferredArea || 'Koramangala'}
                    </p>
                    <p className="truncate">
                      <strong className="text-slate-800">Deliveries:</strong> {rider.totalDeliveries} orders ({rider.rating} ★)
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5 text-xs">
                  <div className="flex items-center gap-1">
                    {rider.approvalStatus === 'pending' && (
                      <>
                        <button
                          type="button"
                          onClick={() => adminApproveDeliveryPartner(rider.id)}
                          className="px-2.5 py-1 bg-blue-600 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => adminRejectDeliveryPartner(rider.id, 'Document check failed')}
                          className="px-2 py-1 bg-rose-50 text-rose-700 rounded-lg font-bold text-[11px] cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {rider.approvalStatus === 'active' && (
                      <button
                        type="button"
                        onClick={() => adminSuspendDeliveryPartner(rider.id)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] cursor-pointer"
                      >
                        Suspend
                      </button>
                    )}
                    {rider.approvalStatus === 'suspended' && (
                      <button
                        type="button"
                        onClick={() => adminActivateDeliveryPartner(rider.id)}
                        className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg font-bold text-[11px] cursor-pointer"
                      >
                        Activate
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRiderForEdit(rider);
                        setEditRiderName(rider.name);
                        setEditRiderPhone(rider.phone);
                        setEditRiderVehicleType(rider.vehicleType);
                        setEditRiderVehicleNumber(rider.vehicleNumber);
                        setEditRiderPreferredArea(rider.preferredArea || '');
                        setIsEditRiderModalOpen(true);
                      }}
                      className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                      title="Edit Rider"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => adminDeleteDeliveryPartner(rider.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                      title="Delete Rider"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: ORDERS AUDIT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search by order #, shop, customer..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['all', 'pending', 'ready', 'transit', 'delivered', 'cancelled'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setOrderFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors whitespace-nowrap cursor-pointer ${
                    orderFilter === f ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredOrders.map((o) => (
              <div key={o.id} className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-slate-900 text-sm">{o.orderNumber}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-800">
                        {o.shopName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Customer: <strong>{o.customerName}</strong> ({o.customerPhone}) • {o.deliveryAddress.area}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                        o.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : o.orderStatus === 'Cancelled' || o.orderStatus === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {o.orderStatus}
                    </span>
                    <p className="font-black text-slate-900 text-xs mt-1">Total: ₹{o.grandTotal}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                  <p>
                    Items: {o.items.map((it) => `${it.quantity}x ${it.productName}`).join(', ')}
                  </p>
                  <p>
                    Rider: <strong className="text-slate-800">{o.deliveryPartnerName || 'Unassigned'}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: TRANSACTIONS */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100">
            {orders.map((o) => (
              <div key={o.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{o.orderNumber}</span>
                    <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md text-[10px]">
                      {o.paymentMethod}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    {o.shopName} → {o.customerName}
                  </p>
                  <p className="text-[11px] text-slate-400">{new Date(o.createdAt).toLocaleString()}</p>
                </div>

                <div className="text-right flex items-center gap-4">
                  <div>
                    <p className="text-slate-400 text-[10px]">Goods: ₹{o.productSubtotal} + Del: ₹{o.deliveryCharge}</p>
                    <p className="font-black text-slate-900 text-sm">₹{o.grandTotal}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    Paid
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
              <p className="text-xs text-slate-500 font-medium">Platform GMV Volume</p>
              <p className="text-2xl font-black text-slate-900">₹{totalGMV}</p>
              <p className="text-[10px] text-emerald-700 font-bold">100% completed order value</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
              <p className="text-xs text-slate-500 font-medium">Average Order Basket</p>
              <p className="text-2xl font-black text-slate-900">
                ₹{orders.length > 0 ? Math.round(totalGMV / orders.length) : 0}
              </p>
              <p className="text-[10px] text-slate-400">Average ticket size</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
              <p className="text-xs text-slate-500 font-medium">Active Merchant Network</p>
              <p className="text-2xl font-black text-slate-900">{activeShopsCount}</p>
              <p className="text-[10px] text-slate-400">Serving active orders</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: DELIVERY ZONES */}
      {activeTab === 'zones' && (
        <div className="space-y-5">
          <form onSubmit={handleAddZone} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm">Add New Serviceable Delivery Zone</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                required
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                placeholder="Zone (e.g. Koramangala Cluster)"
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
                placeholder="Pincodes comma separated"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {deliveryZones.map((zone) => (
              <div
                key={zone.id}
                className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">{zone.name}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.2 rounded-full ${
                        zone.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {zone.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    {zone.city} • Pincodes: <span className="font-mono">{zone.pincodes.join(', ')}</span>
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Fee: ₹{zone.standardDeliveryCharge} • Min: ₹{zone.minimumOrderAmount}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => adminUpdateDeliveryZone(zone.id, { isActive: !zone.isActive })}
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

      {/* TAB 10: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4 text-xs">
          <h3 className="font-extrabold text-slate-900 text-base">HOMESALE Platform Policies & Settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <p className="font-bold text-slate-800">Minimum Order Basket Value</p>
              <p className="text-emerald-700 font-black text-sm">₹150.00</p>
              <p className="text-slate-500 text-[11px]">Enforced before proceeding to checkout</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <p className="font-bold text-slate-800">Platform Commission Rate</p>
              <p className="text-purple-700 font-black text-sm">0.0% (Zero Fee Model)</p>
              <p className="text-slate-500 text-[11px]">100% of product subtotal goes directly to merchant</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW SHOP */}
      <AnimatePresence>
        {isAddShopModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-xl shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base">Register New Merchant Shop</h3>
                <button type="button" onClick={() => setIsAddShopModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateShop} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Shop Name</label>
                    <input
                      type="text"
                      required
                      value={newShopName}
                      onChange={(e) => setNewShopName(e.target.value)}
                      placeholder="e.g. Green Valley Organic Fresh"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Category</label>
                    <select
                      value={newShopCategory}
                      onChange={(e) => setNewShopCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white font-medium"
                    >
                      <option value="Grocery & Kirana">Grocery & Kirana</option>
                      <option value="Fruits & Vegetables">Fruits & Vegetables</option>
                      <option value="Dairy & Eggs">Dairy & Eggs</option>
                      <option value="Bakery & Snacks">Bakery & Snacks</option>
                      <option value="Pharmacy & Wellness">Pharmacy & Wellness</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Personal Care">Personal Care</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Area</label>
                    <input
                      type="text"
                      required
                      value={newShopArea}
                      onChange={(e) => setNewShopArea(e.target.value)}
                      placeholder="Koramangala"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={newShopCity}
                      onChange={(e) => setNewShopCity(e.target.value)}
                      placeholder="Bengaluru"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Pincode</label>
                    <input
                      type="text"
                      required
                      value={newShopPincode}
                      onChange={(e) => setNewShopPincode(e.target.value)}
                      placeholder="560034"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Street Address</label>
                  <input
                    type="text"
                    required
                    value={newShopAddress}
                    onChange={(e) => setNewShopAddress(e.target.value)}
                    placeholder="e.g. #42, 80 Feet Road, 4th Block"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
                    <input
                      type="text"
                      required
                      value={newShopPhone}
                      onChange={(e) => setNewShopPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Opening Time</label>
                    <input
                      type="text"
                      value={newShopOpeningTime}
                      onChange={(e) => setNewShopOpeningTime(e.target.value)}
                      placeholder="07:00 AM"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Closing Time</label>
                    <input
                      type="text"
                      value={newShopClosingTime}
                      onChange={(e) => setNewShopClosingTime(e.target.value)}
                      placeholder="10:00 PM"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Initial Shopkeeper Assignment */}
                <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2.5">
                  <p className="font-extrabold text-purple-950">Assign Shopkeeper (Manager)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-slate-600 block mb-0.5">Manager Name</label>
                      <input
                        type="text"
                        value={newOwnerName}
                        onChange={(e) => setNewOwnerName(e.target.value)}
                        placeholder="Owner full name"
                        className="w-full px-2.5 py-1.5 border border-purple-200 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 block mb-0.5">Manager Username</label>
                      <input
                        type="text"
                        value={newOwnerUsername}
                        onChange={(e) => setNewOwnerUsername(e.target.value)}
                        placeholder="e.g. greenvalley_owner"
                        className="w-full px-2.5 py-1.5 border border-purple-200 rounded-lg bg-white font-mono"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-slate-600 block mb-0.5">Manager Password</label>
                      <input
                        type="password"
                        value={newOwnerPassword}
                        onChange={(e) => setNewOwnerPassword(e.target.value)}
                        placeholder="shop@123"
                        className="w-full px-2.5 py-1.5 border border-purple-200 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 block mb-0.5">Manager Email</label>
                      <input
                        type="email"
                        value={newOwnerEmail}
                        onChange={(e) => setNewOwnerEmail(e.target.value)}
                        placeholder="owner@homesale.in"
                        className="w-full px-2.5 py-1.5 border border-purple-200 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button type="button" onClick={() => setIsAddShopModalOpen(false)} className="px-4 py-2 text-slate-600 font-semibold cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs cursor-pointer">
                    Create Shop & Assign
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ASSIGN SHOPKEEPER */}
      <AnimatePresence>
        {isAssignShopkeeperModalOpen && selectedShopForAssignment && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Assign Shopkeeper</h3>
                  <p className="text-xs text-slate-500">For {selectedShopForAssignment.name}</p>
                </div>
                <button type="button" onClick={() => setIsAssignShopkeeperModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAssignShopkeeper} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Shopkeeper Name</label>
                  <input
                    type="text"
                    required
                    value={assignName}
                    onChange={(e) => setAssignName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Username (Login ID)</label>
                  <input
                    type="text"
                    required
                    value={assignUsername}
                    onChange={(e) => setAssignUsername(e.target.value)}
                    placeholder="e.g. store_owner_1"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={assignPassword}
                    onChange={(e) => setAssignPassword(e.target.value)}
                    placeholder="shop@123"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button type="button" onClick={() => setIsAssignShopkeeperModalOpen(false)} className="px-4 py-2 text-slate-600 font-semibold cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs cursor-pointer">
                    Save Assignment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD DELIVERY PARTNER */}
      <AnimatePresence>
        {isAddRiderModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base">Add Delivery Partner</h3>
                <button type="button" onClick={() => setIsAddRiderModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRider} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Rider Full Name</label>
                    <input
                      type="text"
                      required
                      value={newRiderName}
                      onChange={(e) => setNewRiderName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={newRiderPhone}
                      onChange={(e) => setNewRiderPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Vehicle Type</label>
                    <select
                      value={newRiderVehicleType}
                      onChange={(e) => setNewRiderVehicleType(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white font-medium"
                    >
                      <option value="Bike">Motorcycle</option>
                      <option value="Scooter">Scooter</option>
                      <option value="EV">Electric Vehicle (EV)</option>
                      <option value="Bicycle">Bicycle</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Vehicle Number</label>
                    <input
                      type="text"
                      required
                      value={newRiderVehicleNumber}
                      onChange={(e) => setNewRiderVehicleNumber(e.target.value)}
                      placeholder="KA-01-AB-1234"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Preferred Area</label>
                    <input
                      type="text"
                      value={newRiderPreferredArea}
                      onChange={(e) => setNewRiderPreferredArea(e.target.value)}
                      placeholder="Koramangala"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Login Username</label>
                    <input
                      type="text"
                      required
                      value={newRiderUsername}
                      onChange={(e) => setNewRiderUsername(e.target.value)}
                      placeholder="e.g. rajesh_rider"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={newRiderPassword}
                      onChange={(e) => setNewRiderPassword(e.target.value)}
                      placeholder="rider@123"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button type="button" onClick={() => setIsAddRiderModalOpen(false)} className="px-4 py-2 text-slate-600 font-semibold cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs cursor-pointer">
                    Register Rider Partner
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
