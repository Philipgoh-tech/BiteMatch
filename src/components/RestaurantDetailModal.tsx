import React, { useState } from 'react';
import { X, Star, Clock, MapPin, Tag, ThumbsUp, ThumbsDown, Award, Check, MessageSquarePlus, Share2 } from 'lucide-react';
import { Restaurant, Dish, UserRecommendation } from '../types';

interface RestaurantDetailModalProps {
  restaurant: Restaurant | null;
  onClose: () => void;
  onClaimPromo: (promoId: string) => void;
  onAddRecommendation: (restaurantId: string, dish: string, quote: string, tags: string[]) => void;
  onFeedback: (restaurantId: string, reaction: 'up' | 'down') => void;
  userReaction?: 'up' | 'down';
}

export const RestaurantDetailModal: React.FC<RestaurantDetailModalProps> = ({
  restaurant,
  onClose,
  onClaimPromo,
  onAddRecommendation,
  onFeedback,
  userReaction,
}) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'promotions' | 'recommendations' | 'loyalty'>('menu');
  const [newDishName, setNewDishName] = useState('');
  const [newTipText, setNewTipText] = useState('');
  const [selectedTag, setSelectedTag] = useState('Must Try');
  const [showRecForm, setShowRecForm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  if (!restaurant) return null;

  const handleRecSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName || !newTipText) return;
    onAddRecommendation(restaurant.id, newDishName, newTipText, [selectedTag]);
    setNewDishName('');
    setNewTipText('');
    setShowRecForm(false);
  };

  const handleReserve = () => {
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col">
        {/* Header Media Banner */}
        <div className="relative h-60 w-full shrink-0 bg-stone-900">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-stone-900/60 hover:bg-stone-900 text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Restaurant Header Information */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-stone-200 mb-1">
                  <span>{restaurant.cuisine}</span>
                  <span>·</span>
                  <span>{restaurant.priceTier}</span>
                  <span>·</span>
                  <span>{restaurant.neighborhood}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-display">{restaurant.name}</h2>
              </div>

              {/* Rating & Distance */}
              <div className="flex items-center gap-3">
                <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{restaurant.rating}</span>
                  <span className="text-stone-300 font-normal">({restaurant.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Context Bar */}
        <div className="bg-stone-50 border-b border-stone-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>{restaurant.address}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-600" />
              <span>{restaurant.hours}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-stone-600">Rate this spot:</span>
            <button
              onClick={() => onFeedback(restaurant.id, 'up')}
              className={`p-1 rounded cursor-pointer ${
                userReaction === 'up' ? 'text-emerald-600 font-bold' : 'text-stone-600 hover:text-stone-800'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onFeedback(restaurant.id, 'down')}
              className={`p-1 rounded cursor-pointer ${
                userReaction === 'down' ? 'text-rose-600 font-bold' : 'text-stone-600 hover:text-stone-800'
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs inside modal */}
        <div className="flex items-center border-b border-stone-200 px-6 bg-white gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('menu')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'menu'
                ? 'border-amber-600 text-stone-900 font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-800'
            }`}
          >
            Menu & Offerings
          </button>
          <button
            onClick={() => setActiveTab('promotions')}
            className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'promotions'
                ? 'border-amber-600 text-stone-900 font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-800'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-amber-600" />
            <span>Seasonal Offers ({restaurant.activePromotions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'recommendations'
                ? 'border-amber-600 text-stone-900 font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-800'
            }`}
          >
            <span>Diner Tips ({restaurant.userRecommendations.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('loyalty')}
            className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'loyalty'
                ? 'border-amber-600 text-stone-900 font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-800'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Loyalty Reward</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FCFCFB]">
          {/* TAB 1: MENU & OFFERINGS */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
                  Signature & Seasonal Highlights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {restaurant.signatureDishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs hover:border-amber-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="font-bold text-stone-900 text-sm">{dish.name}</div>
                        <div className="font-mono font-bold text-stone-800 text-sm">${dish.price}</div>
                      </div>
                      <p className="text-xs text-stone-600 mb-2 leading-relaxed">{dish.description}</p>
                      <div className="flex items-center gap-2 text-[11px] text-stone-600">
                        {dish.isSeasonal && (
                          <span className="font-medium text-amber-700">Seasonal Special</span>
                        )}
                        {dish.dietary.map((d) => (
                          <span key={d}>· {d}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dietary and Features */}
              <div className="p-4 bg-white rounded-xl border border-stone-200">
                <div className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Dining Features & Dietary Accommodations
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-stone-700">
                  {restaurant.features.map((f) => (
                    <span key={f} className="px-2.5 py-1 bg-stone-100 rounded-md font-medium">
                      {f}
                    </span>
                  ))}
                  {restaurant.dietaryTags.map((d) => (
                    <span key={d} className="px-2.5 py-1 bg-amber-50 text-amber-900 rounded-md font-medium">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROMOTIONS */}
          {activeTab === 'promotions' && (
            <div className="space-y-4">
              <div className="text-xs text-stone-600 mb-1">
                Seasonal offers and limited-time perks hosted directly by {restaurant.name}:
              </div>
              {restaurant.activePromotions.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-600 text-xs">
                  No active promotions right now. Check back soon for seasonal specials!
                </div>
              ) : (
                restaurant.activePromotions.map((promo) => (
                  <div
                    key={promo.id}
                    className="p-5 bg-white rounded-xl border border-amber-200 shadow-xs relative overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded">
                          {promo.badgeText}
                        </span>
                        <h4 className="text-base font-bold text-stone-900 mt-1 font-display">
                          {promo.title}
                        </h4>
                        <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                          {promo.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-stone-600 mt-2 font-mono">
                          <span>Code: <strong className="text-stone-900">{promo.promoCode}</strong></span>
                          <span>·</span>
                          <span>Valid through {promo.validUntil}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onClaimPromo(promo.id)}
                        className="px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-semibold text-xs transition-colors shrink-0 cursor-pointer"
                      >
                        Claim Voucher
                      </button>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-stone-100 text-[11px] text-stone-600">
                      Terms: {promo.terms}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: RECOMMENDATIONS TO OTHER USERS */}
          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-stone-600">
                  Real tips from local foodies on what not to miss.
                </p>
                <button
                  onClick={() => setShowRecForm(!showRecForm)}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  <span>Recommend a Dish (+50 pts)</span>
                </button>
              </div>

              {/* Recommendation Form */}
              {showRecForm && (
                <form
                  onSubmit={handleRecSubmit}
                  className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3"
                >
                  <div className="font-bold text-xs text-amber-950 uppercase tracking-wider">
                    Share Your Food Recommendation
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Dish Name you recommend
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Handmade Tagliolini al Tartufo"
                      value={newDishName}
                      onChange={(e) => setNewDishName(e.target.value)}
                      required
                      className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Your tip for other diners
                    </label>
                    <textarea
                      placeholder="What made this dish special? Flavor notes, best time to visit, wine pairing..."
                      rows={2}
                      value={newTipText}
                      onChange={(e) => setNewTipText(e.target.value)}
                      required
                      className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <select
                      value={selectedTag}
                      onChange={(e) => setSelectedTag(e.target.value)}
                      className="text-xs bg-white border border-stone-200 rounded-md px-2 py-1.5 text-stone-700"
                    >
                      <option value="Must Try">Tag: Must Try</option>
                      <option value="Hidden Gem">Tag: Hidden Gem</option>
                      <option value="Best Value">Tag: Best Value</option>
                      <option value="Romantic Pick">Tag: Romantic Pick</option>
                    </select>

                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-amber-700 text-white rounded-lg text-xs font-semibold hover:bg-amber-800 transition-colors cursor-pointer"
                    >
                      Post Tip & Earn 50 pts
                    </button>
                  </div>
                </form>
              )}

              {/* Recommendations List */}
              <div className="space-y-3">
                {restaurant.userRecommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-stone-800 text-white flex items-center justify-center text-xs font-bold font-mono">
                          {rec.userAvatar}
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-stone-900">{rec.userName}</span>
                          <span className="text-stone-600 text-[11px] ml-2">· {rec.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                        <span>Recommends: {rec.dishRecommended}</span>
                      </div>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed italic">
                      "{rec.quote}"
                    </p>
                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-stone-600">
                      <div className="flex items-center gap-2">
                        {rec.tags.map((t) => (
                          <span key={t} className="text-stone-600">#{t}</span>
                        ))}
                      </div>
                      <button
                        onClick={() => alert('Marked as helpful!')}
                        className="text-stone-600 hover:text-stone-900 cursor-pointer"
                      >
                        Helpful ({rec.helpfulCount})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LOYALTY PROGRAM */}
          {activeTab === 'loyalty' && (
            <div className="p-5 bg-white rounded-xl border border-stone-200">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold mb-2">
                <Award className="w-4 h-4" />
                <span>Restaurant Loyalty Program</span>
              </div>
              <h4 className="text-base font-bold text-stone-900 font-display">
                {restaurant.loyaltyReward.title}
              </h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {restaurant.loyaltyReward.description}
              </p>

              <div className="mt-4 p-3 bg-stone-50 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-600">Points needed: </span>
                  <span className="font-mono font-bold text-stone-900">
                    {restaurant.loyaltyReward.pointsNeeded} pts
                  </span>
                </div>
                <span className="text-stone-600 text-[11px]">
                  Earn 15 pts per review & check-in
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Action Bar: Reservation / Ordering */}
        <div className="p-4 bg-white border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-stone-600">
            Open today: <span className="font-semibold text-emerald-700">Open Now ({restaurant.hours})</span>
          </div>

          <div className="flex items-center gap-3">
            {bookingSuccess && (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-600" />
                Table Reserved! We notified the restaurant.
              </span>
            )}
            <button
              onClick={handleReserve}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Reserve Table for Dinner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
