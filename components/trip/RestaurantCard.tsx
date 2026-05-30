'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RestaurantRecommendation, SavedRestaurant, RestaurantStatus } from '@/types';

interface RestaurantCardProps {
  restaurant: RestaurantRecommendation;
  savedEntry?: SavedRestaurant;      // undefined if not yet saved
  totalDays: number;
  onSaveToDay: (dayNumber: number, status: RestaurantStatus) => void;
  onMarkFlexible: () => void;
  onMarkBooked: (bookingNote: string) => void;
  onRemove: () => void;
}

export default function RestaurantCard({
  restaurant: r,
  savedEntry,
  totalDays,
  onSaveToDay,
  onMarkFlexible,
  onMarkBooked,
  onRemove,
}: RestaurantCardProps) {
  const [bookingNote, setBookingNote] = useState(savedEntry?.bookingNote ?? '');
  const [showBookingField, setShowBookingField] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);

  const isBooked = savedEntry?.status === 'booked';
  const isConsidering = savedEntry?.status === 'considering';
  const isFlexible = savedEntry?.status === 'flexible';
  const isSaved = !!savedEntry;

  const openTableUrl = `https://www.opentable.com/s?term=${encodeURIComponent(r.openTableQuery)}`;

  const openMapsLink = (e: React.MouseEvent) => {
    e.preventDefault();
    const query = encodeURIComponent(r.neighborhood);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleConfirmBooking = () => {
    onMarkBooked(bookingNote);
    setShowBookingField(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card overflow-hidden ${isSaved ? 'border-l-4 border-l-coral' : ''}`}
    >
      <div className="p-5 space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-bold text-navy text-base leading-tight">{r.name}</h3>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-xs font-medium text-ink-muted bg-cream px-2 py-0.5 rounded-full">
                {r.cuisineType}
              </span>
              <span className="text-xs text-ink-muted">{r.priceRange}</span>
            </div>
          </div>
          {r.bookingUrgent && (
            <span className="text-xs bg-coral-light text-coral px-2 py-1 rounded-full font-semibold flex-shrink-0">
              Book now
            </span>
          )}
        </div>

        {/* Neighborhood */}
        <button
          onClick={openMapsLink}
          className="text-sm text-coral hover:underline flex items-center gap-1 font-medium"
        >
          📍 {r.neighborhood} ↗
        </button>

        {/* Why it works */}
        <p className="text-sm text-ink-soft leading-relaxed">{r.whyItWorks}</p>

        {/* Booking lead time */}
        <p className="text-xs text-ink-muted">{r.bookingLeadTime}</p>

        {/* OpenTable link */}
        <a
          href={openTableUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-coral hover:underline"
        >
          Check on OpenTable ↗
        </a>

        <div className="border-t border-cream-dark pt-3 space-y-3">
          {/* Status: not saved yet */}
          {!isSaved && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide">
                Plan for which evening?
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
                  <button
                    key={day}
                    onClick={() => onSaveToDay(day, 'considering')}
                    className="px-3 py-1.5 rounded-full border-2 border-cream-dark text-xs font-semibold text-navy hover:border-coral hover:text-coral transition-colors"
                  >
                    Day {day}
                  </button>
                ))}
                <button
                  onClick={onMarkFlexible}
                  className="px-3 py-1.5 rounded-full border-2 border-cream-dark text-xs font-semibold text-ink-muted hover:border-navy/30 transition-colors"
                >
                  Keep flexible
                </button>
              </div>
            </div>
          )}

          {/* Status: considering */}
          {isConsidering && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  Considering: Day {savedEntry.dayNumber}
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowBookingField(true); }}
                    className="text-xs font-semibold text-coral hover:underline"
                  >
                    Mark as booked
                  </button>
                  <button
                    onClick={onRemove}
                    className="text-xs text-ink-muted hover:text-ink transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
              {/* Move to different day */}
              <button
                onClick={() => setShowDayPicker(!showDayPicker)}
                className="text-xs text-ink-muted hover:text-navy transition-colors"
              >
                {showDayPicker ? '▲ Hide' : 'Move to a different day'}
              </button>
              <AnimatePresence>
                {showDayPicker && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2 overflow-hidden"
                  >
                    {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
                      <button
                        key={day}
                        onClick={() => { onSaveToDay(day, 'considering'); setShowDayPicker(false); }}
                        className={`px-3 py-1.5 rounded-full border-2 text-xs font-semibold transition-colors ${
                          savedEntry.dayNumber === day
                            ? 'border-coral bg-coral-light text-coral'
                            : 'border-cream-dark text-navy hover:border-coral hover:text-coral'
                        }`}
                      >
                        Day {day}
                      </button>
                    ))}
                    <button
                      onClick={() => { onMarkFlexible(); setShowDayPicker(false); }}
                      className="px-3 py-1.5 rounded-full border-2 border-cream-dark text-xs font-semibold text-ink-muted hover:border-navy/30 transition-colors"
                    >
                      Make flexible
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Status: booked */}
          {isBooked && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  ✓ Booked: Day {savedEntry.dayNumber ?? 'flexible'}
                </span>
                <button
                  onClick={onRemove}
                  className="text-xs text-ink-muted hover:text-ink transition-colors"
                >
                  Remove
                </button>
              </div>
              {savedEntry.bookingNote && (
                <p className="text-xs text-ink-muted italic">{savedEntry.bookingNote}</p>
              )}
              <button
                onClick={() => { setShowBookingField(!showBookingField); setBookingNote(savedEntry.bookingNote ?? ''); }}
                className="text-xs text-ink-muted hover:text-navy transition-colors"
              >
                {showBookingField ? 'Cancel' : 'Edit booking note'}
              </button>
            </div>
          )}

          {/* Status: flexible */}
          {isFlexible && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-navy bg-navy-light px-2 py-0.5 rounded-full">
                  Flexible pick
                </span>
                <button
                  onClick={onRemove}
                  className="text-xs text-ink-muted hover:text-ink transition-colors"
                >
                  Remove
                </button>
              </div>
              <button
                onClick={() => setShowDayPicker(!showDayPicker)}
                className="text-xs text-coral hover:underline"
              >
                Assign to a specific day
              </button>
              <AnimatePresence>
                {showDayPicker && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2 overflow-hidden"
                  >
                    {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
                      <button
                        key={day}
                        onClick={() => { onSaveToDay(day, 'considering'); setShowDayPicker(false); }}
                        className="px-3 py-1.5 rounded-full border-2 border-cream-dark text-xs font-semibold text-navy hover:border-coral hover:text-coral transition-colors"
                      >
                        Day {day}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Booking note field (shown when marking as booked or editing) */}
          <AnimatePresence>
            {showBookingField && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-2">
                  <textarea
                    rows={2}
                    autoFocus
                    placeholder="e.g. 8pm reservation, confirmation #R123456 (optional)"
                    value={bookingNote}
                    onChange={(e) => setBookingNote(e.target.value)}
                    className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-coral resize-none"
                  />
                  <button
                    onClick={handleConfirmBooking}
                    className="w-full py-2 rounded-xl bg-coral text-white text-sm font-semibold hover:bg-coral-dark transition-colors"
                  >
                    {isBooked ? 'Save changes' : '✓ Mark as booked'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
