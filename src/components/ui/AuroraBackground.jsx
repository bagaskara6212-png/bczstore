import React from 'react';

export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-500 select-none">
      {/* Base Background: Biru Susu Terang di Light Mode & Dark Slate di Dark Mode */}
      <div className="absolute inset-0 bg-sky-50 dark:bg-slate-950 backdrop-blur-[100px] z-10 transition-colors duration-500" />

      {/* Orbs Glowing */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky-300/40 dark:bg-sky-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[90px] animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[450px] h-[450px] bg-blue-300/30 dark:bg-indigo-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] left-[15%] w-[550px] h-[550px] bg-teal-200/30 dark:bg-emerald-600/15 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[110px] animate-blob animation-delay-4000" />
    </div>
  );
}
