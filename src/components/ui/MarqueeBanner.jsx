import React from 'react';
import { Rocket, Sparkles, Tag, ShieldAlert } from 'lucide-react';

export default function MarqueeBanner() {
  const announcements = [
    { text: 'FLASH SALE! DISKON 10% SEMUA ITEM', icon: Tag },
    { text: 'BCZ STORE V4.5.5 ABSOLUTE CINEMA EDITION', icon: Sparkles },
    { text: 'ROBUX INSTAN MASUK 1 DETIK', icon: Rocket },
    { text: 'GUNAKAN KODE "BCZV4" UNTUK DISKON EKSTRA', icon: ShieldAlert },
  ];

  // Duplikasi array 4x agar animasi looping seamless
  const duplicatedList = [...announcements, ...announcements, ...announcements, ...announcements];

  return (
    <div className="w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 text-white overflow-hidden py-2.5 shadow-md relative z-20">
      <div className="animate-marquee">
        {duplicatedList.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2 mx-6 shrink-0 text-xs font-black tracking-wide uppercase">
              <Icon className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
              <span className="whitespace-nowrap">{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
