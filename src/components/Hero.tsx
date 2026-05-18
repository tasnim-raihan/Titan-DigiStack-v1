import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Gamepad2, ArrowRight, ShieldCheck } from 'lucide-react';

export const Hero = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative bg-[#1a1f36] px-12 py-8 min-h-[350px] flex items-center overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 bg-gradient-to-l from-cyan-500/30 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full text-cyan-400 text-xs font-semibold mb-6">
            <span className="animate-pulse">●</span> SPECIAL OFFER: GEMINI VEO 3
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-extrabold leading-none mb-4 uppercase tracking-tighter text-white">
            ULTIMATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">DIGITAL TOOLS</span>
          </h2>
          
          <p className="text-white/60 text-sm mb-8 max-w-lg">
            Exclusive licenses for WordPress, AI Subscriptions, and Creative Assets at prices you won't believe. Guaranteed official support.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all">
              SHOP NOW
            </button>
            
            <div className="flex gap-2 text-center">
              <div className="bg-white/5 p-2 rounded-md border border-white/10 w-12">
                <div className="text-lg font-bold text-white leading-none">{timeLeft.hours.toString().padStart(2, '0')}</div>
                <div className="text-[8px] opacity-50 uppercase text-white/50">Hrs</div>
              </div>
              <div className="bg-white/5 p-2 rounded-md border border-white/10 w-12">
                <div className="text-lg font-bold text-white leading-none">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                <div className="text-[8px] opacity-50 uppercase text-white/50">Min</div>
              </div>
              <div className="bg-white/5 p-2 rounded-md border border-white/10 w-12">
                <div className="text-lg font-bold text-cyan-400 leading-none">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                <div className="text-[8px] opacity-50 uppercase text-white/50">Sec</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative hidden md:flex justify-end"
        >
          <div className="w-72 h-48 bg-[#14182a] rounded-xl border border-white/10 p-6 flex flex-col justify-center items-center shadow-2xl relative rotate-3 transition-transform hover:rotate-0 duration-500">
            <div className="absolute -top-4 -right-4 bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-lg rotate-12">70% OFF</div>
            <div className="text-4xl font-black text-cyan-400">ChatGPT</div>
            <div className="text-xl text-white/40">Go Edition</div>
            <div className="mt-4 text-2xl font-bold text-white">৳ 350.00</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
