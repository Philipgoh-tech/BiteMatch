import React from 'react';
import { Bell, X, ArrowRight, Utensils, Sparkles } from 'lucide-react';
import { MealtimeNudge, Restaurant } from '../types';

interface MealtimeNudgeToastProps {
  nudge: MealtimeNudge | null;
  restaurant?: Restaurant;
  onClose: () => void;
  onExplore: (restaurant: Restaurant) => void;
}

export const MealtimeNudgeToast: React.FC<MealtimeNudgeToastProps> = ({
  nudge,
  restaurant,
  onClose,
  onExplore,
}) => {
  if (!nudge || !restaurant) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-amber-300 p-4 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
          <Bell className="w-3.5 h-3.5 text-amber-700" />
          <span>Smart {nudge.mealtime} Nudge</span>
        </div>
        <button
          onClick={onClose}
          className="text-stone-600 hover:text-stone-700 p-1 rounded-md transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <h4 className="text-sm font-bold text-stone-900 font-display">
        {nudge.headline}
      </h4>
      <p className="text-xs text-stone-600 mt-1 leading-snug">
        {nudge.rationale}
      </p>

      <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-lg object-cover"
          />
          <div>
            <div className="text-xs font-bold text-stone-900 leading-tight truncate max-w-[140px]">
              {restaurant.name}
            </div>
            <div className="text-[10px] text-stone-600">
              {restaurant.distanceKm} km · {restaurant.priceTier}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            onExplore(restaurant);
            onClose();
          }}
          className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>View Table</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
