import { NextRequest, NextResponse } from 'next/server';
import { callClaudeJSON } from '@/lib/claude';
import { buildRecommendationPrompt } from '@/lib/prompts';
import { TripInputs, RecommendationResponse } from '@/types';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const inputs: TripInputs = await request.json();

    if (!inputs.dealBreakers || !inputs.departureCity) {
      return NextResponse.json({ error: 'Missing required trip inputs' }, { status: 400 });
    }

    const prompt = buildRecommendationPrompt(inputs);
    const result = await callClaudeJSON<RecommendationResponse>(prompt, 2048);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Recommendation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations. Please try again.' },
      { status: 500 }
    );
  }
}
