import React from 'react';
import { useApp } from '../../context/AppContext';
import { Store, Bike, ShieldCheck, ShoppingBag, ArrowRight, UserPlus, LogIn, Sparkles, CheckCircle2 } from 'lucide-react';

export const RolePortalHub: React.FC = () => {
  const { setAuthView, switchRole, setCustomerView } = useApp();

  return (
    <div className="py-6 sm:py-10 max-w-5xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>HOMESALE Role Access & Authentication</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Select Your HOMESALE Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Dedicated, role-isolated workflows for Customers, Shopkeepers, Delivery Partners and Platform Administrators.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Customer Portal */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Shopper Experience</span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">Customer Store</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Browse nearby grocery, bakery, pharmacy shops & order delivery to your doorstep in 15–30 mins.
              </p>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setAuthView(null);
                switchRole('customer');
                setCustomerView('home');
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Shopkeeper Portal */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-600/20">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">Merchant Hub</span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">Shopkeeper Portal</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Manage your product catalogue, pricing, incoming orders, packing dispatch and store hours.
              </p>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-slate-100 space-y-2">
            <button
              type="button"
              onClick={() => setAuthView('shopkeeper-login')}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Shopkeeper Login</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthView('shopkeeper-register')}
              className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>List Your Shop</span>
            </button>
          </div>
        </div>

        {/* Delivery Partner Portal */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700">Rider Fleet</span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">Delivery Partner</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Accept local delivery runs, view turn-by-turn shop pick-up routes and earn daily cash payouts.
              </p>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-slate-100 space-y-2">
            <button
              type="button"
              onClick={() => setAuthView('delivery-login')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Rider Login</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthView('delivery-register')}
              className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Join as Delivery Partner</span>
            </button>
          </div>
        </div>

        {/* Admin Console */}
        <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-900/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400">Platform Governance</span>
              <h2 className="text-lg font-bold text-white mt-0.5">Admin Console</h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Review pending shop registrations, approve delivery partners, configure delivery zones & oversee platform transactions.
              </p>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-slate-800 space-y-2">
            <button
              type="button"
              onClick={() => setAuthView('admin-login')}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </button>

            <div className="text-[10px] text-center text-slate-400 font-mono">
              Demo: <span className="text-purple-300">HOMESALEADMIN</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
