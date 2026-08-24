import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Address } from '../../types';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Plus,
  CheckCircle2,
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Smartphone,
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    minOrderRequirement,
    cartDeliveryCharge,
    cartGrandTotal,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    addAddress,
    placeOrder,
    setCustomerView,
    location,
    setIsLocationModalOpen,
    shops,
    currentUser,
    setIsAuthModalOpen,
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Address form state
  const [newAddrFullName, setNewAddrFullName] = useState(currentUser?.name || '');
  const [newAddrPhone, setNewAddrPhone] = useState(currentUser?.phone || '');
  const [newAddrHouse, setNewAddrHouse] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrArea, setNewAddrArea] = useState(location.area || 'Koramangala');
  const [newAddrCity, setNewAddrCity] = useState(location.city || 'Bengaluru');
  const [newAddrPincode, setNewAddrPincode] = useState(location.pincode || '560034');
  const [newAddrTag, setNewAddrTag] = useState<'Home' | 'Work' | 'Other'>('Home');

  const currentShop = shops.find((s) => s.id === cart.shopId);
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  // Validation Checks
  const isCartEmpty = cart.items.length === 0;
  const isMinOrderMet = minOrderRequirement.isMet;
  const isShopActive = currentShop?.status === 'active' && currentShop.isOpen;
  const isAddressDeliverable = location.isDeliverable;

  const canPlaceOrder =
    !isCartEmpty &&
    isMinOrderMet &&
    isAddressDeliverable &&
    Boolean(selectedAddress) &&
    !isSubmitting;

  const handleAddNewAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrFullName || !newAddrPhone || !newAddrHouse || !newAddrPincode) return;

    const created = addAddress({
      fullName: newAddrFullName,
      phone: newAddrPhone,
      houseFlat: newAddrHouse,
      street: newAddrStreet || 'Main Road',
      area: newAddrArea,
      city: newAddrCity,
      state: 'Karnataka',
      pincode: newAddrPincode,
      tag: newAddrTag,
      isDefault: true,
    });

    setSelectedAddressId(created.id);
    setIsAddingNewAddress(false);
  };

  const handlePlaceOrder = async () => {
    if (!canPlaceOrder) return;
    setIsSubmitting(true);

    // Confetti effect
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#34d399', '#f59e0b'],
      });
    } catch (e) {
      // fallback if canvas not available
    }

    setTimeout(async () => {
      await placeOrder(paymentMethod, deliveryInstructions);
      setIsSubmitting(false);
    }, 600);
  };

  if (isCartEmpty) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">
          Add items worth at least ₹150 from any neighborhood shop to proceed with checkout.
        </p>
        <button
          type="button"
          onClick={() => setCustomerView('shops')}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
        >
          Browse Shops
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCustomerView('shops')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-colors shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shopping</span>
        </button>

        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Checkout & Order Confirmation
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Address, Delivery Instructions & Payment */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section 1: Delivery Address */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Delivery Address
                </h3>
              </div>

              {!isAddingNewAddress && (
                <button
                  type="button"
                  onClick={() => setIsAddingNewAddress(true)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              )}
            </div>

            {/* Deliverability notice */}
            {!isAddressDeliverable && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">Service Area Limitation</p>
                  <p className="text-[11px] text-amber-800">
                    Sorry! HOMESALE is currently not available in your selected location ({location.pincode}).
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsLocationModalOpen(true)}
                    className="mt-1 text-[11px] font-bold text-amber-900 underline cursor-pointer"
                  >
                    Select an active demo pincode
                  </button>
                </div>
              </div>
            )}

            {/* Saved Addresses Selector */}
            {!isAddingNewAddress ? (
              <div className="space-y-2.5">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      selectedAddress?.id === addr.id
                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <MapPin
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          selectedAddress?.id === addr.id
                            ? 'text-emerald-600'
                            : 'text-slate-400'
                        }`}
                      />
                      <div className="text-xs space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900">{addr.fullName}</p>
                          {addr.tag && (
                            <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded">
                              {addr.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 font-medium">
                          {addr.houseFlat}, {addr.street}
                        </p>
                        <p className="text-slate-500">
                          {addr.area}, {addr.city} — <span className="font-mono">{addr.pincode}</span>
                        </p>
                        <p className="text-slate-500 font-mono text-[11px]">
                          Phone: {addr.phone}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selectedAddress?.id === addr.id
                            ? 'border-emerald-600 bg-emerald-600'
                            : 'border-slate-300'
                        }`}
                      >
                        {selectedAddress?.id === addr.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Add New Address Form */
              <form onSubmit={handleAddNewAddressSubmit} className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-800">Enter Delivery Address</p>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(false)}
                    className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    required
                    value={newAddrFullName}
                    onChange={(e) => setNewAddrFullName(e.target.value)}
                    placeholder="Recipient Full Name"
                    className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    required
                    value={newAddrPhone}
                    onChange={(e) => setNewAddrPhone(e.target.value)}
                    placeholder="Phone Number (+91)"
                    className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <input
                  type="text"
                  required
                  value={newAddrHouse}
                  onChange={(e) => setNewAddrHouse(e.target.value)}
                  placeholder="Flat / House No. / Building Name"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />

                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    value={newAddrArea}
                    onChange={(e) => setNewAddrArea(e.target.value)}
                    placeholder="Area"
                    className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    required
                    value={newAddrCity}
                    onChange={(e) => setNewAddrCity(e.target.value)}
                    placeholder="City"
                    className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={newAddrPincode}
                    onChange={(e) => setNewAddrPincode(e.target.value)}
                    placeholder="Pincode"
                    className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {(['Home', 'Work', 'Other'] as const).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setNewAddrTag(tag)}
                      className={`px-3 py-1 text-xs rounded-lg font-semibold border cursor-pointer ${
                        newAddrTag === tag
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs mt-1 cursor-pointer"
                >
                  Save and Use Address
                </button>
              </form>
            )}

            {/* Delivery Instructions note */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                placeholder="e.g. Ring bell twice, leave package at door if unavailable"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Payment Option
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* UPI */}
              <div
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left space-y-2 shadow-xs ${
                  paymentMethod === 'UPI'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'UPI' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                    }`}
                  >
                    {paymentMethod === 'UPI' && <div className="w-1 h-1 rounded-full bg-white" />}
                  </div>
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900">UPI Instant</p>
                  <p className="text-[10px] text-slate-500">GPay, PhonePe, Paytm</p>
                </div>
              </div>

              {/* Cash On Delivery */}
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left space-y-2 shadow-xs ${
                  paymentMethod === 'COD'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Banknote className="w-5 h-5 text-amber-600" />
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'COD' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                    }`}
                  >
                    {paymentMethod === 'COD' && <div className="w-1 h-1 rounded-full bg-white" />}
                  </div>
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900">Cash on Delivery</p>
                  <p className="text-[10px] text-slate-500">Pay cash upon arrival</p>
                </div>
              </div>

              {/* Cards */}
              <div
                onClick={() => setPaymentMethod('Card')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left space-y-2 shadow-xs ${
                  paymentMethod === 'Card'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'Card' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                    }`}
                  >
                    {paymentMethod === 'Card' && <div className="w-1 h-1 rounded-full bg-white" />}
                  </div>
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900">Credit / Debit Card</p>
                  <p className="text-[10px] text-slate-500">Visa, Mastercard, RuPay</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary, ₹150 Check & Place Order */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                {cart.shopName}
              </span>
            </h3>

            {/* Items Recap */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cart.items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-lg object-cover bg-slate-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{product.name}</p>
                      <p className="text-[11px] text-slate-400">
                        {quantity} × ₹{product.price} ({product.unit})
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    ₹{product.price * quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Minimum Order Check Banner */}
            {!isMinOrderMet && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Minimum Order Requirement (₹150)</p>
                  <p className="text-[11px]">
                    Add ₹{minOrderRequirement.deficit} more to reach the minimum order of ₹150.
                  </p>
                </div>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Product Subtotal</span>
                <span className="font-semibold text-slate-900">₹{cartSubtotal}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <span>Delivery Charges</span>
                  <span className="text-[10px] text-slate-400">(Calculated separately)</span>
                </span>
                <span className="font-semibold text-slate-900">₹{cartDeliveryCharge}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Platform & Handling</span>
                <span className="font-semibold text-emerald-700">FREE</span>
              </div>
              <div className="flex items-center justify-between text-sm sm:text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Grand Total</span>
                <span className="text-emerald-700">₹{cartGrandTotal}</span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="button"
              disabled={!canPlaceOrder}
              onClick={handlePlaceOrder}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              {isSubmitting ? (
                <span>Placing Your Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Place Order • ₹{cartGrandTotal}</span>
                </>
              )}
            </button>

            {/* Reassurance */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & Secure Hyperlocal Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
