'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { loadTripInputs } from '@/lib/profile';
import { TripInputs, RecommendationResponse } from '@/types';
import DestinationCard from '@/components/results/DestinationCard';

const LOADING_MESSAGES = [
  'Thinking about your toddler\'s nap schedule... 😴',
  'Checking flight times from your city... ✈️',
  'Weighing your deal-breakers carefully... 🤔',
  'Cross-referencing what has worked for similar families... 🗺️',
  'Putting together two confident picks just for you... ✨',
];

export default function ResultsPage() {
  const router = useRouter();
  const [tripInputs, setTripInputs] = useState<TripInputs | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const inputs = loadTripInputs();
    if (!inputs) {
      router.push('/plan');
      return;
    }
    setTripInputs(inputs);
    fetchRecommendations(inputs);
  }, [router]);

  // Cycle loading messages
  useEffect(() => {
    if (recommendations || error) return;
    const interval = setInterval(() => {
      setLoadingMsg((m) => (m + 1) % LOADING_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [recommendations, error]);

  const fetchRecommendations = async (inputs: TripInputs) => {
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });
      if (!res.ok) throw new Error('Failed to get recommendations');
      const data = await res.json();
      // Save to sessionStorage so the trip page can read the chosen destination
      sessionStorage.setItem('familytrip_recommendations', JSON.stringify(data));
      setRecommendations(data);
    } catch (err) {
      setError('Something went wrong getting your recommendations. Please try again.');
      console.error(err);
    }
  };

  const handleChoose = (slug: string) => {
    router.push(`/trip/${slug}`);
  };

  // Loading state
  if (!recommendations && !error) {
    return (
      <div className="min-h-screen bg-sand flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6 animate-bounce">🌍</div>
          <h2 className="text-2xl font-bold text-deep mb-3">
            Finding your perfect trip...
          </h2>
          <motion.p
            key={loadingMsg}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-deep/55 text-sm"
          >
            {LOADING_MESSAGES[loadingMsg]}
          </motion.p>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-coral animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-sand flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">😬</div>
        <h2 className="text-xl font-bold text-deep mb-2">Something went wrong</h2>
        <p className="text-deep/55 text-sm mb-6 max-w-sm">{error}</p>
        <Link
          href="/plan"
          className="bg-coral text-white font-semibold px-6 py-3 rounded-2xl hover:bg-coral-dark transition-colors"
        >
          Try again
        </Link>
      </div>
    );
  }

  if (!recommendations) return null;

  return (
    <div className="min-h-screen bg-sand">
      {/* Header */}
      <div className="bg-white border-b border-sand-dark px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-deep tracking-tight">
            family<span className="text-coral">trip</span>
          </Link>
          <Link href="/plan" className="text-sm text-deep/40 hover:text-deep transition-colors">
            ← Start over
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-coral-light text-coral text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            Your personalized picks
          </div>
          <p className="text-deep/65 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            {recommendations.personalizedIntro}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="space-y-6">
          <DestinationCard
            destination={recommendations.primary}
            isPrimary={true}
            onChoose={() => handleChoose(recommendations.primary.slug)}
            index={0}
          />
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-sand-dark" />
            <span className="text-deep/30 text-xs font-medium">OR</span>
            <div className="flex-1 h-px bg-sand-dark" />
          </div>
          <DestinationCard
            destination={recommendations.alternative}
            isPrimary={false}
            onChoose={() => handleChoose(recommendations.alternative.slug)}
            index={1}
          />
        </div>

        {/* Reassurance footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-white rounded-2xl p-5 border border-sand-dark text-center"
        >
          <p className="text-sm text-deep/55 leading-relaxed">
            <strong className="text-deep">Not feeling either one?</strong>{' '}
            <Link href="/plan" className="text-coral hover:underline">
              Adjust your inputs
            </Link>{' '}
            and we&apos;ll generate a fresh pair. These recommendations are based on what you told us —
            changing your deal-breakers or vibe selections often gives very different results.
          </p>
        </motion.div>

        {/* Draft disclaimer */}
        <p className="text-center text-xs text-deep/30 mt-4">
          These recommendations are based on our knowledge. Tap &quot;Verify details&quot; on any activity in your
          itinerary to double-check before booking.
        </p>
      </div>
    </div>
  );
}
