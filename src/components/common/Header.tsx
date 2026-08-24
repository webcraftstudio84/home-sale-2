import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  MapPin,
  Search,
  ShoppingBag,
  User,
  ChevronDown,
  Store,
  Bike,
  Shield,
  UserCheck,
  X,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Header: React.FC = () => {
  const {
    location,
    setIsLocationModalOpen,
    cart,
    setIsCartDrawerOpen,
    currentUser,
    currentRole,
    switchRole,
    setIsAuthModalOpen,
    setAuthModalMode,
    customerView,
    setCustomerView,
    searchQuery,
    setSearchQuery,
    products,
    shops,
    setSelectedProduct,
    setSelectedShopId,
  } = useApp();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalCartItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  // Search Results
  const matchingShops = searchQuery.trim()
    ? shops.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3)
    : [];

  const matchingProducts = searchQuery.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  const handleSelectSearchedShop = (shopId: string) => {
    setSelectedShopId(shopId);
    setCustomerView('shop-details');
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  const handleSelectSearchedProduct = (product: any) => {
    setSelectedProduct(product);
    setIsSearchFocused(false);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'shopkeeper':
        return { label: 'Shopkeeper', bg: 'bg-amber-100 text-amber-800 border-amber-300', icon: Store };
      case 'delivery':
        return { label: 'Delivery Partner', bg: 'bg-blue-100 text-blue-800 border-blue-300', icon: Bike };
      case 'admin':
        return { label: 'Admin', bg: 'bg-purple-100 text-purple-800 border-purple-300', icon: Shield };
      default:
        return { label: 'Customer', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: UserCheck };
    }
  };

  const currentRoleInfo = getRoleBadge(currentRole);
  const RoleIcon = currentRoleInfo.icon;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro banner for Hyperlocal Guarantee */}
      <div className="bg-slate-900 text-slate-200 text-[11px] font-medium py-1 px-4 text-center flex items-center justify-center gap-2 border-b border-slate-800">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>
          <strong className="text-white">HOMESALE</strong> • Neighborhood stores & fresh essentials delivered in 15–30 mins!
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => {
                if (currentRole === 'customer') {
                  setCustomerView('home');
                  setSelectedShopId(null);
                }
              }}
              className="flex items-center gap-2.5 group text-left cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 group-hover:bg-emerald-700 text-white flex items-center justify-center shadow-sm transition-all">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight leading-none flex items-center gap-1">
                  HOMESALE
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[10px] text-slate-500 block tracking-wider font-semibold uppercase leading-tight">
                  Local Marketplace
                </span>
              </div>
            </button>

            {/* Location Selector (Customer view) */}
            {currentRole === 'customer' && (
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="hidden md:flex items-center gap-2 py-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100 hover:border-slate-300 transition-all text-xs text-left group"
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                  location.isDeliverable ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 max-w-[150px]">
                  <p className="font-bold text-slate-900 truncate leading-tight group-hover:text-emerald-700">
                    {location.area}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate leading-tight">
                    {location.pincode} • {location.isDeliverable ? 'Deliverable' : 'Unavailable'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
              </button>
            )}
          </div>

          {/* Search Bar (Customer Mode) */}
          {currentRole === 'customer' ? (
            <div ref={searchContainerRef} className="flex-1 max-w-lg relative hidden sm:block">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search for groceries, shops, milk, fruits, medicines..."
                  className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-100/90 border border-slate-200/80 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Instant Search Dropdown */}
              <AnimatePresence>
                {isSearchFocused && searchQuery.trim().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 p-2 space-y-3"
                  >
                    {matchingShops.length === 0 && matchingProducts.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">
                        No shops or products match "{searchQuery}"
                      </div>
                    ) : (
                      <>
                        {matchingShops.length > 0 && (
                          <div>
                            <p className="text-[10px] font-bold uppercase text-slate-400 px-2.5 mb-1 tracking-wider">
                              Shops
                            </p>
                            <div className="space-y-1">
                              {matchingShops.map((shop) => (
                                <button
                                  key={shop.id}
                                  type="button"
                                  onClick={() => handleSelectSearchedShop(shop.id)}
                                  className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors text-xs"
                                >
                                  <img
                                    src={shop.logo}
                                    alt={shop.name}
                                    className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-900 truncate">{shop.name}</p>
                                    <p className="text-[11px] text-slate-500 truncate">
                                      {shop.category} • {shop.area}
                                    </p>
                                  </div>
                                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {matchingProducts.length > 0 && (
                          <div className="border-t border-slate-100 pt-2">
                            <p className="text-[10px] font-bold uppercase text-slate-400 px-2.5 mb-1 tracking-wider">
                              Products
                            </p>
                            <div className="space-y-1">
                              {matchingProducts.map((prod) => (
                                <button
                                  key={prod.id}
                                  type="button"
                                  onClick={() => handleSelectSearchedProduct(prod)}
                                  className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors text-xs"
                                >
                                  <img
                                    src={prod.image}
                                    alt={prod.name}
                                    className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-900 truncate">{prod.name}</p>
                                    <p className="text-[11px] text-slate-500">
                                      {prod.unit} • <span className="font-bold text-emerald-700">₹{prod.price}</span>
                                    </p>
                                  </div>
                                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                    View
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex-1 text-center sm:text-left">
              <span className="text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                Active Portal: {currentRoleInfo.label} Management
              </span>
            </div>
          )}

          {/* Right Navigation & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Demo Role Switcher Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className={`flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl border text-xs font-bold transition-all shadow-xs ${currentRoleInfo.bg}`}
              >
                <RoleIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{currentRoleInfo.label}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {/* Role Dropdown */}
              <AnimatePresence>
                {isRoleMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 5 }}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 p-1.5 space-y-1"
                  >
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Switch Demo Role</p>
                      <p className="text-xs text-slate-600 font-medium">Test multi-role workflows</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        switchRole('customer');
                        setIsRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-left transition-colors ${
                        currentRole === 'customer' ? 'bg-emerald-50 text-emerald-800' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span>Customer App</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        switchRole('shopkeeper');
                        setIsRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-left transition-colors ${
                        currentRole === 'shopkeeper' ? 'bg-amber-50 text-amber-800' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Store className="w-4 h-4 text-amber-600" />
                      <span>Shopkeeper Dashboard</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        switchRole('delivery');
                        setIsRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-left transition-colors ${
                        currentRole === 'delivery' ? 'bg-blue-50 text-blue-800' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Bike className="w-4 h-4 text-blue-600" />
                      <span>Delivery Partner App</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        switchRole('admin');
                        setIsRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-left transition-colors ${
                        currentRole === 'admin' ? 'bg-purple-50 text-purple-800' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Shield className="w-4 h-4 text-purple-600" />
                      <span>Admin Management</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart Button (Customer Role) */}
            {currentRole === 'customer' && (
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative flex items-center gap-2 py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-xs text-xs cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {totalCartItems > 0 && (
                  <span className="bg-white text-emerald-800 font-extrabold text-[11px] px-1.5 py-0.2 rounded-full min-w-[20px] text-center shadow-2xs">
                    {totalCartItems}
                  </span>
                )}
              </button>
            )}

            {/* User Profile / Login */}
            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  if (currentRole === 'customer') {
                    setCustomerView('profile');
                  }
                }}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
                title={currentUser.name}
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-xl object-cover border border-slate-200 shadow-xs"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <span className="hidden lg:inline text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                  {currentUser.name}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 border border-emerald-600/30 px-3 py-1.5 rounded-xl hover:bg-emerald-50 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Location Selector Row */}
        {currentRole === 'customer' && (
          <div className="md:hidden pb-2.5 pt-1 flex items-center justify-between gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 text-xs text-slate-800 font-medium truncate flex-1"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-bold truncate">{location.area}</span>
              <span className="text-slate-400">({location.pincode})</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                location.isDeliverable
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {location.isDeliverable ? 'Delivering' : 'Unavailable'}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
