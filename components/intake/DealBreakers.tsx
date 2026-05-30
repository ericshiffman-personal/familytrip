'use client';

import { VibeSelections } from '@/types';

interface DealBreakersProps {
  dealBreakers: string;
  previousBadExperience: string;
  vibes: VibeSelections;
  onDealBreakersChange: (value: string) => void;
  onPreviousBadExperienceChange: (value: string) => void;
}

function getContextualExamples(vibes: VibeSelections): string[] {
  const examples: string[] = [];

  if (vibes.environment === 'beach') {
    examples.push("Must have a calm beach, no strong waves or riptides");
    examples.push("No seaweed or jellyfish problems");
    examples.push("Needs a pool as backup on rough beach days");
  } else if (vibes.environment === 'mountains') {
    examples.push("Trails must be manageable for young kids");
    examples.push("Need to be able to loop back to the car easily");
    examples.push("No exposed heights or dangerous cliff paths");
  } else {
    examples.push("Must have a calm beach, no strong waves");
    examples.push("Trails must be manageable for young kids");
  }

  if (vibes.transport === 'fly') {
    examples.push("No 10+ hour flights with our kids");
    examples.push("No more than one connection");
  } else if (vibes.transport === 'drive') {
    examples.push("Need to loop back to the car for snacks and supplies");
    examples.push("No more than 6 hours of driving total");
  } else {
    examples.push("No 10+ hour flights with our kids");
    examples.push("Need to loop back to the car for snacks");
  }

  if (vibes.pace === 'relaxed') {
    examples.push("No packed itineraries, we need breathing room");
    examples.push("Must have easy food options close by");
  } else if (vibes.pace === 'adventure') {
    examples.push("No resort-only trips with nothing to do nearby");
    examples.push("Needs variety, can't do the same thing two days in a row");
  }

  if (vibes.accommodation === 'allinclusive') {
    examples.push("No hidden costs or nickel-and-diming");
    examples.push("Must have a real kids' program or club");
  } else if (vibes.accommodation === 'rental') {
    examples.push("Must have a full kitchen, eating out every meal is too hard");
  }

  examples.push("No crowds or tourist traps");
  examples.push("Can't be oppressively hot/humid in summer");

  return [...new Set(examples)].slice(0, 7);
}

export default function DealBreakers({
  dealBreakers,
  previousBadExperience,
  vibes,
  onDealBreakersChange,
  onPreviousBadExperienceChange,
}: DealBreakersProps) {
  const examples = getContextualExamples(vibes);

  const tapExample = (ex: string) => {
    const current = dealBreakers.trim();
    onDealBreakersChange(current ? `${current}. ${ex}` : ex);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-navy mb-2">The important stuff</h2>
        <p className="text-ink-muted text-sm">
          This is our most important question. Be specific.
        </p>
      </div>

      {/* Deal breaker */}
      <div className="card p-6">
        <label className="block text-sm font-bold text-navy mb-1">
          What would ruin this trip? *
        </label>
        <p className="text-xs text-ink-muted mb-3">
          Think about: flight length, weather, crowds, activities, mobility, noise, bugs —
          whatever gives you that &quot;oh no&quot; feeling.
        </p>
        <textarea
          value={dealBreakers}
          onChange={(e) => onDealBreakersChange(e.target.value)}
          placeholder="e.g. Being stuck at a resort with nothing to do, or a 12-hour flight with our 2-year-old..."
          rows={4}
          className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-coral resize-none placeholder-ink-muted transition-colors"
        />

        <div className="mt-3">
          <p className="text-xs text-ink-muted mb-2">Based on your selections (tap to add):</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => tapExample(ex)}
                className="text-xs bg-cream-dark hover:bg-coral-light hover:text-coral text-ink-soft px-3 py-1.5 rounded-full transition-colors text-left"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Previous bad experience */}
      <div className="card p-6">
        <label className="block text-sm font-bold text-navy mb-1">
          What went wrong on a past trip?{' '}
          <span className="font-normal text-ink-muted">(optional)</span>
        </label>
        <p className="text-xs text-ink-muted mb-3">
          Our most useful input. We&apos;ll make sure we don&apos;t repeat it.
        </p>
        <textarea
          value={previousBadExperience}
          onChange={(e) => onPreviousBadExperienceChange(e.target.value)}
          placeholder="e.g. We went to Cancun and the beach was beautiful but there was nothing for the kids to do beyond the pool. Got boring by day 3..."
          rows={3}
          className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-coral resize-none placeholder-ink-muted transition-colors"
        />
      </div>

      <div className="bg-coral-light rounded-2xl p-4 border border-coral/20 flex gap-3">
        <span className="text-xl">✨</span>
        <p className="text-sm text-ink-soft">
          <strong className="text-navy">Almost there.</strong> After you hit submit, we&apos;ll take everything you&apos;ve
          told us and come back with two confident recommendations, not a list of 40 options.
        </p>
      </div>
    </div>
  );
}
