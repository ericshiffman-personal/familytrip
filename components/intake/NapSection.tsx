'use client';

import { NapDetails } from '@/types';

interface NapSectionProps {
  napRequired: boolean;
  napSchedule: string;
  napDetails?: NapDetails;
  /** True if any child in the party is age 2 or under */
  hasInfant: boolean;
  onChange: (required: boolean, schedule?: string, napDetails?: NapDetails) => void;
}

const EMPTY_NAP_WINDOW = { approxTime: '', strollerOk: false };

export default function NapSection({
  napRequired,
  napSchedule,
  napDetails,
  hasInfant,
  onChange,
}: NapSectionProps) {

  const handleRequiredChange = (required: boolean) => {
    if (!required) {
      onChange(false, undefined, undefined);
      return;
    }
    // Initialise with sensible defaults when user flips to "yes"
    if (hasInfant) {
      onChange(true, undefined, { count: 1, naps: [{ ...EMPTY_NAP_WINDOW }] });
    } else {
      onChange(true, napSchedule);
    }
  };

  const handleNapCount = (count: 1 | 2) => {
    const existing = napDetails?.naps ?? [];
    const naps =
      count === 2
        ? [existing[0] ?? { ...EMPTY_NAP_WINDOW }, existing[1] ?? { ...EMPTY_NAP_WINDOW }]
        : [existing[0] ?? { ...EMPTY_NAP_WINDOW }];
    onChange(true, undefined, { count, naps });
  };

  const updateNapWindow = (idx: number, patch: Partial<{ approxTime: string; strollerOk: boolean }>) => {
    if (!napDetails) return;
    const naps = napDetails.naps.map((n, i) => (i === idx ? { ...n, ...patch } : n));
    onChange(true, undefined, { ...napDetails, naps });
  };

  return (
    <div className="bg-navy-light rounded-2xl p-6 border border-navy/10">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <span className="text-xl">😴</span>
        <div>
          <p className="font-semibold text-navy text-sm">Nap schedule check</p>
          <p className="text-ink-soft text-xs mt-0.5">
            {hasInfant
              ? 'Nap logistics make or break a trip with a little one. Be specific and we\'ll plan around it.'
              : 'Does anyone still need a regular nap?'}
          </p>
        </div>
      </div>

      {/* Yes / No */}
      <div className="flex gap-3 mb-4">
        {[
          { label: 'Yes, naps are non-negotiable', value: true },
          { label: "Nah, we're flexible", value: false },
        ].map((opt) => (
          <button
            key={String(opt.value)}
            onClick={() => handleRequiredChange(opt.value)}
            className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium border-2 transition-all ${
              napRequired === opt.value
                ? 'border-navy bg-navy text-white'
                : 'border-cream-dark bg-white text-ink hover:border-navy/40'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* ── Enhanced UI for infants (age ≤ 2) ── */}
      {napRequired && hasInfant && napDetails && (
        <div className="space-y-4 pt-1">

          {/* Nap count */}
          <div>
            <p className="text-xs font-semibold text-navy mb-2">How many naps per day?</p>
            <div className="flex gap-2">
              {([1, 2] as const).map((count) => (
                <button
                  key={count}
                  onClick={() => handleNapCount(count)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                    napDetails.count === count
                      ? 'border-navy bg-navy text-white'
                      : 'border-cream-dark bg-white text-ink hover:border-navy/40'
                  }`}
                >
                  {count === 1 ? '1 nap / day' : '2 naps / day'}
                </button>
              ))}
            </div>
          </div>

          {/* Per-nap windows */}
          {napDetails.naps.map((nap, i) => {
            const label =
              napDetails.count === 2 ? (i === 0 ? 'Morning nap' : 'Afternoon nap') : 'Nap window';
            const placeholder = i === 0 ? 'e.g. 9:00–10:30am' : 'e.g. 1:00–3:00pm';

            return (
              <div key={i} className="bg-white rounded-xl p-4 border border-cream-dark space-y-3">
                <p className="text-xs font-bold text-navy uppercase tracking-wide">{label}</p>

                {/* Time */}
                <div>
                  <label className="text-xs text-ink-muted mb-1 block">Approximate time</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={nap.approxTime}
                    onChange={(e) => updateNapWindow(i, { approxTime: e.target.value })}
                    className="w-full bg-cream border border-cream-dark rounded-xl px-3 py-2 text-sm text-ink focus:outline-none focus:border-navy placeholder-ink-muted"
                  />
                </div>

                {/* Stroller */}
                <div>
                  <p className="text-xs text-ink-muted mb-2">Can this be a stroller or carrier nap?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateNapWindow(i, { strollerOk: true })}
                      className={`flex-1 py-2 text-xs rounded-xl border-2 transition-all ${
                        nap.strollerOk
                          ? 'border-navy bg-navy text-white font-medium'
                          : 'border-cream-dark bg-white text-ink hover:border-navy/40'
                      }`}
                    >
                      ✓ Stroller works
                    </button>
                    <button
                      onClick={() => updateNapWindow(i, { strollerOk: false })}
                      className={`flex-1 py-2 text-xs rounded-xl border-2 transition-all ${
                        !nap.strollerOk
                          ? 'border-navy bg-navy text-white font-medium'
                          : 'border-cream-dark bg-white text-ink hover:border-navy/40'
                      }`}
                    >
                      ✗ Needs a crib
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Simple UI for older nappers (age 3–5) ── */}
      {napRequired && !hasInfant && (
        <div className="pt-1">
          <label className="text-xs font-medium text-ink-muted mb-1.5 block">
            Typical nap window <span className="font-normal">(optional, helps us plan the itinerary)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. 1:00pm – 3:00pm"
            value={napSchedule}
            onChange={(e) => onChange(true, e.target.value)}
            className="w-full bg-white border border-cream-dark rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-navy placeholder-ink-muted"
          />
        </div>
      )}
    </div>
  );
}
