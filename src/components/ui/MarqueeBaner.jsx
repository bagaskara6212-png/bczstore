import React from 'react';
import { Zap, Sparkles, Flame, Rocket } from 'lucide-react';

export default function MarqueeBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 text-white overflow-hidden py-1.5 relative z-40 shadow-md">
      <div className="flex items-center gap-12 animate-marquee text-[10px] sm:text-xs font-black uppercase tracking-widest cursor-default">
        <span className="flex items-center gap-2">
          <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" /> 
          Flash Sale! Diskon 10% Semua Item
        </span>
        <span className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" /> 
          BCZ Store V4.5.5 Absolute Cinema Edition
        </span>
        <span className="flex items-center gap-2">
          <Rocket className="w-3.5 h-3.5 text-amber-300" /> 
          Robux Instan Masuk 1 Detik
        </span>
        <span className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse" /> 
          Gunakan Kode "BCZV4" Untuk Ekstra Diskon!
        </span>
      </div>
    </div>
  );
}
