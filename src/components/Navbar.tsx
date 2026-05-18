import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Rocket, LogOut, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export const Navbar = ({ 
  onCartClick, 
  onMenuClick, 
  onLogoClick,
  onProfileClick 
}: { 
  onCartClick: () => void; 
  onMenuClick?: () => void;
  onLogoClick?: () => void;
  onProfileClick?: () => void;
}) => {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#1a1f36] text-white border-b border-white/10 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer" onClick={onLogoClick}>
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="font-bold text-xl text-white">T</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold tracking-tight text-white">Titan <span className="text-cyan-400">DigiStack</span></h1>
          </div>
        </div>

        {/* Search */}
        <div className="flex-grow max-w-md relative group hidden md:block mx-10">
          <input
            type="text"
            placeholder="Search digital products..."
            className="w-full bg-[#14182a] border border-white/10 rounded-full py-2 px-5 text-sm focus:outline-none focus:border-cyan-400/50 transition-all duration-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 italic text-xs pointer-events-none">
            e.g. Elementor
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors md:hidden text-cyan-400"
          >
            <Search size={22} />
          </button>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div 
                onClick={onProfileClick}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group"
              >
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=0D8ABC&color=fff`} alt="" className="w-7 h-7 rounded-full border border-cyan-500/50" referrerPolicy="no-referrer" />
                <span className="text-sm font-medium hidden lg:block">{user.displayName?.split(' ')[0] || 'User'}</span>
                <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-red-500/10 text-red-400 rounded-full transition-colors hidden sm:block"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="flex items-center gap-1 px-4 py-1.5 bg-cyan-500 hover:bg-cyan-600 rounded-full transition-all text-sm font-bold shadow-lg shadow-cyan-500/20"
            >
              <User size={18} />
              <span>Login</span>
            </button>
          )}

          <button 
            className="relative p-2 hover:bg-white/10 rounded-full transition-colors group"
          >
            <Heart size={22} className="group-hover:scale-110 transition-transform" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                {wishlistCount}
              </span>
            )}
          </button>

          <button 
            onClick={onCartClick}
            className="relative p-2 hover:bg-white/10 rounded-full transition-colors group"
          >
            <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          <button 
            onClick={onMenuClick}
            className="p-2 hover:bg-white/10 rounded-full transition-colors lg:hidden text-white"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-[#1a1f36] border-b border-white/10 p-4 shadow-xl z-50"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search digital products..."
                autoFocus
                className="w-full bg-[#14182a] border border-cyan-400/30 rounded-full py-2.5 px-5 text-sm focus:outline-none focus:border-cyan-400 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

