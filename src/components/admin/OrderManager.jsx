import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Trash2, ExternalLink, ShoppingBag, Search, Filter, Zap, Clock, KeyRound } from 'lucide-react';

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'orders'), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setOrders(list);
    });
    return () => unsub();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    setLoadingId(id);
    try {
      await updateDoc(doc(db, 'orders', id), { status: newStatus });
    } catch (err) {
      alert('Gagal memperbarui status pesanan: ' + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus pesanan ini dari riwayat admin?')) return;
    try {
      await deleteDoc(doc(db, 'orders', id));
    } catch (err) {
      alert('Gagal menghapus pesanan: ' + err.message);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const searchLower = search.toLowerCase();
    const matchSearch =
      (o.orderId && o.orderId.toLowerCase().includes(searchLower)) ||
      (o.email && o.email.toLowerCase().includes(searchLower)) ||
      (o.productName && o.productName.toLowerCase().includes(searchLower)) ||
      (o.id && o.id.toLowerCase().includes(searchLower));

    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
          📦 Order Management
        </span>
        <h2 className="text-xl font-black text-sky-900 tracking-tight mt-1">Kelola Pesanan Masuk</h2>
        <p className="text-xs text-slate-500">Atur kustom status pengiriman Robux/Akun dan data kredensial customer.</p>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari Order ID, email, atau produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-babyblue pl-10 w-full text-xs bg-white"
          />
        </div>
        <div className="relative sm:w-56">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-babyblue pl-10 w-full text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="packing">Dipacking / Proses</option>
            <option value="pending_robux">Proses 5-Hari Pending</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Daftar Pesanan */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="card-babyblue p-8 text-center text-slate-400">
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-sky-300" />
            <p className="text-xs font-semibold">Belum ada pesanan ditemukan.</p>
          </div>
        ) : (
          filteredOrders.map((item) => (
            <div key={item.id} className="card-babyblue p-5 space-y-4 bg-white/95">
              {/* Header Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sky-100">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                      {item.orderId || item.id}
                    </span>

                    {/* Badge Pengiriman Robux */}
                    {item.robuxDeliveryType === 'instant' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-600" /> Robux Instan
                      </span>
                    )}
                    {item.robuxDeliveryType === '5days' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-sky-600" /> Robux 5 Hari
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-black text-slate-800 pt-1">
                    {item.productName || 'Produk Digital'} {item.variant ? `(${item.variant})` : ''}
                  </h3>
                </div>

                <div className="text-right sm:text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">Total Harga</span>
                  <span className="text-sm font-black text-sky-600">
                    Rp {Number(item.price || 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Detail Akun & Password Instan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-sky-50/60 p-3.5 rounded-2xl border border-sky-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Info Pembeli</span>
                  <p className="font-semibold text-slate-800">{item.email}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Metode: <span className="font-bold text-sky-700">{item.paymentMethod || 'Transfer'}</span>
                  </p>
                  {item.paymentProofUrl && (
                    <a
                      href={item.paymentProofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-sky-600 hover:underline flex items-center gap-1 mt-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Lihat SS Bukti Bayar
                    </a>
                  )}
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Data Kredensial Akun</span>
                  {item.accountDetails ? (
                    <div className="space-y-1 text-[11px] text-slate-700">
                      {item.accountDetails.username && (
                        <p>Username: <strong className="text-slate-900 select-all">{item.accountDetails.username}</strong></p>
                      )}

                      {/* DATA PASSWORD UTK ROBUX INSTAN */}
                      {item.accountDetails.password && (
                        <div className="p-2 bg-amber-100/70 rounded-xl border border-amber-200 text-amber-900 font-mono text-[11px] flex items-center justify-between">
                          <span>Pass: <strong className="select-all">{item.accountDetails.password}</strong></span>
                          <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                        </div>
                      )}

                      {item.accountDetails.playerId && (
                        <p>Player ID: <strong className="text-slate-900 select-all">{item.accountDetails.playerId}</strong></p>
                      )}
                      {item.accountDetails.serverRegion && (
                        <p>Server/Zone: <strong className="text-slate-900">{item.accountDetails.serverRegion}</strong></p>
                      )}
                      {item.accountDetails.gamepassLink && (
                        <p className="truncate">
                          Link Gamepass: <a href={item.accountDetails.gamepassLink} target="_blank" rel="noreferrer" className="text-sky-600 font-bold underline">Buka Link Gamepass</a>
                        </p>
                      )}
                      {item.accountDetails.notes && (
                        <p className="italic text-slate-500">Catatan: "{item.accountDetails.notes}"</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-[11px]">Tidak ada detail akun tambahan.</p>
                  )}
                </div>
              </div>

              {/* DROPDOWN EDIT CUSTOM STATUS PESANAN */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Ubah Status:</span>
                  <select
                    value={item.status || 'pending'}
                    onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                    disabled={loadingId === item.id}
                    className="input-babyblue text-xs font-bold bg-white border border-sky-200 py-1.5 px-3 rounded-xl cursor-pointer"
                  >
                    <option value="pending">⏳ Pending (Menunggu)</option>
                    <option value="packing">📦 Dipacking / Sedang Diproses</option>
                    <option value="pending_robux">🕓 Proses 5-Hari Pending Robux</option>
                    <option value="completed">✓ Completed / Selesai</option>
                    <option value="rejected">✕ Rejected / Ditolak</option>
                  </select>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
