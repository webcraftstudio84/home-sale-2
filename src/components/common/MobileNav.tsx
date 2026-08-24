import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Store, Clock, ShoppingBag, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const {
    currentRole,
    customerView,
    setCustomerView,
    cart,
    setIsCartDrawerOpen,
    orders,
    setSelectedShopId,
  } = useApp();

  if (currentRole !== 'customer') return null;

  const totalCartItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const activeOrdersCount = orders.filter(
    (o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled' && o.orderStatus !== 'Rejected'
  ).length;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-lg px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around">
        <button
          type="button"
          onClick={() => {
            setSelectedShopId(null);
            setCustomerView('home');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            customerView === 'home' ? 'text-emerald-700 font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedShopId(null);
            setCustomerView('shops');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            customerView === 'shops' || customerView === 'shop-details' ? 'text-emerald-700 font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <Store className="w-5 h-5" />
          <span className="text-[10px]">Shops</span>
        </button>

        <button
          type="button"
          onClick={() => setIsCartDrawerOpen(true)}
          className="relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-slate-500 font-medium transition-all"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-emerald-600 text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {totalCartItems}
              </span>
            )}
          </div>
          <span className="text-[10px]">Cart</span>
        </button>

        <button
          type="button"
          onClick={() => setCustomerView('order-history')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            customerView === 'order-history' || customerView === 'order-tracking' ? 'text-emerald-700 font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <div className="relative">
            <Clock className="w-5 h-5" />
            {activeOrdersCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-amber-500 w-2 h-2 rounded-full ring-2 ring-white" />
            )}
          </div>
          <span className="text-[10px]">Orders</span>
        </button>

        <button
          type="button"
          onClick={() => setCustomerView('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            customerView === 'profile' ? 'text-emerald-700 font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Account</span>
        </button>
      </div>
    </nav>
  );
};
