import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShopCard } from './ShopCard';
import { CategoryBar } from './CategoryBar';
import {
  Search,
  SlidersHorizontal,
  Star,
  Clock,
  Heart,
  Store,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';

export const ShopListing: React.FC = () => {
  const {
    shops,
    searchQuery,
    setSearchQuery,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    favoriteShopIds,
    location,
    setIsLocationModalOpen,
  } = useApp();

  const [openOnly, setOpenOnly] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'deliveryTime' | 'distance'>('rating');

  // Filter logic
  let filteredShops = shops.filter((shop) => {
    // Search query
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      shop.name.toLowerCase().includes(query) ||
      shop.category.toLowerCase().includes(query) ||
      shop.description.toLowerCase().includes(query) ||
      shop.area.toLowerCase().includes(query);

    // Category filter
    const matchesCat =
      selectedCategoryFilter === 'All' || shop.category === selectedCategoryFilter;

    // Open Only
    const matchesOpen = !openOnly || shop.isOpen;

    // Favorites Only
    const matchesFav = !showFavoritesOnly || favoriteShopIds.includes(shop.id);

    // Active status only
    const isActive = shop.status === 'active';

    return matchesSearch && matchesCat && matchesOpen && matchesFav && isActive;
  });

  // Sort logic
  filteredShops.sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
    if (sortBy === 'deliveryTime') {
      const timeA = parseInt(a.estimatedDeliveryTime) || 20;
      const timeB = parseInt(b.estimatedDeliveryTime) || 20;
      return timeA - timeB;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Category Bar */}
      <CategoryBar
        selectedCategory={selectedCategoryFilter}
        onSelectCategory={(cat) => setSelectedCategoryFilter(cat)}
      />

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* In-page search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search local shops by name, category, or area..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {/* Open Now Toggle */}
            <button
              type="button"
              onClick={() => setOpenOnly(!openOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border flex items-center gap-1.5 cursor-pointer ${
                openOnly
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Open Now</span>
            </button>

            {/* Favorites Toggle */}
            <button
              type="button"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border flex items-center gap-1.5 cursor-pointer ${
                showFavoritesOnly
                  ? 'bg-rose-100 border-rose-300 text-rose-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Favorites ({favoriteShopIds.length})</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-2 pl-3 pr-8 text-xs font-bold bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none"
              >
                <option value="rating">Sort: Highest Rated</option>
                <option value="deliveryTime">Sort: Fastest Delivery</option>
                <option value="distance">Sort: Nearest Distance</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Location deliverability reminder */}
        {!location.isDeliverable && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                You are currently viewing stores outside our active delivery area ({location.pincode}).
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="font-bold underline hover:text-amber-950 shrink-0 cursor-pointer"
            >
              Change Location
            </button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {showFavoritesOnly
              ? 'Your Favorite Shops'
              : selectedCategoryFilter !== 'All'
              ? `${selectedCategoryFilter} Stores`
              : `Nearby Shops in ${location.area}`}
          </h2>
          <p className="text-xs text-slate-500">
            Showing {filteredShops.length} verified {filteredShops.length === 1 ? 'shop' : 'shops'}
          </p>
        </div>

        {(selectedCategoryFilter !== 'All' || openOnly || showFavoritesOnly || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedCategoryFilter('All');
              setOpenOnly(false);
              setShowFavoritesOnly(false);
              setSearchQuery('');
            }}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid of Shops */}
      {filteredShops.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Store className="w-8 h-8" />
          </div>
          <h4 className="font-bold text-slate-800 text-sm">No shops matched your search</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms, changing categories, or clearing active filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategoryFilter('All');
              setOpenOnly(false);
              setShowFavoritesOnly(false);
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
          >
            Show All Shops
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </div>
  );
};
