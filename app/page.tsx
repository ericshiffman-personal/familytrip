import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-sand-dark bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <span className="text-xl font-bold text-deep tracking-tight">
          family<span className="text-coral">trip</span>
        </span>
        <Link
          href="/plan"
          className="text-sm font-medium text-coral hover:text-coral-dark transition-colors"
        >
          Start planning →
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 md:py-32 page-enter">
        <div className="inline-flex items-center gap-2 bg-coral-light text-coral text-sm font-medium px-4 py-1.5 rounded-full mb-8">
          <span>✈️</span>
          <span>For the parents who have 47 TripAdvisor tabs open</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-deep leading-tight max-w-4xl mb-6">
          Stop researching.{" "}
          <span className="text-coral">Start going.</span>
        </h1>

        <p className="text-lg md:text-xl text-deep/60 max-w-2xl mb-10 leading-relaxed">
          FamilyTrip acts like a trusted friend who&apos;s already done all the research.
          Tell us about your family — we&apos;ll give you one confident recommendation,
          a full itinerary, and a packing list tailored to your actual kids.
        </p>

        <Link
          href="/plan"
          className="inline-flex items-center gap-3 bg-coral hover:bg-coral-dark text-white font-semibold text-lg px-8 py-4 rounded-2xl transition-colors shadow-lg shadow-coral/25"
        >
          Plan our trip
          <span className="text-xl">→</span>
        </Link>

        <p className="mt-5 text-sm text-deep/40">
          Free to use · No account needed · Takes about 2 minutes
        </p>
      </section>

      {/* How it works */}
      <section className="bg-white px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-deep text-center mb-4">
            How it works
          </h2>
          <p className="text-deep/50 text-center mb-14 max-w-xl mx-auto">
            Three steps from spinning out to actually booking.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                emoji: "🎯",
                title: "Tell us about your family",
                desc: "Kids' ages, nap schedules, activity level, budget, and the one thing that would ruin the trip. Takes 2 minutes.",
              },
              {
                step: "02",
                emoji: "🗺️",
                title: "Get two confident picks",
                desc: "Not 47 options — two. A primary recommendation and one alternative, both explained specifically for your family.",
              },
              {
                step: "03",
                emoji: "📋",
                title: "Get the full plan",
                desc: "Day-by-day itinerary, personalized packing list, and a place to paste your own research so we can consolidate it.",
              },
            ].map((item) => (
              <div key={item.step} className="relative p-6 rounded-2xl border border-sand-dark bg-sand">
                <div className="text-xs font-bold text-coral/60 tracking-widest mb-3">
                  STEP {item.step}
                </div>
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="font-bold text-deep text-lg mb-2">{item.title}</h3>
                <p className="text-deep/55 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="bg-sand-dark px-6 py-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-deep/50 text-sm font-medium mb-6 tracking-wide">
            BUILT FOR PARENTS WHO...
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "...have a toddler who still naps",
              "...need a beach with calm water",
              "...can&apos;t handle a 10-hour flight",
              "...want to hike but not too far from the car",
              "...need &apos;just book it&apos; confidence",
            ].map((tag) => (
              <span
                key={tag}
                className="bg-white text-deep/70 text-sm px-4 py-2 rounded-full border border-sand-dark"
                dangerouslySetInnerHTML={{ __html: tag }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-coral px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to actually book something?
        </h2>
        <p className="text-white/70 mb-8 text-lg max-w-md mx-auto">
          Answer a few questions and we&apos;ll tell you exactly where to go.
        </p>
        <Link
          href="/plan"
          className="inline-flex items-center gap-2 bg-white text-coral font-bold text-lg px-8 py-4 rounded-2xl hover:bg-sand transition-colors"
        >
          Start planning — it&apos;s free →
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-deep text-white/40 px-6 py-8 text-center text-sm">
        <p>
          family<span className="text-coral/70">trip</span> · Built with ❤️ for overplanners everywhere
        </p>
      </footer>
    </main>
  );
}
