import React, { useState } from 'react';
import {
  Layers,
  Copy,
  Check,
  ExternalLink,
  Camera,
  Download,
  Info,
  Sparkles,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { MobileShell, MobileNavTab } from '../mobile/MobileShell';
import { HomeTab } from '../mobile/HomeTab';
import { MenuTab } from '../mobile/MenuTab';
import { SearchTab } from '../mobile/SearchTab';
import { BookingTab } from '../mobile/BookingTab';
import { OrdersTab } from '../mobile/OrdersTab';
import { ProfileTab } from '../mobile/ProfileTab';
import { Product, CartItem, Order, Reservation, Table, User } from '../../types/restaurant';

interface FigmaShowcaseViewProps {
  user: User;
  orders: Order[];
  reservations: Reservation[];
  tables: Table[];
  favorites: string[];
  cart: CartItem[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (id: string) => void;
  onConfirmBooking: (data: Omit<Reservation, 'id' | 'created_at'>) => void;
  onRepeatOrder: (order: Order) => void;
  onAdvanceOrderStatus: (orderId: string, status: any) => void;
  onUpdateUser: (data: Partial<User>) => void;
}

export const FigmaShowcaseView: React.FC<FigmaShowcaseViewProps> = ({
  user,
  orders,
  reservations,
  favorites,
  cart,
  onSelectProduct,
  onAddToCart,
  onToggleFavorite,
  onConfirmBooking,
  onRepeatOrder,
  onAdvanceOrderStatus,
  onUpdateUser,
}) => {
  const [selectedCuisine, setSelectedCuisine] = useState<string>('khmer');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const screens: { id: MobileNavTab; num: string; title: string; subtitle: string }[] = [
    { id: 'home', num: '01', title: 'Home & Discovery', subtitle: 'Royal Specials, Quick Reserve & Cuisines' },
    { id: 'menu', num: '02', title: 'Menu Catalog', subtitle: '24 Authentic Dishes & Dietary Badges' },
    { id: 'search', num: '03', title: 'Search & Spotlight', subtitle: 'Live Keyword Filtering & Dietary Tags' },
    { id: 'booking', num: '04', title: 'Table Reservation', subtitle: 'Floor Plan (T01-T05, M01-M03) & 100% Deposit' },
    { id: 'orders', num: '05', title: 'Orders & Tracker', subtitle: 'Live KDS Status Progression' },
    { id: 'profile', num: '06', title: 'Guest Profile', subtitle: 'Bakong KHQR Loyalty Pass & History' },
  ];

  const colorTokens = [
    { name: 'Terracotta Wok', hex: '#c2410c' },
    { name: 'Cambodian Gold', hex: '#d97706' },
    { name: 'Khmer Jade', hex: '#15803d' },
    { name: 'Silk Ivory BG', hex: '#fcfbf9' },
    { name: 'Card White', hex: '#ffffff' },
    { name: 'Stone Border', hex: '#e7e5e4' },
    { name: 'Text Dark', hex: '#1c1917' },
  ];

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedToken(hex);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-stone-900 text-stone-100 min-h-screen">
      {/* Top Banner Guide for Free Figma Export */}
      <div className="bg-stone-950/90 border-b border-stone-800 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide">
                  Figma Artboard Showcase (All 6 Mobile Screens)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  100% Free · Zero Credits
                </span>
              </div>
              <p className="text-xs text-stone-400">
                All 6 screens rendered side-by-side in iPhone 16 Pro dimensions (390 x 844) ready for your assignment
              </p>
            </div>
          </div>

          {/* Quick Color Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-stone-400 mr-1 hidden lg:inline">Figma Colors:</span>
            {colorTokens.map((t) => (
              <button
                key={t.hex}
                onClick={() => handleCopyHex(t.hex)}
                title={`Click to copy ${t.name}: ${t.hex}`}
                className="flex items-center gap-1 px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 border border-stone-700 text-[10px] font-mono transition-colors cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.hex }} />
                <span>{t.hex}</span>
                {copiedToken === t.hex && <Check className="w-2.5 h-2.5 text-emerald-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Free Export Methods Tip */}
        <div className="mt-2.5 pt-2.5 border-t border-stone-800/80 flex flex-wrap items-center gap-4 text-xs text-stone-300">
          <div className="flex items-center gap-1.5 text-amber-300 font-medium">
            <Camera className="w-3.5 h-3.5" />
            <span>How to grab any screen to Figma (Zero Credits):</span>
          </div>
          <span className="text-stone-400">
            • <strong>Chrome / Edge:</strong> Right-click any phone frame below &rarr; choose <strong>"Inspect"</strong> &rarr; in Elements panel, right-click the selected &lt;div&gt; &rarr; <strong>"Capture node screenshot"</strong>.
          </span>
          <span className="text-stone-400">
            • <strong>Windows:</strong> Press <kbd className="px-1 py-0.5 bg-stone-800 border border-stone-700 rounded text-[10px]">Win + Shift + S</kbd> &rarr; snip the phone frame &rarr; press <kbd className="px-1 py-0.5 bg-stone-800 border border-stone-700 rounded text-[10px]">Ctrl + V</kbd> inside Figma!
          </span>
        </div>
      </div>

      {/* Horizontal Scrollable Artboard Canvas with All 6 Mobile Screens */}
      <div className="flex-1 overflow-x-auto p-6 sm:p-10 no-scrollbar">
        <div className="flex items-start gap-8 min-w-max pb-12">
          {screens.map((screen) => (
            <div key={screen.id} className="flex flex-col items-center">
              {/* Screen Label Header */}
              <div className="mb-3 text-center w-[394px]">
                <div className="flex items-center justify-center gap-2">
                  <span className="px-2 py-0.5 bg-purple-600/30 text-purple-300 border border-purple-500/40 rounded-full text-[11px] font-mono font-bold">
                    FRAME {screen.num}
                  </span>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    {screen.title}
                  </h3>
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5 truncate">
                  {screen.subtitle}
                </p>
              </div>

              {/* iPhone 16 Pro Screen Shell */}
              <div className="w-[394px] h-[844px] rounded-[54px] p-3.5 bg-gradient-to-b from-[#e7e5e0] via-[#dcd8d0] to-[#cbc6bc] shadow-[0_25px_60px_rgba(0,0,0,0.5)] ring-1 ring-stone-500/30">
                <div className="w-full h-full rounded-[44px] overflow-hidden border-[4px] border-[#222120] bg-white relative">
                  <MobileShell
                    activeTab={screen.id}
                    setActiveTab={() => {}}
                    isDeviceFrame={false}
                    activeOrderCount={orders.filter((o) => o.order_status !== 'completed' && o.order_status !== 'cancelled').length}
                  >
                    {screen.id === 'home' && (
                      <HomeTab
                        user={user}
                        onSelectProduct={onSelectProduct}
                        onSelectCuisine={(slug) => setSelectedCuisine(slug)}
                        onNavigateToBooking={() => {}}
                        onNavigateToMenu={() => {}}
                        onNavigateToSearch={() => {}}
                        onNavigateToProfile={() => {}}
                        onAddToCart={onAddToCart}
                        favorites={favorites}
                        onToggleFavorite={onToggleFavorite}
                      />
                    )}

                    {screen.id === 'menu' && (
                      <MenuTab
                        selectedCuisine={selectedCuisine}
                        setSelectedCuisine={setSelectedCuisine}
                        onSelectProduct={onSelectProduct}
                        favorites={favorites}
                        onToggleFavorite={onToggleFavorite}
                        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
                        cartTotal={cart.reduce((s, i) => s + i.itemTotal, 0)}
                        cart={cart}
                        onQuickAdd={onAddToCart}
                        onOpenCart={() => {}}
                      />
                    )}

                    {screen.id === 'search' && (
                      <SearchTab
                        onSelectProduct={onSelectProduct}
                        favorites={favorites}
                        onToggleFavorite={onToggleFavorite}
                        onAddToCart={onAddToCart}
                        onNavigateToMenu={() => {}}
                      />
                    )}

                    {screen.id === 'booking' && (
                      <BookingTab
                        onConfirmBooking={onConfirmBooking}
                        myReservations={reservations}
                        onViewReservationDetails={() => {}}
                      />
                    )}

                    {screen.id === 'orders' && (
                      <OrdersTab
                        orders={orders}
                        onRepeatOrder={onRepeatOrder}
                        onAdvanceOrderStatus={onAdvanceOrderStatus}
                      />
                    )}

                    {screen.id === 'profile' && (
                      <ProfileTab
                        user={user}
                        onUpdateUser={onUpdateUser}
                        favorites={favorites}
                        reservations={reservations}
                        orders={orders}
                        onNavigateToOrders={() => {}}
                        onNavigateToReservations={() => {}}
                        onSelectProduct={onSelectProduct}
                      />
                    )}
                  </MobileShell>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
