'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  'Mapping out your days…',
  'Picking morning activities the kids will love…',
  'Finding the best local spots…',
  'Planning afternoon adventures…',
  'Scouting hidden gems worth the detour…',
  'Lining up your evenings…',
  'Adding the details that make a trip…',
  'Reviewing the full plan…',
];

interface ItineraryLoadingProps {
  destination: string;
  duration: string;
}

export default function ItineraryLoading({ destination, duration }: ItineraryLoadingProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  // Progress: advances one tick per step, capped at ~85% so it never "completes" early
  const progressPct = Math.min((stepIndex / (STEPS.length - 1)) * 85, 85);

  return (
    <div className="flex flex-col items-center text-center py-16 px-6">
      {/* Animated dots */}
      <div className="flex gap-2 mb-8">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block w-2 h-2 rounded-full bg-coral"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.25,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Headline */}
      <p className="font-display text-navy text-xl font-bold mb-1">
        Building your trip to {destination}
      </p>
      <p className="text-ink-muted text-sm mb-8">{duration} itinerary · usually ready in 15–25 seconds</p>

      {/* Cycling step message */}
      <div className="h-6 mb-8 flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
          <motion.p
            key={stepIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="text-ink-muted text-sm"
          >
            {STEPS[stepIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs h-1 bg-cream-dark rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-coral rounded-full"
          initial={{ width: '4%' }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 2.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
