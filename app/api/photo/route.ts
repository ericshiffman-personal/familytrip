import { NextRequest, NextResponse } from 'next/server';
import { getUnsplashPhoto } from '@/lib/unsplash';

// Force dynamic so Next.js doesn't try to statically optimise this route
export const dynamic = 'force-dynamic';

/**
 * GET /api/photo?q=<query>
 *
 * Server-side proxy for Unsplash — keeps UNSPLASH_ACCESS_KEY out of the browser.
 * Used by client components (DestinationCard, trip page header) to fetch
 * destination-specific photos by name.
 *
 * Returns: UnsplashPhoto JSON, or null if key is missing / no results.
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q');
  if (!q || q.trim().length < 2) {
    return NextResponse.json(null, { status: 400 });
  }

  const photo = await getUnsplashPhoto(q.trim());
  return NextResponse.json(photo, {
    headers: {
      // Cache at the CDN/browser level for 1 hour to cut repeat fetches
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
