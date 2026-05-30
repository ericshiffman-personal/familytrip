// lib/placesUsage.ts
// Client-side tracker for Google Places photo API usage.
// Stored in localStorage with monthly auto-reset for the cap check,
// and a separate lifetime record for per-session analytics.
//
// ── Admin mode ────────────────────────────────────────────────────────────────
// Usage warnings are hidden from regular users.
// To see them in your own browser, run once in the console:
//   localStorage.setItem('tinysuitcase_admin', '1')
// To hide again: localStorage.removeItem('tinysuitcase_admin')

const MONTHLY_KEY  = 'tinysuitcase_places_usage';
const LIFETIME_KEY = 'tinysuitcase_places_lifetime';
const ADMIN_KEY    = 'tinysuitcase_admin';

const DEFAULT_LIMIT = 900; // stay under Google's 1,000 free-tier monthly cap

// ── Types ─────────────────────────────────────────────────────────────────────

interface MonthlyRecord {
  count: number;
  month: number;  // 0-indexed JS month
  year: number;
}

interface LifetimeRecord {
  totalPhotos: number;        // successful photo fetches ever
  totalSessions: number;      // hotel recommendation requests ever
  firstUsed: string | null;   // ISO date of first ever request
}

// ── Monthly helpers ───────────────────────────────────────────────────────────

function readMonthly(): MonthlyRecord {
  if (typeof window === 'undefined') {
    const now = new Date();
    return { count: 0, month: now.getMonth(), year: now.getFullYear() };
  }
  try {
    const raw = localStorage.getItem(MONTHLY_KEY);
    if (!raw) throw new Error('empty');
    const record: MonthlyRecord = JSON.parse(raw);
    const now = new Date();
    // New calendar month → reset
    if (record.month !== now.getMonth() || record.year !== now.getFullYear()) {
      return { count: 0, month: now.getMonth(), year: now.getFullYear() };
    }
    return record;
  } catch {
    const now = new Date();
    return { count: 0, month: now.getMonth(), year: now.getFullYear() };
  }
}

function writeMonthly(record: MonthlyRecord): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MONTHLY_KEY, JSON.stringify(record));
}

// ── Lifetime helpers ──────────────────────────────────────────────────────────

function readLifetime(): LifetimeRecord {
  if (typeof window === 'undefined') {
    return { totalPhotos: 0, totalSessions: 0, firstUsed: null };
  }
  try {
    const raw = localStorage.getItem(LIFETIME_KEY);
    if (!raw) throw new Error('empty');
    return JSON.parse(raw) as LifetimeRecord;
  } catch {
    return { totalPhotos: 0, totalSessions: 0, firstUsed: null };
  }
}

function writeLifetime(record: LifetimeRecord): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LIFETIME_KEY, JSON.stringify(record));
}

// ── Public API ────────────────────────────────────────────────────────────────

/** True when the current browser has admin mode enabled. */
export function isAdminMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(ADMIN_KEY) === '1';
}

/** Current photo request count this calendar month. */
export function getPlacesCount(): number {
  return readMonthly().count;
}

/**
 * Call when a hotel recommendation request is made (whether or not a photo
 * is ultimately fetched). Increments the session counter.
 */
export function incrementSession(): void {
  const lifetime = readLifetime();
  writeLifetime({
    ...lifetime,
    totalSessions: lifetime.totalSessions + 1,
    firstUsed: lifetime.firstUsed ?? new Date().toISOString(),
  });
}

/**
 * Call after a successful photo fetch. Increments both the monthly cap
 * counter and the lifetime photo counter.
 * Returns the new monthly count.
 */
export function incrementPlacesCount(): number {
  // Monthly
  const monthly = readMonthly();
  const updated = { ...monthly, count: monthly.count + 1 };
  writeMonthly(updated);

  // Lifetime
  const lifetime = readLifetime();
  writeLifetime({
    ...lifetime,
    totalPhotos: lifetime.totalPhotos + 1,
    firstUsed: lifetime.firstUsed ?? new Date().toISOString(),
  });

  return updated.count;
}

export type PlacesStatus = 'ok' | 'warning' | 'capped';

export interface PlacesUsageSummary {
  // Monthly
  count: number;
  limit: number;
  freeTier: number;
  percentUsed: number;
  status: PlacesStatus;
  // Lifetime
  totalPhotos: number;
  totalSessions: number;
  avgPhotosPerSession: string;  // formatted to 1 decimal
  firstUsed: string | null;
}

/** Full summary for the admin banner. */
export function getPlacesUsageSummary(limit = DEFAULT_LIMIT): PlacesUsageSummary {
  const monthly  = readMonthly();
  const lifetime = readLifetime();
  const warningThreshold = Math.floor(limit * 0.8);
  const avg = lifetime.totalSessions > 0
    ? (lifetime.totalPhotos / lifetime.totalSessions).toFixed(1)
    : '—';

  return {
    count:        monthly.count,
    limit,
    freeTier:     1000,
    percentUsed:  Math.round((monthly.count / limit) * 100),
    status:       monthly.count >= limit ? 'capped'
                : monthly.count >= warningThreshold ? 'warning'
                : 'ok',
    totalPhotos:        lifetime.totalPhotos,
    totalSessions:      lifetime.totalSessions,
    avgPhotosPerSession: avg,
    firstUsed:          lifetime.firstUsed,
  };
}

/** True if we should skip the Places photo call to avoid charges. */
export function isPlacesCapped(limit = DEFAULT_LIMIT): boolean {
  return getPlacesCount() >= limit;
}
