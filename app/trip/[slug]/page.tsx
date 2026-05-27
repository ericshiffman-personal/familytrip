'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { loadTripInputs } from '@/lib/profile';
import { TripInputs, Destination, ItineraryDay as ItineraryDayType, PackingCategory, RecommendationResponse } from '@/types';
import ItineraryDay from '@/components/trip/ItineraryDay';
import PackingList from '@/components/trip/PackingList';
import ResearchPaste from '@/components/trip/ResearchPaste';

type Tab = 'itinerary' | 'packing' | 'research';

export default function TripPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [tripInputs, setTripInputs] = useState<TripInputs | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('itinerary');

  const [itinerary, setItinerary] = useState<ItineraryDayType[] | null>(null);
  const [packingList, setPackingList] = useState<PackingCategory[] | null>(null);
  const [itineraryLoading, setItineraryLoading] = useState(false);
  const [packingLoading, setPackingLoading] = useState(false);
  const [itineraryError, setItineraryError] = useState<string | null>(null);
  const [packingError, setPackingError] = useState<string | null>(null);

  useEffect(() => {
    const inputs = loadTripInputs();
    if (!inputs) {
      router.push('/plan');
      return;
    }
    setTripInputs(inputs);

    // Recover destination from sessionStorage
    const recKey = 'familytrip_recommendations';
    const raw = sessionStorage.getItem(recKey);
    if (raw) {
      const rec: RecommendationResponse = JSON.parse(raw);
      const dest = rec.primary.slug === slug ? rec.primary : rec.alternative;
      setDestination(dest);
    }
  }, [slug, router]);

  // Load sequentially — itinerary first, then packing — to avoid hammering the API simultaneously
  useEffect(() => {
    if (!destination || !tripInputs) return;
    const runSequential = async () => {
      await loadItinerary();
      await loadPackingList();
    };
    runSequential();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination, tripInputs]);

  const loadItinerary = async () => {
    if (!destination || !tripInputs || itinerary) return;
    setItineraryLoading(true);
    setItineraryError(null);
    try {
      const res = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripInputs, destination }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load itinerary');
      if (!data.days || !Array.isArray(data.days)) throw new Error('Invalid itinerary format returned');
      setItinerary(data.days);
    } catch (err) {
      setItineraryError(err instanceof Error ? err.message : 'Could not load itinerary. Please try again.');
    } finally {
      setItineraryLoading(false);
    }
  };

  const loadPackingList = async () => {
    if (!destination || !tripInputs || packingList) return;
    setPackingLoading(true);
    setPackingError(null);
    try {
      const res = await fetch('/api/packing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripInputs, destination }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load packing list');
      if (!data.categories || !Array.isArray(data.categories)) throw new Error('Invalid packing list format returned');
      setPackingList(data.categories);
    } catch (err) {
      setPackingError(err instanceof Error ? err.message : 'Could not load packing list. Please try again.');
    } finally {
      setPackingLoading(false);
    }
  };

  if (!destination || !tripInputs) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">🗺️</div>
          <p className="text-deep/50 text-sm">Loading your trip...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand">
      {/* Header */}
      <div className={`bg-gradient-to-r ${destination.heroGradient} px-6 py-8`}>
        <div className="max-w-2xl mx-auto">
          <Link href="/results" className="text-white/60 text-sm hover:text-white transition-colors mb-4 inline-block">
            ← Back to options
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{destination.heroEmoji}</span>
            <div>
              <h1 className="text-2xl font-bold text-white">{destination.name}</h1>
              <p className="text-white/70 text-sm">{destination.tagline}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-sand-dark sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-6 flex gap-1">
          {([
            { key: 'itinerary', label: '📅 Itinerary' },
            { key: 'packing', label: '🧳 Packing List' },
            { key: 'research', label: '📋 My Research' },
          ] as { key: Tab; label: string }[]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-4 px-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-coral text-coral'
                  : 'border-transparent text-deep/50 hover:text-deep'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        {activeTab === 'itinerary' && (
          <div>
            {itineraryLoading && (
              <div className="text-center py-12">
                <div className="text-4xl mb-3 animate-bounce">📅</div>
                <p className="text-deep/50 text-sm">Building your day-by-day plan...</p>
              </div>
            )}
            {itineraryError && (
              <div className="text-center py-8">
                <p className="text-deep/50 text-sm mb-4">{itineraryError}</p>
                <button onClick={loadItinerary} className="text-coral text-sm underline">Try again</button>
              </div>
            )}
            {itinerary && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-deep">Your {tripInputs.duration} itinerary</h2>
                  <span className="text-xs text-deep/30 bg-white px-3 py-1 rounded-full border border-sand-dark">
                    Draft · verify before booking
                  </span>
                </div>
                {itinerary.map((day, idx) => (
                  <ItineraryDay key={day.day} day={day} index={idx} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'packing' && (
          <div>
            {packingLoading && (
              <div className="text-center py-12">
                <div className="text-4xl mb-3 animate-bounce">🧳</div>
                <p className="text-deep/50 text-sm">Building your personalized packing list...</p>
              </div>
            )}
            {packingError && (
              <div className="text-center py-8">
                <p className="text-deep/50 text-sm mb-4">{packingError}</p>
                <button onClick={loadPackingList} className="text-coral text-sm underline">Try again</button>
              </div>
            )}
            {packingList && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-deep">Packing list</h2>
                  <span className="text-xs text-deep/40">Tap to check off</span>
                </div>
                <PackingList categories={packingList} />
              </div>
            )}
          </div>
        )}

        {activeTab === 'research' && (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-deep mb-1">Your research</h2>
              <p className="text-deep/50 text-sm">
                Been down the TripAdvisor rabbit hole? Paste everything here — we&apos;ll organize it for you.
              </p>
            </div>
            <ResearchPaste tripInputs={tripInputs} destination={destination} />
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-sand-dark px-6 py-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Link
            href="/results"
            className="flex-1 py-3 rounded-2xl border-2 border-sand-dark text-deep text-sm font-medium text-center hover:border-deep/30 transition-colors"
          >
            ← Change destination
          </Link>
          <button
            className="flex-1 py-3 rounded-2xl bg-coral text-white text-sm font-bold hover:bg-coral-dark transition-colors"
            onClick={() => alert('Booking integrations coming soon! For now, use your itinerary to book directly.')}
          >
            Book this trip →
          </button>
        </div>
      </div>

      {/* Bottom padding for fixed nav */}
      <div className="h-24" />
    </div>
  );
}
