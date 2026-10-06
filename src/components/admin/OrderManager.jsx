import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { ShoppingBag, Search, Trash2 } from 'lucide-react';

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'orders'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setOrders(list);
    });
    return () => unsub();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', id), { status: newStatus });
    } catch (err) {
      alert('Gagal mengubah status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus riwayat pesanan ini?')) return;
    try {
      await deleteDoc(doc(db, 'orders', id));
    } catch (err) {
      alert('Gagal menghapus: ' + err.message);
    }
  };

  const filteredOrders = orders.filter(item => {
    const matchSearch = (item.id && item.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        (item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        (item.productName && item.productName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus = filterStatus === 'Semua' || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* FILTER & PENCARIAN */}
      <div className="card-babyblue p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari Order ID, email, produk..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input-babyblue pl-10 text-xs"
          />
        </div>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="input-babyblue text-xs w-full md:w-48 cursor-pointer"
        >
          <option value="Semua">Semua Status</option>
          <option value="pending">Pending (Menunggu)</option>
          <option value="completed">Completed (Selesai)</option>
          <option value="cancelled">Cancelled (Batal)</option>
        </select>
      </div>

      {/* DAFTAR PESANAN */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((ord) => (
            <div key={ord.id} className="card-babyblue p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-200/50 dark:border-sky-800/50">
                    {ord.id}
                  </span>
                  <span className="text-xs font-black text-slate-800 dark:text-white">
                    {ord.productName || 'Produk Top Up'}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Pembeli: <strong className="text-slate-700 dark:text-slate-200">{ord.email || 'Guest'}</strong> | Metode: <span className="text-sky-500 font-bold">{ord.method || 'QRIS'}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <div className="text-left md:text-right">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase">Total Bayar</span>
                  <span className="text-xs font-black text-sky-600 dark:text-sky-400">
                    Rp {Number(ord.price || 0).toLocaleString('id-ID')}
                  </span>
                </div>

                {/* SELECT STATUS */}
                <select
                  value={ord.status || 'pending'}
                  onChange={e => handleStatusChange(ord.id, e.target.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    ord.status === 'completed'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border-emerald-200 dark:border-emerald-800'
                      : ord.status === 'cancelled'
                      ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 border-rose-200 dark:border-rose-800'
                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 border-amber-200 dark:border-amber-800'
                  }`}
                >
                  <option value="pending">⌛ Pending</option>
                  <option value="completed">✓ Completed</option>
                  <option value="cancelled">✕ Cancelled</option>
                </select>

                <button
                  onClick={() => handleDelete(ord.id)}
                  className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition"
                  title="Hapus Pesanan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="card-babyblue p-8 text-center text-xs text-slate-400">
            Tidak ada data pesanan ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}
