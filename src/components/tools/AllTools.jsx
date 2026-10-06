import React, { useState } from 'react';
import { Wrench, Calculator, DollarSign, KeyRound, Copy, Check } from 'lucide-react';

// === 1. KOMPONEN KALKULATOR TAX ROBLOX ===
function RobloxTaxCalc() {
  const [robuxInput, setRobuxInput] = useState(100);

  const cleanRobux = parseInt(robuxInput, 10) || 0;
  const gamepassPrice = Math.ceil(cleanRobux / 0.7);
  const robloxTax = gamepassPrice - cleanRobux;

  return (
    <div className="card-babyblue p-6 space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 rounded-2xl">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black">Kalkulator Tax (30%)</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Hitung pas harga Gamepass</p>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold mb-1">Target Robux Bersih</label>
        <input
          type="number"
          min="1"
          value={robuxInput}
          onChange={(e) => setRobuxInput(e.target.value)}
          className="input-babyblue"
        />
      </div>

      <div className="p-4 bg-sky-50 dark:bg-slate-800/80 rounded-2xl border border-sky-100 dark:border-slate-700">
        <span className="text-[10px] font-bold text-slate-500 block uppercase">Set Harga Gamepass:</span>
        <div className="text-xl font-black text-sky-600 dark:text-sky-400">
          {gamepassPrice.toLocaleString('id-ID')} R$
        </div>
        <span className="text-[10px] text-slate-400 block mt-1">
          (Pajak Roblox: {robloxTax.toLocaleString('id-ID')} R$)
        </span>
      </div>
    </div>
  );
}

// === 2. KOMPONEN DEVEX CONVERTER ===
function DevExCalc() {
  const [robuxToCash, setRobuxToCash] = useState(100000);

  const devExRateUSD = 0.0035; // $350 / 100,000 R$
  const usdRateIDR = 15500; // Asumsi Kurs IDR
  
  const cleanRobux = parseInt(robuxToCash, 10) || 0;
  const totalUSD = cleanRobux * devExRateUSD;
  const totalIDR = totalUSD * usdRateIDR;

  return (
    <div className="card-babyblue p-6 space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-2xl">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black">DevEx Converter</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Estimasi pencairan Robux</p>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold mb-1">Jumlah Robux (Minimal 30K)</label>
        <input
          type="number"
          min="0"
          value={robuxToCash}
          onChange={(e) => setRobuxToCash(e.target.value)}
          className="input-babyblue"
        />
      </div>

      <div className="p-4 bg-emerald-50 dark:bg-slate-800/80 rounded-2xl border border-emerald-100 dark:border-slate-700">
        <span className="text-[10px] font-bold text-slate-500 block uppercase">Estimasi Pendapatan:</span>
        <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
          ${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <span className="text-[10px] text-slate-400 block mt-1">
          (~ Rp {totalIDR.toLocaleString('id-ID')})
        </span>
      </div>
    </div>
  );
}

// === 3. KOMPONEN PASSWORD GENERATOR ===
function PasswordGen() {
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

      <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 min-h-[70px] flex items-center justify-center break-all text-center relative">
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

// === HALAMAN UTAMA ALL TOOLS ===
export default function AllTools() {
  return (
    <div className="space-y-6">
      <div className="card-babyblue p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-sky-400 to-indigo-500 text-white rounded-2xl shadow-lg shadow-sky-500/20">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">Koleksi Alat Pintar</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Kalkulator pajak, konverter DevEx, dan generator password.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RobloxTaxCalc />
        <DevExCalc />
        <PasswordGen />
      </div>
    </div>
  );
}
