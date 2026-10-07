import { useState, useEffect } from 'react';

export default function useTheme() {
  const [themeMode, setThemeMode] = useState(() => {
    const saved = localStorage.getItem('bcz_theme_mode');
    return saved || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('bcz_theme_mode', themeMode);
    const root = document.documentElement;

    // Bersihkan semua kelas tema
    root.classList.remove('dark', 'theme-glass-light', 'theme-glass-dark');

    if (themeMode === 'light') {
      // Light Mode: Wajib copot kelas dark
      root.classList.remove('dark');
    } else if (themeMode === 'dark') {
      // Dark Mode
      root.classList.add('dark');
    } else if (themeMode === 'glass-light') {
      // Full Liquid Glass Light: Copot dark, pasang glass-light
      root.classList.remove('dark');
      root.classList.add('theme-glass-light');
    } else if (themeMode === 'glass-dark') {
      // Full Liquid Glass Dark
      root.classList.add('dark', 'theme-glass-dark');
    }
  }, [themeMode]);

  return [themeMode, setThemeMode];
}
