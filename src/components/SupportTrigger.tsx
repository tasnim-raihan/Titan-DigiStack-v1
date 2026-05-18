import React from 'react';
import { useSupport } from '../context/SupportContext';
import { Terminal, Shield } from 'lucide-react';

export const SupportTrigger: React.FC = () => {
  const { toggleTerminal, unreadCount, isOpen } = useSupport();

  if (isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#070a13] border-t border-cyan-500/25 px-4 py-2 font-mono text-[10px] tracking-widest text-cyan-400/80 flex items-center justify-between shadow-[0_-8px_30px_rgb(0,0,0,0.8)] select-none">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-[#06b6d4] animate-ping rounded-full" />
          <span className="text-[#06b6d4] font-black uppercase">SYS_ONLINE</span>
        </span>
        <span className="hidden sm:inline text-white/40">|</span>
        <span className="hidden sm:inline text-white/50 uppercase">Secured Client Node Connection Est.</span>
      </div>

      <button
        onClick={toggleTerminal}
        aria-label="Toggle Technical Support Terminal Console"
        aria-expanded={isOpen}
        className="flex items-center gap-2 px-3 py-1 bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 hover:text-white transition-all duration-200 cursor-pointer select-none rounded-[1px] active:scale-95 text-xs font-bold"
      >
        <Terminal size={12} className="text-cyan-400" />
        <span className="uppercase tracking-wider">Engage Support HUD</span>
        <span className="text-white/40 font-light">[CTRL + /]</span>
        {unreadCount > 0 && (
          <span className="ml-1 px-1.5 py-0.5 bg-cyan-500 text-black text-[9px] font-black rounded-none animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};
