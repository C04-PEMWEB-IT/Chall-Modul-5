import { useEffect, useState } from 'react';

// Menunda update nilai sampai user berhenti mengetik selama `delay` ms.
// Dipakai untuk bonus ?search= supaya request ke backend tidak dikirim di tiap huruf.
export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // cleanup: batalkan timer lama kalau value berubah lagi
  }, [value, delay]);

  return debounced;
}
