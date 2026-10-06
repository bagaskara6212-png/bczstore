import React from 'react';

export default function ProductCard({ product, onSelect }) {
  const isAvailable = product.status !== 'inactive' && (product.stock === undefined || product.stock > 0);

  return (
    <div 
      onClick={() => isAvailable && onSelect(product)}
      className={`card-babyblue p-4 flex flex-col justify-between cursor-pointer group hover:-translate-y-1 ${
        !isAvailable ? 'opacity-60 cursor-not-allowed' : ''
      }`}
    >
      <div>
        {/* Product Image Wrapper */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-sky-100/60 mb-3">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sky-400 font-bold text-lg">
              {product.game || 'BCZ'}
            </div>
          )}
          <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-md text-sky-800 text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
            {product.category || 'Digital'}
          </span>
        </div>

        {/* Product Title & Game Name */}
        <h3 className="font-bold text-slate-800 text-sm line-clamp-2 group-hover:text-sky-600 transition">
          {product.name}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">{product.game || 'Global Game'}</p>
      </div>

      {/* Price & Action Button */}
      <div className="mt-4 pt-3 border-t border-sky-50 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 block">Harga</span>
          <span className="text-sm font-extrabold text-sky-600">
            Rp {Number(product.price || 0).toLocaleString('id-ID')}
          </span>
        </div>
        <button 
          disabled={!isAvailable}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            isAvailable 
              ? 'bg-sky-500 text-white group-hover:bg-sky-600 shadow-sm shadow-sky-200' 
              : 'bg-slate-200 text-slate-500'
          }`}
        >
          {isAvailable ? 'Beli' : 'Habis'}
        </button>
      </div>
    </div>
  );
}
