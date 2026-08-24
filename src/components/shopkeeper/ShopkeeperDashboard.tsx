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
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ShopkeeperDashboard: React.FC = () => {
  const {
    shops,
    products,
    orders,
    shopkeeperShop,
    updateShopProfile,
    updateOrderStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStock,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings'>('orders');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState('');
  const [selectedShopIdLocal, setSelectedShopIdLocal] = useState<string>(shopkeeperShop?.id || shops[0]?.id);

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
  const [prodIsVeg, setProdIsVeg] = useState(true);
  const [prodInStock, setProdInStock] = useState(true);
  const [prodImage, setProdImage] = useState('');

  const currentShop = shops.find((s) => s.id === selectedShopIdLocal) || shopkeeperShop || shops[0];

  // Shop specific data
  const shopProducts = products.filter((p) => p.shopId === currentShop.id);
  const shopOrders = orders.filter((o) => o.shopId === currentShop.id);

  // Calculate Metrics
  const todayRevenue = shopOrders
    .filter((o) => o.orderStatus !== 'Cancelled' && o.orderStatus !== 'Rejected')
    .reduce((sum, o) => sum + o.productSubtotal, 0);

  const pendingOrdersCount = shopOrders.filter(
    (o) => o.orderStatus === 'Order Placed' || o.orderStatus === 'Shopkeeper Accepted' || o.orderStatus === 'Preparing'
  ).length;

  const outOfStockCount = shopProducts.filter((p) => !p.inStock).length;

  // Filtered orders
  const filteredOrders = shopOrders.filter((o) => {
    if (orderFilter === 'pending') {
      return o.orderStatus === 'Order Placed' || o.orderStatus === 'Shopkeeper Accepted' || o.orderStatus === 'Preparing';
    }
    if (orderFilter === 'ready') return o.orderStatus === 'Ready for Pickup';
    if (orderFilter === 'completed') return o.orderStatus === 'Delivered';
    return true;
  });

  // Filtered products
  const filteredProducts = shopProducts.filter(
    (p) =>
      !productSearch ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Open modal for add
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdDesc('');
    setProdCategory('Grocery & Kirana');
    setProdPrice('100');
    setProdOrigPrice('');
    setProdUnit('1 kg');
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
    setProdIsVeg(prod.isVeg);
    setProdInStock(prod.inStock);
    setProdImage(prod.image);
    setIsProductModalOpen(true);
  };

  // Save product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: prodName,
        description: prodDesc,
        category: prodCategory,
        price: parseFloat(prodPrice) || 0,
        originalPrice: prodOrigPrice ? parseFloat(prodOrigPrice) : undefined,
        unit: prodUnit,
        isVeg: prodIsVeg,
        inStock: prodInStock,
        image: prodImage || editingProduct.image,
      });
    } else {
      addProduct({
        shopId: currentShop.id,
        name: prodName,
        description: prodDesc,
        category: prodCategory,
        price: parseFloat(prodPrice) || 0,
        originalPrice: prodOrigPrice ? parseFloat(prodOrigPrice) : undefined,
        unit: prodUnit,
        isVeg: prodIsVeg,
        inStock: prodInStock,
        image: prodImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        reviewCount: 1,
      });
    }

    setIsProductModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Shopkeeper Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentShop.logo}
            alt={currentShop.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">{currentShop.name}</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Shopkeeper
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentShop.category} • {currentShop.area} ({currentShop.pincode})
            </p>
          </div>
        </div>

        {/* Shop Switcher & Store Live Open/Close Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Shop Switcher for demo */}
          <select
            value={currentShop.id}
            onChange={(e) => setSelectedShopIdLocal(e.target.value)}
            className="text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none cursor-pointer"
          >
            {shops.map((s) => (
              <option key={s.id} value={s.id}>
                Store: {s.name}
              </option>
            ))}
          </select>

          {/* Live Open / Close Store Toggle */}
          <button
            type="button"
            onClick={() => updateShopProfile(currentShop.id, { isOpen: !currentShop.isOpen })}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
              currentShop.isOpen
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-800 hover:bg-slate-900 text-slate-200'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{currentShop.isOpen ? 'Store is OPEN' : 'Store is CLOSED'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-medium">Today's Product Sales</p>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900">₹{todayRevenue}</p>
          <span className="text-[10px] text-emerald-700 font-bold">100% store payout</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-medium">Pending Orders</p>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-600">{pendingOrdersCount}</p>
          <span className="text-[10px] text-slate-400">Needs preparation</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-medium">Total Products</p>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{shopProducts.length}</p>
          <span className="text-[10px] text-slate-500 font-semibold">{outOfStockCount} out of stock</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-medium">Customer Rating</p>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-700">{currentShop.rating} ★</p>
          <span className="text-[10px] text-slate-400">Based on {currentShop.reviewCount} reviews</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Incoming Orders ({shopOrders.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'products'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Product Catalog ({shopProducts.length})
        </button>
      </div>

      {/* TAB 1: Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Order filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              {(['all', 'pending', 'ready', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setOrderFilter(f)}
                  className={`px-3 py-1 text-xs font-bold capitalize rounded-lg transition-all cursor-pointer ${
                    orderFilter === f ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
              No orders found matching this filter.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 font-mono text-sm">
                            {order.orderNumber}
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            {order.paymentMethod} • {order.paymentStatus}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Customer: <strong className="text-slate-800">{order.customerName}</strong> ({order.customerPhone})
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Delivery to: {order.deliveryAddress.houseFlat}, {order.deliveryAddress.area}
                        </p>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-xl text-xs font-extrabold ${
                            order.orderStatus === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.orderStatus === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-900 animate-pulse'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                        <p className="text-xs font-bold text-slate-900 mt-1">
                          Subtotal: ₹{order.productSubtotal}
                        </p>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-1.5">
                      <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                        Pack the following items:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {order.items.map((it) => (
                          <div
                            key={it.productId}
                            className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                          >
                            <span className="font-bold text-slate-900">
                              {it.quantity} × {it.productName} ({it.unit})
                            </span>
                            <span className="text-slate-500 font-mono">₹{it.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shopkeeper Action Controls */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs text-slate-500 font-medium">
                        Rider: {order.deliveryPartnerName ? `${order.deliveryPartnerName} (${order.deliveryPartnerPhone})` : 'Waiting for dispatch partner'}
                      </div>

                      <div className="flex items-center gap-2">
                        {order.orderStatus === 'Order Placed' && (
                          <>
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(order.id, 'Shopkeeper Accepted', 'Shopkeeper confirmed inventory')}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                            >
                              Accept Order
                            </button>
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(order.id, 'Rejected', 'Out of stock or unavailable')}
                              className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {order.orderStatus === 'Shopkeeper Accepted' && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, 'Preparing', 'Items being packaged')}
                            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                          >
                            Mark As "Preparing"
                          </button>
                        )}

                        {order.orderStatus === 'Preparing' && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, 'Ready for Pickup', 'Bag packed, sealed, and ready for rider pickup')}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                          >
                            Mark "Ready for Pickup"
                          </button>
                        )}

                        {order.orderStatus === 'Ready for Pickup' && (
                          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                            Waiting for Rider Pickup
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Products Catalog Management */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search store inventory..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleOpenAddProduct}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="flex gap-3">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase">
                      {prod.category}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs truncate">{prod.name}</h4>
                    <p className="text-[11px] text-slate-500">{prod.unit}</p>
                    <p className="font-extrabold text-slate-900 text-sm mt-0.5">₹{prod.price}</p>
                  </div>
                </div>

                {/* Stock toggle and actions */}
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

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditProduct(prod)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProduct(prod.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
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

      {/* Add / Edit Product Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto"
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

              <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
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
                    <label className="font-bold text-slate-700 block mb-1">Price (₹)</label>
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
                    <label className="font-bold text-slate-700 block mb-1">Original Price (₹)</label>
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
                    <span className="font-semibold text-slate-800">In Stock for Order</span>
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
