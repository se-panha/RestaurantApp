import React, { useState } from 'react';
import {
  Search,
  Star,
  Heart,
  Plus,
  SlidersHorizontal,
  Flame,
  ShoppingBag,
  Check,
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { Product, CartItem } from '../../types/restaurant';
import { CUISINES, CATEGORIES, PRODUCTS } from '../../data/restaurantData';
import { playTapChime } from '../../utils/audioChime';
import { resolveImageUrl, handleImageError } from '../../utils/imageUtils';

interface MenuTabProps {
  selectedCuisine: string;
  setSelectedCuisine: (cui: string) => void;
  onSelectProduct: (product: Product) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  cartCount: number;
  cartTotal?: number;
  cart?: CartItem[];
  onQuickAdd?: (product: Product) => void;
  onOpenCart: () => void;
}

export const MenuTab: React.FC<MenuTabProps> = ({
  selectedCuisine,
  setSelectedCuisine,
  onSelectProduct,
  favorites,
  onToggleFavorite,
  cartCount,
  cartTotal = 0,
  cart = [],
  onQuickAdd,
  onOpenCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating'>('popular');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const cuisineOptions = [
    { slug: 'all', name: 'All Cuisines', icon: '🌟', count: PRODUCTS.length },
    { slug: 'khmer', name: 'Khmer', icon: '🍲', count: PRODUCTS.filter((p) => p.cuisine_id === 'cui_khmer').length },
    { slug: 'western', name: 'Western', icon: '🍕', count: PRODUCTS.filter((p) => p.cuisine_id === 'cui_western').length },
    { slug: 'chinese', name: 'Chinese', icon: '🥟', count: PRODUCTS.filter((p) => p.cuisine_id === 'cui_chinese').length },
    { slug: 'drinks', name: 'Drinks & Desserts', icon: '🍹', count: PRODUCTS.filter((p) => p.cuisine_id === 'cui_drinks').length },
  ];

  const relevantCategories = selectedCuisine === 'all'
    ? CATEGORIES
    : CATEGORIES.filter((c) => {
        const cuisine = CUISINES.find((cui) => cui.slug === selectedCuisine);
        return cuisine ? c.cuisine_id === cuisine.id : true;
      });

  const filteredProducts = PRODUCTS.filter((product) => {
    // 1. Cuisine filter
    if (selectedCuisine !== 'all') {
      const cuisineMatch = CUISINES.find((cui) => cui.slug === selectedCuisine);
      if (cuisineMatch && product.cuisine_id !== cuisineMatch.id) {
        return false;
      }
    }

    // 2. Category filter
    if (selectedCategory !== 'all' && product.category_id !== selectedCategory) {
      return false;
    }

    // 3. Dietary filter
    if (dietaryFilter !== 'all') {
      if (dietaryFilter === 'gluten_free' && !product.dietary_tags?.includes('gluten_free')) return false;
      if (dietaryFilter === 'vegetarian' && !product.dietary_tags?.includes('vegetarian')) return false;
      if (dietaryFilter === 'chef_signature' && !product.dietary_tags?.includes('chef_signature')) return false;
      if (dietaryFilter === 'mild' && (product.spice_level || 0) > 1) return false;
    }

    // 4. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        (product.local_name && product.local_name.includes(q))
      );
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0);
  });

  const handleQuickAddClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    playTapChime();
    if (onQuickAdd) {
      onQuickAdd(product);
    } else {
      onSelectProduct(product);
    }
    setRecentlyAddedId(product.id);
    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 1500);
  };

  return (
    <div className="space-y-4 pb-28 bg-[#fffdfa] min-h-full relative">
      {/* 1. Header & Live Cart Pill */}
      <div className="px-5 pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-800 font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Royal Dining Repertoire</span>
            </div>
            <h1 className="font-luxury text-2xl font-bold tracking-tight text-stone-900 mt-0.5">
              Gastronomy &amp; Menu
            </h1>
            <p className="text-xs text-stone-600">
              Handcrafted seasonal dishes across {PRODUCTS.length} curated recipes
            </p>
          </div>
          {cartCount > 0 && (
            <button
              onClick={onOpenCart}
              className="px-3.5 py-1.5 terracotta-gradient-bg text-white font-bold rounded-2xl text-xs flex items-center gap-1.5 shadow-md shadow-orange-900/20 cursor-pointer hover:brightness-105 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Cart ({cartCount})</span>
            </button>
          )}
        </div>

        {/* Search & Sort Row */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-700" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 24+ dishes or ingredients..."
              className="w-full bg-white border border-amber-200/90 rounded-2xl pl-9 pr-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-1 bg-white border border-stone-200/90 rounded-2xl px-2.5 py-1.5 shadow-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-stone-800 focus:outline-none cursor-pointer font-medium"
            >
              <option value="popular">Popular</option>
              <option value="rating">Top Rated</option>
              <option value="price_asc">Price: Low</option>
              <option value="price_desc">Price: High</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Cuisine Selector INCLUDING "ALL" BUTTON */}
      <div className="px-5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {cuisineOptions.map((cui) => {
            const isActive = selectedCuisine === cui.slug;
            return (
              <button
                key={cui.slug}
                onClick={() => {
                  playTapChime();
                  setSelectedCuisine(cui.slug);
                  setSelectedCategory('all');
                }}
                className={`py-2 px-3.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 shadow-xs active:scale-95 ${
                  isActive
                    ? 'terracotta-gradient-bg text-white shadow-md shadow-orange-900/20 ring-2 ring-amber-400 scale-102'
                    : 'bg-white text-stone-700 border border-stone-200/90 hover:border-amber-300 hover:bg-amber-50/50'
                }`}
              >
                <span>{cui.icon}</span>
                <span>{cui.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? 'bg-white/25 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {cui.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Category Filter Chips (Horizontal scroller) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-5 pb-1">
        <button
          onClick={() => {
            playTapChime();
            setSelectedCategory('all');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors shadow-xs ${
            selectedCategory === 'all'
              ? 'bg-amber-100/90 text-amber-950 border border-amber-300 font-bold'
              : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
          }`}
        >
          All Courses ({filteredProducts.length})
        </button>
        {relevantCategories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                playTapChime();
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors shadow-xs ${
                isActive
                  ? 'bg-amber-100/90 text-amber-950 border border-amber-300 font-bold'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* 4. Dietary Quick Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-5 pb-1 text-[11px]">
        {[
          { id: 'all', label: 'All Diets' },
          { id: 'chef_signature', label: '👑 Chef Signature' },
          { id: 'vegetarian', label: '🌿 Vegetarian' },
          { id: 'gluten_free', label: '🌾 Gluten-Free' },
          { id: 'mild', label: '🌱 Mild Heat' },
        ].map((tag) => {
          const isActive = dietaryFilter === tag.id;
          return (
            <button
              key={tag.id}
              onClick={() => {
                playTapChime();
                setDietaryFilter(tag.id);
              }}
              className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-amber-100 text-amber-950 border border-amber-300 font-bold shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'
              }`}
            >
              {tag.label}
            </button>
          );
        })}
      </div>

      {/* 5. Food Grid */}
      <div className="px-5">
        {filteredProducts.length === 0 ? (
          <div className="py-14 text-center text-stone-500 text-xs space-y-2 bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
            <div className="text-3xl">🍽️</div>
            <p className="font-bold text-stone-800">No dishes match the selected category &amp; filter.</p>
            <button
              onClick={() => {
                playTapChime();
                setSelectedCuisine('all');
                setSelectedCategory('all');
                setDietaryFilter('all');
                setSearchQuery('');
              }}
              className="text-amber-800 font-bold hover:underline mt-1 cursor-pointer"
            >
              Reset Filters (View All 24 Dishes)
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            {filteredProducts.map((product) => {
              const isFav = favorites.includes(product.id);
              const isRecentlyAdded = recentlyAddedId === product.id;
              const cartItem = cart.find((i) => i.product.id === product.id);
              const inCartCount = cartItem ? cartItem.quantity : 0;

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
                  className="group bg-white rounded-2xl overflow-hidden border border-stone-200/90 p-2.5 cursor-pointer hover:border-amber-500 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between shadow-xs relative"
                >
                  {/* Card Image */}
                  <div>
                    <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-100 mb-2">
                      <img
                        src={resolveImageUrl(product.image_url)}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        onError={handleImageError}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Rating badge */}
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-white/95 backdrop-blur-sm flex items-center gap-1 text-[10px] text-amber-900 font-bold font-mono shadow-xs">
                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                        <span>{product.rating}</span>
                      </div>

                      {/* Favorite button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playTapChime();
                          onToggleFavorite(product.id);
                        }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-stone-400 hover:text-rose-500 hover:scale-110 transition-transform shadow-xs cursor-pointer"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isFav ? 'fill-rose-500 text-rose-500' : 'text-stone-400'
                          }`}
                        />
                      </button>

                      {/* Spice indicator */}
                      {product.spice_level && product.spice_level > 0 ? (
                        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[9px] text-white flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5 text-rose-400" />
                          <span>{'🌶️'.repeat(product.spice_level)}</span>
                        </div>
                      ) : null}

                      {/* Cuisine Tag Pill */}
                      <div className={`absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md text-[8px] font-bold border shadow-xs ${cuisineBadgeColor}`}>
                        {cuisineName}
                      </div>

                      {/* In-Cart Pill Badge */}
                      {inCartCount > 0 && (
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full terracotta-gradient-bg text-white text-[9px] font-bold shadow-xs">
                          {inCartCount} in order
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div>
                      <h3 className="text-xs font-bold text-stone-900 line-clamp-1 group-hover:text-amber-800 transition-colors">
                        {product.name}
                      </h3>
                      {product.local_name && (
                        <p className="text-[10px] text-amber-800 font-medium line-clamp-1">
                          {product.local_name}
                        </p>
                      )}
                      <p className="text-[10px] text-stone-500 line-clamp-2 mt-0.5 leading-snug">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Price and Add button */}
                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-stone-100">
                    <div>
                      <span className="text-xs font-extrabold text-amber-900 font-mono">
                        ${product.price.toFixed(2)}
                      </span>
                      <div className="text-[9px] text-stone-400 font-mono flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        <span>~{product.preparation_time_minutes}m</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAddClick(e, product)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95 ${
                        isRecentlyAdded
                          ? 'bg-emerald-600 text-white'
                          : inCartCount > 0
                          ? 'bg-amber-100 text-amber-950 border border-amber-300'
                          : 'terracotta-gradient-bg hover:brightness-105 text-white'
                      }`}
                      title="Quick add to basket"
                    >
                      {isRecentlyAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added!</span>
                        </>
                      ) : inCartCount > 0 ? (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add More</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Sticky Floating Cart Action Bar (When items are in cart) */}
      {cartCount > 0 && (
        <div className="sticky bottom-3 px-5 z-30 animate-in slide-in-from-bottom-2 duration-200">
          <button
            onClick={onOpenCart}
            className="w-full py-3.5 px-4 rounded-2xl terracotta-gradient-bg text-white shadow-xl shadow-orange-950/25 flex items-center justify-between font-bold text-xs hover:brightness-110 active:scale-98 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center text-xs font-mono font-bold">
                {cartCount}
              </div>
              <div className="text-left">
                <span className="block text-[11px] uppercase tracking-wider text-amber-100">Dining Basket</span>
                <span className="block text-xs font-bold font-mono">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 font-bold text-xs bg-white text-stone-900 px-3 py-1.5 rounded-xl shadow-xs">
              <span>View Order</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-800" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
