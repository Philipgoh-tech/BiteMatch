import React, { useState, useEffect } from 'react';
import { Sparkles, X, Check, Flame, Heart, DollarSign, Clock, ArrowRight, RotateCw, MapPin } from 'lucide-react';
import { Restaurant, PriceTier } from '../types';

interface DecisionSolverModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurants: Restaurant[];
  currentWeather: 'rainy' | 'sunny' | 'chilly' | 'warm';
  currentMealtime: 'breakfast' | 'lunch' | 'dinner' | 'late-night';
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onClaimPromo: (promoId: string) => void;
}

export const DecisionSolverModal: React.FC<DecisionSolverModalProps> = ({
  isOpen,
  onClose,
  restaurants,
  currentWeather,
  currentMealtime,
  onSelectRestaurant,
  onClaimPromo,
}) => {
  const [selectedMood, setSelectedMood] = useState<'cozy-comfort' | 'quick-bite' | 'date-night' | 'celebratory' | 'healthy' | 'adventurous'>('cozy-comfort');
  const [budget, setBudget] = useState<PriceTier | 'any'>('any');
  const [dietary, setDietary] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationStep, setCalculationStep] = useState(0);
  const [winner, setWinner] = useState<{
    restaurant: Restaurant;
    score: number;
    reasons: string[];
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setWinner(null);
      setIsCalculating(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const moods = [
    { id: 'cozy-comfort', label: 'Cozy Comfort', desc: 'Hearty, comforting, soul-warming dishes', icon: '🍲' },
    { id: 'quick-bite', label: 'Quick Bite', desc: 'Fast, casual, no-fuss dining', icon: '⚡' },
    { id: 'date-night', label: 'Date Night', desc: 'Atmospheric, intimate, candlelit ambience', icon: '🍷' },
    { id: 'celebratory', label: 'Celebration', desc: 'Special occasion, culinary craft, fine drinks', icon: '✨' },
    { id: 'healthy', label: 'Clean & Fresh', desc: 'Farm-to-table, organic, nourishing', icon: '🥗' },
    { id: 'adventurous', label: 'Adventurous', desc: 'Bold spices, authentic street eats', icon: '🌶️' },
  ] as const;

  const dietaryOptions = ['Vegetarian Friendly', 'Vegan Friendly', 'Gluten-Free Options', 'Halal Options'];

  const toggleDietary = (item: string) => {
    setDietary((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const handleStartSolving = () => {
    setIsCalculating(true);
    setCalculationStep(1);

    const timer1 = setTimeout(() => setCalculationStep(2), 600);
    const timer2 = setTimeout(() => setCalculationStep(3), 1300);
    const timer3 = setTimeout(() => {
      // Find optimal match
      const scored = restaurants.map((r) => {
        let score = 70;
        const reasons: string[] = [];

        // Mood match
        if (r.moodTags.includes(selectedMood)) {
          score += 15;
          reasons.push(`Perfect match for your "${moods.find((m) => m.id === selectedMood)?.label}" vibe.`);
        }

        // Weather match
        if (r.weatherAffinity.includes(currentWeather) || r.weatherAffinity.includes('any')) {
          score += 8;
          if (currentWeather === 'rainy' || currentWeather === 'chilly') {
            reasons.push(`Warm culinary shelter ideal for today's ${currentWeather} weather.`);
          } else {
            reasons.push(`Great ambience matched to sunny outdoor & patio weather.`);
          }
        }

        // Proximity bonus
        if (r.distanceKm <= 1.0) {
          score += 5;
          reasons.push(`Just ${r.distanceKm} km away (${r.travelTimeMin} min walk).`);
        }

        // Budget match
        if (budget === 'any' || r.priceTier === budget) {
          score += 5;
        }

        // Promo active
        if (r.activePromotions.length > 0) {
          score += 7;
          reasons.push(`Active seasonal promo: ${r.activePromotions[0].discountLabel}.`);
        }

        return { restaurant: r, score: Math.min(score, 99), reasons };
      });

      scored.sort((a, b) => b.score - a.score);
      setWinner(scored[0] || { restaurant: restaurants[0], score: 96, reasons: ['Top neighborhood recommendation'] });
      setIsCalculating(false);
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-600 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!winner && !isCalculating && (
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold mb-1 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>End Decision Fatigue</span>
              </div>
              <h2 className="text-2xl font-bold text-stone-900 font-display">
                Get a Personalised Pick in Under 10 Seconds
              </h2>
              <p className="text-stone-600 text-sm mt-1">
                Matched to your real-time mood, budget, weather ({currentWeather}), and mealtime ({currentMealtime}).
              </p>
            </div>

            {/* Step 1: Mood */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2.5">
                1. What vibe or mood are you craving?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {moods.map((m) => {
                  const isSelected = selectedMood === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMood(m.id)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50/70 ring-1 ring-amber-600 text-stone-900'
                          : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                      }`}
                    >
                      <div className="text-xl mb-1">{m.icon}</div>
                      <div className="text-xs font-semibold text-stone-900">{m.label}</div>
                      <div className="text-[11px] text-stone-600 mt-0.5 leading-snug line-clamp-1">
                        {m.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Budget */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2.5">
                2. Price / Budget Preference
              </label>
              <div className="grid grid-cols-5 gap-2">
                {(['any', '$', '$$', '$$$', '$$$$'] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setBudget(tier)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      budget === tier
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    {tier === 'any' ? 'Any Budget' : tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Dietary needs (Eat Confidently) */}
            <div className="mb-7">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                3. Eat Confidently: Dietary Needs
              </label>
              <div className="flex flex-wrap gap-2">
                {dietaryOptions.map((item) => {
                  const active = dietary.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleDietary(item)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                        active
                          ? 'bg-amber-100 border-amber-400 text-amber-900 font-semibold'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleStartSolving}
              className="w-full py-3.5 px-6 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Decide For Me in 10 Seconds</span>
            </button>
          </div>
        )}

        {/* Calculating Loading State */}
        {isCalculating && (
          <div className="py-12 px-4 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center animate-bounce">
              <Sparkles className="w-8 h-8 text-amber-700" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2 font-display">
              Crunching Your Ideal BiteMatch...
            </h3>
            <p className="text-stone-600 text-sm max-w-sm mx-auto mb-6">
              {calculationStep === 1 && 'Filtering spots within walking distance...'}
              {calculationStep === 2 && `Applying ${currentWeather} weather comfort index and ${selectedMood} mood...`}
              {calculationStep === 3 && 'Checking active seasonal dining promotions...'}
            </p>
            <div className="w-48 h-1.5 bg-stone-100 rounded-full mx-auto overflow-hidden">
              <div
                className="h-full bg-amber-600 transition-all duration-500 rounded-full"
                style={{ width: `${calculationStep * 33}%` }}
              />
            </div>
          </div>
        )}

        {/* Winner Result View */}
        {winner && !isCalculating && (
          <div>
            <div className="text-center mb-5">
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                {winner.score}% Personalized Match
              </span>
              <h2 className="text-2xl font-bold text-stone-900 mt-2 font-display">
                We Found Your Ideal Table!
              </h2>
            </div>

            {/* Restaurant Feature Card */}
            <div className="border border-stone-200 rounded-xl overflow-hidden bg-stone-50/60 mb-5">
              <div className="h-44 w-full relative overflow-hidden bg-stone-200">
                <img
                  src={winner.restaurant.image}
                  alt={winner.restaurant.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold font-display">{winner.restaurant.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-stone-200 mt-0.5">
                    <span>{winner.restaurant.cuisine}</span>
                    <span>·</span>
                    <span>{winner.restaurant.priceTier}</span>
                    <span>·</span>
                    <span>{winner.restaurant.distanceKm} km ({winner.restaurant.travelTimeMin} min walk)</span>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <p className="text-xs text-stone-600 leading-relaxed italic mb-3">
                  "{winner.restaurant.tagline}"
                </p>

                {/* Why this matched you */}
                <div className="space-y-1.5 mb-4">
                  <div className="text-xs font-semibold text-stone-800 uppercase tracking-wider">
                    Why the algorithm picked this:
                  </div>
                  {winner.reasons.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>

                {/* Seasonal promotion spotlight if available */}
                {winner.restaurant.activePromotions.length > 0 && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between gap-3 mb-2">
                    <div>
                      <div className="text-xs font-bold text-amber-900">
                        {winner.restaurant.activePromotions[0].discountLabel}
                      </div>
                      <div className="text-[11px] text-amber-700">
                        Code: <span className="font-mono font-bold">{winner.restaurant.activePromotions[0].promoCode}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onClaimPromo(winner.restaurant.activePromotions[0].id)}
                      className="px-3 py-1.5 text-xs font-semibold bg-amber-700 hover:bg-amber-800 text-white rounded-md cursor-pointer transition-colors"
                    >
                      Claim Offer
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleStartSolving}
                className="flex items-center justify-center gap-1.5 px-4 py-3 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Reroll Match</span>
              </button>

              <button
                onClick={() => {
                  onSelectRestaurant(winner.restaurant);
                  onClose();
                }}
                className="flex-1 py-3 px-5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>View Full Menu & Reserve</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
