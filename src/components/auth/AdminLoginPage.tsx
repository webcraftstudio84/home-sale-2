import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, User, ArrowLeft, CheckCircle2, AlertCircle, KeyRound, Eye, EyeOff } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { adminLogin, setAuthView, setCustomerView, switchRole } = useApp();
  const [username, setUsername] = useState('HOMESALEADMIN');
  const [password, setPassword] = useState('homesale@123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const res = adminLogin(username, password);
      if (!res.success) {
        setError(res.error || 'Invalid Admin username or password.');
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
      }
    }, 300);
  };

  const handleFillDemo = () => {
    setUsername('HOMESALEADMIN');
    setPassword('homesale@123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            setAuthView(null);
            switchRole('customer');
            setCustomerView('home');
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to HOMESALE Store</span>
        </button>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Admin Portal</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full mx-auto my-auto py-6">
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Header Icon */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-900/40 mb-3 border border-purple-400/30">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">HOMESALE Admin Console</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Platform administration, shop approvals, delivery partner verification & live governance.
            </p>
          </div>

          {/* Demo Credentials Box */}
          <div className="mb-6 p-3.5 bg-slate-900/80 border border-slate-700 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Default Demo Admin Credentials</span>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 underline cursor-pointer"
              >
                Auto-Fill
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-sans">Username</span>
                <span className="text-purple-300 font-bold">HOMESALEADMIN</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase font-sans">Password</span>
                <span className="text-purple-300 font-bold">homesale@123</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 bg-rose-950/80 border border-rose-800/80 rounded-2xl flex items-start gap-2.5 text-rose-200 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-300">{error}</p>
                <p className="text-[11px] text-rose-400 mt-0.5">Please check your username and password.</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Admin Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="HOMESALEADMIN"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Admin Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Log In as Admin</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Switch to other logins */}
          <div className="mt-6 pt-4 border-t border-slate-700/60 flex flex-col gap-2 text-center text-xs text-slate-400">
            <span>Looking for partner portals?</span>
            <div className="flex items-center justify-center gap-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAuthView('shopkeeper-login')}
                className="text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
              >
                Shopkeeper Login
              </button>
              <span className="text-slate-600">•</span>
              <button
                type="button"
                onClick={() => setAuthView('delivery-login')}
                className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
              >
                Delivery Rider Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md w-full mx-auto text-center text-[11px] text-slate-500">
        HOMESALE Hyperlocal Commerce Platform • Protected Administrator Session
      </div>
    </div>
  );
};
