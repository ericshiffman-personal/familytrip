'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TripInputs, Destination } from '@/types';

interface ResearchItem {
  title: string;
  type: string;
  notes: string;
  verifyBefore: boolean;
  verifyReason?: string;
}

interface ConsolidateResult {
  highlights: ResearchItem[];
  consolidatedTips: string[];
  redFlags: string[];
}

interface ResearchPasteProps {
  tripInputs: TripInputs;
  destination: Destination;
}

const TYPE_COLORS: Record<string, string> = {
  restaurant: 'bg-orange-100 text-orange-700',
  activity: 'bg-navy-light text-navy',
  hotel: 'bg-purple-100 text-purple-700',
  beach: 'bg-cyan-100 text-cyan-700',
  tip: 'bg-sage-light text-sage',
};

export default function ResearchPaste({ tripInputs, destination }: ResearchPasteProps) {
  const [pasted, setPasted] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConsolidateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConsolidate = async () => {
    if (!pasted.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/consolidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pastedText: pasted, tripInputs, destination }),
      });
      if (!res.ok) throw new Error('Consolidation failed');
      const data = await res.json();
      setResult(data);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!result ? (
        <div className="card p-6">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-2xl">📋</span>
            <div>
              <h3 className="font-semibold text-navy">Already done some research?</h3>
              <p className="text-ink-muted text-sm mt-1">
                Paste in anything — TripAdvisor reviews, blog posts, notes, Reddit threads.
                We&apos;ll organize it and flag anything worth double-checking.
              </p>
            </div>
          </div>

          <textarea
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
            placeholder="Paste your research here... (reviews, blog posts, your own notes, anything)"
            rows={6}
            className="w-full bg-cream border border-cream-dark rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-coral resize-none placeholder-ink-muted transition-colors mb-4"
          />

          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

          <button
            onClick={handleConsolidate}
            disabled={!pasted.trim() || loading}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
              pasted.trim() && !loading
                ? 'bg-navy hover:bg-navy-mid text-white'
                : 'bg-cream-dark text-ink-muted cursor-not-allowed'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin inline-block">⟳</span> Organizing your research...
              </span>
            ) : (
              'Consolidate my research →'
            )}
          </button>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-navy">Your research, organized</h3>
              <button
                onClick={() => { setResult(null); setPasted(''); }}
                className="text-xs text-ink-muted hover:text-ink transition-colors"
              >
                Paste more →
              </button>
            </div>

            {/* Highlights */}
            <div className="space-y-3">
              {result.highlights.map((item, idx) => (
                <div key={idx} className="card p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${TYPE_COLORS[item.type] || 'bg-cream-dark text-ink-muted'}`}>
                        {item.type}
                      </span>
                      <span className="font-semibold text-navy text-sm">{item.title}</span>
                    </div>
                    {item.verifyBefore && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex-shrink-0">
                        ⚠️ Verify
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-ink-soft leading-relaxed">{item.notes}</p>
                  {item.verifyBefore && item.verifyReason && (
                    <p className="text-xs text-amber-600 mt-2">→ {item.verifyReason}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Tips */}
            {result.consolidatedTips.length > 0 && (
              <div className="bg-coral-light rounded-2xl p-4 border border-coral/20">
                <p className="text-xs font-bold text-coral uppercase tracking-wide mb-3">💡 Key tips from your research</p>
                <ul className="space-y-2">
                  {result.consolidatedTips.map((tip, idx) => (
                    <li key={idx} className="text-sm text-ink-soft flex gap-2">
                      <span className="text-coral flex-shrink-0">·</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Red flags */}
            {result.redFlags.length > 0 && (
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-3">🚩 Worth double-checking</p>
                <ul className="space-y-2">
                  {result.redFlags.map((flag, idx) => (
                    <li key={idx} className="text-sm text-ink-soft flex gap-2">
                      <span className="text-amber-500 flex-shrink-0">·</span>
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
