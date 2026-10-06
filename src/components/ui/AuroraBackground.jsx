import React from 'react';

export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-500">
      {/* Background Utama */}
      <div className="absolute inset-0 bg-sky-50/80 dark:bg-slate-950/80 backdrop-blur-[100px] z-10"></div>
      
      {/* Blob Cahaya Bergerak */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky-400/40 dark:bg-sky-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] animate-blob"></div>
      
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-indigo-400/40 dark:bg-indigo-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] animate-blob animation-delay-2000"></div>
      
      <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-emerald-400/30 dark:bg-emerald-900/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] animate-blob animation-delay-4000"></div>

      <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] bg-purple-400/30 dark:bg-purple-900/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] animate-blob animation-delay-6000"></div>
    </div>
  );
}
