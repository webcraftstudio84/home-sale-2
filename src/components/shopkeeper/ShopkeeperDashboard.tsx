import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, OrderStatus } from '../../types';
import {
  Store,
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Edit2,
  Trash2,
  Power,
  Phone,
  MapPin,
  Sparkles,
  AlertTriangle,
  Search,
  Filter,
  LogOut,
  User,
  Shield,
  Layers,
  ArrowUpRight,
  DollarSign,
  Calendar,
  Check,
  Percent,
  SlidersHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ShopkeeperDashboard: React.FC = () => {
  const {
    products,
    orders,
    shopkeeperShop,
    currentUser,
    logoutUser,
    setAuthView,
    updateShopProfile,
    updateOrderStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStock,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'my-shop' | 'products' | 'inventory' | 'orders' | 'sales' | 'profile'>('orders');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inventorySearch, setInventorySearch] = useState('');

  // Modal for Add / Edit Product
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields for product modal
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodCategory, setProdCategory] = useState('Grocery & Kirana');
  const [prodPrice, setProdPrice] = useState('100');
  const [prodOrigPrice, setProdOrigPrice] = useState('');
  const [prodUnit, setProdUnit] = useState('1 kg');
  const [prodStockQuantity, setProdStockQuantity] = useState('50');
  const [prodIsVeg, setProdIsVeg] = useState(true);
  const [prodInStock, setProdInStock] = useState(true);
  const [prodImage, setProdImage] = useState('');

  // Shop Profile Edit state
  const [isEditingShop, setIsEditingShop] = useState(false);
  const [editTagline, setEditTagline] = useState(shopkeeperShop?.tagline || '');
  const [editPhone, setEditPhone] = useState(shopkeeperShop?.phone || '');
  const [editOpeningTime, setEditOpeningTime] = useState(shopkeeperShop?.openingTime || '07:00 AM');
  const [editClosingTime, setEditClosingTime] = useState(shopkeeperShop?.closingTime || '10:00 PM');
  const [editDescription, setEditDescription] = useState(shopkeeperShop?.description || '');

  // Guard for Shopkeeper: strictly their own shop only
  const currentShop = shopkeeperShop;

  if (!currentShop) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 space-y-4">
        <Store className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">No Assigned Shop Found</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Your account is not linked to any shop yet. Please contact the platform administrator to assign you to a shop.
        </p>
      </div>
    );
  }

  // Shop specific data strictly isolated
  const shopProducts = products.filter((p) => p.shopId === currentShop.id);
  const shopOrders = orders.filter((o) => o.shopId === currentShop.id);

  // Calculate Metrics strictly for this shop
  const completedOrders = shopOrders.filter((o) => o.orderStatus === 'Delivered');
  const activeOrders = shopOrders.filter(
    (o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled' && o.orderStatus !== 'Rejected'
  );
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.productSubtotal, 0);
  const todayRevenue = shopOrders
    .filter((o) => o.orderStatus !== 'Cancelled' && o.orderStatus !== 'Rejected')
    .reduce((sum, o) => sum + o.productSubtotal, 0);
  const pendingOrdersCount = shopOrders.filter(
    (o) => o.orderStatus === 'Order Placed' || o.orderStatus === 'Shopkeeper Accepted' || o.orderStatus === 'Preparing'
  ).length;
  const outOfStockCount = shopProducts.filter((p) => !p.inStock || (p.stockQuantity !== undefined && p.stockQuantity <= 0)).length;
  const lowStockCount = shopProducts.filter((p) => p.stockQuantity !== undefined && p.stockQuantity > 0 && p.stockQuantity <= 10).length;

  // Filtered orders
  const filteredOrders = shopOrders.filter((o) => {
    if (orderFilter === 'pending') {
      return o.orderStatus === 'Order Placed' || o.orderStatus === 'Shopkeeper Accepted' || o.orderStatus === 'Preparing';
    }
    if (orderFilter === 'ready') return o.orderStatus === 'Ready for Pickup';
    if (orderFilter === 'dispatched') return o.orderStatus === 'Delivery Partner Assigned' || o.orderStatus === 'Picked Up' || o.orderStatus === 'Out for Delivery';
    if (orderFilter === 'completed') return o.orderStatus === 'Delivered';
    if (orderFilter === 'cancelled') return o.orderStatus === 'Cancelled' || o.orderStatus === 'Rejected';
    return true;
  });

  // Filtered products
  const filteredProducts = shopProducts.filter((p) => {
    const matchesSearch =
      !productSearch ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filtered inventory
  const filteredInventory = shopProducts.filter((p) =>
    !inventorySearch ||
    p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    p.category.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  // Open modal for add
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdDesc('');
    setProdCategory(currentShop.category || 'Grocery & Kirana');
    setProdPrice('100');
    setProdOrigPrice('');
    setProdUnit('1 kg');
    setProdStockQuantity('50');
    setProdIsVeg(true);
    setProdInStock(true);
    setProdImage('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80');
    setIsProductModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdDesc(prod.description);
    setProdCategory(prod.category);
    setProdPrice(prod.price.toString());
    setProdOrigPrice(prod.originalPrice ? prod.originalPrice.toString() : '');
    setProdUnit(prod.unit);
    setProdStockQuantity(prod.stockQuantity ? prod.stockQuantity.toString() : '50');
    setProdIsVeg(prod.isVeg);
    setProdInStock(prod.inStock);
    setProdImage(prod.image);
    setIsProductModalOpen(true);
  };

  // Save product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice) return;

    const priceNum = parseFloat(prodPrice) || 0;
    const origPriceNum = prodOrigPrice ? parseFloat(prodOrigPrice) : undefined;
    const stockQtyNum = parseInt(prodStockQuantity, 10) || 50;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: prodName,
        description: prodDesc,
        category: prodCategory,
        price: priceNum,
        originalPrice: origPriceNum,
        unit: prodUnit,
        stockQuantity: stockQtyNum,
        isVeg: prodIsVeg,
        inStock: prodInStock && stockQtyNum > 0,
        image: prodImage || editingProduct.image,
      });
    } else {
      addProduct({
        shopId: currentShop.id,
        name: prodName,
        description: prodDesc,
        category: prodCategory,
        price: priceNum,
        originalPrice: origPriceNum,
        unit: prodUnit,
        stockQuantity: stockQtyNum,
        isVeg: prodIsVeg,
        inStock: prodInStock && stockQtyNum > 0,
        image: prodImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
        rating: 5.0,
        reviewCount: 1,
      });
    }

    setIsProductModalOpen(false);
  };

  const handleSaveShopProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateShopProfile(currentShop.id, {
      tagline: editTagline,
      phone: editPhone,
      openingTime: editOpeningTime,
      closingTime: editClosingTime,
      description: editDescription,
    });
    setIsEditingShop(false);
  };

  const handleQuickStockAdjust = (prodId: string, currentQty: number, delta: number) => {
    const nextQty = Math.max(0, currentQty + delta);
    updateProduct(prodId, {
      stockQuantity: nextQty,
      inStock: nextQty > 0,
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-16">
      {/* Top Shopkeeper Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
          <img
            src={currentShop.logo}
            alt={currentShop.name}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
                {currentShop.name}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                Assigned Shop
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              {currentShop.category} • {currentShop.area}, {currentShop.city} ({currentShop.pincode})
            </p>
          </div>
        </div>

        {/* Action Controls: Live Store Open/Close Toggle & Logout */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          {/* Live Open / Close Store Toggle */}
          <button
            type="button"
            onClick={() => updateShopProfile(currentShop.id, { isOpen: !currentShop.isOpen })}
            className={`flex-1 md:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
              currentShop.isOpen
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-800 hover:bg-slate-900 text-slate-200'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{currentShop.isOpen ? 'Store is OPEN' : 'Store is CLOSED'}</span>
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => {
              logoutUser();
              setAuthView(null);
            }}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 border border-slate-200 text-xs font-bold text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            title="Logout from Shopkeeper Portal"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Account Verification Status Notice */}
      {currentShop.status === 'pending' && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center gap-3 text-amber-900 text-xs">
          <Clock className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="flex-1">
            <p className="font-bold text-amber-950">Shop Application Pending Admin Verification</p>
            <p className="text-amber-800 text-[11px] mt-0.5">
              Your store is submitted and waiting for administrator approval. You can prepare catalog products; your shop will become live in customer search once activated by Admin.
            </p>
          </div>
        </div>
      )}

      {currentShop.status === 'suspended' && (
        <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 flex items-center gap-3 text-rose-900 text-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <p className="font-bold text-rose-950">Shop Suspended by Platform Admin</p>
            <p className="text-rose-800 text-[11px] mt-0.5">
              This shop is currently inactive in search. Please contact platform support or admin for resolution.
            </p>
          </div>
        </div>
      )}

      {/* Quick Performance Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-[11px] text-slate-500 font-medium">Today's Product Sales</p>
          <p className="text-lg sm:text-2xl font-black text-slate-900">₹{todayRevenue}</p>
          <span className="text-[10px] text-emerald-700 font-bold block">100% store revenue</span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-[11px] text-slate-500 font-medium">Pending Orders</p>
          <p className="text-lg sm:text-2xl font-black text-amber-600">{pendingOrdersCount}</p>
          <span className="text-[10px] text-slate-400 block">Needs your action</span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-[11px] text-slate-500 font-medium">Total Products</p>
          <p className="text-lg sm:text-2xl font-black text-slate-900">{shopProducts.length}</p>
          <span className="text-[10px] text-slate-500 font-semibold block">
            {outOfStockCount > 0 ? `${outOfStockCount} out of stock` : 'All items in stock'}
          </span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-[11px] text-slate-500 font-medium">Customer Rating</p>
          <p className="text-lg sm:text-2xl font-black text-emerald-700">{currentShop.rating} ★</p>
          <span className="text-[10px] text-slate-400 block">{currentShop.reviewCount} total reviews</span>
        </div>
      </div>

      {/* Role-Based Navigation Tabs (Scrollable on mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {[
          { id: 'orders', label: 'Orders', count: shopOrders.length },
          { id: 'products', label: 'Products', count: shopProducts.length },
          { id: 'inventory', label: 'Inventory', count: lowStockCount > 0 ? `${lowStockCount} low` : undefined },
          { id: 'my-shop', label: 'My Shop' },
          { id: 'sales', label: 'Sales & Analytics' },
          { id: 'profile', label: 'Profile' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  activeTab === tab.id ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Order filters */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto max-w-full">
              {[
                { id: 'all', label: 'All Orders' },
                { id: 'pending', label: 'Pending / Preparing' },
                { id: 'ready', label: 'Ready for Pickup' },
                { id: 'dispatched', label: 'On the Way' },
                { id: 'completed', label: 'Delivered' },
                { id: 'cancelled', label: 'Cancelled' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setOrderFilter(f.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    orderFilter === f.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-500 text-xs space-y-2">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700 text-sm">No orders matching this filter</p>
              <p className="text-slate-400">Incoming orders for {currentShop.name} will appear here in real time.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 font-mono text-sm">
                          {order.orderNumber}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {order.paymentMethod} • {order.paymentStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Customer: <strong className="text-slate-900">{order.customerName}</strong> ({order.customerPhone})
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Delivery to: {order.deliveryAddress.houseFlat}, {order.deliveryAddress.area}
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-xl text-xs font-black ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.orderStatus === 'Cancelled' || order.orderStatus === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-900 animate-pulse'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                      <p className="text-xs font-black text-slate-900 mt-1">
                        Order Value: ₹{order.productSubtotal}
                      </p>
                    </div>
                  </div>

                  {/* Items to pack */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                      Items to Pack:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {order.items.map((it) => (
                        <div
                          key={it.productId}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                        >
                          <span className="font-bold text-slate-900 truncate mr-2">
                            {it.quantity} × {it.productName} ({it.unit})
                          </span>
                          <span className="text-slate-600 font-mono font-bold shrink-0">
                            ₹{it.price * it.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Controls for Shopkeeper */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-slate-500 font-medium">
                      Rider: {order.deliveryPartnerName ? `${order.deliveryPartnerName} (${order.deliveryPartnerPhone})` : 'Waiting for available rider'}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {order.orderStatus === 'Order Placed' && (
                        <>
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, 'Shopkeeper Accepted', 'Shopkeeper confirmed product availability')}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                          >
                            Accept Order
                          </button>
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, 'Rejected', 'Item out of stock or store closing')}
                            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {order.orderStatus === 'Shopkeeper Accepted' && (
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(order.id, 'Preparing', 'Items being packaged')}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                        >
                          Start Preparing
                        </button>
                      )}

                      {order.orderStatus === 'Preparing' && (
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(order.id, 'Ready for Pickup', 'Bag packed, sealed, and ready for rider pickup')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                        >
                          Mark Ready for Pickup
                        </button>
                      )}

                      {order.orderStatus === 'Ready for Pickup' && (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          Waiting for Rider Pickup
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Products Catalog Management */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products in your catalogue..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs font-bold px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
              >
                <option value="all">All Categories</option>
                {Array.from(new Set(shopProducts.map((p) => p.category))).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleOpenAddProduct}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Products Grid (Mobile Friendly Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="flex gap-3">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-16 h-16 rounded-2xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wide truncate">
                        {prod.category}
                      </span>
                      {prod.isVeg && (
                        <span className="w-2.5 h-2.5 border border-emerald-600 p-0.5 flex items-center justify-center shrink-0">
                          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs truncate mt-0.5">{prod.name}</h4>
                    <p className="text-[11px] text-slate-500">{prod.unit}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-black text-slate-900 text-sm">₹{prod.price}</span>
                      {prod.originalPrice && prod.originalPrice > prod.price && (
                        <span className="text-xs text-slate-400 line-through">₹{prod.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stock status & Quick actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => toggleProductStock(prod.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                      prod.inStock
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {prod.inStock ? 'In Stock' : 'Out of Stock'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditProduct(prod)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProduct(prod.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                      title="Delete Product"
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

      {/* TAB 3: Inventory Management */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                placeholder="Search inventory items..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
            <div className="text-xs text-slate-500 font-semibold">
              Low Stock Alert Threshold: &lt; 10 units
            </div>
          </div>

          {/* Inventory Mobile Cards & Desktop Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {filteredInventory.map((prod) => {
                const stock = prod.stockQuantity ?? 50;
                const isLow = stock > 0 && stock <= 10;
                const isOut = stock <= 0 || !prod.inStock;

                return (
                  <div
                    key={prod.id}
                    className="p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 text-xs truncate">{prod.name}</h4>
                        <p className="text-[11px] text-slate-500">
                          {prod.category} • {prod.unit} • ₹{prod.price}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                          isOut
                            ? 'bg-rose-100 text-rose-800'
                            : isLow
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isOut ? 'Out of Stock' : isLow ? `Low Stock (${stock})` : `In Stock (${stock})`}
                      </span>

                      {/* Quick stock counter adjustment */}
                      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => handleQuickStockAdjust(prod.id, stock, -5)}
                          className="w-6 h-6 rounded-lg bg-white font-black text-slate-700 hover:bg-slate-200 text-xs flex items-center justify-center cursor-pointer shadow-2xs"
                        >
                          -5
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickStockAdjust(prod.id, stock, -1)}
                          className="w-6 h-6 rounded-lg bg-white font-black text-slate-700 hover:bg-slate-200 text-xs flex items-center justify-center cursor-pointer shadow-2xs"
                        >
                          -1
                        </button>
                        <span className="w-8 text-center font-mono font-bold text-xs text-slate-900">
                          {stock}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuickStockAdjust(prod.id, stock, 1)}
                          className="w-6 h-6 rounded-lg bg-white font-black text-slate-700 hover:bg-slate-200 text-xs flex items-center justify-center cursor-pointer shadow-2xs"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickStockAdjust(prod.id, stock, 5)}
                          className="w-6 h-6 rounded-lg bg-white font-black text-slate-700 hover:bg-slate-200 text-xs flex items-center justify-center cursor-pointer shadow-2xs"
                        >
                          +5
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: My Shop Profile & Controls */}
      {activeTab === 'my-shop' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Shop Information & Operational Timings</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage your store contact, tagline, description, and daily operating hours.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingShop(!isEditingShop)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isEditingShop ? 'Cancel Editing' : 'Edit Details'}</span>
              </button>
            </div>

            {isEditingShop ? (
              <form onSubmit={handleSaveShopProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tagline</label>
                    <input
                      type="text"
                      value={editTagline}
                      onChange={(e) => setEditTagline(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Store Phone Number</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Opening Time</label>
                    <input
                      type="text"
                      value={editOpeningTime}
                      onChange={(e) => setEditOpeningTime(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Closing Time</label>
                    <input
                      type="text"
                      value={editClosingTime}
                      onChange={(e) => setEditClosingTime(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Shop Description</label>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingShop(false)}
                    className="px-4 py-2 text-slate-600 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="font-bold text-slate-700">Location & Area</p>
                  <p className="text-slate-900 font-medium">{currentShop.address}</p>
                  <p className="text-slate-500">{currentShop.area}, {currentShop.city} - {currentShop.pincode}</p>
                  <p className="text-slate-500">Contact: {currentShop.phone}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="font-bold text-slate-700">Business Hours & Delivery</p>
                  <p className="text-slate-900 font-medium">
                    {currentShop.openingTime} - {currentShop.closingTime}
                  </p>
                  <p className="text-slate-500">Avg. Delivery Time: {currentShop.estimatedDeliveryTime}</p>
                  <p className="text-slate-500">Base Delivery Fee: ₹{currentShop.deliveryCharge}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: Sales Analytics */}
      {activeTab === 'sales' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
              <p className="text-xs text-slate-500 font-medium">Total Lifetime Product Sales</p>
              <p className="text-2xl font-black text-slate-900">₹{totalRevenue}</p>
              <p className="text-[10px] text-emerald-700 font-bold">Processed through HOMESALE</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
              <p className="text-xs text-slate-500 font-medium">Completed Orders</p>
              <p className="text-2xl font-black text-slate-900">{completedOrders.length}</p>
              <p className="text-[10px] text-slate-400">Fulfilled and delivered</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
              <p className="text-xs text-slate-500 font-medium">Avg. Order Value</p>
              <p className="text-2xl font-black text-slate-900">
                ₹{completedOrders.length > 0 ? Math.round(totalRevenue / completedOrders.length) : 0}
              </p>
              <p className="text-[10px] text-slate-400">Per completed basket</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Top Selling Products</h3>
            <div className="space-y-2.5">
              {shopProducts.slice(0, 5).map((prod, idx) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-black flex items-center justify-center text-[10px]">
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-slate-900">{prod.name}</span>
                  </div>
                  <span className="font-bold text-slate-800 font-mono">₹{prod.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Profile & Security (Password Privacy) */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 font-black text-xl flex items-center justify-center border border-amber-200 shadow-xs">
              <Store className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {currentUser?.name || currentShop.ownerName || 'Shopkeeper Account'}
              </h3>
              <p className="text-xs text-slate-500">
                Verified Shop Owner • Linked to {currentShop.name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 font-bold text-[10px] uppercase">Registered Username</span>
              <p className="font-bold text-slate-900 font-mono text-sm">{currentUser?.username || currentShop.username}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 font-bold text-[10px] uppercase">Password Privacy</span>
              <p className="font-bold text-slate-900 font-mono text-sm tracking-widest">••••••••</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 font-bold text-[10px] uppercase">Contact Phone</span>
              <p className="font-bold text-slate-900">{currentUser?.phone || currentShop.ownerPhone || currentShop.phone}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-400 font-bold text-[10px] uppercase">Official Email</span>
              <p className="font-bold text-slate-900">{currentUser?.email || currentShop.ownerEmail || 'shopkeeper@homesale.in'}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => {
                logoutUser();
                setAuthView(null);
              }}
              className="px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout of Shopkeeper Account</span>
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="e.g. Aashirvaad Shudh Chakki Atta"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Selling Price (₹)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Original Price (₹) [Discount]</label>
                    <input
                      type="number"
                      min="1"
                      value={prodOrigPrice}
                      onChange={(e) => setProdOrigPrice(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Category</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white font-medium"
                    >
                      <option value="Grocery & Kirana">Grocery & Kirana</option>
                      <option value="Fruits & Vegetables">Fruits & Vegetables</option>
                      <option value="Dairy & Eggs">Dairy & Eggs</option>
                      <option value="Bakery & Snacks">Bakery & Snacks</option>
                      <option value="Pharmacy & Wellness">Pharmacy & Wellness</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Personal Care">Personal Care</option>
                      <option value="Household Essentials">Household Essentials</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Unit</label>
                    <input
                      type="text"
                      required
                      value={prodUnit}
                      onChange={(e) => setProdUnit(e.target.value)}
                      placeholder="e.g. 500g, 1 kg, 1L, Pack of 2"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      min="0"
                      value={prodStockQuantity}
                      onChange={(e) => setProdStockQuantity(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Image URL</label>
                    <input
                      type="text"
                      value={prodImage}
                      onChange={(e) => setProdImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    placeholder="Short product overview..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prodIsVeg}
                      onChange={(e) => setProdIsVeg(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="font-semibold text-slate-800">Vegetarian Item</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prodInStock}
                      onChange={(e) => setProdInStock(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="font-semibold text-slate-800">In Stock for Ordering</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    Save Product
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
