import React from 'react';
import { Star, ThumbsUp, ThumbsDown, Clock, Tag, ArrowUpRight } from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onSelect: (restaurant: Restaurant) => void;
  onClaimPromo: (promoId: string) => void;
  onFeedback: (restaurantId: string, reaction: 'up' | 'down') => void;
  userReaction?: 'up' | 'down';
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onSelect,
  onClaimPromo,
  onFeedback,
  userReaction,
}) => {
  const activePromo = restaurant.activePromotions[0];

  return (
    <article
      onClick={() => onSelect(restaurant)}
      className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md hover:border-stone-300 transition-all flex flex-col cursor-pointer"
    >
      {/* Visual Image Header */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          onError={(e) => {
            // Fallback gradient container
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />

        {/* Fallback pattern if image is hidden */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-stone-300 via-amber-100 to-stone-200 flex items-center justify-center text-stone-500 text-xs font-semibold">
          {restaurant.cuisine}
        </div>

        {/* Top Badges (Functional offer tag if active) */}
        {activePromo && (
          <div className="absolute top-3 left-3 bg-amber-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            <span>{activePromo.discountLabel}</span>
          </div>
        )}

        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-stone-800 text-xs font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>{restaurant.rating}</span>
          <span className="text-stone-600 font-normal">({restaurant.reviewCount})</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata (Zero-pill discipline) */}
          <div className="flex items-center gap-2 text-xs text-stone-600 mb-1.5">
            <span>{restaurant.cuisine}</span>
            <span aria-hidden="true">·</span>
            <span>{restaurant.priceTier}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-stone-800">{restaurant.distanceKm} km away</span>
            <span aria-hidden="true">·</span>
            <span>{restaurant.travelTimeMin} min walk</span>
          </div>

          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-lg font-bold text-stone-900 font-display group-hover:text-amber-800 transition-colors">
              {restaurant.name}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-stone-600 group-hover:text-stone-700 transition-colors shrink-0 mt-1" />
          </div>

          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
            {restaurant.tagline}
          </p>

          {/* Signature Dish Highlight */}
          {restaurant.signatureDishes[0] && (
            <div className="bg-stone-50 rounded-lg p-2.5 mb-3 border border-stone-100">
              <div className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-0.5">
                Top Recommendation:
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-900 truncate pr-2">
                  {restaurant.signatureDishes[0].name}
                </span>
                <span className="font-mono text-stone-700 font-medium">
                  ${restaurant.signatureDishes[0].price}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar with Thumbs Feedback + Claim Offer CTA */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
          {/* Diner Thumbs Feedback ("Continuously through feedback...") */}
          <div
            className="flex items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onFeedback(restaurant.id, 'up')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1 text-xs ${
                userReaction === 'up'
                  ? 'bg-emerald-100 text-emerald-800 font-bold'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-800'
              }`}
              title="Thumbs Up (Improves your algorithm + gives 15 pts)"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span className="text-[11px] font-mono">{restaurant.thumbsUpCount}</span>
            </button>
            <button
              onClick={() => onFeedback(restaurant.id, 'down')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1 text-xs ${
                userReaction === 'down'
                  ? 'bg-rose-100 text-rose-800 font-bold'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-800'
              }`}
              title="Thumbs Down"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Claim Offer CTA or Explore */}
          {activePromo ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClaimPromo(activePromo.id);
              }}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Claim {activePromo.promoCode}
            </button>
          ) : (
            <span className="text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors">
              View Menu & Hours
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
