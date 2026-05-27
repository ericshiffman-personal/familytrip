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
      <div className="bg-white rounded-2xl p-4 border border-sand-dark">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-deep">Packing progress</span>
          <span className="text-sm text-coral font-bold">{checkedCount}/{totalItems}</span>
        </div>
        <div className="h-2 bg-sand-dark rounded-full overflow-hidden">
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
          className="bg-white rounded-2xl border border-sand-dark overflow-hidden"
        >
          <div className="px-5 py-3 border-b border-sand-dark flex items-center gap-2">
            <span className="text-lg">{cat.emoji}</span>
            <span className="font-semibold text-deep text-sm">{cat.category}</span>
            <span className="ml-auto text-xs text-deep/30">
              {cat.items.filter((item) => checked[`${cat.category}:${item}`]).length}/{cat.items.length}
            </span>
          </div>
          <div className="divide-y divide-sand">
            {cat.items.map((item) => {
              const key = `${cat.category}:${item}`;
              const isChecked = checked[key] || false;
              return (
                <button
                  key={key}
                  onClick={() => toggle(key)}
                  className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-sand/50 transition-colors"
                >
                  <div
                    className={`w-5 h-5 rounded-md flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                      isChecked
                        ? 'bg-coral border-coral'
                        : 'border-sand-dark'
                    }`}
                  >
                    {isChecked && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <span
                    className={`text-sm leading-snug transition-colors ${
                      isChecked ? 'text-deep/30 line-through' : 'text-deep/80'
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
