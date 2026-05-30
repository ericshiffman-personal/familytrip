import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// ── Monthly usage tracking ─────────────────────────────────────────────────
// In-memory counter — persists across requests in the same serverless instance.
// Resets on cold starts, which is acceptable for a low-traffic portfolio app.
// Pair with GOOGLE_PLACES_PHOTO_LIMIT env var (default 900) to stay under
// Google's 1,000 free-tier photo requests per month.
const usage = {
  count: 0,
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
};

function getCount(): number {
  const now = new Date();
  // Reset counter on new calendar month
  if (now.getMonth() !== usage.month || now.getFullYear() !== usage.year) {
    usage.count = 0;
    usage.month = now.getMonth();
    usage.year = now.getFullYear();
    console.log('[places-photo] Monthly counter reset');
  }
  return usage.count;
}

function increment(): number {
  getCount(); // trigger reset check first
  usage.count++;
  return usage.count;
}

// Exported so /api/places-usage can read the same object
export { usage };

// ── Handler ────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ error: 'Google Places API not configured' }, { status: 503 });
  }

  const limit = parseInt(process.env.GOOGLE_PLACES_PHOTO_LIMIT ?? '900', 10);
  const currentCount = getCount();

  // Warn at 80% of limit
  if (currentCount >= Math.floor(limit * 0.8)) {
    console.warn(`[places-photo] ⚠️  Usage at ${currentCount}/${limit} this month`);
  }

  // Hard cap — return limit-reached signal instead of calling Google
  if (currentCount >= limit) {
    console.warn(`[places-photo] 🚫 Monthly limit reached (${currentCount}/${limit}) — returning text-only mode`);
    return NextResponse.json({ limitReached: true }, { status: 200 });
  }

  try {
    const { name, location }: { name: string; location: string } = await request.json();

    // Step 1: Text Search → place ID only (free, unlimited)
    const searchRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'places.id',
      },
      body: JSON.stringify({ textQuery: `${name} ${location}` }),
    });

    if (!searchRes.ok) {
      console.error('[places-photo] Text Search failed:', searchRes.status);
      return NextResponse.json({ error: 'Place not found' }, { status: 404 });
    }

    const searchData = await searchRes.json();
    const placeId = searchData.places?.[0]?.id;
    if (!placeId) {
      return NextResponse.json({ error: 'No matching place found' }, { status: 404 });
    }

    // Step 2: Place Details → photos field (billable — increments counter)
    const detailsRes = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'photos',
      },
    });

    if (!detailsRes.ok) {
      console.error('[places-photo] Place Details failed:', detailsRes.status);
      return NextResponse.json({ error: 'Could not load place details' }, { status: 502 });
    }

    const detailsData = await detailsRes.json();
    const photoName = detailsData.photos?.[0]?.name;
    if (!photoName) {
      return NextResponse.json({ error: 'No photos available for this place' }, { status: 404 });
    }

    // Step 3: Photo media → actual image URL
    const photoRes = await fetch(
      `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=600&maxWidthPx=900&skipHttpRedirect=true&key=${API_KEY}`
    );

    if (!photoRes.ok) {
      console.error('[places-photo] Photo media failed:', photoRes.status);
      return NextResponse.json({ error: 'Could not load photo' }, { status: 502 });
    }

    const photoData = await photoRes.json();
    const photoUrl = photoData.photoUri;
    if (!photoUrl) {
      return NextResponse.json({ error: 'No photo URL in response' }, { status: 404 });
    }

    // Increment counter only on successful fetch
    const newCount = increment();
    console.log(`[places-photo] ✓ ${name}, ${location} — usage: ${newCount}/${limit} this month`);

    return NextResponse.json({ photoUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[places-photo] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
