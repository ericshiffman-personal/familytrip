'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Destination } from '@/types';
import { UnsplashPhoto } from '@/lib/unsplash';

interface DestinationCardProps {
  destination: Destination;
  isPrimary: boolean;
  onChoose: () => void;
  onOverride: (type: string) => void;
  index: number;
}

const TRADEOFF_CHIP_STYLES: Record<string, string> = {
  positive: 'bg-sage-light text-sage',
  neutral:  'bg-navy-light text-navy',
  negative: 'bg-cream-dark text-ink-muted',
};

export default function DestinationCard({
  destination,
  isPrimary,
  onChoose,
  onOverride,
  index,
}: DestinationCardProps) {
  const [photo, setPhoto] = useState<UnsplashPhoto | null>(null);

  // Fetch a destination-specific photo on mount — silently falls back to gradient
  useEffect(() => {
    const query = `${destination.name} travel scenery`;
    fetch(`/api/photo?q=${encodeURIComponent(query)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setPhoto(data); })
      .catch(() => {});
  }, [destination.name]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.4 }}
      className="card shadow-sm overflow-hidden"
    >
      {/* Hero band — photo fades in over gradient when ready */}
      <div className={`relative bg-gradient-to-br ${destination.heroGradient} overflow-hidden`}
           style={{ minHeight: '160px' }}>
        {/* Photo layer */}
        {photo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <Image
              src={photo.url}
              alt={photo.altDescription || destination.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
            {/* Dark overlay so text stays readable over any photo */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/55" />
          </motion.div>
        )}

        {/* Card header content — sits above photo/gradient */}
        <div className="relative z-10 px-6 pt-8 pb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-2 flex-wrap">
              <span className={`chip ${isPrimary ? 'bg-white/20 text-white' : 'bg-white/15 text-white/80'}`}>
                {isPrimary ? 'Our Call' : 'The Alternative'}
              </span>
              {destination.confidence && (
                <span className={`chip ${
                  destination.confidence === 'High'
                    ? 'bg-white/20 text-white'
                    : destination.confidence === 'Medium'
                    ? 'bg-white/15 text-white/80'
                    : 'bg-white/10 text-white/60'
                }`}>
                  {destination.confidence === 'High' ? '●' : destination.confidence === 'Medium' ? '◐' : '○'} {destination.confidence} confidence
                </span>
              )}
            </div>
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-1">{destination.name}</h2>
          <p className="text-white/75 text-sm">{destination.tagline}</p>

          {/* Photo attribution — tiny, bottom-right of hero band */}
          {photo && (
            <p className="absolute bottom-2 right-3 text-white/25 text-xs">
              <a href={photo.photographerUrl} target="_blank" rel="noopener noreferrer"
                 className="hover:text-white/50 transition-colors">
                {photo.photographer}
              </a>
              {' / Unsplash'}
            </p>
          )}
        </div>
      </div>

      <div className="p-6 space-y-5">

        {/* The Call — lead with the answer */}
        {destination.theCall && (
          <div>
            <p className="text-xs font-bold text-coral uppercase tracking-widest mb-2">The Call</p>
            <p className="text-ink font-semibold text-base leading-snug">{destination.theCall}</p>
          </div>
        )}

        {/* Why it works — parent logic */}
        {Array.isArray(destination.whyItWorks) && destination.whyItWorks.length > 0 && (
          <div>
            <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-2">Why it works for your family</p>
            <ul className="space-y-1.5">
              {destination.whyItWorks.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-soft">
                  <span className="text-coral mt-0.5 flex-shrink-0 font-bold">✓</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tradeoff chips */}
        {Array.isArray(destination.tradeoffChips) && destination.tradeoffChips.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {destination.tradeoffChips.map((chip) => (
              <span
                key={chip.label}
                className={`chip ${TRADEOFF_CHIP_STYLES[chip.type] || TRADEOFF_CHIP_STYLES.neutral}`}
              >
                {chip.label}
              </span>
            ))}
          </div>
        )}

        {/* The Hidden Catch */}
        {destination.hiddenCatch && (
          <div className="bg-cream rounded-xl p-4 border-l-4 border-coral">
            <p className="text-xs font-bold text-coral uppercase tracking-wide mb-1">The Hidden Catch</p>
            <p className="text-sm text-ink-soft leading-relaxed">{destination.hiddenCatch}</p>
          </div>
        )}

        {/* Honest tradeoff */}
        {destination.honestTradeoff && (
          <div className="bg-cream-dark rounded-xl p-4">
            <p className="text-xs font-bold text-ink-muted uppercase tracking-wide mb-1">What you give up</p>
            <p className="text-sm text-ink-soft">{destination.honestTradeoff}</p>
          </div>
        )}

        {/* When to ignore us */}
        {destination.whenToIgnore && (
          <p className="text-xs text-ink-muted italic border-t border-cream-dark pt-4">
            <span className="font-semibold not-italic text-ink-soft">When to ignore us: </span>
            {destination.whenToIgnore}
          </p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap gap-2 pt-1">
          {destination.flightTime && (
            <div className="bg-cream rounded-lg px-3 py-2 text-xs">
              <span className="text-ink-muted">✈️ </span>
              <span className="font-semibold text-ink">{destination.flightTime}</span>
            </div>
          )}
          {destination.budgetNote && (
            <div className="bg-cream rounded-lg px-3 py-2 text-xs">
              <span className="text-ink-muted">💰 </span>
              <span className="font-semibold text-ink">{destination.budgetNote}</span>
            </div>
          )}
        </div>

        {/* Top activities */}
        {Array.isArray(destination.topActivities) && destination.topActivities.length > 0 && (
          <div>
            <p className="text-xs font-bold text-ink-muted uppercase tracking-wide mb-2">Top activities</p>
            <div className="flex flex-wrap gap-2">
              {destination.topActivities.map((a) => (
                <span key={a} className="chip bg-navy-light text-navy">{a}</span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <motion.button
          onClick={onChoose}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 rounded-xl font-bold text-base transition-colors mt-2 ${
            isPrimary
              ? 'bg-coral hover:bg-coral-dark text-white shadow-md shadow-coral/20'
              : 'bg-navy hover:bg-navy-mid text-white'
          }`}
        >
          {isPrimary ? `Yes — let's go to ${destination.name} →` : `Actually, let's do ${destination.name} →`}
        </motion.button>

        {/* Override buttons */}
        <div>
          <p className="text-xs text-ink-muted mb-2 text-center">Change direction:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              'Make it more adventurous',
              'Show cheaper version',
              'Prioritize the hotel',
              'Prioritize the destination',
            ].map((label) => (
              <button
                key={label}
                onClick={() => onOverride(label)}
                className="text-xs text-ink-muted border border-stone hover:border-navy hover:text-navy px-3 py-1.5 rounded-full transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
