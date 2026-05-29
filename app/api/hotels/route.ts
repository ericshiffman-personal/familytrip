import { NextRequest, NextResponse } from 'next/server';
import { callClaudeJSONWithRetry, logUsage } from '@/lib/claude';
import { buildHotelPrompt } from '@/lib/prompts';
import { TripInputs, Destination, HotelRecommendation } from '@/types';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { tripInputs, destination }: { tripInputs: TripInputs; destination: Destination } =
      await request.json();

    const prompt = buildHotelPrompt(tripInputs, destination);
    // 1500 tokens — one recommendation is small output. Auto-retries once at 3500 if needed.
    const { result, usage } = await callClaudeJSONWithRetry<{ recommendation: HotelRecommendation }>(
      prompt, 1500, 'hotels'
    );
    logUsage('hotels', usage);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Hotels error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
