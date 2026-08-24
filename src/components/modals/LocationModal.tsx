import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Search, CheckCircle, AlertTriangle, X, Compass, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LocationModal: React.FC = () => {
  const { isLocationModalOpen, setIsLocationModalOpen, location, setLocation, checkPincode, deliveryZones } = useApp();

  const [pincodeInput, setPincodeInput] = useState(location.pincode);
  const [areaInput, setAreaInput] = useState(location.area);
  const [cityInput, setCityInput] = useState(location.city);

  if (!isLocationModalOpen) return null;

  const currentCheck = checkPincode(pincodeInput);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincodeInput.trim() || pincodeInput.trim().length < 6) return;
    setLocation({
      area: areaInput.trim() || 'Downtown',
      city: cityInput.trim() || 'Bengaluru',
      pincode: pincodeInput.trim(),
    });
  };

  const handleSelectPreset = (preset: { area: string; city: string; pincode: string }) => {
    setPincodeInput(preset.pincode);
    setAreaInput(preset.area);
    setCityInput(preset.city);
    setLocation(preset);
  };

  const presets = [
    { area: 'Koramangala 4th Block', city: 'Bengaluru', pincode: '560034', isSupported: true },
    { area: 'Indiranagar 100ft Rd', city: 'Bengaluru', pincode: '560038', isSupported: true },
    { area: 'HSR Layout Sector 2', city: 'Bengaluru', pincode: '560102', isSupported: true },
    { area: 'Bandra West (Linking Rd)', city: 'Mumbai', pincode: '400050', isSupported: true },
    { area: 'Connaught Place (Inner Circle)', city: 'Delhi', pincode: '110001', isSupported: true },
    { area: 'Remote Suburb (Out of zone demo)', city: 'Mysuru', pincode: '570001', isSupported: false },
  ];

  return (
    <AnimatePresence>
      <div id="location-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Select Delivery Location</h3>
                <p className="text-xs text-slate-500">HOMESALE delivers hyperlocally in supported zones</p>
              </div>
            </div>
            <button
              onClick={() => setIsLocationModalOpen(false)}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* Input Form */}
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  6-Digit Postal Pincode
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit Pincode (e.g. 560034)"
                    className="w-full pl-4 pr-10 py-2.5 text-sm font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 tracking-wider bg-white"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {pincodeInput.length === 6 && (
                      currentCheck.isDeliverable ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Area / Locality
                  </label>
                  <input
                    type="text"
                    value={areaInput}
                    onChange={(e) => setAreaInput(e.target.value)}
                    placeholder="e.g. Koramangala"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    placeholder="e.g. Bengaluru"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>

              {/* Real-time feedback alert */}
              {pincodeInput.length === 6 && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                    currentCheck.isDeliverable
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                >
                  {currentCheck.isDeliverable ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    {currentCheck.isDeliverable ? (
                      <p className="font-semibold">
                        Service Available in {currentCheck.zone?.name}! Standard delivery ₹{currentCheck.zone?.standardDeliveryCharge} (Estimated {currentCheck.zone?.estimatedTimeMin} mins).
                      </p>
                    ) : (
                      <p className="font-semibold">
                        Sorry! HOMESALE is currently not available in your location. (Checkout will be disabled for this pincode).
                      </p>
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                Confirm Location
              </button>
            </form>

            {/* Quick Demo Presets */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Popular Demo Delivery Zones
                </p>
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <Compass className="w-3 h-3" /> 1-Click Select
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.pincode}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between group cursor-pointer ${
                      location.pincode === preset.pincode
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-medium'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold truncate text-slate-900 group-hover:text-emerald-700">
                        {preset.area}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {preset.city} • <span className="font-mono">{preset.pincode}</span>
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        preset.isSupported
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {preset.isSupported ? 'Active' : 'Test Out'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
