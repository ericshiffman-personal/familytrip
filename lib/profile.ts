import { FamilyProfile, TripInputs } from '@/types';

const PROFILE_KEY = 'tinysuitcase_profile';
const TRIP_INPUTS_KEY = 'tinysuitcase_inputs';

export function saveProfile(inputs: TripInputs): void {
  if (typeof window === 'undefined') return;
  const profile: FamilyProfile = {
    adults: inputs.adults,
    children: inputs.children,
    napRequired: inputs.napRequired,
    napSchedule: inputs.napSchedule,
    activityLevel: inputs.vibes.pace === 'adventure' ? 'active' : inputs.vibes.pace === 'relaxed' ? 'relaxed' : 'moderate',
    dealBreakers: inputs.dealBreakers,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadProfile(): FamilyProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveTripInputs(inputs: TripInputs): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(TRIP_INPUTS_KEY, JSON.stringify(inputs));
}

export function loadTripInputs(): TripInputs | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(TRIP_INPUTS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearTripInputs(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(TRIP_INPUTS_KEY);
}

export function getChildrenSummary(children: { age: number }[]): string {
  if (children.length === 0) return 'no children';
  return children.map(c => {
    if (c.age < 1) return 'infant (under 1)';
    if (c.age === 1) return '1-year-old';
    return `${c.age}-year-old`;
  }).join(', ');
}
