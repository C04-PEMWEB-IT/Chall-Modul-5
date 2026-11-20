import { useEffect, useState } from 'react';

// Custom hook: dipakai persis seperti useState, tapi nilainya
// otomatis dibaca dari & disimpan ke localStorage.
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Lazy initializer: fungsi ini hanya jalan SEKALI saat komponen pertama render,
  // jadi localStorage tidak dibaca ulang di setiap render.
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? (JSON.parse(saved) as T) : initialValue;
    } catch {
      // JSON rusak / localStorage diblokir -> pakai nilai awal
      return initialValue;
    }
  });

  // Setiap value (atau key) berubah, simpan ulang ke localStorage.
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage penuh / tidak tersedia: abaikan, app tetap jalan
    }
  }, [key, value]);

  return [value, setValue] as const;
}
