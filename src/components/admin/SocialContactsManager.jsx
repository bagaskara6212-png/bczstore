import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { MessageCircle, Plus, Trash2 } from 'lucide-react';

export default function SocialContactsManager() {
  const [tiktokUsername, setTiktokUsername] = useState('bczstore_official');
  const [adminList, setAdminList] = useState([
    { name: 'Admin Bagas', number: '6281234567890' },
    { name: 'Admin Carlo', number: '6289876543210' },
    { name: 'Admin Zidan', number: '6285554443330' }
  ]);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminNumber, setNewAdminNumber] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      const snap = await getDoc(doc(db, 'settings', 'contacts'));
      if (snap.exists()) {
        const data = snap.data();
        if (data.tiktokUsername) setTiktokUsername(data.tiktokUsername);
        if (data.adminList && data.adminList.length > 0) setAdminList(data.adminList);
      }
    };
    fetchContacts();
  }, []);

  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (!newAdminName || !newAdminNumber) return;
    setAdminList([...adminList, { name: newAdminName.trim(), number: newAdminNumber.trim() }]);
    setNewAdminName('');
    setNewAdminNumber('');
  };

  const handleRemoveAdmin = (index) => {
    setAdminList(adminList.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'contacts'), {
        tiktokUsername,
        adminList
      }, { merge: true });
      alert('Kontak TikTok & Multi-Admin WA Berhasil Disimpan!');
    } catch (err) {
      alert('Gagal menyimpan: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card-babyblue p-6 bg-white dark:bg-slate-900 border dark:border-slate-800 space-y-4">
      <h3 className="text-sm font-black text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
        <MessageCircle className="w-4 h-4 text-emerald-500" /> Pengaturan TikTok & Multi-Admin WA
      </h3>

      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
            Username TikTok (Tanpa @)
          </label>
          <input
            type="text"
            value={tiktokUsername}
            onChange={(e) => setTiktokUsername(e.target.value)}
            className="w-full input-babyblue text-xs dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="space-y-2 pt-2 border-t border-sky-100 dark:border-slate-800">
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300">
            Daftar Admin WA Terdaftar:
          </label>

          <div className="space-y-2">
            {adminList.map((adm, idx) => (
              <div key={idx} className="p-3 bg-sky-50/70 dark:bg-slate-800/70 rounded-2xl border border-sky-100 dark:border-slate-700 flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{adm.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">+{adm.number}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAdmin(idx)}
                  className="p-1.5 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleAddAdmin} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">+ Tambah Kontak Admin WA</span>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Nama Admin (misal: Admin Zidan)"
              value={newAdminName}
              onChange={(e) => setNewAdminName(e.target.value)}
              className="input-babyblue text-xs dark:bg-slate-900 dark:text-white"
            />
            <input
              type="text"
              placeholder="Nomor WA (628...)"
              value={newAdminNumber}
              onChange={(e) => setNewAdminNumber(e.target.value)}
              className="input-babyblue text-xs dark:bg-slate-900 dark:text-white"
            />
          </div>
          <button type="submit" className="w-full bg-sky-500 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Tambah
          </button>
        </form>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-2xl shadow-sm transition"
        >
          {saving ? 'Memproses...' : 'Simpan Semua Kontak'}
        </button>
      </div>
    </div>
  );
}
