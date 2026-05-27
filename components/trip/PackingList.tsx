'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PackingCategory } from '@/types';

interface PackingListProps {
  categories: PackingCategory[];
}

export default function PackingList({ categories }: PackingListProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="card p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-navy">Packing progress</span>
          <span className="text-sm text-coral font-bold">{checkedCount}/{totalItems}</span>
        </div>
        <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
          <div
            className="h-full bg-coral rounded-full transition-all duration-300"
            style={{ width: `${totalItems > 0 ? (checkedCount / totalItems) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Categories */}
      {categories.map((cat, catIdx) => (
        <motion.div
          key={cat.category}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: catIdx * 0.06 }}
          className="card overflow-hidden"
        >
          <div className="px-5 py-3 border-b border-cream-dark flex items-center gap-2 bg-cream/50">
            <span className="text-lg">{cat.emoji}</span>
            <span className="font-semibold text-navy text-sm">{cat.category}</span>
            <span className="ml-auto text-xs text-ink-muted">
              {cat.items.filter((item) => checked[`${cat.category}:${item}`]).length}/{cat.items.length}
            </span>
          </div>
          <div className="divide-y divide-cream-dark">
            {cat.items.map((item) => {
              const key = `${cat.category}:${item}`;
              const isChecked = checked[key] || false;
              return (
                <button
                  key={key}
                  onClick={() => toggle(key)}
                  className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-cream transition-colors"
                >
                  <div
                    className={`w-5 h-5 rounded-md flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                      isChecked
                        ? 'bg-coral border-coral'
                        : 'border-cream-dark'
                    }`}
                  >
                    {isChecked && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <span
                    className={`text-sm leading-snug transition-colors ${
                      isChecked ? 'text-ink-muted line-through' : 'text-ink-soft'
                    }`}
                  >
                    {item}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
