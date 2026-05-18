import React from 'react';
import { CheckCircle2, ShieldCheck, Headphones, RotateCcw, Download, CreditCard } from 'lucide-react';

export const FeatureGrid = () => {
  const features = [
    { icon: <CheckCircle2 className="text-cyan-400" />, title: "Authentic Products", desc: "100% genuine digital assets with original keys." },
    { icon: <ShieldCheck className="text-cyan-400" />, title: "Official Licenses", desc: "Official verification and unlimited future updates." },
    { icon: <CreditCard className="text-cyan-400" />, title: "Secure Checkout", desc: "Advanced SSL encryption for your transactions." },
    { icon: <Headphones className="text-cyan-400" />, title: "24/7 Support", desc: "Dedicated team ready to assist you anytime." },
    { icon: <RotateCcw className="text-cyan-400" />, title: "Easy Return", desc: "7-day money back guarantee on faulty downloads." },
    { icon: <Download className="text-cyan-400" />, title: "Instant Access", desc: "Download your files immediately after payment." },
  ];

  return (
    <section className="bg-[#0f1221] shrink-0">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-white/10">
        {features.map((f, i) => (
          <div 
            key={i} 
            className="bg-[#0f1221] py-8 flex flex-col items-center justify-center gap-2 group transition-colors hover:bg-white/5"
          >
            <div className="text-cyan-400 font-bold transition-transform group-hover:scale-125 duration-300">
              {React.cloneElement(f.icon as React.ReactElement, { size: 24, className: "font-bold text-cyan-400" })}
            </div>
            <span className="text-[10px] uppercase font-semibold text-white/70 tracking-widest text-center px-4">
              {f.title}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
