import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'categories'), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCategories(list);
    });
    return () => unsub();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'categories'), {
        name: categoryName.trim(),
        createdAt: serverTimestamp(),
      });
      setCategoryName('');
      alert('Tab / Kategori baru berhasil ditambahkan!');
    } catch (err) {
      alert('Gagal menambah kategori: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Hapus kategori/tab "${name}"?`)) return;
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (err) {
      alert('Gagal menghapus kategori: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Form Tambah Tab Kategori */}
      <div className="card-babyblue p-6">
        <h3 className="text-lg font-bold text-sky-900 mb-1">Manajemen Tab & Kategori Produk</h3>
        <p className="text-xs text-slate-500 mb-4">
          Kategori yang kamu tambahkan di sini akan otomatis muncul sebagai **Tab Filter** di halaman depan produk.
        </p>

        <form onSubmit={handleAddCategory} className="flex gap-3 max-w-md">
          <input
            type="text"
            required
            placeholder="Contoh: Steal a Brainrot, Grow a Garden, Akun, dll"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="input-babyblue flex-1 text-xs"
          />
          <button type="submit" disabled={loading} className="btn-babyblue text-xs font-bold whitespace-nowrap">
            {loading ? 'Menyimpan...' : '+ Tambah Tab'}
          </button>
        </form>
      </div>

      {/* Daftar Tab Kategori */}
      <div className="card-babyblue p-6">
        <h4 className="text-sm font-bold text-sky-900 mb-3">Daftar Tab Kategori Aktif ({categories.length})</h4>
        {categories.length === 0 ? (
          <p className="text-xs text-slate-400">Belum ada kategori kustom. Silakan tambah di atas.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-2 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-sky-900"
              >
                <span>{cat.name}</span>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="text-rose-500 hover:text-rose-700 ml-1 font-bold"
                  title="Hapus Kategori"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
