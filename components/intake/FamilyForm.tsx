'use client';

import { Child } from '@/types';

interface FamilyFormProps {
  adults: number;
  children: Child[];
  napRequired: boolean;
  napSchedule: string;
  onAdultsChange: (n: number) => void;
  onChildrenChange: (children: Child[]) => void;
  onNapChange: (required: boolean, schedule?: string) => void;
}

export default function FamilyForm({
  adults,
  children,
  napRequired,
  napSchedule,
  onAdultsChange,
  onChildrenChange,
  onNapChange,
}: FamilyFormProps) {
  const hasToddler = children.some((c) => c.age <= 3);

  const addChild = () => {
    onChildrenChange([...children, { age: 3 }]);
  };

  const removeChild = (idx: number) => {
    onChildrenChange(children.filter((_, i) => i !== idx));
  };

  const updateChildAge = (idx: number, age: number) => {
    const updated = children.map((c, i) => (i === idx ? { ...c, age } : c));
    onChildrenChange(updated);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-navy mb-2">Tell us about your family</h2>
        <p className="text-ink-muted text-sm">Who&apos;s coming on this trip?</p>
      </div>

      {/* Adults */}
      <div className="card p-6">
        <label className="block text-sm font-semibold text-navy mb-4">
          Adults traveling
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onAdultsChange(Math.max(1, adults - 1))}
            className="w-10 h-10 rounded-full border-2 border-cream-dark text-ink font-bold hover:border-coral hover:text-coral transition-colors text-lg"
          >
            −
          </button>
          <span className="text-2xl font-bold text-navy w-8 text-center">{adults}</span>
          <button
            onClick={() => onAdultsChange(Math.min(8, adults + 1))}
            className="w-10 h-10 rounded-full border-2 border-cream-dark text-ink font-bold hover:border-coral hover:text-coral transition-colors text-lg"
          >
            +
          </button>
          <span className="text-ink-muted text-sm ml-2">
            {adults === 1 ? 'adult' : 'adults'}
          </span>
        </div>
      </div>

      {/* Children */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-navy">
            Kids coming along
          </label>
          <button
            onClick={addChild}
            className="text-sm font-medium text-coral hover:text-coral-dark transition-colors flex items-center gap-1"
          >
            + Add a child
          </button>
        </div>

        {children.length === 0 ? (
          <p className="text-ink-muted text-sm italic">No children added yet — tap &quot;Add a child&quot; above</p>
        ) : (
          <div className="space-y-3">
            {children.map((child, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-lg">
                  {child.age <= 1 ? '👶' : child.age <= 4 ? '🧒' : child.age <= 9 ? '🧑' : '👦'}
                </span>
                <div className="flex-1">
                  <label className="text-xs text-ink-muted mb-1 block">
                    Child {idx + 1} age
                  </label>
                  <select
                    value={child.age}
                    onChange={(e) => updateChildAge(idx, parseInt(e.target.value))}
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
                  className="text-ink-muted hover:text-ink transition-colors text-xl leading-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nap schedule — only show if toddler detected */}
      {(hasToddler || napRequired) && (
        <div className="bg-navy-light rounded-2xl p-6 border border-navy/10">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-xl">😴</span>
            <div>
              <p className="font-semibold text-navy text-sm">Nap schedule check</p>
              <p className="text-ink-soft text-xs mt-0.5">
                We noticed you have a little one. Does anyone still need a regular nap?
              </p>
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            {[
              { label: 'Yes, naps are non-negotiable', value: true },
              { label: "Nah, we're flexible", value: false },
            ].map((opt) => (
              <button
                key={String(opt.value)}
                onClick={() => onNapChange(opt.value)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium border-2 transition-all ${
                  napRequired === opt.value
                    ? 'border-navy bg-navy text-white'
                    : 'border-cream-dark bg-white text-ink hover:border-navy/40'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {napRequired && (
            <div>
              <label className="text-xs font-medium text-ink-muted mb-1.5 block">
                Typical nap window (optional — helps us plan the itinerary)
              </label>
              <input
                type="text"
                placeholder="e.g. 1:00pm – 3:00pm"
                value={napSchedule}
                onChange={(e) => onNapChange(true, e.target.value)}
                className="w-full bg-white border border-cream-dark rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-navy placeholder-ink-muted"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
