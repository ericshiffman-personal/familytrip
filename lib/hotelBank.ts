import { HotelData } from '@/types';

const bankKey = (slug: string) => `tinysuitcase_hotel_${slug}`;

export function loadHotelData(slug: string): HotelData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(bankKey(slug));
    if (!raw) return null;
    const parsed: HotelData = JSON.parse(raw);
    if (parsed.slug !== slug) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveHotelData(slug: string, data: HotelData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(bankKey(slug), JSON.stringify(data));
  } catch {
    // QuotaExceededError — fail silently
  }
}
