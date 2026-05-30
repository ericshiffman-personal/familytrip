'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TripInputs, Child, Destination, NapDetails } from '@/types';
import { loadProfile, saveTripInputs } from '@/lib/profile';
import NapSection from '@/components/intake/NapSection';
import { WordmarkLogo } from '@/components/shared/Logo';

function toSlug(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const MONTHS = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
];

const DURATION_OPTIONS = [
  { value: '3-4 days', label: '3–4 days', desc: 'Long weekend' },
  { value: '5-7 days', label: '5–7 days', desc: 'One week' },
  { value: '8-10 days', label: '8–10 days', desc: 'Extended week' },
  { value: '10+ days', label: '10+ days', desc: 'Big trip' },
] as const;

export default function GoPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Destination fields
  const [destinationName, setDestinationName] = useState('');
  const [activities, setActivities] = useState('');
  const [duration, setDuration] = useState<TripInputs['duration']>('5-7 days');
  const [travelMonth, setTravelMonth] = useState('');

  // Family fields — pre-filled from saved profile if available
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState<Child[]>([]);
  const [napRequired, setNapRequired] = useState(false);
  const [napSchedule, setNapSchedule] = useState('');
  const [napDetails, setNapDetails] = useState<NapDetails | undefined>(undefined);
  const [departureCity, setDepartureCity] = useState('');
  const [directFlightsOnly, setDirectFlightsOnly] = useState<boolean | undefined>(undefined);
  const [dealBreakers, setDealBreakers] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const DIETARY_CHIPS = [
    'None', 'Vegetarian', 'Vegan', 'Gluten-free', 'Nut allergy', 'Shellfish allergy',
  ] as const;

  const toggleDietary = (chip: string) => {
    if (chip === 'None') { setDietaryRestrictions([]); return; }
    const withoutNone = dietaryRestrictions.filter((r) => r !== 'None');
    if (withoutNone.includes(chip)) {
      setDietaryRestrictions(withoutNone.filter((r) => r !== chip));
    } else {
      setDietaryRestrictions([...withoutNone, chip]);
    }
  };

  useEffect(() => {
    const profile = loadProfile();
    if (profile) {
      setAdults(profile.adults);
      setChildren(profile.children);
      setNapRequired(profile.napRequired);
      setNapSchedule(profile.napSchedule || '');
      // napDetails not currently stored in profile — user fills in fresh each session
      setProfileLoaded(true);
    }
  }, []);

  const hasYoungChild = children.some((c) => c.age <= 5);
  const hasInfant     = children.some((c) => c.age <= 2);
  const canSubmit = destinationName.trim().length >= 2 && departureCity.trim().length >= 2;

  const addChild = () => setChildren([...children, { age: 4 }]);
  const removeChild = (i: number) => setChildren(children.filter((_, idx) => idx !== i));
  const updateAge = (i: number, age: number) =>
    setChildren(children.map((c, idx) => (idx === i ? { ...c, age } : c)));

  const handleSubmit = () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);

    const slug = toSlug(destinationName.trim());
    const topActivities = activities
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean)
      .slice(0, 6);

    // Minimal destination object — enough for the trip page to render and call APIs
    const dest: Destination = {
      name: destinationName.trim(),
      tagline: `Your ${destinationName.trim()} trip`,
      heroGradient: 'from-blue-400 to-cyan-500',
      theCall: '',
      whyItWorks: [],
      tradeoffChips: [],
      hiddenCatch: '',
      honestTradeoff: '',
      whenToIgnore: '',
      confidence: 'High',
      bestFor: '',
      budgetNote: '',
      topActivities,
      slug,
    };

    const inputs: TripInputs = {
      vibes: {},
      adults,
      children,
      napRequired,
      napSchedule,
      napDetails,
      duration,
      budget: 'comfortable',
      departureCity,
      travelMethod: 'fly',
      directFlightsOnly,
      travelMonth: travelMonth || undefined,
      dealBreakers,
      dietaryRestrictions,
    };

    saveTripInputs(inputs);
    sessionStorage.setItem('tinysuitcase_destination', JSON.stringify(dest));
    // Clear stale recommendations so the trip page doesn't pick up a previous session
    sessionStorage.removeItem('tinysuitcase_recommendations');

    router.push(`/trip/${slug}`);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <div className="bg-white border-b border-cream-dark px-6 py-4 sticky top-0 z-40">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href="/">
            <WordmarkLogo height={32} />
          </Link>
          <Link href="/plan" className="text-sm text-ink-muted hover:text-ink transition-colors">
            Not sure where? ← Get a recommendation
          </Link>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-10 pb-20 space-y-8">

        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-navy mb-2">
            Already decided?
          </h1>
          <p className="text-ink-muted text-sm leading-relaxed">
            Tell us where you&apos;re going. We&apos;ll build your itinerary and packing list. No recommendation step needed.
          </p>
        </div>

        {/* Destination */}
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">
            Where are you going? <span className="text-coral">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Cabo San Lucas, Yellowstone, Tokyo..."
            value={destinationName}
            onChange={(e) => setDestinationName(e.target.value)}
            className="w-full bg-white border-2 border-cream-dark rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-coral placeholder-ink-muted transition-colors"
            autoFocus
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-semibold text-navy mb-3">
            How long?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {DURATION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDuration(opt.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  duration === opt.value
                    ? 'border-coral bg-coral-light'
                    : 'border-cream-dark bg-white hover:border-coral/40'
                }`}
              >
                <div className={`font-bold text-sm ${duration === opt.value ? 'text-coral' : 'text-navy'}`}>
                  {opt.label}
                </div>
                <div className="text-ink-muted text-xs mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Travel month */}
        <div>
          <label className="block text-sm font-semibold text-navy mb-1">
            When? <span className="text-ink-muted font-normal">(optional)</span>
          </label>
          <p className="text-xs text-ink-muted mb-3">
            Helps flag weather, peak pricing, and what&apos;s open.
          </p>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {MONTHS.map((month) => (
              <button
                key={month}
                onClick={() => setTravelMonth(travelMonth === month ? '' : month)}
                className={`py-2.5 rounded-xl border-2 text-center transition-all text-sm ${
                  travelMonth === month
                    ? 'border-coral bg-coral-light font-semibold text-coral'
                    : 'border-cream-dark bg-white hover:border-coral/40 text-navy'
                }`}
              >
                {month.slice(0, 3)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setTravelMonth(travelMonth === 'Flexible' ? '' : 'Flexible')}
            className={`w-full py-2.5 rounded-xl border-2 text-center transition-all text-sm ${
              travelMonth === 'Flexible'
                ? 'border-coral bg-coral-light font-semibold text-coral'
                : 'border-cream-dark bg-white hover:border-coral/40 text-ink-muted'
            }`}
          >
            Flexible / not sure yet
          </button>
        </div>

        {/* Activities hint */}
        <div>
          <label className="block text-sm font-semibold text-navy mb-1">
            What are you planning to do? <span className="text-ink-muted font-normal">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. beach days, snorkeling, exploring markets..."
            value={activities}
            onChange={(e) => setActivities(e.target.value)}
            className="w-full bg-white border-2 border-cream-dark rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-coral placeholder-ink-muted transition-colors"
          />
          <p className="text-xs text-ink-muted mt-1.5">Makes your packing list more specific.</p>
        </div>

        {/* Family section */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-cream-dark" />
            <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Your family</span>
            <div className="flex-1 h-px bg-cream-dark" />
          </div>

          {profileLoaded && (
            <div className="bg-navy-light rounded-xl px-4 py-3 mb-5 text-xs text-navy flex items-center gap-2">
              <span>✓</span>
              <span>Pre-filled from your saved profile. Edit below if anything&apos;s changed.</span>
            </div>
          )}

          {/* Adults */}
          <div className="card p-5 mb-4">
            <label className="block text-sm font-semibold text-navy mb-3">Adults traveling</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="w-10 h-10 rounded-full border-2 border-cream-dark text-ink font-bold hover:border-coral hover:text-coral transition-colors text-lg"
              >
                −
              </button>
              <span className="text-2xl font-bold text-navy w-8 text-center">{adults}</span>
              <button
                onClick={() => setAdults(Math.min(8, adults + 1))}
                className="w-10 h-10 rounded-full border-2 border-cream-dark text-ink font-bold hover:border-coral hover:text-coral transition-colors text-lg"
              >
                +
              </button>
              <span className="text-ink-muted text-sm ml-2">{adults === 1 ? 'adult' : 'adults'}</span>
            </div>
          </div>

          {/* Children */}
          <div className="card p-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-navy">Kids coming along</label>
              <button
                onClick={addChild}
                className="text-sm font-medium text-coral hover:text-coral-dark transition-colors"
              >
                + Add a child
              </button>
            </div>
            {children.length === 0 ? (
              <p className="text-ink-muted text-sm italic">No children added yet</p>
            ) : (
              <div className="space-y-3">
                {children.map((child, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-lg">
                      {child.age <= 1 ? '👶' : child.age <= 4 ? '🧒' : child.age <= 9 ? '🧑' : '👦'}
                    </span>
                    <div className="flex-1">
                      <label className="text-xs text-ink-muted mb-1 block">Child {idx + 1} age</label>
                      <select
                        value={child.age}
                        onChange={(e) => updateAge(idx, parseInt(e.target.value))}
                        className="w-full bg-cream border border-cream-dark rounded-xl px-3 py-2 text-sm text-ink focus:outline-none focus:border-coral"
                      >
                        <option value={0}>Under 1 year old</option>
                        {Array.from({ length: 17 }, (_, i) => i + 1).map((age) => (
                          <option key={age} value={age}>
                            {age} {age === 1 ? 'year old' : 'years old'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => removeChild(idx)}
                      className="text-ink-muted hover:text-ink transition-colors text-xl"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nap schedule — shown if any child is 5 or under */}
          {(hasYoungChild || napRequired) && (
            <div className="mb-4">
              <NapSection
                napRequired={napRequired}
                napSchedule={napSchedule}
                napDetails={napDetails}
                hasInfant={hasInfant}
                onChange={(required, schedule, details) => {
                  setNapRequired(required);
                  setNapSchedule(schedule || '');
                  setNapDetails(details);
                }}
              />
            </div>
          )}

          {/* Departure city */}
          <div>
            <label className="block text-sm font-semibold text-navy mb-2">
              Flying from? <span className="text-coral">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Denver, Chicago, Los Angeles..."
              value={departureCity}
              onChange={(e) => setDepartureCity(e.target.value)}
              className="w-full bg-white border-2 border-cream-dark rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-coral placeholder-ink-muted transition-colors"
            />

            {/* Direct flights toggle */}
            <div className="flex gap-2 mt-2">
              {[
                { value: true,  label: 'Direct flights only',  desc: "Non-stop or we're not going" },
                { value: false, label: 'Connections are fine', desc: "We'll deal with a layover"   },
              ].map((opt) => (
                <button
                  key={String(opt.value)}
                  onClick={() => setDirectFlightsOnly(opt.value)}
                  className={`flex-1 p-3 rounded-xl border-2 text-left transition-all ${
                    directFlightsOnly === opt.value
                      ? 'border-coral bg-coral-light'
                      : 'border-cream-dark bg-white hover:border-coral/40'
                  }`}
                >
                  <div className={`font-semibold text-xs ${directFlightsOnly === opt.value ? 'text-coral' : 'text-navy'}`}>
                    {opt.label}
                  </div>
                  <div className="text-ink-muted text-xs mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Deal-breakers */}
        <div>
          <label className="block text-sm font-semibold text-navy mb-1">
            What would ruin this trip? <span className="text-ink-muted font-normal">(optional)</span>
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Being stuck at a resort with nothing to do. Long drives between activities."
            value={dealBreakers}
            onChange={(e) => setDealBreakers(e.target.value)}
            className="w-full bg-white border-2 border-cream-dark rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-coral placeholder-ink-muted transition-colors resize-none"
          />
          <p className="text-xs text-ink-muted mt-1.5">
            Helps us build an itinerary that avoids your specific frustrations.
          </p>
        </div>

        {/* Dietary restrictions */}
        <div className="card p-5">
          <label className="block text-sm font-semibold text-navy mb-1">
            Dietary restrictions
          </label>
          <p className="text-xs text-ink-muted mb-3">
            Affects restaurant recommendations and packing list. Select all that apply.
          </p>
          <div className="flex flex-wrap gap-2">
            {DIETARY_CHIPS.map((chip) => {
              const isSelected =
                chip === 'None'
                  ? dietaryRestrictions.length === 0
                  : dietaryRestrictions.includes(chip);
              return (
                <button
                  key={chip}
                  onClick={() => toggleDietary(chip)}
                  className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                    isSelected
                      ? 'border-coral bg-coral-light text-coral'
                      : 'border-cream-dark bg-white text-ink-muted hover:border-coral/40'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
            canSubmit && !submitting
              ? 'bg-coral hover:bg-coral-dark text-white shadow-lg shadow-coral/20'
              : 'bg-cream-dark text-ink-muted cursor-not-allowed'
          }`}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⟳</span> Building your plan...
            </span>
          ) : (
            `Build my ${destinationName.trim() || 'trip'} plan →`
          )}
        </button>

        {!canSubmit && (
          <p className="text-center text-xs text-ink-muted -mt-4">
            Fill in destination and where you&apos;re flying from to continue
          </p>
        )}

      </div>
    </div>
  );
}
