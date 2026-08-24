import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Clock, ShieldCheck, Tag, ArrowRight, Store } from 'lucide-react';
import { motion } from 'motion/react';

export const HeroBanner: React.FC = () => {
  const { setCustomerView, setSelectedCategoryFilter, location } = useApp();

  return (
    <div className="space-y-4">
      {/* Primary Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-lg border border-slate-800">
        {/* Background ambient geometric design */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hyperlocal Grocery & Kirana Network</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Fresh from your favorite <br className="hidden sm:inline" />
              <span className="text-emerald-400">Neighborhood Shops</span> to your doorstep.
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Support local store owners. Get dairy, fresh produce, groceries, and medicines in 15–30 minutes in {location.area}.
            </p>

            {/* Geometric Value Props */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs font-medium text-slate-200">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>15-30 Min Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                <span>Min Order ₹150</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Local Stores</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCustomerView('shops')}
                className="py-3 px-5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer group"
              >
                <Store className="w-4 h-4 text-slate-950" />
                <span>Explore Nearby Shops</span>
                <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Quick highlight geometric cards */}
          <div className="hidden lg:grid grid-cols-2 gap-3 w-72 shrink-0">
            <div
              onClick={() => {
                setSelectedCategoryFilter('Dairy & Eggs');
                setCustomerView('shops');
              }}
              className="p-3.5 rounded-2xl bg-slate-800/60 backdrop-blur-md border border-slate-700/80 hover:bg-slate-800 transition-all cursor-pointer group hover:border-slate-600"
            >
              <span className="text-xl">🥛</span>
              <p className="font-bold text-xs text-white mt-1 group-hover:text-emerald-300">Daily Milk & Eggs</p>
              <p className="text-[10px] text-slate-400">Farm fresh morning A2 milk</p>
            </div>

            <div
              onClick={() => {
                setSelectedCategoryFilter('Fruits & Vegetables');
                setCustomerView('shops');
              }}
              className="p-3.5 rounded-2xl bg-slate-800/60 backdrop-blur-md border border-slate-700/80 hover:bg-slate-800 transition-all cursor-pointer group hover:border-slate-600"
            >
              <span className="text-xl">🍎</span>
              <p className="font-bold text-xs text-white mt-1 group-hover:text-emerald-300">Crisp Farm Veggies</p>
              <p className="text-[10px] text-slate-400">Chemical-free daily greens</p>
            </div>

            <div
              onClick={() => {
                setSelectedCategoryFilter('Pharmacy & Wellness');
                setCustomerView('shops');
              }}
              className="p-3.5 rounded-2xl bg-slate-800/60 backdrop-blur-md border border-slate-700/80 hover:bg-slate-800 transition-all cursor-pointer group hover:border-slate-600"
            >
              <span className="text-xl">💊</span>
              <p className="font-bold text-xs text-white mt-1 group-hover:text-emerald-300">24x7 Pharmacy</p>
              <p className="text-[10px] text-slate-400">Urgent first aid & medicine</p>
            </div>

            <div
              onClick={() => {
                setSelectedCategoryFilter('Bakery & Snacks');
                setCustomerView('shops');
              }}
              className="p-3.5 rounded-2xl bg-slate-800/60 backdrop-blur-md border border-slate-700/80 hover:bg-slate-800 transition-all cursor-pointer group hover:border-slate-600"
            >
              <span className="text-xl">🥐</span>
              <p className="font-bold text-xs text-white mt-1 group-hover:text-emerald-300">Oven Bakery</p>
              <p className="text-[10px] text-slate-400">Breads, cookies & snacks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

