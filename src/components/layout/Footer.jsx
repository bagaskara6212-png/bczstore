import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { ShieldCheck, MessageCircle, ChevronDown, Heart } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  const [contacts, setContacts] = useState({
    tiktokUsername: "bczstore_official",
    adminList: [
      { name: "Admin Bagas", number: "6281234567890" },
      { name: "Admin Carlo", number: "6289876543210" },
      { name: "Admin Zidan", number: "6285554443330" },
    ]
  });

  const [showWaMenu, setShowWaMenu] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'contacts'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setContacts({
          tiktokUsername: data.tiktokUsername || "bczstore_official",
          adminList: data.adminList && data.adminList.length > 0 ? data.adminList : [
            { name: "Admin Bagas", number: "6281234567890" },
            { name: "Admin Carlo", number: "6289876543210" },
            { name: "Admin Zidan", number: "6285554443330" }
          ]
        });
      }
    });
    return () => unsub();
  }, []);

  return (
    <footer className="liquid-glass border-t border-sky-100/50 dark:border-slate-800/80 py-10 transition-colors mt-16 relative z-20">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 text-white flex items-center justify-center font-black text-base shadow-lg shadow-sky-500/30 shrink-0">
              BCZ
            </div>
            <div>
              <div className="font-black text-slate-800 dark:text-white text-base flex items-center gap-2 justify-center sm:justify-start">
                <span>BCZ Store</span>
                <span className="text-[10px] bg-sky-500/10 text-sky-600 dark:text-sky-400 font-extrabold px-2.5 py-0.5 rounded-full border border-sky-200/50 dark:border-sky-800/50">
                  V4.5.5 Cinema
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Platform Top Up Robux & Digital Assets Termurah, Tercepat, & Terpercaya.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={`https://www.tiktok.com/@${contacts.tiktokUsername}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-sky-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2 transition-all hover:-translate-y-0.5 border border-sky-100 dark:border-slate-700 shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.56-1.31 1.54-1.28 2.53.01.95.53 1.86 1.34 2.37.82.52 1.9.58 2.76.17.84-.39 1.41-1.23 1.47-2.16.03-3.69.01-7.38.01-11.07z"/>
              </svg>
              <span>TikTok</span>
            </a>

            <div className="relative">
              <button
                onClick={() => setShowWaMenu(!showWaMenu)}
                className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WA Admin</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showWaMenu ? 'rotate-180' : ''}`} />
              </button>

              {showWaMenu && (
                <div className="absolute right-0 bottom-12 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-sky-100 dark:border-slate-700 p-2 z-50 space-y-1 animate-slide-up">
                  <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase">Pilih CS Admin:</div>
                  {contacts.adminList.map((adm, idx) => (
                    <a
                      key={idx}
                      href={`https://wa.me/${adm.number}?text=Halo%20${encodeURIComponent(adm.name)},%20saya%20butuh%20bantuan`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setShowWaMenu(false)}
                      className="w-full text-left p-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 flex items-center gap-2 transition"
                    >
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span>{adm.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-sky-100/50 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex gap-6 font-bold text-xs">
            <button onClick={() => setActiveTab('beranda')} className="hover:text-sky-500 transition">Beranda</button>
            <button onClick={() => setActiveTab('produk')} className="hover:text-sky-500 transition">Produk</button>
            <button onClick={() => setActiveTab('alltools')} className="hover:text-sky-500 transition">All Tools</button>
            <button onClick={() => setActiveTab('pesanan')} className="hover:text-sky-500 transition">Pesanan</button>
            <button onClick={() => setActiveTab('bantuan')} className="hover:text-sky-500 transition">Bantuan</button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>© 2026 BCZ Store. Crafted with <Heart className="w-3 h-3 text-rose-500 inline fill-current" /> for Gamers.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
