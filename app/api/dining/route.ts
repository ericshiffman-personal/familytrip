import { NextRequest, NextResponse } from 'next/server';
import { callClaudeJSONWithRetry, logUsage } from '@/lib/claude';
import { buildDiningPrompt } from '@/lib/prompts';
import { TripInputs, Destination, DiningPreferences, RestaurantRecommendation } from '@/types';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { tripInputs, destination, preferences, numDays }: {
      tripInputs: TripInputs;
      destination: Destination;
      preferences: DiningPreferences;
      numDays: number;
    } = await request.json();

    if (!preferences.cuisineVibe || !preferences.diningStyle) {
      return NextResponse.json({ error: 'Missing dining preferences' }, { status: 400 });
    }

    const prompt = buildDiningPrompt(tripInputs, destination, preferences, numDays);
    // ~4000 tokens for 6-8 restaurants. Auto-retries once at 6000 if first attempt fails.
    const { result, usage } = await callClaudeJSONWithRetry<{ restaurants: RestaurantRecommendation[] }>(
      prompt, 4000, 'dining'
    );
    logUsage('dining', usage);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Dining error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
