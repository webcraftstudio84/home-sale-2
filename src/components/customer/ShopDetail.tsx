import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Phone,
  Truck,
  Heart,
  Plus,
  Minus,
  ShoppingBag,
  Search,
  Check,
  ShieldCheck,
  Tag,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';

export const ShopDetail: React.FC = () => {
  const {
    selectedShopId,
    setCustomerView,
    shops,
    products,
    cart,
    addToCart,
    updateCartQuantity,
    setSelectedProduct,
    toggleFavoriteShop,
    isFavoriteShop,
  } = useApp();

  const [inShopSearch, setInShopSearch] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState('All');

  const shop = shops.find((s) => s.id === selectedShopId) || shops[0];
  const isFavorite = isFavoriteShop(shop.id);

  // Shop products
  const shopProducts = products.filter((p) => p.shopId === shop.id);

  // Get distinct categories in this shop
  const distinctCategories: string[] = Array.from(new Set(shopProducts.map((p) => p.category)));

  // Filtered products
  const filteredProducts = shopProducts.filter((p) => {
    const matchesSearch =
      !inShopSearch ||
      p.name.toLowerCase().includes(inShopSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(inShopSearch.toLowerCase());
    const matchesCat = activeCategoryTab === 'All' || p.category === activeCategoryTab;
    return matchesSearch && matchesCat;
  });

  // Group products by category when 'All' tab is selected
  const groupedProducts: { [key: string]: typeof shopProducts } = {};
  if (activeCategoryTab === 'All' && !inShopSearch) {
    distinctCategories.forEach((cat) => {
      groupedProducts[cat] = shopProducts.filter((p) => p.category === cat);
    });
  }

  // Get quantity of a product currently in cart
  const getItemCartQty = (productId: string) => {
    const item = cart.items.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back button */}
      <button
        type="button"
        onClick={() => setCustomerView('shops')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-colors shadow-xs cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Shops</span>
      </button>

      {/* Shop Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Banner */}
        <div className="relative h-48 sm:h-64 w-full bg-slate-100 overflow-hidden">
          <img
            src={shop.banner}
            alt={shop.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

          {/* Favorite Button */}
          <button
            type="button"
            onClick={() => toggleFavoriteShop(shop.id)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-xs flex items-center justify-center text-slate-700 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-700'
              }`}
            />
          </button>

          {/* Banner bottom info */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={shop.logo}
                alt={shop.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-white shadow-xs bg-white"
              />
              <div className="text-white drop-shadow-xs">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  {shop.category}
                </span>
                <h1 className="text-lg sm:text-2xl font-extrabold leading-tight">
                  {shop.name}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs shrink-0">
              <Star className="w-4 h-4 fill-white text-white" />
              <span>{shop.rating}</span>
              <span className="opacity-80">({shop.reviewCount})</span>
            </div>
          </div>
        </div>

        {/* Shop Info Badges */}
        <div className="p-5 space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {shop.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Delivery Time</p>
                <p className="font-bold text-slate-900">{shop.estimatedDeliveryTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Delivery Fee</p>
                <p className="font-bold text-slate-900">₹{shop.deliveryCharge}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Hours</p>
                <p className="font-bold text-slate-900">{shop.openingTime} - {shop.closingTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Location</p>
                <p className="font-bold text-slate-900 truncate">{shop.area}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* In-Shop Search & Category Filter Navigation */}
      <div className="sticky top-20 z-30 bg-slate-50/95 backdrop-blur-md pt-2 pb-3 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search within shop */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inShopSearch}
              onChange={(e) => setInShopSearch(e.target.value)}
              placeholder={`Search products in ${shop.name}...`}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none shadow-xs text-slate-900 placeholder:text-slate-400"
            />
            {inShopSearch && (
              <button
                type="button"
                onClick={() => setInShopSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Min Order Notice */}
          <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-1.5 shrink-0">
            <Tag className="w-3.5 h-3.5 text-emerald-600" />
            <span>Minimum order ₹150 for doorstep delivery</span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
          <button
            type="button"
            onClick={() => setActiveCategoryTab('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border cursor-pointer ${
              activeCategoryTab === 'All'
                ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            All Products ({shopProducts.length})
          </button>
          {distinctCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategoryTab(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border cursor-pointer ${
                activeCategoryTab === cat
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              {cat} ({shopProducts.filter((p) => p.category === cat).length})
            </button>
          ))}
        </div>
      </div>

      {/* Products Display */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-2">
          <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="font-bold text-slate-800 text-sm">No products found</h4>
          <p className="text-xs text-slate-500">
            No items in this shop match your filter or search query.
          </p>
        </div>
      ) : activeCategoryTab === 'All' && !inShopSearch ? (
        /* Categorized Sections */
        <div className="space-y-8">
          {Object.entries(groupedProducts).map(([catName, prods]) => (
            <div key={catName} className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  {catName}
                </h3>
                <span className="text-xs text-slate-400 font-semibold">({prods.length})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {prods.map((product) => {
                  const qty = getItemCartQty(product.id);
                  const discountPercent = product.originalPrice
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                    : 0;

                  return (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="bg-white rounded-2xl border border-slate-200 p-3.5 hover:border-slate-400 hover:shadow-md transition-all flex gap-3.5 items-start cursor-pointer group shadow-xs"
                    >
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {discountPercent > 0 && (
                          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-emerald-600 text-white font-bold text-[10px] rounded-md shadow-xs">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between h-full space-y-2">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className={`w-2.5 h-2.5 rounded-sm border flex items-center justify-center ${
                              product.isVeg ? 'border-emerald-600' : 'border-rose-600'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                product.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                              }`} />
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold uppercase">
                              {product.unit}
                            </span>
                          </div>

                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 group-hover:text-emerald-700 transition-colors leading-snug">
                            {product.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {product.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                                ₹{product.price}
                              </span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-[11px] text-slate-400 line-through">
                                  ₹{product.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Add / Modifier Button */}
                          <div onClick={(e) => e.stopPropagation()}>
                            {qty > 0 ? (
                              <div className="flex items-center border border-emerald-600 rounded-xl bg-emerald-50 p-0.5 shadow-xs">
                                <button
                                  type="button"
                                  onClick={() => updateCartQuantity(product.id, -1)}
                                  className="w-7 h-7 rounded-lg flex items-center justify-center text-emerald-800 hover:bg-emerald-200 transition-colors font-bold cursor-pointer"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-7 text-center font-extrabold text-xs text-emerald-950">
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateCartQuantity(product.id, 1)}
                                  className="w-7 h-7 rounded-lg flex items-center justify-center text-emerald-800 hover:bg-emerald-200 transition-colors font-bold cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                disabled={!product.inStock}
                                onClick={() => addToCart(product, 1)}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>{product.inStock ? 'Add' : 'Out'}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Flat filtered grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const qty = getItemCartQty(product.id);
            const discountPercent = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

            return (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="bg-white rounded-2xl border border-slate-200 p-3.5 hover:border-slate-400 hover:shadow-md transition-all flex gap-3.5 items-start cursor-pointer group shadow-xs"
              >
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {discountPercent > 0 && (
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-emerald-600 text-white font-bold text-[10px] rounded-md shadow-xs">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between h-full space-y-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`w-2.5 h-2.5 rounded-sm border flex items-center justify-center ${
                        product.isVeg ? 'border-emerald-600' : 'border-rose-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          product.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                        }`} />
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">
                        {product.unit}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 group-hover:text-emerald-700 transition-colors leading-snug">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                          ₹{product.price}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-[11px] text-slate-400 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <div onClick={(e) => e.stopPropagation()}>
                      {qty > 0 ? (
                        <div className="flex items-center border border-emerald-600 rounded-xl bg-emerald-50 p-0.5 shadow-xs">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(product.id, -1)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-emerald-800 hover:bg-emerald-200 transition-colors font-bold cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center font-extrabold text-xs text-emerald-950">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(product.id, 1)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-emerald-800 hover:bg-emerald-200 transition-colors font-bold cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={!product.inStock}
                          onClick={() => addToCart(product, 1)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{product.inStock ? 'Add' : 'Out'}</span>
                        </button>
                      )}
                    </div>
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
