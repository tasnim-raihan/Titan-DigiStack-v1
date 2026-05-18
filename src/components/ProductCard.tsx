import React from 'react';
import { ShoppingCart, Eye, Star, Heart } from 'lucide-react';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion } from 'motion/react';

import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [rating, setRating] = useState<{ avg: number; count: number } | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'reviews'), where('productId', '==', product.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setRating(null);
        return;
      }
      const reviews = snapshot.docs.map(d => d.data());
      const avg = reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length;
      setRating({ avg, count: reviews.length });
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'reviews');
    });
    return () => unsubscribe();
  }, [product.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white/5 hover:bg-white/[0.07] border border-white/10 hover:border-cyan-400/30 transition-all rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex flex-col group cursor-pointer relative backdrop-blur-sm overflow-hidden"
      onClick={() => onQuickView(product)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <button 
        onClick={toggleWishlist}
        className="absolute top-6 right-6 z-10 p-2.5 bg-black/50 backdrop-blur-md rounded-full text-white/70 hover:text-red-500 hover:bg-black/70 transition-all border border-white/10 hover:scale-110"
      >
        <Heart size={16} fill={isInWishlist(product.id) ? "currentColor" : "none"} className={isInWishlist(product.id) ? "text-red-500" : ""} />
      </button>

      <div className="relative aspect-[4/5] bg-gradient-to-br from-[#1a1f36] to-[#0a0f1e] rounded-lg sm:rounded-xl mb-3 sm:mb-5 flex items-center justify-center overflow-hidden border border-white/5 shadow-inner">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=500&h=600&q=80";
          }}
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 sm:gap-3 backdrop-blur-[2px]">
          <button 
            onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2.5 bg-cyan-500 text-white rounded-md sm:rounded-lg hover:bg-cyan-400 transition-all transform translate-y-4 group-hover:translate-y-0 text-[9px] sm:text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            <Eye size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Quick View</span>
            <span className="sm:hidden">View</span>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2.5 bg-white/10 text-white border border-white/20 rounded-md sm:rounded-lg hover:bg-white/20 transition-all transform translate-y-4 group-hover:translate-y-0 delay-75 text-[9px] sm:text-xs font-bold uppercase tracking-widest backdrop-blur-md"
          >
            <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
        {rating && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-1.5 py-1 sm:px-2 sm:py-1 bg-black/70 backdrop-blur-md rounded-md flex items-center gap-1 sm:gap-1.5 text-yellow-500 border border-white/10 shadow-lg">
            <Star size={10} className="sm:w-3 sm:h-3" fill="currentColor" />
            <span className="text-[10px] sm:text-xs font-extrabold text-white">{rating.avg.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow relative z-10">
        <h3 className="text-xs sm:text-sm font-bold line-clamp-2 leading-snug mb-1.5 sm:mb-2 text-white/90 group-hover:text-cyan-400 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-4 text-yellow-500/30">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={10} fill={rating && i < Math.round(rating.avg) ? 'currentColor' : 'none'} className={rating && i < Math.round(rating.avg) ? 'text-yellow-500' : ''} />
          ))}
          {rating && <span className="text-[10px] font-medium text-white/40 ml-1.5">({rating.count} reviews)</span>}
        </div>

        <div className="flex justify-between items-end mt-auto pt-3 sm:pt-4 border-t border-white/5">
          <div>
            <p className="text-[8px] sm:text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 sm:mb-1.5">Starting at</p>
            <div className="text-cyan-400 font-black text-sm sm:text-lg leading-none">
              {product.isCallForPrice ? (
                <span className="text-[10px] sm:text-sm uppercase tracking-wider">Call Price</span>
              ) : (
                <span>৳ {product.price.toLocaleString()}</span>
              )}
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
            className="p-2.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20 hover:bg-cyan-500 hover:text-white text-cyan-400 transition-all group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

