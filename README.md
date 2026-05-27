# FamilyTrip

**Stop researching. Start going.**

A travel planning app for families who overthink everything. FamilyTrip acts like a trusted friend who's already done all the research — it gives confident, personalized destination recommendations and builds a full plan tailored to your actual kids.

---

## The Problem

Parents planning family travel face a specific kind of paralysis: endless TripAdvisor tabs, competing blog recommendations, outdated reviews, and no way to filter for what actually matters to *their* family — a 22-month-old who still naps, a 4-hour maximum flight time, and a beach without riptides.

Generic travel sites overwhelm with options. AI chatbots give generic answers. Neither acts like a trusted friend who's been there, done that, and knows your family.

---

## The Solution

FamilyTrip takes in the specific details that matter — kids' ages, nap schedules, budget feel, what would ruin the trip — and comes back with **two confident recommendations**, not forty. Then it builds the whole plan: day-by-day itinerary, personalized packing list, and a consolidation tool for any research you've already done.

### Core features
- **Interactive vibe quiz** — hot-or-not style card pairs to capture preferences without a boring form
- **Personalized recommendations** — two destinations with reasoning tied to your actual family profile
- **Day-by-day itinerary** — accounts for nap schedules, age-appropriate activities, and real logistics
- **Packing list** — tailored to destination, kids' ages, and planned activities (not a generic list)
- **Research consolidator** — paste your TripAdvisor notes and we'll organize them into your plan
- **Family profile memory** — saves your family details locally so the form pre-fills next visit

---

## Target User

**Primary:** Parents of children ages 0–12 who experience analysis paralysis when planning family travel. They are thorough researchers who want more information but feel overwhelmed by it. They value confidence and specificity over exhaustive options.

**Secondary:** Grandparents and extended family groups coordinating multi-generational trips.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 14 (App Router) | Industry standard, great for portfolio, Vercel-native |
| Language | TypeScript | Type safety, better IDE support, professional signal |
| Styling | Tailwind CSS v4 | Fast iteration, consistent design system |
| Animations | Framer Motion | Card interactions and page transitions |
| AI | Claude API (claude-sonnet) | Best-in-class instruction following for personalized prompts |
| Storage | localStorage / sessionStorage | Zero backend needed for MVP — profile persists locally |
| Deploy | Vercel + GitHub | Auto-deploy on push, shareable URL, portfolio-visible |

---

## Key Product Decisions & Tradeoffs

**LLM knowledge first, verify second**
Rather than building real-time review scraping (which hits TripAdvisor ToS issues and adds cost/complexity), we use Claude's trained knowledge for initial recommendations and offer an optional "verify before booking" step. This keeps the MVP fast and cheap while being honest about limitations.

**Two options, not forty**
The whole point is reducing overload. Showing 8–12 destination cards would recreate the TripAdvisor problem. Two options with clear reasoning forces confidence.

**localStorage profile, no accounts**
For MVP, family profiles are saved to the browser. This eliminates authentication complexity, keeps it zero-friction, and is easy to upgrade to full accounts later. The tradeoff: profiles don't follow you across devices.

**Prompts as the core product**
The Claude prompts in `lib/prompts.ts` are where differentiation lives. Generic prompts produce generic outputs — the prompts are engineered to reference specific family inputs in every response.

---

## Project Structure

```
app/              # Next.js pages and API routes
  page.tsx        # Homepage
  plan/           # Multi-step intake flow
  results/        # A/B destination recommendations
  trip/[slug]/    # Itinerary, packing list, research consolidator
  api/            # Claude API endpoints
components/
  intake/         # Vibe cards, family form, trip details, deal-breakers
  results/        # Destination recommendation cards
  trip/           # Itinerary days, packing list, research paste
  shared/         # Progress steps
lib/
  claude.ts       # Anthropic SDK wrapper
  prompts.ts      # All AI prompt templates
  profile.ts      # localStorage utilities
types/
  index.ts        # TypeScript interfaces
```

---

## Running Locally

```bash
# 1. Clone and install
git clone https://github.com/yourusername/familytrip
cd familytrip
npm install

# 2. Add your API key
cp .env.example .env.local
# Edit .env.local and paste your ANTHROPIC_API_KEY

# 3. Run the dev server
npm run dev
# Open http://localhost:3000
```

Get your Anthropic API key at [console.anthropic.com](https://console.anthropic.com).

---

## Roadmap

- [x] **v0.1** — Core loop: intake → recommendations → itinerary + packing list
- [ ] **v0.2** — Web verification step (check specific claims before booking)
- [ ] **v0.3** — Trip sharing (send plan to co-traveler)
- [ ] **v1.0** — Full user accounts with saved trips
- [ ] **v1.1** — Affiliate booking integrations (hotels, activities, gear)

---

## About

Built by a product marketer learning to ship AI products. The goal: solve a real problem I actually have, using tools that are both learnable and genuinely portfolio-worthy.
