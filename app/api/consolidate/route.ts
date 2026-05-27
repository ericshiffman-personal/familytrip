import { NextRequest, NextResponse } from 'next/server';
import { callClaudeJSON, logUsage } from '@/lib/claude';
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
    const { result, usage } = await callClaudeJSON<unknown>(prompt, 2048);
    logUsage('consolidate', usage);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Consolidate error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
