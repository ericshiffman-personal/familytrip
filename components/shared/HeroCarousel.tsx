'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { UnsplashPhoto } from '@/lib/unsplash';

interface HeroCarouselProps {
  photos: UnsplashPhoto[];
}

const ROTATE_INTERVAL_MS = 6000;

export default function HeroCarousel({ photos }: HeroCarouselProps) {
  const [idx, setIdx] = useState(0);

  // Auto-advance
  useEffect(() => {
    if (photos.length <= 1) return;
    const timer = setInterval(() => {
      setIdx((i) => (i + 1) % photos.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [photos.length]);

  const current = photos[idx];

  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 py-28 md:py-40 min-h-[72vh] overflow-hidden">

      {/* Background photos — crossfade between them */}
      <AnimatePresence initial={false}>
        <motion.div
          key={idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {current ? (
            <Image
              src={current.url}
              alt={current.altDescription || 'Beautiful travel destination'}
              fill
              priority={idx === 0}
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-navy via-navy-mid to-teal-900" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay — ensures white text is always readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy/75 via-navy/50 to-navy/80 pointer-events-none" />

      {/* Hero content */}
      <div className="relative z-10 page-enter">
        <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-wide uppercase">
          For the parents with 47 TripAdvisor tabs open
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight max-w-4xl mb-6">
          We&apos;ll make<br />
          <span className="text-coral">the call.</span>
        </h1>

        <p className="text-lg md:text-xl text-white/80 max-w-xl mb-10 leading-relaxed">
          Tell us about your family. We&apos;ll give you a confident recommendation,
          explain every tradeoff honestly, and build a plan around your actual kids —
          nap schedules and all.
        </p>

        <Link
          href="/plan"
          className="inline-flex items-center gap-3 bg-coral hover:bg-coral-dark text-white font-semibold text-base px-8 py-4 rounded-xl transition-colors shadow-xl shadow-coral/30"
        >
          Plan our trip
          <span>→</span>
        </Link>

        <p className="mt-5 text-sm text-white/45">
          Free · No account needed · About 2 minutes
        </p>
      </div>

      {/* Carousel position dots */}
      {photos.length > 1 && (
        <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2 z-10">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === idx ? 'bg-white w-6' : 'bg-white/35 w-1.5 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}

      {/* Unsplash attribution — required by API guidelines */}
      {current && (
        <div className="absolute bottom-4 right-5 z-10">
          <p className="text-white/30 text-xs">
            Photo by{' '}
            <a
              href={current.photographerUrl}
              className="hover:text-white/60 underline underline-offset-2 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {current.photographer}
            </a>
            {' '}on{' '}
            <a
              href={current.unsplashUrl}
              className="hover:text-white/60 underline underline-offset-2 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>
          </p>
        </div>
      )}
    </section>
  );
}
