import React from 'react';

export default function ProductCard({ product, onSelect }) {
  const isAvailable = product.status !== 'inactive' && (product.stock === undefined || product.stock > 0);

  return (
    <div 
      onClick={() => isAvailable && onSelect && onSelect(product)}
      className={`card-babyblue p-4 flex flex-col justify-between cursor-pointer group hover:-translate-y-1 transition-all duration-300 ${
        !isAvailable ? 'opacity-60 cursor-not-allowed' : ''
      }`}
    >
      <div>
        {/* Product Image Wrapper */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-sky-100/60 dark:bg-slate-800/80 mb-3 border border-sky-100/50 dark:border-slate-700/50">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sky-500 dark:text-sky-400 font-black text-lg">
              {product.game || 'BCZ'}
            </div>
          )}
          
          {/* Badge Kategori */}
          <span className="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-sky-800 dark:text-sky-300 text-[10px] font-extrabold px-2.5 py-1 rounded-xl shadow-xs border border-sky-100/50 dark:border-slate-700/50">
            {product.category || 'Digital'}
          </span>
        </div>

        {/* Product Title & Game Name */}
        <h3 className="font-extrabold text-slate-800 dark:text-white text-sm line-clamp-2 group-hover:text-sky-500 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5 font-medium">{product.game || 'Global Game'}</p>
      </div>

      {/* Price & Action Button */}
      <div className="mt-4 pt-3 border-t border-sky-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 dark:text-slate-400 block font-bold">Harga</span>
          <span className="text-sm font-black text-sky-600 dark:text-sky-400">
            Rp {Number(product.price || 0).toLocaleString('id-ID')}
          </span>
        </div>
        <button 
          disabled={!isAvailable}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
            isAvailable 
              ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/20 active:scale-95' 
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
          }`}
        >
          {isAvailable ? 'Beli' : 'Habis'}
        </button>
      </div>
    </div>
  );
}
