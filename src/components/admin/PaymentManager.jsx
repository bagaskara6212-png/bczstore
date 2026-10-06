import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function PaymentManager() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'payments'), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPayments(list);
    });
    return () => unsub();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, 'payments', id), { status });
    } catch (err) {
      alert('Gagal mengupdate status: ' + err.message);
    }
  };

  const handleDeletePayment = async (id) => {
    if (!confirm('Hapus data transaksi ini?')) return;
    try {
      await deleteDoc(doc(db, 'payments', id));
    } catch (err) {
      alert('Gagal menghapus data: ' + err.message);
    }
  };

  const filtered = payments.filter((p) => {
    const matchSearch =
      p.id?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.orderId?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-sky-900 tracking-tight">Verifikasi Pembayaran</h2>
        <p className="text-xs text-slate-500 mt-0.5">Pantau bukti transfer dan verifikasi pembayaran customer.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Cari Order ID, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-babyblue flex-1 text-xs"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-babyblue text-xs font-semibold text-slate-700 sm:w-48 bg-white"
        >
          <option value="all">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="card-babyblue p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-sky-100 text-slate-500 font-bold">
                <th className="py-3 px-3">Order ID / Email</th>
                <th className="py-3 px-3">Metode Bayar</th>
                <th className="py-3 px-3">Jumlah</th>
                <th className="py-3 px-3">Bukti SS Transfer</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                    Belum ada data pembayaran.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-sky-50/50 transition">
                    <td className="py-3 px-3">
                      <div className="font-mono text-[11px] font-bold text-sky-700">{item.orderId || item.id}</div>
                      <div className="text-[11px] text-slate-500">{item.email}</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-600">{item.method || 'Transfer'}</td>
                    <td className="py-3 px-3 font-bold text-sky-600">
                      Rp {Number(item.amount || 0).toLocaleString('id-ID')}
                    </td>

                    {/* FOTO / LINK SCREENSHOT BUKTI TRANSFER */}
                    <td className="py-3 px-3">
                      {item.proofUrl ? (
                        <a
                          href={item.proofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-sky-100 text-sky-700 hover:bg-sky-200 rounded-lg font-bold text-[10px] inline-flex items-center gap-1 border border-sky-200 transition"
                        >
                          🖼️ Lihat Bukti SS
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Tidak ada SS</span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.status === 'paid' || item.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : item.status === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {item.status || 'pending'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1">
                      {item.status !== 'paid' && (
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'paid')}
                          className="px-2.5 py-1 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg font-bold text-[10px] transition"
                        >
                          Verifikasi
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePayment(item.id)}
                        className="px-2.5 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg font-bold text-[10px] border border-rose-200 transition"
                      >
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
