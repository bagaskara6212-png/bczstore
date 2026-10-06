import React from 'react';
import { Settings, Moon, Sun, Smartphone, X, Check, ShieldCheck } from 'lucide-react';

export default function SettingsModal({ onClose, darkMode, setDarkMode }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-sky-100 dark:border-slate-800 relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-sky-50 dark:bg-slate-800 p-2 rounded-full"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 rounded-2xl">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-sky-900 dark:text-sky-100">Pengaturan Tampilan</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Atur tema warna website kamu</p>
          </div>
        </div>

        <div className="space-y-2.5 pt-2 border-t border-sky-100 dark:border-slate-800">
          <div className="p-3.5 bg-sky-50/80 dark:bg-slate-800/80 rounded-2xl border border-sky-100 dark:border-slate-700 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white dark:bg-slate-900 rounded-xl text-sky-500 shadow-xs shrink-0">
                {darkMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-sky-900 dark:text-sky-100">
                  {darkMode ? 'Dark Mode (Sultan Night)' : 'Light Mode (Biru Susu)'}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Pilihan tema latar per perangkat</p>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
            </label>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-2 mt-2">
            <div className="flex items-center gap-2 text-slate-400">
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase font-bold tracking-wider">System Info</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <span>BCZ Store V4.5.5</span>
              <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-md text-[10px] flex items-center gap-1 font-bold">
                <Check className="w-3 h-3 text-emerald-600" /> v4.5.5 Stable
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <ShieldCheck className="w-3 h-3 text-sky-500" />
              <span>Golrox Engine + React & Firebase</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full btn-babyblue text-xs font-bold py-2.5"
        >
          Simpan & Tutup
        </button>
      </div>
    </div>
  );
}
