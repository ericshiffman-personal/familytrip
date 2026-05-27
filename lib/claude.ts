import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Claude Sonnet 4.6 pricing (per million tokens)
const PRICING = {
  input: 3.00,   // $3.00 per million input tokens
  output: 15.00, // $15.00 per million output tokens
};

export interface UsageInfo {
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
}

function calcCost(inputTokens: number, outputTokens: number): number {
  return (
    (inputTokens / 1_000_000) * PRICING.input +
    (outputTokens / 1_000_000) * PRICING.output
  );
}

export function logUsage(route: string, usage: UsageInfo) {
  console.log(
    `[${route}] input: ${usage.inputTokens} tokens | output: ${usage.outputTokens} tokens | cost: $${usage.costUsd.toFixed(4)}`
  );
}

export async function callClaude(
  prompt: string,
  maxTokens = 2048
): Promise<{ text: string; usage: UsageInfo }> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  // Detect truncation — stop_reason 'max_tokens' means the response was cut off.
  // Throw a labelled error so the retry wrapper knows to bump the token ceiling.
  if (message.stop_reason === 'max_tokens') {
    const tokenInfo = `(limit was ${maxTokens}, output was ${message.usage.output_tokens} tokens)`;
    console.error(`[claude] Response truncated ${tokenInfo}`);
    throw new Error(`TRUNCATED: Claude response was cut off ${tokenInfo}`);
  }

  const usage: UsageInfo = {
    inputTokens: message.usage.input_tokens,
    outputTokens: message.usage.output_tokens,
    costUsd: calcCost(message.usage.input_tokens, message.usage.output_tokens),
  };

  return { text: content.text, usage };
}

export async function callClaudeJSON<T>(
  prompt: string,
  maxTokens = 2048
): Promise<{ result: T; usage: UsageInfo }> {
  const { text, usage } = await callClaude(prompt, maxTokens);

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('[claude] No JSON found in response. Raw (first 500 chars):', text.slice(0, 500));
    throw new Error(`No JSON found in Claude response: ${text.slice(0, 200)}`);
  }

  try {
    return { result: JSON.parse(jsonMatch[0]) as T, usage };
  } catch (err) {
    console.error('[claude] JSON.parse failed. Raw JSON (first 1000 chars):', jsonMatch[0].slice(0, 1000));
    throw err;
  }
}

/**
 * callClaudeJSON with automatic retry.
 *
 * On failure the second attempt gets maxTokens + 2000 (up to 8000 ceiling).
 * This handles both transient API errors and edge cases where Claude is more
 * verbose than usual on a particular family profile.
 *
 * Use this for all user-facing routes where a blank result is worse than a
 * slightly higher cost. Don't use it for cheap/fast endpoints where failure
 * is acceptable.
 */
export async function callClaudeJSONWithRetry<T>(
  prompt: string,
  maxTokens: number,
  route: string
): Promise<{ result: T; usage: UsageInfo }> {
  try {
    return await callClaudeJSON<T>(prompt, maxTokens);
  } catch (firstErr) {
    const msg = firstErr instanceof Error ? firstErr.message : String(firstErr);
    const bumpedTokens = Math.min(maxTokens + 2000, 8000);
    console.warn(`[${route}] Attempt 1 failed (${msg.slice(0, 120)}) — retrying with ${bumpedTokens} tokens`);
    // Second attempt — higher token ceiling and a brief wait for transient errors
    await new Promise((r) => setTimeout(r, 800));
    return await callClaudeJSON<T>(prompt, bumpedTokens);
  }
}
