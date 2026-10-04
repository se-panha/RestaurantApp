import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Banknote,
  Utensils,
  ShoppingBag,
  User,
  Phone,
  ShieldCheck,
  Check,
  Lock,
  Zap,
  Info,
  Plus
} from 'lucide-react';
import { CartItem, OrderType, PaymentMethod, User as UserType, SavedCard } from '../../types/restaurant';
import { playTapChime, playSuccessChime } from '../../utils/audioChime';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  user: UserType;
  cartSummary?: {
    subtotal: number;
    discount: number;
    tax: number;
    tip: number;
    total: number;
    splitCount: number;
    perPersonTotal: number;
    selectedTable?: string;
    orderType?: 'dine_in' | 'takeaway';
  };
  onSaveCard?: (card: SavedCard) => void;
  onPlaceOrder: (orderData: {
    orderType: OrderType;
    tableNumber?: string;
    paymentMethod: PaymentMethod;
    specialRequest: string;
    subtotal: number;
    discount: number;
    tax: number;
    tip: number;
    splitCount: number;
    total: number;
  }) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  user,
  cartSummary,
  onSaveCard,
  onPlaceOrder,
}) => {
  if (!isOpen) return null;

  const [orderType, setOrderType] = useState<OrderType>(cartSummary?.orderType || 'dine_in');
  const [tableNumber, setTableNumber] = useState(
    cartSummary?.selectedTable || 'Table #01 (Riverside Window · 2 Guests)'
  );
  const [paymentMethod, setPaymentMethod] = useState<'khqr' | 'card'>('khqr');
  const [specialRequest, setSpecialRequest] = useState('');
  const [pickupTime, setPickupTime] = useState('In 20-25 mins (Fresh from Wok)');

  // Credit Card Flow State (Real App Behavior)
  const [useRegisteredCard, setUseRegisteredCard] = useState<boolean>(Boolean(user.saved_card));
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardHolder, setNewCardHolder] = useState(user.name);
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');
  const [saveNewCard, setSaveNewCard] = useState(true);
  const [cardError, setCardError] = useState('');

  // Calculations: Cambodia VAT (10%), zero tips, zero bill-splitting
  const subtotal = cartSummary ? cartSummary.subtotal : cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const discount = cartSummary ? cartSummary.discount : (subtotal > 20 ? 2.0 : 0);
  const tax = cartSummary ? cartSummary.tax : Math.round(subtotal * 0.10 * 100) / 100;
  const total = cartSummary ? cartSummary.total : Math.max(0, subtotal - discount + tax);

  // Card input formatters
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setNewCardNumber(formatted);
    setCardError('');
  };

  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setNewCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setNewCardExpiry(raw);
    }
    setCardError('');
  };

  const handleCvvChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    setNewCardCvv(raw);
    setCardError('');
  };

  // Detect card brand
  const getCardBrand = (numberStr: string) => {
    const clean = numberStr.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (clean.startsWith('5')) return 'Mastercard';
    if (clean.startsWith('35')) return 'JCB';
    if (clean.startsWith('62')) return 'UnionPay';
    return 'Credit / Debit';
  };

  const handleSubmit = () => {
    // Validation for Card if paying with new card
    if (paymentMethod === 'card' && (!user.saved_card || !useRegisteredCard)) {
      const cleanNum = newCardNumber.replace(/\s/g, '');
      if (cleanNum.length < 15) {
        setCardError('Please enter a valid 16-digit card number.');
        return;
      }
      if (!newCardExpiry || newCardExpiry.length < 5) {
        setCardError('Please enter a valid expiry date (MM/YY).');
        return;
      }
      if (!newCardCvv || newCardCvv.length < 3) {
        setCardError('Please enter a valid 3-digit CVV.');
        return;
      }

      // If user chose to save this card to their account
      if (saveNewCard && onSaveCard) {
        const brand = cleanNum.startsWith('4')
          ? 'visa'
          : cleanNum.startsWith('5')
          ? 'mastercard'
          : 'visa';
        const [expMonth, expYear] = newCardExpiry.split('/');
        onSaveCard({
          id: `crd_${Date.now()}`,
          card_holder: newCardHolder.toUpperCase(),
          brand,
          last4: cleanNum.slice(-4),
          exp_month: expMonth || '12',
          exp_year: expYear || '28',
        });
      }
    }

    playSuccessChime();
    onPlaceOrder({
      orderType,
      tableNumber: orderType === 'dine_in' ? tableNumber : undefined,
      paymentMethod,
      specialRequest,
      subtotal,
      discount,
      tax,
      tip: 0,
      splitCount: 1,
      total,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/50 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white border-t border-amber-200/90 rounded-t-[36px] overflow-hidden max-h-[92vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="p-4 px-5 border-b border-stone-200 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-sm font-bold text-stone-900 tracking-tight">Checkout &amp; Bill Settlement</h2>
            <p className="text-[10px] text-stone-500">Order verification &amp; payment method</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center hover:bg-stone-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto no-scrollbar flex-1 p-5 space-y-4 pb-32 bg-white">
          
          {/* 1. Dining Destination & Table Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Dining Destination
            </label>
            <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl border border-stone-200 text-xs">
              <button
                type="button"
                onClick={() => {
                  playTapChime();
                  setOrderType('dine_in');
                }}
                className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  orderType === 'dine_in'
                    ? 'terracotta-gradient-bg text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Dine-In Table</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playTapChime();
                  setOrderType('takeaway');
                }}
                className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  orderType === 'takeaway'
                    ? 'terracotta-gradient-bg text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Takeaway Pickup</span>
              </button>
            </div>

            {orderType === 'dine_in' ? (
              <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between text-xs">
                <span className="text-stone-700 font-semibold">Selected Table:</span>
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-amber-950 font-bold focus:outline-none shadow-xs text-xs max-w-[230px]"
                >
                  <option value="Table #01 (Riverside Window · 2 Guests)">Table #01 (Riverside Window · 2 Guests)</option>
                  <option value="Table #02 (Riverside Window · 4 Guests)">Table #02 (Riverside Window · 4 Guests)</option>
                  <option value="Table #03 (Garden Veranda · 4 Guests)">Table #03 (Garden Veranda · 4 Guests)</option>
                  <option value="Table #04 (Garden Veranda · 6 Guests)">Table #04 (Garden Veranda · 6 Guests)</option>
                  <option value="Table #05 (Main Dining Hall · 4 Guests)">Table #05 (Main Dining Hall · 4 Guests)</option>
                  <option value="Table #06 (Main Dining Hall · 2 Guests)">Table #06 (Main Dining Hall · 2 Guests)</option>
                  <option value="Table #07 (Terrace Pavilion · 4 Guests)">Table #07 (Terrace Pavilion · 4 Guests)</option>
                  <option value="Table #08 (Terrace Pavilion · 6 Guests)">Table #08 (Terrace Pavilion · 6 Guests)</option>
                </select>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                <span className="text-stone-700 font-medium">Pickup Ready Time:</span>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-stone-800 focus:outline-none shadow-xs"
                >
                  <option>In 15-20 mins (Quick Plated)</option>
                  <option>In 20-25 mins (Standard)</option>
                  <option>In 45 mins (Later)</option>
                </select>
              </div>
            )}
          </div>

          {/* 2. Customer Profile Details */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5 text-xs">
            <div className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
              Patron Profile
            </div>
            <div className="flex items-center justify-between text-stone-700">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-amber-700" />
                <span className="font-semibold text-stone-900">{user.name}</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-500 font-mono">
                <Phone className="w-3 h-3" />
                <span>{user.phone}</span>
              </div>
            </div>
          </div>

          {/* 3. Payment Method Choice */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Select Payment Channel
            </div>

            <div className="space-y-2.5">
              {/* Option 1: Bakong KHQR */}
              <div
                onClick={() => {
                  playTapChime();
                  setPaymentMethod('khqr');
                }}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'khqr'
                    ? 'border-amber-600 bg-amber-50/80 shadow-xs'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-extrabold text-xs shadow-xs tracking-tighter">
                    KHQR
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <span>Bakong KHQR National Pay</span>
                      <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] rounded font-bold">
                        Recommended
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-500">
                      ABA Bank, ACLEDA, Wing, Canadia &amp; NBC Member Banks
                    </div>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'khqr' ? 'border-amber-600 bg-amber-600' : 'border-stone-400'
                  }`}
                >
                  {paymentMethod === 'khqr' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                </div>
              </div>

              {/* Option 2: Credit / Debit Card (Real App Registered Card vs New Card Form) */}
              <div
                className={`p-3.5 rounded-2xl border transition-all ${
                  paymentMethod === 'card'
                    ? 'border-amber-600 bg-amber-50/40 shadow-xs'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div
                  onClick={() => {
                    playTapChime();
                    setPaymentMethod('card');
                  }}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">Credit / Debit Card</div>
                      <div className="text-[10px] text-stone-500">Visa, Mastercard, JCB, UnionPay</div>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'card' ? 'border-amber-600 bg-amber-600' : 'border-stone-400'
                    }`}
                  >
                    {paymentMethod === 'card' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                  </div>
                </div>

                {/* Sub-Panel when Card is Selected: Registered Card vs Fill New Card */}
                {paymentMethod === 'card' && (
                  <div className="mt-3 pt-3 border-t border-amber-200 space-y-3 animate-in fade-in">
                    
                    {/* If user already registered a card */}
                    {user.saved_card && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-stone-800">Payment Card Choice</span>
                          <button
                            type="button"
                            onClick={() => setUseRegisteredCard(!useRegisteredCard)}
                            className="text-amber-800 font-bold hover:underline cursor-pointer"
                          >
                            {useRegisteredCard ? '+ Use a Different Card' : '← Use Registered Card'}
                          </button>
                        </div>

                        {useRegisteredCard && (
                          <div className="p-3 rounded-xl bg-white border border-blue-300 flex items-center justify-between shadow-2xs">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-6 rounded bg-blue-600 text-white text-[9px] font-black flex items-center justify-center uppercase tracking-tighter">
                                {user.saved_card.brand}
                              </div>
                              <div>
                                <span className="font-mono text-xs font-bold text-stone-900">
                                  •••• •••• •••• {user.saved_card.last4}
                                </span>
                                <div className="text-[10px] text-stone-500">
                                  {user.saved_card.card_holder} · Exp {user.saved_card.exp_month}/{user.saved_card.exp_year}
                                </div>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              Registered
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* New Card Form (If no card registered or user clicked 'Use a Different Card') */}
                    {(!user.saved_card || !useRegisteredCard) && (
                      <div className="p-3.5 bg-white rounded-2xl border border-stone-200 space-y-2.5 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-stone-800 uppercase tracking-wide flex items-center gap-1">
                            <Lock className="w-3 h-3 text-emerald-600" />
                            <span>Enter Card Information</span>
                          </span>
                          <span className="text-[10px] font-mono text-amber-800 font-bold">
                            {getCardBrand(newCardNumber)}
                          </span>
                        </div>

                        <div>
                          <label className="text-[10px] font-semibold text-stone-600 block mb-0.5">
                            Card Number
                          </label>
                          <input
                            type="text"
                            value={newCardNumber}
                            onChange={(e) => handleCardNumberChange(e.target.value)}
                            placeholder="4000 1234 5678 9010"
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-semibold text-stone-600 block mb-0.5">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            value={newCardHolder}
                            onChange={(e) => setNewCardHolder(e.target.value)}
                            placeholder="Full name as on card"
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600 focus:bg-white uppercase"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-semibold text-stone-600 block mb-0.5">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              value={newCardExpiry}
                              onChange={(e) => handleExpiryChange(e.target.value)}
                              placeholder="MM/YY"
                              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:border-amber-600 focus:bg-white text-center"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold text-stone-600 block mb-0.5">
                              CVV / CVC
                            </label>
                            <input
                              type="password"
                              value={newCardCvv}
                              onChange={(e) => handleCvvChange(e.target.value)}
                              placeholder="•••"
                              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:border-amber-600 focus:bg-white text-center tracking-widest"
                            />
                          </div>
                        </div>

                        <label className="flex items-center gap-2 pt-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={saveNewCard}
                            onChange={(e) => setSaveNewCard(e.target.checked)}
                            className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                          />
                          <span className="text-[10px] text-stone-600 font-medium">
                            Save this card securely to my profile for future orders
                          </span>
                        </label>

                        {cardError && (
                          <p className="text-[10px] text-rose-600 font-bold bg-rose-50 p-1.5 rounded-lg border border-rose-200">
                            {cardError}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Bank Security Badge */}
                    <div className="flex items-center justify-between text-[9px] text-stone-500 pt-1">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>256-Bit Bank Encryption</span>
                      </span>
                      <span>3D Secure 2.0 OTP Verification</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Instant Kitchen Fire Policy & Cash Note */}
            <div className="space-y-2 pt-1">
              <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50/80 rounded-2xl border border-amber-200/90 text-xs space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-amber-950">
                  <div className="w-5 h-5 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-xs shrink-0">
                    <Zap className="w-3 h-3" />
                  </div>
                  <span>Instant Kitchen Fire (Zero Wait, 100% Guaranteed)</span>
                </div>
                <p className="text-[11px] text-amber-900/90 leading-relaxed">
                  Every in-app order is instantly settled via <strong>Bakong KHQR</strong> or <strong>Card</strong>. Your dishes are dispatched directly to the Kitchen Display System (KDS) and fired on the wok right away with zero waiting.
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Banknote className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-stone-800 text-[11px]">
                    Prefer paying with physical cash?
                  </div>
                  <p className="text-[10px] text-stone-500 leading-snug">
                    If you wish to settle with cash, simply order verbally with your server using our printed table menu or visit the cashier desk. In-app ordering is dedicated to instant prepaid digital orders.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Special Cooking Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Special Instructions to Chef
            </label>
            <input
              type="text"
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              placeholder="e.g. Medium spicy, extra lime, urgent order"
              className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 shadow-inner"
            />
          </div>

          {/* 5. Summary Card (Cambodia VAT 10%, Zero Tip, Zero Split) */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Items Total ({cart.length} dishes)</span>
              <span className="font-mono text-stone-900 font-bold">${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Voucher Privilege</span>
                <span className="font-mono">-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Cambodia VAT (10% អាករលើតម្លៃបន្ថែម)</span>
              <span className="font-mono text-stone-900">${tax.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
              <span>Final Total</span>
              <span className="font-mono text-amber-800 text-base">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Sticky Place Order CTA */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-stone-200 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
          <button
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-900/15 cursor-pointer terracotta-gradient-bg hover:brightness-105 text-white active:scale-[0.98]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {paymentMethod === 'khqr'
                ? `Proceed to Bakong KHQR Pay — $${total.toFixed(2)}`
                : `Pay $${total.toFixed(2)} with Card & Send to Kitchen`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
