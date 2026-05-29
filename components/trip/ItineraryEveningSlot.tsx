'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SavedRestaurant } from '@/types';

interface ItineraryEveningSlotProps {
  dayNumber: number;
  eveningText: string;       // original Claude-generated fallback text
  savedRestaurant?: SavedRestaurant;
}

export default function ItineraryEveningSlot({
  eveningText,
  savedRestaurant,
}: ItineraryEveningSlotProps) {
  const [expanded, setExpanded] = useState(false);

  // No saved restaurant — render Claude's original text as-is
  if (!savedRestaurant) {
    return <p className="text-sm text-ink-soft leading-relaxed">{eveningText}</p>;
  }

  const r = savedRestaurant.restaurant;
  const isBooked = savedRestaurant.status === 'booked';
  const isConsidering = savedRestaurant.status === 'considering';

  const openMapsLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const query = encodeURIComponent(r.neighborhood);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const openTableUrl = `https://www.opentable.com/s?term=${encodeURIComponent(r.openTableQuery)}`;

  return (
    <div
      className={`rounded-xl border cursor-pointer transition-colors ${
        isBooked
          ? 'bg-white border-l-4 border-l-emerald-400 border-t-cream-dark border-r-cream-dark border-b-cream-dark'
          : isConsidering
          ? 'bg-white border-l-4 border-l-amber-400 border-t-cream-dark border-r-cream-dark border-b-cream-dark'
          : 'bg-white border-cream-dark'
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              {isBooked && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex-shrink-0">
                  ✓ Booked
                </span>
              )}
              {isConsidering && (
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex-shrink-0">
                  Considering
                </span>
              )}
              <span className="text-sm font-bold text-navy truncate">{r.name}</span>
              <span className="text-xs text-ink-muted flex-shrink-0">{r.priceRange}</span>
            </div>
            <p className="text-xs text-ink-muted">{r.cuisineType}</p>
            <button
              onClick={openMapsLink}
              className="text-xs text-coral hover:underline mt-0.5 flex items-center gap-1"
            >
              📍 {r.neighborhood}
            </button>
            {isBooked && savedRestaurant.bookingNote && (
              <p className="text-xs text-ink-muted mt-1 italic">{savedRestaurant.bookingNote}</p>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {r.bookingUrgent && !isBooked && (
              <span className="text-xs bg-coral-light text-coral px-2 py-0.5 rounded-full">
                Book now
              </span>
            )}
            <span className="text-ink-muted text-xs">{expanded ? '▲' : '▼'}</span>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-cream-dark space-y-2">
                <p className="text-xs text-ink-soft leading-relaxed">{r.whyItWorks}</p>
                <p className="text-xs text-ink-muted">{r.bookingLeadTime}</p>
                <a
                  href={openTableUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-coral hover:underline"
                >
                  Book it → OpenTable ↗
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
