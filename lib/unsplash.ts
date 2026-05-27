/**
 * Unsplash API utility — server-side only.
 * Key lives in UNSPLASH_ACCESS_KEY (no NEXT_PUBLIC_ prefix — never sent to browser).
 *
 * API terms: photos must display photographer credit with utm links.
 * All fetch responses are cached 24h via Next.js data cache.
 */

export interface UnsplashPhoto {
  url: string;            // images.unsplash.com CDN URL — safe to use as <img src>
  width: number;
  height: number;
  blurHash?: string;
  photographer: string;
  photographerUrl: string; // includes utm params per Unsplash guidelines
  unsplashUrl: string;     // includes utm params per Unsplash guidelines
  altDescription?: string;
}

/**
 * Fetch a single landscape photo from Unsplash for a given query.
 * Returns null if the API key is missing or the request fails — callers should degrade gracefully.
 */
export async function getUnsplashPhoto(query: string): Promise<UnsplashPhoto | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&content_filter=high`,
      {
        headers: { Authorization: `Client-ID ${key}` },
        // Cache at Next.js data-cache level — Unsplash free tier is 50 req/hr,
        // so caching for 24h keeps us well inside limits even under traffic.
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const photo = data.results?.[0];
    if (!photo) return null;

    return {
      url: photo.urls.regular,  // 1080px wide, already quality-optimised
      width: photo.width,
      height: photo.height,
      blurHash: photo.blur_hash,
      altDescription: photo.alt_description,
      photographer: photo.user.name,
      // utm params required by Unsplash API guidelines
      photographerUrl: `https://unsplash.com/@${photo.user.username}?utm_source=familytrip&utm_medium=referral`,
      unsplashUrl: `https://unsplash.com?utm_source=familytrip&utm_medium=referral`,
    };
  } catch {
    return null;
  }
}
