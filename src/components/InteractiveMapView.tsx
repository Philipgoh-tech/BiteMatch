import React, { useState } from 'react';
import { MapPin, Navigation, Tag, Star, ArrowRight, ExternalLink } from 'lucide-react';
import { Restaurant } from '../types';
import { NEIGHBORHOOD_COORDS } from './LocationSelectorBar';

interface InteractiveMapViewProps {
  restaurants: Restaurant[];
  currentNeighborhood: string;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onClaimPromo: (promoId: string) => void;
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  restaurants,
  currentNeighborhood,
  onSelectRestaurant,
  onClaimPromo,
}) => {
  const [selectedPinId, setSelectedPinId] = useState<string | null>(restaurants[0]?.id || null);
  const [filterPromoOnly, setFilterPromoOnly] = useState(false);

  const activeRestaurant = restaurants.find((r) => r.id === selectedPinId) || restaurants[0];

  const userCenter = NEIGHBORHOOD_COORDS[currentNeighborhood] || NEIGHBORHOOD_COORDS['Central'];

  const displayedRestaurants = filterPromoOnly
    ? restaurants.filter((r) => r.activePromotions.length > 0)
    : restaurants;


  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-xs mb-8">
      {/* Map Header Overlay Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-xs border border-stone-200 pointer-events-auto flex items-center gap-2 text-xs">
          <Navigation className="w-4 h-4 text-amber-600 fill-amber-600" />
          <span className="font-semibold text-stone-900">{currentNeighborhood}</span>
          <span className="text-stone-600">·</span>
          <span className="text-stone-600 font-medium">GPS Live Radial</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-xs border border-stone-200 pointer-events-auto flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilterPromoOnly(!filterPromoOnly)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterPromoOnly
                ? 'bg-amber-600 text-white'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Seasonal Promos Only</span>
          </button>
        </div>
      </div>

      {/* Visual SVG Map Canvas */}
      <div className="relative w-full h-[480px] sm:h-[540px] bg-[#E8E6DF] overflow-hidden select-none">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <pattern id="city-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#DCD8D0" strokeWidth="0.4" />
            </pattern>
            <radialGradient id="user-radar" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D97706" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid Background */}
          <rect width="100" height="100" fill="url(#city-grid)" />

          {/* Waterfront / River Basin on Left side */}
          <path
            d="M 0,0 C 15,20 10,50 18,80 C 22,95 20,100 20,100 L 0,100 Z"
            fill="#CFE2E8"
            stroke="#BDD6DE"
            strokeWidth="0.5"
          />

          {/* Major Avenues / Street Arterials */}
          <line x1="20" y1="30" x2="100" y2="30" stroke="#FFFFFF" strokeWidth="1.6" />
          <line x1="18" y1="65" x2="100" y2="65" stroke="#FFFFFF" strokeWidth="1.6" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="#FFFFFF" strokeWidth="1.6" />
          <line x1="75" y1="0" x2="75" y2="100" stroke="#FFFFFF" strokeWidth="1.4" />

          {/* Park / Green District */}
          <rect x="58" y="10" width="14" height="15" rx="1.5" fill="#D3DEC8" />
          <rect x="30" y="70" width="15" height="18" rx="1.5" fill="#D3DEC8" />

          {/* Region Orientation Labels */}
          <text x="50" y="8" textAnchor="middle" fill="#A8A29E" fontSize="3.5" fontWeight="700" letterSpacing="0.8">NORTH</text>
          <text x="82" y="14" textAnchor="middle" fill="#A8A29E" fontSize="3.2" fontWeight="700" letterSpacing="0.8">NORTHEAST</text>
          <text x="10" y="50" textAnchor="middle" fill="#78716C" fontSize="3.5" fontWeight="700" letterSpacing="0.8">WEST</text>
          <text x="50" y="56" textAnchor="middle" fill="#A8A29E" fontSize="3.5" fontWeight="700" letterSpacing="0.8">CENTRAL</text>
          <text x="88" y="50" textAnchor="middle" fill="#A8A29E" fontSize="3.5" fontWeight="700" letterSpacing="0.8">EAST</text>

          {/* User Location Center Radar */}
          <circle cx={userCenter.mapX} cy={userCenter.mapY} r="14" fill="url(#user-radar)" className="animate-pulse transition-all duration-500 ease-out" />
          <circle cx={userCenter.mapX} cy={userCenter.mapY} r="2.2" fill="#D97706" stroke="#FFFFFF" strokeWidth="0.8" className="transition-all duration-500 ease-out" />
          <circle cx={userCenter.mapX} cy={userCenter.mapY} r="0.8" fill="#FFFFFF" className="transition-all duration-500 ease-out" />
        </svg>

        {/* User Location Label Tag */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-8 pointer-events-none transition-all duration-500 ease-out"
          style={{ left: `${userCenter.mapX}%`, top: `${userCenter.mapY}%` }}
        >
          <div className="bg-stone-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap flex items-center gap-1">
            <span>You Are Here</span>
            <span className="text-amber-400">({currentNeighborhood})</span>
          </div>
        </div>


        {/* Interactive Restaurant Pins */}
        {displayedRestaurants.map((restaurant) => {
          const isSelected = selectedPinId === restaurant.id;
          const hasPromo = restaurant.activePromotions.length > 0;

          return (
            <div
              key={restaurant.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 z-10"
              style={{
                left: `${restaurant.coordinates.mapX}%`,
                top: `${restaurant.coordinates.mapY}%`,
              }}
            >
              <button
                onClick={() => setSelectedPinId(restaurant.id)}
                className={`relative flex items-center justify-center transition-all cursor-pointer group ${
                  isSelected
                    ? 'scale-125 z-30'
                    : 'hover:scale-110'
                }`}
                title={restaurant.name}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg border-2 transition-colors ${
                    isSelected
                      ? 'bg-amber-600 border-white text-white ring-4 ring-amber-600/30'
                      : hasPromo
                      ? 'bg-amber-500 border-white text-stone-950 hover:bg-amber-600 hover:text-white'
                      : 'bg-stone-900 border-white text-white hover:bg-amber-600'
                  }`}
                >
                  <MapPin className="w-4 h-4 fill-current" />
                </div>

                {/* Promo Indicator Bubble */}
                {hasPromo && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border border-white">
                    %
                  </span>
                )}

                {/* Pin hover tooltip */}
                <div className="absolute bottom-full mb-1.5 hidden group-hover:block bg-stone-900 text-white text-[11px] font-medium px-2.5 py-1 rounded-md shadow-md whitespace-nowrap pointer-events-none">
                  {restaurant.name} · {restaurant.distanceKm} km
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Selected Restaurant Floating Info Drawer on Bottom */}
      {activeRestaurant && (
        <div className="absolute bottom-4 left-4 right-4 z-20 max-w-xl mx-auto bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-stone-200 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-28 h-24 rounded-lg overflow-hidden shrink-0 relative bg-stone-200">
            <img
              src={activeRestaurant.image}
              alt={activeRestaurant.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {activeRestaurant.activePromotions.length > 0 && (
              <span className="absolute top-1.5 left-1.5 bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                Offer
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-bold text-stone-900 text-base font-display truncate">
                {activeRestaurant.name}
              </h4>
              <div className="flex items-center gap-1 text-xs font-semibold text-stone-800">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{activeRestaurant.rating}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-600 mt-0.5">
              <span>{activeRestaurant.cuisine}</span>
              <span>·</span>
              <span>{activeRestaurant.priceTier}</span>
              <span>·</span>
              <span className="font-semibold text-stone-800">{activeRestaurant.distanceKm} km away</span>
              <span>·</span>
              <span>{activeRestaurant.travelTimeMin} min walk</span>
            </div>

            {activeRestaurant.activePromotions.length > 0 ? (
              <div className="mt-2 text-xs font-semibold text-amber-800 bg-amber-50 rounded px-2 py-1 flex items-center justify-between">
                <span>{activeRestaurant.activePromotions[0].discountLabel}</span>
                <button
                  onClick={() => onClaimPromo(activeRestaurant.activePromotions[0].id)}
                  className="underline hover:text-amber-950 font-bold ml-2 cursor-pointer"
                >
                  Claim Code
                </button>
              </div>
            ) : (
              <p className="mt-1.5 text-xs text-stone-600 line-clamp-1 italic">
                {activeRestaurant.tagline}
              </p>
            )}
          </div>

          <button
            onClick={() => onSelectRestaurant(activeRestaurant)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shrink-0 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Explore Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
