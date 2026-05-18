import React from 'react';
import { Rocket, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#14182a] border-t border-white/5 py-8 px-8 flex flex-col md:flex-row items-center justify-between shrink-0">
      <div className="text-[10px] text-white/40 uppercase tracking-widest mb-4 md:mb-0">
        &copy; 2024 Titan DigiStack. ALL RIGHTS RESERVED.
      </div>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex gap-2 items-center">
          <span className="text-[8px] uppercase font-bold text-white/30 tracking-widest">Payments:</span>
          <div className="flex gap-1">
            {['BKASH', 'NAGAD', 'ROCKET', 'VISA'].map((m) => (
              <div key={m} className={`w-10 h-6 rounded-sm flex items-center justify-center text-[8px] font-bold text-white ${
                m === 'BKASH' ? 'bg-pink-600' : m === 'NAGAD' ? 'bg-orange-600' : m === 'ROCKET' ? 'bg-indigo-600' : 'bg-blue-500'
              }`}>
                {m}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          <span className="text-[10px] text-white/60 hover:text-cyan-400 cursor-pointer transition-colors uppercase font-bold tracking-tighter">Privacy Policy</span>
          <span className="text-[10px] text-white/60 hover:text-cyan-400 cursor-pointer transition-colors uppercase font-bold tracking-tighter">Terms</span>
          <span className="text-[10px] text-white/60 hover:text-cyan-400 cursor-pointer transition-colors uppercase font-bold tracking-tighter">Contact</span>
        </div>
      </div>
    </footer>
  );
};
