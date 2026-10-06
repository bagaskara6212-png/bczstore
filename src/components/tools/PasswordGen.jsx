import React, { useState } from 'react';
import { KeyRound, Copy, Check } from 'lucide-react';

export default function PasswordGen() {
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let newPass = "";
    for (let i = 0; i < 16; i++) {
      newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPass);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card-babyblue p-6 space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-2xl">
          <KeyRound className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black">Password Generator</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Buat sandi akun anti-hack</p>
        </div>
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 min-h-[70px] flex items-center justify-center break-all text-center relative group">
        {password ? (
          <span className="font-mono font-bold text-sm text-slate-800 dark:text-white">{password}</span>
        ) : (
          <span className="text-xs text-slate-400">Klik generate untuk membuat</span>
        )}
        
        {password && (
          <button 
            onClick={copyToClipboard}
            className="absolute right-2 top-2 p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-sky-500 hover:text-sky-600 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        )}
      </div>

      <button onClick={generatePassword} className="w-full btn-babyblue py-3 text-xs">
        Generate Password Baru
      </button>
    </div>
  );
}
