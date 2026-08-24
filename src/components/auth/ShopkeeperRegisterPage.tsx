import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Store, User, Phone, Mail, MapPin, Clock, Lock, ArrowLeft, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Image as ImageIcon } from 'lucide-react';

const CATEGORIES = [
  'Grocery & Staples',
  'Fruits & Vegetables',
  'Bakery & Snacks',
  'Pharmacy & Wellness',
  'Dairy & Eggs',
  'Meat & Seafood',
  'Electronics & Mobiles',
  'Home & Kitchen',
];

const SAMPLE_LOGOS = [
  { label: 'Kirana', url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=200&q=80' },
  { label: 'Fresh Produce', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80' },
  { label: 'Artisan Bakery', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=200&q=80' },
  { label: 'Dairy Farm', url: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=200&q=80' },
];

export const ShopkeeperRegisterPage: React.FC = () => {
  const { shopkeeperRegister, setAuthView, switchRole, setCustomerView } = useApp();

  // Form State
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('Koramangala');
  const [city, setCity] = useState('Bengaluru');
  const [pincode, setPincode] = useState('560034');
  const [phone, setPhone] = useState('');
  const [openingTime, setOpeningTime] = useState('08:00 AM');
  const [closingTime, setClosingTime] = useState('10:00 PM');
  const [logo, setLogo] = useState(SAMPLE_LOGOS[0].url);
  const [banner, setBanner] = useState('https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1000&q=80');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = shopkeeperRegister({
      ownerName,
      ownerPhone,
      ownerEmail,
      shopName,
      category,
      description,
      address,
      area,
      city,
      pincode,
      phone: phone || ownerPhone,
      openingTime,
      closingTime,
      logo,
      banner,
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
    setOwnerName('Mohan Lal Gupta');
    setOwnerPhone('+91 98455 77889');
    setOwnerEmail('gupta.provisions@gmail.com');
    setUsername('gupta_kirana_' + Math.floor(100 + Math.random() * 900));
    setPassword('shop@123');
    setShopName('Gupta Super Kirana & Fresh Produce');
    setCategory('Grocery & Staples');
    setDescription('Serving best quality branded pulses, cold pressed mustard oil, fresh grains and dry fruits at neighborhood discount prices.');
    setAddress('Shop #22, 1st Cross, Near Ganapathi Temple, 5th Block');
    setArea('Koramangala');
    setCity('Bengaluru');
    setPincode('560034');
    setPhone('+91 98455 77889');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full mx-auto">
        {/* Navigation bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => setAuthView('shopkeeper-login')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-slate-200/60"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shopkeeper Login</span>
          </button>

          <button
            type="button"
            onClick={handleFillSample}
            className="text-xs font-bold text-emerald-700 bg-emerald-100/80 hover:bg-emerald-100 border border-emerald-300/80 px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Fill Sample Shop</span>
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
                Registration Submitted Successfully!
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                {submittedMessage}
              </p>
            </div>

            {/* Registration Summary Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs max-w-md mx-auto space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Shop Name</span>
                <span className="font-bold text-slate-900">{shopName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Owner Name</span>
                <span className="font-bold text-slate-900">{ownerName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Username</span>
                <span className="font-mono font-bold text-emerald-800">{username}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-500 font-medium">Location</span>
                <span className="font-semibold text-slate-700">{area}, {city} ({pincode})</span>
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
                onClick={() => setAuthView('shopkeeper-login')}
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer"
              >
                Go to Shopkeeper Login
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-xs uppercase tracking-wider mb-1">
                <Store className="w-4 h-4" />
                <span>Merchant Onboarding</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                List Your Shop on HOMESALE
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Expand your neighborhood kirana, bakery, or pharmacy online. Reach 10,000+ local homes within 3 km with zero listing commission.
              </p>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold">
                {error}
              </div>
            )}

            {/* Section 1: Owner & Credentials */}
            <div className="space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                  1
                </span>
                <span>Store Owner & Account Credentials</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Owner Full Name *</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Owner Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    placeholder="owner@stores.in"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Desired Username *</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. patel_kirana"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Account Password *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Shop Details */}
            <div className="space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                  2
                </span>
                <span>Shop Profile & Business Category</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Shop Name *</label>
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g. Sri Krishna Provision & Supermarket"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Business Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Store Helpline Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="If different from owner phone"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Store Description / Specialities *</label>
                  <textarea
                    required
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your specialties (e.g., fresh dairy, organic pulses, cold-pressed oils)..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Opening Time</label>
                  <input
                    type="text"
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
                    placeholder="07:00 AM"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Closing Time</label>
                  <input
                    type="text"
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                    placeholder="10:30 PM"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Shop Location */}
            <div className="space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                  3
                </span>
                <span>Physical Store Location & Service Pincode</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Complete Street Address *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Shop #, Building Name, Main Road / Landmark"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Area / Locality *</label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Koramangala"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="560034"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Sample Logos selection */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">Select Store Logo Preset</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SAMPLE_LOGOS.map((item) => (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => setLogo(item.url)}
                    className={`p-2 rounded-2xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                      logo === item.url
                        ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <img src={item.url} alt={item.label} className="w-8 h-8 rounded-xl object-cover" />
                    <span className="text-[11px] font-bold text-slate-800">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Disclaimer & Submit */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Approval Notice:</strong> After submission, your shop application will be in <strong>Pending Approval</strong> state until verified by a HOMESALE Administrator.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Shop Application for Approval</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
