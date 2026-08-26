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
  Plus,
  Tag,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Header: React.FC = () => {
  const {
    location,
    setIsLocationModalOpen,
    cart,
    addToCart,
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
    authView,
    setAuthView,
    logoutUser,
  } = useApp();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

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
    ? products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6)
    : [];

  const handleSelectSearchedShop = (shopId: string) => {
    setSelectedShopId(shopId);
    setCustomerView('shop-details');
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
    setSearchQuery('');
  };

  const handleSelectSearchedProduct = (product: any) => {
    setSelectedProduct(product);
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
  };

  const handleAddProductFromSearch = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    addToCart(product, 1);
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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => {
                setAuthView(null);
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
            {currentRole === 'customer' && !authView && (
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

          {/* Search Bar (Customer Mode - Desktop) */}
          {currentRole === 'customer' ? (
            <div ref={searchContainerRef} className="flex-1 max-w-lg relative hidden sm:block">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search products, groceries, milk, fruits, medicines..."
                  className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-100/90 border border-slate-200/80 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900"
                />
                <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
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
                    className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 p-2 space-y-3 max-h-[75vh] overflow-y-auto"
                  >
                    {matchingShops.length === 0 && matchingProducts.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">
                        No shops or products match "{searchQuery}"
                      </div>
                    ) : (
                      <>
                        {matchingProducts.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between px-2.5 mb-1">
                              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                                Products ({matchingProducts.length})
                              </p>
                              <span className="text-[10px] text-emerald-700 font-semibold">Instant Add</span>
                            </div>
                            <div className="space-y-1">
                              {matchingProducts.map((prod) => {
                                const shop = shops.find((s) => s.id === prod.shopId);
                                return (
                                  <div
                                    key={prod.id}
                                    onClick={() => handleSelectSearchedProduct(prod)}
                                    className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors text-xs cursor-pointer group"
                                  >
                                    <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                                      <img
                                        src={prod.image}
                                        alt={prod.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-bold text-slate-900 truncate group-hover:text-emerald-700">
                                        {prod.name}
                                      </p>
                                      <p className="text-[11px] text-slate-500 truncate">
                                        {prod.unit} • <span className="font-extrabold text-emerald-700">₹{prod.price}</span>
                                        {shop && (
                                          <span className="text-slate-400"> • {shop.name}</span>
                                        )}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <button
                                        type="button"
                                        onClick={(e) => handleAddProductFromSearch(e, prod)}
                                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold rounded-lg text-[11px] transition-colors border border-emerald-600/30 flex items-center gap-1"
                                        title="Add to Cart"
                                      >
                                        <Plus className="w-3 h-3" />
                                        <span>Add</span>
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {matchingShops.length > 0 && (
                          <div className="border-t border-slate-100 pt-2">
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
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex-1 min-w-0 text-center sm:text-left px-1 sm:px-2">
              <span className="inline-block max-w-full truncate text-[11px] sm:text-xs md:text-sm font-bold text-slate-700 bg-slate-100 px-2 sm:px-3 py-1 rounded-lg border border-slate-200 align-middle">
                <span className="hidden sm:inline">Active Portal: </span>
                {currentRoleInfo.label}
                <span className="hidden md:inline"> Management</span>
              </span>
            </div>
          )}

          {/* Right Navigation & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Mobile Search Trigger Button (Customer mode) */}
            {currentRole === 'customer' && !authView && (
              <button
                type="button"
                onClick={() => {
                  setIsMobileSearchOpen(!isMobileSearchOpen);
                  setTimeout(() => mobileSearchInputRef.current?.focus(), 100);
                }}
                className={`sm:hidden p-2 rounded-xl border text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 ${
                  isMobileSearchOpen || searchQuery
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
                title="Search Products"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Quick Demo Role Switcher Button */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className={`flex items-center gap-1 sm:gap-1.5 py-1.5 px-2 sm:px-2.5 rounded-xl border text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 whitespace-nowrap ${
                  authView ? 'bg-slate-900 text-white border-slate-700' : currentRoleInfo.bg
                }`}
              >
                <RoleIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">
                  {authView ? 'Auth Portal' : currentRoleInfo.label}
                </span>
                <ChevronDown className="w-3 h-3 opacity-70 shrink-0" />
              </button>

              {/* Role & Auth Dropdown */}
              <AnimatePresence>
                {isRoleMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 5 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 p-2 space-y-1.5"
                  >
                    <div className="px-2.5 py-1.5 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Switch Demo Role</p>
                        <p className="text-xs font-bold text-slate-800">4-Sided Marketplace</p>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Live Demo</span>
                    </div>

                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthView(null);
                          switchRole('customer');
                          setIsRoleMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                          currentRole === 'customer' && !authView ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-emerald-600" />
                          <span>Customer Portal</span>
                        </div>
                        {currentRole === 'customer' && !authView && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAuthView(null);
                          switchRole('shopkeeper');
                          setIsRoleMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                          currentRole === 'shopkeeper' && !authView ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4 text-amber-600" />
                          <span>Shopkeeper Portal</span>
                        </div>
                        {currentRole === 'shopkeeper' && !authView && <span className="w-2 h-2 rounded-full bg-amber-600" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAuthView(null);
                          switchRole('delivery');
                          setIsRoleMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                          currentRole === 'delivery' && !authView ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Bike className="w-4 h-4 text-blue-600" />
                          <span>Delivery Partner</span>
                        </div>
                        {currentRole === 'delivery' && !authView && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAuthView(null);
                          switchRole('admin');
                          setIsRoleMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                          currentRole === 'admin' && !authView ? 'bg-purple-50 text-purple-900 font-bold border border-purple-200' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-purple-600" />
                          <span>Platform Admin</span>
                        </div>
                        {currentRole === 'admin' && !authView && <span className="w-2 h-2 rounded-full bg-purple-600" />}
                      </button>
                    </div>

                    {/* Portals & Credentials Hub */}
                    <div className="border-t border-slate-100 pt-1.5 mt-1 space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthView('role-hub');
                          setIsRoleMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-left text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                      >
                        <span>Role Portals & Logins Hub</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart Button (Customer Mode) */}
            {currentRole === 'customer' && !authView && (
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative flex items-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-2.5 sm:px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-xs text-xs cursor-pointer shrink-0 whitespace-nowrap"
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">Cart</span>
                {totalCartItems > 0 && (
                  <span className="bg-white text-emerald-800 font-extrabold text-[11px] px-1.5 py-0.2 rounded-full min-w-[20px] text-center shadow-2xs shrink-0">
                    {totalCartItems}
                  </span>
                )}
              </button>
            )}

            {/* User Account / Sign In */}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    if (currentRole === 'customer') {
                      setCustomerView('profile');
                    }
                  }}
                  className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors shrink-0 whitespace-nowrap"
                  title={currentUser.name}
                >
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                    />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs font-bold hidden md:inline max-w-[90px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 border border-emerald-600/30 px-2.5 sm:px-3 py-1.5 rounded-xl hover:bg-emerald-50 transition-colors shrink-0 whitespace-nowrap"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Expandable Bar */}
        <AnimatePresence>
          {isMobileSearchOpen && currentRole === 'customer' && !authView && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="sm:hidden pb-3 pt-1 border-t border-slate-100 overflow-hidden"
            >
              <div className="relative">
                <input
                  ref={mobileSearchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, milk, fruits, groceries..."
                  className="w-full pl-9 pr-8 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none text-slate-900 placeholder:text-slate-400"
                />
                <Search className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Mobile Quick Results List */}
              {searchQuery.trim().length > 0 && (
                <div className="mt-2 bg-white rounded-xl border border-slate-200 p-2 space-y-2 shadow-lg max-h-60 overflow-y-auto">
                  {matchingProducts.length === 0 && matchingShops.length === 0 ? (
                    <p className="text-center text-xs text-slate-500 py-2">No matching products or shops found</p>
                  ) : (
                    <>
                      {matchingProducts.map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => handleSelectSearchedProduct(prod)}
                          className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 text-xs cursor-pointer"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <img src={prod.image} alt={prod.name} className="w-7 h-7 rounded object-cover" />
                            <div className="truncate">
                              <p className="font-semibold text-slate-900 truncate">{prod.name}</p>
                              <p className="text-[10px] text-slate-500">{prod.unit} • ₹{prod.price}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => handleAddProductFromSearch(e, prod)}
                            className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold shrink-0 ml-2"
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Location Selector Row */}
        {currentRole === 'customer' && !authView && (
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

