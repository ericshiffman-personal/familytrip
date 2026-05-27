'use client';

import { motion } from 'framer-motion';
import { ItineraryDay as ItineraryDayType } from '@/types';

interface ItineraryDayProps {
  day: ItineraryDayType;
  index: number;
}

export default function ItineraryDay({ day, index }: ItineraryDayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-white rounded-2xl overflow-hidden border border-sand-dark"
    >
      {/* Day header */}
      <div className="bg-deep px-5 py-3 flex items-center justify-between">
        <span className="text-white font-bold text-sm">Day {day.day}</span>
        <span className="text-white/60 text-sm">{day.title}</span>
      </div>

      <div className="p-5 space-y-4">
        {[
          { label: 'Morning', emoji: '🌅', content: day.morning },
          { label: 'Afternoon', emoji: '☀️', content: day.afternoon },
          { label: 'Evening', emoji: '🌆', content: day.evening },
        ].map(({ label, emoji, content }) => (
          <div key={label} className="flex gap-3">
            <div className="flex flex-col items-center gap-1 pt-0.5">
              <span className="text-lg">{emoji}</span>
              <div className="flex-1 w-px bg-sand-dark min-h-4" />
            </div>
            <div className="pb-2">
              <p className="text-xs font-bold text-deep/40 uppercase tracking-wide mb-1">
                {label}
              </p>
              <p className="text-sm text-deep/80 leading-relaxed">{content}</p>
            </div>
          </div>
        ))}

        {day.napNote && (
          <div className="bg-ocean-light rounded-xl px-4 py-3 flex gap-2 items-start">
            <span>😴</span>
            <p className="text-sm text-ocean-dark leading-relaxed">{day.napNote}</p>
          </div>
        )}

        {day.tip && (
          <div className="bg-coral-light rounded-xl px-4 py-3 flex gap-2 items-start">
            <span>💡</span>
            <p className="text-sm text-deep/70 leading-relaxed">{day.tip}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
