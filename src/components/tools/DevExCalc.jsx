import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';

export default function DevExCalc() {
  const [robuxToCash, setRobuxToCash] = useState(100000);

  const devExRateUSD = 0.0035; // $350 / 100,000
  const usdRateIDR = 15500; // Asumsi kurs Rp 15.500
  
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
