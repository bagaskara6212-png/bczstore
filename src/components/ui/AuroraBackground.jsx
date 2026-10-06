import React from 'react';

export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-700 select-none">
      {/* 1. LAYER BASE AMBIENT (Biru Susu Cerah di Light Mode & Midnight Deep Navy di Dark Mode) */}
      <div className="absolute inset-0 bg-sky-100/80 dark:bg-slate-950/90 backdrop-blur-[100px] z-10 transition-colors duration-700" />

      {/* 2. GLOW ORB 1: Sky / Electric Cyan (Pojok Kiri Atas) */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] 
                   bg-sky-400/40 dark:bg-sky-500/25 
                   rounded-full mix-blend-multiply dark:mix-blend-screen 
                   filter blur-[90px] animate-blob" 
      />

      {/* 3. GLOW ORB 2: Indigo / Royal Violet (Pojok Kanan Atas) */}
      <div 
        className="absolute top-[15%] right-[-10%] w-[480px] h-[480px] 
                   bg-indigo-400/35 dark:bg-indigo-600/30 
                   rounded-full mix-blend-multiply dark:mix-blend-screen 
                   filter blur-[100px] animate-blob animation-delay-2000" 
      />

      {/* 4. GLOW ORB 3: Emerald / Mint Glow (Pojok Kiri Bawah) */}
      <div 
        className="absolute bottom-[-15%] left-[15%] w-[600px] h-[600px] 
                   bg-emerald-300/35 dark:bg-emerald-600/20 
                   rounded-full mix-blend-multiply dark:mix-blend-screen 
                   filter blur-[110px] animate-blob animation-delay-4000" 
      />

      {/* 5. GLOW ORB 4: Purple / Cyber Glow (Pojok Kanan Bawah) */}
      <div 
        className="absolute bottom-[5%] right-[5%] w-[420px] h-[420px] 
                   bg-purple-300/30 dark:bg-purple-600/25 
                   rounded-full mix-blend-multiply dark:mix-blend-screen 
                   filter blur-[95px] animate-blob animation-delay-6000" 
      />

      {/* 6. OVERLAY TEXTURE GRID / NOISE TIPIS (Efek Cinema Tambahan) */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] dark:opacity-[0.05] z-15" />
    </div>
  );
}
