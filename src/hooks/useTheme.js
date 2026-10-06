import { useState, useEffect } from 'react';

export default function useTheme() {
  const [darkMode, setDarkMode] = useState(() => {
    // 1. Cek jika user pernah mengatur tema secara manual
    const saved = localStorage.getItem('bcz_dark_mode');
    if (saved !== null) return JSON.parse(saved);
    
    // 2. Jika belum, baca pengaturan sistem HP otomatis
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    // Terapkan ke HTML root & simpan ke Local Storage
    localStorage.setItem('bcz_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Listener jika user mengubah tema HP saat web sedang dibuka
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (localStorage.getItem('bcz_dark_mode') === null) {
        setDarkMode(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return [darkMode, setDarkMode];
}
