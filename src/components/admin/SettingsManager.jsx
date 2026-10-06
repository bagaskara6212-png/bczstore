import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Settings, Percent, Wallet, Save, MessageSquare } from 'lucide-react';

export default function SettingsManager() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    adminWa1: '',
    adminWa1Name: 'Admin 1 (Utama)',
    adminWa2: '',
    adminWa2Name: 'Admin 2 (Top Up)',
    adminWa3: '',
    adminWa3Name: 'Admin 3 (Bantuan)',
    instagram: '',
    tiktok: '',
    discord: '',
    vipDiscountPercent: 10,
    adminFee: 500,
    enableLiquidGlass: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'contacts');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setSettings((prev) => ({ ...prev, ...snap.data() }));
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'contacts'), {
        ...settings,
        vipDiscountPercent: Number(settings.vipDiscountPercent) || 0,
        adminFee: Number(settings.adminFee) || 0,
      }, { merge: true });
      alert('Pengaturan Toko, Biaya Admin & Diskon VIP berhasil disimpan!');
    } catch (err) {
      alert('Gagal menyimpan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card-babyblue p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-2xl">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white">Pengaturan Toko & Transaksi</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Kelola biaya admin, diskon VIP, dan kontak CS.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
          {/* BIAYA ADMIN */}
          <div className="space-y-3 bg-sky-50/50 dark:bg-slate-800/60 p-4 rounded-2xl border border-sky-100 dark:border-slate-700">
            <div className="flex items-center gap-2 text-sky-900 dark:text-sky-300">
              <Wallet className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h4 className="text-xs font-black uppercase tracking-wider">Pengaturan Biaya Admin (Admin Fee)</h4>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Biaya Admin per Transaksi (Rp)
              </label>
              <div className="flex items-center gap-2 max-w-xs">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Rp</span>
                <input
                  type="number"
                  name="adminFee"
                  min="0"
                  step="50"
                  placeholder="500"
                  value={settings.adminFee}
                  onChange={handleChange}
                  className="w-full input-babyblue text-xs font-bold"
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Biaya ini akan ditambahkan ke total pembayaran customer (Isi 0 jika tidak ada biaya admin).
              </p>
            </div>
          </div>

          {/* DISKON VIP */}
          <div className="space-y-3 bg-amber-50/50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200/60 dark:border-amber-800/60">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300">
              <Percent className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h4 className="text-xs font-black uppercase tracking-wider">Diskon VIP Member</h4>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Persentase Diskon VIP (%)
              </label>
              <div className="flex items-center gap-2 max-w-xs">
                <input
                  type="number"
                  name="vipDiscountPercent"
                  min="0"
                  max="100"
                  value={settings.vipDiscountPercent}
                  onChange={handleChange}
                  className="w-full input-babyblue text-xs font-bold"
                />
                <span className="text-sm font-black text-amber-600 dark:text-amber-400">%</span>
              </div>
            </div>
          </div>

          {/* SAKLAR LIQUID GLASS */}
          <div className="p-4 bg-sky-50/50 dark:bg-slate-800/60 rounded-2xl border border-sky-100 dark:border-slate-700 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-white">Apple Liquid Glass UI</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Aktifkan tema efek kaca cembung secara default.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="enableLiquidGlass"
                checked={settings.enableLiquidGlass ?? true}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
            </label>
          </div>

          {/* WHATSAPP ADMIN CS */}
          <div className="space-y-4 pt-2 border-t border-sky-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sky-800 dark:text-sky-300">
              <MessageSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h4 className="text-xs font-black uppercase tracking-wider">3 WhatsApp Admin CS</h4>
            </div>

            {[
              { num: 1, nameKey: 'adminWa1Name', waKey: 'adminWa1' },
              { num: 2, nameKey: 'adminWa2Name', waKey: 'adminWa2' },
              { num: 3, nameKey: 'adminWa3Name', waKey: 'adminWa3' },
            ].map((cs) => (
              <div key={cs.num} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-sky-50/30 dark:bg-slate-800/4
