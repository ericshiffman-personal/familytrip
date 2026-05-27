'use client';

import { motion } from 'framer-motion';
import { Destination } from '@/types';

interface DestinationCardProps {
  destination: Destination;
  isPrimary: boolean;
  onChoose: () => void;
  index: number;
}

export default function DestinationCard({ destination, isPrimary, onChoose, index }: DestinationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.4 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-sand-dark card-lift"
    >
      {/* Hero */}
      <div className={`bg-gradient-to-br ${destination.heroGradient} p-8 relative`}>
        {isPrimary && (
          <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
            ⭐ Our top pick for your family
          </div>
        )}
        {!isPrimary && (
          <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
            🔀 The alternative
          </div>
        )}
        <div className="text-6xl mb-3 mt-4">{destination.heroEmoji}</div>
        <h2 className="text-2xl font-bold text-white mb-1">{destination.name}</h2>
        <p className="text-white/80 text-sm">{destination.tagline}</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-5">
        {/* Why it works */}
        <div>
          <h3 className="text-xs font-bold text-coral uppercase tracking-widest mb-3">
            Why this works for your family
          </h3>
          <ul className="space-y-2">
            {destination.whyItWorks.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-deep/80">
                <span className="text-coral mt-0.5 flex-shrink-0">✓</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Honest tradeoff */}
        <div className="bg-sand rounded-2xl p-4">
          <p className="text-xs font-bold text-deep/40 uppercase tracking-wide mb-1.5">
            Honest tradeoff
          </p>
          <p className="text-sm text-deep/70">{destination.honestTradeoff}</p>
        </div>

        {/* Meta info grid */}
        <div className="grid grid-cols-2 gap-3">
          {destination.flightTime && (
            <div className="bg-sand rounded-xl p-3">
              <p className="text-xs text-deep/40 mb-0.5">✈️ Flight time</p>
              <p className="text-sm font-semibold text-deep">{destination.flightTime}</p>
            </div>
          )}
          <div className="bg-sand rounded-xl p-3">
            <p className="text-xs text-deep/40 mb-0.5">💰 Budget</p>
            <p className="text-sm font-semibold text-deep">{destination.budgetNote}</p>
          </div>
        </div>

        {/* Top activities */}
        <div>
          <p className="text-xs font-bold text-deep/40 uppercase tracking-wide mb-2">
            Top activities
          </p>
          <div className="flex flex-wrap gap-2">
            {destination.topActivities.map((activity) => (
              <span key={activity} className="bg-ocean-light text-ocean text-xs font-medium px-3 py-1 rounded-full">
                {activity}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.button
          onClick={onChoose}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-colors ${
            isPrimary
              ? 'bg-coral hover:bg-coral-dark text-white shadow-lg shadow-coral/20'
              : 'bg-deep hover:bg-deep/90 text-white'
          }`}
        >
          {isPrimary ? `Yes, let's go to ${destination.name} →` : `Actually, let's do ${destination.name} →`}
        </motion.button>
      </div>
    </motion.div>
  );
}
