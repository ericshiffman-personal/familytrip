'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { WordmarkLogo } from '@/components/shared/Logo';
import { TripInputs, VibeSelections, Child } from '@/types';
import { saveTripInputs, saveProfile } from '@/lib/profile';
import ProgressSteps from '@/components/shared/ProgressSteps';
import VibeCards from '@/components/intake/VibeCards';
import FamilyForm from '@/components/intake/FamilyForm';
import TripDetails from '@/components/intake/TripDetails';
import DealBreakers from '@/components/intake/DealBreakers';

const STEP_LABELS = ['Your Vibe', 'Your Family', 'Trip Details', 'Final Touches'];
const TOTAL_STEPS = 4;

const defaultInputs: TripInputs = {
  vibes: {},
  adults: 2,
  children: [],
  napRequired: false,
  napSchedule: '',
  duration: '5-7 days',
  budget: 'comfortable',
  departureCity: '',
  travelMethod: 'either',
  travelMonth: '',
  dealBreakers: '',
  previousBadExperience: '',
  dietaryRestrictions: [],
};

export default function PlanPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [inputs, setInputs] = useState<TripInputs>(defaultInputs);
  const [loading, setLoading] = useState(false);

  const canAdvance = () => {
    if (step === 1) return Object.keys(inputs.vibes).length >= 3;
    if (step === 2) return true;
    if (step === 3) return inputs.departureCity.trim().length > 1;
    if (step === 4) return inputs.dealBreakers.trim().length > 5;
    return false;
  };

  const goNext = async () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setLoading(true);
      saveTripInputs(inputs);
      saveProfile(inputs);
      router.push('/results');
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-cream-dark px-6 py-4 sticky top-0 z-40">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href="/">
            <WordmarkLogo height={38} />
          </Link>
          <span className="text-sm text-ink-muted">
            Step {step} of {TOTAL_STEPS}
          </span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-8">
        <ProgressSteps currentStep={step} totalSteps={TOTAL_STEPS} labels={STEP_LABELS} />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {step === 1 && (
              <VibeCards
                selections={inputs.vibes}
                onChange={(vibes: VibeSelections) => setInputs({ ...inputs, vibes })}
              />
            )}

            {step === 2 && (
              <FamilyForm
                adults={inputs.adults}
                children={inputs.children}
                napRequired={inputs.napRequired}
                napSchedule={inputs.napSchedule || ''}
                napDetails={inputs.napDetails}
                dietaryRestrictions={inputs.dietaryRestrictions}
                onAdultsChange={(adults) => setInputs({ ...inputs, adults })}
                onChildrenChange={(children: Child[]) => setInputs({ ...inputs, children })}
                onNapChange={(required, schedule, napDetails) =>
                  setInputs({ ...inputs, napRequired: required, napSchedule: schedule || '', napDetails })
                }
                onDietaryChange={(dietaryRestrictions) => setInputs({ ...inputs, dietaryRestrictions })}
              />
            )}

            {step === 3 && (
              <TripDetails
                values={{
                  duration: inputs.duration,
                  budget: inputs.budget,
                  departureCity: inputs.departureCity,
                  travelMethod: inputs.travelMethod,
                  directFlightsOnly: inputs.directFlightsOnly,
                  travelMonth: inputs.travelMonth || '',
                }}
                onChange={(vals) => setInputs({ ...inputs, ...vals })}
              />
            )}

            {step === 4 && (
              <DealBreakers
                dealBreakers={inputs.dealBreakers}
                previousBadExperience={inputs.previousBadExperience || ''}
                vibes={inputs.vibes}
                onDealBreakersChange={(v) => setInputs({ ...inputs, dealBreakers: v })}
                onPreviousBadExperienceChange={(v) =>
                  setInputs({ ...inputs, previousBadExperience: v })
                }
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 mt-10 pb-10">
          {step > 1 && (
            <button
              onClick={goBack}
              className="px-6 py-3 rounded-xl border-2 border-cream-dark text-ink font-medium hover:border-navy/30 transition-colors"
            >
              ← Back
            </button>
          )}

          <button
            onClick={goNext}
            disabled={!canAdvance() || loading}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold text-base transition-all ${
              canAdvance() && !loading
                ? 'bg-coral hover:bg-coral-dark text-white shadow-lg shadow-coral/20'
                : 'bg-cream-dark text-ink-muted cursor-not-allowed'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⟳</span> Getting your recommendations...
              </span>
            ) : step === TOTAL_STEPS ? (
              'Find our destination →'
            ) : (
              'Continue →'
            )}
          </button>
        </div>

        {step === 1 && Object.keys(inputs.vibes).length < 3 && (
          <p className="text-center text-xs text-ink-muted -mt-6 pb-6">
            Answer at least 3 pairs to continue
          </p>
        )}
      </div>
    </div>
  );
}
