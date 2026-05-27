import { NextRequest, NextResponse } from 'next/server';
import { callClaudeJSON } from '@/lib/claude';
import { buildPackingPrompt } from '@/lib/prompts';
import { TripInputs, Destination } from '@/types';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { tripInputs, destination }: { tripInputs: TripInputs; destination: Destination } =
      await request.json();

    const prompt = buildPackingPrompt(tripInputs, destination);
    const result = await callClaudeJSON<{ categories: unknown[] }>(prompt, 2048);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Packing error:', error);
    return NextResponse.json({ error: 'Failed to generate packing list' }, { status: 500 });
  }
}
