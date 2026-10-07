import React from 'react';
import { Rocket, Sparkles, Tag, ShieldAlert } from 'lucide-react';

export default function MarqueeBanner() {
  const announcements = [
    { text: 'FLASH SALE! DISKON 10% SEMUA ITEM', icon: Tag },
    { text: 'BCZ STORE V4.5.5 ABSOLUTE CINEMA EDITION', icon: Sparkles },
    { text: 'ROBUX INSTAN MASUK 1 DETIK', icon: Rocket },
    { text: 'GUNAKAN KODE "BCZV4" UNTUK DISKON EKSTRA', icon: ShieldAlert },
  ];

  const duplicatedList = [...announcements, ...announcements, ...announcements, ...announcements];

  return (
    <div className="w-full h-10 bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 text-white overflow-hidden relative z-20 flex items-center shadow-md">
      <div className="flex flex-row items-center whitespace-nowrap animate-marquee shrink-0">
        {duplicatedList.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex flex-row items-center gap-2 mx-6 shrink-0 text-xs font-black tracking-wide uppercase">
              <Icon className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
              <span className="whitespace-nowrap">{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
