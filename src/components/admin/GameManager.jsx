import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export default function GameManager() {
  const [games, setGames] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'games'), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setGames(list);
    });
    return () => unsub();
  }, []);

  const handleAddGame = async (e) => {
    e.preventDefault();
    if (!name) return;
    setLoading(true);

    try {
      await addDoc(collection(db, 'games'), {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        image: image || '',
        status: 'active',
        createdAt: serverTimestamp(),
      });
      setName('');
      setSlug('');
      setImage('');
      setShowAddModal(false);
    } catch (err) {
      alert('Gagal menambah game: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus game ini?')) return;
    try {
      await deleteDoc(doc(db, 'games', id));
    } catch (err) {
      alert('Gagal menghapus game: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Management (Warna Teks & Tombol Disesuaikan ke Biru Susu) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
            Game Management
          </span>
          <h2 className="text-xl font-black text-sky-900 tracking-tight mt-1">Daftar Game</h2>
          <p className="text-xs text-slate-500">Kelola game yang tersedia di BCZ Store.</p>
        </div>

        {/* Fix Gambar 3: Tombol Tambah Game Jadi Biru Susu */}
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-babyblue text-xs font-bold flex items-center justify-center gap-2 py-2.5 px-5"
        >
          <span>+</span> Tambah Game
        </button>
      </div>

      {/* Grid Game */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {games.map((g) => (
          <div key={g.id} className="card-babyblue p-4 flex flex-col justify-between">
            <div>
              <div className="w-full aspect-video rounded-xl bg-sky-100/60 overflow-hidden mb-3 flex items-center justify-center">
                {g.image ? (
                  <img src={g.image} alt={g.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-sky-500 text-lg">{g.name}</span>
                )}
              </div>
              <h4 className="font-bold text-slate-800 text-sm">{g.name}</h4>
              <p className="text-[11px] text-slate-400 font-mono">/{g.slug}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-sky-50 flex items-center justify-between">
              <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-md">
                Active
              </span>
              <button
                onClick={() => handleDelete(g.id)}
                className="text-xs text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg font-medium border border-rose-100 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tambah Game */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-sky-100 relative animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-sky-50 p-2 rounded-full"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-sky-900 mb-4">Tambah Game Baru</h3>
            <form onSubmit={handleAddGame} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Game</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Roblox"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full input-babyblue text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Slug URL (Opsional)</label>
                <input
                  type="text"
                  placeholder="roblox"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full input-babyblue text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL Gambar Logo (Opsional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full input-babyblue text-xs"
                />
              </div>

              <button type="submit" disabled={loading} className="w-full btn-babyblue text-xs font-bold mt-2">
                {loading ? 'Menyimpan...' : 'Simpan Game'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
