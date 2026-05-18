import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User as FirebaseUser, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useWishlist } from '../context/WishlistContext';
import { User, Settings, Package, Heart, LogOut, Shield, Bell, CreditCard, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from '../data/products';

interface UserProfileProps {
  onQuickView: (product: Product) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onQuickView }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'wishlist' | 'orders' | 'settings'>('overview');
  const { wishlist } = useWishlist();

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!user) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center bg-[#1a1f36] p-12 rounded-2xl border border-white/10 shadow-2xl max-w-md w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
          <User size={64} className="mx-auto text-cyan-500/50 mb-6" />
          <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-3">Please Log In</h2>
          <p className="text-white/60 text-sm mb-8">Access your profile, wishlist, and past orders.</p>
          <div className="animate-pulse flex space-x-4 justify-center">
            <div className="h-2 w-2 bg-cyan-500 rounded-full"></div>
            <div className="h-2 w-2 bg-blue-500 rounded-full animation-delay-200"></div>
            <div className="h-2 w-2 bg-purple-500 rounded-full animation-delay-400"></div>
          </div>
        </div>
      </div>
    );
  }

  type TabId = 'overview' | 'wishlist' | 'orders' | 'settings';
  interface Tab {
    id: TabId;
    label: string;
    icon: React.ElementType;
    count?: number;
  }

  const TABS: Tab[] = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlist.length },
    { id: 'orders', label: 'Purchase History', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex-grow flex flex-col lg:flex-row gap-8 max-w-[1600px] mx-auto px-4 lg:px-8 py-8 lg:py-12 w-full">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 shrink-0">
        <div className="bg-[#1a1f36] rounded-2xl border border-white/10 overflow-hidden sticky top-24">
          <div className="p-6 bg-gradient-to-br from-[#1a1f36] to-[#0a0f1e] border-b border-white/5 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <img 
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=0D8ABC&color=fff`} 
              alt="Profile" 
              className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)] relative z-10"
              referrerPolicy="no-referrer"
            />
            <h3 className="text-lg font-black text-white truncate relative z-10">{user.displayName || 'Creator'}</h3>
            <p className="text-xs text-white/40 truncate relative z-10">{user.email}</p>
          </div>
          
          <nav className="p-3 space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                  activeTab === tab.id 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/20' 
                    : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <tab.icon size={18} className={activeTab === tab.id ? 'text-cyan-400' : 'text-white/40 group-hover:text-white transition-colors'} />
                  <span className="text-sm font-bold tracking-tight">{tab.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {tab.count !== undefined && (
                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-black">{tab.count}</span>
                  )}
                  <ChevronRight size={14} className={activeTab === tab.id ? 'opacity-100' : 'opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0 transition-all'} />
                </div>
              </button>
            ))}
          </nav>

          <div className="p-3 border-t border-white/5">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-8">Dashboard Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-[#1a1f36] p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Heart size={48} /></div>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Saved Items</p>
                    <p className="text-3xl font-black text-white">{wishlist.length}</p>
                  </div>
                  <div className="bg-[#1a1f36] p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Package size={48} /></div>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Total Orders</p>
                    <p className="text-3xl font-black text-white">0</p>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 p-6 rounded-2xl border border-cyan-500/30 relative overflow-hidden">
                    <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">Titan VIP Status</p>
                    <p className="text-xl font-black text-white mb-2">Member</p>
                    <p className="text-[10px] text-white/60">Upgrade to Pro for exclusive assets.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Your Wishlist</h2>
                  <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-bold text-white/60">{wishlist.length} Items</span>
                </div>
                
                {wishlist.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                    {wishlist.map(product => (
                      <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#1a1f36] border border-white/5 rounded-2xl p-12 text-center">
                    <Heart size={48} className="mx-auto text-white/10 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Your wishlist is empty</h3>
                    <p className="text-sm text-white/40">Explore the marketplace and save your favorite digital products.</p>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-8">Purchase History</h2>
                <div className="bg-[#1a1f36] border border-white/5 rounded-2xl p-12 text-center">
                  <Package size={48} className="mx-auto text-white/10 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">No orders yet</h3>
                  <p className="text-sm text-white/40">When you purchase digital products, they will appear here with download links.</p>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-8">Account Settings</h2>
                <div className="bg-[#1a1f36] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                  <div className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl group-hover:scale-110 transition-transform"><Shield size={20} /></div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Password & Security</h4>
                        <p className="text-[11px] text-white/40 mt-1">Manage your password and 2FA</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-white/20 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <div className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl group-hover:scale-110 transition-transform"><Bell size={20} /></div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Notifications</h4>
                        <p className="text-[11px] text-white/40 mt-1">Email alerts and newsletters</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-white/20 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <div className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-500/10 text-green-400 rounded-xl group-hover:scale-110 transition-transform"><CreditCard size={20} /></div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Billing Information</h4>
                        <p className="text-[11px] text-white/40 mt-1">Payment methods and invoices</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-white/20 group-hover:text-green-400 transition-colors" />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
