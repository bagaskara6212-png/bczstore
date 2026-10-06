import React from 'react';
import { Wrench } from 'lucide-react';
import RobloxTaxCalc from './RobloxTaxCalc';
import DevExCalc from './DevExCalc';
import PasswordGen from './PasswordGen';

export default function AllTools() {
  return (
    <div className="space-y-6">
      {/* HEADER TOOLS */}
      <div className="card-babyblue p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-sky-400 to-indigo-500 text-white rounded-2xl shadow-lg shadow-sky-500/20">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">Koleksi Alat Pintar</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Kalkulator pajak, konverter DevEx, dan alat utilitas lainnya.
            </p>
          </div>
        </div>
      </div>

      {/* GRID TOOLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RobloxTaxCalc />
        <DevExCalc />
        <PasswordGen />
      </div>
    </div>
  );
}
