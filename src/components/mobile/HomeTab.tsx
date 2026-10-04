import React, { useState } from 'react';
import {
  MapPin,
  Bell,
  Search,
  Star,
  Plus,
  Clock,
  ChevronRight,
  Flame,
  Award,
  Sparkles,
  CalendarDays,
  Check,
  UtensilsCrossed,
  Filter
} from 'lucide-react';
import { Product, User, Cuisine } from '../../types/restaurant';
import { PRODUCTS, CUISINES } from '../../data/restaurantData';
import { playTapChime, playSuccessChime } from '../../utils/audioChime';
import { resolveImageUrl, handleImageError } from '../../utils/imageUtils';

interface HomeTabProps {
  user: User;
  onSelectProduct: (product: Product) => void;
  onSelectCuisine: (cuisineSlug: string) => void;
  onNavigateToBooking: () => void;
  onNavigateToMenu: () => void;
  onNavigateToSearch?: () => void;
  onNavigateToProfile?: () => void;
  onAddToCart?: (product: Product) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  user,
  onSelectProduct,
  onSelectCuisine,
  onNavigateToBooking,
  onNavigateToMenu,
  onNavigateToSearch,
  onNavigateToProfile,
  onAddToCart,
  favorites,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch] = useState('Riverside Royal Pavilion, Phnom Penh');
  const [activeHomeCategory, setActiveHomeCategory] = useState<string>('all');

  // Filtered dishes for direct search input
  const filteredDishes = searchQuery.trim()
    ? PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.local_name && p.local_name.includes(searchQuery))
      )
    : null;

  // Categorized Dishes for Home Showcase
  const popularDishes = PRODUCTS.filter((p) => p.is_popular);
  const recommendedDishes = PRODUCTS.filter((p) => p.is_recommended);
  const khmerDishes = PRODUCTS.filter((p) => p.cuisine_id === 'cui_khmer');
  const chineseDishes = PRODUCTS.filter((p) => p.cuisine_id === 'cui_chinese');
  const westernDishes = PRODUCTS.filter((p) => p.cuisine_id === 'cui_western');
  const drinksAndDesserts = PRODUCTS.filter((p) => p.cuisine_id === 'cui_drinks');

  // Dynamic products based on active Home category filter
  const displayedCategoryDishes =
    activeHomeCategory === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((p) => {
          if (activeHomeCategory === 'khmer') return p.cuisine_id === 'cui_khmer';
          if (activeHomeCategory === 'chinese') return p.cuisine_id === 'cui_chinese';
          if (activeHomeCategory === 'western') return p.cuisine_id === 'cui_western';
          if (activeHomeCategory === 'drinks') return p.cuisine_id === 'cui_drinks';
          return true;
        });

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    playSuccessChime();
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      onSelectProduct(product);
    }
  };

  return (
    <div className="space-y-5 pb-10">
      {/* 1. Header (Greeting, Location, Clean Profile Avatar) */}
      <div className="px-5 pt-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold">
            <MapPin className="w-3.5 h-3.5 text-amber-700" />
            <span className="tracking-tight">{selectedBranch}</span>
          </div>
          <h1 className="font-luxury text-2xl font-bold tracking-tight text-stone-900 mt-0.5">
            Welcome, {user.name}
          </h1>
          <p className="text-[11px] text-stone-600">
            Royal Khmer Culinary Heritage &amp; Contemporary Dining
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToProfile && (
            <button
              onClick={() => {
                playTapChime();
                onNavigateToProfile();
              }}
              title="Open My Profile"
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <div className="w-8 h-8 rounded-xl terracotta-gradient-bg text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {user.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="text-left">
                <span className="block text-[11px] font-bold text-stone-900 leading-tight">Profile</span>
                <span className="block text-[9px] text-amber-800 font-semibold">VIP Member</span>
              </div>
            </button>
          )}

          <div className="relative">
            <button
              title="Notifications"
              className="w-10 h-10 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:text-stone-950 transition-colors cursor-pointer shadow-xs"
            >
              <Bell className="w-4 h-4 text-stone-700" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Search Bar with Discovery Shortcut */}
      <div className="px-5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-700" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Fish Amok, Wagyu Lok Lak, Pizza, Drinks..."
              className="w-full bg-white border border-amber-200/90 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            )}
          </div>
          {onNavigateToSearch && (
            <button
              onClick={() => {
                playTapChime();
                onNavigateToSearch();
              }}
              title="Open Full Search & Discovery Hub"
              className="p-2.5 rounded-2xl terracotta-gradient-bg text-white shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span className="text-[11px] font-bold hidden sm:inline">All Dishes</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Results if active */}
      {filteredDishes && (
        <div className="px-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Search Results ({filteredDishes.length})
            </h2>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-amber-700 font-semibold hover:underline"
            >
              Close
            </button>
          </div>
          {filteredDishes.length === 0 ? (
            <p className="text-xs text-stone-500 py-6 text-center">No dishes match "{searchQuery}"</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredDishes.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-200 p-2.5 cursor-pointer hover:border-amber-600 transition-all flex flex-col justify-between shadow-xs"
                >
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-100 mb-2">
                    <img
                      src={resolveImageUrl(product.image_url)}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-sm flex items-center gap-1 text-[10px] text-amber-800 font-bold font-mono shadow-xs">
                      <Star className="w-2.5 h-2.5 fill-amber-600 text-amber-600" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900 line-clamp-1">{product.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-extrabold text-amber-800 font-mono">${product.price.toFixed(2)}</span>
                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        className="w-6 h-6 rounded-lg terracotta-gradient-bg text-white flex items-center justify-center font-bold hover:brightness-105 active:scale-90 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!filteredDishes && (
        <>
          {/* 3. Promotional Banner */}
          <div className="px-5">
            <div className="relative overflow-hidden rounded-3xl terracotta-gradient-bg p-5 text-white shadow-md shadow-amber-900/15">
              <div className="relative z-10 max-w-[72%] space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-200 tracking-widest uppercase">
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span>MICHELIN GUIDE NOMINEE 2026</span>
                </div>
                <h3 className="font-luxury text-xl font-bold tracking-tight leading-tight text-white">
                  Table Reservations &amp; Dining
                </h3>
                <p className="text-[11px] text-amber-100/90 leading-snug">
                  Reserve a table online and enjoy a complimentary chef amuse-bouche &amp; welcome drink.
                </p>
                <div className="pt-2">
                  <button
                    onClick={onNavigateToBooking}
                    className="px-3.5 py-1.5 bg-white text-stone-900 rounded-xl text-xs font-bold hover:bg-amber-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  >
                    <span>Reserve a Table</span>
                    <ChevronRight className="w-3 h-3 text-amber-800" />
                  </button>
                </div>
              </div>
              <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
              <div className="absolute right-4 bottom-2 text-6xl opacity-15 pointer-events-none font-luxury text-white">
                A&amp;B
              </div>
            </div>
          </div>

          {/* 4. Culinary Collections Horizontal Chips */}
          <div className="px-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-stone-600 uppercase tracking-widest">
                Culinary Collections
              </h2>
              <button
                onClick={() => onSelectCuisine('all')}
                className="text-[11px] font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-0.5 cursor-pointer"
              >
                <span>View Full Menu ({PRODUCTS.length})</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {/* All Cuisines Button */}
              <button
                onClick={() => {
                  playTapChime();
                  setActiveHomeCategory('all');
                }}
                className={`flex flex-col items-center justify-center p-3 w-22 rounded-2xl transition-all cursor-pointer group shadow-xs shrink-0 ${
                  activeHomeCategory === 'all'
                    ? 'terracotta-gradient-bg text-white font-bold ring-2 ring-amber-400'
                    : 'bg-white border border-stone-200 text-stone-800 hover:border-amber-600'
                }`}
              >
                <span className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">
                  🌟
                </span>
                <span className="text-[11px] font-bold text-center leading-tight truncate w-full">
                  All
                </span>
                <span className={`text-[9px] font-mono font-bold mt-0.5 ${activeHomeCategory === 'all' ? 'text-amber-200' : 'text-amber-800'}`}>
                  {PRODUCTS.length} dishes
                </span>
              </button>

              {CUISINES.map((cuisine) => {
                const icons: Record<string, string> = {
                  khmer: '🍲',
                  western: '🍕',
                  chinese: '🥟',
                  drinks: '🍹',
                };
                const isSelected = activeHomeCategory === cuisine.slug;
                return (
                  <button
                    key={cuisine.id}
                    onClick={() => {
                      playTapChime();
                      setActiveHomeCategory(cuisine.slug);
                    }}
                    className={`flex flex-col items-center justify-center p-3 w-22 rounded-2xl transition-all cursor-pointer group shadow-xs shrink-0 ${
                      isSelected
                        ? 'terracotta-gradient-bg text-white font-bold ring-2 ring-amber-400'
                        : 'bg-white border border-stone-200 text-stone-800 hover:border-amber-600'
                    }`}
                  >
                    <span className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">
                      {icons[cuisine.slug] || '🍽️'}
                    </span>
                    <span className="text-[11px] font-bold text-center leading-tight truncate w-full">
                      {cuisine.name.replace(' Food', '')}
                    </span>
                    <span className={`text-[9px] font-mono mt-0.5 ${isSelected ? 'text-amber-200' : 'text-stone-500'}`}>
                      {cuisine.item_count} items
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Signature Dishes Horizontal Carousel */}
          <div className="space-y-2.5">
            <div className="px-5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <span>Signature &amp; Bestsellers</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.2 rounded-full font-bold">
                    Top Rated
                  </span>
                </h2>
                <p className="text-[11px] text-stone-500">Patron favorites &amp; award-winning recipes</p>
              </div>
              <button
                onClick={onNavigateToMenu}
                className="text-[11px] font-semibold text-amber-800 hover:text-amber-900 cursor-pointer"
              >
                See all
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-1">
              {popularDishes.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="w-52 shrink-0 bg-white rounded-2xl overflow-hidden border border-stone-200 p-3 cursor-pointer hover:border-amber-600 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
                >
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-100 mb-2.5">
                    <img
                      src={resolveImageUrl(product.image_url)}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-white/90 backdrop-blur-sm flex items-center gap-1 text-[10px] text-amber-800 font-bold font-mono shadow-xs">
                      <Star className="w-2.5 h-2.5 fill-amber-600 text-amber-600" />
                      <span>{product.rating}</span>
                    </div>

                    {product.spice_level && product.spice_level > 0 ? (
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-white/90 backdrop-blur-sm text-[10px] shadow-xs">
                        {'🌶️'.repeat(product.spice_level)}
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900 line-clamp-1">{product.name}</h3>
                    <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">{product.description}</p>
                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-stone-100">
                      <span className="text-xs font-extrabold text-amber-800 font-mono">
                        ${product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        className="px-2.5 py-1 rounded-lg terracotta-gradient-bg text-white font-bold text-[11px] hover:brightness-105 active:scale-95 flex items-center gap-1 cursor-pointer shadow-xs transition-all"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Active Category Showcase Cards (More Menu Cards!) */}
          <div className="px-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-stone-900 capitalize">
                  {activeHomeCategory === 'all'
                    ? 'Explore All Gourmet Dishes'
                    : `${activeHomeCategory} Delicacies`}
                </h2>
                <p className="text-[11px] text-stone-500">
                  Showing {displayedCategoryDishes.length} freshly prepared items
                </p>
              </div>
              {activeHomeCategory !== 'all' && (
                <button
                  onClick={() => setActiveHomeCategory('all')}
                  className="text-xs font-bold text-amber-800 hover:underline cursor-pointer"
                >
                  Show All (24)
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {displayedCategoryDishes.slice(0, 8).map((product) => (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-200 p-2.5 cursor-pointer hover:border-amber-600 transition-all flex flex-col justify-between shadow-xs hover:shadow-md group"
                >
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-100 mb-2">
                    <img
                      src={resolveImageUrl(product.image_url)}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-sm flex items-center gap-1 text-[10px] text-amber-800 font-bold font-mono shadow-xs">
                      <Star className="w-2.5 h-2.5 fill-amber-600 text-amber-600" />
                      <span>{product.rating}</span>
                    </div>

                    {product.spice_level && product.spice_level > 0 && (
                      <div className="absolute top-1.5 right-1.5 px-1 py-0.5 rounded bg-white/90 text-[9px] shadow-xs">
                        {'🌶️'.repeat(product.spice_level)}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-stone-900 line-clamp-1">{product.name}</h3>
                    {product.local_name && (
                      <p className="text-[10px] text-amber-800 font-medium truncate">{product.local_name}</p>
                    )}
                    <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">{product.description}</p>
                    
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-100">
                      <span className="text-xs font-extrabold text-amber-900 font-mono">
                        ${product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        className="px-2 py-1 rounded-lg terracotta-gradient-bg text-white font-bold text-[10px] hover:brightness-105 active:scale-95 flex items-center gap-0.5 shadow-xs transition-all"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Royal Khmer Heritage Feature Section */}
          <div className="px-5 space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <span>Royal Khmer Heritage Classics</span>
                  <span className="text-[10px] bg-orange-100 text-orange-900 px-2 py-0.2 rounded-full font-bold">
                    Authentic
                  </span>
                </h2>
                <p className="text-[11px] text-stone-500">Traditional Cambodian recipes passed through generations</p>
              </div>
              <button
                onClick={() => onSelectCuisine('khmer')}
                className="text-[11px] font-semibold text-amber-800 hover:text-amber-900 cursor-pointer"
              >
                View all ({khmerDishes.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {khmerDishes.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="p-3 rounded-2xl bg-white border border-stone-200 hover:border-amber-600 transition-all flex items-center gap-3 cursor-pointer shadow-xs hover:shadow-sm"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-stone-100 relative">
                    <img
                      src={resolveImageUrl(product.image_url)}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-sm flex items-center gap-0.5 text-[9px] text-amber-800 font-bold font-mono">
                      <Star className="w-2.5 h-2.5 fill-amber-600 text-amber-600" />
                      <span>{product.rating}</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {product.preparation_time_minutes}m
                      </span>
                      {product.local_name && (
                        <>
                          <span>·</span>
                          <span className="text-amber-800 font-medium">{product.local_name}</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-xs font-bold text-stone-900 truncate mt-0.5">{product.name}</h3>
                    <p className="text-[11px] text-stone-500 line-clamp-1">{product.description}</p>

                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-xs font-extrabold text-amber-900 font-mono">
                        ${product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        className="px-2.5 py-1 terracotta-gradient-bg hover:brightness-105 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-0.5"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Order</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 8. Chinese Dim Sum & Wok Section */}
          <div className="px-5 space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <span>Chinese Dim Sum &amp; Imperial Wok</span>
                  <span className="text-[10px] bg-red-100 text-red-900 px-2 py-0.2 rounded-full font-bold">
                    Handmade
                  </span>
                </h2>
                <p className="text-[11px] text-stone-500">Delicate steamed baskets, roasted meats &amp; noodles</p>
              </div>
              <button
                onClick={() => onSelectCuisine('chinese')}
                className="text-[11px] font-semibold text-amber-800 hover:text-amber-900 cursor-pointer"
              >
                View all ({chineseDishes.length})
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {chineseDishes.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-200 p-2.5 cursor-pointer hover:border-amber-600 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
                >
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-100 mb-2">
                    <img
                      src={resolveImageUrl(product.image_url)}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-sm flex items-center gap-1 text-[10px] text-amber-800 font-bold font-mono shadow-xs">
                      <Star className="w-2.5 h-2.5 fill-amber-600 text-amber-600" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900 line-clamp-1">{product.name}</h3>
                    <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">{product.description}</p>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-100">
                      <span className="text-xs font-extrabold text-amber-900 font-mono">${product.price.toFixed(2)}</span>
                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        className="px-2 py-1 rounded-lg terracotta-gradient-bg text-white font-bold text-[10px] hover:brightness-105 active:scale-95 flex items-center gap-0.5 shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 9. Artisanal Drinks & Sweet Desserts */}
          <div className="space-y-2.5 pt-1">
            <div className="px-5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <span>Craft Mocktails &amp; Desserts</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.2 rounded-full font-bold">
                    Fresh
                  </span>
                </h2>
                <p className="text-[11px] text-stone-500">Tropical fruit blends, sticky rice &amp; Khmer coffee</p>
              </div>
              <button
                onClick={() => onSelectCuisine('drinks')}
                className="text-[11px] font-semibold text-amber-800 hover:text-amber-900 cursor-pointer"
              >
                View all
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-1">
              {drinksAndDesserts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="w-44 shrink-0 bg-white rounded-2xl overflow-hidden border border-stone-200 p-2.5 cursor-pointer hover:border-amber-600 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
                >
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-100 mb-2">
                    <img
                      src={resolveImageUrl(product.image_url)}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-sm flex items-center gap-1 text-[10px] text-amber-800 font-bold font-mono shadow-xs">
                      <Star className="w-2.5 h-2.5 fill-amber-600 text-amber-600" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900 line-clamp-1">{product.name}</h3>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-100">
                      <span className="text-xs font-extrabold text-amber-900 font-mono">
                        ${product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        className="px-2 py-1 rounded-lg terracotta-gradient-bg text-white font-bold text-[10px] hover:brightness-105 active:scale-95 flex items-center gap-0.5 shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 10. Table Reservation Quick Callout */}
          <div className="px-5 pt-2">
            <div className="p-4 rounded-3xl bg-stone-900 text-white border border-stone-800 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl terracotta-gradient-bg text-white flex items-center justify-center">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Reserve Your Table Online</h4>
                  <p className="text-[10px] text-stone-400">Riverside Window &amp; Garden Veranda seating</p>
                </div>
              </div>
              <button
                onClick={onNavigateToBooking}
                className="px-3.5 py-2 terracotta-gradient-bg text-white font-bold rounded-xl text-xs hover:brightness-110 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                Book Now
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
