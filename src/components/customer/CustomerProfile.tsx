import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  MapPin,
  Heart,
  Plus,
  Trash2,
  CheckCircle2,
  Store,
  Phone,
  Mail,
  Shield,
  LogOut,
  ExternalLink,
} from 'lucide-react';

export const CustomerProfile: React.FC = () => {
  const {
    currentUser,
    addresses,
    deleteAddress,
    addAddress,
    favoriteShopIds,
    shops,
    setSelectedShopId,
    setCustomerView,
    location,
    setIsLocationModalOpen,
    switchRole,
    logoutUser,
  } = useApp();

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addrName, setAddrName] = useState(currentUser?.name || '');
  const [addrPhone, setAddrPhone] = useState(currentUser?.phone || '');
  const [addrHouse, setAddrHouse] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrArea, setAddrArea] = useState(location.area || 'Koramangala');
  const [addrCity, setAddrCity] = useState(location.city || 'Bengaluru');
  const [addrPincode, setAddrPincode] = useState(location.pincode || '560034');
  const [addrTag, setAddrTag] = useState<'Home' | 'Work' | 'Other'>('Home');

  const favoriteShops = shops.filter((s) => favoriteShopIds.includes(s.id));

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrHouse || !addrPincode) return;

    addAddress({
      fullName: addrName,
      phone: addrPhone,
      houseFlat: addrHouse,
      street: addrStreet || 'Main Road',
      area: addrArea,
      city: addrCity,
      state: 'Karnataka',
      pincode: addrPincode,
      tag: addrTag,
      isDefault: addresses.length === 0,
    });

    setIsAddingAddress(false);
    setAddrHouse('');
    setAddrStreet('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {currentUser?.avatarUrl ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-xs"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-xl">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
          )}

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900">{currentUser?.name || 'Guest Customer'}</h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {currentUser?.phone || '+91 98765 43210'}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {currentUser?.email || 'customer@homesale.in'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={logoutUser}
            className="px-3.5 py-2 border border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 text-slate-600 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Saved Addresses Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Saved Addresses</h3>
              </div>
              {!isAddingAddress && (
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(true)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              )}
            </div>

            {/* List */}
            <div className="space-y-2.5">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{addr.fullName}</span>
                      <span className="text-[10px] font-bold uppercase bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                        {addr.tag}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 font-medium">{addr.houseFlat}, {addr.street}</p>
                    <p className="text-slate-500">{addr.area}, {addr.city} - {addr.pincode}</p>
                    <p className="text-slate-400 font-mono text-[11px]">Phone: {addr.phone}</p>
                  </div>

                  {addresses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteAddress(addr.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Address inline form */}
            {isAddingAddress && (
              <form onSubmit={handleCreateAddress} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <p className="text-xs font-bold text-slate-900">Add New Delivery Location</p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={addrName}
                    onChange={(e) => setAddrName(e.target.value)}
                    placeholder="Recipient Name"
                    className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    required
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value)}
                    placeholder="Phone"
                    className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <input
                  type="text"
                  required
                  value={addrHouse}
                  onChange={(e) => setAddrHouse(e.target.value)}
                  placeholder="Flat / House / Building"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    value={addrArea}
                    onChange={(e) => setAddrArea(e.target.value)}
                    placeholder="Area"
                    className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    required
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    placeholder="City"
                    className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={addrPincode}
                    onChange={(e) => setAddrPincode(e.target.value)}
                    placeholder="Pincode"
                    className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-mono"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-lg cursor-pointer hover:bg-emerald-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Favorite Shops Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Favorite Stores ({favoriteShops.length})
                </h3>
              </div>
            </div>

            {favoriteShops.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                You haven't added any favorite stores yet. Click the heart icon on any store card to save it here!
              </p>
            ) : (
              <div className="space-y-2">
                {favoriteShops.map((shop) => (
                  <div
                    key={shop.id}
                    onClick={() => {
                      setSelectedShopId(shop.id);
                      setCustomerView('shop-details');
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between cursor-pointer group bg-slate-50/50 shadow-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={shop.logo}
                        alt={shop.name}
                        className="w-10 h-10 rounded-lg object-cover bg-white shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-slate-900 truncate group-hover:text-emerald-700">
                          {shop.name}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {shop.category} • {shop.area}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Open Store
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location Preferences */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm">Active Service Location</h4>
              <span className="text-[10px] font-bold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">
                {location.isDeliverable ? 'Active' : 'Out of Area'}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Currently browsing stores near <strong className="text-white">{location.area} ({location.pincode})</strong>.
            </p>
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Change Location Pincode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
