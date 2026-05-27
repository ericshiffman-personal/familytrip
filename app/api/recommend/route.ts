import { NextRequest, NextResponse } from 'next/server';
import { callClaudeJSON, logUsage } from '@/lib/claude';
import { buildRecommendationPrompt } from '@/lib/prompts';
import { TripInputs, RecommendationResponse } from '@/types';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { overrideNote, ...inputs } = body as TripInputs & { overrideNote?: string };

    if (!inputs.dealBreakers || !inputs.departureCity) {
      return NextResponse.json({ error: 'Missing required trip inputs' }, { status: 400 });
    }

    const prompt = buildRecommendationPrompt(inputs, overrideNote);
    // 4000 tokens — the "Our Call" format has ~30 fields across two destinations.
    // 2048 was too low and caused truncation mid-JSON (position ~5000–5700 chars).
    const { result, usage } = await callClaudeJSON<RecommendationResponse>(prompt, 4000);
    logUsage('recommend', usage);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Recommendation error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
