import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bike, Lock, User, ArrowLeft, AlertCircle, Clock, Eye, EyeOff, ShieldAlert, ArrowRight } from 'lucide-react';

export const DeliveryLoginPage: React.FC = () => {
  const { deliveryLogin, setAuthView, switchRole, setCustomerView } = useApp();
  const [username, setUsername] = useState('rajesh_rider');
  const [password, setPassword] = useState('rider@123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<{ type: 'pending' | 'rejected' | 'suspended'; msg: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatusNotice(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const res = deliveryLogin(username, password);
      if (!res.success) {
        if (res.error?.includes('waiting for Admin approval')) {
          setStatusNotice({ type: 'pending', msg: res.error });
        } else if (res.error?.includes('rejected')) {
          setStatusNotice({ type: 'rejected', msg: res.error });
        } else if (res.error?.includes('suspended')) {
          setStatusNotice({ type: 'suspended', msg: res.error });
        } else {
          setError(res.error || 'Invalid Delivery Partner username or password.');
        }
      }
      setIsSubmitting(false);
    }, 300);
  };

  const handleSetPreset = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setError(null);
    setStatusNotice(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Bar */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            setAuthView(null);
            switchRole('customer');
            setCustomerView('home');
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-slate-200/60"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        <span className="text-[11px] font-semibold text-blue-800 bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-full flex items-center gap-1">
          <Bike className="w-3.5 h-3.5" />
          <span>Rider Portal</span>
        </span>
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full mx-auto my-auto py-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 mb-3 text-white">
              <Bike className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Delivery Partner Login</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Access your rider console, pickup assignments, navigation routes and live daily earnings.
            </p>
          </div>

          {/* Quick Demo Accounts Helper */}
          <div className="mb-5 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-700 block mb-2">Demo Accounts for Testing:</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleSetPreset('rajesh_rider', 'rider@123')}
                className="p-2 rounded-xl bg-white border border-blue-200 text-left hover:bg-blue-50/50 transition-colors cursor-pointer"
              >
                <div className="font-bold text-blue-800 text-[11px]">Approved Rider</div>
                <div className="text-[10px] text-slate-500 font-mono">rajesh_rider</div>
              </button>

              <button
                type="button"
                onClick={() => handleSetPreset('sunil_express', 'rider@123')}
                className="p-2 rounded-xl bg-white border border-amber-200 text-left hover:bg-amber-50/50 transition-colors cursor-pointer"
              >
                <div className="font-bold text-amber-800 text-[11px]">Pending Approval</div>
                <div className="text-[10px] text-slate-500 font-mono">sunil_express</div>
              </button>
            </div>
          </div>

          {/* Status Notices */}
          {statusNotice && (
            <div
              className={`mb-5 p-3.5 rounded-2xl flex items-start gap-3 text-xs ${
                statusNotice.type === 'pending'
                  ? 'bg-amber-50 border border-amber-200 text-amber-900'
                  : statusNotice.type === 'rejected'
                  ? 'bg-rose-50 border border-rose-200 text-rose-900'
                  : 'bg-slate-100 border border-slate-300 text-slate-900'
              }`}
            >
              {statusNotice.type === 'pending' ? (
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold text-[13px]">{statusNotice.msg}</p>
                {statusNotice.type === 'pending' && (
                  <p className="text-[11px] text-amber-700 mt-1">
                    HOMESALE Administrators verify your driving license and vehicle details before activating your rider account.
                  </p>
                )}
                {statusNotice.type === 'rejected' && (
                  <p className="text-[11px] text-rose-700 mt-1">
                    Please contact admin@homesale.in to appeal or update your details.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{error}</p>
                <p className="text-[11px] text-rose-600 mt-0.5">Please check your rider username and password.</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Rider Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error || statusNotice) {
                      setError(null);
                      setStatusNotice(null);
                    }
                  }}
                  placeholder="e.g. rajesh_rider"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error || statusNotice) {
                      setError(null);
                      setStatusNotice(null);
                    }
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <Bike className="w-4 h-4" />
                  <span>Log In as Delivery Partner</span>
                </>
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600 mb-2">Want to earn delivering with HOMESALE?</p>
            <button
              type="button"
              onClick={() => setAuthView('delivery-register')}
              className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Join as Delivery Partner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md w-full mx-auto text-center text-[11px] text-slate-400">
        HOMESALE Rider Fleet Network • Earn ₹500 - ₹1,200 Daily
      </div>
    </div>
  );
};
