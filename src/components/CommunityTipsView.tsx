import React, { useState } from 'react';
import { Users, MessageSquarePlus, ThumbsUp, Heart, Sparkles, MapPin } from 'lucide-react';
import { UserRecommendation, Restaurant } from '../types';

interface CommunityTipsViewProps {
  recommendations: UserRecommendation[];
  restaurants: Restaurant[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onAddRecommendation: (restaurantId: string, dish: string, quote: string, tags: string[]) => void;
}

export const CommunityTipsView: React.FC<CommunityTipsViewProps> = ({
  recommendations,
  restaurants,
  onSelectRestaurant,
  onAddRecommendation,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [restaurantId, setRestaurantId] = useState(restaurants[0]?.id || '');
  const [dishName, setDishName] = useState('');
  const [tipText, setTipText] = useState('');
  const [tipTag, setTipTag] = useState('Must Try');

  const filteredRecs = selectedTag === 'all'
    ? recommendations
    : recommendations.filter((r) => r.tags.includes(selectedTag));

  const allTags = ['all', 'Must Try', 'Romantic', 'Comforting', 'Best Crust', 'Fine Dining', 'Rainy Day Hero', 'Best Brunch'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName || !tipText) return;
    onAddRecommendation(restaurantId, dishName, tipText, [tipTag]);
    setDishName('');
    setTipText('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-amber-600" />
            <span>Recommend to Other Users</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-900 font-display">
            Local Foodie Insider Tips
          </h2>
          <p className="text-xs text-stone-600 mt-1 max-w-xl">
            Real dishes endorsed by neighbors. When you share a recommendation or give a thumbs-up after your meal, you teach the algorithm and earn reward points.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shrink-0 cursor-pointer"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>{showForm ? 'Close Form' : 'Write a Tip (+50 pts)'}</span>
        </button>
      </div>

      {/* Tip Submission Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 space-y-4"
        >
          <div className="font-bold text-xs text-amber-950 uppercase tracking-wider">
            Share What Dish Other Diners Must Order
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Select Restaurant
              </label>
              <select
                value={restaurantId}
                onChange={(e) => setRestaurantId(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-stone-200 focus:outline-none"
              >
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.neighborhood})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Specific Dish Name
              </label>
              <input
                type="text"
                placeholder="e.g. Crispy Quesabirria Trio"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-stone-200 focus:outline-none"
              >
              </input>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Your Review / Dining Recommendation
            </label>
            <textarea
              placeholder="Tell others what made this dish unforgettable..."
              rows={2}
              value={tipText}
              onChange={(e) => setTipText(e.target.value)}
              required
              className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-stone-200 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-600">Vibe Tag:</span>
              <select
                value={tipTag}
                onChange={(e) => setTipTag(e.target.value)}
                className="text-xs bg-white border border-stone-200 rounded-md px-2 py-1 text-stone-700"
              >
                <option value="Must Try">Must Try</option>
                <option value="Romantic">Romantic</option>
                <option value="Comforting">Comforting</option>
                <option value="Rainy Day Hero">Rainy Day Hero</option>
                <option value="Hidden Gem">Hidden Gem</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              Publish Tip & Claim 50 pts
            </button>
          </div>
        </form>
      )}

      {/* Filter Tags */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-semibold text-stone-600 mr-1">Filter tips:</span>
        {allTags.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTag(t)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedTag === t
                ? 'bg-stone-900 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
            }`}
          >
            {t === 'all' ? 'All Tips' : `#${t}`}
          </button>
        ))}
      </div>

      {/* Tips Stream Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecs.map((rec) => {
          const restaurant = restaurants.find((r) => r.id === rec.restaurantId);

          return (
            <div
              key={rec.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-stone-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-mono font-bold text-xs">
                      {rec.userAvatar}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">{rec.userName}</div>
                      <div className="text-[11px] text-stone-600">{rec.date}</div>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                    Recommends: {rec.dishRecommended}
                  </div>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed italic mb-4">
                  "{rec.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                {restaurant ? (
                  <button
                    onClick={() => onSelectRestaurant(restaurant)}
                    className="font-semibold text-stone-900 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{restaurant.name}</span>
                    <span className="text-stone-600 font-normal">({restaurant.distanceKm} km)</span>
                  </button>
                ) : (
                  <span className="text-stone-600">{rec.restaurantName}</span>
                )}

                <div className="flex items-center gap-2">
                  {rec.tags.map((tag) => (
                    <span key={tag} className="text-[11px] text-stone-600">#{tag}</span>
                  ))}
                  <button
                    onClick={() => alert('Thanks for validating this tip!')}
                    className="flex items-center gap-1 text-[11px] font-semibold text-stone-600 hover:text-stone-900 ml-2 cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{rec.helpfulCount}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
