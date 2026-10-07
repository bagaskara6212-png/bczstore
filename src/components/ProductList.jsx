import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import ProductCard from './ProductCard';
import { Search, Tag } from 'lucide-react';

export default function ProductList({ limit: maxLimit, user, onSelectProduct }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Semua', 'Akun Game']);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const mockProducts = [
    { id: '1', name: '80 Robux', category: 'Robux (Instan)', price: 21500, game: 'Roblox', status: 'active' },
    { id: '2', name: '160 Robux', category: 'Robux (Instan)', price: 40500, game: 'Roblox', status: 'active' },
    { id: '3', name: 'Akun Blox Fruits Level Max + V4', category: 'Akun Game', price: 85000, game: 'Roblox', status: 'active' },
    { id: '4', name: 'Shadow (Fruit) (No Perm)', category: 'Blox Fruits', price: 4500, game: 'Blox Fruits', status: 'active' },
  ];

  useEffect(() => {
    // 1. Fetch Real-time Produk dari Firestore
    const unsubProducts = onSnapshot(collection(db, 'products'), (snap) => {
      if (!snap.empty) {
        const prodList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(prodList);
      } else {
        setProducts(mockProducts);
      }
      setLoading(false);
    }, (err) => {
      console.error("Gagal mengambil produk:", err);
      setProducts(mockProducts);
      setLoading(false);
    });

    // 2. Fetch Kategori & Gabungkan Tab "Akun Game" Wajib Ada
    const unsubCategories = onSnapshot(collection(db, 'categories'), (snap) => {
      if (!snap.empty) {
        const catList = snap.docs.map(doc => doc.data().name);
        const uniqueCats = Array.from(new Set(['Semua', 'Akun Game', ...catList]));
        setCategories(uniqueCats);
      } else {
        setCategories(['Semua', 'Akun Game', 'Robux (Instan)', 'Robux (5 Hari Masuk)', 'Blox Fruits']);
      }
    }, (err) => {
      setCategories(['Semua', 'Akun Game', 'Robux (Instan)', 'Robux (5 Hari Masuk)', 'Blox Fruits']);
    });

    return () => {
      unsubProducts();
      unsubCategories();
    };
  }, []);

  // Filter Logika Produk
  const filteredProducts = products.filter(item => {
    const matchCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (item.game && item.game.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const isActive = item.status !== 'inactive';
    return matchCategory && matchSearch && isActive;
  });

  const displayedProducts = maxLimit ? filteredProducts.slice(0, maxLimit) : filteredProducts;

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div key={n} className="card-babyblue p-4 h-52 animate-pulse bg-slate-200/50 dark:bg-slate-800/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* FILTER TAB & INPUT PENCARIAN */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Kategori Bar (Scrollable Horizontal) */}
        <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 scrollbar-none">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'card-babyblue hover:text-sky-500 dark:hover:text-sky-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Input Pencarian Produk */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari produk / game / akun..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-babyblue pl-10 text-xs"
          />
        </div>
      </div>

      {/* GRID DAFTAR PRODUK */}
      {displayedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedProducts.map((prod) => (
            <ProductCard 
              key={prod.id} 
              product={prod} 
              onSelect={onSelectProduct} 
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center card-babyblue space-y-3">
          <div className="p-3 bg-sky-100 dark:bg-slate-800 text-sky-500 w-fit mx-auto rounded-2xl">
            <Tag className="w-6 h-6" />
          </div>
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">
            Produk Tidak Ditemukan
          </h4>
          <p className="text-[11px] text-slate-400">
            Coba ganti kata kunci pencarian atau pilih kategori lain.
          </p>
        </div>
      )}
    </div>
  );
}
