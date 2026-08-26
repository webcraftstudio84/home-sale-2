import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  Search,
  X,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  Store,
  Tag,
  Filter,
  Check,
  Star,
  SlidersHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductSearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  showTrendingPills?: boolean;
  onSelectProduct?: (product: Product) => void;
  className?: string;
}

export const ProductSearchBar: React.FC<ProductSearchBarProps> = ({
  initialQuery = '',
  placeholder = 'Search 1,000+ local products (e.g., Milk, Bread, Rice, Apples, Soap)...',
  showTrendingPills = true,
  onSelectProduct,
  className = '',
}) => {
  const {
    products,
    shops,
    cart,
    addToCart,
    updateCartQuantity,
    setSelectedProduct,
    setSelectedShopId,
    setCustomerView,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [localQuery, setLocalQuery] = useState(initialQuery || searchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [priceSort, setPriceSort] = useState<'default' | 'low-to-high' | 'high-to-low'>('default');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Trending search suggestions
  const trendingSearches = [
    { label: '🥛 Fresh Milk', query: 'Milk' },
    { label: '🥖 Bread & Buns', query: 'Bread' },
    { label: '🍎 Farm Apples', query: 'Apple' },
    { label: '🌾 Atta & Rice', query: 'Rice' },
    { label: '🍳 Fresh Eggs', query: 'Eggs' },
    { label: '🍪 Biscuits', query: 'Biscuits' },
    { label: '🧼 Soaps & Detergent', query: 'Soap' },
    { label: '🥔 Potatoes', query: 'Potato' },
  ];

  // Distinct categories from available products
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  // Sync external search query
  const handleQueryChange = (val: string) => {
    setLocalQuery(val);
    setSearchQuery(val);
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    const q = localQuery.toLowerCase().trim();

    return products.filter((product) => {
      // Name, category, description match
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q);

      // Category filter
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;

      // In stock
      const matchesStock = !inStockOnly || product.inStock;

      // Veg only
      const matchesVeg = !isVegOnly || product.isVeg;

      return matchesSearch && matchesCategory && matchesStock && matchesVeg;
    }).sort((a, b) => {
      if (priceSort === 'low-to-high') return a.price - b.price;
      if (priceSort === 'high-to-low') return b.price - a.price;
      return 0;
    });
  }, [products, localQuery, selectedCategory, inStockOnly, isVegOnly, priceSort]);

  // Map to get shop details quickly
  const shopMap = useMemo(() => {
    const map = new Map<string, (typeof shops)[0]>();
    shops.forEach((s) => map.set(s.id, s));
    return map;
  }, [shops]);

  const getItemCartQty = (productId: string) => {
    const item = cart.items.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const handleCardClick = (product: Product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      setSelectedProduct(product);
    }
  };

  const handleGoToShop = (e: React.MouseEvent, shopId: string) => {
    e.stopPropagation();
    setSelectedShopId(shopId);
    setCustomerView('shop-details');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 1. Main Search Bar Input */}
      <div className="bg-white p-3 sm:p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-10 sm:pl-11 pr-9 py-2.5 sm:py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200/80 rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900 font-medium"
            />
            {localQuery && (
              <button
                type="button"
                onClick={() => handleQueryChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-200 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className={`p-2.5 sm:py-3 sm:px-3.5 rounded-2xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              inStockOnly || isVegOnly || selectedCategory !== 'All' || priceSort !== 'default'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title="Filters & Sorting"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Filters</span>
            {(inStockOnly || isVegOnly || selectedCategory !== 'All' || priceSort !== 'default') && (
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
            )}
          </button>
        </div>

        {/* 2. Trending Search Pills */}
        {showTrendingPills && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 shrink-0 mr-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Trending:</span>
            </div>
            {trendingSearches.map((item) => (
              <button
                key={item.query}
                type="button"
                onClick={() => handleQueryChange(item.query)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  localQuery.toLowerCase() === item.query.toLowerCase()
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200 border-slate-200/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* 3. Expandable Filter Row */}
        <AnimatePresence>
          {isFilterDrawerOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pt-3 border-t border-slate-100 space-y-3 overflow-hidden"
            >
              {/* Category Pills */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Filter by Category
                </p>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors border ${
                        selectedCategory === cat
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles & Sort */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInStockOnly(!inStockOnly)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors border flex items-center gap-1.5 cursor-pointer ${
                      inStockOnly
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${inStockOnly ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                    <span>In-Stock Only</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsVegOnly(!isVegOnly)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors border flex items-center gap-1.5 cursor-pointer ${
                      isVegOnly
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 border border-emerald-600 rounded-xs flex items-center justify-center p-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    </span>
                    <span>Pure Veg Only</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="font-medium">Sort:</span>
                  <select
                    value={priceSort}
                    onChange={(e) => setPriceSort(e.target.value as any)}
                    className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="default">Relevance</option>
                    <option value="low-to-high">Price: Low to High</option>
                    <option value="high-to-low">Price: High to Low</option>
                  </select>

                  {(inStockOnly || isVegOnly || selectedCategory !== 'All' || priceSort !== 'default') && (
                    <button
                      type="button"
                      onClick={() => {
                        setInStockOnly(false);
                        setIsVegOnly(false);
                        setSelectedCategory('All');
                        setPriceSort('default');
                      }}
                      className="text-xs text-rose-600 hover:text-rose-700 font-bold ml-2 underline cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Live Search Results Section */}
      {(localQuery.trim().length > 0 || selectedCategory !== 'All') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm font-bold text-slate-800">
              Found <span className="text-emerald-600 font-black">{filteredProducts.length}</span> matching products
              {localQuery && <span> for "{localQuery}"</span>}
              {selectedCategory !== 'All' && <span> in {selectedCategory}</span>}
            </p>

            <button
              type="button"
              onClick={() => {
                handleQueryChange('');
                setSelectedCategory('All');
              }}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Clear Results
            </button>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  No products found for "{localQuery}"
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try searching with general terms like "Milk", "Atta", "Rice", or browse verified neighborhood shops.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleQueryChange('')}
                  className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-700 cursor-pointer"
                >
                  View All Products
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerView('shops')}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  Explore Shops
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {filteredProducts.map((prod) => {
                const shop = shopMap.get(prod.shopId);
                const cartQty = getItemCartQty(prod.id);
                const discountPercent = prod.originalPrice
                  ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)
                  : 0;

                return (
                  <div
                    key={prod.id}
                    onClick={() => handleCardClick(prod)}
                    className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-3 sm:p-3.5 flex flex-col justify-between space-y-2.5 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
                  >
                    {/* Product Image & Badges */}
                    <div className="space-y-2">
                      <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Top Tag */}
                        {discountPercent > 0 && (
                          <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                            {discountPercent}% OFF
                          </span>
                        )}

                        {/* Veg / Non-Veg Indicator */}
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs p-1 rounded-md shadow-xs">
                          <span
                            className={`w-3 h-3 rounded-xs border flex items-center justify-center p-0.5 ${
                              prod.isVeg ? 'border-emerald-600' : 'border-rose-600'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                prod.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                              }`}
                            />
                          </span>
                        </div>

                        {!prod.inStock && (
                          <div className="absolute inset-0 bg-white/80 backdrop-blur-2xs flex items-center justify-center">
                            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Name & Unit */}
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors">
                          {prod.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{prod.unit}</p>
                      </div>

                      {/* Merchant Shop Reference */}
                      {shop && (
                        <div
                          onClick={(e) => handleGoToShop(e, shop.id)}
                          className="flex items-center gap-1.5 text-[11px] text-slate-600 hover:text-emerald-800 bg-slate-50 hover:bg-emerald-50/60 p-1.5 rounded-xl transition-colors border border-slate-100"
                          title={`Sold by ${shop.name} in ${shop.area}`}
                        >
                          <Store className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate font-semibold">{shop.name}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">• {shop.area}</span>
                        </div>
                      )}
                    </div>

                    {/* Price & Add to Cart */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm sm:text-base font-extrabold text-slate-900">
                            ₹{prod.price}
                          </span>
                          {prod.originalPrice && (
                            <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                              ₹{prod.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Cart Stepper / Add Button */}
                      {cartQty > 0 ? (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center bg-emerald-700 text-white rounded-xl shadow-xs overflow-hidden text-xs font-bold"
                        >
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(prod.id, -1)}
                            className="p-1.5 hover:bg-emerald-800 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-extrabold">{cartQty}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(prod.id, 1)}
                            className="p-1.5 hover:bg-emerald-800 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={!prod.inStock}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(prod, 1);
                          }}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0 ${
                            prod.inStock
                              ? 'bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-600/30'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
