import { useState, useEffect } from 'react';

export default function useTheme() {
  const [themeMode, setThemeMode] = useState(() => {
    const saved = localStorage.getItem('bcz_theme_mode');
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('bcz_theme_mode', themeMode);
    
    // Hapus semua kelas tema lama
    document.documentElement.classList.remove('dark', 'theme-glass-light', 'theme-glass-dark');

    // Pasang kelas tema sesuai pilihan
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (themeMode === 'glass-light') {
      document.documentElement.classList.add('theme-glass-light');
    } else if (themeMode === 'glass-dark') {
      document.documentElement.classList.add('dark', 'theme-glass-dark');
    }
  }, [themeMode]);

  return [themeMode, setThemeMode];
}
