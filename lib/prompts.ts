import { TripInputs, Destination, DiningPreferences } from '@/types';
import { getChildrenSummary } from './profile';

function buildFamilyContext(inputs: TripInputs): string {
  const { adults, children, napRequired, napSchedule, napDetails, vibes, duration, budget, departureCity, travelMethod, directFlightsOnly, travelMonth, dealBreakers, dietaryRestrictions } = inputs;

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
- Flight constraint: ${travelMethod === 'drive' ? 'n/a (driving)' : directFlightsOnly === true ? 'DIRECT FLIGHTS ONLY — hard constraint, no connections' : directFlightsOnly === false ? 'connecting flights acceptable' : 'no preference stated'}
- Travel timing: ${travelMonth && travelMonth !== 'Flexible' ? travelMonth : 'flexible / not yet decided'}
- What would ruin this trip: "${dealBreakers}"
- Dietary restrictions (hard constraints — affects ALL meals): ${dietaryRestrictions && dietaryRestrictions.length > 0 ? dietaryRestrictions.join(', ') : 'none stated'}
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
7. If directFlightsOnly is true, this is a HARD CONSTRAINT — both recommendations MUST have non-stop flights from their departure city. Do not suggest a destination that requires a connection.

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
  const durationDays =
    inputs.duration === '3-4 days'  ? 4 :
    inputs.duration === '5-7 days'  ? 7 :
    inputs.duration === '8-10 days' ? 10 :
    10; // '10+ days'

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
- bookingFlags: only include items that genuinely need advance reservations — specific popular restaurants, limited-capacity tours, timed-entry attractions, boat trips that sell out. Do NOT flag generic things (hotels, flights, groceries). Max 3 per day. If nothing needs booking that day, omit the field entirely or use an empty array.
- urgent: true only for things that book out weeks or months ahead (e.g. Alcatraz, popular safari slots, Michelin restaurants). false for things that just benefit from a reservation a few days out.

Respond with valid JSON only:
{
  "days": [
    {
      "day": 1,
      "title": "Arrival & First Impressions",
      "morning": "Specific activity with details",
      "afternoon": "Specific activity (note nap time if applicable)",
      "evening": "Suggest a dinner neighborhood or vibe — e.g. 'Head to the Gaslamp Quarter for dinner, walkable from most hotels with kid-friendly options on Fifth Ave.' Be specific to the destination but do NOT name a single restaurant — the user will choose from curated recommendations.",
      "napNote": "Where/how to handle nap today (only if napRequired)",
      "tip": "One practical tip for today specific to this family",
      "bookingFlags": [
        {
          "item": "Specific tour or restaurant name",
          "leadTime": "Book X weeks ahead — sells out fast",
          "urgent": true
        }
      ]
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

export function buildDiningPrompt(
  inputs: TripInputs,
  destination: Destination,
  preferences: DiningPreferences,
  numDays: number
): string {
  const familyContext = buildFamilyContext(inputs);

  const cuisineVibeMap: Record<DiningPreferences['cuisineVibe'], string> = {
    local:       'Local and classic — regional specialties, tried-and-true spots the locals love',
    italian:     'Italian/Mediterranean — pasta, pizza, fresh seafood, simple flavors kids tend to love',
    asian:       'Asian — Japanese, Thai, Chinese, Vietnamese; great for adventurous family eaters',
    american:    'American comfort — burgers, BBQ, familiar food that picky kids will eat happily',
    adventurous: 'Adventurous — anything interesting; this family is up for trying something new',
  };

  const diningStyleMap: Record<DiningPreferences['diningStyle'], string> = {
    casual:  'All casual and family-friendly — no tablecloths, no stress, kids can be loud',
    mixed:   'Mix of casual spots with one nicer dinner — flexible, practical, one memorable meal',
    special: 'Lean toward nicer spots — special-occasion mode, but still manageable with kids',
  };

  return `You are a local restaurant expert building a curated dining guide for a family trip. You know ${destination.name} well — the neighborhoods, which spots genuinely work for families with young kids, and what to avoid.

${familyContext}

DESTINATION: ${destination.name}
TRIP LENGTH: ${numDays} days
CUISINE VIBE: ${cuisineVibeMap[preferences.cuisineVibe]}
DINING STYLE: ${diningStyleMap[preferences.diningStyle]}

Generate 6–8 restaurant recommendations. Include a mix across neighborhoods and price points that fits the dining style above.

CRITICAL RULES:
- Every recommendation must genuinely work for this specific family (ages, dietary needs, dining style)
- Neighborhoods must be real places in ${destination.name}
- whyItWorks: one sentence — reference something specific about THIS family (e.g. "With a 2-year-old in tow, the outdoor patio and loud buzz means nobody will notice a meltdown")
- priceRange: $ = under $15/person, $$ = $15–30, $$$ = $30–60, $$$$ = over $60
- bookingLeadTime: be realistic — e.g. "Walk-ins fine on weekdays", "Reserve 3–4 days out", "Book 2–3 weeks ahead — very popular"
- bookingUrgent: true only for places that genuinely book out weeks ahead
- bestForDay: your suggested day number (1 to ${numDays}) based on itinerary flow — optional but helpful when it's obvious (e.g. near the beach on the beach day)
- openTableQuery: the restaurant name + city as a clean search string, e.g. "Nobu Malibu Los Angeles"
- Do NOT include chains, generic hotel restaurants, or tourist traps
- Spread recommendations across neighborhoods when possible

Respond with valid JSON only:
{
  "restaurants": [
    {
      "name": "Restaurant Name",
      "neighborhood": "Neighborhood Name",
      "cuisineType": "e.g. Japanese izakaya",
      "priceRange": "$$",
      "whyItWorks": "One sentence specific to this family",
      "bestForMeal": "dinner",
      "bestForDay": 2,
      "bookingLeadTime": "Reserve 3–4 days out",
      "bookingUrgent": false,
      "openTableQuery": "Restaurant Name ${destination.name}"
    }
  ]
}`;
}

export function buildHotelPrompt(inputs: TripInputs, destination: Destination): string {
  const familyContext = buildFamilyContext(inputs);

  const accommodationVibe = inputs.vibes.accommodation;
  const isRental = accommodationVibe === 'rental';
  const isAllInclusive = accommodationVibe === 'allinclusive';

  const accommodationContext = isRental
    ? 'This family prefers vacation rentals — recommend a vacation rental, apartment, or house (NOT a hotel). They want to feel at home, not checked in.'
    : isAllInclusive
    ? 'This family prefers all-inclusive resorts — recommend a resort with meals/activities included. Convenience and having everything handled is the priority.'
    : 'This family is open to any accommodation type — recommend whatever genuinely fits best for a family at this destination (boutique hotel, apartment, or small resort).';

  const bookingPlatform = isRental ? 'airbnb' : 'booking';

  return `You are a family travel expert making a single, confident hotel recommendation. You are NOT giving a list of options — you are making THE call, like a trusted friend who knows this destination well.

${familyContext}

DESTINATION: ${destination.name}
ACCOMMODATION PREFERENCE: ${accommodationContext}

Make ONE specific recommendation. Name a real, currently operating property you're confident exists.

CRITICAL RULES:
- name: a real property — if you're not confident it exists and operates today, pick one you ARE confident about
- type: 'hotel' | 'resort' | 'boutique-hotel' | 'vacation-rental' | 'apartment'
- whyItWorks: 1-2 sentences that reference something specific about THIS family (ages, nap needs, budget, pace). Never generic.
- keyAmenities: only list amenities that matter for THIS family. Max 5. Don't list generic hotel features.
- verifyBefore: the 2-3 things this family must confirm before booking (e.g. crib availability, connecting rooms, kitchen). Max 3.
- priceRange: $ = under $150/night, $$ = $150-300, $$$ = $300-500, $$$$ = over $500
- bookingNote: one honest sentence about booking timing, seasonal demand, or anything they'd regret not knowing
- bookingPlatform: "${bookingPlatform}" (do not change this — it is determined by the family's accommodation preference)

Respond with valid JSON only:
{
  "recommendation": {
    "name": "Specific Property Name",
    "type": "boutique-hotel",
    "neighborhood": "Neighborhood, Area",
    "whyItWorks": "1-2 sentences specific to this family",
    "keyAmenities": ["Amenity 1", "Amenity 2", "Amenity 3"],
    "verifyBefore": ["Thing to verify 1", "Thing to verify 2"],
    "priceRange": "$$$",
    "bookingNote": "One honest sentence about booking timing or caveats",
    "bookingPlatform": "${bookingPlatform}"
  }
}`;
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
