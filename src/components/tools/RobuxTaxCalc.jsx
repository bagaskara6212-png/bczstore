import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

export default function RobloxTaxCalc() {
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
