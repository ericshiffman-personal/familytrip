'use client';

import { useState } from 'react';
import { TripInputs, Destination, HotelData, SavedHotel } from '@/types';
import { isPlacesCapped, incrementPlacesCount, incrementSession, getPlacesUsageSummary, isAdminMode } from '@/lib/placesUsage';
import HotelCard from './HotelCard';

interface HotelsGuideProps {
  tripInputs: TripInputs;
  destination: Destination;
  hotelData: HotelData | null;
  onHotelDataChange: (data: HotelData) => void;
}

export default function HotelsGuide({
  tripInputs,
  destination,
  hotelData,
  onHotelDataChange,
}: HotelsGuideProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendation = async () => {
    setLoading(true);
    setError(null);
    incrementSession(); // count every recommendation request for per-session analytics
    try {
      const res = await fetch('/api/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripInputs, destination }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load hotel recommendation');

      // Show recommendation immediately — don't wait for photo
      const newData: HotelData = {
        slug: destination.slug,
        recommendation: data.recommendation,
        savedHotel: hotelData?.savedHotel, // preserve existing booking if regenerating
        generatedAt: new Date().toISOString(),
      };
      onHotelDataChange(newData);

      // Fetch photo in background — skip if monthly cap reached
      if (!isPlacesCapped()) {
        fetchPhoto(newData, data.recommendation.name);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPhoto = async (baseData: HotelData, hotelName: string) => {
    try {
      const res = await fetch('/api/places-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: hotelName, location: destination.name }),
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.limitReached) return; // server-side cap hit
      if (data.photoUrl) {
        incrementPlacesCount();
        onHotelDataChange({ ...baseData, photoUrl: data.photoUrl });
      }
    } catch {
      // Photo fetch failed — card renders text-only, which is fine
    }
  };

  const handleSave = (hotel: SavedHotel) => {
    if (!hotelData) return;
    onHotelDataChange({ ...hotelData, savedHotel: hotel });
  };

  const handleRemove = () => {
    if (!hotelData) return;
    const { savedHotel: _, ...rest } = hotelData;
    onHotelDataChange({ ...rest });
  };

  // Usage summary — only rendered when isAdminMode() is true (your browser only)
  const adminMode = isAdminMode();
  const usage = adminMode ? getPlacesUsageSummary() : null;

  // ── Loading ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="text-center py-16">
        <p className="text-ink-muted text-sm">Finding the right home base for your family...</p>
      </div>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────
  if (!hotelData) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="font-display text-xl font-bold text-navy mb-2">Your home base</h2>
          <p className="text-ink-muted text-sm leading-relaxed max-w-sm mx-auto">
            Where you stay shapes everything. The neighborhood sets your walking radius,
            the room layout determines whether nap time works, and the right amenities
            mean parents actually survive the trip.
          </p>
        </div>

        {error && (
          <p className="text-sm text-coral text-center">{error}</p>
        )}

        <button
          onClick={fetchRecommendation}
          className="w-full py-4 rounded-xl bg-coral hover:bg-coral-dark text-white font-bold text-base transition-all shadow-lg shadow-coral/20"
        >
          Find our hotel pick →
        </button>
      </div>
    );
  }

  // ── Result ────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-navy">Home base</h2>
        {!hotelData.savedHotel && (
          <button
            onClick={fetchRecommendation}
            className="text-xs text-coral font-semibold hover:underline"
          >
            Try a different pick
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-coral">{error}</p>
      )}

      <HotelCard
        recommendation={hotelData.recommendation}
        savedHotel={hotelData.savedHotel}
        photoUrl={hotelData.photoUrl}
        tripInputs={tripInputs}
        destination={destination}
        onSave={handleSave}
        onRemove={handleRemove}
      />

      <p className="text-xs text-ink-muted text-center leading-relaxed px-4">
        Hotel names are Claude&apos;s best knowledge. Verify the property is current before booking.
        Search links open {hotelData.recommendation.bookingPlatform === 'airbnb' ? 'Airbnb' : 'Booking.com'} with your family size pre-filled.
      </p>

      {/* Admin-only usage panel — only visible in your browser after running:
           localStorage.setItem('tinysuitcase_admin', '1') in the console */}
      {adminMode && usage && (
        <div className={`text-xs rounded-lg px-3 py-2.5 space-y-1 border font-mono ${
          usage.status === 'capped'   ? 'bg-red-50 text-red-700 border-red-200' :
          usage.status === 'warning'  ? 'bg-amber-50 text-amber-800 border-amber-200' :
                                        'bg-navy-light text-navy border-navy/20'
        }`}>
          <p className="font-semibold not-font-mono text-[11px] uppercase tracking-wide mb-1">
            📷 Places API — admin
          </p>
          <p>This month: {usage.count} / {usage.limit} ({usage.percentUsed}%)
            {usage.status === 'capped' && ' 🚫 CAPPED'}
            {usage.status === 'warning' && ' ⚠️'}
          </p>
          <p>Lifetime: {usage.totalPhotos} photos · {usage.totalSessions} requests · avg {usage.avgPhotosPerSession}/session</p>
          {usage.firstUsed && (
            <p>First used: {new Date(usage.firstUsed).toLocaleDateString()}</p>
          )}
        </div>
      )}
    </div>
  );
}
