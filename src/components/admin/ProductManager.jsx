import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Trash2, Package, Search, Calculator, Layers } from 'lucide-react';

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // State Form Produk Baru
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Robux');
  const [game, setGame] = useState('Roblox');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  
  // State Varian (Opsional, e.g. 100 Robux, 500 Robux)
  const [variants, setVariants] = useState([]);
  const [variantName, setVariantName] = useState('');
  const [variantPrice, setVariantPrice] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProducts(list);
    });
    return () => unsub();
  }, []);

  const handleAddVariant = () => {
    if (!variantName || !variantPrice) return;
    setVariants((prev) => [
      ...prev,
      { name: variantName.trim(), price: Number(variantPrice) || 0 },
    ]);
    setVariantName('');
    setVariantPrice('');
  };

  const handleRemoveVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name || !price) return;
    setLoading(true);

    try {
      await addDoc(collection(db, 'products'), {
        name,
        category: category || 'General',
        game: game || 'Roblox',
        price: Number(price) || 0,
        image: image || '',
        variants: variants.length > 0 ? variants : [],
        status: 'active',
        createdAt: serverTimestamp(),
      });

      setName('');
      setCategory('Robux');
      setGame('Roblox');
      setPrice('');
      setImage('');
      setVariants([]);
      setShowModal(false);
      alert('Produk berhasil ditambahkan!');
    } catch (err) {
      alert('Gagal menambah produk: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus produk ini dari toko?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      alert('Gagal menghapus produk: ' + err.message);
    }
  };

  // Helper kalkulator Gamepass 30% Tax di Admin
  const calculateGamepassPrice = (cleanAmount) => {
    if (!cleanAmount || cleanAmount <= 0) return 0;
    return Math.ceil(cleanAmount / 0.7);
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.game?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Management */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
            Product Management
          </span>
          <h2 className="text-xl font-black text-sky-900 tracking-tight mt-1">Kelola Produk Digital</h2>
          <p className="text-xs text-slate-500">Tambah dan atur semua katalog produk gaming BCZ Store.</p>
        </div>

        {/* Tombol Biru Susu + Plus Icon */}
        <button
          onClick={() => setShowModal(true)}
          className="btn-babyblue text-xs font-bold flex items-center justify-center gap-2 py-2.5 px-5 shadow-sm shadow-sky-200 shrink-0"
        >
          <Plus className="w-4 h-4" /> Tambah Produk Baru
        </button>
      </div>

      {/* Input Pencarian */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Cari produk, game, atau kategori..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-babyblue pl-10 w-full text-xs bg-white"
        />
      </div>

      {/* Grid Katalog Produk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full card-babyblue p-8 text-center text-slate-400">
            <Package className="w-8 h-8 mx-auto mb-2 text-sky-300" />
            <p className="text-xs font-semibold">Belum ada produk terdaftar.</p>
          </div>
        ) : (
          filteredProducts.map((p) => {
            const isRobuxProduct = p.category?.toLowerCase().includes('robux') || p.game?.toLowerCase().includes('roblox');
            const matchAmount = p.name.match(/\d+/);
            const cleanRobux = matchAmount ? parseInt(matchAmount[0], 10) : 0;

            return (
              <div key={p.id} className="card-babyblue p-4 flex flex-col justify-between bg-white/95">
                <div>
                  <div className="w-full aspect-video rounded-2xl bg-sky-100/60 overflow-hidden mb-3 flex items-center justify-center relative">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-black text-sky-500 text-sm tracking-wider">{p.game || 'BCZ'}</span>
                    )}

                    <span className="absolute top-2 right-2 text-[10px] bg-emerald-500 text-white font-black px-2 py-0.5 rounded-full shadow-xs">
                      Active
                    </span>
                  </div>

                  <h4 className="font-black text-slate-800 text-xs truncate mb-0.5">{p.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">ID: {p.id}</p>

                  <div className="mt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Kategori / Game:</span>
                      <strong className="text-slate-700">{p.category} • {p.game}</strong>
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-sky-50">
                      <span className="text-[11px] text-slate-500">Harga Utama:</span>
                      <span className="font-black text-sky-600 text-sm">
                        Rp {Number(p.price || 0).toLocaleString('id-ID')}
                      </span>
                    </div>

                    {/* Info Kalkulator Gamepass Roblox 30% */}
                    {isRobuxProduct && cleanRobux > 0 && (
                      <div className="p-2 bg-sky-50 rounded-xl border border-sky-100 text-[10px] text-sky-900 space-y-0.5">
                        <div className="flex items-center gap-1 font-bold">
                          <Calculator className="w-3 h-3 text-sky-600" />
                          Set Gamepass Roblox (Tax 30%):
                        </div>
                        <div className="flex justify-between font-mono font-extrabold text-emerald-600">
                          <span>{cleanRobux} Robux</span>
                          <span>&rarr; Set: {calculateGamepassPrice(cleanRobux)} Robux</span>
                        </div>
                      </div>
                    )}

                    {/* Varian Produk */}
                    {p.variants && p.variants.length > 0 && (
                      <div className="pt-1.5 border-t border-sky-50">
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mb-1">
                          <Layers className="w-3 h-3" /> Varian Tersedia ({p.variants.length})
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {p.variants.map((v, idx) => (
                            <span key={idx} className="text-[9px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                              {v.name}: Rp {v.price?.toLocaleString('id-ID')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-sky-100 text-right">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-xs text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-xl font-bold border border-rose-200 transition flex items-center gap-1 ml-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL TAMBAH PRODUK */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-sky-100 relative animate-in fade-in zoom-in duration-150 my-8">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-sky-50 p-2 rounded-full"
            >
              ✕
            </button>

            <h3 className="text-lg font-black text-sky-900 mb-4">Tambah Produk Baru</h3>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Produk</label>
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
