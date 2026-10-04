import React, { useState } from 'react';
import { X, Star, Plus, Minus, Check, Clock, Heart, Flame } from 'lucide-react';
import { Product, ProductOptionSize, ProductAddOn, CartItem } from '../../types/restaurant';
import { resolveImageUrl, handleImageError } from '../../utils/imageUtils';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<ProductOptionSize>(
    product.sizes[1] || product.sizes[0]
  );
  const [selectedAddOns, setSelectedAddOns] = useState<ProductAddOn[]>([]);
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<number>(product.spice_level ?? 1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  const toggleAddOn = (addon: ProductAddOn) => {
    if (selectedAddOns.some((a) => a.id === addon.id)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addon]);
    }
  };

  const unitPrice =
    product.price +
    selectedSize.priceDelta +
    selectedAddOns.reduce((sum, a) => sum + a.price, 0);

  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    const item: CartItem = {
      id: `${product.id}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      product,
      selectedSize,
      selectedAddOns,
      selectedSpiceLevel,
      specialInstructions: specialInstructions.trim() ? specialInstructions.trim() : undefined,
      quantity,
      itemTotal: totalPrice,
    };
    onAddToCart(item);
    onClose();
  };

  const spiceLabels = ['Mild (Gentle)', 'Medium (Balanced)', 'Authentic Khmer (Hot)'];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/45 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white border-t border-stone-200 rounded-t-[32px] overflow-hidden max-h-[92vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Grab Handle */}
        <div className="pt-2.5 pb-1 flex justify-center bg-white">
          <div className="w-12 h-1 bg-stone-300 rounded-full"></div>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto no-scrollbar flex-1 pb-28">
          {/* Product Image Header with Close & Favorite */}
          <div className="relative aspect-16/10 bg-stone-100">
            <img
              src={resolveImageUrl(product.image_url)}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={handleImageError}
              className="w-full h-full object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-stone-700 flex items-center justify-center hover:bg-white cursor-pointer shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>

            <button
              onClick={() => onToggleFavorite(product.id)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-stone-700 flex items-center justify-center hover:bg-white cursor-pointer shadow-sm"
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-400'
                }`}
              />
            </button>

            {product.local_name && (
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-sm text-[11px] text-amber-900 font-bold shadow-xs">
                {product.local_name}
              </div>
            )}
          </div>

          <div className="p-5 space-y-5">
            {/* Title, Rating, Price */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-luxury text-2xl font-bold text-stone-900 tracking-tight leading-tight">
                  {product.name}
                </h2>
                <span className="text-lg font-extrabold text-amber-800 font-mono shrink-0">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                <div className="flex items-center gap-1 text-amber-700 font-semibold font-mono">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{product.rating}</span>
                  <span className="text-stone-400 font-normal">({product.review_count} ratings)</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1 text-stone-600">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{product.preparation_time_minutes}m kitchen prep</span>
                </div>
              </div>

              {/* Dietary Tags */}
              {product.dietary_tags && product.dietary_tags.length > 0 && (
                <div className="flex items-center gap-2 mt-2 text-[10px] text-stone-500">
                  {product.dietary_tags.map((tag) => (
                    <span key={tag} className="text-amber-800 uppercase font-semibold">
                      · {tag.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Section 10 Spec: Size Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Select Course Portion
              </label>
              <div className="grid grid-cols-3 gap-2">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize.id === size.id;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50 text-stone-900 shadow-xs'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      <div className="text-xs font-bold">{size.name}</div>
                      <div className="text-[11px] font-mono text-amber-800 font-semibold mt-0.5">
                        {size.priceDelta === 0 ? 'Base' : `+$${size.priceDelta.toFixed(2)}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Spice Level Customization */}
            {product.spice_level !== undefined && product.spice_level > 0 && (
              <div className="space-y-2 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-600" />
                    <span>Spice Intensity</span>
                  </span>
                  <span className="text-[11px] text-amber-800 font-semibold font-mono">
                    {spiceLabels[selectedSpiceLevel - 1] || 'Custom'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[1, 2, 3].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSelectedSpiceLevel(level)}
                      className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        selectedSpiceLevel === level
                          ? 'bg-rose-100 text-rose-900 border border-rose-400 shadow-xs font-bold'
                          : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <span>{'🌶️'.repeat(level)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Section 10 Spec: Add-ons */}
            {product.add_ons && product.add_ons.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Chef's Accoutrements &amp; Extras
                </label>
                <div className="space-y-2">
                  {product.add_ons.map((addon) => {
                    const isChecked = selectedAddOns.some((a) => a.id === addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddOn(addon)}
                        className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                          isChecked
                            ? 'border-amber-600 bg-amber-50 text-stone-900'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-colors ${
                              isChecked
                                ? 'terracotta-gradient-bg border-amber-600 text-white font-bold'
                                : 'border-stone-300 bg-white'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-xs font-medium">{addon.name}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-amber-800">
                          +${addon.price.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section 10 Spec: Special Instructions */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Special Dietary or Preparation Requests
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Extra kaffir lime leaf, dressing served on the side, nut allergy alert..."
                rows={2}
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 shadow-inner"
              />
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-xs font-bold text-stone-900">Portion Count</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-xl bg-white border border-stone-200 text-stone-700 flex items-center justify-center hover:bg-stone-100 transition-colors disabled:opacity-40 cursor-pointer shadow-xs"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-extrabold text-stone-900 font-mono w-6 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-xl bg-white border border-stone-200 text-stone-700 flex items-center justify-center hover:bg-stone-100 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-stone-200 flex items-center justify-between gap-4 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
          <div>
            <div className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Total Price</div>
            <div className="text-lg font-extrabold text-amber-800 font-mono">
              ${totalPrice.toFixed(2)}
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 py-3 px-4 terracotta-gradient-bg hover:brightness-105 text-white font-bold rounded-2xl text-xs transition-all shadow-md shadow-amber-900/15 active:scale-[0.98] cursor-pointer text-center"
          >
            Add to Order — ${totalPrice.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
};
