import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  Layout, 
  Settings, 
  Palette, 
  Zap, 
  Cpu, 
  BookOpen, 
  Globe, 
  Smartphone,
  Box,
  ChevronDown,
  X
} from 'lucide-react';
import { CATEGORIES, INITIAL_PRODUCTS } from '../data/products';

interface SidebarProps {
  activeCategory: string;
  onSelect: (category: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "WordPress Themes": <Layout size={18} />,
  "WordPress Plugins": <Settings size={18} />,
  "Graphic Tools": <Palette size={18} />,
  "AI & Subscriptions": <Zap size={18} />,
  "Software & Apps": <Cpu size={18} />,
  "Tutorials": <BookOpen size={18} />,
  "Digital Services": <Globe size={18} />,
  "eBooks & Entertainment": <Smartphone size={18} />,
};

export const Sidebar: React.FC<SidebarProps> = ({ activeCategory, onSelect, isOpen, onClose }) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleExpand = (category: string) => {
    setExpanded(expanded === category ? null : category);
  };

  const getProductsByCategory = (category: string) => {
    return INITIAL_PRODUCTS.filter(p => p.category === category).slice(0, 5);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`fixed lg:sticky top-0 lg:top-16 left-0 z-[70] lg:z-10 h-[100dvh] lg:h-[calc(100vh-64px)] w-72 bg-[#14182a] lg:border-r border-white/5 overflow-y-auto no-scrollbar transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-white/5 mb-2">
          <span className="font-black text-cyan-400 tracking-widest uppercase text-[10px]">Categories</span>
          <button onClick={onClose} className="p-2 -mr-2 text-white/60 hover:text-white rounded-full hover:bg-white/5 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 pt-0 lg:pt-6">
        <div className="flex items-center gap-2 mb-8 px-2">
          <Box size={18} className="text-cyan-400" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Product Catalog</h3>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => {
              onSelect('All');
              setExpanded(null);
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all group ${
              activeCategory === 'All' 
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/20' 
                : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={activeCategory === 'All' ? 'text-cyan-400' : 'text-white/20'}>
                <Box size={18} />
              </span>
              <span className="text-sm font-bold tracking-tight">All Products</span>
            </div>
          </button>

          {CATEGORIES.map((cat) => (
            <div key={cat} className="space-y-1">
              <button
                onClick={() => {
                  onSelect(cat);
                  toggleExpand(cat);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all group ${
                  activeCategory === cat 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/20' 
                    : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={activeCategory === cat ? 'text-cyan-400' : 'text-white/20 group-hover:text-white/40 transition-colors'}>
                    {CATEGORY_ICONS[cat] || <Box size={18} />}
                  </span>
                  <span className="text-sm font-bold tracking-tight">{cat}</span>
                </div>
                {expanded === cat ? <ChevronDown size={14} className="opacity-40" /> : <ChevronRight size={14} className="opacity-20 group-hover:opacity-40 transition-all" />}
              </button>

              <AnimatePresence>
                {expanded === cat && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-[#0a0f1e]/50 rounded-lg mx-2 border border-white/5"
                  >
                    <div className="py-2 px-3 space-y-1">
                      {getProductsByCategory(cat).map((product) => (
                        <button
                          key={product.id}
                          className="w-full text-left py-2 px-3 text-[11px] font-medium text-white/30 hover:text-cyan-400 hover:bg-white/5 rounded-md transition-all truncate"
                        >
                          {product.name}
                        </button>
                      ))}
                      <button 
                        onClick={() => onSelect(cat)}
                        className="w-full text-center py-2 text-[9px] font-black uppercase tracking-widest text-cyan-400/40 hover:text-cyan-400 transition-colors mt-1"
                      >
                        Explore More
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="bg-[#1a1f36] p-4 rounded-xl border border-white/10 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-all" />
            <h4 className="text-white text-xs font-black uppercase tracking-widest mb-2 relative z-10">Premium Support</h4>
            <p className="text-[10px] text-white/40 leading-relaxed mb-4 relative z-10">Need a custom digital solution? Our experts are here to help.</p>
            <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all border border-white/10">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};
