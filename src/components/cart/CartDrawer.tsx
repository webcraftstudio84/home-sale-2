import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  Store,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    minOrderRequirement,
    cartDeliveryCharge,
    cartGrandTotal,
    setCustomerView,
    shops,
    location,
    setIsLocationModalOpen,
  } = useApp();

  if (!isCartDrawerOpen) return null;

  const currentShop = shops.find((s) => s.id === cart.shopId);
  const isDeliverable = location.isDeliverable;

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    setCustomerView('checkout');
  };

  const progressPercent = Math.min(100, Math.round((cartSubtotal / minOrderRequirement.minAmount) * 100));

  return (
    <AnimatePresence>
      <div id="cart-drawer-backdrop" className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Your Cart</h3>
                {cart.items.length > 0 ? (
                  <p className="text-xs text-slate-500 font-medium">
                    {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} from{' '}
                    <span className="font-semibold text-slate-800">{cart.shopName}</span>
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">Cart is empty</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              {cart.items.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  title="Clear Cart"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Content */}
          {cart.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <ShoppingBag className="w-10 h-10 stroke-1" />
              </div>
              <h4 className="text-base font-bold text-slate-800 mb-1">Your cart is empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mb-6">
                Explore trusted neighborhood shops in your area and add fresh items to your basket.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setCustomerView('shops');
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Store className="w-4 h-4" />
                <span>Browse Nearby Shops</span>
              </button>
            </div>
          ) : (
            <>
              {/* Scrollable Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* Minimum Order Warning / Progress Card */}
                <div
                  className={`p-3.5 rounded-xl border transition-all ${
                    minOrderRequirement.isMet
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50/80 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="flex items-center gap-1.5">
                      {minOrderRequirement.isMet ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Minimum order of ₹150 reached!</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Minimum order requirement</span>
                        </>
                      )}
                    </span>
                    <span>₹{cartSubtotal} / ₹150</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-1.5">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        minOrderRequirement.isMet ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {!minOrderRequirement.isMet && (
                    <p className="text-[11px] font-semibold text-amber-800">
                      Add ₹{minOrderRequirement.deficit} more to reach the minimum order of ₹150.
                    </p>
                  )}
                </div>

                {/* Delivery Area Warning Banner if not deliverable */}
                {!isDeliverable && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-bold">Outside Delivery Area</p>
                      <p className="text-[11px] text-rose-700">
                        Pincode {location.pincode} is not currently supported for checkout.
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsLocationModalOpen(true)}
                        className="mt-1 text-[11px] font-bold text-rose-800 underline hover:text-rose-950 cursor-pointer"
                      >
                        Change to supported pincode
                      </button>
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div className="space-y-2.5">
                  {cart.items.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-lg object-cover bg-slate-100 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`w-2.5 h-2.5 rounded-sm border flex items-center justify-center ${
                            product.isVeg ? 'border-emerald-600' : 'border-rose-600'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              product.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                            }`} />
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {product.name}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">{product.unit}</p>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="text-xs font-bold text-slate-900">
                            ₹{product.price * quantity}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            (₹{product.price} each)
                          </span>
                        </div>
                      </div>

                      {/* Quantity Modifier */}
                      <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50 p-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(product.id, -1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-white transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-900">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(product.id, 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-white transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Information Note */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      Delivery Partner Pickup
                    </span>
                    <span className="font-semibold text-slate-900">{currentShop?.estimatedDeliveryTime || '15-25 min'}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Order will be prepared at {cart.shopName} and delivered straight to {location.area}.
                  </p>
                </div>
              </div>

              {/* Bill Details & Checkout Button */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Product Subtotal</span>
                    <span className="font-semibold text-slate-900">₹{cartSubtotal}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <span>Delivery Charges</span>
                      <span className="text-[10px] text-slate-400">(Calculated separately)</span>
                    </span>
                    <span className="font-semibold text-slate-900">₹{cartDeliveryCharge}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Grand Total</span>
                    <span className="text-base text-emerald-700">₹{cartGrandTotal}</span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                <button
                  type="button"
                  disabled={!minOrderRequirement.isMet || !isDeliverable}
                  onClick={handleProceedToCheckout}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-between text-sm cursor-pointer"
                >
                  <div className="text-left leading-tight">
                    <p className="text-[11px] opacity-90">Pay on Delivery / UPI</p>
                    <p className="font-extrabold">₹{cartGrandTotal}</p>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
                    <span>
                      {!isDeliverable
                        ? 'Location Not Supported'
                        : !minOrderRequirement.isMet
                        ? 'Min ₹150 Required'
                        : 'Proceed to Checkout'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
