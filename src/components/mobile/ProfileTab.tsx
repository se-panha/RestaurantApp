import React, { useState } from 'react';
import {
  Heart,
  ReceiptText,
  CalendarDays,
  CreditCard,
  Globe,
  ChevronRight,
  Edit3,
  Phone,
  Check,
  Award,
  Sparkles,
  MapPin,
  Mail,
  Gift,
  ShieldCheck,
  Utensils,
  X,
  QrCode,
  DollarSign,
  MessageCircle,
  HelpCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { User as UserType, Reservation, Order, Product } from '../../types/restaurant';
import { PRODUCTS } from '../../data/restaurantData';
import { playTapChime, playSuccessChime } from '../../utils/audioChime';

interface ProfileTabProps {
  user: UserType;
  onUpdateUser: (updated: Partial<UserType>) => void;
  favorites: string[];
  reservations: Reservation[];
  orders: Order[];
  onNavigateToOrders: () => void;
  onNavigateToReservations: () => void;
  onSelectProduct: (product: Product) => void;
}

type ProfileSection = 'overview' | 'activity' | 'rewards' | 'preferences' | 'support';

export const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  onUpdateUser,
  favorites,
  reservations,
  orders,
  onNavigateToOrders,
  onNavigateToReservations,
  onSelectProduct,
}) => {
  const [activeSection, setActiveSection] = useState<ProfileSection>('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'km'>('en');
  const [selectedCurrency, setSelectedCurrency] = useState<'usd' | 'khr'>('usd');

  // Edit fields
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editAddress, setEditAddress] = useState(user.address || 'No. 42 Samdach Sothearos Blvd, Phnom Penh');

  // Patron Preferences
  const [spicePreference, setSpicePreference] = useState<'mild' | 'medium' | 'hot'>('medium');
  const [dietaryTag, setDietaryTag] = useState<string>('none');
  const [seatingPreference, setSeatingPreference] = useState<'window' | 'garden' | 'indoor'>('window');

  // Loyalty Points & Perks
  const [points, setPoints] = useState<number>(850);
  const [unlockedPerks, setUnlockedPerks] = useState<string[]>([]);
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  const favoriteProducts = PRODUCTS.filter((p) => favorites.includes(p.id));
  const activeOrders = orders.filter((o) => o.order_status !== 'completed' && o.order_status !== 'cancelled');
  const upcomingReservations = reservations.filter((r) => r.status === 'confirmed');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    playSuccessChime();
    onUpdateUser({
      name: editName,
      phone: editPhone,
      email: editEmail,
      address: editAddress,
    });
    setIsEditingProfile(false);
    setBannerNotice('✓ Patron profile information successfully updated!');
    setTimeout(() => setBannerNotice(null), 3500);
  };

  const handleRedeemPerk = (perkTitle: string, cost: number) => {
    if (points >= cost) {
      playSuccessChime();
      setPoints((prev) => prev - cost);
      setUnlockedPerks((prev) => [perkTitle, ...prev]);
      setBannerNotice(`🎉 Unlocked: ${perkTitle}! Show voucher to waiter.`);
      setTimeout(() => setBannerNotice(null), 4500);
    }
  };

  return (
    <div className="space-y-4 pb-28 bg-[#fdfbf7] min-h-full">
      {/* 1. TOP VIP PATRON HERO CARD */}
      <div className="p-5 bg-gradient-to-b from-white via-amber-50/60 to-[#fdfbf7] border-b border-amber-200/90 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl terracotta-gradient-bg text-white font-luxury font-bold text-2xl flex items-center justify-center shadow-md shadow-orange-900/20">
                {user.name.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-stone-900 flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-xs">
                ⭐
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-luxury text-xl sm:text-2xl font-bold text-stone-900">
                  {user.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/90 text-stone-950 font-extrabold text-[10px] uppercase tracking-wider shadow-xs">
                  VIP Gold
                </span>
              </div>
              
              <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-600 font-medium">
                <span className="font-mono text-[11px] text-stone-700">{user.phone}</span>
                <span>·</span>
                <span className="text-stone-500 font-mono text-[11px]">{user.email}</span>
              </div>

              <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-800 font-medium">
                <MapPin className="w-3 h-3 text-amber-700 shrink-0" />
                <span className="truncate max-w-[210px]">{user.address || 'Phnom Penh, Cambodia'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 items-end">
            <button
              onClick={() => {
                playTapChime();
                setIsEditingProfile(!isEditingProfile);
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-950 font-bold text-xs hover:bg-amber-50 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              title="Edit Profile Information"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-700" />
              <span>{isEditingProfile ? 'Close' : 'Edit'}</span>
            </button>

            <button
              onClick={() => {
                playTapChime();
                setShowQrModal(true);
              }}
              className="px-2.5 py-1 rounded-xl bg-stone-900 text-stone-100 hover:bg-stone-800 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-all shadow-xs active:scale-95"
              title="Show VIP QR Check-in Code"
            >
              <QrCode className="w-3 h-3 text-amber-300" />
              <span>QR Pass</span>
            </button>
          </div>
        </div>

        {/* VIP Digital Membership Card Banner */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white border border-amber-500/40 shadow-lg space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between text-xs relative z-10">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-bold tracking-wider uppercase text-amber-200 text-[11px]">
                Royal Privilege Pass
              </span>
            </div>
            <span className="font-mono text-[10px] text-amber-300/80 bg-amber-900/60 px-2 py-0.5 rounded-full border border-amber-400/30">
              #VIP-8829-KH
            </span>
          </div>

          <div className="flex items-end justify-between relative z-10">
            <div>
              <span className="text-[10px] uppercase text-amber-200/70 font-semibold block">
                Loyalty Balance
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black font-mono text-amber-300">{points}</span>
                <span className="text-xs text-amber-100 font-medium">Points</span>
                <span className="text-xs text-amber-400 font-bold ml-1">
                  (${(points / 100).toFixed(2)} Dining Value)
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                playTapChime();
                setActiveSection('rewards');
              }}
              className="px-3 py-1.5 rounded-xl terracotta-gradient-bg hover:brightness-110 text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95 flex items-center gap-1"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Redeem Perks</span>
            </button>
          </div>

          {/* Progress to Platinum Tier */}
          <div className="space-y-1 relative z-10 pt-1">
            <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden border border-amber-400/20">
              <div
                className="h-full gold-gradient-bg rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (points / 1000) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-amber-200/80 font-medium">
              <span>Gold Tier Patron</span>
              <span>{Math.max(0, 1000 - points)} pts to Royal Platinum VIP</span>
            </div>
          </div>
        </div>

        {bannerNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 flex items-center gap-2 font-bold shadow-xs animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{bannerNotice}</span>
          </div>
        )}
      </div>

      {/* 2. SECTION NAVIGATION PILLS (Makes finding any profile function super fast & easy!) */}
      <div className="px-5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'overview' as const, label: 'Overview', icon: '👤' },
            { id: 'activity' as const, label: 'Orders & Tables', icon: '📋' },
            { id: 'rewards' as const, label: 'VIP Rewards', icon: '🎁' },
            { id: 'preferences' as const, label: 'Dining Tastes', icon: '🍽️' },
            { id: 'support' as const, label: 'Help & Concierge', icon: '🛎️' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => {
                playTapChime();
                setActiveSection(sec.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                activeSection === sec.id
                  ? 'terracotta-gradient-bg text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-amber-300'
              }`}
            >
              <span>{sec.icon}</span>
              <span>{sec.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. EDIT PROFILE FORM (Toggled via Edit button) */}
      {isEditingProfile && (
        <form
          onSubmit={handleSaveProfile}
          className="mx-5 p-4 rounded-3xl bg-white border border-amber-300 shadow-md space-y-3.5 animate-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center justify-between pb-1 border-b border-stone-100">
            <div className="flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-amber-700" />
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Edit Patron Information
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="w-6 h-6 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center hover:bg-stone-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-stone-700">Full Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600 focus:bg-white shadow-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-stone-700">Phone (Khmer / Intl)</label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600 focus:bg-white shadow-xs font-mono"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-stone-700">Email Address</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600 focus:bg-white shadow-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-stone-700">Default Dining &amp; Delivery Address</label>
            <input
              type="text"
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-600 focus:bg-white shadow-xs"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 terracotta-gradient-bg hover:brightness-105 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold cursor-pointer border border-stone-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* 4. OVERVIEW SECTION: QUICK ACCESS HUBS */}
      {(activeSection === 'overview' || activeSection === 'activity') && (
        <div className="px-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <ReceiptText className="w-3.5 h-3.5 text-amber-700" />
              <span>Dining Activity &amp; Shortcuts</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                playTapChime();
                onNavigateToOrders();
              }}
              className="p-3.5 rounded-2xl bg-white border border-amber-200/90 text-left hover:border-amber-500 hover:shadow-md transition-all shadow-xs cursor-pointer group active:scale-98"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ReceiptText className="w-4 h-4" />
                </div>
                <span className="font-mono font-bold text-sm text-stone-900">
                  {orders.length}
                </span>
              </div>
              <div className="text-xs font-bold text-stone-900">My Orders</div>
              <p className="text-[10px] text-stone-500">
                {activeOrders.length > 0 ? `${activeOrders.length} active in kitchen` : 'Track receipts & status'}
              </p>
            </button>

            <button
              onClick={() => {
                playTapChime();
                onNavigateToReservations();
              }}
              className="p-3.5 rounded-2xl bg-white border border-amber-200/90 text-left hover:border-amber-500 hover:shadow-md transition-all shadow-xs cursor-pointer group active:scale-98"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <span className="font-mono font-bold text-sm text-stone-900">
                  {reservations.length}
                </span>
              </div>
              <div className="text-xs font-bold text-stone-900">Table Bookings</div>
              <p className="text-[10px] text-stone-500">
                {upcomingReservations.length > 0 ? `${upcomingReservations.length} confirmed` : 'Riverside & VIP passes'}
              </p>
            </button>

            <button
              onClick={() => {
                playTapChime();
                setShowPaymentModal(true);
              }}
              className="p-3.5 rounded-2xl bg-white border border-amber-200/90 text-left hover:border-amber-500 hover:shadow-md transition-all shadow-xs cursor-pointer group active:scale-98"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                  KHQR Ready
                </span>
              </div>
              <div className="text-xs font-bold text-stone-900">Payment Methods</div>
              <p className="text-[10px] text-stone-500">Bakong KHQR &amp; Cards</p>
            </button>

            <div className="p-3.5 rounded-2xl bg-white border border-amber-200/90 text-left shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center">
                  <Heart className="w-4 h-4 fill-rose-500" />
                </div>
                <span className="font-mono font-bold text-sm text-stone-900">
                  {favorites.length}
                </span>
              </div>
              <div className="text-xs font-bold text-stone-900">Favorite Dishes</div>
              <p className="text-[10px] text-stone-500">{favorites.length} saved bookmarks</p>
            </div>
          </div>
        </div>
      )}

      {/* 5. LOYALTY PERKS & REWARDS (Instant 1-Click Redeem) */}
      {(activeSection === 'overview' || activeSection === 'rewards') && (
        <div className="px-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-amber-700" />
              <span>Available Loyalty Vouchers</span>
            </h3>
            <span className="text-[11px] font-bold text-amber-900 font-mono">
              Balance: {points} pts
            </span>
          </div>

          <div className="space-y-2">
            {[
              {
                id: 'perk_dessert',
                title: 'Free Royal Mango Panna Cotta 🥭',
                desc: 'Signature dessert infused with lemongrass syrup',
                cost: 400,
                badge: 'Popular',
              },
              {
                id: 'perk_mocktail',
                title: 'Complimentary Mekong Sunset Mocktail 🍹',
                desc: 'Craft hibiscus, passion fruit & fresh mint cooler',
                cost: 350,
                badge: 'Beverage',
              },
              {
                id: 'perk_voucher',
                title: '$5.00 Instant Dining Credit Voucher 💵',
                desc: 'Applies automatically to any food or beverage order',
                cost: 500,
                badge: 'Credit',
              },
              {
                id: 'perk_champagne',
                title: 'VIP Welcome Champagne Toast 🍾',
                desc: 'Chilled flute of French Brut for you and your guest',
                cost: 600,
                badge: 'VIP Elite',
              },
            ].map((perk) => {
              const canAfford = points >= perk.cost;
              const isUnlocked = unlockedPerks.includes(perk.title);

              return (
                <div
                  key={perk.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    isUnlocked
                      ? 'bg-emerald-50/80 border-emerald-300'
                      : canAfford
                      ? 'bg-white border-amber-200 hover:border-amber-400 shadow-xs'
                      : 'bg-stone-50 border-stone-200 opacity-70'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-stone-900">{perk.title}</h4>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                        {perk.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-500">{perk.desc}</p>
                    <span className="text-[11px] font-extrabold text-amber-800 font-mono">
                      {perk.cost} Points
                    </span>
                  </div>

                  {isUnlocked ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs">
                      <Check className="w-3.5 h-3.5" />
                      <span>Ready</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRedeemPerk(perk.title, perk.cost)}
                      disabled={!canAfford}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                        canAfford
                          ? 'terracotta-gradient-bg text-white hover:brightness-105 shadow-xs'
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      }`}
                    >
                      Redeem
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. DINING & KITCHEN PREFERENCES */}
      {(activeSection === 'overview' || activeSection === 'preferences') && (
        <div className="px-5 space-y-3">
          <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-amber-700" />
            <span>Dining &amp; Kitchen Preferences</span>
          </h3>

          <div className="p-4 rounded-3xl bg-white border border-amber-200/90 shadow-xs space-y-3.5">
            {/* Spice Preference */}
            <div>
              <span className="text-[11px] font-semibold text-stone-700 block mb-1.5">
                Preferred Spice Heat Level
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'mild' as const, label: 'Mild (Gentle)', icon: '🌱' },
                  { id: 'medium' as const, label: 'Medium', icon: '🌶️' },
                  { id: 'hot' as const, label: 'Khmer Hot', icon: '🌶️🌶️' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      playTapChime();
                      setSpicePreference(s.id);
                    }}
                    className={`py-2 px-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      spicePreference === s.id
                        ? 'terracotta-gradient-bg text-white font-bold shadow-xs'
                        : 'bg-stone-50 border border-stone-200 text-stone-600 hover:border-amber-300'
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span className="truncate">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Preference */}
            <div className="pt-2 border-t border-stone-100">
              <span className="text-[11px] font-semibold text-stone-700 block mb-1.5">
                Dietary Guidance
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'none', label: 'All Cuisines', icon: '🍲' },
                  { id: 'veg', label: 'Vegetarian', icon: '🥗' },
                  { id: 'halal', label: 'Halal Friendly', icon: '☪️' },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      playTapChime();
                      setDietaryTag(d.id);
                    }}
                    className={`py-2 px-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      dietaryTag === d.id
                        ? 'terracotta-gradient-bg text-white font-bold shadow-xs'
                        : 'bg-stone-50 border border-stone-200 text-stone-600 hover:border-amber-300'
                    }`}
                  >
                    <span>{d.icon}</span>
                    <span className="truncate">{d.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Seating Preference */}
            <div className="pt-2 border-t border-stone-100">
              <span className="text-[11px] font-semibold text-stone-700 block mb-1.5">
                Preferred Table Location
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'window' as const, label: 'River View' },
                  { id: 'garden' as const, label: 'Garden Patio' },
                  { id: 'indoor' as const, label: 'Indoor AC' },
                ].map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => {
                      playTapChime();
                      setSeatingPreference(seat.id);
                    }}
                    className={`py-2 px-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                      seatingPreference === seat.id
                        ? 'terracotta-gradient-bg text-white font-bold shadow-xs'
                        : 'bg-stone-50 border border-stone-200 text-stone-600 hover:border-amber-300'
                    }`}
                  >
                    {seat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. APP LANGUAGE & CURRENCY PREFERENCES */}
      {(activeSection === 'overview' || activeSection === 'preferences' || activeSection === 'support') && (
        <div className="px-5 space-y-3">
          <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-amber-700" />
            <span>Language &amp; Currency</span>
          </h3>

          <div className="p-4 rounded-3xl bg-white border border-amber-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700">Display Language</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setSelectedLanguage('en')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedLanguage === 'en'
                      ? 'bg-amber-100 text-amber-950 border border-amber-400 font-extrabold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  🇺🇸 English
                </button>
                <button
                  onClick={() => setSelectedLanguage('km')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedLanguage === 'km'
                      ? 'bg-amber-100 text-amber-950 border border-amber-400 font-extrabold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  🇰🇭 ភាសាខ្មែរ
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <span className="text-xs font-semibold text-stone-700">Menu Currency</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setSelectedCurrency('usd')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCurrency === 'usd'
                      ? 'bg-amber-100 text-amber-950 border border-amber-400 font-extrabold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => setSelectedCurrency('khr')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCurrency === 'khr'
                      ? 'bg-amber-100 text-amber-950 border border-amber-400 font-extrabold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  KHR (៛)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. HOSPITALITY SUPPORT & CONCIERGE */}
      {(activeSection === 'overview' || activeSection === 'support') && (
        <div className="px-5 space-y-3">
          <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Hospitality Concierge</span>
          </h3>

          <div className="p-4 rounded-3xl bg-white border border-amber-200/90 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-stone-900">Direct VIP Host Desk</h4>
                <p className="text-[11px] text-stone-500">Daily 10:30 AM – 10:30 PM</p>
              </div>
              <a
                href="tel:+85523888999"
                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 text-amber-700" />
                <span>Call Host</span>
              </a>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-stone-900">Telegram VIP Butler</h4>
                <p className="text-[11px] text-stone-500">Instant reservation modifications</p>
              </div>
              <button
                onClick={() => {
                  playTapChime();
                  setBannerNotice('Connected to VIP Butler on Telegram (@RoyalKhmerConcierge)');
                  setTimeout(() => setBannerNotice(null), 4000);
                }}
                className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-sky-600" />
                <span>Telegram</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. VIP QR CODE PASS MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-stone-200 shadow-2xl text-center space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowQrModal(false)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center hover:bg-stone-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold uppercase tracking-wider">
                VIP Gold Dining Pass
              </span>
              <h3 className="text-base font-luxury font-bold text-stone-900">{user.name}</h3>
              <p className="text-[11px] text-stone-500">Show this QR code at the hostess desk for fast-track VIP seating</p>
            </div>

            {/* Generated QR pass container */}
            <div className="p-4 bg-stone-50 border border-amber-300 rounded-3xl mx-auto w-48 h-48 flex flex-col items-center justify-center shadow-inner">
              <div className="grid grid-cols-6 gap-1 p-2 bg-white rounded-xl shadow-xs">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-xs ${
                      (i % 2 === 0 && i % 3 !== 1) || i === 0 || i === 5 || i === 30 || i === 35
                        ? 'bg-stone-900'
                        : 'bg-stone-100'
                    }`}
                  ></div>
                ))}
              </div>
              <span className="font-mono text-[10px] font-bold text-stone-600 mt-2">
                #VIP-8829-KH
              </span>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 terracotta-gradient-bg text-white font-bold rounded-xl text-xs hover:brightness-105 cursor-pointer shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 10. PAYMENT CHANNELS MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-700" />
                <h3 className="text-sm font-bold text-stone-900">Saved Payment Channels</h3>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center hover:bg-stone-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-red-600 text-white font-black text-[10px] flex items-center justify-center tracking-tighter">
                    KHQR
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">Bakong KHQR National Pay</div>
                    <div className="text-[10px] text-stone-500">Connected: ABA / ACLEDA / Wing</div>
                  </div>
                </div>
                <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold">Default</span>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-[10px] flex items-center justify-center">
                    VISA
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">Visa Platinum **** 8821</div>
                    <div className="text-[10px] text-stone-500">Expires 09/28</div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowPaymentModal(false)}
              className="w-full py-2.5 terracotta-gradient-bg text-white font-bold rounded-xl text-xs hover:brightness-105 cursor-pointer shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
