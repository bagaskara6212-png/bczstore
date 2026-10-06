import React, { useState } from 'react';
import VipPayment from './VipPayment';
import VipStatus from './VipStatus';

export default function VipSection({ user }) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner VIP Disesuaikan ke Tema Baby Blue + Aksen Gold Terang */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-400 via-sky-300 to-amber-100 rounded-3xl p-6 md:p-10 shadow-sm border border-sky-200 text-slate-800">
        <div className="relative z-10 max-w-xl">
          <span className="inline-block px-3 py-1 bg-amber-400 text-amber-950 text-[10px] font-black rounded-full mb-3 shadow-xs uppercase tracking-wider">
            ★ BCZ VIP
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">
            Upgrade ke VIP Membership
          </h1>
          <p className="text-slate-700 text-xs md:text-sm leading-relaxed mb-6">
            Dapatkan akses harga diskon khusus, promo prioritas, serta benefit eksklusif setiap transaksi di BCZ Store.
          </p>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="btn-babyblue font-bold text-xs py-3 px-6 shadow-md"
          >
            Beli VIP Membership (Rp 30.000)
          </button>
        </div>

        {/* Aksesoris Ilustrasi Lembut */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-amber-300/30 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Status VIP User */}
      <VipStatus user={user} />

      {/* Grid Benefit VIP Warna Baby Blue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-babyblue p-5 flex items-start gap-3">
          <div className="p-2.5 bg-amber-100 text-amber-700 rounded-2xl font-bold text-lg">🏷️</div>
          <div>
            <h4 className="font-bold text-sky-900 text-sm mb-1">Promo Eksklusif</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dapatkan harga miring yang otomatis terpotong saat kamu checkout produk game.
            </p>
          </div>
        </div>

        <div className="card-babyblue p-5 flex items-start gap-3">
          <div className="p-2.5 bg-sky-100 text-sky-700 rounded-2xl font-bold text-lg">⚡</div>
          <div>
            <h4 className="font-bold text-sky-900 text-sm mb-1">Proses Prioritas</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pesanan member VIP diproses lebih cepat oleh sistem dan admin online.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Pembayaran VIP */}
      {showPaymentModal && (
        <VipPayment user={user} onClose={() => setShowPaymentModal(false)} />
      )}
    </div>
  );
}
