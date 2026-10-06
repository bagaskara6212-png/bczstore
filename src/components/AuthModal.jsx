import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { X, Sparkles, User, LogIn } from 'lucide-react';

export default function AuthModal({ onClose, forceWelcome = false }) {
  const [usernameInput, setUsernameInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const user = res.user;

      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          username: usernameInput.trim() || user.displayName || user.email.split('@')[0],
          bio: 'Pelanggan Setia BCZ Store',
          avatarUrl: user.photoURL || '',
          robloxUsername: '',
          createdAt: new Date(),
        });
      }
      onClose();
    } catch (err) {
      alert('Gagal Login Google: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-sky-100 dark:border-slate-800 relative animate-in fade-in zoom-in duration-200">
        {!forceWelcome && (
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-sky-50 dark:bg-slate-800 p-2 rounded-full">
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 rounded-2xl flex items-center justify-center mx-auto border border-sky-200 dark:border-sky-800">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl font-black text-sky-950 dark:text-sky-100">Selamat Datang di BCZ Store</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Masukkan Nama Pengguna kamu dan login instan dengan Google!</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-sky-500" /> Nama Pengguna
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: BagasSultan"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full input-babyblue text-xs dark:bg-slate-800 dark:text-white dark:border-slate-700"
            />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading || !usernameInput.trim()}
            className="w-full py-3 px-4 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition shadow-md shadow-sky-500/20"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4 bg-white rounded-full p-0.5" alt="Google" />
            {loading ? 'Memproses...' : 'Lanjut & Login Google'}
          </button>
        </div>
      </div>
    </div>
  );
}
