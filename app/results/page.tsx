'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { loadTripInputs } from '@/lib/profile';
import { TripInputs, RecommendationResponse } from '@/types';
import DestinationCard from '@/components/results/DestinationCard';

const LOADING_MESSAGES = [
  "Reading your deal-breakers carefully... 🤔",
  "Thinking about nap windows and logistics... 😴",
  "Checking flight times from your city... ✈️",
  "Weighing what parents actually complain about... 📋",
  "Making the call... ✨",
];

export default function ResultsPage() {
  const router = useRouter();
  const [tripInputs, setTripInputs] = useState<TripInputs | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [overrideLoading, setOverrideLoading] = useState(false);

  useEffect(() => {
    const inputs = loadTripInputs();
    if (!inputs) { router.push('/plan'); return; }
    setTripInputs(inputs);
    fetchRecommendations(inputs);
  }, [router]);

  useEffect(() => {
    if (recommendations || error) return;
    const interval = setInterval(() => setLoadingMsg((m) => (m + 1) % LOADING_MESSAGES.length), 2400);
    return () => clearInterval(interval);
  }, [recommendations, error]);

  const fetchRecommendations = async (inputs: TripInputs, overrideNote?: string) => {
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...inputs, overrideNote }),
      });
      if (!res.ok) throw new Error('Failed to get recommendations');
      const data = await res.json();
      sessionStorage.setItem('familytrip_recommendations', JSON.stringify(data));
      setRecommendations(data);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setOverrideLoading(false);
    }
  };

  const handleOverride = (type: string) => {
    if (!tripInputs) return;
    setOverrideLoading(true);
    setRecommendations(null);
    fetchRecommendations(tripInputs, type);
  };

  const handleChoose = (slug: string) => router.push(`/trip/${slug}`);

  // Loading
  if ((!recommendations && !error) || overrideLoading) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-6">🗺️</div>
          <h2 className="font-display text-2xl font-bold text-navy mb-3">
            {overrideLoading ? 'Rethinking the plan...' : 'Making the call...'}
          </h2>
          <motion.p
            key={loadingMsg}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-ink-muted text-sm"
          >
            {LOADING_MESSAGES[loadingMsg]}
          </motion.p>
          <div className="flex justify-center gap-2 mt-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-coral animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 text-center">
        <div className="text-4xl mb-4">😬</div>
        <h2 className="font-display text-xl font-bold text-navy mb-2">Something went wrong</h2>
        <p className="text-ink-muted text-sm mb-6 max-w-sm">{error}</p>
        <Link href="/plan" className="bg-coral text-white font-semibold px-6 py-3 rounded-xl hover:bg-coral-dark transition-colors">
          Try again
        </Link>
      </div>
    );
  }

  if (!recommendations) return null;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-cream-dark px-6 py-4 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold text-navy">
            family<span className="text-coral">trip</span>
          </Link>
          <Link href="/plan" className="text-sm text-ink-muted hover:text-ink transition-colors">
            ← Start over
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Our Call summary */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="chip bg-navy text-white">Our Call</span>
          </div>
          <p className="text-ink-soft text-base leading-relaxed max-w-xl">
            {recommendations.ourCallSummary}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="space-y-6">
          <DestinationCard
            destination={recommendations.primary}
            isPrimary={true}
            onChoose={() => handleChoose(recommendations.primary.slug)}
            onOverride={handleOverride}
            index={0}
          />
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-cream-dark" />
            <span className="text-ink-muted text-xs font-semibold tracking-wide uppercase">Or</span>
            <div className="flex-1 h-px bg-cream-dark" />
          </div>
          <DestinationCard
            destination={recommendations.alternative}
            isPrimary={false}
            onChoose={() => handleChoose(recommendations.alternative.slug)}
            onOverride={handleOverride}
            index={1}
          />
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center text-xs text-ink-muted mt-8"
        >
          Recommendations are based on our knowledge of these destinations.
          Use the itinerary&apos;s verify step before booking anything time-sensitive.
        </motion.p>
      </div>
    </div>
  );
}
