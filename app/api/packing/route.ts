import { NextRequest, NextResponse } from 'next/server';
import { callClaudeJSON, logUsage } from '@/lib/claude';
import { buildPackingPrompt } from '@/lib/prompts';
import { TripInputs, Destination } from '@/types';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { tripInputs, destination }: { tripInputs: TripInputs; destination: Destination } =
      await request.json();

    const prompt = buildPackingPrompt(tripInputs, destination);
    // 4000 tokens — raised from 3500 for headroom.
    const { result, usage } = await callClaudeJSON<{ categories: unknown[] }>(prompt, 4000);
    logUsage('packing', usage);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Packing error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
