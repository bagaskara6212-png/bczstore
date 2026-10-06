import React, { useState, useEffect } from 'react';
import { collection, query, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; // ✅ Jalur import sudah benar (satu tingkat keluar dari folder components)
import { ShoppingCart, CheckCircle2 } from 'lucide-react';

export default function RecentOrdersToast() {
  const [visible, setVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Fallback data simulasi jika belum ada pesanan real-time di Firestore
  const mockPurchases = [
    { name: 'Rian_Roblox', item: '500 Robux (5 Hari)', time: '2 menit yang lalu' },
    { name: 'Bagas_Sultan', item: '1000 Robux (Instan)', time: 'Baru saja' },
    { name: 'KevinGamerz', item: 'Blox Fruits Shadow', time: '5 menit yang lalu' },
    { name: 'Adit_Pro', item: '100 Robux (5 Hari)', time: '1 menit yang lalu' },
  ];

  useEffect(() => {
    // Mencoba mengambil data pesanan asli secara real-time dari Firestore
    const q = query(collection(db, 'orders'), limit(5));
    const unsub = onSnapshot(q, (snap) => {
      const realOrders = snap.docs.map(doc => ({
        name: doc.data().username || doc.data().email?.split('@')[0] || 'Pembeli',
        item: doc.data().productName || 'Produk Digital',
        time: 'Baru saja'
      }));

      // Menampilkan popup toast secara berkala setiap 12 detik
      const interval = setInterval(() => {
        const pool = realOrders.length > 0 ? realOrders : mockPurchases;
        const randomItem = pool[Math.floor(Math.random() * pool.length)];
        setCurrentOrder(randomItem);
        setVisible(true);

        setTimeout(() => setVisible(false), 4000);
      }, 12000);

      return () => clearInterval(interval);
    }, () => {
      // Jika error read Firestore, gunakan mock fallback
      const interval = setInterval(() => {
        const randomItem = mockPurchases[Math.floor(Math.random() * mockPurchases.length)];
        setCurrentOrder(randomItem);
        setVisible(true);

        setTimeout(() => setVisible(false), 4000);
      }, 12000);

      return () => clearInterval(interval);
    });

    return () => unsub();
  }, []);

  if (!visible || !currentOrder) return null;

  return (
    <div className="fixed bottom-20 right-5 z-30 max-w-xs bg-white dark:bg-slate-900 border border-sky-200 dark:border-slate-800 p-3 rounded-2xl shadow-xl shadow-sky-500/10 flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
      <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
        <ShoppingCart className="w-4 h-4" />
      </div>

      <div className="text-xs space-y-0.5">
        <div className="font-bold text-slate-800 dark:text-white flex items-center gap-1">
          <span>{currentOrder.name}</span>
          <CheckCircle2 className="w-3 h-3 text-emerald-500 inline" />
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Membeli <strong className="text-sky-600 dark:text-sky-400">{currentOrder.item}</strong>
        </p>
        <span className="text-[9px] text-slate-400 block font-mono">{currentOrder.time}</span>
      </div>
    </div>
  );
}
