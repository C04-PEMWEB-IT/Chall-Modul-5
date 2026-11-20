import type { Post } from '../types/Post';

// Tahap 2 (Anggota C): semua pemanggilan REST API post dipusatkan di file ini.
// Base URL bisa diganti lewat .env (VITE_API_URL) — fallback ke jsonplaceholder
// supaya app tetap jalan tanpa backend Modul 4.
const BASE_URL =
  import.meta.env.VITE_API_URL ?? 'https://jsonplaceholder.typicode.com/posts';

// Post yang dikirim ke server belum punya id (id dibuat server).
export type PostInput = Omit<Post, 'id'>;

// Backend Modul 4 membungkus respons dengan format { status, message, data, metadata },
// sedangkan jsonplaceholder langsung mengembalikan datanya. Fungsi ini menyatukan dua bentuk itu.
function unwrap<T>(json: unknown): T {
  if (typeof json === 'object' && json !== null && 'data' in json) {
    return (json as { data: T }).data;
  }
  return json as T;
}

export async function getPosts(
  search?: string,
  signal?: AbortSignal,
): Promise<Post[]> {
  // URLSearchParams otomatis meng-encode query (?search=...) dengan aman.
  const params = new URLSearchParams();
  const keyword = search?.trim() ?? '';
  if (keyword) params.set('search', keyword);
  // jsonplaceholder perlu _limit supaya datanya tidak berlebihan.
  if (BASE_URL.includes('jsonplaceholder')) params.set('_limit', '10');

  const query = params.toString();
  const res = await fetch(query ? `${BASE_URL}?${query}` : BASE_URL, { signal });
  if (!res.ok) throw new Error(`Gagal mengambil data (status ${res.status})`);

  const posts = unwrap<Post[]>(await res.json());

  // jsonplaceholder mengabaikan ?search=, jadi saring juga di sisi klien
  // berdasarkan judul (case-insensitive) agar pencarian tetap berfungsi.
  // Backend yang mendukung ?search= tidak terganggu karena hasilnya sama.
  if (!keyword) return posts;
  return posts.filter((post) =>
    post.title.toLowerCase().includes(keyword.toLowerCase()),
  );
}

export async function createPost(input: PostInput): Promise<Post> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Gagal menambah post (status ${res.status})`);

  // Spread input dulu: field yang tidak dikembalikan server tetap terisi.
  return { ...input, ...unwrap<Post>(await res.json()) };
}

export async function deletePost(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Gagal menghapus post (status ${res.status})`);
}
