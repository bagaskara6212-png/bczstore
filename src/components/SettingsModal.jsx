import React, { useState, useEffect, useRef } from 'react';
import { X, Moon, Sun, Music, Play, Pause, Volume2, ShieldCheck, Sparkles, Smartphone } from 'lucide-react';

export default function SettingsModal({ onClose, darkMode, setDarkMode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  // Link musik lofi/chill gratis untuk latar belakang web store
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg liquid-glass rounded-3xl p-6 space-y-6 animate-slide-up shadow-2xl relative border border-sky-100 dark:border-slate-800">
        
        {/* HEADER MODAL */}
        <div className="flex items-center justify-between pb-4 border-b border-sky-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-500 text-white rounded-2xl shadow-md shadow-sky-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">Pengaturan Tampilan & Musik</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Atur pengalaman cinema web kamu</p>
            </div>
          </div>

          {/* TOMBOL CLOSE (X) */}
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-sky-50 dark:bg-slate-800 text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* KONTEN PENGATURAN */}
        <div className="space-y-4">
          
          {/* 1. TOGGLE DARK/LIGHT MODE */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-sky-50/50 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-indigo-950 text-amber-600 dark:text-indigo-400">
                {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                  {darkMode ? "Dark Mode (Sultan Night)" : "Light Mode (Biru Susu)"}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Sesuaikan kenyamanan mata</p>
              </div>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                darkMode ? 'bg-sky-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                  darkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 2. PEMUTAR MUSIK LATAR BELAKANG */}
          <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">Musik Latar (Lofi Chill)</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Dengarkan musik santai saat belanja</p>
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
                {isPlaying ? "Jeda" : "Putar Musik"}
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

          {/* 3. SYSTEM INFO CARD */}
          <div className="p-4 rounded-2xl bg-sky-50/30 dark:bg-slate-800/40 border border-sky-100 dark:border-slate-700 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-sky-500" />
              <span className="font-bold text-slate-700 dark:text-slate-300">BCZ Store V4.5.5</span>
            </div>
            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-extrabold text-[10px] border border-emerald-200 dark:border-emerald-800">
              Stable Cinema
            </span>
          </div>

        </div>

        {/* FOOTER TOMBOL AKSI */}
        <button
          onClick={onClose}
          className="w-full btn-babyblue py-3.5 text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
        >
          <ShieldCheck className="w-4 h-4" /> Simpan & Tutup
        </button>

      </div>
    </div>
  );
}
