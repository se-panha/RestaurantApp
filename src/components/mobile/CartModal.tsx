import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Gift,
  Clock,
  Utensils,
  Check,
  ChevronRight,
  MessageSquare,
  ChevronDown
} from 'lucide-react';
import { CartItem, Product } from '../../types/restaurant';
import { PRODUCTS, TABLES } from '../../data/restaurantData';
import { playTapChime, playSuccessChime } from '../../utils/audioChime';
import { resolveImageUrl, handleImageError } from '../../utils/imageUtils';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onAddToCart?: (item: CartItem) => void;
  onProceedToCheckout: (cartSummary: {
    subtotal: number;
    discount: number;
    tax: number;
    tip: number;
    total: number;
    splitCount: number;
    perPersonTotal: number;
    selectedTable?: string;
    orderType?: 'dine_in' | 'takeaway';
  }) => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onAddToCart,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string>('');
  
  // Dining Mode & Table Selection
  const [diningMode, setDiningMode] = useState<'dine_in' | 'takeaway'>('dine_in');
  const [selectedTable, setSelectedTable] = useState<string>('Table #01 (Riverside Window · 2 Guests)');
  const [customTableNumber, setCustomTableNumber] = useState<string>('');
  const [isChangingTable, setIsChangingTable] = useState(false);

  const [quickNotes, setQuickNotes] = useState<string[]>([]);
  const [customChefNote, setCustomChefNote] = useState<string>('');

  // Cambodia Tax Rule: Official Standard VAT is 10% (GDT Cambodia)
  // No tip / gratuity needed in Cambodian dining culture as requested
  const subtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const discount = appliedDiscount;
  const tax = Math.round(subtotal * 0.10 * 100) / 100; // 10% Cambodia VAT
  const total = Math.max(0, subtotal - discount + tax);

  // 3-Tier Reward Progress
  const rewardGoal = 35.0;
  const rewardProgress = Math.min(100, Math.round((subtotal / rewardGoal) * 100));
  const amountNeeded = Math.max(0, rewardGoal - subtotal);

  // Recommended side additions
  const quickUpsellProducts = PRODUCTS.filter(
    (p) =>
      (p.cuisine_id === 'cui_drinks' || p.category_id === 'cat_k_app' || p.price <= 7) &&
      !cart.some((c) => c.product.id === p.id)
  ).slice(0, 4);

  const handleQuickAdd = (product: Product) => {
    playSuccessChime();
    if (onAddToCart) {
      const newItem: CartItem = {
        id: `${product.id}_${Date.now()}`,
        product,
        selectedSize: product.sizes[0] || { id: 'regular', name: 'Regular', priceDelta: 0 },
        selectedAddOns: [],
        selectedSpiceLevel: product.spice_level || 0,
        quantity: 1,
        itemTotal: product.price,
      };
      onAddToCart(newItem);
    }
  };

  const handleToggleNote = (note: string) => {
    playTapChime();
    setQuickNotes((prev) =>
      prev.includes(note) ? prev.filter((n) => n !== note) : [...prev, note]
    );
  };

  const applyPromoCode = (codeToApply?: string) => {
    const code = (codeToApply || promoCode).trim().toUpperCase();
    if (code === 'AMOK10') {
      const disc = Math.round(subtotal * 0.10 * 100) / 100;
      setAppliedDiscount(disc);
      setPromoMessage('🎉 10% discount voucher applied!');
      playSuccessChime();
    } else if (code === 'ROYAL5') {
      if (subtotal >= 25) {
        setAppliedDiscount(5.0);
        setPromoMessage('🎉 $5.00 dining voucher applied!');
        playSuccessChime();
      } else {
        setPromoMessage('⚠️ Order minimum $25.00 required for ROYAL5 voucher.');
      }
    } else {
      setPromoMessage('⚠️ Invalid voucher code. Try AMOK10 or ROYAL5.');
    }
  };

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const availableTableList = [
    { id: 'T01', name: 'Table #01 (Riverside Window · 2 Guests)' },
    { id: 'T02', name: 'Table #02 (Riverside Window · 4 Guests)' },
    { id: 'T03', name: 'Table #03 (Garden Veranda · 4 Guests)' },
    { id: 'T04', name: 'Table #04 (Garden Veranda · 6 Guests)' },
    { id: 'T05', name: 'Table #05 (Main Dining Hall · 4 Guests)' },
    { id: 'T06', name: 'Table #06 (Main Dining Hall · 2 Guests)' },
    { id: 'T07', name: 'Table #07 (Terrace Pavilion · 4 Guests)' },
    { id: 'T08', name: 'Table #08 (Terrace Pavilion · 6 Guests)' },
  ];

  const effectiveTableNumber = customTableNumber.trim() ? `Table #${customTableNumber}` : selectedTable;

  const handleProceed = () => {
    onProceedToCheckout({
      subtotal,
      discount,
      tax,
      tip: 0, // No tip in Cambodian dining culture
      total,
      splitCount: 1, // No bill split
      perPersonTotal: total,
      selectedTable: diningMode === 'dine_in' ? effectiveTableNumber : undefined,
      orderType: diningMode,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white border-t border-amber-200/90 rounded-t-[36px] overflow-hidden max-h-[92vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        {/* 1. Header with Live Order Count & Close */}
        <div className="p-4 px-5 border-b border-amber-200/80 flex items-center justify-between bg-gradient-to-r from-amber-50 via-white to-orange-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl terracotta-gradient-bg text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900 tracking-tight flex items-center gap-1.5">
                <span>Your Dining Order</span>
                <span className="text-[11px] px-2 py-0.2 rounded-full gold-gradient-bg text-white font-extrabold shadow-2xs">
                  {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
                </span>
              </h2>
              <p className="text-[10px] text-amber-800 font-medium">
                Royal Khmer Heritage &amp; Contemporary Bistro
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-stone-200 text-stone-600 flex items-center justify-center hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Scrollable Body Content */}
        {cart.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
              <Utensils className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-luxury text-lg font-bold text-stone-900">Your Plate is Empty</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore our Royal Khmer specialties, wood-fired specials, and craft beverages to start your dining experience.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 terracotta-gradient-bg text-white rounded-xl text-xs font-bold hover:brightness-105 transition-all cursor-pointer shadow-xs"
            >
              Browse Gourmet Menu
            </button>
          </div>
        ) : (
          <div className="overflow-y-auto no-scrollbar flex-1 p-5 space-y-4 bg-[#fdfbf7]">
            
            {/* VIP Rewards Progress Tier */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Royal Patron Privilege Rewards</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-amber-900">
                  {subtotal >= rewardGoal ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5" />
                      Free Dessert Unlocked!
                    </span>
                  ) : (
                    `+$${amountNeeded.toFixed(2)} to Free Mango Panna Cotta`
                  )}
                </span>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full gold-gradient-bg rounded-full transition-all duration-500"
                  style={{ width: `${rewardProgress}%` }}
                ></div>
              </div>
            </div>

            {/* DINING DESTINATION & TABLE SELECTION */}
            <div className="p-3.5 rounded-2xl bg-white border border-amber-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-amber-700" />
                  <span>Dining Destination</span>
                </span>
                <span className="text-[10px] text-stone-500 font-medium">
                  {diningMode === 'dine_in' ? 'At Restaurant Table' : 'Packed for Takeaway'}
                </span>
              </div>

              {/* 2 Clear Options: Dine-In vs Takeaway */}
              <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl border border-stone-200 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    playTapChime();
                    setDiningMode('dine_in');
                  }}
                  className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    diningMode === 'dine_in'
                      ? 'terracotta-gradient-bg text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Dine-In (Select Table)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playTapChime();
                    setDiningMode('takeaway');
                  }}
                  className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    diningMode === 'takeaway'
                      ? 'terracotta-gradient-bg text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Takeaway (To Go)</span>
                </button>
              </div>

              {/* Interactive Table Selector when Dine-In is selected */}
              {diningMode === 'dine_in' && (
                <div className="space-y-2 pt-1 border-t border-stone-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-700">Seated Table:</span>
                    <button
                      type="button"
                      onClick={() => setIsChangingTable(!isChangingTable)}
                      className="text-xs text-amber-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>{isChangingTable ? 'Done Choosing' : 'Change Table'}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isChangingTable ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Current Selected Table Badge */}
                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-300 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="font-bold text-amber-950">{effectiveTableNumber}</span>
                    </div>
                    <span className="text-[10px] text-amber-800 font-semibold bg-white px-2 py-0.5 rounded-md border border-amber-200">
                      Confirmed Seating
                    </span>
                  </div>

                  {/* Table Selection Dropdown / Grid (Toggled) */}
                  {isChangingTable && (
                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 animate-in fade-in">
                      <span className="text-[11px] font-bold text-stone-700 block">
                        Choose Available Restaurant Table:
                      </span>
                      <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
                        {availableTableList.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              playTapChime();
                              setSelectedTable(t.name);
                              setCustomTableNumber('');
                            }}
                            className={`p-2 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                              selectedTable === t.name && !customTableNumber
                                ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300'
                                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                            }`}
                          >
                            <span>{t.name}</span>
                            {selectedTable === t.name && !customTableNumber && (
                              <Check className="w-3.5 h-3.5 text-amber-700" />
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Custom Table Number Input */}
                      <div className="pt-2 border-t border-stone-200 flex items-center gap-2">
                        <span className="text-[11px] text-stone-600 whitespace-nowrap">Or custom table #:</span>
                        <input
                          type="text"
                          value={customTableNumber}
                          onChange={(e) => setCustomTableNumber(e.target.value)}
                          placeholder="e.g. 12"
                          className="w-24 bg-white border border-stone-300 rounded-lg px-2 py-1 text-xs text-stone-900 font-mono focus:outline-none focus:border-amber-600"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CART DISH ITEMS */}
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-white border border-amber-200/80 space-y-2.5 shadow-xs hover:border-amber-400 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <img
                        src={resolveImageUrl(item.product.image_url)}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        onError={handleImageError}
                        className="w-14 h-14 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-200"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{item.product.name}</h4>
                        {item.product.local_name && (
                          <p className="text-[10px] text-amber-800 font-medium">{item.product.local_name}</p>
                        )}
                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-stone-500">
                          <span className="font-semibold text-stone-700">{item.selectedSize.name}</span>
                          {Boolean(item.selectedSpiceLevel && item.selectedSpiceLevel > 0) && (
                            <>
                              <span>·</span>
                              <span>{'🌶️'.repeat(item.selectedSpiceLevel!)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-extrabold text-amber-900 font-mono">
                        ${item.itemTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <button
                      onClick={() => {
                        playTapChime();
                        onRemoveItem(item.id);
                      }}
                      className="text-stone-400 hover:text-rose-600 transition-colors p-1 cursor-pointer flex items-center gap-1 text-[11px]"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          playTapChime();
                          onUpdateQuantity(item.id, -1);
                        }}
                        className="w-6 h-6 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center hover:bg-stone-200 active:scale-90 transition-all cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-xs font-bold text-stone-900 min-w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => {
                          playTapChime();
                          onUpdateQuantity(item.id, 1);
                        }}
                        className="w-6 h-6 rounded-lg terracotta-gradient-bg text-white flex items-center justify-center hover:brightness-105 active:scale-90 transition-all cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* FREQUENTLY PAIRED RECOMMENDATIONS */}
            {quickUpsellProducts.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Frequently Paired With Your Order</span>
                  </span>
                </div>

                <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
                  {quickUpsellProducts.map((p) => (
                    <div
                      key={p.id}
                      className="w-36 shrink-0 p-2 rounded-2xl bg-white border border-amber-200/90 shadow-2xs hover:border-amber-400 transition-all flex flex-col justify-between"
                    >
                      <img
                        src={resolveImageUrl(p.image_url)}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        onError={handleImageError}
                        className="w-full h-20 rounded-xl object-cover mb-1.5"
                      />
                      <h5 className="text-[11px] font-bold text-stone-900 line-clamp-1">{p.name}</h5>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[11px] font-mono font-bold text-amber-900">
                          ${p.price.toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(p)}
                          className="px-2 py-0.5 rounded-lg terracotta-gradient-bg text-white text-[10px] font-bold hover:brightness-105 active:scale-95 cursor-pointer shadow-2xs flex items-center gap-0.5"
                        >
                          <Plus className="w-2.5 h-2.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* KITCHEN INSTRUCTIONS & NOTES */}
            <div className="p-3.5 rounded-2xl bg-white border border-amber-200/80 space-y-2.5">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                <span>Special Kitchen Instructions</span>
              </span>

              <div className="flex flex-wrap gap-1.5">
                {[
                  'Extra Crispy',
                  'Less Spicy',
                  'No Cilantro',
                  'Sauce on Side',
                  'No Peanut / Nut Alert',
                  'Hot Jasmine Tea First',
                ].map((note) => (
                  <button
                    key={note}
                    type="button"
                    onClick={() => handleToggleNote(note)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
                      quickNotes.includes(note)
                        ? 'terracotta-gradient-bg text-white font-bold shadow-xs'
                        : 'bg-stone-50 border border-stone-200 text-stone-600 hover:border-amber-300'
                    }`}
                  >
                    {quickNotes.includes(note) && '✓ '}
                    {note}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={customChefNote}
                onChange={(e) => setCustomChefNote(e.target.value)}
                placeholder="Custom request for the kitchen..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:bg-white"
              />
            </div>

            {/* PROMO VOUCHERS */}
            <div className="p-3.5 rounded-2xl bg-white border border-amber-200/80 space-y-2">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-700" />
                <span>Promo Code / Dining Voucher</span>
              </span>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter code (e.g. AMOK10)"
                  className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-900 uppercase font-mono placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => applyPromoCode()}
                  className="px-3.5 py-1.5 terracotta-gradient-bg text-white rounded-xl text-xs font-bold hover:brightness-105 cursor-pointer shadow-xs active:scale-95"
                >
                  Apply
                </button>
              </div>

              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-[10px] text-stone-500 font-medium">Quick Apply:</span>
                <button
                  type="button"
                  onClick={() => applyPromoCode('AMOK10')}
                  className="px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono font-bold cursor-pointer"
                >
                  AMOK10 (-10%)
                </button>
                <button
                  type="button"
                  onClick={() => applyPromoCode('ROYAL5')}
                  className="px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono font-bold cursor-pointer"
                >
                  ROYAL5 (-$5)
                </button>
              </div>

              {promoMessage && (
                <p className={`text-[11px] font-bold ${appliedDiscount > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {promoMessage}
                </p>
              )}
            </div>
          </div>
        )}

        {/* 3. Sticky Bottom Checkout Summary */}
        {cart.length > 0 && (
          <div className="cart-float-bar p-4 px-5 border-t border-amber-200/90 space-y-3 bg-white">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Food &amp; Beverage Subtotal</span>
                <span className="font-mono text-stone-900 font-bold">${subtotal.toFixed(2)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Dining Voucher Discount</span>
                  <span className="font-mono">-${discount.toFixed(2)}</span>
                </div>
              )}
              {/* CAMBODIA OFFICIAL VAT RATE: 10% (GDT) */}
              <div className="flex justify-between text-stone-600">
                <span>Cambodia VAT (10% អាករលើតម្លៃបន្ថែម)</span>
                <span className="font-mono text-stone-900 font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-stone-950 pt-1.5 border-t border-stone-200">
                <span>Total Amount</span>
                <span className="font-mono text-base text-amber-950">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleProceed}
              className="w-full py-3.5 terracotta-gradient-bg text-white rounded-2xl text-xs font-extrabold tracking-wide uppercase flex items-center justify-between px-5 shadow-lg shadow-orange-900/25 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span>Proceed to Checkout</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
                  {totalItemCount} {totalItemCount === 1 ? 'dish' : 'dishes'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm font-mono font-bold">
                <span>${total.toFixed(2)}</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
