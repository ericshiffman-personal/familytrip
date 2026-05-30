'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { HotelRecommendation, SavedHotel, TripInputs, Destination } from '@/types';

interface HotelCardProps {
  recommendation: HotelRecommendation;
  savedHotel?: SavedHotel;
  photoUrl?: string;
  tripInputs: TripInputs;
  destination: Destination;
  onSave: (hotel: SavedHotel) => void;
  onRemove: () => void;
}

const TYPE_LABELS: Record<HotelRecommendation['type'], string> = {
  'hotel':           'Hotel',
  'resort':          'Resort',
  'boutique-hotel':  'Boutique hotel',
  'vacation-rental': 'Vacation rental',
  'apartment':       'Apartment',
};

export default function HotelCard({
  recommendation: r,
  savedHotel,
  photoUrl,
  tripInputs,
  destination,
  onSave,
  onRemove,
}: HotelCardProps) {
  const [showBookedForm, setShowBookedForm] = useState(false);
  const [showElsewhereForm, setShowElsewhereForm] = useState(false);
  const [hotelName, setHotelName] = useState(r.name);
  const [bookingNote, setBookingNote] = useState('');
  const [elsewhereName, setElsewhereName] = useState('');

  const isBooked = !!savedHotel;

  // Build booking deep link
  const { adults, children } = tripInputs;
  const childCount = children.length;
  const bedroomsNeeded = childCount > 0 ? 2 : 1;
  const dest = encodeURIComponent(destination.name);

  const bookingUrl = r.bookingPlatform === 'airbnb'
    ? `https://www.airbnb.com/s/${dest}/homes?adults=${adults}&children=${childCount}&min_bedrooms=${bedroomsNeeded}`
    : `https://www.booking.com/searchresults.html?ss=${dest}&group_adults=${adults}&group_children=${childCount}&no_rooms=1&nflt=ht_id%3D204`;

  const alternativesUrl = r.bookingPlatform === 'airbnb'
    ? `https://www.airbnb.com/s/${dest}/homes?adults=${adults}&children=${childCount}`
    : `https://www.booking.com/searchresults.html?ss=${dest}&group_adults=${adults}&group_children=${childCount}&no_rooms=1`;

  const platformLabel = r.bookingPlatform === 'airbnb' ? 'Airbnb' : 'Booking.com';

  const handleConfirmBooked = () => {
    onSave({ name: hotelName.trim() || r.name, bookingNote: bookingNote.trim() || undefined, savedAt: new Date().toISOString() });
    setShowBookedForm(false);
  };

  const handleConfirmElsewhere = () => {
    if (!elsewhereName.trim()) return;
    onSave({ name: elsewhereName.trim(), savedAt: new Date().toISOString() });
    setShowElsewhereForm(false);
  };

  // ── Booked state ──────────────────────────────────────────────────
  if (isBooked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-5 border-l-4 border-l-emerald-400 space-y-3"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ✓ Home base confirmed
            </span>
            <h3 className="font-bold text-navy text-lg mt-2">{savedHotel.name}</h3>
            {savedHotel.bookingNote && (
              <p className="text-xs text-ink-muted mt-1 italic">{savedHotel.bookingNote}</p>
            )}
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          <button
            onClick={() => {
              setHotelName(savedHotel.name);
              setBookingNote(savedHotel.bookingNote ?? '');
              setShowBookedForm(true);
            }}
            className="text-xs text-ink-muted hover:text-navy transition-colors"
          >
            Edit details
          </button>
          <button onClick={onRemove} className="text-xs text-ink-muted hover:text-ink transition-colors">
            Remove
          </button>
        </div>
        <AnimatePresence>
          {showBookedForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden space-y-2 pt-2 border-t border-cream-dark"
            >
              <input
                type="text"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-coral"
              />
              <textarea
                rows={2}
                placeholder="Confirmation # or notes (optional)"
                value={bookingNote}
                onChange={(e) => setBookingNote(e.target.value)}
                className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-coral resize-none"
              />
              <div className="flex gap-2">
                <button onClick={handleConfirmBooked} className="flex-1 py-2 rounded-xl bg-coral text-white text-sm font-semibold hover:bg-coral-dark transition-colors">Save</button>
                <button onClick={() => setShowBookedForm(false)} className="px-4 py-2 rounded-xl border border-cream-dark text-sm text-ink-muted hover:text-ink transition-colors">Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // ── Recommendation card ───────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card overflow-hidden"
    >
      {/* Real hotel photo from Google Places — only shown when available */}
      {photoUrl && (
        <div className="relative h-44 w-full overflow-hidden">
          <Image
            src={photoUrl}
            alt={r.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 640px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <p className="text-white font-display font-bold text-lg leading-tight drop-shadow">{r.name}</p>
            <p className="text-white/75 text-xs mt-0.5">{r.neighborhood}</p>
          </div>
        </div>
      )}

      <div className="p-5 space-y-4">
      {/* Header — name/neighborhood shown here when no photo, otherwise shown in photo overlay */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="text-xs font-bold text-coral uppercase tracking-widest">Our Pick</span>
          {!photoUrl && (
            <>
              <h3 className="font-display font-bold text-navy text-xl mt-1 leading-tight">{r.name}</h3>
              <p className="text-sm text-ink-muted mt-0.5">
                {TYPE_LABELS[r.type]} · {r.neighborhood}
              </p>
            </>
          )}
          {photoUrl && (
            <p className="text-sm text-ink-muted mt-0.5">{TYPE_LABELS[r.type]}</p>
          )}
        </div>
        <span className="text-sm font-semibold text-ink-muted bg-cream px-2 py-1 rounded-lg flex-shrink-0">
          {r.priceRange}
        </span>
      </div>

      {/* Why it works */}
      <p className="text-sm text-ink-soft leading-relaxed border-l-4 border-coral pl-3 italic">
        &ldquo;{r.whyItWorks}&rdquo;
      </p>

      {/* Key amenities */}
      {r.keyAmenities.length > 0 && (
        <div>
          <p className="text-xs font-bold text-ink-muted uppercase tracking-wide mb-2">Key amenities</p>
          <div className="flex flex-wrap gap-2">
            {r.keyAmenities.map((a) => (
              <span key={a} className="text-xs bg-navy-light text-navy px-3 py-1 rounded-full font-medium">
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Verify before booking */}
      {r.verifyBefore.length > 0 && (
        <div>
          <p className="text-xs font-bold text-ink-muted uppercase tracking-wide mb-2">Verify before booking</p>
          <div className="flex flex-wrap gap-2">
            {r.verifyBefore.map((v) => (
              <span key={v} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full font-medium">
                ⚠ {v}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Booking note */}
      <p className="text-xs text-ink-muted italic">{r.bookingNote}</p>

      {/* CTAs */}
      <div className="flex gap-2 pt-1">
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 rounded-xl bg-coral text-white text-sm font-bold text-center hover:bg-coral-dark transition-colors shadow-md shadow-coral/20"
        >
          Search on {platformLabel} →
        </a>
        <a
          href={alternativesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-3 rounded-xl border-2 border-cream-dark text-sm font-medium text-ink-muted hover:border-navy/30 hover:text-navy transition-colors whitespace-nowrap"
        >
          See alternatives ↗
        </a>
      </div>

      {/* Booked / elsewhere actions */}
      <div className="border-t border-cream-dark pt-3 flex gap-4">
        <button
          onClick={() => { setShowBookedForm(true); setShowElsewhereForm(false); }}
          className="text-sm font-semibold text-coral hover:underline"
        >
          I&apos;ve already booked this
        </button>
        <button
          onClick={() => { setShowElsewhereForm(true); setShowBookedForm(false); }}
          className="text-sm text-ink-muted hover:text-navy transition-colors"
        >
          I&apos;m staying somewhere else
        </button>
      </div>

      {/* Booked form */}
      <AnimatePresence>
        {showBookedForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden space-y-2"
          >
            <label className="text-xs font-semibold text-navy block">Confirm the hotel name</label>
            <input
              type="text"
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
              autoFocus
              className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-coral"
            />
            <textarea
              rows={2}
              placeholder="Confirmation # or notes (optional)"
              value={bookingNote}
              onChange={(e) => setBookingNote(e.target.value)}
              className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-coral resize-none"
            />
            <div className="flex gap-2">
              <button onClick={handleConfirmBooked} className="flex-1 py-2.5 rounded-xl bg-coral text-white text-sm font-semibold hover:bg-coral-dark transition-colors">
                ✓ Confirm booking
              </button>
              <button onClick={() => setShowBookedForm(false)} className="px-4 py-2.5 rounded-xl border border-cream-dark text-sm text-ink-muted hover:text-ink transition-colors">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Staying elsewhere form */}
      <AnimatePresence>
        {showElsewhereForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden space-y-2"
          >
            <label className="text-xs font-semibold text-navy block">Where are you staying?</label>
            <input
              type="text"
              placeholder="Hotel or rental name"
              value={elsewhereName}
              onChange={(e) => setElsewhereName(e.target.value)}
              autoFocus
              className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-coral"
            />
            <div className="flex gap-2">
              <button
                onClick={handleConfirmElsewhere}
                disabled={!elsewhereName.trim()}
                className="flex-1 py-2.5 rounded-xl bg-coral text-white text-sm font-semibold hover:bg-coral-dark transition-colors disabled:bg-cream-dark disabled:text-ink-muted"
              >
                Save
              </button>
              <button onClick={() => setShowElsewhereForm(false)} className="px-4 py-2.5 rounded-xl border border-cream-dark text-sm text-ink-muted hover:text-ink transition-colors">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>{/* end p-5 wrapper */}
    </motion.div>
  );
}
