import { TripInputs, Destination } from '@/types';
import { getChildrenSummary } from './profile';

function buildFamilyContext(inputs: TripInputs): string {
  const { adults, children, napRequired, napSchedule, napDetails, vibes, duration, budget, departureCity, travelMethod, travelMonth, dealBreakers } = inputs;

  const childrenSummary = getChildrenSummary(children);

  const napContext = (() => {
    if (!napRequired) return '';
    if (napDetails && napDetails.naps.length > 0) {
      const { count, naps } = napDetails;
      const windowDescriptions = naps.map((nap, i) => {
        const label = count === 2 ? (i === 0 ? 'Morning nap' : 'Afternoon nap') : 'Nap';
        const time = nap.approxTime ? ` (~${nap.approxTime})` : '';
        const crib = nap.strollerOk ? 'stroller/carrier OK — can stay out' : 'REQUIRES crib/home base — must return';
        return `${label}${time}: ${crib}`;
      });
      return `Child requires ${count === 2 ? 'TWO naps per day' : 'one nap per day'}: ${windowDescriptions.join('; ')}. Build the itinerary strictly around these windows — do not schedule activities that conflict.`;
    }
    return `One or more children still require naps${napSchedule ? ` (typically ${napSchedule})` : ''} — the itinerary must account for mid-day downtime near their home base.`;
  })();

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
- Travel timing: ${travelMonth && travelMonth !== 'Flexible' ? travelMonth : 'flexible / not yet decided'}
- What would ruin this trip: "${dealBreakers}"
${vibeContext ? `- Vibe preferences: ${vibeContext}` : ''}
  `.trim();
}

export function buildRecommendationPrompt(inputs: TripInputs, overrideNote?: string): string {
  const familyContext = buildFamilyContext(inputs);
  const overrideContext = overrideNote
    ? `\nUSER OVERRIDE REQUEST: "${overrideNote}" — adjust both recommendations to reflect this preference shift.\n`
    : '';

  return `You are a confident family travel editor${overrideContext} — like a trusted friend who has traveled everywhere with kids, read thousands of reviews, and is willing to make the call. You are NOT a booking site. You do not hedge or list endless options. You lead with the answer.

Your voice: specific, honest, lightly witty. "Worth it if naps are sacred." "Great on paper, harder with a stroller." Never: "Magical memories await!" or "Fun for the whole family!"

${familyContext}

Recommend exactly TWO destinations: one primary "Our Call" and one meaningful alternative. They must be genuinely different from each other.

CRITICAL RULES:
1. Lead with the call — state it directly, like "Pick San Diego over Vancouver."
2. Every reason MUST reference something specific about THIS family. "Great for families" is not acceptable.
3. tradeoffChips: 3-5 short labels. type "positive" = works in their favor, "negative" = works against, "neutral" = context.
4. hiddenCatch: the one thing parents won't see coming — specific, not generic.
5. whenToIgnore: tell them honestly when YOUR recommendation is wrong for them. This builds trust.
6. confidence: "High" if it fits most of their constraints, "Medium" if there are real question marks, "Low" only if you'd still pick it but with caveats.

Respond with valid JSON only. No markdown, no text outside the JSON:

{
  "ourCallSummary": "1-2 sentences explaining the core choice between the two options in plain parent terms",
  "primary": {
    "name": "Destination Name",
    "tagline": "Punchy, honest tagline — under 10 words",
    "heroGradient": "from-[color]-400 to-[color]-600",
    "theCall": "One direct sentence leading with the pick. E.g. 'Pick San Diego — it fits your direct-flight constraint and has more forgiving logistics for a nap-dependent 3-year-old.'",
    "whyItWorks": [
      "Specific reason referencing their ages/nap/budget/departure city",
      "Specific reason 2",
      "Specific reason 3"
    ],
    "tradeoffChips": [
      { "label": "Better for naps", "type": "positive" },
      { "label": "Less distinctive", "type": "negative" },
      { "label": "Direct flights available", "type": "positive" }
    ],
    "hiddenCatch": "The one thing parents won't see coming. Be specific — e.g. 'The hotel rooms near the beach are smaller than the photos suggest. Book a suite if two kids sharing is a dealbreaker.'",
    "honestTradeoff": "What they give up by picking this over the alternative",
    "whenToIgnore": "Tell them when your recommendation is wrong for them",
    "confidence": "High",
    "bestFor": "One sentence — what family profile is this perfect for",
    "flightTime": "Approx flight time from their departure city",
    "budgetNote": "Honest cost note at their budget level — one sentence",
    "topActivities": ["activity 1", "activity 2", "activity 3", "activity 4"],
    "slug": "destination-name-slug"
  },
  "alternative": {
    "name": "Alternative Name",
    "tagline": "Punchy tagline",
    "heroGradient": "from-[color]-400 to-[color]-600",
    "theCall": "One direct sentence. E.g. 'Pick Vancouver if you want the more interesting trip and can handle more logistics.'",
    "whyItWorks": ["Reason 1", "Reason 2", "Reason 3"],
    "tradeoffChips": [
      { "label": "More memorable", "type": "positive" },
      { "label": "Weather risk", "type": "negative" }
    ],
    "hiddenCatch": "The hidden catch for this option",
    "honestTradeoff": "What they give up",
    "whenToIgnore": "When this pick is wrong for them",
    "confidence": "Medium",
    "bestFor": "What family this is perfect for",
    "flightTime": "Flight time",
    "budgetNote": "Cost note",
    "topActivities": ["activity 1", "activity 2", "activity 3", "activity 4"],
    "slug": "alternative-slug"
  }
}

For heroGradient use Tailwind classes matching the destination vibe: e.g. "from-blue-400 to-cyan-600", "from-orange-400 to-red-500", "from-emerald-400 to-teal-600".`;
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
- Keep each field to 1-2 sentences maximum — be specific but concise
- Only include napNote if napRequired is true, otherwise omit the field entirely
- tip should be one short practical sentence

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

STRICT RULES to keep the response concise:
- Maximum 6 categories total
- Maximum 8 items per category
- Each item must be under 8 words — no long explanations
- Only include what is genuinely specific to this family and destination
- Do NOT include obvious universal items (toothbrush, phone charger, underwear)

Categories to choose from (pick the 6 most relevant): Clothing, Kid Gear, Beach/Activity Gear, Documents & Money, Health & Safety, Transit Entertainment, Snacks & Food, Tech & Accessories. For infants/toddlers include nap gear and feeding supplies in Kid Gear.`;
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
