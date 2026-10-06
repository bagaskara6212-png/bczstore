import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Award, Edit3, Save, X, ShieldCheck, CheckCircle2, Gamepad2, ShoppingBag, Camera } from 'lucide-react';

export default function MyAccounts({ user, isAdmin, isMainAdmin, isVip }) {
  const [profileData, setProfileData] = useState({
    username: '',
    bio: 'Pelanggan Setia BCZ Store',
    robloxUsername: '',
    avatarUrl: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        setProfileData((prev) => ({ ...prev, ...snap.data() }));
      } else {
        setProfileData((prev) => ({ ...prev, username: user.displayName || user.email.split('@')[0] }));
      }
    };

    fetchProfile();

    const q = query(collection(db, 'orders'), where('email', '==', user.email));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setOrders(list);
    });

    return () => unsub();
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...profileData,
        email: user.email,
        updatedAt: new Date(),
      }, { merge: true });
      setIsEditing(false);
      alert('Profil & Foto berhasil disimpan!');
    } catch (err) {
      alert('Gagal menyimpan profil: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div className="card-babyblue p-6 bg-white dark:bg-slate-900 border dark:border-slate-800 space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 p-0.5 shadow-md relative group">
              <div className="w-full h-full bg-white dark:bg-slate-800 rounded-[14px] flex items-center justify-center overflow-hidden">
                {profileData.avatarUrl ? (
                  <img src={profileData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-black text-2xl text-sky-600 dark:text-sky-400">{profileData.username.charAt(0).toUpperCase() || 'U'}</span>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-black text-slate-800 dark:text-white">{profileData.username || user.email.split('@')[0]}</h2>
                
                {isAdmin && (
                  <span title="Verified Admin">
                    <ShieldCheck className="w-4 h-4 text-amber-500 fill-amber-100 dark:fill-amber-900 inline" />
                  </span>
                )}
                {isVip && !isAdmin && (
                  <span title="Verified VIP">
                    <CheckCircle2 className="w-4 h-4 text-sky-500 fill-sky-100 dark:fill-sky-900 inline" />
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{profileData.bio}</p>
              {profileData.robloxUsername && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  <Gamepad2 className="w-3.5 h-3.5" /> Roblox: @{profileData.robloxUsername}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-slate-800 hover:bg-sky-100 rounded-xl border border-sky-200 dark:border-slate-700 transition flex items-center gap-1.5"
          >
            {isEditing ? <X className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            {isEditing ? 'Batal' : 'Edit Profil & Foto'}
          </button>
        </div>

        {isEditing && (
          <form onSubmit={handleSaveProfile} className="p-4 bg-sky-50/80 dark:bg-slate-800/80 rounded-2xl border border-sky-200 dark:border-slate-700 space-y-3 animate-in fade-in duration-150">
            <h3 className="text-xs font-bold text-sky-900 dark:text-sky-300 uppercase tracking-wider">Pengaturan Profil & PP</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Ganti Nama Pengguna</label>
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                  className="w-full input-babyblue text-xs bg-white dark:bg-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Roblox Username</label>
                <input
                  type="text"
                  placeholder="Bob679Cool"
                  value={profileData.robloxUsername}
                  onChange={(e) => setProfileData({ ...profileData, robloxUsername: e.target.value })}
                  className="w-full input-babyblue text-xs bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Bio / Status</label>
                <input
                  type="text"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full input-babyblue text-xs bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-sky-500" /> Link Foto Profil (URL / ImgBB)
                </label>
                <input
                  type="url"
                  placeholder="https://i.ibb.co/xxxx/foto.png"
                  value={profileData.avatarUrl}
                  onChange={(e) => setProfileData({ ...profileData, avatarUrl: e.target.value })}
                  className="w-full input-babyblue text-xs bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn-babyblue text-xs font-bold px-5 py-2 flex items-center gap-1.5">
              <Save className="w-3.5 h-3.5" /> {saving ? 'Menyimpan...' : 'Simpan Profil'}
            </button>
          </form>
        )}

        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="p-3 bg-sky-50/70 dark:bg-slate-800/60 rounded-2xl border border-sky-100 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-bold block">Points</span>
            <span className="text-sm font-black text-sky-700 dark:text-sky-400">120</span>
          </div>
          <div className="p-3 bg-sky-50/70 dark:bg-slate-800/60 rounded-2xl border border-sky-100 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-bold block">Voucher</span>
            <span className="text-sm font-black text-sky-700 dark:text-sky-400">2 Active</span>
          </div>
          <div className="p-3 bg-sky-50/70 dark:bg-slate-800/60 rounded-2xl border border-sky-100 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-bold block">BCZ Coins</span>
            <span className="text-sm font-black text-sky-700 dark:text-sky-400">Rp 5.000</span>
          </div>
        </div>
      </div>

      <div className="card-babyblue p-6 bg-white dark:bg-slate-900 border dark:border-slate-800 space-y-4">
        <h3 className="text-sm font-black text-sky-900 dark:text-sky-100 flex items-center gap-1.5">
          <ShoppingBag className="w-4 h-4 text-sky-600" /> Histori Transaksi Saya
        </h3>

        <div className="space-y-3">
          {orders.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">Belum ada transaksi dilakukan.</p>
          ) : (
            orders.map((item) => (
              <div key={item.id} className="p-4 bg-sky-50/60 dark:bg-slate-800/50 rounded-2xl border border-sky-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-sky-700 dark:text-sky-400">{item.orderId || item.id}</span>
                    <span className="text-[10px] bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200 px-2 py-0.5 rounded-md font-bold uppercase">{item.status || 'pending'}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.productName}</h4>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-sky-600 dark:text-sky-400 block">Rp {Number(item.price || 0).toLocaleString('id-ID')}</span>
                  <span className="text-[10px] text-slate-400">{item.paymentMethod}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
