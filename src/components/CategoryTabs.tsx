import React from 'react';
import { CATEGORIES } from '../data/products';

interface CategoryTabsProps {
  activeCategory: string;
  onSelect: (category: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeCategory, onSelect }) => {
  return (
    <div className="bg-[#14182a] border-b border-white/5 px-8 shrink-0">
      <div className="flex gap-8 py-3 text-[11px] font-bold uppercase tracking-wider overflow-x-auto no-scrollbar whitespace-nowrap">
        <button
          onClick={() => onSelect('All')}
          className={`pb-3 transition-all cursor-pointer ${
            activeCategory === 'All'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-white/60 hover:text-white border-b-2 border-transparent'
          }`}
        >
          All Items
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`pb-3 transition-all cursor-pointer ${
              activeCategory === cat
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-white/60 hover:text-white border-b-2 border-transparent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
