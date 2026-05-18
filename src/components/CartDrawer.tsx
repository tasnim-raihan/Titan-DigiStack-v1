import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, X, Plus, Minus, Trash2, Rocket, CheckCircle2, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { cart, removeFromCart, updateQuantity, total, cartCount, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleCheckout = async () => {
    if (!auth.currentUser) {
      alert("Please login to complete your purchase.");
      return;
    }

    setIsCheckingOut(true);
    try {
      const orderData = {
        userId: auth.currentUser.uid,
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total,
        status: 'completed',
        paymentMethod: 'bKash',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleClose = () => {
    setOrderComplete(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0a0f1e] border-l border-white/10 z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center text-cyan-400">
                  <ShoppingCart size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Your Cart</h2>
                  <p className="text-gray-500 text-xs text-cyan-400 font-bold">{cartCount} Items</p>
                </div>
              </div>
              <button 
                onClick={handleClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {orderComplete ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-6"
                  >
                    <CheckCircle2 size={40} />
                  </motion.div>
                  <h3 className="text-2xl font-black text-white mb-2">Order Confirmed!</h3>
                  <p className="text-gray-400 mb-8">Thank you for your purchase. Your digital assets are ready in your account.</p>
                  <button 
                    onClick={handleClose}
                    className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-white hover:bg-white/10"
                  >
                    Close Window
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <ShoppingCart size={64} className="mb-4 text-gray-600" />
                  <p className="text-lg text-gray-500">Your cart is empty</p>
                  <button 
                    onClick={handleClose}
                    className="mt-4 text-cyan-400 text-sm font-bold underline"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-20 h-24 bg-[#1a1f36] rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=500&h=600&q=80";
                        }}
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-white font-bold text-sm mb-1 group-hover:text-cyan-400 transition-colors line-clamp-1">{item.name}</h3>
                      <p className="text-cyan-400 font-black text-sm mb-3">৳{item.price.toLocaleString()}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-[#1a1f36] border border-white/10 rounded-lg p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-white/10 rounded-md text-gray-400"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-white text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-white/10 rounded-md text-gray-400"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {!orderComplete && (
            <div className="p-8 bg-[#0f1422] border-t border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-xs">Total Amount</span>
                  <span className="text-2xl font-black text-white">৳{total.toLocaleString()}</span>
                </div>
                
                <button 
                  disabled={cart.length === 0 || isCheckingOut}
                  onClick={handleCheckout}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all disabled:opacity-50 disabled:hover:shadow-none"
                >
                  {isCheckingOut ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      Proceed to Checkout
                      <Rocket size={20} />
                    </>
                  )}
                </button>
                
                <p className="text-center text-gray-500 text-[10px] mt-4 uppercase tracking-widest font-bold">
                  🔒 Secure 256-bit SSL Encrypted Payment
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

