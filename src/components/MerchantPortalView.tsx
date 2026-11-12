import React, { useState } from 'react';
import { Store, Plus, Tag, TrendingUp, Users, ThumbsUp, DollarSign, Calendar, Eye, ShieldCheck, Utensils, Check, ArrowRight } from 'lucide-react';
import { Restaurant, Promotion, Dish } from '../types';

interface MerchantPortalViewProps {
  restaurants: Restaurant[];
  activeRestaurantId: string;
  onSelectRestaurant: (id: string) => void;
  onAddPromotion: (restaurantId: string, newPromo: Omit<Promotion, 'id' | 'restaurantId' | 'restaurantName' | 'claimsCount'>) => void;
  onAddDish: (restaurantId: string, newDish: Omit<Dish, 'id'>) => void;
}

export const MerchantPortalView: React.FC<MerchantPortalViewProps> = ({
  restaurants,
  activeRestaurantId,
  onSelectRestaurant,
  onAddPromotion,
  onAddDish,
}) => {
  const currentRestaurant = restaurants.find((r) => r.id === activeRestaurantId) || restaurants[0];

  const [activeTab, setActiveTab] = useState<'promotions' | 'dishes' | 'analytics' | 'settings'>('promotions');
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [showDishModal, setShowDishModal] = useState(false);

  // New Promo Form State
  const [promoTitle, setPromoTitle] = useState('');
  const [promoDiscountLabel, setPromoDiscountLabel] = useState('');
  const [promoBadge, setPromoBadge] = useState('Seasonal Exclusive');
  const [promoCode, setPromoCode] = useState('');
  const [promoMealtime, setPromoMealtime] = useState<'all' | 'lunch' | 'dinner' | 'weekend'>('dinner');
  const [promoDesc, setPromoDesc] = useState('');
  const [promoValidUntil, setPromoValidUntil] = useState('Dec 31, 2026');
  const [promoTerms, setPromoTerms] = useState('Valid for dine-in only. Cannot be combined with other offers.');
  const [promoMinSpend, setPromoMinSpend] = useState<number>(40);

  // New Dish Form State
  const [dishName, setDishName] = useState('');
  const [dishDesc, setDishDesc] = useState('');
  const [dishPrice, setDishPrice] = useState<number>(24);
  const [dishCategory, setDishCategory] = useState<'Starter' | 'Main' | 'Dessert' | 'Beverage'>('Main');
  const [dishIsSeasonal, setDishIsSeasonal] = useState(true);
  const [dishDietary, setDishDietary] = useState('Vegetarian Friendly');

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoTitle || !promoDiscountLabel || !promoCode) return;

    onAddPromotion(currentRestaurant.id, {
      title: promoTitle,
      badgeText: promoBadge,
      discountLabel: promoDiscountLabel,
      description: promoDesc || `${promoDiscountLabel} for our valued BiteMatch guests.`,
      validUntil: promoValidUntil,
      mealtimeTarget: promoMealtime,
      promoCode: promoCode.toUpperCase().trim(),
      terms: promoTerms,
      minSpend: promoMinSpend,
    });

    setPromoTitle('');
    setPromoDiscountLabel('');
    setPromoCode('');
    setShowPromoModal(false);
  };

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName || !dishPrice) return;

    onAddDish(currentRestaurant.id, {
      name: dishName,
      description: dishDesc,
      price: Number(dishPrice),
      category: dishCategory,
      isSeasonal: dishIsSeasonal,
      dietary: dishDietary ? [dishDietary] : [],
      isSignature: true,
    });

    setDishName('');
    setDishDesc('');
    setShowDishModal(false);
  };

  const totalClaims = currentRestaurant.activePromotions.reduce((acc, p) => acc + p.claimsCount, 0);
  const estimatedRevenue = totalClaims * 52;
  const positiveSentiment = Math.round(
    (currentRestaurant.thumbsUpCount / (currentRestaurant.thumbsUpCount + currentRestaurant.thumbsDownCount || 1)) * 100
  );

  return (
    <div className="space-y-6">
      {/* Merchant Header Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold font-display text-2xl shadow-xs shrink-0">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Verified Merchant Partner
              </span>
              <span className="text-xs text-stone-600">·</span>
              <span className="text-xs text-stone-600">{currentRestaurant.neighborhood}</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 font-display mt-0.5">
              {currentRestaurant.name}
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Publish seasonal promotions, update signature menus, and acquire nearby diners.
            </p>
          </div>
        </div>

        {/* Switch Restaurant Dropdown */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] text-stone-600 font-medium">Switch Managed Venue:</div>
            <select
              value={currentRestaurant.id}
              onChange={(e) => onSelectRestaurant(e.target.value)}
              className="text-xs font-bold text-stone-800 bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowPromoModal(true)}
            className="px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Launch New Offer</span>
          </button>
        </div>
      </div>

      {/* KPI Performance Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-stone-600 text-xs mb-1">
            <span>Nearby Reach</span>
            <Users className="w-4 h-4 text-stone-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">2,840</div>
          <div className="text-[11px] text-emerald-700 mt-1">Diners active within 2 km</div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-stone-600 text-xs mb-1">
            <span>Vouchers Claimed</span>
            <Tag className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">{totalClaims}</div>
          <div className="text-[11px] text-stone-600 mt-1">Across active seasonal campaigns</div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-stone-600 text-xs mb-1">
            <span>Est. Promo Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">${estimatedRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-700 mt-1">+18.4% vs previous month</div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-stone-600 text-xs mb-1">
            <span>Diner Sentiment</span>
            <ThumbsUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">{positiveSentiment}%</div>
          <div className="text-[11px] text-stone-600 mt-1">{currentRestaurant.thumbsUpCount} positive feedback votes</div>
        </div>
      </div>

      {/* Merchant Navigation Tabs */}
      <div className="flex items-center border-b border-stone-200 bg-white px-6 rounded-t-2xl gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('promotions')}
          className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'promotions'
              ? 'border-amber-600 text-stone-900 font-bold'
              : 'border-transparent text-stone-600 hover:text-stone-800'
          }`}
        >
          <Tag className="w-3.5 h-3.5 text-amber-600" />
          <span>Active Seasonal Promotions ({currentRestaurant.activePromotions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('dishes')}
          className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'dishes'
              ? 'border-amber-600 text-stone-900 font-bold'
              : 'border-transparent text-stone-600 hover:text-stone-800'
          }`}
        >
          <Utensils className="w-3.5 h-3.5 text-amber-600" />
          <span>Offerings & Signature Menu ({currentRestaurant.signatureDishes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'analytics'
              ? 'border-amber-600 text-stone-900 font-bold'
              : 'border-transparent text-stone-600 hover:text-stone-800'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
          <span>Algorithm Match & Customer Insights</span>
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="bg-white rounded-b-2xl border-x border-b border-stone-200 p-6 space-y-6">
        {/* TAB 1: PROMOTIONS */}
        {activeTab === 'promotions' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Live Seasonal Campaigns Promoted to Nearby Diners
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Promotions are immediately surfaced to diners based on their current weather, mealtime, and location radius.
                </p>
              </div>

              <button
                onClick={() => setShowPromoModal(true)}
                className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Promotion</span>
              </button>
            </div>

            <div className="space-y-4">
              {currentRestaurant.activePromotions.map((promo) => (
                <div
                  key={promo.id}
                  className="p-5 border border-amber-200 rounded-xl bg-amber-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-amber-900 uppercase bg-amber-100 px-2 py-0.5 rounded">
                        {promo.badgeText}
                      </span>
                      <span className="text-xs text-stone-600">·</span>
                      <span className="text-xs text-stone-600">Mealtime: {promo.mealtimeTarget}</span>
                      <span className="text-xs text-stone-600">·</span>
                      <span className="text-xs text-stone-600 font-mono">Expires {promo.validUntil}</span>
                    </div>

                    <h4 className="text-base font-bold text-stone-900 font-display">
                      {promo.title} ({promo.discountLabel})
                    </h4>
                    <p className="text-xs text-stone-600">{promo.description}</p>
                    <div className="text-[11px] text-stone-600">
                      Terms: {promo.terms}
                    </div>
                  </div>

                  {/* Promo Performance Stats */}
                  <div className="flex items-center gap-6 shrink-0 bg-white p-3 rounded-lg border border-stone-200 text-center">
                    <div>
                      <div className="text-[10px] text-stone-600 uppercase font-semibold">Code</div>
                      <div className="text-sm font-bold font-mono text-stone-900">{promo.promoCode}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-600 uppercase font-semibold">Claims</div>
                      <div className="text-sm font-bold font-mono text-amber-700">{promo.claimsCount}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-600 uppercase font-semibold">Status</div>
                      <div className="text-xs font-semibold text-emerald-700">Active Live</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: OFFERINGS & DISHES */}
        {activeTab === 'dishes' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Signature Dishes & Seasonal Offerings
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Highlighted in the 10-second decision solver and diner discovery cards.
                </p>
              </div>

              <button
                onClick={() => setShowDishModal(true)}
                className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Offering</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentRestaurant.signatureDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-bold text-stone-900 text-sm">{dish.name}</h4>
                      <span className="font-mono font-bold text-stone-900 text-sm">${dish.price}</span>
                    </div>
                    <p className="text-xs text-stone-600 mb-2 leading-relaxed">{dish.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-xs">
                    <div className="flex items-center gap-1 text-[11px] text-stone-600">
                      <span className="font-semibold text-stone-700">{dish.category}</span>
                      {dish.isSeasonal && <span className="text-amber-700">· Seasonal</span>}
                      {dish.dietary.map((d) => (
                        <span key={d}>· {d}</span>
                      ))}
                    </div>

                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      In Stock
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ALGORITHM MATCH & ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                How Your Venue Ranks in the BiteMatch Decision Engine
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                The algorithm matches diners in under 10 seconds based on real-time weather, mood craving, and walking distance:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                <div className="p-3 bg-white rounded-lg border border-stone-200 text-center">
                  <div className="text-xs text-stone-600">Rainy / Cold Comfort Score</div>
                  <div className="text-xl font-bold font-mono text-amber-700 mt-1">98 / 100</div>
                  <div className="text-[11px] text-stone-600 mt-0.5">Top ranked in {currentRestaurant.neighborhood}</div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-stone-200 text-center">
                  <div className="text-xs text-stone-600">Decision Solver Win Rate</div>
                  <div className="text-xl font-bold font-mono text-stone-900 mt-1">42.8%</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">+8% since truffle promo launched</div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-stone-200 text-center">
                  <div className="text-xs text-stone-600">Diner Recommendation Velocity</div>
                  <div className="text-xl font-bold font-mono text-stone-900 mt-1">
                    {currentRestaurant.userRecommendations.length} Tips
                  </div>
                  <div className="text-[11px] text-stone-600 mt-0.5">100% verified customer ratings</div>
                </div>
              </div>
            </div>

            {/* Diner Reviews and Recommendations */}
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
                Customer Recommendations on Your Dishes
              </h4>
              <div className="space-y-3">
                {currentRestaurant.userRecommendations.map((rec) => (
                  <div key={rec.id} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-stone-900">{rec.userName}</span>
                      <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                        Recommends: {rec.dishRecommended}
                      </span>
                    </div>
                    <p className="text-stone-700 italic">"{rec.quote}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: LAUNCH NEW PROMOTION */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="text-xl font-bold text-stone-900 font-display mb-1">
              Launch Seasonal Promotion for {currentRestaurant.name}
            </h3>
            <p className="text-xs text-stone-600 mb-5">
              This promotion will be surfaced immediately to nearby diners searching for food recommendations.
            </p>

            <form onSubmit={handleCreatePromo} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Campaign Title</label>
                <input
                  type="text"
                  placeholder="e.g. Autumn Truffle Festival 20% Off"
                  value={promoTitle}
                  onChange={(e) => setPromoTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Discount Headline</label>
                  <input
                    type="text"
                    placeholder="e.g. 20% Off Tasting Menu"
                    value={promoDiscountLabel}
                    onChange={(e) => setPromoDiscountLabel(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Promo Voucher Code</label>
                  <input
                    type="text"
                    placeholder="e.g. TRUFFLE20"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono uppercase focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Badge Style</label>
                  <select
                    value={promoBadge}
                    onChange={(e) => setPromoBadge(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="Seasonal Exclusive">Seasonal Exclusive</option>
                    <option value="Lunch Special">Lunch Special</option>
                    <option value="Early Bird Rush">Early Bird Rush</option>
                    <option value="VIP Pairing Perk">VIP Pairing Perk</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Target Mealtime</label>
                  <select
                    value={promoMealtime}
                    onChange={(e) => setPromoMealtime(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="all">All Mealtimes</option>
                    <option value="lunch">Lunch Rush</option>
                    <option value="dinner">Dinner & Evening</option>
                    <option value="weekend">Weekend Special</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description for Diners</label>
                <textarea
                  placeholder="Describe what makes this seasonal offer enticing..."
                  rows={2}
                  value={promoDesc}
                  onChange={(e) => setPromoDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Voucher Terms & Conditions</label>
                <input
                  type="text"
                  value={promoTerms}
                  onChange={(e) => setPromoTerms(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowPromoModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-semibold cursor-pointer transition-colors"
                >
                  Publish Promo Live to Diners
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD DISH */}
      {showDishModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 font-display mb-1">
              Add New Offering to Menu
            </h3>
            <p className="text-xs text-stone-600 mb-4">
              Add signature creations and seasonal specials to your venue profile.
            </p>

            <form onSubmit={handleCreateDish} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Dish Name</label>
                <input
                  type="text"
                  placeholder="e.g. Saffron Risotto with Bone Marrow"
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    value={dishPrice}
                    onChange={(e) => setDishPrice(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={dishCategory}
                    onChange={(e) => setDishCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="Starter">Starter</option>
                    <option value="Main">Main</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Beverage">Beverage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description & Ingredients</label>
                <textarea
                  placeholder="Artisan ingredients, cooking technique, tasting notes..."
                  rows={2}
                  value={dishDesc}
                  onChange={(e) => setDishDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Dietary Tag</label>
                <select
                  value={dishDietary}
                  onChange={(e) => setDishDietary(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                >
                  <option value="Vegetarian Friendly">Vegetarian Friendly</option>
                  <option value="Vegan Friendly">Vegan Friendly</option>
                  <option value="Gluten-Free Options">Gluten-Free Options</option>
                  <option value="Lactose-Free Options">Lactose-Free Options</option>
                  <option value="Halal Options">Halal Options</option>
                  <option value="Pescatarian Friendly">Pescatarian Friendly</option>
                </select>
              </div>

              <div className="flex items-center gap-4 py-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dishIsSeasonal}
                    onChange={(e) => setDishIsSeasonal(e.target.checked)}
                    className="rounded text-amber-600"
                  />
                  <span className="font-medium text-stone-800">Mark as Seasonal Special</span>
                </label>
              </div>


              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowDishModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold cursor-pointer transition-colors"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
