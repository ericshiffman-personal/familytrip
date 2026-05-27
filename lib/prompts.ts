import { TripInputs, Destination } from '@/types';
import { getChildrenSummary } from './profile';

function buildFamilyContext(inputs: TripInputs): string {
  const { adults, children, napRequired, napSchedule, vibes, duration, budget, departureCity, travelMethod, dealBreakers } = inputs;

  const childrenSummary = getChildrenSummary(children);
  const napContext = napRequired
    ? `One or more children still require naps${napSchedule ? ` (typically ${napSchedule})` : ''} — the itinerary must account for mid-day downtime near their home base.`
    : '';

  const vibeContext = [
    vibes.environment && `They're drawn to ${vibes.environment === 'beach' ? 'beach and water environments' : 'mountains and hiking'}`,
    vibes.pace && `They prefer ${vibes.pace === 'relaxed' ? 'slow, resort-style days with plenty of downtime' : 'adventure-packed days with lots of activities'}`,
    vibes.transport && `They ${vibes.transport === 'fly' ? 'are happy to fly' : 'prefer driving and a road trip experience'}`,
    vibes.geography && `They lean toward ${vibes.geography === 'international' ? 'an international destination' : 'staying within the US'}`,
    vibes.accommodation && `They prefer ${vibes.accommodation === 'allinclusive' ? 'an all-inclusive resort where everything is handled' : 'a rental house where they can feel at home'}`,
  ].filter(Boolean).join('. ');

  return `
FAMILY PROFILE:
- Party: ${adults} adult${adults > 1 ? 's' : ''} with children: ${childrenSummary}
- ${napContext}
- Trip length: ${duration}
- Budget feel: ${budget === 'budget' ? 'watching costs carefully' : budget === 'comfortable' ? 'comfortable spending without being extravagant' : 'willing to splurge for the right experience'}
- Flying from: ${departureCity}
- Travel preference: ${travelMethod === 'fly' ? 'flying' : travelMethod === 'drive' ? 'driving/road trip' : 'open to either'}
- What would ruin this trip: "${dealBreakers}"
${vibeContext ? `- Vibe preferences: ${vibeContext}` : ''}
  `.trim();
}

export function buildRecommendationPrompt(inputs: TripInputs): string {
  const familyContext = buildFamilyContext(inputs);

  return `You are a trusted family travel advisor — like a close friend who has traveled everywhere with kids and gives honest, specific advice. You are NOT a booking site. You do not hedge or list endless options. You make a call.

${familyContext}

Based on this specific family profile, recommend exactly TWO destinations: one primary recommendation and one alternative. These must be genuinely different from each other.

CRITICAL RULES:
1. Every "why it works" bullet MUST reference something specific about THIS family (ages, nap needs, departure city, budget, what would ruin the trip). Generic statements like "great for families" are not acceptable.
2. Be honest about the one real tradeoff for each destination.
3. The two recommendations should be meaningfully different (not just two beach resorts).

Respond with valid JSON only, no markdown, no explanation outside the JSON. Use this exact structure:

{
  "personalizedIntro": "2-3 sentence opener that acknowledges their specific situation and explains why you're recommending these two",
  "primary": {
    "name": "Destination Name",
    "tagline": "Short punchy tagline (under 10 words)",
    "heroEmoji": "single emoji that represents this destination",
    "heroGradient": "from-[color1]-400 to-[color2]-600",
    "whyItWorks": [
      "Specific reason 1 tied to their family profile",
      "Specific reason 2 tied to their family profile",
      "Specific reason 3 tied to their family profile"
    ],
    "honestTradeoff": "The one real downside they should know about",
    "bestFor": "One sentence on what kind of family this is perfect for",
    "flightTime": "Approximate flight time from their departure city",
    "budgetNote": "Honest note about costs at their budget level",
    "topActivities": ["activity 1", "activity 2", "activity 3", "activity 4"],
    "slug": "destination-name-slug"
  },
  "alternative": {
    "name": "Alternative Destination Name",
    "tagline": "Short punchy tagline",
    "heroEmoji": "single emoji",
    "heroGradient": "from-[color1]-400 to-[color2]-600",
    "whyItWorks": [
      "Specific reason 1",
      "Specific reason 2",
      "Specific reason 3"
    ],
    "honestTradeoff": "The one real downside",
    "bestFor": "One sentence on what kind of family this is perfect for",
    "flightTime": "Approximate flight time from their departure city",
    "budgetNote": "Honest note about costs",
    "topActivities": ["activity 1", "activity 2", "activity 3", "activity 4"],
    "slug": "alternative-destination-slug"
  }
}

For heroGradient, use Tailwind gradient class names like "from-blue-400 to-cyan-600" or "from-orange-400 to-red-600" that match the destination's visual vibe.`;
}

export function buildItineraryPrompt(inputs: TripInputs, destination: Destination): string {
  const familyContext = buildFamilyContext(inputs);
  // Cap at 5 days for reliable API responses — longer trips will be paginated in a future build
  const durationDays = inputs.duration === '3-4 days' ? 4 : 5;

  return `You are a family travel planner building a day-by-day itinerary for a specific family. Be practical, specific, and honest. This is not a generic travel guide.

${familyContext}

DESTINATION: ${destination.name}

Build a ${durationDays}-day itinerary.

CRITICAL RULES:
- If nap schedule is required, explicitly note mid-day return to home base in the afternoon slot
- Recommend real, specific places/activities (not vague "visit the beach" — say which beach and why)
- Account for actual kid energy levels and attention spans by age
- Note when to loop back to the car for snacks or supplies if doing outdoor activities
- Flag any activity with age recommendations

Respond with valid JSON only:
{
  "days": [
    {
      "day": 1,
      "title": "Arrival & First Impressions",
      "morning": "Specific activity with details",
      "afternoon": "Specific activity (note nap time if applicable)",
      "evening": "Dinner suggestion + evening activity",
      "napNote": "Where/how to handle nap today (only if napRequired)",
      "tip": "One practical tip for today specific to this family"
    }
  ]
}`;
}

export function buildPackingPrompt(inputs: TripInputs, destination: Destination): string {
  const familyContext = buildFamilyContext(inputs);

  return `You are building a personalized packing list for a family trip. Do NOT give a generic packing list. Every item should be relevant to this specific family, destination, and trip.

${familyContext}
DESTINATION: ${destination.name}
TOP ACTIVITIES: ${destination.topActivities.join(', ')}

Respond with valid JSON only:
{
  "categories": [
    {
      "category": "Category Name",
      "emoji": "relevant emoji",
      "items": ["specific item 1 (with note if helpful)", "item 2", "item 3"]
    }
  ]
}

Include these categories as relevant: Clothing, Kid Gear, Beach/Activity Gear, Documents & Money, Health & Safety, Entertainment (for transit), Snacks & Food, Tech & Accessories. Tailor items to the children's ages. For infants/toddlers, be especially specific about nap gear, feeding supplies, etc.`;
}

export function buildConsolidatePrompt(pastedText: string, inputs: TripInputs, destination: Destination): string {
  return `A family has been researching ${destination.name} for their trip and has pasted their notes, reviews, and research below. They have ${getChildrenSummary(inputs.children)} and are traveling for ${inputs.duration}.

Your job: extract and organize the useful information from their research into a structured, actionable format. Ignore marketing fluff. Flag anything that might be outdated or worth verifying. Add brief notes on how each item fits their specific family (kids' ages, nap needs, activity level: ${inputs.vibes.pace || 'moderate'}).

THEIR RESEARCH:
---
${pastedText.slice(0, 8000)}
---

Respond with valid JSON only:
{
  "highlights": [
    {
      "title": "Place or activity name",
      "type": "restaurant | activity | hotel | beach | tip",
      "notes": "What they found + your take for their family",
      "verifyBefore": true or false,
      "verifyReason": "Why to double-check (if verifyBefore is true)"
    }
  ],
  "consolidatedTips": ["Practical tip 1", "Tip 2", "Tip 3"],
  "redFlags": ["Anything that seemed concerning or questionable in their research"]
}`;
}
