import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';

export default function BannerSlider() {
  const banners = [
    {
      id: 1,
      title: 'PROMO ROBUX CHEAPEST!',
      subtitle: 'Top up Robux 5 Hari & Instan termurah se-Indonesia',
      tag: 'HOT PROMO',
      color: 'from-sky-500 to-blue-600',
    },
    {
      id: 2,
      title: 'MEMBER VIP DISKON SULTAN',
      subtitle: 'Dapatkan potongan otomatis tiap belanja dengan join VIP',
      tag: 'SPECIAL VIP',
      color: 'from-amber-400 to-orange-500',
    },
    {
      id: 3,
      title: 'VOUCHER RILIS BCZ V4',
      subtitle: 'Gunakan kode "BCZV4" untuk potongan ekstra Rp 2.000!',
      tag: 'KODE PROMO',
      color: 'from-emerald-400 to-teal-600',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="relative overflow-hidden rounded-3xl mb-6 shadow-sm border border-sky-100">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((b) => (
          <div
            key={b.id}
            className={`w-full shrink-0 bg-gradient-to-r ${b.color} p-6 sm:p-8 text-white relative flex flex-col justify-between min-h-[160px]`}
          >
            <div className="relative z-10 max-w-lg">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-black rounded-full mb-2">
                <Tag className="w-3 h-3" /> {b.tag}
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">{b.title}</h2>
              <p className="text-xs text-white/90 mt-1">{b.subtitle}</p>
            </div>

            <div className="relative z-10 flex gap-1.5 mt-4">
              {banners.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === i ? 'w-6 bg-white' : 'w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/30 backdrop-blur-md text-white rounded-full hover:bg-white/50 transition"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/30 backdrop-blur-md text-white rounded-full hover:bg-white/50 transition"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
