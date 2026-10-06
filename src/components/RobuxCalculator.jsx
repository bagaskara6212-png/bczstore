import React, { useState } from 'react';
import { Calculator, ArrowRight, ShieldAlert } from 'lucide-react';

export default function RobuxCalculator() {
  const [robuxInput, setRobuxInput] = useState(100);

  const cleanRobux = parseInt(robuxInput, 10) || 0;
  const gamepassPrice = Math.ceil(cleanRobux / 0.7);
  const robloxTax = gamepassPrice - cleanRobux;

  return (
    <div className="card-babyblue p-6 bg-white dark:bg-slate-900 border dark:border-slate-800 space-y-4 max-w-2xl mx-auto my-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 rounded-2xl">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-800 dark:text-white">Kalkulator Tax Roblox (30%)</h3>
          <p className="text-[11px] text-slate-400">Hitung pas harga Gamepass kamu agar Robux yang didapat tidak kurang</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
            Jumlah Robux Bersih Dikirim
          </label>
          <input
            type="number"
            min="1"
            value={robuxInput}
            onChange={(e) => setRobuxInput(e.target.value)}
            className="w-full input-babyblue text-xs dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="p-4 bg-sky-50 dark:bg-slate-800/80 rounded-2xl border border-sky-100 dark:border-slate-700 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Set Harga Gamepass ke:</span>
          <div className="text-lg font-black text-sky-600 dark:text-sky-400 flex items-center gap-1">
            <span>{gamepassPrice.toLocaleString('id-ID')} Robux</span>
          </div>
          <span className="text-[10px] text-slate-400 block">
            (Pajak Roblox 30%: {robloxTax.toLocaleString('id-ID')} Robux)
          </span>
        </div>
      </div>
    </div>
  );
}
