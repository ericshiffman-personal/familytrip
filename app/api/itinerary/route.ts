import { NextRequest, NextResponse } from 'next/server';
import { callClaudeJSON, logUsage } from '@/lib/claude';
import { buildItineraryPrompt } from '@/lib/prompts';
import { TripInputs, Destination } from '@/types';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { tripInputs, destination }: { tripInputs: TripInputs; destination: Destination } =
      await request.json();

    const prompt = buildItineraryPrompt(tripInputs, destination);
    // 5000 tokens — 5-day itinerary with 5 fields per day; raised from 3500 for headroom.
    const { result, usage } = await callClaudeJSON<{ days: unknown[] }>(prompt, 5000);
    logUsage('itinerary', usage);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Itinerary error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
