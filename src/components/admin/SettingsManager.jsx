import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Settings, Percent, Wallet, Save, Shield, MessageSquare } from 'lucide-react';

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
    adminFee: 500, // Default Biaya Admin Rp 500
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
          <div className="p-2.5 bg-sky-100 text-sky-600 rounded-2xl">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-sky-900">Pengaturan Toko & Transaksi</h3>
            <p className="text-xs text-slate-500">Kelola biaya admin, diskon VIP, dan kontak CS.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
          {/* FITUR BIAYA ADMIN (ADMIN FEE) */}
          <div className="space-y-3 bg-sky-50/80 p-4 rounded-2xl border border-sky-100">
            <div className="flex items-center gap-2 text-sky-900">
              <Wallet className="w-4 h-4 text-sky-600" />
              <h4 className="text-xs font-black uppercase tracking-wider">Pengaturan Biaya Admin (Admin Fee)</h4>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Biaya Admin per Transaksi (Rp)
              </label>
              <div className="flex items-center gap-2 max-w-xs">
                <span className="text-xs font-bold text-slate-500">Rp</span>
                <input
                  type="number"
                  name="adminFee"
                  min="0"
                  step="50"
                  placeholder="500"
                  value={settings.adminFee}
                  onChange={handleChange}
                  className="w-full input-babyblue text-xs font-bold bg-white"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Biaya ini akan ditambahkan ke total pembayaran customer (Isi 0 jika tidak ada biaya admin).
              </p>
            </div>
          </div>

          {/* Seksi Diskon VIP */}
          <div className="space-y-3 bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-2 text-amber-900">
              <Percent className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-black uppercase tracking-wider">Diskon VIP Member</h4>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
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
                  className="w-full input-babyblue text-xs font-bold bg-white"
                />
                <span className="text-sm font-black text-amber-600">%</span>
              </div>
            </div>
          </div>

          {/* Saklar Liquid Glass */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800">Apple Liquid Glass UI</h4>
              <p className="text-[11px] text-slate-500">Aktifkan tema efek kaca cembung secara default.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="enableLiquidGlass"
                checked={settings.enableLiquidGlass ?? true}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
            </label>
          </div>

          {/* Seksi WhatsApp Admin CS */}
          <div className="space-y-4 pt-2 border-t border-sky-100">
            <div className="flex items-center gap-2 text-sky-800">
              <MessageSquare className="w-4 h-4 text-sky-600" />
              <h4 className="text-xs font-black uppercase tracking-wider">3 WhatsApp Admin CS</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white rounded-2xl border border-sky-100">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nama Admin 1</label>
                <input
                  type="text"
                  name="adminWa1Name"
                  value={settings.adminWa1Name || ''}
                  onChange={handleChange}
                  className="w-full input-babyblue text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">No. WA Admin 1 (628xxx)</label>
                <input
                  type="text"
                  name="adminWa1"
                  placeholder="6281234567890"
                  value={settings.adminWa1 || ''}
                  onChange={handleChange}
                  className="w-full input-babyblue text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white rounded-2xl border border-sky-100">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nama Admin 2</label>
                <input
                  type="text"
                  name="adminWa2Name"
                  value={settings.adminWa2Name || ''}
                  onChange={handleChange}
                  className="w-full input-babyblue text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">No. WA Admin 2 (628xxx)</label>
                <input
                  type="text"
                  name="adminWa2"
                  placeholder="6281234567890"
                  value={settings.adminWa2 || ''}
                  onChange={handleChange}
                  className="w-full input-babyblue text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white rounded-2xl border border-sky-100">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nama Admin 3</label>
                <input
                  type="text"
                  name="adminWa3Name"
                  value={settings.adminWa3Name || ''}
                  onChange={handleChange}
                  className="w-full input-babyblue text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">No. WA Admin 3 (628xxx)</label>
                <input
                  type="text"
                  name="adminWa3"
                  placeholder="6281234567890"
                  value={settings.adminWa3 || ''}
                  onChange={handleChange}
                  className="w-full input-babyblue text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-babyblue text-xs font-bold flex items-center gap-2">
            <Save className="w-4 h-4" />
            {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </form>
      </div>
    </div>
  );
}
