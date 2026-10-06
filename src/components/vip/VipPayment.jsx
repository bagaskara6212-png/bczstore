import React, { useState, useEffect } from 'react';
import { doc, setDoc, addDoc, collection, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export default function VipPayment({ user, onClose }) {
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'paymentMethods'));
        if (snap.exists() && snap.data().list) {
          setPaymentMethods(snap.data().list);
          setSelectedPayment(snap.data().list[0]);
        } else {
          const defaults = [
            { id: 'qris', name: 'QRIS All Payment', number: 'Scan QRIS BCZ Store', holder: 'BCZ Store' },
            { id: 'dana', name: 'DANA', number: '081234567890', holder: 'BCZ Store' },
            { id: 'gopay', name: 'GoPay', number: '081234567890', holder: 'BCZ Store' },
            { id: 'ovo', name: 'OVO', number: '081234567890', holder: 'BCZ Store' },
          ];
          setPaymentMethods(defaults);
          setSelectedPayment(defaults[0]);
        }
      } catch (err) {
        console.error("Error fetching payment methods:", err);
      }
    };
    fetchMethods();
  }, []);

  const handleBuyVip = async () => {
    if (!user) {
      alert('Silakan login terlebih dahulu untuk membeli VIP.');
      return;
    }

    setLoading(true);
    const cleanEmail = user.email.toLowerCase().trim();

    try {
      // 1. Simpan Transaksi Pembayaran VIP
      await addDoc(collection(db, 'vipPayments'), {
        email: cleanEmail,
        amount: 30000,
        method: selectedPayment ? selectedPayment.name : 'Transfer',
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      // 2. Daftarkan Dokumen Member VIP di Firestore (Rules: vipMembers/{email})
      await setDoc(doc(db, 'vipMembers', cleanEmail), {
        email: cleanEmail,
        status: 'active',
        joinedAt: serverTimestamp(),
      }, { merge: true });

      setLoading(false);
      alert('Permintaan VIP Membership berhasil dibuat! Status VIP kamu kini AKTIF.');
      onClose();
    } catch (err) {
      console.error('Gagal beli VIP:', err);
      alert('Gagal memproses VIP: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-sky-100 relative animate-in fade-in zoom-in duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-sky-50 p-2 rounded-full"
        >
          ✕
        </button>

        <h3 className="text-lg font-black text-sky-900 mb-1">Beli VIP Membership</h3>
        <p className="text-xs text-slate-500 mb-4">Biaya Keanggotaan: <span className="font-bold text-sky-600">Rp 30.000</span> (Permanen)</p>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
              Pilih Pembayaran
            </label>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedPayment(m)}
                  className={`p-3 rounded-2xl border text-left transition ${
                    selectedPayment?.id === m.id
                      ? 'border-sky-500 bg-sky-50 text-sky-900 font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-sky-200'
                  }`}
                >
                  <div className="text-xs font-bold">{m.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{m.holder}</div>
                </button>
              ))}
            </div>
          </div>

          {selectedPayment && (
            <div className="bg-sky-50 p-3 rounded-2xl border border-sky-100">
              <span className="text-[10px] font-bold text-sky-700 block">Transfer Ke:</span>
              <p className="font-mono text-xs font-black text-slate-800 select-all mt-0.5">
                {selectedPayment.number} (a/n {selectedPayment.holder})
              </p>
            </div>
          )}

          <button
            onClick={handleBuyVip}
            disabled={loading}
            className="w-full btn-babyblue text-xs font-bold py-3 text-center"
          >
            {loading ? 'Memproses...' : 'Konfirmasi Pembayaran VIP'}
          </button>
        </div>
      </div>
    </div>
  );
}
