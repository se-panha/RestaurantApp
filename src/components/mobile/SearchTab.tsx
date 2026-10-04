import React, { useState } from 'react';
import {
  Search,
  Star,
  Plus,
  Clock,
  Flame,
  Sparkles,
  SlidersHorizontal,
  X,
  TrendingUp,
  Tag,
  Check,
  Heart,
  ChefHat,
  Filter,
  DollarSign
} from 'lucide-react';
import { Product, CuisineType } from '../../types/restaurant';
import { CUISINES, PRODUCTS } from '../../data/restaurantData';
import { playTapChime } from '../../utils/audioChime';
import { resolveImageUrl, handleImageError } from '../../utils/imageUtils';

interface SearchTabProps {
  onSelectProduct: (product: Product) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onAddToCart: (product: Product) => void;
  onNavigateToMenu: () => void;
}

export const SearchTab: React.FC<SearchTabProps> = ({
  onSelectProduct,
  favorites,
  onToggleFavorite,
  onAddToCart,
  onNavigateToMenu,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineType>('all');
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');
  const [priceMax, setPriceMax] = useState<number>(35);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'rating'>('recommended');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const trendingTags = [
    'Fish Amok',
    'Woodfired Pizza',
    'Beef Lok Lak',
    'Truffle Dim Sum',
    'Matcha Cloud',
    'Chef Signature',
  ];

  // 1. CUISINE OPTIONS FEATURING "ALL CUISINES" PROMINENTLY FIRST
  const cuisineOptions = [
    {
      slug: 'all' as CuisineType,
      label: 'All Cuisines',
      icon: '🌟',
      count: PRODUCTS.length,
      color: 'from-amber-600 to-orange-600',
      activeRing: 'ring-amber-500',
    },
    {
      slug: 'khmer' as CuisineType,
      label: 'Royal Khmer',
      icon: '🍲',
      count: PRODUCTS.filter((p) => p.cuisine_id === 'cui_khmer').length,
      color: 'from-orange-600 to-amber-700',
      activeRing: 'ring-orange-500',
    },
    {
      slug: 'western' as CuisineType,
      label: 'Western Grill & Pizza',
      icon: '🍕',
      count: PRODUCTS.filter((p) => p.cuisine_id === 'cui_western').length,
      color: 'from-rose-600 to-red-700',
      activeRing: 'ring-rose-500',
    },
    {
      slug: 'chinese' as CuisineType,
      label: 'Chinese Dim Sum',
      icon: '🥟',
      count: PRODUCTS.filter((p) => p.cuisine_id === 'cui_chinese').length,
      color: 'from-amber-600 to-yellow-600',
      activeRing: 'ring-yellow-500',
    },
    {
      slug: 'drinks' as CuisineType,
      label: 'Bar & Artisanal Drinks',
      icon: '🍹',
      count: PRODUCTS.filter((p) => p.cuisine_id === 'cui_drinks').length,
      color: 'from-emerald-600 to-teal-700',
      activeRing: 'ring-emerald-500',
    },
  ];

  const dietaryOptions = [
    { id: 'all', label: 'All Dishes', icon: '🍽️' },
    { id: 'chef_signature', label: "Chef's Signature", icon: '👑' },
    { id: 'popular', label: 'Most Popular', icon: '🔥' },
    { id: 'vegetarian', label: 'Vegetarian', icon: '🌿' },
    { id: 'gluten_free', label: 'Gluten-Free', icon: '🌾' },
    { id: 'mild', label: 'Mild / Non-Spicy', icon: '🌱' },
  ];

  const filteredDishes = PRODUCTS.filter((dish) => {
    // 1. Cuisine Filter (All vs Specific)
    if (selectedCuisine !== 'all') {
      const match = CUISINES.find((c) => c.slug === selectedCuisine);
      if (match && dish.cuisine_id !== match.id) return false;
    }

    // 2. Dietary Filter
    if (dietaryFilter === 'chef_signature' && !dish.dietary_tags?.includes('chef_signature')) return false;
    if (dietaryFilter === 'popular' && !dish.is_popular) return false;
    if (dietaryFilter === 'vegetarian' && !dish.dietary_tags?.includes('vegetarian')) return false;
    if (dietaryFilter === 'gluten_free' && !dish.dietary_tags?.includes('gluten_free')) return false;
    if (dietaryFilter === 'mild' && (dish.spice_level || 0) > 1) return false;

    // 3. Price Filter
    if (dish.price > priceMax) return false;

    // 4. Text Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = dish.name.toLowerCase().includes(q);
      const matchLocal = dish.local_name && dish.local_name.includes(q);
      const matchDesc = dish.description.toLowerCase().includes(q);
      return matchName || matchLocal || matchDesc;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.is_recommended ? 1 : 0) - (a.is_recommended ? 1 : 0);
  });

  const handleAddToCartClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    playTapChime();
    onAddToCart(product);
    setRecentlyAddedId(product.id);
    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 1500);
  };

  const handleResetFilters = () => {
    playTapChime();
    setSearchQuery('');
    setSelectedCuisine('all');
    setDietaryFilter('all');
    setPriceMax(35);
    setSortBy('recommended');
  };

  return (
    <div className="space-y-4 pb-24 bg-[#fffdfa] min-h-full">
      {/* 1. Header with Golden Glow & Clean Culinary Aesthetic */}
      <div className="px-5 pt-4 space-y-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-amber-800 font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Smart Search &amp; Discovery</span>
          </div>
          <h1 className="font-luxury text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 mt-0.5">
            Discover Every Flavor
          </h1>
          <p className="text-xs text-stone-600">
            Browse our full 16+ dish menu: Royal Khmer, Western, Chinese &amp; Bar selections
          </p>
        </div>

        {/* Live Search Bar with Quick Clear */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-700" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by dish name, local Khmer, ingredients..."
            className="w-full bg-white border border-amber-200/90 rounded-2xl pl-10 pr-10 py-3 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 shadow-xs transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Popular & Trending Keyword Tags */}
      {!searchQuery && (
        <div className="px-5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
            <span>Popular Searches</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {trendingTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  playTapChime();
                  setSearchQuery(tag);
                }}
                className="px-3 py-1 rounded-xl bg-amber-50/90 hover:bg-amber-100 text-amber-950 border border-amber-200/80 text-[11px] font-bold whitespace-nowrap cursor-pointer transition-all shadow-xs active:scale-95 flex items-center gap-1"
              >
                <span>{tag}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. PROMINENT CUISINE SPECTRUM WITH VIBRANT "ALL" BUTTON FIRST */}
      <div className="px-5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-amber-700" />
            <span>Cuisine Spectrum</span>
          </span>
          <span className="text-[11px] text-amber-800 font-mono font-bold">
            {selectedCuisine === 'all' ? 'All Cuisines (16)' : selectedCuisine.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {cuisineOptions.map((cui) => {
            const isSelected = selectedCuisine === cui.slug;
            return (
              <button
                key={cui.slug}
                onClick={() => {
                  playTapChime();
                  setSelectedCuisine(cui.slug);
                }}
                className={`py-2 px-3.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 shadow-xs active:scale-95 ${
                  isSelected
                    ? 'terracotta-gradient-bg text-white shadow-md shadow-orange-900/20 scale-102 ring-2 ring-amber-400'
                    : 'bg-white text-stone-700 border border-stone-200/90 hover:border-amber-400 hover:bg-amber-50/50'
                }`}
              >
                <span className="text-base">{cui.icon}</span>
                <span className="font-semibold">{cui.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {cui.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Dietary Highlights & Quick Filters */}
      <div className="px-5 space-y-1.5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px]">
          {dietaryOptions.map((opt) => {
            const isSelected = dietaryFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  playTapChime();
                  setDietaryFilter(opt.id);
                }}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-100/90 text-amber-950 border border-amber-300 font-bold shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
                }`}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Price Ceiling & Sort Control Bar */}
      <div className="px-5 py-2.5 mx-5 rounded-2xl bg-white border border-amber-200/80 shadow-xs flex items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-stone-600 font-medium whitespace-nowrap flex items-center gap-0.5">
            <DollarSign className="w-3.5 h-3.5 text-amber-700" />
            <span>Max Price:</span>
          </span>
          <span className="font-mono font-bold text-amber-900 min-w-10">
            ${priceMax}
          </span>
          <input
            type="range"
            min="4"
            max="35"
            step="1"
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className="w-24 sm:w-32 accent-amber-600 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-2 py-1 text-xs text-stone-800 focus:outline-none focus:border-amber-600 cursor-pointer font-medium"
          >
            <option value="recommended">Chef Recommended</option>
            <option value="rating">Top Rated (4.8+)</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* 6. Active Filter Indicators & Total Results */}
      <div className="px-5 flex items-center justify-between text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-900">Found:</span>
          <span className="px-2 py-0.5 rounded-full terracotta-gradient-bg text-white font-bold font-mono text-[11px] shadow-xs">
            {filteredDishes.length} {filteredDishes.length === 1 ? 'Dish' : 'Dishes'}
          </span>
          {selectedCuisine !== 'all' && (
            <span className="text-[11px] text-amber-900 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 capitalize">
              {selectedCuisine}
            </span>
          )}
        </div>

        {(searchQuery || selectedCuisine !== 'all' || dietaryFilter !== 'all' || priceMax < 35) && (
          <button
            onClick={handleResetFilters}
            className="text-amber-800 font-bold hover:underline text-[11px] cursor-pointer flex items-center gap-1"
          >
            <span>Reset All</span>
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 7. Dish Results Grid */}
      <div className="px-5">
        {filteredDishes.length === 0 ? (
          <div className="py-14 text-center space-y-3 bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 mx-auto flex items-center justify-center font-bold text-2xl shadow-xs">
              🍽️
            </div>
            <div>
              <p className="text-sm font-bold text-stone-900">No dishes match these search criteria</p>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Try selecting <strong>"All Cuisines"</strong> or clearing your dietary tag or price limit.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 terracotta-gradient-bg text-white rounded-xl text-xs font-bold hover:brightness-105 cursor-pointer shadow-xs active:scale-95"
            >
              Show All 16+ Dishes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            {filteredDishes.map((product) => {
              const isFavorite = favorites.includes(product.id);
              const isAdded = recentlyAddedId === product.id;

              const cuisineName =
                product.cuisine_id === 'cui_khmer'
                  ? 'Khmer'
                  : product.cuisine_id === 'cui_western'
                  ? 'Western'
                  : product.cuisine_id === 'cui_chinese'
                  ? 'Chinese'
                  : 'Drinks';

              const cuisineBadgeColor =
                product.cuisine_id === 'cui_khmer'
                  ? 'bg-amber-100 text-amber-950 border-amber-300'
                  : product.cuisine_id === 'cui_western'
                  ? 'bg-rose-100 text-rose-950 border-rose-300'
                  : product.cuisine_id === 'cui_chinese'
                  ? 'bg-orange-100 text-orange-950 border-orange-300'
                  : 'bg-emerald-100 text-emerald-950 border-emerald-300';

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-200/90 p-2.5 cursor-pointer hover:border-amber-500 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-between group shadow-xs relative"
                >
                  <div>
                    {/* Image with badges */}
                    <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-100 mb-2.5">
                      <img
                        src={resolveImageUrl(product.image_url)}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        onError={handleImageError}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Rating pill */}
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-white/95 backdrop-blur-sm flex items-center gap-1 text-[10px] text-amber-900 font-bold font-mono shadow-xs">
                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                        <span>{product.rating}</span>
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playTapChime();
                          onToggleFavorite(product.id);
                        }}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-stone-600 hover:text-rose-600 shadow-xs cursor-pointer"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-500'
                          }`}
                        />
                      </button>

                      {/* Spice meter */}
                      {product.spice_level !== undefined && product.spice_level > 0 && (
                        <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[9px] text-white flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5 text-rose-400" />
                          <span>{'🌶️'.repeat(product.spice_level)}</span>
                        </div>
                      )}

                      {/* Cuisine Tag Pill */}
                      <div className={`absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold border shadow-xs ${cuisineBadgeColor}`}>
                        {cuisineName}
                      </div>
                    </div>

                    <h3 className="text-xs font-bold text-stone-900 line-clamp-1 group-hover:text-amber-800 transition-colors">
                      {product.name}
                    </h3>
                    {product.local_name && (
                      <p className="text-[10px] text-amber-800 font-medium line-clamp-1">
                        {product.local_name}
                      </p>
                    )}
                    <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-amber-900 font-mono">
                        ${product.price.toFixed(2)}
                      </span>
                      <div className="text-[9px] text-stone-400 font-mono flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{product.preparation_time_minutes}m</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleAddToCartClick(e, product)}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold transition-all shadow-xs cursor-pointer active:scale-95 ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'terracotta-gradient-bg text-white hover:brightness-110'
                      }`}
                      title={isAdded ? 'Added to Order!' : 'Add to dining order'}
                    >
                      {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
