import React from 'react';
import { ShieldCheck, Search, Star, ArrowRight } from 'lucide-react';

export default function Hero({ onExplore }) {
  const reviews = [
    { name: 'Rian_Roblox21', text: 'Top up 500 Robux 5 Hari lancar jaya! Kalkulator pajaknya pas banget.', rating: 5 },
    { name: 'Bagas_Sultan', text: 'Pake voucher BCZV4 langsung dapet diskon Rp 2.000, proses kilat abis WA admin!', rating: 5 },
    { name: 'KevinGamerz', text: 'Webnya aesthetic biru susu keren banget, fast respon adminnya baik.', rating: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* BANNER PROMO UTAMA */}
      <div className="card-babyblue p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-xl">
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-200/50 dark:border-sky-800/50">
            <ShieldCheck className="w-3.5 h-3.5 inline mr-1" /> Platform Top-Up Robux #1 Indonesia
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Top Up Robux & Game Assets Super Cepat & Aman
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Dapatkan Robux Instan (via Login) dan Robux 5-Hari (via Gamepass Tax 30%) dengan harga termurah, tanpa biaya tersembunyi!
          </p>
          <button onClick={onExplore} className="btn-babyblue px-5 py-2.5 text-xs font-bold flex items-center gap-2">
            Jelajahi Produk <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* LACAK PESANAN */}
      <div className="card-babyblue p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/10 text-sky-500 rounded-2xl">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 dark:text-white">Lacak Status Pesanan</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Ketik Order ID kamu untuk cek status tanpa perlu login</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="CONTOH: BCZ-X89K2L"
            className="input-babyblue text-xs w-full sm:w-56"
          />
          <button className="btn-babyblue px-4 py-2.5 text-xs font-bold shrink-0">
            Cek Status
          </button>
        </div>
      </div>

      {/* TESTIMONI PEMBELI */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
            Ulasan & Testimoni Pembeli
          </h3>
          <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" /> 4.9/5.0 Rating Toko
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((rev, idx) => (
            <div key={idx} className="card-babyblue p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white">{rev.name}</span>
                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">"{rev.text}"</p>
              <span className="text-[9px] font-bold text-emerald-500 block">✓ Terverifikasi Pembeli</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
