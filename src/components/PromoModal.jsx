import React, { useState, useEffect } from 'react';
import { Tag, X, Sparkles, Copy, Check } from 'lucide-react';

export default function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const hasSeenPromo = sessionStorage.getItem('bcz_seen_promo_v455');
    if (!hasSeenPromo) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('bcz_seen_promo_v455', 'true');
    setIsOpen(false);
  };

  const handleCopyVoucher = () => {
    navigator.clipboard.writeText('BCZV4');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-sky-100 dark:border-slate-800 relative animate-in fade-in zoom-in duration-200 text-center space-y-4">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-sky-50 dark:bg-slate-800 p-2 rounded-full transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 bg-gradient-to-tr from-amber-400 to-amber-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
          <Sparkles className="w-7 h-7 animate-bounce" />
        </div>

        <div>
          <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-full text-[10px] font-black tracking-wider uppercase border border-amber-200 dark:border-amber-800">
            Special Event V4.5.5
          </span>
          <h3 className="text-lg font-black text-slate-800 dark:text-white mt-2">
            Diskon Spesial Rilis!
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gunakan kode voucher di bawah ini untuk potongan harga langsung pada setiap transaksi Robux!
          </p>
        </div>

        {/* BOX KODE VOUCHER */}
        <div className="p-3.5 bg-sky-50 dark:bg-slate-800 rounded-2xl border border-dashed border-sky-300 dark:border-sky-700 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300 font-mono font-black text-sm">
            <Tag className="w-4 h-4 text-sky-500" />
            <span>BCZV4</span>
          </div>
          <button
            onClick={handleCopyVoucher}
            className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Tersalin' : 'Salin'}
          </button>
        </div>

        <button
          onClick={handleClose}
          className="w-full btn-babyblue text-xs font-bold py-3 shadow-md"
        >
          Klaim & Belanja Sekarang
        </button>
      </div>
    </div>
  );
}
