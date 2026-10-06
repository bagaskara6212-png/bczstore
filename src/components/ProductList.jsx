import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import BuyModal from './BuyModal';
import { Search, Package, Zap, ShoppingCart } from 'lucide-react';

export default function ProductList({ limit, user }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProducts(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const categories = ['ALL', 'Robux', 'Top Up', 'Game Items'];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.game?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ALL' ||
      p.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const displayedProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts;

  if (loading) {
    return (
      <div className="py-12 text-center space-y-2">
        <div className="w-8 h-8 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-sky-700">Memuat katalog produk...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* BILAH SEARCH & PILL FILTER KATEGORI */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center bg-white p-3.5 rounded-2xl border border-sky-100 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari nominal Robux atau produk game..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full input-babyblue pl-10 text-xs bg-slate-50"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* KATALOG PRODUK GRID */}
      {displayedProducts.length === 0 ? (
        <div className="card-babyblue p-8 text-center text-slate-400">
          <Package className="w-8 h-8 mx-auto mb-2 text-sky-300" />
          <p className="text-xs font-semibold">Produk tidak ditemukan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {displayedProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              className="card-babyblue p-3.5 flex flex-col justify-between bg-white hover:border-sky-300 transition cursor-pointer group"
            >
              <div>
                <div className="aspect-square rounded-2xl bg-sky-100/60 overflow-hidden mb-2.5 flex items-center justify-center relative">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  ) : (
                    <img src="https://golrox.com/images/robux-icons/v1/green-0.svg" className="w-12 h-12 animate-pulse" alt="Robux" />
                  )}
                  <span className="absolute top-2 left-2 text-[9px] bg-sky-500 text-white font-black px-2 py-0.5 rounded-md shadow-xs">
                    {p.category || 'Digital'}
                  </span>
                </div>

                <h4 className="font-extrabold text-slate-800 text-xs line-clamp-2 mb-1 group-hover:text-sky-600 transition">
                  {p.name}
                </h4>
              </div>

              <div className="pt-2 border-t border-sky-50 flex items-center justify-between mt-2">
                <div>
                  <span className="text-[9px] text-slate-400 block font-semibold">Mulai Dari</span>
                  <span className="text-xs font-black text-sky-600">
                    Rp {Number(p.price || 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="p-2 bg-sky-50 text-sky-600 rounded-xl group-hover:bg-sky-500 group-hover:text-white transition">
                  <ShoppingCart className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <BuyModal
          product={selectedProduct}
          user={user}
          onClose={() => setSelectedProduct(null)}
          onSuccess={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
