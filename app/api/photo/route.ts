import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/photo?q=<destination-name>
 *
 * Self-contained Unsplash proxy — keeps UNSPLASH_ACCESS_KEY server-side.
 * Used by client components (DestinationCard, trip header) to load photos.
 *
 * No force-dynamic: we want Next.js default fetch caching so repeated queries
 * for the same destination hit the cache rather than Unsplash each time.
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json(null, { status: 400 });
  }

  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    console.warn('[/api/photo] UNSPLASH_ACCESS_KEY is not set');
    return NextResponse.json(null);
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=1&orientation=landscape&content_filter=high`,
      {
        headers: { Authorization: `Client-ID ${key}` },
        // Cache 24h — shared across all requests for the same query
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) {
      console.error(`[/api/photo] Unsplash API error ${res.status} for query: "${q}"`);
      return NextResponse.json(null);
    }

    const data = await res.json();
    const photo = data.results?.[0];

    if (!photo) {
      console.warn(`[/api/photo] No results from Unsplash for query: "${q}"`);
      return NextResponse.json(null);
    }

    return NextResponse.json(
      {
        url: photo.urls.regular,
        photographer: photo.user.name,
        photographerUrl: `https://unsplash.com/@${photo.user.username}?utm_source=tinysuitcase&utm_medium=referral`,
        unsplashUrl: `https://unsplash.com?utm_source=tinysuitcase&utm_medium=referral`,
        altDescription: photo.alt_description ?? null,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (err) {
    console.error('[/api/photo] Unexpected error:', err);
    return NextResponse.json(null);
  }
}
