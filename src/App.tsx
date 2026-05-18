/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeatureGrid } from './components/FeatureGrid';
import { CategoryTabs } from './components/CategoryTabs';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { INITIAL_PRODUCTS, Product } from './data/products';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from './components/UserProfile';

import { Sidebar } from './components/Sidebar';
import { SupportProvider, useSupport } from './context/SupportContext';
import { SupportTrigger } from './components/SupportTrigger';
import { SupportTerminal } from './components/SupportTerminal';

function MarketplaceContent() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'marketplace' | 'profile'>('marketplace');
  const { toggleTerminal } = useSupport();

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        toggleTerminal();
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [toggleTerminal]);

  const filteredProducts = activeCategory === 'All' 
    ? INITIAL_PRODUCTS 
    : INITIAL_PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0f1221] text-gray-100 font-sans selection:bg-cyan-500 selection:text-white flex flex-col">
      <Navbar 
        onCartClick={() => setIsCartOpen(true)} 
        onMenuClick={() => setIsMobileSidebarOpen(true)} 
        onLogoClick={() => setCurrentView('marketplace')}
        onProfileClick={() => setCurrentView('profile')}
      />
      
      <main className="flex-grow flex flex-col">
        {currentView === 'profile' ? (
          <UserProfile onQuickView={setSelectedProduct} />
        ) : (
          <>
            <Hero />
            <FeatureGrid />
            
            <div className="flex max-w-[1600px] mx-auto px-4 lg:px-8 w-full">
          <Sidebar 
            activeCategory={activeCategory} 
            onSelect={(cat) => { setActiveCategory(cat); setIsMobileSidebarOpen(false); }} 
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
          />
          
          <div className="flex-grow">


            {/* Marketplace Section */}
            <section className="py-8 lg:py-12 lg:pl-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                    {activeCategory === 'All' ? 'Complete Catalog' : activeCategory}
                  </h2>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">
                    Showing {filteredProducts.length} Results
                  </p>
                </div>
                <div className="flex gap-2">
                  <select className="bg-[#1a1f36] border border-white/10 rounded-lg px-4 py-2 text-xs font-bold text-white/60 focus:outline-none focus:border-cyan-500/50 cursor-pointer">
                    <option>Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest</option>
                  </select>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeCategory}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-6"
                >
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onQuickView={setSelectedProduct}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>

              {filteredProducts.length === 0 && (
                <div className="py-40 text-center">
                  <p className="text-white/40 text-lg uppercase font-bold tracking-widest">No products found</p>
                </div>
              )}

              <div className="mt-16 text-center border-t border-white/5 pt-12">
                <button className="px-12 py-3 bg-[#1a1f36] border border-white/10 rounded-lg font-bold text-xs uppercase tracking-widest text-white/60 hover:text-white hover:border-cyan-500/50 transition-all">
                  Load More Products
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* Newsletter Section */}
        <section className="py-20 bg-[#1a1f36] border-y border-white/5">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <div className="inline-block px-4 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-4">Newsletter</div>
            <h2 className="text-4xl font-extrabold text-white mb-4 uppercase tracking-tighter">Join Our <span className="text-cyan-400">Premium</span> List</h2>
            <p className="text-white/60 mb-8 text-sm">Exclusive deals and official updates delivered straight to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto bg-[#14182a] p-1.5 rounded-xl border border-white/10 shadow-2xl">
              <input 
                type="email" 
                placeholder="Your email address..." 
                className="flex-grow bg-transparent border-none focus:ring-0 px-6 py-2.5 text-white placeholder-white/30 text-sm font-medium"
              />
              <button className="px-8 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-lg shadow-cyan-500/20 transition-all">
                Subscribe
              </button>
            </div>
            <p className="mt-6 text-gray-600 text-xs font-medium">Join 50,000+ digital creators already on board. Unsubscribe anytime.</p>
          </div>
        </section>
        </>
        )}
      </main>

      <Footer />

      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
      
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

      <SupportTrigger />
      <SupportTerminal />
    </div>
  );
}

export default function App() {
  return (
    <WishlistProvider>
      <CartProvider>
        <SupportProvider>
          <MarketplaceContent />
        </SupportProvider>
      </CartProvider>
    </WishlistProvider>
  );
}

