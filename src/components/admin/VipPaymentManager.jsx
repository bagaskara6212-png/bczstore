import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export default function VipPaymentManager() {
  const [vipPayments, setVipPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'vipPayments'), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setVipPayments(list);
    });
    return () => unsub();
  }, []);

  const handleApproveVip = async (payment) => {
    if (!confirm(`Setujui pembayaran VIP untuk ${payment.email}?`)) return;
    setLoading(true);

    try {
      const cleanEmail = payment.email.toLowerCase().trim();
      await updateDoc(doc(db, 'vipPayments', payment.id), { status: 'paid' });
      await setDoc(doc(db, 'vipMembers', cleanEmail), {
        email: cleanEmail,
        status: 'active',
        createdAt: serverTimestamp(),
      }, { merge: true });

      alert(`Pembayaran disetujui! Akun ${cleanEmail} resmi jadi Member VIP.`);
    } catch (err) {
      alert('Gagal menyetujui: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus riwayat pembayaran ini?')) return;
    try {
      await deleteDoc(doc(db, 'vipPayments', id));
    } catch (err) {
      alert('Gagal menghapus: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-sky-100 dark:border-slate-700">
          💳 Laporan Transaksi VIP
        </span>
        <h2 className="text-xl font-black text-sky-900 dark:text-white tracking-tight mt-1">Verifikasi Pembayaran VIP</h2>
      </div>

      <div className="card-babyblue p-6">
        <h3 className="text-sm font-bold text-sky-900 dark:text-white mb-4">
          Daftar Pengajuan VIP ({vipPayments.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-sky-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold">
                <th className="py-3 px-3">Email Pemohon</th>
                <th className="py-3 px-3">Metode Bayar</th>
                <th className="py-3 px-3">Total Tagihan</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100 dark:divide-slate-800">
              {vipPayments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                    Belum ada pengajuan pembayaran VIP masuk.
                  </td>
                </tr>
              ) : (
                vipPayments.map((item) => (
                  <tr key={item.id} className="hover:bg-sky-50/50 dark:hover:bg-slate-800/50 transition">
                    {/* ✅ FIX EMAIL KELIHATAN TERANG BENDERANG */}
                    <td className="py-3 px-3 font-bold text-slate-800 dark:text-white">{item.email}</td>
                    <td className="py-3 px-3 font-medium text-slate-600 dark:text-slate-300">{item.method || 'Transfer'}</td>
                    <td className="py-3 px-3 font-black text-sky-600 dark:text-sky-400">
                      Rp {Number(item.amount || 30000).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === 'paid' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                      }`}>
                        {item.status || 'pending'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1">
                      {item.status !== 'paid' && (
                        <button onClick={() => handleApproveVip(item)} disabled={loading} className="px-3 py-1 bg-emerald-500 text-white rounded-xl font-bold text-[10px]">
                          ✓ Setujui
                        </button>
                      )}
                      <button onClick={() => handleDelete(item.id)} className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl font-bold text-[10px]">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
