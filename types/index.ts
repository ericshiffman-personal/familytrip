export interface Child {
  age: number;
  nickname?: string;
}

export interface NapWindow {
  approxTime: string;   // e.g. "9:00–10:30am"
  strollerOk: boolean;  // true = stroller/carrier nap works; false = needs crib
}

export interface NapDetails {
  count: 1 | 2;         // single or double napper
  naps: NapWindow[];    // one entry per nap
}

export interface VibeSelections {
  environment?: 'beach' | 'mountains';
  pace?: 'relaxed' | 'adventure';
  transport?: 'fly' | 'drive';
  geography?: 'international' | 'domestic';
  accommodation?: 'allinclusive' | 'rental';
}

export interface TripInputs {
  vibes: VibeSelections;
  adults: number;
  children: Child[];
  napRequired: boolean;
  napSchedule?: string;   // simple time string for older nappers (3–5)
  napDetails?: NapDetails; // structured detail for infants/toddlers (≤2)
  duration: '3-4 days' | '5-7 days' | '8-10 days' | '10+ days';
  budget: 'budget' | 'comfortable' | 'splurge';
  departureCity: string;
  travelMethod: 'fly' | 'drive' | 'either';
  directFlightsOnly?: boolean;
  travelMonth?: string;
  dealBreakers: string;
  previousBadExperience?: string;
  dietaryRestrictions: string[];  // e.g. ["Vegetarian", "Nut allergy"]
}

export interface TradeoffChip {
  label: string;
  type: 'positive' | 'negative' | 'neutral';
}

export interface Destination {
  name: string;
  tagline: string;
  heroGradient: string;
  // "Our Call" fields
  theCall: string;
  whyItWorks: string[];
  tradeoffChips: TradeoffChip[];
  hiddenCatch: string;
  honestTradeoff: string;
  whenToIgnore: string;
  confidence: 'High' | 'Medium' | 'Low';
  // Meta
  bestFor: string;
  flightTime?: string;
  budgetNote: string;
  topActivities: string[];
  slug: string;
}

export interface RecommendationResponse {
  primary: Destination;
  alternative: Destination;
  ourCallSummary: string;
}

export interface BookingFlag {
  item: string;      // e.g. "Alcatraz tickets", "Blue Cave boat tour"
  leadTime: string;  // e.g. "Book 4–6 weeks ahead", "Reserve 1 week out"
  urgent: boolean;   // true = high demand / books out fast
}

export interface ItineraryDay {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  napNote?: string;
  tip: string;
  bookingFlags?: BookingFlag[];
}

export interface PackingCategory {
  category: string;
  emoji: string;
  items: string[];
}

export interface FamilyProfile {
  adults: number;
  children: Child[];
  napRequired: boolean;
  napSchedule?: string;
  activityLevel: 'relaxed' | 'moderate' | 'active';
  dealBreakers: string;
  savedAt: string;
}

// ── Dining feature ──────────────────────────────────────────────────

export interface DiningPreferences {
  cuisineVibe: 'local' | 'italian' | 'asian' | 'american' | 'adventurous';
  diningStyle: 'casual' | 'mixed' | 'special';
}

export interface RestaurantRecommendation {
  name: string;
  neighborhood: string;
  cuisineType: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  whyItWorks: string;        // 1 sentence, family-specific
  bestForMeal: 'dinner' | 'lunch';
  bestForDay?: number;       // Claude's soft suggestion (1-indexed)
  bookingLeadTime: string;   // e.g. "Reserve 3–4 days out" or "Walk-ins fine on weekdays"
  bookingUrgent: boolean;
  openTableQuery: string;    // e.g. "Nobu Malibu Los Angeles" — for constructing search URL
}

export type RestaurantStatus = 'booked' | 'considering' | 'flexible';

export interface SavedRestaurant {
  dayNumber: number | null;  // null = flexible / any night
  status: RestaurantStatus;
  restaurant: RestaurantRecommendation;
  bookingNote?: string;      // optional: "8pm, conf #R123456"
  savedAt: string;           // ISO timestamp
}

export interface DiningData {
  slug: string;
  preferences: DiningPreferences;
  recommendations: RestaurantRecommendation[];
  savedRestaurants: SavedRestaurant[];
  generatedAt: string;
}
