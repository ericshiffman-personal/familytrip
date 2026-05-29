'use client';

import { useState } from 'react';
import { TripInputs, Destination, DiningData, DiningPreferences, RestaurantRecommendation, RestaurantStatus } from '@/types';
import RestaurantCard from './RestaurantCard';

const CUISINE_OPTIONS: { value: DiningPreferences['cuisineVibe']; label: string; desc: string }[] = [
  { value: 'local',       label: 'Local classics',     desc: 'Regional spots the locals love' },
  { value: 'italian',     label: 'Italian / Med',      desc: 'Pasta, pizza, seafood — kid-friendly flavors' },
  { value: 'asian',       label: 'Asian',              desc: 'Japanese, Thai, Vietnamese, Chinese' },
  { value: 'american',    label: 'American comfort',   desc: 'Burgers, BBQ, familiar for picky eaters' },
  { value: 'adventurous', label: 'Anything goes',      desc: "We're up for trying something new" },
];

const STYLE_OPTIONS: { value: DiningPreferences['diningStyle']; label: string; desc: string }[] = [
  { value: 'casual',  label: 'All casual',            desc: 'No tablecloths, kids can be loud' },
  { value: 'mixed',   label: 'Mix + one nice dinner', desc: 'Mostly casual, one memorable meal' },
  { value: 'special', label: 'Lean nicer',            desc: 'Special-occasion mode with kids in tow' },
];

interface DiningGuideProps {
  tripInputs: TripInputs;
  destination: Destination;
  numDays: number;
  diningData: DiningData | null;
  onDiningDataChange: (data: DiningData) => void;
}

export default function DiningGuide({
  tripInputs,
  destination,
  numDays,
  diningData,
  onDiningDataChange,
}: DiningGuideProps) {
  const [formVisible, setFormVisible] = useState(!diningData);
  const [cuisineVibe, setCuisineVibe] = useState<DiningPreferences['cuisineVibe'] | ''>('');
  const [diningStyle, setDiningStyle] = useState<DiningPreferences['diningStyle'] | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = !!cuisineVibe && !!diningStyle;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/dining', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripInputs,
          destination,
          preferences: { cuisineVibe, diningStyle },
          numDays,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load restaurant picks');
      const newData: DiningData = {
        slug: destination.slug,
        preferences: { cuisineVibe: cuisineVibe as DiningPreferences['cuisineVibe'], diningStyle: diningStyle as DiningPreferences['diningStyle'] },
        recommendations: data.restaurants ?? [],
        savedRestaurants: diningData?.savedRestaurants ?? [],  // preserve existing saves
        generatedAt: new Date().toISOString(),
      };
      onDiningDataChange(newData);
      setFormVisible(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load restaurants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Handlers for restaurant bank mutations ────────────────────────────────

  const handleSaveToDay = (restaurant: RestaurantRecommendation, dayNumber: number, status: RestaurantStatus) => {
    if (!diningData) return;
    // Remove existing booking for that day (one restaurant per evening slot)
    const withoutDay = diningData.savedRestaurants.filter((s) => s.dayNumber !== dayNumber);
    // Remove same restaurant from any other day
    const withoutDupe = withoutDay.filter((s) => s.restaurant.name !== restaurant.name);
    const updated: DiningData = {
      ...diningData,
      savedRestaurants: [...withoutDupe, { dayNumber, status, restaurant, savedAt: new Date().toISOString() }],
    };
    onDiningDataChange(updated);
  };

  const handleMarkFlexible = (restaurant: RestaurantRecommendation) => {
    if (!diningData) return;
    // Remove same restaurant if already saved elsewhere
    const withoutDupe = diningData.savedRestaurants.filter((s) => s.restaurant.name !== restaurant.name);
    const updated: DiningData = {
      ...diningData,
      savedRestaurants: [...withoutDupe, { dayNumber: null, status: 'flexible', restaurant, savedAt: new Date().toISOString() }],
    };
    onDiningDataChange(updated);
  };

  const handleMarkBooked = (restaurant: RestaurantRecommendation, bookingNote: string) => {
    if (!diningData) return;
    const existing = diningData.savedRestaurants.find((s) => s.restaurant.name === restaurant.name);
    if (!existing) return;
    const updated: DiningData = {
      ...diningData,
      savedRestaurants: diningData.savedRestaurants.map((s) =>
        s.restaurant.name === restaurant.name
          ? { ...s, status: 'booked', bookingNote, savedAt: new Date().toISOString() }
          : s
      ),
    };
    onDiningDataChange(updated);
  };

  const handleRemove = (restaurant: RestaurantRecommendation) => {
    if (!diningData) return;
    const updated: DiningData = {
      ...diningData,
      savedRestaurants: diningData.savedRestaurants.filter((s) => s.restaurant.name !== restaurant.name),
    };
    onDiningDataChange(updated);
  };

  // ── Preference form ───────────────────────────────────────────────────────

  if (formVisible) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="font-display text-xl font-bold text-navy mb-1">Dining guide</h2>
          <p className="text-ink-muted text-sm">
            Tell us your vibe and we&apos;ll find restaurants that work for your family.
          </p>
        </div>

        {/* Dietary context banner — read-only */}
        {tripInputs.dietaryRestrictions && tripInputs.dietaryRestrictions.length > 0 && (
          <div className="bg-navy-light rounded-xl px-4 py-3 text-sm text-navy flex gap-2 items-start">
            <span className="flex-shrink-0">⚠️</span>
            <span>
              Already filtering for:{' '}
              <strong>{tripInputs.dietaryRestrictions.join(', ')}</strong>
            </span>
          </div>
        )}

        {/* Cuisine vibe */}
        <div className="card p-5">
          <p className="text-sm font-semibold text-navy mb-3">What&apos;s your cuisine vibe?</p>
          <div className="space-y-2">
            {CUISINE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setCuisineVibe(opt.value)}
                className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                  cuisineVibe === opt.value
                    ? 'border-coral bg-coral-light'
                    : 'border-cream-dark bg-white hover:border-coral/40'
                }`}
              >
                <div className={`font-semibold text-sm ${cuisineVibe === opt.value ? 'text-coral' : 'text-navy'}`}>
                  {opt.label}
                </div>
                <div className="text-xs text-ink-muted mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Dining style */}
        <div className="card p-5">
          <p className="text-sm font-semibold text-navy mb-3">What&apos;s your dining style?</p>
          <div className="space-y-2">
            {STYLE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDiningStyle(opt.value)}
                className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                  diningStyle === opt.value
                    ? 'border-coral bg-coral-light'
                    : 'border-cream-dark bg-white hover:border-coral/40'
                }`}
              >
                <div className={`font-semibold text-sm ${diningStyle === opt.value ? 'text-coral' : 'text-navy'}`}>
                  {opt.label}
                </div>
                <div className="text-xs text-ink-muted mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm text-coral text-center">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
            canSubmit && !loading
              ? 'bg-coral hover:bg-coral-dark text-white shadow-lg shadow-coral/20'
              : 'bg-cream-dark text-ink-muted cursor-not-allowed'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⟳</span> Finding restaurants...
            </span>
          ) : (
            'Find restaurants for us →'
          )}
        </button>
      </div>
    );
  }

  // ── Loading state ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-3 animate-bounce">🍽️</div>
        <p className="text-ink-muted text-sm">Finding restaurants that work for your family...</p>
      </div>
    );
  }

  // ── Results state ─────────────────────────────────────────────────────────

  if (!diningData) return null;

  const bookedCount = diningData.savedRestaurants.filter((s) => s.status === 'booked').length;
  const plannedCount = diningData.savedRestaurants.filter((s) => s.dayNumber !== null).length;

  // Sort: saved/booked first, then by bestForDay, then alphabetical
  const sorted = [...diningData.recommendations].sort((a, b) => {
    const aEntry = diningData.savedRestaurants.find((s) => s.restaurant.name === a.name);
    const bEntry = diningData.savedRestaurants.find((s) => s.restaurant.name === b.name);
    const aBooked = aEntry?.status === 'booked' ? 0 : aEntry ? 1 : 2;
    const bBooked = bEntry?.status === 'booked' ? 0 : bEntry ? 1 : 2;
    if (aBooked !== bBooked) return aBooked - bBooked;
    const aDay = a.bestForDay ?? 99;
    const bDay = b.bestForDay ?? 99;
    if (aDay !== bDay) return aDay - bDay;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-navy">
          {diningData.recommendations.length} restaurants in {destination.name}
        </h2>
        <button
          onClick={() => setFormVisible(true)}
          className="text-xs text-coral font-semibold hover:underline"
        >
          Adjust picks
        </button>
      </div>

      {/* Planned banner */}
      {plannedCount > 0 && (
        <div className="bg-coral-light rounded-xl px-4 py-3 text-sm text-coral-dark">
          {bookedCount > 0 ? (
            <span>
              <strong>{bookedCount} dinner{bookedCount > 1 ? 's' : ''} booked</strong>
              {plannedCount > bookedCount && `, ${plannedCount - bookedCount} more in consideration`}
              {' — '}check your Itinerary tab to see them.
            </span>
          ) : (
            <span>
              <strong>{plannedCount} dinner{plannedCount > 1 ? 's' : ''} in consideration</strong>
              {' — '}check your Itinerary tab to see them.
            </span>
          )}
        </div>
      )}

      {/* Restaurant cards */}
      {sorted.map((restaurant) => {
        const savedEntry = diningData.savedRestaurants.find(
          (s) => s.restaurant.name === restaurant.name
        );
        return (
          <RestaurantCard
            key={restaurant.name}
            restaurant={restaurant}
            savedEntry={savedEntry}
            totalDays={numDays}
            onSaveToDay={(day, status) => handleSaveToDay(restaurant, day, status)}
            onMarkFlexible={() => handleMarkFlexible(restaurant)}
            onMarkBooked={(note) => handleMarkBooked(restaurant, note)}
            onRemove={() => handleRemove(restaurant)}
          />
        );
      })}
    </div>
  );
}
