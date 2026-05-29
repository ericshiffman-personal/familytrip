'use client';

import { useState } from 'react';
import { TripInputs, Destination, HotelData, SavedHotel } from '@/types';
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
    try {
      const res = await fetch('/api/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripInputs, destination }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load hotel recommendation');
      const newData: HotelData = {
        slug: destination.slug,
        recommendation: data.recommendation,
        savedHotel: hotelData?.savedHotel, // preserve existing booking if regenerating
        generatedAt: new Date().toISOString(),
      };
      onHotelDataChange(newData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load recommendation. Please try again.');
    } finally {
      setLoading(false);
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

  // ── Loading ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-3 animate-bounce">🏨</div>
        <p className="text-ink-muted text-sm">Finding the right home base for your family...</p>
      </div>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────
  if (!hotelData) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-4xl mb-3">🏨</div>
          <h2 className="font-display text-xl font-bold text-navy mb-2">Your home base</h2>
          <p className="text-ink-muted text-sm leading-relaxed max-w-sm mx-auto">
            Where you stay shapes everything — the neighborhood sets your walking radius,
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
        tripInputs={tripInputs}
        destination={destination}
        onSave={handleSave}
        onRemove={handleRemove}
      />

      <p className="text-xs text-ink-muted text-center leading-relaxed px-4">
        Hotel names are Claude&apos;s best knowledge — verify the property is current before booking.
        Search links open {hotelData.recommendation.bookingPlatform === 'airbnb' ? 'Airbnb' : 'Booking.com'} with your family size pre-filled.
      </p>
    </div>
  );
}
