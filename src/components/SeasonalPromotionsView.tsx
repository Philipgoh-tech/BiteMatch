import React, { useState } from 'react';
import { Tag, Calendar, Sparkles, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { Promotion, Restaurant } from '../types';

interface SeasonalPromotionsViewProps {
  promotions: Promotion[];
  restaurants: Restaurant[];
  onClaimPromo: (promoId: string) => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export const SeasonalPromotionsView: React.FC<SeasonalPromotionsViewProps> = ({
  promotions,
  restaurants,
  onClaimPromo,
  onSelectRestaurant,
}) => {
  const [filter, setFilter] = useState<'all' | 'lunch' | 'dinner'>('all');

  const filteredPromos = promotions.filter((p) => {
    if (filter === 'all') return true;
    return p.mealtimeTarget === filter || p.mealtimeTarget === 'all';
  });

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Seasonal Promotions & Exclusive Offerings</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display leading-tight">
            Curated Autumn Dining Perks & Merchant Specials
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Neighborhood restaurants publish their seasonal menus, weekday lunch bundles, and chef tasting perks directly to BiteMatch diners.
          </p>

          <div className="flex items-center gap-2 mt-5">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-white text-stone-950'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              All Seasonal Deals ({promotions.length})
            </button>
            <button
              onClick={() => setFilter('lunch')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'lunch'
                  ? 'bg-white text-stone-950'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Lunch Specials
            </button>
            <button
              onClick={() => setFilter('dinner')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'dinner'
                  ? 'bg-white text-stone-950'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Dinner & Tastings
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPromos.map((promo) => {
          const restaurant = restaurants.find((r) => r.id === promo.restaurantId);

          return (
            <div
              key={promo.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    {promo.badgeText}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-stone-600">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Expires {promo.validUntil}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-stone-900 font-display">
                  {promo.title}
                </h3>
                <div className="text-xs font-bold text-amber-700 mt-0.5">
                  {promo.discountLabel}
                </div>

                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {promo.description}
                </p>

                {restaurant && (
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                    <div>
                      <span className="font-semibold text-stone-900">{restaurant.name}</span>
                      <span className="text-stone-600 ml-1.5">· {restaurant.distanceKm} km away</span>
                    </div>
                    <button
                      onClick={() => onSelectRestaurant(restaurant)}
                      className="text-stone-600 hover:text-stone-900 font-medium underline cursor-pointer"
                    >
                      View Restaurant
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 flex items-center justify-between gap-3">
                <div className="font-mono text-xs bg-stone-50 border border-stone-200 px-2.5 py-1.5 rounded-lg text-stone-700">
                  Code: <strong className="text-stone-900">{promo.promoCode}</strong>
                </div>

                <button
                  onClick={() => onClaimPromo(promo.id)}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Claim Voucher</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
