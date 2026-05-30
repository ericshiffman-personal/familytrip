'use client';

import { TripInputs } from '@/types';

type TripDetailsFields = Pick<TripInputs, 'duration' | 'budget' | 'departureCity' | 'travelMethod' | 'directFlightsOnly' | 'travelMonth'>;

interface TripDetailsProps {
  values: TripDetailsFields;
  onChange: (values: TripDetailsFields) => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
];

export default function TripDetails({ values, onChange }: TripDetailsProps) {
  const update = <K extends keyof TripDetailsFields>(key: K, value: TripDetailsFields[K]) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-navy mb-2">Trip details</h2>
        <p className="text-ink-muted text-sm">A few logistics to narrow things down</p>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-semibold text-navy mb-3">
          How long is the trip?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { value: '3-4 days', label: '3–4 days', desc: 'Long weekend' },
              { value: '5-7 days', label: '5–7 days', desc: 'One week' },
              { value: '8-10 days', label: '8–10 days', desc: 'Extended week' },
              { value: '10+ days', label: '10+ days', desc: 'Big trip' },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              onClick={() => update('duration', opt.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                values.duration === opt.value
                  ? 'border-coral bg-coral-light'
                  : 'border-cream-dark bg-white hover:border-coral/40'
              }`}
            >
              <div className={`font-bold text-sm ${values.duration === opt.value ? 'text-coral' : 'text-navy'}`}>
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
          When are you thinking of going?
        </label>
        <p className="text-xs text-ink-muted mb-3">
          Helps us flag weather, peak pricing, hurricane season, and school-holiday crowds.
        </p>
        <div className="grid grid-cols-4 gap-2 mb-2">
          {MONTHS.map((month) => (
            <button
              key={month}
              onClick={() => update('travelMonth', values.travelMonth === month ? '' : month)}
              className={`py-2.5 rounded-xl border-2 text-center transition-all text-sm ${
                values.travelMonth === month
                  ? 'border-coral bg-coral-light font-semibold text-coral'
                  : 'border-cream-dark bg-white hover:border-coral/40 text-navy'
              }`}
            >
              {month.slice(0, 3)}
            </button>
          ))}
        </div>
        <button
          onClick={() => update('travelMonth', values.travelMonth === 'Flexible' ? '' : 'Flexible')}
          className={`w-full py-2.5 rounded-xl border-2 text-center transition-all text-sm ${
            values.travelMonth === 'Flexible'
              ? 'border-coral bg-coral-light font-semibold text-coral'
              : 'border-cream-dark bg-white hover:border-coral/40 text-ink-muted'
          }`}
        >
          Flexible / not sure yet
        </button>
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-semibold text-navy mb-3">
          How does budget feel?
        </label>
        <div className="space-y-2">
          {(
            [
              {
                value: 'budget',
                label: 'Watching it carefully',
                emoji: '🙏',
                desc: 'Value matters. We want great for less.',
              },
              {
                value: 'comfortable',
                label: 'Comfortable spending',
                emoji: '✌️',
                desc: "We're not counting every dollar, but we're not reckless.",
              },
              {
                value: 'splurge',
                label: "Let's splurge",
                emoji: '🥂',
                desc: 'This trip matters. We want the best experience.',
              },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              onClick={() => update('budget', opt.value)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                values.budget === opt.value
                  ? 'border-coral bg-coral-light'
                  : 'border-cream-dark bg-white hover:border-coral/40'
              }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <div>
                <div className={`font-semibold text-sm ${values.budget === opt.value ? 'text-coral' : 'text-navy'}`}>
                  {opt.label}
                </div>
                <div className="text-ink-muted text-xs mt-0.5">{opt.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Departure city */}
      <div>
        <label className="block text-sm font-semibold text-navy mb-2">
          Where are you flying (or driving) from?
        </label>
        <input
          type="text"
          placeholder="e.g. Denver, Chicago, Los Angeles..."
          value={values.departureCity}
          onChange={(e) => update('departureCity', e.target.value)}
          className="w-full bg-white border-2 border-cream-dark rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-coral placeholder-ink-muted transition-colors"
        />
        <p className="text-xs text-ink-muted mt-1.5">
          This helps us filter by flight time. A 12-hour flight with a toddler is a different trip.
        </p>
      </div>

      {/* Travel method */}
      <div>
        <label className="block text-sm font-semibold text-navy mb-3">
          How do you want to travel?
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { value: 'fly', label: 'Fly', emoji: '✈️' },
              { value: 'drive', label: 'Drive', emoji: '🚗' },
              { value: 'either', label: 'Either', emoji: '🤷' },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              onClick={() => update('travelMethod', opt.value)}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                values.travelMethod === opt.value
                  ? 'border-coral bg-coral-light'
                  : 'border-cream-dark bg-white hover:border-coral/40'
              }`}
            >
              <div className="text-2xl mb-1">{opt.emoji}</div>
              <div className={`text-sm font-semibold ${values.travelMethod === opt.value ? 'text-coral' : 'text-navy'}`}>
                {opt.label}
              </div>
            </button>
          ))}
        </div>

        {/* Direct flights toggle — only relevant when flying */}
        {(values.travelMethod === 'fly' || values.travelMethod === 'either') && (
          <div className="mt-3 flex gap-2">
            {[
              { value: true,  label: 'Direct flights only',     desc: 'Non-stop or we\'re not going' },
              { value: false, label: 'Connections are fine',    desc: 'We\'ll deal with a layover'   },
            ].map((opt) => (
              <button
                key={String(opt.value)}
                onClick={() => update('directFlightsOnly', opt.value)}
                className={`flex-1 p-3 rounded-xl border-2 text-left transition-all ${
                  values.directFlightsOnly === opt.value
                    ? 'border-coral bg-coral-light'
                    : 'border-cream-dark bg-white hover:border-coral/40'
                }`}
              >
                <div className={`font-semibold text-xs ${values.directFlightsOnly === opt.value ? 'text-coral' : 'text-navy'}`}>
                  {opt.label}
                </div>
                <div className="text-ink-muted text-xs mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
