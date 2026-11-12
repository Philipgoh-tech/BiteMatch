export type PriceTier = '$' | '$$' | '$$$' | '$$$$';

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  dietary: string[];
  isSignature?: boolean;
  isSeasonal?: boolean;
  category: 'Starter' | 'Main' | 'Dessert' | 'Beverage';
}

export interface Promotion {
  id: string;
  restaurantId: string;
  restaurantName: string;
  title: string;
  badgeText: string;
  discountLabel: string;
  description: string;
  validUntil: string;
  mealtimeTarget: 'all' | 'lunch' | 'dinner' | 'weekend';
  promoCode: string;
  claimsCount: number;
  terms: string;
  bannerImage?: string;
  minSpend?: number;
}

export interface UserRecommendation {
  id: string;
  userName: string;
  userAvatar: string;
  restaurantId: string;
  restaurantName: string;
  dishRecommended: string;
  quote: string;
  date: string;
  helpfulCount: number;
  tags: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisine: string;
  category: string;
  priceTier: PriceTier;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  travelTimeMin: number;
  address: string;
  neighborhood: string;
  coordinates: {
    lat: number;
    lng: number;
    mapX: number; // 0 to 100 for SVG map rendering
    mapY: number; // 0 to 100 for SVG map rendering
  };
  image: string;
  features: string[];
  dietaryTags: string[];
  openNow: boolean;
  hours: string;
  moodTags: string[];
  weatherAffinity: ('rainy' | 'sunny' | 'chilly' | 'warm' | 'any')[];
  signatureDishes: Dish[];
  activePromotions: Promotion[];
  loyaltyReward: {
    pointsNeeded: number;
    title: string;
    description: string;
  };
  thumbsUpCount: number;
  thumbsDownCount: number;
  userRecommendations: UserRecommendation[];
}

export interface UserLoyaltyProfile {
  points: number;
  tier: 'Bronze Foodie' | 'Silver Connoisseur' | 'Gold Epicurean';
  streakDays: number;
  nextMilestonePoints: number;
  badges: {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
  }[];
  claimedVouchers: {
    id: string;
    promoId: string;
    code: string;
    title: string;
    restaurantName: string;
    discountLabel: string;
    expires: string;
    redeemed: boolean;
  }[];
  feedbackHistory: {
    restaurantId: string;
    restaurantName: string;
    reaction: 'up' | 'down';
    comment?: string;
    timestamp: string;
  }[];
  preferences: {
    dietary: string[];
    favoriteCuisines: string[];
    spicyTolerance: 'mild' | 'medium' | 'high';
  };
}

export interface MealtimeNudge {
  id: string;
  mealtime: 'Lunch' | 'Dinner';
  timeLabel: string;
  enabled: boolean;
  headline: string;
  suggestedRestaurantId: string;
  rationale: string;
}

export interface DecisionCriteria {
  mealtime: 'breakfast' | 'lunch' | 'dinner' | 'late-night';
  weather: 'rainy' | 'sunny' | 'chilly' | 'warm';
  mood: 'quick-bite' | 'cozy-comfort' | 'date-night' | 'celebratory' | 'healthy' | 'adventurous';
  maxBudget: PriceTier;
  dietary: string[];
  maxDistanceKm: number;
}
