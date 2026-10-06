import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';

export default function LoadingScreen() {
  const [shapeIndex, setShapeIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(0);

  // Daftar Bentuk Geometri Interaktif (Persegi, Segitiga, Segilima, Lingkaran)
  const shapes = [
    { name: 'Persegi', style: 'rounded-none rotate-45' },
    { name: 'Segitiga', style: '[clip-path:polygon(50%_0%,_0%_100%,_100%_100%)]' },
    { name: 'Segilima', style: '[clip-path:polygon(50%_0%,_100%_38%,_82%_100%,_18%_100%,_0%_38%)]' },
    { name: 'Lingkaran', style: 'rounded-full' },
  ];

  // Daftar Facts Random (Sains, Sepak Bola, Roblox & Gaming)
  const facts = [
    "Gravitasi menarik semua benda massa ke pusat bumi.",
    "Iker Casillas dan Gianluigi Buffon diakui sebagai salah satu kiper terbaik sepanjang masa.",
    "Roblox pertama kali dirilis pada tahun 2006 dengan nama awal DynaBlocks.",
    "Cahaya matahari membutuhkan waktu sekitar 8 menit 20 detik untuk sampai ke Bumi.",
    "Gitaris atau musisi yang berlatih rutin memiliki struktur otak yang lebih fleksibel.",
    "Robux 5 Hari memerlukan waktu pending 5 hari dari Roblox sebelum resmi masuk ke saldo.",
    "Satu-satunya mamalia yang benar-benar bisa terbang secara aktif adalah kelelawar.",
    "Oliver Kahn adalah satu-satunya kiper dalam sejarah yang memenangkan Golden Ball di Piala Dunia.",
    "Air panas bisa membeku lebih cepat daripada air dingin dalam kondisi tertentu (Efek Mpemba).",
    "BCZ Store V4.5.5 dilengkapi fitur QRIS Auto Countdown 5 Menit dan Multi-CS Admin!"
  ];

  // Berganti bentuk setiap 1.2 detik
  useEffect(() => {
    const shapeInterval = setInterval(() => {
      setShapeIndex((prev) => (prev + 1) % shapes.length);
    }, 1200);
    return () => clearInterval(shapeInterval);
  }, [shapes.length]);

  // Berganti facts setiap 3 detik
  useEffect(() => {
    const factInterval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % facts.length);
    }, 3000);
    return () => clearInterval(factInterval);
  }, [facts.length]);

  return (
    <div className="fixed inset-0 z-50 bg-sky-50/90 dark:bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none transition-colors duration-300">
      
      {/* ANIMASI SHAPE MORPHING DENGAN BALOK/RING INTERAKTIF */}
      <div className="relative w-32 h-32 flex items-center justify-center mb-8">
        {/* Outer Ring Rotating Glow */}
        <div className="absolute inset-0 rounded-full border-4 border-dashed border-sky-400 dark:border-sky-500 animate-spin-slow opacity-60"></div>

        {/* Dynamic Geometric Block */}
        <div
          className={`w-20 h-20 bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 shadow-xl shadow-sky-500/30 transition-all duration-700 ease-in-out transform hover:scale-110 flex items-center justify-center ${shapes[shapeIndex].style}`}
        >
          {/* Inner Core Pulsing Sparkle */}
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
        </div>

        {/* Orbiting Satellite Dots */}
        <div className="absolute -top-1 left-1/2 w-3 h-3 bg-amber-400 rounded-full animate-ping"></div>
        <div className="absolute -bottom-1 left-1/2 w-3 h-3 bg-emerald-400 rounded-full animate-ping delay-300"></div>
      </div>

      {/* TEXT BRANDING LOADING */}
      <div className="space-y-1 mb-6">
        <h3 className="text-base font-black text-slate-800 dark:text-white tracking-wider flex items-center justify-center gap-2">
          <span>MEMUAT BCZ STORE</span>
          <RefreshCw className="w-4 h-4 text-sky-500 animate-spin" />
        </h3>
        <p className="text-[11px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">
          Menyiapkan Ekosistem V4.5.5...
        </p>
      </div>

      {/* FACTS CARD CONTAINER */}
      <div className="max-w-md w-full p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-sky-100 dark:border-slate-800 shadow-lg shadow-sky-500/5 animate-in fade-in zoom-in duration-300">
        <div className="text-[10px] font-extrabold text-amber-500 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
          💡 Tahukah Kamu?
        </div>
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed min-h-[36px] flex items-center justify-center">
          "{facts[factIndex]}"
        </p>
      </div>

    </div>
  );
}
