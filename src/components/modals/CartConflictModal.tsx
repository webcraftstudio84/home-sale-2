import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertCircle, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartConflictModal: React.FC = () => {
  const { cartConflictModal, resolveCartConflict, cart, shops } = useApp();

  if (!cartConflictModal.isOpen || !cartConflictModal.pendingProduct) return null;

  const newProductShop = shops.find((s) => s.id === cartConflictModal.pendingProduct?.shopId);

  return (
    <AnimatePresence>
      <div id="cart-conflict-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
        >
          <div className="p-6 text-center">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Replace cart items?
            </h3>

            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Your cart already contains items from <strong className="text-slate-900">{cart.shopName}</strong>.
              HOMESALE orders are fulfilled from one local shop at a time for fastest delivery.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left mb-6 text-xs text-slate-700 space-y-1">
              <p>
                <span className="text-slate-400 font-medium">New item:</span>{' '}
                <strong className="text-emerald-700">{cartConflictModal.pendingProduct.name}</strong>
              </p>
              <p>
                <span className="text-slate-400 font-medium">From shop:</span>{' '}
                <strong className="text-slate-800">{newProductShop?.name || 'New Shop'}</strong>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => resolveCartConflict(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-100 transition-colors text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => resolveCartConflict(true)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-semibold text-white transition-colors text-sm shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Cart & Add Product</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
