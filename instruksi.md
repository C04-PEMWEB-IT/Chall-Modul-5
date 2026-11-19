# Instruksi Lanjutan — Challenge Modul 5

Ditulis oleh **Anggota A**. Isinya: ringkasan yang sudah dikerjakan, kontrak data yang disepakati, dan panduan supaya Anggota B & C bisa lanjut tanpa bentrok.

---

## 0. Status saat ini

- Branch aktif: `feat/anggota-a`
- Setup awal **sudah dilakukan**:
  - Clone repo dari Organization
  - Vite di folder yang sudah ada: `npm create vite@latest . -- --template react-ts` → pilih **Ignore files and continue** kalau ditanya
  - `npm install`
  - `.gitignore` sudah memuat `node_modules` dan `dist`
  - Commit awal `chore: setup vite react ts` sudah di-`push` ke `main`
  - Branch kerja `feat/anggota-a` sudah dibuat
  - Folder `src/types`, `src/components`, `src/hooks`, `src/api` sudah ada
- `npm run build` ✅ dan `npm run lint` ✅ (bersih)
- Perubahan Anggota A **belum di-commit** saat file ini dibuat. Commit dulu sebelum push.

> ⚠️ Jangan `git add .` — itu akan memasukkan folder `Modul Praktikum Pemrograman Web/` dan `🎯 CHALLENGE MODUL 5.txt` yang bukan source aplikasi.

---

## 1. Yang sudah dikerjakan Anggota A

| File | Isi |
| :--- | :--- |
| `src/types/Note.ts` | `interface Note` + `type NoteInput` |
| `src/types/Post.ts` | `interface Post` sebagai kontrak bersama (dipakai Anggota C) |
| `src/components/NoteForm.tsx` | Controlled form: `useState`, `value`/`onChange`, `onSubmit` bertipe `FormEvent`, `preventDefault()`, validasi judul kosong, reset setelah submit, kirim data via `onAdd` |
| `src/components/NoteCard.tsx` | Props `note` + `onDelete`, tampil judul/kategori/isi, tombol hapus |
| `src/components/NotesBoard.tsx` | Induk state `notes`; `handleAdd` pakai spread array (immutable), `handleDelete` pakai `.filter()`, render `.map()` dengan `key={note.id}` |
| `src/App.tsx` | Starter template diganti jadi `<NotesBoard />` |
| `src/App.css` | CSS sederhana untuk form & kartu |

Alur state saat ini:

```
NoteForm --onAdd(NoteInput)--> NotesBoard --props note--> NoteCard
                                   ^                         |
                                   └──── onDelete(id) ───────┘
```

---

## 2. Kontrak data — jangan diubah sendiri, diskusi dulu kalau perlu

```ts
// src/types/Note.ts
export interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
}

// Data dari form ke induk: id dibuat oleh NotesBoard
export type NoteInput = Omit<Note, 'id'>;
```

```ts
// src/types/Post.ts
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}
```

> Catatan untuk Anggota C: bentuk `Post` ini mengikuti kesepakatan di file challenge (dan cocok dengan jsonplaceholder). Kalau backend Modul 4 kamu mengembalikan `content` / `author` seperti contoh di modul, **koordinasikan dulu** sebelum mengubah `Post.ts` supaya komponen lain tidak rusak.

---

## 3. Struktur folder & aturan Git

```text
src/
├── components/   NoteForm, NoteCard, NotesBoard, (PostForm, PostCard, ...)
├── hooks/        (useLocalStorage, usePosts — milik Anggota B)
├── api/          (posts.ts — milik Anggota C)
├── types/        Note.ts, Post.ts ✅ sudah ada
├── App.tsx       ✅ sekarang merender <NotesBoard />
├── main.tsx
└── App.css       ✅ CSS catatan
```

- Satu orang = satu branch: `feat/anggota-a`, `feat/anggota-b`, `feat/anggota-c`
- Merge **lewat Pull Request**, jangan push langsung ke `main`
- Tarik perubahan terbaru dulu sebelum mulai: `git fetch origin && git rebase origin/main` (atau merge sesuai kesepakatan tim)
- Jalankan `npm run build` **dan** `npm run lint` sebelum commit

---

## 4. Cara menjalankan

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b + vite build
npm run lint
```

---

## 5. Tugas Anggota B — filter + localStorage

### 5.1 Search/filter judul

Di `src/components/NotesBoard.tsx`:

1. Tambah `const [search, setSearch] = useState('')`
2. Tambah input controlled di atas daftar (misal `<input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari judul..." />`)
3. Filter sebelum `.map()`:

```tsx
const visibleNotes = notes.filter((note) =>
  note.title.toLowerCase().includes(search.toLowerCase()),
);
```

4. Render `visibleNotes` dan sesuaikan teks jumlah/empty state.

> Jebakan dari modul: jangan `{notes.length && <List />}` — kalau `0`, angka `0` ikut tercetak. Pakai `notes.length > 0 && ...`.

### 5.2 Custom hook `useLocalStorage`

Buat `src/hooks/useLocalStorage.ts`:

```ts
import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

Lalu di `NotesBoard.tsx`, ganti:

```ts
const [notes, setNotes] = useState<Note[]>([]);
```

dengan:

```ts
const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
```

`handleAdd` dan `handleDelete` tetap bisa dipakai apa adanya.

---

## 6. Tugas Anggota C — integrasi REST API

### 6.1 Backend Modul 4 (kalau dipakai)

```bash
npm install cors
npm install -D @types/cors
```

Tambahkan di `src/index.ts` backend, **sebelum** `app.use("/api", router)`:

```ts
import cors from 'cors';
app.use(cors({ origin: 'http://localhost:5173' }));
```

Kalau backend belum ada, pakai `https://jsonplaceholder.typicode.com/posts?_limit=5` (kontrak `Post`-nya sudah cocok).

### 6.2 `src/api/posts.ts`

Buat fungsi fetch terpusat dan **ambil `json.data`** karena format response Modul 4 adalah `{ status, message, data, metadata }`:

```ts
import type { Post } from '../types/Post';

const BASE_URL = 'http://localhost:3000/api/posts';

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Gagal mengambil data');
  const json = await res.json();
  return json.data;
}

export async function createPost(input: Omit<Post, 'id'>): Promise<Post> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Gagal menambah post');
  const json = await res.json();
  return json.data;
}

export async function deletePost(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Gagal menghapus post');
}
```

Sesuaikan kalau pakai jsonplaceholder (POST/DELETE tidak benar-benar menyimpan, tapi cukup untuk latihan UI).

### 6.3 Tampilan & state

- Komponen baru: `src/components/PostCard.tsx`, `src/components/PostForm.tsx`, dan satu induk misal `src/components/PostBoard.tsx`
- Pola 3 state wajib: `posts: Post[]`, `isLoading: boolean`, `error: string | null`
- `useEffect(() => { loadPosts() }, [])` untuk `GET`
- Bonus search: `useEffect(..., [search])` — lihat koordinasi di bagian 7
- `POST` / `DELETE` harus langsung mengubah UI **tanpa refresh**:

```ts
setPosts((prev) => [...prev, newPost]);                         // tambah
setPosts((prev) => prev.filter((p) => p.id !== id));            // hapus
```

- Tampilkan condition: loading → error → empty → list (urutan itu)

### 6.4 Pasang ke App

Nanti `App.tsx` bisa merender dua board:

```tsx
<NotesBoard />
<PostBoard />
```

---

## 7. Koordinasi B ↔ C: bonus `?search=...`

Anggota B menyiapkan **input + debounce**, Anggota C menyiapkan **fetch dengan query**.

**B** — di `NotesBoard` (atau komponen search bersama):

```tsx
useEffect(() => {
  const timer = setTimeout(() => setDebouncedSearch(search), 300);
  return () => clearTimeout(timer); // cleanup wajib
}, [search]);
```

**C** — di `posts.ts` / `PostBoard`:

```ts
const res = await fetch(`${BASE_URL}?search=${encodeURIComponent(query)}`);
```

```tsx
useEffect(() => {
  loadPosts(debouncedSearch);
}, [debouncedSearch]);
```

Sepakati dulu nama state/prop yang dipakai bareng supaya tidak perlu refactor besar saat merge.

---

## 8. Jebakan umum (ringkasan Modul 5)

| Gejala | Penyebab | Solusi |
| :--- | :--- | :--- |
| Tab hang / infinite loop | `setState` di `useEffect` tanpa dependency array | Tambah `[]` atau dependency spesifik |
| UI tidak berubah setelah `.push()` | State array dimutasi | `setNotes([...notes, baru])` |
| Warning `unique "key" prop` | Lupa `key` di `.map()` | `key={note.id}` |
| `CORS policy` | Backend belum izinkan origin Vite | `cors({ origin: 'http://localhost:5173' })` |
| `Parameter 'e' implicitly has an 'any' type` | Handler tanpa tipe | `React.FormEvent` / `FormEvent<HTMLFormElement>` |
| `useEffect` jalan 2× di dev | React `StrictMode` | Normal saat development |

---

## 9. Checklist sebelum commit / PR

- [ ] `npm run build` lolos
- [ ] `npm run lint` bersih
- [ ] `git status --short` — hanya file yang dimaksud yang masuk staging
- [ ] Tidak `git add .`
- [ ] Commit di branch sendiri, lalu `git push -u origin feat/anggota-<huruf>`
- [ ] Buat Pull Request ke `main`, tunggu review teman

Contoh commit Anggota A:

```bash
git add instruksi.md src/App.tsx src/App.css src/components src/types
git commit -m "feat: papan catatan lokal (Anggota A)"
git push -u origin feat/anggota-a
```
