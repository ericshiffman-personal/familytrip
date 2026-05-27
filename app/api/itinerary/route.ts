import { NextRequest, NextResponse } from 'next/server';
import { callClaudeJSON } from '@/lib/claude';
import { buildItineraryPrompt } from '@/lib/prompts';
import { TripInputs, Destination } from '@/types';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { tripInputs, destination }: { tripInputs: TripInputs; destination: Destination } =
      await request.json();

    const prompt = buildItineraryPrompt(tripInputs, destination);
    const result = await callClaudeJSON<{ days: unknown[] }>(prompt, 2500);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Itinerary error:', error);
    return NextResponse.json({ error: 'Failed to generate itinerary' }, { status: 500 });
  }
}
