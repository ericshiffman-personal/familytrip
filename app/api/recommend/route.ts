import { NextRequest, NextResponse } from 'next/server';
import { callClaudeJSONWithRetry, logUsage } from '@/lib/claude';
import { buildRecommendationPrompt, buildChoosePrompt } from '@/lib/prompts';
import { TripInputs, RecommendationResponse } from '@/types';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { overrideNote, ...inputs } = body as TripInputs & { overrideNote?: string };

    if (!inputs.departureCity) {
      return NextResponse.json({ error: 'Missing required trip inputs' }, { status: 400 });
    }

    // "Narrowed it down to 2" flow: user supplied both destinations — compare them head-to-head.
    // Normal flow: let Claude generate the two recommendations.
    const prompt = (inputs.destinationA && inputs.destinationB)
      ? buildChoosePrompt(inputs, inputs.destinationA, inputs.destinationB)
      : buildRecommendationPrompt(inputs, overrideNote);
    // 4000 tokens — Our Call format has ~30 fields across two destinations.
    // Auto-retries once at 6000 tokens if first attempt fails for any reason.
    const { result, usage } = await callClaudeJSONWithRetry<RecommendationResponse>(prompt, 4000, 'recommend');
    logUsage('recommend', usage);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Recommendation error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
