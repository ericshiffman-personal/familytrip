'use client';

import { motion } from 'framer-motion';
import { VibeSelections } from '@/types';

type VibeOption = {
  value: string;
  label: string;
  emoji: string;
  gradient: string;
  desc: string;
};

interface VibePair {
  key: keyof VibeSelections;
  question: string;
  // Standard binary pair — exactly two options rendered side by side
  left?: VibeOption;
  right?: VibeOption;
  // Multi-option grid — overrides left/right when present, wraps into 2×N grid
  options?: VibeOption[];
}

const VIBE_PAIRS: VibePair[] = [
  {
    key: 'environment',
    question: 'What calls to you?',
    left: {
      value: 'beach',
      label: 'Beach & Water',
      emoji: '🌊',
      gradient: 'from-cyan-400 to-blue-500',
      desc: 'Sand, waves, and long lazy beach days',
    },
    right: {
      value: 'mountains',
      label: 'Mountains & Hiking',
      emoji: '🏔️',
      gradient: 'from-green-400 to-emerald-600',
      desc: 'Fresh air, trails, and stunning views',
    },
  },
  {
    key: 'pace',
    question: 'What does your ideal day look like?',
    left: {
      value: 'relaxed',
      label: 'Slow & Relaxed',
      emoji: '☀️',
      gradient: 'from-yellow-400 to-orange-400',
      desc: 'Pool time, naps, no agenda. Pure decompression.',
    },
    right: {
      value: 'adventure',
      label: 'Packed with Adventures',
      emoji: '🎒',
      gradient: 'from-purple-400 to-indigo-500',
      desc: 'New experiences every day, kids go to bed exhausted',
    },
  },
  {
    key: 'transport',
    question: 'How do you want to get there?',
    left: {
      value: 'fly',
      label: 'Fly Somewhere New',
      emoji: '✈️',
      gradient: 'from-sky-400 to-blue-600',
      desc: 'Boarding passes and a real sense of arrival',
    },
    right: {
      value: 'drive',
      label: 'Epic Road Trip',
      emoji: '🚗',
      gradient: 'from-amber-400 to-orange-500',
      desc: 'Windows down, snacks packed, no checked bags',
    },
  },
  {
    key: 'geography',
    question: 'How far do you want to go?',
    left: {
      value: 'international',
      label: 'International Adventure',
      emoji: '🌍',
      gradient: 'from-teal-400 to-cyan-600',
      desc: 'New languages, food, and culture',
    },
    right: {
      value: 'domestic',
      label: 'Best of the US',
      emoji: '🇺🇸',
      gradient: 'from-red-400 to-rose-500',
      desc: 'No passports, easy logistics, still incredible',
    },
  },
  {
    key: 'accommodation',
    question: 'Where do you want to stay?',
    options: [
      {
        value: 'allinclusive',
        label: 'All-Inclusive Resort',
        emoji: '🍹',
        gradient: 'from-pink-400 to-rose-500',
        desc: 'One price covers everything — beach, pool, food, and kids\' activities sorted',
      },
      {
        value: 'hotel',
        label: 'Hotel or Resort',
        emoji: '🏨',
        gradient: 'from-sky-400 to-blue-500',
        desc: 'Reliable service, daily housekeeping. Classic hotel life without the all-in package',
      },
      {
        value: 'rental',
        label: 'Vacation Rental',
        emoji: '🏠',
        gradient: 'from-lime-400 to-green-500',
        desc: 'Kitchen, space, real neighborhood. We live like locals',
      },
      {
        value: 'any',
        label: 'No Strong Preference',
        emoji: '✨',
        gradient: 'from-violet-400 to-purple-500',
        desc: 'We care more about the destination. Whatever fits best for this trip',
      },
    ],
  },
];

interface VibeCardsProps {
  selections: VibeSelections;
  onChange: (selections: VibeSelections) => void;
}

export default function VibeCards({ selections, onChange }: VibeCardsProps) {
  const answeredCount = Object.keys(selections).length;
  const totalPairs = VIBE_PAIRS.length;

  const handleSelect = (key: keyof VibeSelections, value: string) => {
    onChange({ ...selections, [key]: value as VibeSelections[typeof key] });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold text-navy mb-2">What&apos;s your vibe?</h2>
        <p className="text-ink-muted text-sm">
          Pick your instinct, no overthinking. ({answeredCount}/{totalPairs} answered)
        </p>
      </div>

      {VIBE_PAIRS.map((pair, pairIdx) => {
        const selected = selections[pair.key];
        // Unify: multi-option pairs use `options`, binary pairs use left + right
        const optionList: VibeOption[] = pair.options ?? [pair.left!, pair.right!];

        return (
          <motion.div
            key={pair.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: pairIdx * 0.08 }}
          >
            <p className="text-xs font-semibold text-ink-muted mb-3 text-center uppercase tracking-widest">
              {pair.question}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {optionList.map((option) => {
                const isSelected = selected === option.value;
                const isOtherSelected = selected && selected !== option.value;
                return (
                  <motion.button
                    key={option.value}
                    onClick={() => handleSelect(pair.key, option.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={`
                      relative rounded-2xl overflow-hidden text-left transition-all duration-200 cursor-pointer
                      ${isSelected ? 'ring-4 ring-white shadow-xl' : 'shadow-sm'}
                      ${isOtherSelected ? 'opacity-40' : 'opacity-100'}
                    `}
                  >
                    <div className={`bg-gradient-to-br ${option.gradient} p-5 md:p-6`}>
                      <div className="text-3xl md:text-4xl mb-2">{option.emoji}</div>
                      <div className="text-white font-bold text-base md:text-lg leading-tight mb-1">
                        {option.label}
                      </div>
                      <div className="text-white/75 text-xs md:text-sm leading-relaxed">
                        {option.desc}
                      </div>
                    </div>

                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3 bg-white rounded-full w-7 h-7 flex items-center justify-center shadow-md"
                      >
                        <span className="text-coral text-sm font-bold">✓</span>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        );
      })}

      {answeredCount < totalPairs && (
        <p className="text-center text-ink-muted text-sm">
          {totalPairs - answeredCount} more {totalPairs - answeredCount === 1 ? 'choice' : 'choices'} to go
        </p>
      )}
    </div>
  );
}
