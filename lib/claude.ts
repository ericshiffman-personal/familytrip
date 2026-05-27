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
    throw new Error(`No JSON found in Claude response. Response was: ${text.slice(0, 200)}`);
  }

  return { result: JSON.parse(jsonMatch[0]) as T, usage };
}
