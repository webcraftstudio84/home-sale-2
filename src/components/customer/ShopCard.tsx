import React from 'react';
import { Shop } from '../../types';
import { useApp } from '../../context/AppContext';
import { Star, Clock, MapPin, Heart, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'motion/react';

interface ShopCardProps {
  shop: Shop;
}

export const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  const { setSelectedShopId, setCustomerView, toggleFavoriteShop, isFavoriteShop } = useApp();

  const isFavorite = isFavoriteShop(shop.id);

  const handleCardClick = () => {
    setSelectedShopId(shop.id);
    setCustomerView('shop-details');
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteShop(shop.id);
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.15 }}
      onClick={handleCardClick}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-400 transition-all cursor-pointer flex flex-col group"
    >
      {/* Banner & Logo */}
      <div className="relative h-36 sm:h-40 w-full bg-slate-100 overflow-hidden">
        <img
          src={shop.banner}
          alt={shop.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-xs flex items-center justify-center text-slate-700 hover:text-rose-600 transition-colors cursor-pointer"
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
            }`}
          />
        </button>

        {/* Status Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs ${
              shop.isOpen ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-200'
            }`}
          >
            {shop.isOpen ? 'OPEN NOW' : 'CLOSED'}
          </span>
        </div>

        {/* Floating Shop Logo & Delivery Time */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between">
          <div className="flex items-center gap-2">
            <img
              src={shop.logo}
              alt={shop.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-xs bg-white"
            />
            <div className="text-white drop-shadow-xs">
              <span className="text-[11px] font-semibold text-emerald-300 block leading-tight">
                {shop.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-950/70 backdrop-blur-md text-white text-[11px] font-bold px-2 py-1 rounded-lg border border-white/10">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>{shop.estimatedDeliveryTime}</span>
          </div>
        </div>
      </div>

      {/* Shop Info */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-emerald-700 transition-colors line-clamp-1">
              {shop.name}
            </h3>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md text-slate-800 font-bold text-xs shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              <span>{shop.rating}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {shop.description}
          </p>
        </div>

        {/* Meta details footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1 text-slate-500 truncate max-w-[150px]">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{shop.area}</span>
            <span>• {shop.distanceKm} km</span>
          </div>

          <div className="flex items-center gap-1 font-semibold text-slate-800 shrink-0">
            <Truck className="w-3.5 h-3.5 text-emerald-600" />
            <span>₹{shop.deliveryCharge} delivery</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
