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
    const { result, usage } = await callClaudeJSON<RecommendationResponse>(prompt, 2048);
    logUsage('recommend', usage);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Recommendation error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
