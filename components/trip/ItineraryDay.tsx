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
      className="card overflow-hidden"
    >
      {/* Day header */}
      <div className="bg-navy px-5 py-3 flex items-center justify-between">
        <span className="text-white font-bold text-sm">Day {day.day}</span>
        <span className="text-white/60 text-sm font-medium">{day.title}</span>
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
              <div className="flex-1 w-px bg-cream-dark min-h-4" />
            </div>
            <div className="pb-2">
              <p className="text-xs font-bold text-ink-muted uppercase tracking-wide mb-1">
                {label}
              </p>
              <p className="text-sm text-ink-soft leading-relaxed">{content}</p>
            </div>
          </div>
        ))}

        {day.napNote && (
          <div className="bg-navy-light rounded-xl px-4 py-3 flex gap-2 items-start">
            <span>😴</span>
            <p className="text-sm text-navy leading-relaxed">{day.napNote}</p>
          </div>
        )}

        {day.tip && (
          <div className="bg-coral-light rounded-xl px-4 py-3 flex gap-2 items-start border-l-4 border-coral">
            <span>💡</span>
            <p className="text-sm text-ink-soft leading-relaxed">{day.tip}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
