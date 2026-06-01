import { NextRequest, NextResponse } from 'next/server';
import { callClaudeJSONWithRetry, logUsage } from '@/lib/claude';
import { buildPackingPrompt } from '@/lib/prompts';
import { TripInputs, Destination } from '@/types';

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const { tripInputs, destination }: { tripInputs: TripInputs; destination: Destination } =
      await request.json();

    const prompt = buildPackingPrompt(tripInputs, destination);
    // 4000 tokens. Auto-retries once at 6000 if first attempt fails.
    const { result, usage } = await callClaudeJSONWithRetry<{ categories: unknown[] }>(prompt, 4000, 'packing');
    logUsage('packing', usage);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Packing error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
