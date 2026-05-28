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
  travelMonth?: string;
  dealBreakers: string;
  previousBadExperience?: string;
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

export interface ItineraryDay {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  napNote?: string;
  tip: string;
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
