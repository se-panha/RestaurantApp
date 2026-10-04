import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Copy,
  Check,
  Layers,
  Sparkles,
  Smartphone,
  Download,
  Palette,
  FileCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface FigmaExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  liveUrl: string;
}

export const FigmaExportModal: React.FC<FigmaExportModalProps> = ({
  isOpen,
  onClose,
  liveUrl,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedPalette, setCopiedPalette] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<'plugin' | 'screens' | 'palette'>('plugin');

  if (!isOpen) return null;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(liveUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    } catch {
      // Fallback
    }
  };

  const paletteTokens = [
    { name: 'Terracotta Wok (Primary CTA)', hex: '#c2410c', desc: 'Main action buttons & badges' },
    { name: 'Cambodian Gold (Accent)', hex: '#d97706', desc: 'Star ratings & highlights' },
    { name: 'Khmer Jade (Fresh)', hex: '#15803d', desc: 'Vegetarian tags & success' },
    { name: 'Silk Ivory Canvas', hex: '#fcfbf9', desc: 'App background' },
    { name: 'Card Surface', hex: '#ffffff', desc: 'Card containers' },
    { name: 'Stone Border', hex: '#e7e5e4', desc: 'Dividers & outlines' },
    { name: 'Obsidian Black', hex: '#1c1917', desc: 'Headings & primary copy' },
    { name: 'Warm Charcoal', hex: '#78716c', desc: 'Subtitles & hints' },
  ];

  const handleCopyPalette = async () => {
    const text = paletteTokens.map((t) => `${t.name}: ${t.hex}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPalette(true);
      setTimeout(() => setCopiedPalette(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-amber-500 flex items-center justify-center shadow-md">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold tracking-tight">
                  Export to Figma Workspace
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Full App
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                Convert live mobile app screens into editable Figma frames, layers &amp; vector shapes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-4 sm:px-6 shrink-0 gap-2">
          <button
            onClick={() => setActiveGuideTab('plugin')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeGuideTab === 'plugin'
                ? 'border-amber-700 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Method 1: Figma Plugin (Vector &amp; Layers)</span>
          </button>

          <button
            onClick={() => setActiveGuideTab('screens')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeGuideTab === 'screens'
                ? 'border-amber-700 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-600" />
            <span>Method 2: Screen Screenshots</span>
          </button>

          <button
            onClick={() => setActiveGuideTab('palette')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeGuideTab === 'palette'
                ? 'border-amber-700 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-amber-600" />
            <span>Design Tokens</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-stone-800 text-sm">
          {/* TAB 1: PLUGIN IMPORT METHOD */}
          {activeGuideTab === 'plugin' && (
            <div className="space-y-5">
              {/* Target Figma File Notice */}
              <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-200/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                  F
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-950">Your Target Figma File:</span>
                    <a
                      href="https://www.figma.com/design/PobNpNn3q1BU9OsjJRdX1T/Mobile-Assigment?node-id=45-26"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1 underline underline-offset-2"
                    >
                      <span>Open "Mobile-Assigment"</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-purple-800/90 mt-1">
                    Figma prevents external web apps from editing canvas files without your personal authorization. Using the official free Figma plugin below imports the exact layers in 30 seconds!
                  </p>
                </div>
              </div>

              {/* Step 1: Copy Live URL */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-700 text-white text-[11px] font-bold flex items-center justify-center">
                    1
                  </span>
                  <span className="font-semibold text-stone-900 text-xs sm:text-sm">
                    Copy Your Live Mobile Web App URL:
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-stone-100 rounded-xl border border-stone-200">
                  <span className="text-xs font-mono text-stone-700 truncate flex-1 pl-1">
                    {liveUrl}
                  </span>
                  <button
                    onClick={handleCopyUrl}
                    className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer"
                  >
                    {copiedUrl ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Step 2: Open html.to.design plugin */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-700 text-white text-[11px] font-bold flex items-center justify-center">
                    2
                  </span>
                  <span className="font-semibold text-stone-900 text-xs sm:text-sm">
                    In Figma, Run the Plugin:
                  </span>
                </div>
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
                  <p className="text-stone-700">
                    Inside your Figma project, right-click on the canvas and choose:
                  </p>
                  <div className="p-2.5 bg-white rounded-lg border border-stone-200 font-mono text-[11px] text-stone-800 flex items-center gap-2">
                    <span className="text-amber-800 font-semibold">Right Click Canvas</span>
                    <ArrowRight className="w-3 h-3 text-stone-400" />
                    <span className="text-stone-700">Plugins</span>
                    <ArrowRight className="w-3 h-3 text-stone-400" />
                    <span className="text-purple-700 font-bold">html.to.design</span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    (Alternatively, search for "html.to.design" in the Figma Resources / Community tab)
                  </p>
                </div>
              </div>

              {/* Step 3: Paste and Import */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-700 text-white text-[11px] font-bold flex items-center justify-center">
                    3
                  </span>
                  <span className="font-semibold text-stone-900 text-xs sm:text-sm">
                    Select Viewport &amp; Click "Import":
                  </span>
                </div>
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
                  <ul className="space-y-1.5 text-stone-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Paste the copied Live App URL into the plugin.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>
                        Choose Viewport: <strong>390px (iPhone 14 / 15 / 16 Pro)</strong>.
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>
                        Click <strong>Import</strong> — Figma will build complete auto-layout frames, text nodes, images, and buttons!
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCREEN SCREENSHOT METHOD */}
          {activeGuideTab === 'screens' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <strong>Fastest Visual Method:</strong> If you need pixel-perfect presentation mockups for your assignment, take full-size screenshots directly from your browser and drag them into Figma.
              </div>

              <div className="space-y-3">
                <div className="font-semibold text-xs text-stone-900 uppercase tracking-wider">
                  How to Take Full Mobile Screenshots (Chrome / Edge / Brave):
                </div>

                <ol className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5 text-xs text-stone-700">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-800">1.</span>
                    <span>
                      Open the{' '}
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-800 underline font-semibold"
                      >
                        Live App Preview Link ↗
                      </a>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-800">2.</span>
                    <span>
                      Press <kbd className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[10px] font-mono">F12</kbd> (or right click -&gt; Inspect).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-800">3.</span>
                    <span>
                      Press <kbd className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[10px] font-mono">Ctrl + Shift + M</kbd> (or <kbd className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[10px] font-mono">Cmd + Shift + M</kbd> on Mac) to toggle Device Mode, and select <strong>iPhone 14/15 Pro (390 x 844)</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-800">4.</span>
                    <span>
                      Press <kbd className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[10px] font-mono">Ctrl + Shift + P</kbd>, type <code>Capture full size screenshot</code>, and press Enter.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-800">5.</span>
                    <span>
                      Drag the downloaded high-resolution PNG straight into your Figma canvas!
                    </span>
                  </li>
                </ol>
              </div>

              {/* 5 App Tabs Summary */}
              <div className="space-y-2">
                <span className="font-semibold text-xs text-stone-900">
                  Screens Ready for Your Assignment:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                    <span className="font-bold text-amber-900 block">1. Home Screen</span>
                    <span className="text-[11px] text-stone-500">Specials, quick booking banner &amp; cuisines</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                    <span className="font-bold text-amber-900 block">2. Menu Catalog</span>
                    <span className="text-[11px] text-stone-500">24 Khmer dishes, dietary badges &amp; add to cart</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                    <span className="font-bold text-amber-900 block">3. Search &amp; Filter</span>
                    <span className="text-[11px] text-stone-500">Center spotlight search with live results</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                    <span className="font-bold text-amber-900 block">4. Table Reservation</span>
                    <span className="text-[11px] text-stone-500">Interactive floor plan with T01-T05, M01-M03</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                    <span className="font-bold text-amber-900 block">5. Orders &amp; Kitchen</span>
                    <span className="text-[11px] text-stone-500">Live order tracker &amp; preparation status</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                    <span className="font-bold text-amber-900 block">6. Guest Profile</span>
                    <span className="text-[11px] text-stone-500">KHQR Loyalty Pass &amp; VIP member status</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DESIGN TOKENS & SPECS */}
          {activeGuideTab === 'palette' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    Color Palette (Figma Color Styles)
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Create these color styles in your Figma sidebar to match the app perfectly
                  </p>
                </div>

                <button
                  onClick={handleCopyPalette}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedPalette ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied All</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Hex List</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {paletteTokens.map((token) => (
                  <div
                    key={token.hex}
                    className="p-2.5 rounded-xl border border-stone-200 bg-white flex items-center gap-3"
                  >
                    <div
                      className="w-10 h-10 rounded-lg shadow-inner border border-black/10 shrink-0"
                      style={{ backgroundColor: token.hex }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900 truncate">
                          {token.name}
                        </span>
                        <code className="text-[11px] font-mono font-bold text-amber-900 bg-amber-50 px-1 rounded">
                          {token.hex}
                        </code>
                      </div>
                      <span className="text-[11px] text-stone-500 block truncate">
                        {token.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                <span className="font-bold text-stone-800 block">Figma Artboard / Frame Dimensions:</span>
                <p className="text-stone-600">
                  • <strong>Width:</strong> 390 px (standard Apple iPhone 14/15/16 Pro)<br />
                  • <strong>Height:</strong> 844 px (or auto-expanding vertical scroll frame)<br />
                  • <strong>Corner Radius:</strong> 44 px for device frame, 16-24 px for cards
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-stone-600">
            <Layers className="w-4 h-4 text-purple-600" />
            <span>Ready for your Figma "Mobile-Assigment" file</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href="https://www.figma.com/design/PobNpNn3q1BU9OsjJRdX1T/Mobile-Assigment?node-id=45-26"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <span>Go to Your Figma File</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
