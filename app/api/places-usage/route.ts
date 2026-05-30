import { NextResponse } from 'next/server';

// GET /api/places-usage
// Returns configured limit info. The in-memory count in places-photo/route is
// a server-side safety net but resets on cold starts — for accurate usage,
// check Vercel logs (search "[places-photo]") or Google Cloud Console.
export async function GET() {
  const limit = parseInt(process.env.GOOGLE_PLACES_PHOTO_LIMIT ?? '900', 10);

  return NextResponse.json({
    limit,
    freeTier: 1000,
    configured: !!process.env.GOOGLE_PLACES_API_KEY,
    note: 'Server-side count resets on cold starts. For accurate monthly usage: check Vercel logs for [places-photo] entries, or visit Google Cloud Console → APIs & Services → Places API (New) → Metrics.',
    googleConsole: 'https://console.cloud.google.com/apis/api/places_backend.googleapis.com/metrics',
  });
}
