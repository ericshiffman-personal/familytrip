import { DiningData, SavedRestaurant } from '@/types';

const bankKey = (slug: string) => `tinysuitcase_dining_${slug}`;

export function loadDiningData(slug: string): DiningData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(bankKey(slug));
    if (!raw) return null;
    const parsed: DiningData = JSON.parse(raw);
    // Validate that stored data belongs to this slug
    if (parsed.slug !== slug) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveDiningData(slug: string, data: DiningData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(bankKey(slug), JSON.stringify(data));
  } catch {
    // QuotaExceededError — fail silently
  }
}

export function updateSavedRestaurants(
  current: DiningData,
  updater: (saved: SavedRestaurant[]) => SavedRestaurant[]
): DiningData {
  return { ...current, savedRestaurants: updater(current.savedRestaurants) };
}
