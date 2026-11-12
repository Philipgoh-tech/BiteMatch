import React, { useState, useMemo } from 'react';
import { Sparkles, MapPin, Search, Filter, Tag, Award, Compass, UtensilsCrossed, ArrowRight, CheckCircle2, CloudRain, Flame } from 'lucide-react';
import { Restaurant, Promotion, Dish, UserLoyaltyProfile, MealtimeNudge } from './types';
import { INITIAL_RESTAURANTS, INITIAL_USER_PROFILE, INITIAL_MEALTIME_NUDGES } from './data/restaurants';
import { TopNavigation } from './components/TopNavigation';
import { LocationSelectorBar, NEIGHBORHOODS, NEIGHBORHOOD_COORDS } from './components/LocationSelectorBar';
import { RestaurantCard } from './components/RestaurantCard';
import { RestaurantDetailModal } from './components/RestaurantDetailModal';
import { DecisionSolverModal } from './components/DecisionSolverModal';
import { InteractiveMapView } from './components/InteractiveMapView';
import { SeasonalPromotionsView } from './components/SeasonalPromotionsView';
import { CommunityTipsView } from './components/CommunityTipsView';
import { LoyaltyDrawerModal } from './components/LoyaltyDrawerModal';
import { PromoVoucherModal } from './components/PromoVoucherModal';
import { MerchantPortalView } from './components/MerchantPortalView';
import { MealtimeNudgeToast } from './components/MealtimeNudgeToast';

export default function App() {
  // Core Application State
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [userProfile, setUserProfile] = useState<UserLoyaltyProfile>(INITIAL_USER_PROFILE);
  const [nudges, setNudges] = useState<MealtimeNudge[]>(INITIAL_MEALTIME_NUDGES);

  // App Modes and Navigation
  const [portalMode, setPortalMode] = useState<'diner' | 'merchant'>('diner');
  const [activeTab, setActiveTab] = useState<'discover' | 'decision-solver' | 'promotions' | 'community' | 'loyalty'>('discover');

  // Location & Environmental Filters
  const [currentNeighborhood, setCurrentNeighborhood] = useState<string>('Downtown Arts District');
  const [radiusKm, setRadiusKm] = useState<number>(2.0);
  const [weather, setWeather] = useState<'rainy' | 'sunny' | 'chilly' | 'warm'>('rainy');
  const [mealtime, setMealtime] = useState<'breakfast' | 'lunch' | 'dinner' | 'late-night'>('dinner');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [isGpsLoading, setIsGpsLoading] = useState(false);

  // Search & Tag Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [selectedDietary, setSelectedDietary] = useState<string>('all');
  const [onlyPromos, setOnlyPromos] = useState(false);

  // Modals & Drawers
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isDecisionSolverOpen, setIsDecisionSolverOpen] = useState(false);
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState(false);
  const [claimedPromo, setClaimedPromo] = useState<Promotion | null>(null);
  const [activeNudge, setActiveNudge] = useState<MealtimeNudge | null>(null);

  // Merchant Portal Active Restaurant
  const [merchantRestaurantId, setMerchantRestaurantId] = useState<string>(restaurants[0]?.id || 'rest-1');

  // Handle GPS Geolocation
  const handleGpsRequest = () => {
    setIsGpsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsGpsLoading(false);
          // Pick closest neighborhood based on simulation
          setCurrentNeighborhood('Downtown Arts District');
        },
        (error) => {
          setIsGpsLoading(false);
          setCurrentNeighborhood('Downtown Arts District');
        },
        { timeout: 4000 }
      );
    } else {
      setIsGpsLoading(false);
    }
  };

  // User Reaction / Continuous Feedback loop
  const handleFeedback = (restaurantId: string, reaction: 'up' | 'down') => {
    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id === restaurantId) {
          return {
            ...r,
            thumbsUpCount: reaction === 'up' ? r.thumbsUpCount + 1 : r.thumbsUpCount,
            thumbsDownCount: reaction === 'down' ? r.thumbsDownCount + 1 : r.thumbsDownCount,
          };
        }
        return r;
      })
    );

    // Update user profile loyalty points and feedback history (+15 points)
    const rest = restaurants.find((r) => r.id === restaurantId);
    setUserProfile((prev) => ({
      ...prev,
      points: prev.points + 15,
      feedbackHistory: [
        {
          restaurantId,
          restaurantName: rest?.name || 'Local Restaurant',
          reaction,
          comment: reaction === 'up' ? 'Delicious, loved the flavors!' : 'Not quite my taste.',
          timestamp: 'Just now',
        },
        ...prev.feedbackHistory,
      ],
    }));
  };

  // Claim Seasonal Promotion Voucher
  const handleClaimPromo = (promoId: string) => {
    let foundPromo: Promotion | null = null;
    restaurants.forEach((r) => {
      const p = r.activePromotions.find((item) => item.id === promoId);
      if (p) foundPromo = p;
    });

    if (foundPromo) {
      const p = foundPromo as Promotion;
      setClaimedPromo(p);

      // Check if already in user wallet
      const exists = userProfile.claimedVouchers.some((v) => v.promoId === p.id);
      if (!exists) {
        setUserProfile((prev) => ({
          ...prev,
          points: prev.points + 20, // 20 bonus points for claiming offer!
          claimedVouchers: [
            {
              id: `v-${Date.now()}`,
              promoId: p.id,
              code: p.promoCode,
              title: p.title,
              restaurantName: p.restaurantName,
              discountLabel: p.discountLabel,
              expires: p.validUntil,
              redeemed: false,
            },
            ...prev.claimedVouchers,
          ],
        }));
      }
    }
  };

  // Redeem Voucher
  const handleRedeemVoucher = (voucherId: string) => {
    setUserProfile((prev) => ({
      ...prev,
      claimedVouchers: prev.claimedVouchers.map((v) =>
        v.id === voucherId ? { ...v, redeemed: true } : v
      ),
    }));
  };

  // Add User Recommendation to Restaurant ("Recommend to other users")
  const handleAddRecommendation = (
    restaurantId: string,
    dish: string,
    quote: string,
    tags: string[]
  ) => {
    const newRec = {
      id: `rec-${Date.now()}`,
      userName: 'Goh Teng Lee',
      userAvatar: 'GT',
      restaurantId,
      restaurantName: restaurants.find((r) => r.id === restaurantId)?.name || 'Local Restaurant',
      dishRecommended: dish,
      quote,
      date: 'Just now',
      helpfulCount: 1,
      tags,
    };

    setRestaurants((prev) =>
      prev.map((r) =>
        r.id === restaurantId
          ? { ...r, userRecommendations: [newRec, ...r.userRecommendations] }
          : r
      )
    );

    // Reward user with 50 loyalty points!
    setUserProfile((prev) => ({
      ...prev,
      points: prev.points + 50,
      streakDays: prev.streakDays + 1,
    }));
  };

  // Merchant Portal: Add Promotion
  const handleMerchantAddPromo = (
    restaurantId: string,
    newPromoData: Omit<Promotion, 'id' | 'restaurantId' | 'restaurantName' | 'claimsCount'>
  ) => {
    const targetRest = restaurants.find((r) => r.id === restaurantId);
    if (!targetRest) return;

    const createdPromo: Promotion = {
      id: `promo-${Date.now()}`,
      restaurantId,
      restaurantName: targetRest.name,
      claimsCount: 0,
      ...newPromoData,
    };

    setRestaurants((prev) =>
      prev.map((r) =>
        r.id === restaurantId
          ? { ...r, activePromotions: [createdPromo, ...r.activePromotions] }
          : r
      )
    );
  };

  // Merchant Portal: Add Dish
  const handleMerchantAddDish = (restaurantId: string, newDishData: Omit<Dish, 'id'>) => {
    const createdDish: Dish = {
      id: `dish-${Date.now()}`,
      ...newDishData,
    };

    setRestaurants((prev) =>
      prev.map((r) =>
        r.id === restaurantId
          ? { ...r, signatureDishes: [createdDish, ...r.signatureDishes] }
          : r
      )
    );
  };

  // Toggle Mealtime Nudge
  const handleToggleNudge = (id: string) => {
    setNudges((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  };

  // Simulate Push Nudge
  const handleSimulateNudge = (nudge: MealtimeNudge) => {
    setActiveNudge(nudge);
  };

  // Dynamic distance calculation relative to current neighborhood center
  const restaurantsWithDynamicDistance = useMemo(() => {
    const center = NEIGHBORHOOD_COORDS[currentNeighborhood] || NEIGHBORHOOD_COORDS['Central'];
    return restaurants.map((r) => {
      const dx = r.coordinates.mapX - center.mapX;
      const dy = r.coordinates.mapY - center.mapY;
      const rawDist = Math.sqrt(dx * dx + dy * dy) * 0.045;
      const distanceKm = Math.max(0.3, Math.round(rawDist * 10) / 10);
      const travelTimeMin = Math.round(distanceKm * 12);
      return {
        ...r,
        distanceKm,
        travelTimeMin,
      };
    });
  }, [restaurants, currentNeighborhood]);

  // Collect all active seasonal promotions
  const allPromotions = useMemo(() => {
    return restaurantsWithDynamicDistance.flatMap((r) => r.activePromotions);
  }, [restaurantsWithDynamicDistance]);

  // Collect all community recommendations
  const allRecommendations = useMemo(() => {
    return restaurantsWithDynamicDistance.flatMap((r) => r.userRecommendations);
  }, [restaurantsWithDynamicDistance]);

  // Filter restaurants for Discovery
  const filteredRestaurants = useMemo(() => {
    return restaurantsWithDynamicDistance
      .filter((r) => {
        // Radius filter
        if (r.distanceKm > radiusKm) return false;

        // Search query
        if (
          searchQuery &&
          !r.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !r.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }

        // Cuisine filter
        if (selectedCuisine !== 'all' && r.cuisine !== selectedCuisine) {
          return false;
        }

        // Dietary filter
        if (
          selectedDietary !== 'all' &&
          !r.dietaryTags.some((tag) => tag.toLowerCase().includes(selectedDietary.toLowerCase()))
        ) {
          return false;
        }

        // Promos only filter
        if (onlyPromos && r.activePromotions.length === 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [restaurantsWithDynamicDistance, radiusKm, searchQuery, selectedCuisine, selectedDietary, onlyPromos]);


  const uniqueCuisines = useMemo(() => {
    const list = Array.from(new Set(restaurants.map((r) => r.cuisine)));
    return ['all', ...list];
  }, [restaurants]);

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-stone-900 flex flex-col font-sans">
      {/* 1. Header with Top Navigation Bar */}
      <TopNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        portalMode={portalMode}
        setPortalMode={setPortalMode}
        userPoints={userProfile.points}
        openLoyalty={() => setIsLoyaltyOpen(true)}
        openDecisionSolver={() => setIsDecisionSolverOpen(true)}
      />

      {/* 2. Diner Context Bar (GPS, Radius, Weather, Mealtime, Grid/Map toggle) */}
      {portalMode === 'diner' && (
        <LocationSelectorBar
          currentNeighborhood={currentNeighborhood}
          onNeighborhoodChange={setCurrentNeighborhood}
          radiusKm={radiusKm}
          onRadiusChange={setRadiusKm}
          weather={weather}
          onWeatherChange={setWeather}
          mealtime={mealtime}
          onMealtimeChange={setMealtime}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          matchingCount={filteredRestaurants.length}
          onGpsRequested={handleGpsRequest}
          isGpsLoading={isGpsLoading}
        />
      )}

      {/* 3. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* DINER PORTAL MODE */}
        {portalMode === 'diner' ? (
          <div>
            {/* Quick Hero Banner for 10-Second Decision Solver */}
            {activeTab === 'discover' && (
              <div className="mb-8 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-6 sm:p-8 relative overflow-hidden shadow-sm">
                <div className="relative z-10 max-w-2xl">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Eliminate Food Decision Fatigue</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-tight text-white leading-tight">
                    Personalised Restaurant Pick in Under 10 Seconds
                  </h1>
                  <p className="text-stone-300 text-xs sm:text-sm mt-2 leading-relaxed">
                    Matched to your real-time mood, budget, dietary needs, and today's{' '}
                    <span className="font-semibold text-amber-300">
                      {weather === 'rainy' ? 'rainy weather (warm soups & hearty pastas)' : `${weather} weather`}
                    </span>
                    .
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-5">
                    <button
                      onClick={() => setIsDecisionSolverOpen(true)}
                      className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-stone-950" />
                      <span>Decide For Me (10s Match)</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('promotions')}
                      className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <Tag className="w-4 h-4 text-amber-400" />
                      <span>Explore {allPromotions.length} Seasonal Offers</span>
                    </button>
                  </div>
                </div>

                <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden lg:block">
                  <img
                    src="/src/assets/images/hero_restaurant_dining_1794456648950.jpg"
                    alt="Dining Interior"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* TAB: DISCOVER */}
            {activeTab === 'discover' && (
              <div className="space-y-6">
                {/* Search & Tag Filter Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-stone-200">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-stone-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search dish, cuisine, or restaurant name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs text-stone-900 bg-transparent focus:outline-none"
                    />
                  </div>

                  {/* Filter Pills / Selectors */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    <select
                      value={selectedCuisine}
                      onChange={(e) => setSelectedCuisine(e.target.value)}
                      className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-700 font-medium cursor-pointer"
                    >
                      <option value="all">All Cuisines</option>
                      {uniqueCuisines.filter((c) => c !== 'all').map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>

                    <select
                      value={selectedDietary}
                      onChange={(e) => setSelectedDietary(e.target.value)}
                      className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-700 font-medium cursor-pointer"
                    >
                      <option value="all">Dietary: Any</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Gluten-Free">Gluten-Free</option>
                    </select>

                    <button
                      onClick={() => setOnlyPromos(!onlyPromos)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                        onlyPromos
                          ? 'bg-amber-600 border-amber-600 text-white'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span>Has Promo</span>
                    </button>
                  </div>
                </div>

                {/* VIEW MODE: MAP OR GRID */}
                {viewMode === 'map' ? (
                  <InteractiveMapView
                    restaurants={filteredRestaurants}
                    currentNeighborhood={currentNeighborhood}
                    onSelectRestaurant={(r) => setSelectedRestaurant(r)}
                    onClaimPromo={handleClaimPromo}
                  />
                ) : (
                  <div>
                    {filteredRestaurants.length === 0 ? (
                      <div className="p-12 text-center bg-white rounded-2xl border border-stone-200">
                        <MapPin className="w-10 h-10 text-stone-600 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-stone-900 font-display">
                          No restaurants found within {radiusKm} km
                        </h3>
                        <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">
                          Try expanding your search radius using the slider above or selecting a different neighborhood.
                        </p>
                        <button
                          onClick={() => {
                            setRadiusKm(5);
                            setSelectedCuisine('all');
                            setSelectedDietary('all');
                            setOnlyPromos(false);
                            setSearchQuery('');
                          }}
                          className="mt-4 px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 cursor-pointer"
                        >
                          Reset Filters & Expand Radius
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRestaurants.map((restaurant) => (
                          <RestaurantCard
                            key={restaurant.id}
                            restaurant={restaurant}
                            onSelect={(r) => setSelectedRestaurant(r)}
                            onClaimPromo={handleClaimPromo}
                            onFeedback={handleFeedback}
                            userReaction={
                              userProfile.feedbackHistory.find(
                                (fb) => fb.restaurantId === restaurant.id
                              )?.reaction
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB: SEASONAL OFFERS */}
            {activeTab === 'promotions' && (
              <SeasonalPromotionsView
                promotions={allPromotions}
                restaurants={restaurantsWithDynamicDistance}
                onClaimPromo={handleClaimPromo}
                onSelectRestaurant={(r) => setSelectedRestaurant(r)}
              />
            )}

            {/* TAB: COMMUNITY RECOMMENDATIONS */}
            {activeTab === 'community' && (
              <CommunityTipsView
                recommendations={allRecommendations}
                restaurants={restaurantsWithDynamicDistance}
                onSelectRestaurant={(r) => setSelectedRestaurant(r)}
                onAddRecommendation={handleAddRecommendation}
              />
            )}
          </div>
        ) : (
          /* RESTAURANT MERCHANT PORTAL VIEW */
          <MerchantPortalView
            restaurants={restaurants}
            activeRestaurantId={merchantRestaurantId}
            onSelectRestaurant={setMerchantRestaurantId}
            onAddPromotion={handleMerchantAddPromo}
            onAddDish={handleMerchantAddDish}
          />
        )}
      </main>

      {/* 4. Footer */}
      <footer className="bg-white border-t border-stone-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900 font-display">BiteMatch</span>
            <span>·</span>
            <span>Local Food Discovery, Fast Decision Solver & Merchant Portal</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setPortalMode(portalMode === 'diner' ? 'merchant' : 'diner');
              }}
              className="font-semibold text-amber-800 hover:text-amber-950 transition-colors cursor-pointer"
            >
              {portalMode === 'diner' ? 'Switch to Restaurant Portal' : 'Switch to Diner Discovery'}
            </button>
            <span>·</span>
            <span>Designed for Diners & Neighborhood Merchants</span>
          </div>
        </div>
      </footer>

      {/* 5. Modals and Slide-Overs */}
      {/* 10-Second Decision Solver Modal */}
      <DecisionSolverModal
        isOpen={isDecisionSolverOpen}
        onClose={() => setIsDecisionSolverOpen(false)}
        restaurants={restaurantsWithDynamicDistance}
        currentWeather={weather}
        currentMealtime={mealtime}
        onSelectRestaurant={(r) => setSelectedRestaurant(r)}
        onClaimPromo={handleClaimPromo}
      />


      {/* Restaurant Full Detail Modal */}
      <RestaurantDetailModal
        restaurant={selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
        onClaimPromo={handleClaimPromo}
        onAddRecommendation={handleAddRecommendation}
        onFeedback={handleFeedback}
        userReaction={
          selectedRestaurant
            ? userProfile.feedbackHistory.find((fb) => fb.restaurantId === selectedRestaurant.id)?.reaction
            : undefined
        }
      />

      {/* Loyalty & Rewards Drawer Modal */}
      <LoyaltyDrawerModal
        isOpen={isLoyaltyOpen}
        onClose={() => setIsLoyaltyOpen(false)}
        profile={userProfile}
        nudges={nudges}
        onToggleNudge={handleToggleNudge}
        onSimulateNudge={handleSimulateNudge}
        onRedeemVoucher={handleRedeemVoucher}
      />

      {/* Voucher Barcode Modal */}
      <PromoVoucherModal
        promo={claimedPromo}
        onClose={() => setClaimedPromo(null)}
        onRedeemAtCounter={(promoId) => {
          // Find matching voucher in profile and mark redeemed
          const v = userProfile.claimedVouchers.find((item) => item.promoId === promoId);
          if (v) handleRedeemVoucher(v.id);
        }}
      />

      {/* Smart Mealtime Nudge Toast Notification */}
      <MealtimeNudgeToast
        nudge={activeNudge}
        restaurant={restaurants.find((r) => r.id === activeNudge?.suggestedRestaurantId)}
        onClose={() => setActiveNudge(null)}
        onExplore={(r) => setSelectedRestaurant(r)}
      />
    </div>
  );
}
