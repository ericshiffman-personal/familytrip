import Link from "next/link";
import Image from "next/image";
import { getUnsplashPhoto } from "@/lib/unsplash";
import type { UnsplashPhoto } from "@/lib/unsplash";
import { WordmarkLogo, WordmarkLogoWhite } from "@/components/shared/Logo";

// Vacation style photos — fetched server-side, cached 24h.
// Four distinct trip archetypes to spark the right mental image.
const VACATION_STYLES: { query: string; label: string }[] = [
  { query: 'tropical beach turquoise water vacation',   label: 'Beach & sun'         },
  { query: 'mountain forest hiking scenic landscape',   label: 'Mountains & trails'  },
  { query: 'europe city cobblestone travel architecture', label: 'City & culture'    },
  { query: 'resort swimming pool tropical luxury',      label: 'Resort & relax'      },
];

export default async function Home() {
  // Fetch in parallel — all 4 are independent, each cached 24h
  const inspirationPhotos: { photo: UnsplashPhoto | null; label: string }[] =
    await Promise.all(
      VACATION_STYLES.map(async ({ query, label }) => ({
        photo: await getUnsplashPhoto(query),
        label,
      }))
    );

  return (
    <main className="flex flex-col min-h-screen bg-cream">

      {/* ── Nav ────────────────────────────────────────────────────── */}
      <nav className="px-6 py-3 flex items-center justify-between border-b border-cream-dark bg-white sticky top-0 z-50">
        <WordmarkLogo height={36} />
        <Link href="/plan" className="text-sm font-semibold text-coral hover:text-coral-dark transition-colors">
          Start planning →
        </Link>
      </nav>

      {/* ── Hero — clean, text on white ────────────────────────────── */}
      <section className="bg-white px-6 pt-20 pb-16 border-b border-cream-dark">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold text-coral uppercase tracking-widest mb-5">
            For families with 47 TripAdvisor tabs open
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-navy mb-6 leading-tight">
            Stop the spiral.
          </h1>
          <p className="text-ink-soft text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Tell us about your family. We&apos;ll give you a confident recommendation,
            explain every tradeoff honestly, and build a plan around your actual kids,
            nap schedules and all.
          </p>
          <Link
            href="/plan"
            className="inline-flex items-center gap-2 bg-coral hover:bg-coral-dark text-white font-semibold text-base px-8 py-4 rounded-xl transition-colors shadow-lg shadow-coral/20"
          >
            Plan my trip →
          </Link>
          <p className="mt-5 text-sm text-ink-muted">
            No account needed · About 2 minutes · It&apos;s free ·{' '}
            <Link href="/go" className="text-coral hover:text-coral-dark transition-colors underline underline-offset-2">
              Already know where you&apos;re going?
            </Link>
          </p>
        </div>
      </section>

      {/* ── Photo inspiration grid — photos breathe on their own ─────── */}
      <section className="bg-cream px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-6 text-center">
            Where will you go?
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {inspirationPhotos.map(({ photo, label }) => (
              <div key={label} className="group">
                {/* Photo card — aspect-ratio portrait, no text on top */}
                <div
                  className="relative rounded-2xl overflow-hidden bg-navy-light"
                  style={{ aspectRatio: '3 / 4' }}
                >
                  {photo ? (
                    <>
                      <Image
                        src={photo.url}
                        alt={label}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 45vw, 240px"
                      />
                      {/* Bottom-fade for attribution readability */}
                      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                      <p className="absolute bottom-2 right-2 text-white/35 text-[10px] leading-none pointer-events-auto">
                        <a
                          href={photo.photographerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-white/60 transition-colors"
                        >
                          {photo.photographer}
                        </a>
                        {' / Unsplash'}
                      </p>
                    </>
                  ) : (
                    /* Gradient placeholder when Unsplash key isn't set */
                    <div className="w-full h-full bg-gradient-to-br from-navy to-navy-mid" />
                  )}
                </div>
                {/* Label sits below the photo — never on top */}
                <p className="text-xs text-ink-soft font-medium mt-2.5 text-center">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── "Our Call" preview ─────────────────────────────────────── */}
      <section className="bg-white border-y border-cream-dark px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-6 text-center">
            What you actually get
          </p>

          <div className="card p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <span className="chip bg-navy text-white">Our Call</span>
              <span className="chip bg-confidence-high-bg text-confidence-high">High confidence</span>
            </div>

            <h3 className="font-display text-2xl font-bold text-navy mb-1">
              Pick San Diego over Vancouver.
            </h3>
            <p className="text-ink-soft text-sm leading-relaxed mb-6">
              It fits your direct-flight constraint, gives you more weather certainty,
              and has better nap-friendly hotel options for a 3-year-old.
              Vancouver is the more interesting trip, but for your stated priorities,
              San Diego is the better family vacation right now.
            </p>

            <div className="grid md:grid-cols-3 gap-3 mb-6">
              {[
                { label: "Better for naps", positive: true },
                { label: "More weather certainty", positive: true },
                { label: "Less distinctive", positive: false },
              ].map((chip) => (
                <div
                  key={chip.label}
                  className={`chip justify-center py-2 rounded-lg text-xs ${
                    chip.positive
                      ? "bg-sage-light text-sage"
                      : "bg-cream-dark text-ink-muted"
                  }`}
                >
                  {chip.positive ? "✓" : "·"} {chip.label}
                </div>
              ))}
            </div>

            <div className="bg-cream rounded-xl p-4 border-l-4 border-coral">
              <p className="text-xs font-bold text-coral uppercase tracking-wide mb-1">
                The Hidden Catch
              </p>
              <p className="text-sm text-ink-soft">
                San Diego hotel rooms near the beach are smaller than the photos suggest.
                Book a suite if two kids sharing a room is a dealbreaker.
              </p>
            </div>

            <p className="text-xs text-ink-muted mt-4 italic">
              When to ignore us: If your kids no longer nap and you care more about
              food and city energy than logistics, Vancouver becomes the better pick.
            </p>
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────── */}
      <section className="px-6 py-20 bg-cream">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-navy text-center mb-3">
            How it works
          </h2>
          <p className="text-ink-muted text-center mb-14 max-w-lg mx-auto">
            Three steps from analysis paralysis to actually booking something.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Tell us about your family",
                desc: "Ages, nap schedules, budget, activity level, and the one thing that would ruin the trip. Two minutes of specifics beats hours of generic research.",
              },
              {
                step: "02",
                title: "We make the call",
                desc: "Two options. A primary pick and an alternative. Both explained specifically for your family, not \"great for families\" platitudes.",
              },
              {
                step: "03",
                title: "Get the full plan",
                desc: "Day-by-day itinerary built around your actual kids. Personalized packing list. A place to consolidate any research you've already done.",
              },
            ].map((item) => (
              <div key={item.step} className="card p-6">
                <div className="text-xs font-bold text-coral tracking-widest mb-4 uppercase">
                  Step {item.step}
                </div>
                <h3 className="font-display text-lg font-bold text-navy mb-2">{item.title}</h3>
                <p className="text-ink-soft text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Parent Math strip ──────────────────────────────────────── */}
      <section className="bg-navy px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold text-coral uppercase tracking-widest mb-4">
            Parent Math
          </p>
          <p className="font-display text-2xl md:text-3xl font-bold text-white leading-snug">
            &ldquo;The hotel that&apos;s $90 more per night but lets you walk back for naps
            may be cheaper than daily rideshares, snack bribes, and a dinner meltdown.&rdquo;
          </p>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="bg-coral px-6 py-20 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to stop researching?
        </h2>
        <p className="text-white/75 mb-8 text-base max-w-md mx-auto">
          We&apos;ll tell you where to go, explain why, and tell you what we got wrong.
        </p>
        <Link
          href="/plan"
          className="inline-flex items-center gap-2 bg-white text-coral font-bold text-base px-8 py-4 rounded-xl hover:bg-cream transition-colors"
        >
          Start planning, it&apos;s free →
        </Link>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="bg-navy px-6 py-8 text-center">
        <div className="flex flex-col items-center gap-2">
          <WordmarkLogoWhite height={28} />
          <p className="text-white/30 text-xs">Plan around naps, snacks, and real life.</p>
        </div>
      </footer>

    </main>
  );
}
