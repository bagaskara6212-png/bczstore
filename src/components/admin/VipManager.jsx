import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export default function VipManager() {
  const [vipMembers, setVipMembers] = useState([]);
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'vipMembers'), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setVipMembers(list);
    });
    return () => unsub();
  }, []);

  const handleAddVip = async (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setLoading(true);
    const cleanEmail = emailInput.trim().toLowerCase();

    try {
      await setDoc(doc(db, 'vipMembers', cleanEmail), {
        email: cleanEmail,
        status: 'active',
        createdAt: serverTimestamp(),
      });
      setEmailInput('');
      alert(`Berhasil menambahkan ${cleanEmail} sebagai member VIP!`);
    } catch (err) {
      alert('Gagal menambah VIP: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveVip = async (id, email) => {
    if (!confirm(`Nonaktifkan status VIP untuk ${email}?`)) return;
    try {
      await deleteDoc(doc(db, 'vipMembers', id));
    } catch (err) {
      alert('Gagal menghapus VIP: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Manager */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
          ★ VIP Management
        </span>
        <h2 className="text-xl font-black text-sky-900 tracking-tight mt-1">VIP Manager</h2>
        <p className="text-xs text-slate-500">Kelola akun yang memiliki akses diskon dan benefit VIP aktif.</p>
      </div>

      {/* Form Tambah VIP (Tema Baby Blue & Teks Jelas) */}
      <div className="card-babyblue p-6">
        <h3 className="text-sm font-bold text-sky-900 mb-3">Tambahkan Member VIP Baru</h3>
        <form onSubmit={handleAddVip} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            placeholder="Masukkan email user (contoh: user@gmail.com)"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="input-babyblue flex-1 text-xs"
          />
          <button type="submit" disabled={loading} className="btn-babyblue text-xs font-bold whitespace-nowrap">
            {loading ? 'Menyimpan...' : '+ Tambah Member VIP'}
          </button>
        </form>
      </div>

      {/* Daftar Member VIP Aktif */}
      <div className="card-babyblue p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-sky-900">
            Daftar Member VIP Aktif ({vipMembers.length})
          </h3>
        </div>

        {vipMembers.length === 0 ? (
          <p className="text-xs text-slate-400">Belum ada member VIP terdaftar.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vipMembers.map((member) => (
              <div
                key={member.id}
                className="p-4 bg-sky-50/70 border border-sky-100 rounded-2xl flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold shrink-0">
                    ★
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-xs text-slate-800 truncate">{member.email || member.id}</p>
                    <span className="inline-block text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-0.5">
                      ✓ Active VIP
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveVip(member.id, member.email || member.id)}
                  className="px-3 py-1.5 text-[11px] font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition shrink-0"
                >
                  Nonaktifkan
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
