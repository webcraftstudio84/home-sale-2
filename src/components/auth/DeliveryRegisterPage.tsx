import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bike, User, Phone, Mail, MapPin, ShieldCheck, Clock, CheckCircle2, Sparkles, ArrowLeft } from 'lucide-react';

export const DeliveryRegisterPage: React.FC = () => {
  const { deliveryRegister, setAuthView, switchRole } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [vehicleType, setVehicleType] = useState<'Bike' | 'Scooter' | 'Bicycle' | 'EV'>('Bike');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [preferredArea, setPreferredArea] = useState('Koramangala & HSR Layout');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = deliveryRegister({
      name,
      phone,
      email,
      address,
      vehicleType,
      vehicleNumber,
      preferredArea,
      username,
      password,
    });

    if (res.success) {
      setIsSubmitted(true);
      setSubmittedMessage(res.message);
    } else {
      setError(res.error || res.message);
    }
  };

  const handleFillSample = () => {
    setName('Kiran Kumar Yadav');
    setPhone('+91 97411 33221');
    setEmail('kiran.rider@gmail.com');
    setAddress('Flat #104, Green Heights, 6th Main, Koramangala');
    setVehicleType('EV');
    setVehicleNumber('KA-01-EV-4422');
    setPreferredArea('Koramangala, Indiranagar, Domlur');
    setUsername('kiran_rider_' + Math.floor(100 + Math.random() * 900));
    setPassword('rider@123');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full mx-auto">
        {/* Navigation bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => setAuthView('delivery-login')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-slate-200/60"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Rider Login</span>
          </button>

          <button
            type="button"
            onClick={handleFillSample}
            className="text-xs font-bold text-blue-700 bg-blue-100/80 hover:bg-blue-100 border border-blue-300/80 px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Fill Sample Rider</span>
          </button>
        </div>

        {/* Successful Registration Screen */}
        {isSubmitted ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 border-2 border-amber-300 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                Application Status: Pending Approval
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight pt-2">
                Application Submitted!
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                {submittedMessage}
              </p>
            </div>

            {/* Registration Summary Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs max-w-md mx-auto space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Rider Name</span>
                <span className="font-bold text-slate-900">{name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Vehicle</span>
                <span className="font-semibold text-slate-800">{vehicleType} ({vehicleNumber})</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Username</span>
                <span className="font-mono font-bold text-blue-700">{username}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-500 font-medium">Preferred Area</span>
                <span className="font-semibold text-slate-700">{preferredArea}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setAuthView(null);
                  switchRole('admin');
                }}
                className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Switch to Admin Panel to Review & Approve</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthView('delivery-login')}
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer"
              >
                Go to Delivery Login
              </button>
            </div>
          </div>
        ) : (
          /* Application Form */
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <div className="flex items-center gap-2 text-blue-700 font-extrabold text-xs uppercase tracking-wider mb-1">
                <Bike className="w-4 h-4" />
                <span>Rider Partner Fleet</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Join HOMESALE as Delivery Partner
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Earn flexible payouts with ₹35-₹60 per delivery, instant wallet withdrawals, and weekly delivery bonuses.
              </p>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold">
                {error}
              </div>
            )}

            {/* Rider Info */}
            <div className="space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                  1
                </span>
                <span>Personal Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sunil Gowda"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98450 11223"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rider@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Residential Address *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Door #, Street, Locality"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle & Area */}
            <div className="space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                  2
                </span>
                <span>Vehicle & Delivery Zone</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Type *</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option value="Bike">Motorcycle / Bike</option>
                    <option value="Scooter">Scooter / Moped</option>
                    <option value="EV">Electric Scooter (EV)</option>
                    <option value="Bicycle">Bicycle (Ultra Local)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Registration Number *</label>
                  <input
                    type="text"
                    required
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    placeholder="KA-01-EJ-1234"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-mono text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Delivery Area *</label>
                  <input
                    type="text"
                    required
                    value={preferredArea}
                    onChange={(e) => setPreferredArea(e.target.value)}
                    placeholder="e.g. Koramangala, BTM Layout, HSR"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Account Credentials */}
            <div className="space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                  3
                </span>
                <span>Rider Account Credentials</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. sunil_express"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create your login password"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Disclaimer & Submit */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Approval Notice:</strong> After application submission, your rider profile is placed in <strong>Pending Approval</strong>. The admin team will verify documents and activate your account.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Partner Application</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
