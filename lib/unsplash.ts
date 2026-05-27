/**
 * Unsplash API utility — server-side only (used directly in Server Components
 * and in API routes). Never import this in client components — use /api/photo instead.
 * Key lives in UNSPLASH_ACCESS_KEY (no NEXT_PUBLIC_ prefix — never sent to browser).
 *
 * API terms: photos must display photographer credit with utm links.
 * All fetch responses are cached 24h via Next.js data cache.
 */

export interface UnsplashPhoto {
  url: string;            // images.unsplash.com CDN URL — safe to use as <img src>
  width: number;
  height: number;
  photographer: string;
  photographerUrl: string; // includes utm params per Unsplash guidelines
  unsplashUrl: string;     // includes utm params per Unsplash guidelines
  altDescription?: string;
}

/**
 * Fetch multiple landscape photos from Unsplash (up to 10).
 * Returns empty array on failure — callers should degrade gracefully.
 */
export async function getUnsplashPhotos(query: string, count: number = 4): Promise<UnsplashPhoto[]> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return [];

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${Math.min(count, 10)}&orientation=landscape&content_filter=high`,
      {
        headers: { Authorization: `Client-ID ${key}` },
        // Cache 24h — keeps us well inside the 50 req/hr free tier limit.
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) return [];

    const data = await res.json();
    const results = data.results ?? [];

    return results.map((photo: Record<string, unknown>) => {
      const user = photo.user as Record<string, string>;
      const urls = photo.urls as Record<string, string>;
      return {
        url: urls.regular,   // 1080px wide, quality-optimised
        width: photo.width as number,
        height: photo.height as number,
        altDescription: photo.alt_description as string | undefined,
        photographer: user.name,
        // utm params required by Unsplash API guidelines
        photographerUrl: `https://unsplash.com/@${user.username}?utm_source=familytrip&utm_medium=referral`,
        unsplashUrl: `https://unsplash.com?utm_source=familytrip&utm_medium=referral`,
      } as UnsplashPhoto;
    });
  } catch {
    return [];
  }
}

/**
 * Convenience wrapper — fetch a single photo. Returns null on failure.
 */
export async function getUnsplashPhoto(query: string): Promise<UnsplashPhoto | null> {
  const photos = await getUnsplashPhotos(query, 1);
  return photos[0] ?? null;
}
