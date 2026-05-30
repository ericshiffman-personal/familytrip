'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { loadTripInputs } from '@/lib/profile';
import { loadDiningData, saveDiningData } from '@/lib/restaurantBank';
import { loadHotelData, saveHotelData } from '@/lib/hotelBank';
import { TripInputs, Destination, ItineraryDay as ItineraryDayType, PackingCategory, RecommendationResponse, DiningData, SavedRestaurant, HotelData } from '@/types';
import ItineraryDay from '@/components/trip/ItineraryDay';
import PackingList from '@/components/trip/PackingList';
import ResearchPaste from '@/components/trip/ResearchPaste';
import DiningGuide from '@/components/trip/DiningGuide';
import HotelsGuide from '@/components/trip/HotelsGuide';

type Tab = 'itinerary' | 'hotels' | 'dining' | 'packing' | 'research';

export default function TripPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [tripInputs, setTripInputs] = useState<TripInputs | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [isFastPath, setIsFastPath] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('itinerary');
  const [heroPhoto, setHeroPhoto] = useState<{ url: string; photographer: string; photographerUrl: string } | null>(null);

  const [itinerary, setItinerary] = useState<ItineraryDayType[] | null>(null);
  const [packingList, setPackingList] = useState<PackingCategory[] | null>(null);
  const [diningData, setDiningData] = useState<DiningData | null>(null);
  const [hotelData, setHotelData] = useState<HotelData | null>(null);
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

    // 1. Check full recommendations (normal flow)
    const recRaw = sessionStorage.getItem('tinysuitcase_recommendations');
    if (recRaw) {
      try {
        const rec: RecommendationResponse = JSON.parse(recRaw);
        const dest = rec.primary.slug === slug ? rec.primary
                   : rec.alternative.slug === slug ? rec.alternative
                   : null;
        if (dest) { setDestination(dest); return; }
      } catch { /* fall through */ }
    }

    // 2. Check fast-path destination (user came from /go)
    const fastpathRaw = sessionStorage.getItem('tinysuitcase_destination');
    if (fastpathRaw) {
      try {
        const dest: Destination = JSON.parse(fastpathRaw);
        if (dest.slug === slug) { setIsFastPath(true); setDestination(dest); return; }
      } catch { /* fall through */ }
    }

    // Nothing matched — send them back to plan
    router.push('/plan');
  }, [slug, router]);

  // Restore dining + hotel data from localStorage when slug is known
  useEffect(() => {
    const savedDining = loadDiningData(slug);
    if (savedDining) setDiningData(savedDining);
    const savedHotel = loadHotelData(slug);
    if (savedHotel) setHotelData(savedHotel);
  }, [slug]);

  // Fetch hero photo when destination is known — just the name for best specificity
  useEffect(() => {
    if (!destination) return;
    fetch(`/api/photo?q=${encodeURIComponent(destination.name)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setHeroPhoto(data); })
      .catch(() => {});
  }, [destination]);

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

  // Generic fetch helper with one automatic client-side retry
  const fetchWithRetry = async (url: string, body: object): Promise<Response> => {
    const opts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };
    const res = await fetch(url, opts);
    if (!res.ok) {
      // Wait briefly then try once more
      await new Promise((r) => setTimeout(r, 1200));
      return fetch(url, opts);
    }
    return res;
  };

  const loadItinerary = async () => {
    if (!destination || !tripInputs || itinerary) return;
    setItineraryLoading(true);
    setItineraryError(null);
    try {
      const res = await fetchWithRetry('/api/itinerary', { tripInputs, destination });
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
      const res = await fetchWithRetry('/api/packing', { tripInputs, destination });
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

  const handleDiningDataChange = (data: DiningData) => {
    setDiningData(data);
    saveDiningData(slug, data);
  };

  const handleHotelDataChange = (data: HotelData) => {
    setHotelData(data);
    saveHotelData(slug, data);
  };

  // numDays mirrors the logic in buildItineraryPrompt
  const numDays =
    tripInputs?.duration === '3-4 days'  ? 4 :
    tripInputs?.duration === '5-7 days'  ? 7 :
    tripInputs?.duration === '8-10 days' ? 10 :
    10; // '10+ days'

  // Build a day-number → SavedRestaurant lookup for the itinerary evening slots
  const savedByDay = (diningData?.savedRestaurants ?? [])
    .filter((s): s is SavedRestaurant & { dayNumber: number } => s.dayNumber !== null)
    .reduce<Record<number, SavedRestaurant>>((acc, s) => { acc[s.dayNumber] = s; return acc; }, {});

  if (!destination || !tripInputs) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-ink-muted text-sm">Loading your trip...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero header */}
      <div className={`relative bg-gradient-to-br ${destination.heroGradient} overflow-hidden`}
           style={{ minHeight: '160px' }}>
        {/* Photo fades in over gradient when ready */}
        {heroPhoto && (
          <div className="absolute inset-0">
            <Image
              src={heroPhoto.url}
              alt={destination.name}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/60" />
          </div>
        )}
        <div className="relative z-10 px-6 py-10 max-w-2xl mx-auto">
          <Link
            href={isFastPath ? '/go' : '/results'}
            className="text-white/60 text-sm hover:text-white transition-colors mb-5 inline-block"
          >
            {isFastPath ? '← Change destination' : '← Back to options'}
          </Link>
          <h1 className="font-display text-3xl font-bold text-white mb-1">{destination.name}</h1>
          <p className="text-white/70 text-sm">{destination.tagline}</p>
          {hotelData?.savedHotel && (
            <p className="text-white/60 text-sm mt-1">📍 {hotelData.savedHotel.name}</p>
          )}
          {heroPhoto && (
            <p className="mt-4 text-white/25 text-xs">
              Photo:{' '}
              <a href={heroPhoto.photographerUrl} target="_blank" rel="noopener noreferrer"
                 className="hover:text-white/50 transition-colors underline">
                {heroPhoto.photographer}
              </a>
              {' / Unsplash'}
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-cream-dark sticky top-0 z-40 shadow-sm">
        <div className="max-w-2xl mx-auto px-6 flex">
          {([
            { key: 'itinerary', label: '📅 Itinerary' },
            { key: 'hotels',    label: '🏨 Hotels' },
            { key: 'dining',    label: '🍽️ Dining' },
            { key: 'packing',   label: '🧳 Packing' },
            { key: 'research',  label: '📋 Research' },
          ] as { key: Tab; label: string }[]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-4 px-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-coral text-coral'
                  : 'border-transparent text-ink-muted hover:text-navy'
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
              <div className="text-center py-16">
                <p className="text-ink-muted text-sm">Building your day-by-day plan...</p>
              </div>
            )}
            {itineraryError && (
              <div className="text-center py-10">
                <p className="text-ink-soft text-sm mb-4">{itineraryError}</p>
                <button onClick={loadItinerary} className="text-coral text-sm font-semibold underline">Try again</button>
              </div>
            )}
            {itinerary && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-bold text-navy">Your {tripInputs.duration} itinerary</h2>
                  <span className="text-xs text-ink-muted bg-white px-3 py-1 rounded-full border border-cream-dark">
                    Verify before booking
                  </span>
                </div>
                {itinerary.map((day, idx) => (
                  <ItineraryDay
                    key={day.day}
                    day={day}
                    index={idx}
                    savedRestaurant={savedByDay[day.day]}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'hotels' && (
          <HotelsGuide
            tripInputs={tripInputs}
            destination={destination}
            hotelData={hotelData}
            onHotelDataChange={handleHotelDataChange}
          />
        )}

        {activeTab === 'dining' && (
          <div>
            <DiningGuide
              tripInputs={tripInputs}
              destination={destination}
              numDays={numDays}
              diningData={diningData}
              onDiningDataChange={handleDiningDataChange}
            />
          </div>
        )}

        {activeTab === 'packing' && (
          <div>
            {packingLoading && (
              <div className="text-center py-16">
                <p className="text-ink-muted text-sm">Building your packing list...</p>
              </div>
            )}
            {packingError && (
              <div className="text-center py-10">
                <p className="text-ink-soft text-sm mb-4">{packingError}</p>
                <button onClick={loadPackingList} className="text-coral text-sm font-semibold underline">Try again</button>
              </div>
            )}
            {packingList && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-bold text-navy">Packing list</h2>
                  <span className="text-xs text-ink-muted">Tap to check off</span>
                </div>
                <PackingList categories={packingList} />
              </div>
            )}
          </div>
        )}

        {activeTab === 'research' && (
          <div>
            <div className="mb-5">
              <h2 className="font-display text-xl font-bold text-navy mb-1">Your research</h2>
              <p className="text-ink-muted text-sm">
                Been down the TripAdvisor rabbit hole? Paste everything here and we&apos;ll organize it for you.
              </p>
            </div>
            <ResearchPaste tripInputs={tripInputs} destination={destination} />
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-dark px-6 py-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Link
            href={isFastPath ? '/go' : '/results'}
            className="flex-1 py-3 rounded-xl border-2 border-cream-dark text-ink text-sm font-medium text-center hover:border-navy/30 transition-colors"
          >
            {isFastPath ? '← Change destination' : '← Back to options'}
          </Link>
          <button
            className="flex-1 py-3 rounded-xl bg-coral text-white text-sm font-bold hover:bg-coral-dark transition-colors shadow-md shadow-coral/20"
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
