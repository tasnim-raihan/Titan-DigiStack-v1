import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Star, CheckCircle2, Globe, Clock, Shield } from 'lucide-react';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';

import { ReviewSystem } from './ReviewSystem';
import { useState } from 'react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [ratingInfo, setRatingInfo] = useState({ avg: 0, count: 0 });

  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-[#0a0f1e] rounded-3xl border border-white/10 shadow-2xl overflow-hidden pointer-events-auto max-h-[90vh] flex flex-col"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="overflow-y-auto no-scrollbar">
            <div className="grid md:grid-cols-2">
              {/* Image Preview */}
              <div className="relative aspect-square md:aspect-auto bg-[#1a1f36] min-h-[300px]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=500&h=600&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6">
                  <span className="px-3 py-1 bg-cyan-400/20 border border-cyan-400/30 rounded-full text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2 inline-block">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-2 mb-4 text-yellow-500">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < Math.round(ratingInfo.avg || 5) ? 'currentColor' : 'none'} className={i >= Math.round(ratingInfo.avg || 5) ? 'text-gray-700' : ''} />
                    ))}
                  </div>
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                    {ratingInfo.count > 0 ? `${ratingInfo.avg.toFixed(1)} (${ratingInfo.count} Reviews)` : 'Expert Recommendation'}
                  </span>
                </div>

                <h2 className="text-3xl font-black text-white mb-6 leading-tight uppercase tracking-tighter">{product.name}</h2>

                <div className="mb-8">
                  <div className="text-4xl font-black text-cyan-400 mb-2">
                    {product.isCallForPrice ? "Call for Price" : `৳ ${product.price.toLocaleString()}`}
                  </div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">In Stock - Delivered to Account</p>
                </div>

                <p className="text-white/60 text-sm leading-relaxed mb-8">
                  {product.description} This premium digital product includes official life-time updates, secure download links, and 24/7 technical support from the Titan DigiStack team.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8 border-y border-white/5 py-8">
                  <div className="flex items-center gap-2 text-white/50 text-[11px] font-bold uppercase tracking-widest">
                    <CheckCircle2 size={16} className="text-cyan-400" />
                    <span>Licensed</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/50 text-[11px] font-bold uppercase tracking-widest">
                    <Globe size={16} className="text-cyan-400" />
                    <span>Global</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/50 text-[11px] font-bold uppercase tracking-widest">
                    <Clock size={16} className="text-cyan-400" />
                    <span>Instant</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/50 text-[11px] font-bold uppercase tracking-widest">
                    <Shield size={16} className="text-cyan-400" />
                    <span>Secure</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-grow py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all"
                  >
                    Add to Cart
                  </button>
                  <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                    Quick Buy
                  </button>
                </div>

                <p className="mt-8 text-center text-white/20 text-[10px] font-black uppercase tracking-[0.2em] pt-6">
                  Ref: DIGI-{product.id.split('-').pop()?.toUpperCase()} | {product.category}
                </p>

                {/* Review System Integration */}
                <ReviewSystem productId={product.id} onRatingUpdate={(avg, count) => setRatingInfo({ avg, count })} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>

  );
};
