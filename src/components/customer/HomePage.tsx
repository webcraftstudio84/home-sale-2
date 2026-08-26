import React from 'react';
import { useApp } from '../../context/AppContext';
import { HeroBanner } from './HeroBanner';
import { CategoryBar } from './CategoryBar';
import { ShopCard } from './ShopCard';
import { ProductSearchBar } from './ProductSearchBar';
import {
  Sparkles,
  Store,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  Tag,
  ShoppingBag,
  Plus,
} from 'lucide-react';
import { motion } from 'motion/react';

export const HomePage: React.FC = () => {
  const {
    shops,
    products,
    setCustomerView,
    setSelectedCategoryFilter,
    setSelectedShopId,
    addToCart,
    setSelectedProduct,
    location,
  } = useApp();

  // Featured top rated shops
  const featuredShops = shops.filter((s) => s.rating >= 4.7 && s.isOpen).slice(0, 3);
  // All active shops
  const nearbyShops = shops.slice(0, 6);

  // Daily popular essentials
  const essentialProducts = products.filter((p) => p.isVeg && p.inStock).slice(0, 6);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Hero Promotional Banner */}
      <HeroBanner />

      {/* 2. Interactive Product Search Bar */}
      <section className="space-y-2">
        <ProductSearchBar
          placeholder="Search 1,000+ local products (e.g. Milk, Rice, Fruits, Maggi, Paneer, Soap)..."
          showTrendingPills={true}
        />
      </section>

      {/* 3. Shop by Category */}
      <CategoryBar />

      {/* 4. Featured / Top Rated Stores */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Top Rated in {location.area}
              </h2>
            </div>
            <p className="text-xs text-slate-500">Highest rated local stores with fast 15-20 min dispatch</p>
          </div>

          <button
            type="button"
            onClick={() => setCustomerView('shops')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </section>

      {/* 4. Quick Fresh Essentials Strip */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-300 text-[11px] font-semibold mb-1 border border-slate-700">
              <TrendingUp className="w-3 h-3" />
              <span>Daily Essentials</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold">Fast Moving Grocery & Dairy</h3>
            <p className="text-xs text-slate-400">
              Popular household items from verified kirana shops.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedCategoryFilter('Grocery & Kirana');
              setCustomerView('shops');
            }}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl transition-all self-start sm:self-auto shadow-xs cursor-pointer"
          >
            Explore Groceries
          </button>
        </div>

        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {essentialProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => setSelectedProduct(prod)}
              className="bg-slate-800/90 text-white rounded-2xl p-3 flex flex-col justify-between space-y-2 hover:bg-slate-800 transition-all cursor-pointer shadow-xs border border-slate-700/80 hover:border-slate-600"
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60">
                <img
                  src={prod.image}
                  alt={prod.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <p className="font-bold text-xs text-slate-100 line-clamp-1">{prod.name}</p>
                <p className="text-[10px] text-slate-400">{prod.unit}</p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-700">
                <span className="font-extrabold text-xs text-emerald-400">₹{prod.price}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(prod, 1);
                  }}
                  className="w-6 h-6 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center text-xs shadow-xs cursor-pointer"
                  title="Add to cart"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. All Nearby Neighborhood Stores */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <Store className="w-4 h-4 text-emerald-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                All Neighborhood Stores
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Browse stores delivering to pincode {location.pincode}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCustomerView('shops')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group cursor-pointer"
          >
            <span>View All Stores</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {nearbyShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </section>

      {/* 6. Why HOMESALE Guarantee Footer Bar */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <h4 className="text-center font-bold text-slate-800 text-sm sm:text-base mb-6">
          Why Shop on HOMESALE?
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="space-y-1.5 flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-emerald-700 flex items-center justify-center mb-1">
              <Clock className="w-5 h-5" />
            </div>
            <h5 className="font-bold text-xs sm:text-sm text-slate-900">Hyperlocal Speed</h5>
            <p className="text-xs text-slate-500 max-w-xs">
              Orders dispatched straight from nearby kirana stores in 15–30 minutes.
            </p>
          </div>

          <div className="space-y-1.5 flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-emerald-700 flex items-center justify-center mb-1">
              <Store className="w-5 h-5" />
            </div>
            <h5 className="font-bold text-xs sm:text-sm text-slate-900">Support Local Kiranas</h5>
            <p className="text-xs text-slate-500 max-w-xs">
              Directly empower small neighborhood merchants with fair local marketplace economics.
            </p>
          </div>

          <div className="space-y-1.5 flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-emerald-700 flex items-center justify-center mb-1">
              <Tag className="w-5 h-5" />
            </div>
            <h5 className="font-bold text-xs sm:text-sm text-slate-900">₹150 Low Minimum Order</h5>
            <p className="text-xs text-slate-500 max-w-xs">
              Low threshold with transparent, separate delivery fees and live tracking.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
