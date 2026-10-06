import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { X, ArrowRight, CheckCircle2, Zap, Clock, Lock, Tag, MessageCircle, QrCode } from 'lucide-react';

export default function BuyModal({ product, user, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants && product.variants.length > 0 ? product.variants[0] : null
  );

  const [robuxType, setRobuxType] = useState('5days');
  const [selectedPayment, setSelectedPayment] = useState({ id: 'qris', name: 'QRIS All Payment', holder: 'BCZ Store' });
  const [showQrisPopup, setShowQrisPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // Countdown 5 Menit (300 Detik)
  
  const [isVipUser, setIsVipUser] = useState(false);
  const [adminFee, setAdminFee] = useState(500);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherDiscount, setVoucherDiscount] = useState(0);

  const [formData, setFormData] = useState({
    username: '', password: '', userId: '', playerId: '', serverRegion: '', gamepassLink: ''
  });

  // Countdown timer 5 menit untuk QRIS
  useEffect(() => {
    if (!showQrisPopup) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showQrisPopup]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getRobuxAmount = () => {
    const targetString = selectedVariant ? selectedVariant.name : product?.name || '';
    const match = targetString.match(/\d+/);
    return match ? parseInt(match[0], 10) : 100;
  };

  const calculateGamepassSetPrice = (cleanRobux) => cleanRobux ? Math.ceil(cleanRobux / 0.7) : 0;
  const getRawPrice = () => selectedVariant ? (selectedVariant.price || product.price || 0) : (product.price || 0);
  const calculateTotalPrice = () => Math.max(0, getRawPrice() - voucherDiscount) + adminFee;

  const handleFinalCheckout = async (e) => {
    e.preventDefault();
    if (selectedPayment.id === 'qris' && !showQrisPopup) {
      setShowQrisPopup(true);
      return;
    }

    setLoading(true);
    const generatedId = `BCZ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const finalPrice = calculateTotalPrice();

    try {
      await addDoc(collection(db, 'orders'), {
        orderId: generatedId,
        productName: product.name,
        price: finalPrice,
        paymentMethod: selectedPayment.name,
        email: user.email,
        username: formData.username,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      setLoading(false);
      onSuccess(generatedId);
    } catch (err) {
      alert('Error: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-xl border border-sky-100 dark:border-slate-800 relative my-8">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-sky-50 dark:bg-slate-800 p-2 rounded-full">
          <X className="w-4 h-4" />
        </button>

        {/* POPUP QRIS DETEKSI OTOMATIS */}
        {showQrisPopup ? (
          <div className="text-center space-y-4 animate-in fade-in zoom-in duration-150">
            <h3 className="text-lg font-black text-sky-900 dark:text-sky-100 flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5 text-sky-500" /> Scan QRIS Pembayaran
            </h3>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block">Bayar sebelum:</span>
              <span className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono animate-pulse">{formatTimer(timeLeft)}</span>
            </div>

            {/* Gambar QRIS Static / Dynamic */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 inline-block shadow-sm">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=BCZSTORE-QRIS-PAYMENT" alt="QRIS" className="w-44 h-44 mx-auto" />
              <p className="text-[10px] text-slate-400 font-mono mt-2">BCZ STORE ALL PAYMENT</p>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">Total Tagihan: <strong className="text-sky-600 dark:text-sky-400 text-sm">Rp {calculateTotalPrice().toLocaleString('id-ID')}</strong></p>

            <button onClick={handleFinalCheckout} disabled={loading} className="w-full btn-babyblue text-xs font-bold py-3 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> {loading ? 'Memproses...' : 'Saya Sudah Bayar'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleFinalCheckout} className="space-y-4">
            <h3 className="text-base font-black text-sky-900 dark:text-sky-100">{product.name}</h3>

            <div className="space-y-3">
              <input type="text" name="username" required placeholder="Roblox Username" value={formData.username} onChange={handleInputChange} className="w-full input-babyblue text-xs dark:bg-slate-800 dark:text-white" />
            </div>

            <div className="p-3 bg-sky-50 dark:bg-slate-800 rounded-2xl border border-sky-100 dark:border-slate-700 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-200">Metode: QRIS All Payment</span>
              <span className="text-sky-600 font-black">Rp {calculateTotalPrice().toLocaleString('id-ID')}</span>
            </div>

            <button type="submit" className="w-full btn-babyblue text-xs font-bold py-3">
              Lanjut Pembayaran QRIS &rarr;
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
