import { NextRequest, NextResponse } from 'next/server';
import { callClaudeJSONWithRetry, logUsage } from '@/lib/claude';
import { buildItineraryPrompt } from '@/lib/prompts';
import { TripInputs, Destination } from '@/types';

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const { tripInputs, destination }: { tripInputs: TripInputs; destination: Destination } =
      await request.json();

    const prompt = buildItineraryPrompt(tripInputs, destination);
    // 5000 tokens — 5-day itinerary with 5 fields per day; raised from 3500 for headroom.
    // Auto-retries once at 7000 if first attempt fails or is truncated.
    const { result, usage } = await callClaudeJSONWithRetry<{ days: unknown[] }>(prompt, 5000, 'itinerary');
    logUsage('itinerary', usage);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Itinerary error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
