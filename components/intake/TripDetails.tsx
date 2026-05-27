'use client';

import { TripInputs } from '@/types';

type TripDetailsFields = Pick<TripInputs, 'duration' | 'budget' | 'departureCity' | 'travelMethod'>;

interface TripDetailsProps {
  values: TripDetailsFields;
  onChange: (values: TripDetailsFields) => void;
}

export default function TripDetails({ values, onChange }: TripDetailsProps) {
  const update = <K extends keyof TripDetailsFields>(key: K, value: TripDetailsFields[K]) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-deep mb-2">Trip details</h2>
        <p className="text-deep/50 text-sm">A few logistics to narrow things down</p>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-semibold text-deep mb-3">
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
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                values.duration === opt.value
                  ? 'border-coral bg-coral-light'
                  : 'border-sand-dark bg-white hover:border-coral/40'
              }`}
            >
              <div className={`font-bold text-sm ${values.duration === opt.value ? 'text-coral' : 'text-deep'}`}>
                {opt.label}
              </div>
              <div className="text-deep/40 text-xs mt-0.5">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-semibold text-deep mb-3">
          How does budget feel?
        </label>
        <div className="space-y-2">
          {(
            [
              {
                value: 'budget',
                label: "Watching it carefully",
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
                desc: 'This trip matters — we want the best experience.',
              },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              onClick={() => update('budget', opt.value)}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                values.budget === opt.value
                  ? 'border-coral bg-coral-light'
                  : 'border-sand-dark bg-white hover:border-coral/40'
              }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <div>
                <div className={`font-semibold text-sm ${values.budget === opt.value ? 'text-coral' : 'text-deep'}`}>
                  {opt.label}
                </div>
                <div className="text-deep/45 text-xs mt-0.5">{opt.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Departure city */}
      <div>
        <label className="block text-sm font-semibold text-deep mb-2">
          Where are you flying (or driving) from?
        </label>
        <input
          type="text"
          placeholder="e.g. Denver, Chicago, Los Angeles..."
          value={values.departureCity}
          onChange={(e) => update('departureCity', e.target.value)}
          className="w-full bg-white border-2 border-sand-dark rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-coral placeholder-deep/30 transition-colors"
        />
        <p className="text-xs text-deep/40 mt-1.5">
          This helps us filter by flight time — a 12-hour flight with a toddler is a different trip.
        </p>
      </div>

      {/* Travel method */}
      <div>
        <label className="block text-sm font-semibold text-deep mb-3">
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
              className={`p-4 rounded-2xl border-2 text-center transition-all ${
                values.travelMethod === opt.value
                  ? 'border-coral bg-coral-light'
                  : 'border-sand-dark bg-white hover:border-coral/40'
              }`}
            >
              <div className="text-2xl mb-1">{opt.emoji}</div>
              <div className={`text-sm font-semibold ${values.travelMethod === opt.value ? 'text-coral' : 'text-deep'}`}>
                {opt.label}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
