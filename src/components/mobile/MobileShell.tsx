import React from 'react';
import { Wifi, Battery, Signal, Home, UtensilsCrossed, CalendarDays, ReceiptText, User, Search } from 'lucide-react';
import { playTapChime } from '../../utils/audioChime';

export type MobileNavTab = 'home' | 'menu' | 'search' | 'booking' | 'orders' | 'profile';

interface MobileShellProps {
  activeTab: MobileNavTab;
  setActiveTab: (tab: MobileNavTab) => void;
  children: React.ReactNode;
  isDeviceFrame: boolean;
  activeOrderCount: number;
}

export const MobileShell: React.FC<MobileShellProps> = ({
  activeTab,
  setActiveTab,
  children,
  isDeviceFrame,
  activeOrderCount,
}) => {
  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const handleTabClick = (tab: MobileNavTab) => {
    playTapChime();
    setActiveTab(tab);
  };

  const content = (
    <div className="relative flex flex-col h-full bg-[#fcfbf9] text-stone-900 overflow-hidden select-none">
      {/* Top Mobile Status Bar (Realistic Clean Dynamic Island - No Persistent Alert) */}
      <div className="shrink-0 h-11 px-5 flex items-center justify-between text-xs font-medium text-stone-600 select-none z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80">
        <span className="font-semibold text-stone-900 tracking-tight font-mono text-[11px]">{timeString}</span>
        
        {/* Sleek, Clean Dynamic Island (Authentic phone design, no blinking alerts) */}
        <div className="w-24 h-5 bg-black rounded-full flex items-center justify-between px-2.5 shadow-xs">
          <div className="w-2 h-2 rounded-full bg-stone-900 ring-1 ring-stone-800"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-stone-800"></div>
        </div>

        <div className="flex items-center gap-1.5 text-stone-700">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-4 h-4 text-emerald-600" />
        </div>
      </div>

      {/* Main Scrollable Content Viewport */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative pb-20">
        {children}
      </main>

      {/* Fixed Bottom Tab Bar with SEARCH BUTTON IN THE MIDDLE */}
      <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-xl border-t border-stone-200/90 grid grid-cols-5 items-center px-1 z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        {/* Tab 1: Home */}
        <button
          onClick={() => handleTabClick('home')}
          className="relative flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer group focus-visible:outline-none"
        >
          <Home
            className={`w-5 h-5 transition-transform duration-200 ${
              activeTab === 'home'
                ? 'text-amber-800 scale-110 drop-shadow-[0_2px_4px_rgba(180,83,9,0.25)]'
                : 'text-stone-400 group-hover:text-stone-700'
            }`}
          />
          <span
            className={`text-[10px] tracking-tight mt-1 transition-colors ${
              activeTab === 'home' ? 'text-amber-900 font-bold' : 'text-stone-500 font-medium group-hover:text-stone-800'
            }`}
          >
            Home
          </span>
          {activeTab === 'home' && (
            <span className="absolute bottom-1 w-1.5 h-1 rounded-full bg-amber-700"></span>
          )}
        </button>

        {/* Tab 2: Menu */}
        <button
          onClick={() => handleTabClick('menu')}
          className="relative flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer group focus-visible:outline-none"
        >
          <UtensilsCrossed
            className={`w-5 h-5 transition-transform duration-200 ${
              activeTab === 'menu'
                ? 'text-amber-800 scale-110 drop-shadow-[0_2px_4px_rgba(180,83,9,0.25)]'
                : 'text-stone-400 group-hover:text-stone-700'
            }`}
          />
          <span
            className={`text-[10px] tracking-tight mt-1 transition-colors ${
              activeTab === 'menu' ? 'text-amber-900 font-bold' : 'text-stone-500 font-medium group-hover:text-stone-800'
            }`}
          >
            Menu
          </span>
          {activeTab === 'menu' && (
            <span className="absolute bottom-1 w-1.5 h-1 rounded-full bg-amber-700"></span>
          )}
        </button>

        {/* Tab 3: CENTER SEARCH ACTION BUTTON (Elevated, Floating & Eye-Catching) */}
        <div className="relative flex flex-col items-center justify-center h-full">
          <button
            onClick={() => handleTabClick('search')}
            title="Search dishes & all cuisines"
            className={`-top-3.5 relative w-12 h-12 rounded-full terracotta-gradient-bg text-white flex items-center justify-center shadow-lg transition-all duration-200 cursor-pointer active:scale-95 ${
              activeTab === 'search'
                ? 'ring-4 ring-amber-400/40 scale-105 shadow-[0_8px_20px_rgba(194,65,12,0.45)]'
                : 'shadow-[0_6px_16px_rgba(194,65,12,0.3)] hover:scale-105'
            }`}
          >
            <Search className="w-5 h-5 stroke-[2.5]" />
          </button>
          <span
            className={`text-[10px] tracking-tight -mt-2 transition-colors ${
              activeTab === 'search' ? 'text-amber-900 font-bold' : 'text-stone-600 font-semibold'
            }`}
          >
            Search
          </span>
        </div>

        {/* Tab 4: Booking */}
        <button
          onClick={() => handleTabClick('booking')}
          className="relative flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer group focus-visible:outline-none"
        >
          <CalendarDays
            className={`w-5 h-5 transition-transform duration-200 ${
              activeTab === 'booking'
                ? 'text-amber-800 scale-110 drop-shadow-[0_2px_4px_rgba(180,83,9,0.25)]'
                : 'text-stone-400 group-hover:text-stone-700'
            }`}
          />
          <span
            className={`text-[10px] tracking-tight mt-1 transition-colors ${
              activeTab === 'booking' ? 'text-amber-900 font-bold' : 'text-stone-500 font-medium group-hover:text-stone-800'
            }`}
          >
            Booking
          </span>
          {activeTab === 'booking' && (
            <span className="absolute bottom-1 w-1.5 h-1 rounded-full bg-amber-700"></span>
          )}
        </button>

        {/* Tab 5: Orders */}
        <button
          onClick={() => handleTabClick('orders')}
          className="relative flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer group focus-visible:outline-none"
        >
          <div className="relative">
            <ReceiptText
              className={`w-5 h-5 transition-transform duration-200 ${
                activeTab === 'orders'
                  ? 'text-amber-800 scale-110 drop-shadow-[0_2px_4px_rgba(180,83,9,0.25)]'
                  : 'text-stone-400 group-hover:text-stone-700'
              }`}
            />
            {activeOrderCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 w-4 h-4 terracotta-gradient-bg text-white font-extrabold text-[9px] rounded-full flex items-center justify-center ring-2 ring-white shadow-xs">
                {activeOrderCount}
              </span>
            )}
          </div>
          <span
            className={`text-[10px] tracking-tight mt-1 transition-colors ${
              activeTab === 'orders' ? 'text-amber-900 font-bold' : 'text-stone-500 font-medium group-hover:text-stone-800'
            }`}
          >
            Orders
          </span>
          {activeTab === 'orders' && (
            <span className="absolute bottom-1 w-1.5 h-1 rounded-full bg-amber-700"></span>
          )}
        </button>
      </nav>

      {/* Bottom Home Indicator Line */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-stone-300 rounded-full pointer-events-none z-50"></div>
    </div>
  );

  if (!isDeviceFrame) {
    return (
      <div className="w-full max-w-md mx-auto h-[844px] max-h-[calc(100vh-3rem)] max-sm:h-[100dvh] max-sm:max-h-none max-sm:rounded-none max-sm:border-0 sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-200 bg-white">
        {content}
      </div>
    );
  }

  // Realistic iPhone 16 Pro Frame in Natural Silver Titanium for White Palette
  return (
    <div className="relative mx-auto my-2 w-[394px] max-w-full h-[836px] max-h-[calc(100vh-2rem)] rounded-[54px] p-3.5 bg-gradient-to-b from-[#e7e5e0] via-[#dcd8d0] to-[#cbc6bc] shadow-[0_20px_60px_-15px_rgba(40,30,20,0.18)] ring-1 ring-stone-300 max-sm:my-0 max-sm:w-full max-sm:h-[100dvh] max-sm:max-h-none max-sm:rounded-none max-sm:p-0 max-sm:bg-transparent max-sm:shadow-none max-sm:ring-0">
      {/* Outer frame styling buttons in silver alloy (hidden on mobile screens) */}
      <div className="hidden sm:block absolute -left-1.5 top-24 w-1.5 h-8 bg-stone-400/80 rounded-l-sm"></div>
      <div className="hidden sm:block absolute -left-1.5 top-36 w-1.5 h-12 bg-stone-400/80 rounded-l-sm"></div>
      <div className="hidden sm:block absolute -left-1.5 top-52 w-1.5 h-12 bg-stone-400/80 rounded-l-sm"></div>
      <div className="hidden sm:block absolute -right-1.5 top-34 w-1.5 h-16 bg-stone-400/80 rounded-r-sm"></div>

      {/* Inner display bezel */}
      <div className="w-full h-full rounded-[44px] max-sm:rounded-none overflow-hidden border-[4px] max-sm:border-0 border-[#222120] bg-white relative">
        {content}
      </div>
    </div>
  );
};
