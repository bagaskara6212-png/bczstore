import React, { useState, useEffect, useRef } from 'react';
import { X, Moon, Sun, Sparkles, Music, Play, Pause, Volume2, ShieldCheck, Crown, Lock } from 'lucide-react';

export default function SettingsModal({ onClose, themeMode, setThemeMode, isAdmin, isVip }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  const lofiAudioUrl = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf756.mp3?filename=lofi-study-112191.mp3";

  useEffect(() => {
    audioRef.current = new Audio(lofiAudioUrl);
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  // Cek apakah user berhak menggunakan tema eksklusif
  const isExclusiveUser = isAdmin || isVip;

  const themeOptions = [
    { id: 'light', label: 'Light Mode', desc: 'Tema Standar Biru Susu', icon: Sun, requiresExclusive: false },
    { id: 'dark', label: 'Dark Mode', desc: 'Tema Standar Sultan Night', icon: Moon, requiresExclusive: false },
    { id: 'glass-light', label: 'Full Liquid Glass (Light)', desc: 'Efek Kaca Bening Eksklusif', icon: Sparkles, requiresExclusive: true },
    { id: 'glass-dark', label: 'Full Liquid Glass (Dark)', desc: 'Efek Kaca Gelap Futuristic', icon: Crown, requiresExclusive: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg liquid-glass rounded-3xl p-6 space-y-6 animate-slide-up shadow-2xl relative border border-sky-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto scrollbar-none">
        
        {/* HEADER MODAL */}
        <div className="flex items-center justify-between pb-4 border-b border-sky-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-500 text-white rounded-2xl shadow-md shadow-sky-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">Pengaturan Tampilan & Musik</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pilih tema favorit dan atur lofi music</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-sky-50 dark:bg-slate-800 text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DAFTAR 4 MODE TEMA */}
        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
            Pilihan Tema Warna Web:
          </label>

          <div className="grid grid-cols-1 gap-2.5">
            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              const isLocked = opt.requiresExclusive && !isExclusiveUser;
              const isSelected = themeMode === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => !isLocked && setThemeMode(opt.id)}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    isLocked 
                      ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800' 
                      : isSelected
                      ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/20 cursor-pointer'
                      : 'bg-white/60 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border-sky-100 dark:border-slate-700 hover:border-sky-300 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-sky-100 dark:bg-slate-700 text-sky-600 dark:text-sky-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold flex items-center gap-1.5">
                        {opt.label}
                        {opt.requiresExclusive && (
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                            isSelected ? 'bg-amber-300 text-amber-900' : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          }`}>
                            VIP / Admin
                          </span>
                        )}
                      </h4>
                      <p className={`text-[10px] ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>{opt.desc}</p>
                    </div>
                  </div>

                  {isLocked && <Lock className="w-4 h-4 text-slate-400" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* PEMUTAR MUSIK LATAR */}
        <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white">Musik Latar (Lofi Chill)</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Putar musik santai saat belanja</p>
              </div>
            </div>

            <button
              onClick={toggleMusic}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isPlaying 
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20' 
                  : 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? "Jeda" : "Putar"}
            </button>
          </div>

          {isPlaying && (
            <div className="flex items-center gap-3 pt-2 border-t border-sky-200/50 dark:border-slate-700">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <span className="text-[10px] font-mono font-bold text-slate-500">{Math.round(volume * 100)}%</span>
            </div>
          )}
        </div>

        {/* TOMBOL SIMPAN */}
        <button
          onClick={onClose}
          className="w-full btn-babyblue py-3.5 text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
        >
          <ShieldCheck className="w-4 h-4" /> Simpan Pengaturan
        </button>

      </div>
    </div>
  );
}
