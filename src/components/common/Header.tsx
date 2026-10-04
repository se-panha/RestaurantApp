import React from 'react';
import { Smartphone, Monitor, ShoppingBag, Download, ChefHat, Sparkles, Layers } from 'lucide-react';

export type ActiveAppView = 'mobile_app' | 'figma_showcase' | 'architecture' | 'process_flow' | 'erd' | 'admin_portal';
export type ThemeColor = 'saffron' | 'emerald' | 'velvet';
export type PatternStyle = 'motif' | 'bistro' | 'herbs' | 'porcelain';

interface HeaderProps {
  activeView: ActiveAppView;
  setActiveView: (view: ActiveAppView) => void;
  cartCount: number;
  onOpenCart: () => void;
  isDeviceFrame: boolean;
  setIsDeviceFrame: (val: boolean) => void;
  onExportDrawio: () => void;
  onOpenFigmaExport: () => void;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  patternStyle: PatternStyle;
  setPatternStyle: (pattern: PatternStyle) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  cartCount,
  onOpenCart,
  isDeviceFrame,
  setIsDeviceFrame,
  onExportDrawio,
  onOpenFigmaExport,
  themeColor,
  setThemeColor,
  patternStyle,
  setPatternStyle,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200/90 px-4 lg:px-8 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark with Michelin-grade serif typography */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveView('mobile_app')}
            className="text-left group cursor-pointer focus-visible:outline-none flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg terracotta-gradient-bg flex items-center justify-center text-white font-luxury font-bold text-lg shadow-sm shadow-amber-900/10">
              A
            </div>
            <div>
              <span className="font-luxury text-xl font-bold tracking-wider text-stone-900 group-hover:text-amber-800 transition-colors uppercase">
                Amok &amp; Basil
              </span>
              <span className="hidden sm:inline-block text-[10px] text-stone-500 font-mono tracking-widest uppercase ml-2">
                · Royal Khmer &amp; Bistro
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Clean domain-native navigation links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
          <button
            onClick={() => setActiveView('mobile_app')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeView === 'mobile_app'
                ? 'bg-amber-100/70 text-amber-950 border border-amber-300/80 shadow-xs'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            Customer App
          </button>

          <button
            onClick={() => setActiveView('figma_showcase')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeView === 'figma_showcase'
                ? 'bg-purple-100 text-purple-950 border border-purple-300 shadow-xs'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            <span>Figma Canvas (All 6 Screens)</span>
          </button>

          <button
            onClick={() => setActiveView('architecture')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeView === 'architecture'
                ? 'bg-amber-100/70 text-amber-950 border border-amber-300/80 shadow-xs'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            System Architecture
          </button>

          <button
            onClick={() => setActiveView('process_flow')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeView === 'process_flow'
                ? 'bg-amber-100/70 text-amber-950 border border-amber-300/80 shadow-xs'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            Process Flow
          </button>

          <button
            onClick={() => setActiveView('erd')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeView === 'erd'
                ? 'bg-amber-100/70 text-amber-950 border border-amber-300/80 shadow-xs'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            Database ERD
          </button>

          <button
            onClick={() => setActiveView('admin_portal')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeView === 'admin_portal'
                ? 'bg-emerald-100/80 text-emerald-950 border border-emerald-300/80 shadow-xs'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5 text-emerald-700" />
            <span>Kitchen &amp; KDS Portal</span>
          </button>
        </nav>

        {/* Zone 3: Actions + Pattern & Palette switchers */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Restaurant Pattern Selector */}
          <div className="flex items-center bg-stone-100/90 border border-stone-200/90 rounded-lg p-0.5" title="App Background Pattern for Food & Restaurant">
            <button
              onClick={() => setPatternStyle('motif')}
              className={`px-2 py-1 text-[11px] font-medium rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                patternStyle === 'motif'
                  ? 'bg-white text-amber-900 font-bold shadow-xs border border-amber-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Artisanal Culinary Motif (Warm terracotta cutlery, cloche & herbs watermark)"
            >
              <span>🍽️</span>
              <span className="hidden xl:inline">Motif</span>
            </button>

            <button
              onClick={() => setPatternStyle('bistro')}
              className={`px-2 py-1 text-[11px] font-medium rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                patternStyle === 'bistro'
                  ? 'bg-white text-amber-900 font-bold shadow-xs border border-amber-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="French Bistro Linen Check (Warm terracotta woven linen)"
            >
              <span>🧺</span>
              <span className="hidden xl:inline">Bistro</span>
            </button>

            <button
              onClick={() => setPatternStyle('herbs')}
              className={`px-2 py-1 text-[11px] font-medium rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                patternStyle === 'herbs'
                  ? 'bg-white text-emerald-900 font-bold shadow-xs border border-emerald-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Botanical Fresh Herb (Organic basil & lemongrass sprigs)"
            >
              <span>🌿</span>
              <span className="hidden xl:inline">Herbs</span>
            </button>

            <button
              onClick={() => setPatternStyle('porcelain')}
              className={`px-2 py-1 text-[11px] font-medium rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                patternStyle === 'porcelain'
                  ? 'bg-white text-stone-900 font-bold shadow-xs border border-stone-300'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Luminous White Porcelain (Clean crisp fine dining)"
            >
              <span>✨</span>
              <span className="hidden xl:inline">Porcelain</span>
            </button>
          </div>

          {/* Color accent switcher */}
          <div className="hidden lg:flex items-center gap-1 p-1 bg-stone-100 border border-stone-200 rounded-lg">
            <button
              onClick={() => setThemeColor('saffron')}
              title="Warm Saffron Terracotta"
              className={`w-3.5 h-3.5 rounded-full transition-transform ${
                themeColor === 'saffron' ? 'ring-2 ring-amber-600 scale-110' : 'opacity-60 hover:opacity-100'
              }`}
              style={{ background: 'linear-gradient(135deg, #c2410c, #b45309)' }}
            />
            <button
              onClick={() => setThemeColor('emerald')}
              title="Fresh Botanical Basil"
              className={`w-3.5 h-3.5 rounded-full transition-transform ${
                themeColor === 'emerald' ? 'ring-2 ring-emerald-600 scale-110' : 'opacity-60 hover:opacity-100'
              }`}
              style={{ background: 'linear-gradient(135deg, #15803d, #166534)' }}
            />
            <button
              onClick={() => setThemeColor('velvet')}
              title="Bordeaux Wine"
              className={`w-3.5 h-3.5 rounded-full transition-transform ${
                themeColor === 'velvet' ? 'ring-2 ring-rose-600 scale-110' : 'opacity-60 hover:opacity-100'
              }`}
              style={{ background: 'linear-gradient(135deg, #9f1239, #881337)' }}
            />
          </div>

          {activeView === 'mobile_app' && (
            <button
              onClick={() => setIsDeviceFrame(!isDeviceFrame)}
              title={isDeviceFrame ? 'Switch to Wide Responsive Canvas' : 'Wrap in Silver Titanium Chassis'}
              className="p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
            >
              {isDeviceFrame ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-amber-700" />
                  <span className="hidden sm:inline font-medium">Wide</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-amber-700" />
                  <span className="hidden sm:inline font-medium">Chassis</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={onOpenFigmaExport}
            title="Export Mobile Screens to Figma Canvas"
            className="px-2.5 py-1.5 text-xs font-semibold text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">Figma</span>
          </button>

          <button
            onClick={onExportDrawio}
            title="Download Diagrams.net / draw.io XML file"
            className="px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline font-medium">.drawio</span>
          </button>

          <button
            onClick={onOpenCart}
            className="relative px-3 py-1.5 text-xs font-semibold text-white terracotta-gradient-bg hover:brightness-105 rounded-lg transition-all flex items-center gap-1.5 shadow-sm shadow-amber-900/15 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-white text-amber-900 rounded-full text-[10px] font-bold shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Small Screen Nav Bar */}
      <div className="md:hidden flex items-center justify-between gap-1 overflow-x-auto no-scrollbar pt-2 mt-2 border-t border-stone-200">
        <button
          onClick={() => setActiveView('mobile_app')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
            activeView === 'mobile_app' ? 'bg-amber-100 text-amber-950' : 'text-stone-600'
          }`}
        >
          Mobile App
        </button>
        <button
          onClick={() => setActiveView('figma_showcase')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
            activeView === 'figma_showcase' ? 'bg-purple-100 text-purple-950 font-bold' : 'text-stone-600'
          }`}
        >
          Figma (6 Screens)
        </button>
        <button
          onClick={() => setActiveView('architecture')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
            activeView === 'architecture' ? 'bg-amber-100 text-amber-950' : 'text-stone-600'
          }`}
        >
          Architecture
        </button>
        <button
          onClick={() => setActiveView('process_flow')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
            activeView === 'process_flow' ? 'bg-amber-100 text-amber-950' : 'text-stone-600'
          }`}
        >
          Flowchart
        </button>
        <button
          onClick={() => setActiveView('erd')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
            activeView === 'erd' ? 'bg-amber-100 text-amber-950' : 'text-stone-600'
          }`}
        >
          ERD Model
        </button>
        <button
          onClick={() => setActiveView('admin_portal')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap ${
            activeView === 'admin_portal' ? 'bg-emerald-100 text-emerald-950' : 'text-stone-600'
          }`}
        >
          Staff Portal
        </button>
      </div>
    </header>
  );
};
