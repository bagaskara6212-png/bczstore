import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Search, ShieldCheck, Zap, Award, Star, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Hero({ onExplore, liquidGlass }) {
  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    const cleanId = trackOrderId.trim().toUpperCase();
    if (!cleanId) return;

    setTrackingLoading(true);
    setTrackingError('');
    setTrackedOrder(null);

    try {
      const q = query(collection(db, 'orders'), where('orderId', '==', cleanId));
      const snap = await getDocs(q);

      if (!snap.empty) {
        setTrackedOrder(snap.docs[0].data());
      } else {
        setTrackingError('Order ID tidak ditemukan. Periksa kembali kode pesananmu!');
      }
    } catch (err) {
      console.error('Tracking error:', err);
      setTrackingError('Gagal melacak pesanan.');
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. RUNNING TEXT ANNOUNCEMENT TOPBAR */}
      <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-sky-500 text-white py-2 px-4 rounded-2xl shadow-xs overflow-hidden flex items-center gap-3">
        <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-black shrink-0 tracking-wider">
          ANNOUNCEMENT
        </span>
        <div className="whitespace-nowrap overflow-hidden w-full relative">
          <div className="inline-block animate-marquee text-xs font-bold tracking-wide">
            📢 PROMO RILIS V4.5: Gunakan kode voucher <span className="underline decoration-amber-300 font-extrabold text-amber-200">BCZV4</span> untuk diskon Rp 2.000! &nbsp;•&nbsp; Proses Robux 5 Hari & Instan Aktif 24/7 &nbsp;•&nbsp; Layanan CS Ramah & Cepat!
          </div>
        </div>
      </div>

      {/* HERO BANNER MAIN HEADER */}
      <div className={`p-6 sm:p-8 rounded-3xl bg-white/90 shadow-sm border border-sky-100 relative overflow-hidden ${liquidGlass ? 'backdrop-blur-md' : ''}`}>
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-800 text-xs font-extrabold rounded-full">
            <Award className="w-3.5 h-3.5 text-sky-600" /> Platform Top-Up Robux #1 Indonesia
          </span>

          <h1 className="text-2xl sm:text-4xl font-black text-sky-950 tracking-tight leading-tight">
            Top Up Robux & Game Assets <span className="text-sky-600">Super Cepat & Aman</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Dapatkan Robux Instan (via Login) dan Robux 5-Hari (via Gamepass Tax 30%) dengan harga termurah, tanpa biaya tersembunyi!
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button onClick={onExplore} className="btn-babyblue text-xs font-bold py-3 px-6 shadow-md flex items-center gap-2">
              Jelajahi Produk <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. WIDGET CEK STATUS PESANAN CEPAT (ORDER TRACKER BY ORDER ID) */}
      <div className="card-babyblue p-5 bg-white/95 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sky-100 text-sky-600 rounded-xl">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-sky-900">Lacak Status Pesanan</h3>
              <p className="text-[10px] text-slate-400">Ketik Order ID kamu untuk cek status tanpa perlu login</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleTrackOrder} className="flex gap-2">
          <input
            type="text"
            placeholder="Contoh: BCZ-X89K2L"
            value={trackOrderId}
            onChange={(e) => setTrackOrderId(e.target.value)}
            className="flex-1 input-babyblue text-xs font-mono uppercase bg-slate-50"
          />
          <button
            type="submit"
            disabled={trackingLoading}
            className="btn-babyblue text-xs font-bold px-5 shrink-0"
          >
            {trackingLoading ? 'Mencari...' : 'Cek Status'}
          </button>
        </form>

        {trackingError && (
          <p className="text-xs font-bold text-rose-500 bg-rose-50 p-2.5 rounded-xl border border-rose-100">{trackingError}</p>
        )}

        {trackedOrder && (
          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 space-y-2 text-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-sky-100 pb-2">
              <span className="font-mono font-black text-sky-800">{trackedOrder.orderId}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-sky-200 text-sky-900">
                {trackedOrder.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div>Produk: <strong>{trackedOrder.productName}</strong></div>
              <div>Total: <strong className="text-sky-600">Rp {Number(trackedOrder.price || 0).toLocaleString('id-ID')}</strong></div>
            </div>
          </div>
        )}
      </div>

      {/* 3. TESTIMONI & RATING PEMBELI REAL-TIME */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-sky-900 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-sky-600" /> Ulasan & Testimoni Pembeli
          </h3>
          <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400" /> 4.9/5.0 Rating Toko
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="card-babyblue p-4 bg-white/95 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">Rian_Roblox21</span>
              <span className="flex text-amber-400"><Star className="w-3 h-3 fill-amber-400" /><Star className="w-3 h-3 fill-amber-400" /><Star className="w-3 h-3 fill-amber-400" /><Star className="w-3 h-3 fill-amber-400" /><Star className="w-3 h-3 fill-amber-400" /></span>
            </div>
            <p className="text-[11px] text-slate-500">"Top up 500 Robux 5 Hari lancar jaya! Kalkulator pajaknya pas banget, ga ada potongan kurang."</p>
            <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Terverifikasi Pembeli</span>
          </div>

          <div className="card-babyblue p-4 bg-white/95 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">Bagas_Sultan</span>
              <span className="flex text-amber-400"><Star className="w-3 h-3 fill-amber-400" /><Star className="w-3 h-3 fill-amber-400" /><Star className="w-3 h-3 fill-amber-400" /><Star className="w-3 h-3 fill-amber-400" /><Star className="w-3 h-3 fill-amber-400" /></span>
            </div>
            <p className="text-[11px] text-slate-500">"Pake voucher BCZV4 langsung dapet diskon Rp 2.000, proses kilat abis WA admin!"</p>
            <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Terverifikasi Pembeli</span>
          </div>

          <div className="card-babyblue p-4 bg-white/95 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">KevinGamerz</span>
              <span className="flex text-amber-400"><Star className="w-3 h-3 fill-amber-400" /><Star className="w-3 h-3 fill-amber-400" /><Star className="w-3 h-3 fill-amber-400" /><Star className="w-3 h-3 fill-amber-400" /><Star className="w-3 h-3 fill-amber-400" /></span>
            </div>
            <p className="text-[11px] text-slate-500">"Webnya aesthetic biru susu keren banget, fast respon adminnya baik."</p>
            <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Terverifikasi Pembeli</span>
          </div>
        </div>
      </div>
    </div>
  );
}
