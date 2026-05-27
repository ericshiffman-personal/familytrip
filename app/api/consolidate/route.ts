import { NextRequest, NextResponse } from 'next/server';
import { callClaudeJSON } from '@/lib/claude';
import { buildConsolidatePrompt } from '@/lib/prompts';
import { TripInputs, Destination } from '@/types';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { pastedText, tripInputs, destination }: {
      pastedText: string;
      tripInputs: TripInputs;
      destination: Destination;
    } = await request.json();

    if (!pastedText || pastedText.trim().length < 20) {
      return NextResponse.json({ error: 'Please paste some research text first' }, { status: 400 });
    }

    const prompt = buildConsolidatePrompt(pastedText, tripInputs, destination);
    const result = await callClaudeJSON<unknown>(prompt, 2048);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Consolidate error:', error);
    return NextResponse.json({ error: 'Failed to consolidate research' }, { status: 500 });
  }
}
