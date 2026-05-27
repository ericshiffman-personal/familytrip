import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-cream">

      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-cream-dark bg-white sticky top-0 z-50">
        <span className="font-display text-xl font-bold text-navy tracking-tight">
          family<span className="text-coral">trip</span>
        </span>
        <Link href="/plan" className="text-sm font-semibold text-coral hover:text-coral-dark transition-colors">
          Start planning →
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 md:py-36 page-enter">
        <div className="inline-flex items-center gap-2 bg-navy-light text-navy text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-wide uppercase">
          For the parents with 47 TripAdvisor tabs open
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold text-navy leading-tight max-w-4xl mb-6">
          We'll make<br />
          <span className="text-coral">the call.</span>
        </h1>

        <p className="text-lg md:text-xl text-ink-soft max-w-xl mb-10 leading-relaxed">
          Tell us about your family. We'll give you a confident recommendation,
          explain every tradeoff honestly, and build a plan around your actual kids —
          nap schedules and all.
        </p>

        <Link
          href="/plan"
          className="inline-flex items-center gap-3 bg-coral hover:bg-coral-dark text-white font-semibold text-base px-8 py-4 rounded-xl transition-colors shadow-lg shadow-coral/20"
        >
          Plan our trip
          <span>→</span>
        </Link>

        <p className="mt-5 text-sm text-ink-muted">
          Free · No account needed · About 2 minutes
        </p>
      </section>

      {/* Our Call preview */}
      <section className="bg-white border-y border-cream-dark px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-6 text-center">
            What you actually get
          </p>

          {/* Sample "Our Call" card */}
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
              Vancouver is the more interesting trip — but for your stated priorities,
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
              <p className="text-xs font-bold text-ink-muted uppercase tracking-wide mb-1">
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

      {/* How it works */}
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
                desc: "Two options. A primary pick and an alternative. Both explained specifically for your family — not \"great for families\" platitudes.",
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

      {/* Parent Math strip */}
      <section className="bg-navy px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold text-coral uppercase tracking-widest mb-4">
            Parent Math
          </p>
          <p className="font-display text-2xl md:text-3xl font-bold text-white leading-snug">
            "The hotel that&apos;s $90 more per night but lets you walk back for naps
            may be cheaper than daily rideshares, snack bribes, and a dinner meltdown."
          </p>
        </div>
      </section>

      {/* CTA */}
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
          Start planning — it&apos;s free →
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-navy px-6 py-8 text-center">
        <p className="text-white/30 text-sm">
          family<span className="text-coral/60">trip</span> · Opinionated travel planning for real families
        </p>
      </footer>

    </main>
  );
}
