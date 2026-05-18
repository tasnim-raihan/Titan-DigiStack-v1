import React, { useState, useEffect } from 'react';
import { Star, Send, Loader2, MessageSquare, User } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
}

interface ReviewSystemProps {
  productId: string;
  onRatingUpdate?: (avg: number, count: number) => void;
}

export const ReviewSystem: React.FC<ReviewSystemProps> = ({ productId, onRatingUpdate }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      
      setReviews(fetchedReviews);
      setIsLoading(false);

      if (fetchedReviews.length > 0) {
        const totalRating = fetchedReviews.reduce((acc, rev) => acc + (rev.rating || 0), 0);
        const avg = totalRating / fetchedReviews.length;
        onRatingUpdate?.(avg, fetchedReviews.length);
      } else {
        onRatingUpdate?.(0, 0);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `reviews/${productId}`);
    });

    return () => unsubscribe();
  }, [productId, onRatingUpdate]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("Please login to leave a review.");
      return;
    }

    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        productId,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Anonymous',
        userPhoto: auth.currentUser.photoURL || '',
        rating: newRating,
        comment: newComment,
        createdAt: serverTimestamp(),
      });
      setNewComment('');
      setNewRating(5);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reviews');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 border-t border-white/5 pt-12">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="text-cyan-400" size={24} />
        <h3 className="text-xl font-bold text-white uppercase tracking-tight">Customer Reviews</h3>
      </div>

      {auth.currentUser ? (
        <form onSubmit={handleSubmitReview} className="mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Rate this product:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  className={`transition-all ${newRating >= star ? 'text-yellow-500 scale-110' : 'text-gray-600 hover:text-yellow-500/50'}`}
                >
                  <Star size={20} fill={newRating >= star ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              className="w-full bg-[#0f1422] border border-white/10 rounded-xl p-4 text-white placeholder-white/20 text-sm focus:outline-none focus:border-cyan-400/50 transition-all min-h-[100px] resize-none"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="absolute bottom-4 right-4 p-2 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:hover:bg-cyan-500 text-white rounded-lg transition-all shadow-lg shadow-cyan-500/20"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-12 p-6 bg-white/5 rounded-2xl border border-dashed border-white/10 text-center">
          <p className="text-white/40 text-sm">Please login to write a review.</p>
        </div>
      )}

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-cyan-400" size={32} />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center text-white/20 italic py-8">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={review.id} 
              className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
            >
              <div className="flex-shrink-0">
                {review.userPhoto ? (
                  <img 
                    src={review.userPhoto} 
                    alt={review.userName} 
                    className="w-10 h-10 rounded-full border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/40 border border-white/10">
                    <User size={20} />
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-white">{review.userName}</h4>
                  <span className="text-[10px] text-white/40 uppercase font-medium">
                    {review.createdAt?.toDate().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-0.5 mb-2 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
                      fill={i < review.rating ? 'currentColor' : 'none'} 
                      className={i >= review.rating ? 'text-gray-700' : ''}
                    />
                  ))}
                </div>
                <p className="text-sm text-white/60 leading-relaxed">{review.comment}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
