import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export default function AccountStockManager() {
  const [stocks, setStocks] = useState([]);
  const [title, setTitle] = useState('');
  const [credentials, setCredentials] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'accountStock'), (snapshot) => {
      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setStocks(items);
    });

    return () => unsub();
  }, []);

  const handleAddStock = async (e) => {
    e.preventDefault();
    if (!title || !credentials) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'accountStock'), {
        title,
        credentials,
        price: Number(price) || 0,
        status: 'available',
        soldTo: null,
        createdAt: serverTimestamp(),
      });
      setTitle('');
      setCredentials('');
      setPrice('');
    } catch (err) {
      alert('Gagal menambah stok akun: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsSold = async (id) => {
    const buyerUid = prompt('Masukkan UID Customer pembeli:');
    if (!buyerUid) return;

    try {
      await updateDoc(doc(db, 'accountStock', id), {
        status: 'sold',
        soldTo: buyerUid.trim(),
        soldAt: serverTimestamp(),
      });
    } catch (err) {
      alert('Gagal memperbarui status stok: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus item stok ini?')) return;
    try {
      await deleteDoc(doc(db, 'accountStock', id));
    } catch (err) {
      alert('Gagal menghapus stok: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Tambah Stok */}
      <div className="card-babyblue p-6">
        <h3 className="text-lg font-bold text-sky-900 mb-4">Tambah Stok Akun Digital</h3>
        <form onSubmit={handleAddStock} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Judul / Nama Akun</label>
            <input
              type="text"
              required
              placeholder="Akun Roblox Blox Fruits Max Level"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full input-babyblue text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Detail Kredensial / Login Data</label>
            <textarea
              required
              rows={3}
              placeholder="Username: user123&#10;Password: pass123&#10;Recovery Key: xyz"
              value={credentials}
              onChange={(e) => setCredentials(e.target.value)}
              className="w-full input-babyblue text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Harga (Rp)</label>
            <input
              type="number"
              required
              placeholder="50000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full input-babyblue text-sm"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-babyblue text-sm">
            {loading ? 'Menyimpan...' : 'Simpan Stok Akun'}
          </button>
        </form>
      </div>

      {/* Tabel Stok */}
      <div className="card-babyblue p-6">
        <h3 className="text-lg font-bold text-sky-900 mb-4">Daftar Stok Akun ({stocks.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-sky-100 text-slate-500 font-medium">
                <th className="py-3 px-4">Judul</th>
                <th className="py-3 px-4">Kredensial</th>
                <th className="py-3 px-4">Harga</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Pembeli (UID)</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-50">
              {stocks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-slate-400">Belum ada stok akun.</td>
                </tr>
              ) : (
                stocks.map((item) => (
                  <tr key={item.id} className="hover:bg-sky-50/50 transition">
                    <td className="py-3 px-4 font-semibold text-slate-800">{item.title}</td>
                    <td className="py-3 px-4 font-mono text-xs max-w-xs truncate text-slate-600">{item.credentials}</td>
                    <td className="py-3 px-4 text-sky-600 font-bold">Rp {Number(item.price).toLocaleString('id-ID')}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'sold' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {item.status === 'sold' ? 'Sold' : 'Available'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-500">{item.soldTo || '-'}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {item.status !== 'sold' && (
                        <button
                          onClick={() => handleMarkAsSold(item.id)}
                          className="text-xs px-2.5 py-1 rounded-lg bg-sky-100 text-sky-700 hover:bg-sky-200 font-medium transition"
                        >
                          Tandai Sold
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-xs px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 font-medium transition"
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
