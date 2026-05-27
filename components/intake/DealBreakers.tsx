'use client';

interface DealBreakersProps {
  dealBreakers: string;
  previousBadExperience: string;
  onDealBreakersChange: (value: string) => void;
  onPreviousBadExperienceChange: (value: string) => void;
}

const EXAMPLES = [
  "No 10+ hour flights with our toddler",
  "Must have a calm beach — no strong waves",
  "Can't be humid in July",
  "Need to be able to loop back to the car for snacks",
  "No crowds or tourist traps",
  "Needs a pool — kids won't do beaches all day",
];

export default function DealBreakers({
  dealBreakers,
  previousBadExperience,
  onDealBreakersChange,
  onPreviousBadExperienceChange,
}: DealBreakersProps) {
  const tapExample = (ex: string) => {
    const current = dealBreakers.trim();
    onDealBreakersChange(current ? `${current}. ${ex}` : ex);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-deep mb-2">The important stuff</h2>
        <p className="text-deep/50 text-sm">
          This is our most important question. Be specific.
        </p>
      </div>

      {/* Deal breaker */}
      <div className="bg-white rounded-2xl p-6 border border-sand-dark">
        <label className="block text-sm font-bold text-deep mb-1">
          What would ruin this trip? *
        </label>
        <p className="text-xs text-deep/45 mb-3">
          Think about: flight length, weather, crowds, activities, mobility, noise, bugs...
          whatever gives you that &quot;oh no&quot; feeling.
        </p>
        <textarea
          value={dealBreakers}
          onChange={(e) => onDealBreakersChange(e.target.value)}
          placeholder="e.g. Being stuck at a resort with nothing to do, or a 12-hour flight with our 2-year-old..."
          rows={4}
          className="w-full bg-sand border border-sand-dark rounded-xl px-4 py-3 text-sm text-deep focus:outline-none focus:border-coral resize-none placeholder-deep/30 transition-colors"
        />

        {/* Tap-to-add examples */}
        <div className="mt-3">
          <p className="text-xs text-deep/40 mb-2">Common ones (tap to add):</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => tapExample(ex)}
                className="text-xs bg-sand-dark hover:bg-coral-light hover:text-coral text-deep/60 px-3 py-1.5 rounded-full transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Previous bad experience — collapsible / optional */}
      <div className="bg-white rounded-2xl p-6 border border-sand-dark">
        <label className="block text-sm font-bold text-deep mb-1">
          What went wrong on a past trip? <span className="font-normal text-deep/40">(optional)</span>
        </label>
        <p className="text-xs text-deep/45 mb-3">
          Our most overplanners find this helps. We&apos;ll make sure we don&apos;t repeat it.
        </p>
        <textarea
          value={previousBadExperience}
          onChange={(e) => onPreviousBadExperienceChange(e.target.value)}
          placeholder="e.g. We went to Cancun and the beach was beautiful but there was nothing for the kids to do beyond the pool. Got boring by day 3..."
          rows={3}
          className="w-full bg-sand border border-sand-dark rounded-xl px-4 py-3 text-sm text-deep focus:outline-none focus:border-coral resize-none placeholder-deep/30 transition-colors"
        />
      </div>

      <div className="bg-coral-light rounded-2xl p-4 border border-coral/20 flex gap-3">
        <span className="text-xl">✨</span>
        <p className="text-sm text-deep/70">
          <strong className="text-deep">Almost there.</strong> After you hit submit, we&apos;ll take everything you&apos;ve
          told us and come back with two confident recommendations — not a list of 40 options.
        </p>
      </div>
    </div>
  );
}
