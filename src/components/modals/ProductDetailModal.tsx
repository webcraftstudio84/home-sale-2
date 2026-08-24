import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Minus, ShoppingBag, Check, Star, ShieldCheck, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, shops } = useApp();
  const [quantity, setQuantity] = useState(1);

  if (!selectedProduct) return null;

  const shop = shops.find((s) => s.id === selectedProduct.shopId);
  const discountPercent = selectedProduct.originalPrice
    ? Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
  };

  return (
    <AnimatePresence>
      <div id="product-detail-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="relative">
            <div className="h-60 sm:h-72 w-full overflow-hidden bg-slate-100 relative">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md text-slate-700 hover:text-slate-900 hover:bg-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badges */}
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
              {discountPercent > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs">
                  <Tag className="w-3 h-3" /> {discountPercent}% OFF
                </span>
              )}
              <span className={`px-2.5 py-1 rounded-lg font-semibold text-xs shadow-xs ${
                selectedProduct.inStock ? 'bg-white/90 text-slate-900' : 'bg-rose-500 text-white'
              }`}>
                {selectedProduct.inStock ? `${selectedProduct.stockQuantity} in stock` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center p-0.5 ${
                    selectedProduct.isVeg ? 'border-emerald-600' : 'border-rose-600'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      selectedProduct.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                    }`} />
                  </span>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {selectedProduct.category}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {selectedProduct.name}
                </h2>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  Pack Size: <span className="font-semibold text-slate-700">{selectedProduct.unit}</span>
                </p>
              </div>

              {selectedProduct.rating && (
                <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-bold text-xs shrink-0">
                  <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                  <span>{selectedProduct.rating}</span>
                </div>
              )}
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-2.5 pt-2 border-t border-slate-100">
              <span className="text-2xl font-extrabold text-slate-900">
                ₹{selectedProduct.price}
              </span>
              {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                <span className="text-sm text-slate-400 line-through font-medium">
                  ₹{selectedProduct.originalPrice}
                </span>
              )}
              <span className="text-xs text-slate-500 font-medium">
                (Inclusive of all taxes)
              </span>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Product Details</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>

            {/* Shop info pill */}
            {shop && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src={shop.logo}
                    alt={shop.name}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                  />
                  <div>
                    <p className="font-bold text-slate-900">{shop.name}</p>
                    <p className="text-slate-500">{shop.area} • {shop.estimatedDeliveryTime} delivery</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Verified Local Shop
                </span>
              </div>
            )}

            {/* Trust points */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Genuine Local Kirana</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Quality Inspected</span>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-3">
            {/* Quantity Selector */}
            <div className="flex items-center border border-slate-300 rounded-xl bg-white p-1">
              <button
                type="button"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-sm text-slate-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              disabled={!selectedProduct.inStock}
              onClick={handleAddToCart}
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {selectedProduct.inStock
                  ? `Add to Cart • ₹${selectedProduct.price * quantity}`
                  : 'Currently Out of Stock'}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
