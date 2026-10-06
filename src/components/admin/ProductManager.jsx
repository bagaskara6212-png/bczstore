import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Package, Plus, Trash2, Edit2, CheckCircle, XCircle } from 'lucide-react';

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [game, setGame] = useState('');
  const [image, setImage] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProducts(list);
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price) return alert('Nama dan Harga wajib diisi!');

    const payload = {
      name,
      category: category || 'Digital',
      game: game || 'Global',
      price: Number(price),
      image: image || '',
      status: 'active',
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), payload);
        alert('Produk berhasil diperbarui!');
      } else {
        await addDoc(collection(db, 'products'), { ...payload, createdAt: serverTimestamp() });
        alert('Produk baru berhasil ditambahkan!');
      }
      resetForm();
    } catch (err) {
      alert('Gagal menyimpan produk: ' + err.message);
    }
  };

  const handleEdit = (prod) => {
    setEditingId(prod.id);
    setName(prod.name || '');
    setCategory(prod.category || '');
    setPrice(prod.price || '');
    setGame(prod.game || '');
    setImage(prod.image || '');
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      alert('Gagal menghapus: ' + err.message);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setCategory('');
    setPrice('');
    setGame('');
    setImage('');
  };

  return (
    <div className="space-y-6">
      {/* FORM INPUT PRODUK (FIX CARD GELAP) */}
      <div className="card-babyblue p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-sky-100 dark:border-slate-800 pb-3">
          <div className="p-2.5 bg-sky-500/10 text-sky-500 rounded-2xl">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 dark:text-white">
              {editingId ? 'Edit Produk' : 'Tambah Produk Baru'}
            </h3>
            <p className="text-[11px] text-slate-400">Atur katalog item digital BCZ Store</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Produk</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: 100 Robux" className="input-babyblue text-xs" />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Kategori</label>
            <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Contoh: Robux (Instan)" className="input-babyblue text-xs" />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Harga (Rp)</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="15000" className="input-babyblue text-xs" />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Game</label>
            <input type="text" value={game} onChange={e => setGame(e.target.value)} placeholder="Contoh: Roblox" className="input-babyblue text-xs" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">URL Gambar (Opsional)</label>
            <input type="text" value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." className="input-babyblue text-xs" />
          </div>

          <div className="md:col-span-2 flex items-center gap-2 pt-2">
            <button type="submit" className="btn-babyblue px-5 py-2.5 text-xs font-bold flex items-center gap-2">
              <Plus className="w-4 h-4" /> {editingId ? 'Simpan Perubahan' : 'Tambah Produk'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-4 py-2.5 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold">
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* DAFTAR PRODUK (FIX CARD GELAP) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((prod) => (
          <div key={prod.id} className="card-babyblue p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-200/50 dark:border-sky-800/50">
                  {prod.category}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">{prod.game}</span>
              </div>

              <div className="h-20 rounded-2xl bg-sky-50 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700/50 flex items-center justify-center overflow-hidden">
                {prod.image ? (
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-slate-400">Nothing</span>
                )}
              </div>

              <h4 className="text-xs font-black text-slate-800 dark:text-white">{prod.name}</h4>
              <p className="text-xs font-black text-sky-600 dark:text-sky-400">
                Rp {Number(prod.price || 0).toLocaleString('id-ID')}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-sky-100 dark:border-slate-800">
              <button onClick={() => handleEdit(prod)} className="p-2 rounded-xl bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 hover:bg-sky-100 transition">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleDelete(prod.id)} className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
             <input
                  type="text"
                  required
                  placeholder="Contoh: 100 Robux (5 Hari Pending)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full input-babyblue text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Game</label>
                  <input
                    type="text"
                    placeholder="Roblox"
                    value={game}
                    onChange={(e) => setGame(e.target.value)}
                    className="w-full input-babyblue text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                  <input
                    type="text"
                    placeholder="Robux / Top Up"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full input-babyblue text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Harga Utama (Rp)</label>
                <input
                  type="number"
                  required
                  placeholder="15000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full input-babyblue text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL Gambar Produk (Opsional)</label>
                <input
                  type="url"
                  placeholder="https://i.ibb.co/xxxx/gambar.png"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full input-babyblue text-xs"
                />
              </div>

              {/* SEKSI TAMBAH VARIAN (OPSIONAL) */}
              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100 space-y-2">
                <label className="block text-xs font-bold text-sky-900">Tambah Varian Produk (Opsional)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nama Varian (e.g. 500 Robux)"
                    value={variantName}
                    onChange={(e) => setVariantName(e.target.value)}
                    className="w-1/2 input-babyblue text-xs bg-white"
                  />
                  <input
                    type="number"
                    placeholder="Harga (Rp)"
                    value={variantPrice}
                    onChange={(e) => setVariantPrice(e.target.value)}
                    className="w-1/2 input-babyblue text-xs bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="w-full py-1.5 bg-sky-200 hover:bg-sky-300 text-sky-900 font-bold text-[11px] rounded-xl transition"
                >
                  + Tambah Varian Ke Daftar
                </button>

                {variants.length > 0 && (
                  <div className="space-y-1 pt-2 border-t border-sky-100">
                    {variants.map((v, i) => (
                      <div key={i} className="flex items-center justify-between text-xs bg-white p-2 rounded-xl border border-sky-100">
                        <span>{v.name} - Rp {v.price?.toLocaleString('id-ID')}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(i)}
                          className="text-rose-600 font-bold text-[10px]"
                        >
                          Hapus
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading} className="w-full btn-babyblue text-xs font-bold mt-2 py-3 shadow-md">
                {loading ? 'Menyimpan Produk...' : 'Simpan Produk Baru'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
