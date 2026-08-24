import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { INITIAL_USERS } from '../../data/mockData';
import { UserCheck, Store, Bike, Shield, X, Lock, Phone, Mail, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginUser,
    switchRole,
  } = useApp();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isAuthModalOpen) return null;

  const handleDemoLogin = (role: UserRole) => {
    switchRole(role);
    setIsAuthModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo login simulation
    const mockUser = {
      id: 'user-' + Date.now(),
      name: name.trim() || 'Aarav Sharma',
      phone: emailOrPhone.includes('@') ? '+91 98765 43210' : emailOrPhone || '+91 98765 43210',
      email: emailOrPhone.includes('@') ? emailOrPhone : 'aarav.sharma@example.com',
      role: 'customer' as UserRole,
    };
    loginUser(mockUser);
  };

  return (
    <AnimatePresence>
      <div id="auth-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="font-extrabold text-emerald-700 tracking-tight text-lg">HOMESALE</span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Demo</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                {authModalMode === 'login' && 'Sign in to your account'}
                {authModalMode === 'signup' && 'Create your HOMESALE account'}
                {authModalMode === 'forgot' && 'Reset your password'}
              </h3>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* Quick 1-Click Role Switcher for Testing */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1-Click Demo Accounts
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('customer')}
                  className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50 text-left transition-all text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                  <span>Customer</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('shopkeeper')}
                  className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50 text-left transition-all text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Store className="w-3.5 h-3.5" />
                  </div>
                  <span>Shopkeeper</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('delivery')}
                  className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50 text-left transition-all text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Bike className="w-3.5 h-3.5" />
                  </div>
                  <span>Delivery Partner</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('admin')}
                  className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50 text-left transition-all text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <span>Admin</span>
                </button>
              </div>
            </div>

            {/* Regular Form UI */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {authModalMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number or Email</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="+91 98765 43210 or email"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {authModalMode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">Password / OTP</label>
                    {authModalMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setAuthModalMode('forgot')}
                        className="text-[11px] text-emerald-600 hover:underline font-medium cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 text-sm cursor-pointer mt-2"
              >
                <span>
                  {authModalMode === 'login' && 'Sign In'}
                  {authModalMode === 'signup' && 'Create Account'}
                  {authModalMode === 'forgot' && 'Send Reset Link'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Footer switcher */}
            <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100">
              {authModalMode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('signup')}
                    className="text-emerald-600 font-bold hover:underline ml-1 cursor-pointer"
                  >
                    Sign up now
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('login')}
                    className="text-emerald-600 font-bold hover:underline ml-1 cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
