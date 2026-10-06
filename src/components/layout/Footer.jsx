import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { ShieldCheck, MessageCircle, ChevronDown } from 'lucide-react';

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
    <footer className="bg-sky-50 dark:bg-slate-950 border-t border-sky-200/80 dark:border-slate-800 py-8 transition-colors duration-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* LOGO BRAND */}
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-sky-500/20 shrink-0">
              BCZ
            </div>
            <div>
              <div className="font-black text-slate-800 dark:text-white text-sm flex items-center gap-1.5 justify-center sm:justify-start">
                <span>BCZ Store</span>
                <span className="text-[10px] bg-sky-200/80 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-extrabold px-2 py-0.5 rounded-md border border-sky-300/50 dark:border-sky-800">
                  V4.5.5 Stable
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Platform Top Up Robux & Digital Assets Termurah & Terpercaya.
              </p>
            </div>
          </div>

          {/* SOCIAL MEDIA & DROPDOWN MULTI-ADMIN WA */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* TIKTOK */}
            <a
              href={`https://www.tiktok.com/@${contacts.tiktokUsername}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-sky-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2 transition-all hover:-translate-y-0.5 border border-sky-200/80 dark:border-slate-800 shadow-xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.56-1.31 1.54-1.28 2.53.01.95.53 1.86 1.34 2.37.82.52 1.9.58 2.76.17.84-.39 1.41-1.23 1.47-2.16.03-3.69.01-7.38.01-11.07z"/>
              </svg>
              <span>TikTok</span>
            </a>

            {/* WA MULTI-ADMIN DROPDOWN BUTTON */}
            <div className="relative">
              <button
                onClick={() => setShowWaMenu(!showWaMenu)}
                className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WA Admin</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showWaMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* LIST PILIHAN ADMIN */}
              {showWaMenu && (
                <div className="absolute right-0 bottom-12 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-sky-200 dark:border-slate-800 p-2 z-50 space-y-1 animate-in fade-in zoom-in duration-150">
                  <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase">Pilih CS Admin:</div>
                  {contacts.adminList.map((adm, idx) => (
                    <a
                      key={idx}
                      href={`https://wa.me/${adm.number}?text=Halo%20${encodeURIComponent(adm.name)},%20saya%20butuh%20bantuan`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setShowWaMenu(false)}
                      className="w-full text-left p-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-2 transition"
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

        {/* BOTTOM NAV */}
        <div className="pt-4 border-t border-sky-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex gap-4 font-bold text-[11px]">
            <button onClick={() => setActiveTab('beranda')} className="hover:text-sky-500 transition">Beranda</button>
            <button onClick={() => setActiveTab('produk')} className="hover:text-sky-500 transition">Produk</button>
            <button onClick={() => setActiveTab('pesanan')} className="hover:text-sky-500 transition">Pesanan</button>
            <button onClick={() => setActiveTab('bantuan')} className="hover:text-sky-500 transition">Bantuan</button>
          </div>

          <div className="flex items-center gap-1.5 text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>© 2026 BCZ Store. Powered by React & Firebase.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
