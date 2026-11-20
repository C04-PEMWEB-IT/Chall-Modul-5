# penjelasan.md — Brief untuk AI Agent (Anggota C, Tahap 2: Integrasi API)

> **Pembaca utama dokumen ini: AI agent** (Claude Code / agent lain) yang ditugaskan mengerjakan bagian **Anggota C**.
> Baca seluruh dokumen **sebelum** menulis kode. Bagian 1–3 = konteks, bagian 4 = aturan keras, bagian 5–8 = spesifikasi, bagian 9–10 = cara kerja & verifikasi, bagian 11 = bahan video untuk manusia.

Dokumen ini **hanya menambah**. Jangan mengubah file lain kecuali yang diizinkan eksplisit di bagian 4.

---

## 1. Konteks proyek

- Tugas kuliah **Challenge Modul 5 — Fundamental React dengan TypeScript** (Praktikum Pemrograman Web, kelompok C04-PEMWEB-IT).
- Stack: **Vite + React 19 + TypeScript** (CSS sederhana, tanpa library UI). Fokus penilaian: alur komponen, state, dan integrasi API.
- Hasil akhir dinilai lewat **video penjelasan kode** (bukan live coding). Artinya **kode harus mudah dijelaskan**: sederhana, rapi, komentar singkat berbahasa Indonesia di bagian penting. Jangan over-engineering.
- Rujukan resmi modul: https://github.com/lab-kcks/Modul-Pemrograman-Website-2026/tree/main/modul-5 (bagian 9 `useEffect`, 10 Fetch API, 12 struktur folder, 13 jebakan umum, 14 challenge).

### Teks soal (ringkas, asli dari asisten)

**Tahap 1 — Papan Catatan Lokal** (sudah dikerjakan Anggota A dan B):
1. `interface Note` (id, title, content, category) di `src/types/`.
2. Komponen `NoteForm` (controlled form) dan `NoteCard` (props + tombol hapus).
3. Pencarian/filter judul dengan `.filter()`.
4. Simpan catatan ke `localStorage` (custom hook `useLocalStorage`).

**Tahap 2 — Hubungkan ke REST API Modul 4** (**bagian ini tugasmu**):
1. Nyalakan server Express + Neon Modul 4 (pasang `cors`). Jika belum ada, pakai API publik `https://jsonplaceholder.typicode.com/posts`.
2. Tampilkan daftar Post dari `GET /api/posts` dengan tampilan **loading** dan **pesan error** jika server mati.
3. Form kirim post baru (`POST /api/posts`) dan tombol hapus (`DELETE /api/posts/:id`) yang **langsung memperbarui state UI tanpa refresh**.
4. **(Bonus)** Input pencarian yang mengirim query `?search=...` ke backend lewat `useEffect(..., [search])`.

---

## 2. Pembagian peran tim (dari teman, apa adanya)

### Anggota A — Tahap 1 (Catatan Lokal)
- `src/types/Note.ts`
- `NoteForm` (controlled form)
- `NoteCard` (props + tombol hapus)
- Menyusun state `notes` di komponen induk (`NotesBoard`)

### Anggota B — Tahap 1 (Fitur Tambahan) + Tahap 2 bagian Bonus
- Fitur search/filter dengan `.filter()` di catatan
- Custom hook `useLocalStorage` (simpan dan baca catatan)
- **Bonus:** input pencarian `?search=` dengan `useEffect(..., [search])` (idealnya **debounce**)

### Anggota C — Tahap 2 (Integrasi API) ← **KAMU**
- Setup backend Express + Neon + `cors` (atau pakai jsonplaceholder jika belum ada)
- `src/api/posts.ts` (fungsi fetch GET, POST, DELETE)
- Tampilan daftar post dengan state **loading** dan **error**
- Form kirim post baru + tombol hapus yang langsung update state UI

**Batas tanggung jawab:** Anggota A dan B sudah selesai. Tugasmu hanya bagian Anggota C. Untuk bonus `?search=`, Anggota B sudah menyediakan hook **debounce** (`src/hooks/useDebounce.ts`); sisi Anggota C adalah **fetch dengan query** dan memakai hook itu.

---

## 3. Kondisi repo saat ini (fakta yang sudah diverifikasi)

Struktur `src/` setelah pekerjaan Anggota A dan B:

```text
src/
├── api/                      (kosong / belum ada posts.ts)  ← milik Anggota C
├── components/
│   ├── NoteCard.tsx          (A)
│   ├── NoteForm.tsx          (A)
│   └── NotesBoard.tsx        (A, ditambah search oleh B)
├── hooks/
│   ├── useDebounce.ts        (B)  ← PAKAI INI untuk bonus search
│   └── useLocalStorage.ts    (B)
├── types/
│   ├── Note.ts               (A)
│   └── Post.ts               (A)  ← kontrak bersama, JANGAN diubah
├── App.tsx                   (saat ini hanya merender <NotesBoard />)
├── App.css                   (CSS catatan A + search B)
├── index.css
└── main.tsx                  (memakai <StrictMode>)
```

Fakta penting:

- `useDebounce<T>(value: T, delay = 300)` mengembalikan nilai yang sudah tertunda. Sudah ada, **jangan buat ulang**.
- `Post` (kontrak, **jangan diubah**):
  ```ts
  export interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
  }
  ```
  Bentuk ini cocok dengan jsonplaceholder.
- Variabel CSS yang sudah ada dan boleh dipakai: `--border`, `--bg`, `--text-h`, `--accent`, `--accent-bg`, `--accent-border`, `--social-bg`, `--shadow`.
- Konfigurasi ketat: `erasableSyntaxOnly`, `verbatimModuleSyntax` (wajib `import type` untuk tipe), `noUnusedLocals`, `noUnusedParameters`. ESLint memakai `eslint-plugin-react-hooks` v7.
- Pola gaya yang sudah dipakai A dan B (ikuti agar konsisten): komponen fungsi dengan `export function X`, props di `interface XProps`, nama kelas CSS gaya BEM (`note-card__header`), teks UI berbahasa Indonesia.

---

## 4. Aturan keras (WAJIB dipatuhi)

### Boleh
- **Membuat file baru**: `src/api/posts.ts`, `src/components/PostBoard.tsx`, `src/components/PostCard.tsx`, `src/components/PostForm.tsx`.
- **Mengubah `src/App.tsx`** hanya untuk menambah `<PostBoard />` setelah `<NotesBoard />`.
- **Menambah (append) di akhir `src/App.css`**, di bawah komentar `/* --- Anggota C: ... --- */`. Jangan mengubah atau menghapus CSS yang sudah ada.
- Menambah `.env` (opsional, jangan di-commit) berisi `VITE_API_URL=...`.

### Dilarang
- ❌ Mengubah `src/types/Post.ts`, `src/types/Note.ts`, atau komponen/hook milik A dan B (`NoteForm`, `NoteCard`, `NotesBoard`, `useLocalStorage`, `useDebounce`).
- ❌ Menambah dependency baru (tidak ada axios, react-query, router, UI library). Cukup `fetch` bawaan.
- ❌ `git add .` atau `git add -A`. Staging **hanya file yang disebut** di bagian 10.
- ❌ **Push ke remote / mengakses GitHub / membuat PR.** Semua git hanya lokal. Pemilik tugas yang akan push sendiri.
- ❌ Commit `package-lock.json` yang berubah akibat `npm install`, `dist/`, `node_modules/`, atau `.env`.
- ❌ Memakai `any`, `// @ts-ignore`, atau mematikan aturan ESLint untuk "menyelesaikan" error. Perbaiki akar masalahnya.
- ❌ Memutasi state (`push`, `splice`, dsb.). Selalu immutable.
- ❌ Mengarang fakta. Jika sesuatu tidak bisa diuji (mis. tidak ada akses jaringan), katakan terus terang di laporan akhir.

---

## 5. Kontrak API

### Skenario 1 — jsonplaceholder (default, tanpa backend)

| Aksi | Request | Respons |
| :-- | :-- | :-- |
| List | `GET https://jsonplaceholder.typicode.com/posts?_limit=10` | array `Post[]` langsung |
| Tambah | `POST .../posts` body `{ title, body, userId }` | objek `Post` dengan `id: 101` (selalu 101) |
| Hapus | `DELETE .../posts/:id` | `{}` status 200 |

Keterbatasan: **tidak menyimpan data sungguhan**. `?search=` **diabaikan** server → harus disaring di sisi klien. `POST` selalu membalas id `101` → id ganda, harus dibuat unik di sisi klien agar `key` tidak bentrok. `DELETE` pada post hasil `POST` (id ≥ 101) bisa gagal; itu keterbatasan API, bukan bug UI.

### Skenario 2 — backend Modul 4 (Express + Neon)

- Format respons dibungkus: `{ status, message, data, metadata }` → ambil `json.data`.
- Base URL: `http://localhost:3000/api/posts`.
- Backend wajib `cors`:
  ```ts
  // src/index.ts backend, SEBELUM app.use("/api", router)
  import cors from 'cors';
  app.use(cors({ origin: 'http://localhost:5173' }));
  ```
  Install: `npm install cors` dan `npm install -D @types/cors` (di folder **backend**, bukan di proyek ini).
- Contoh `Post` di modul memakai `content` dan `author`, berbeda dari `Post.ts` repo ini (`body`, `userId`). **Jangan ubah `Post.ts` sendiri**; laporkan ke pemilik tugas bila bentuk data backend berbeda.
- Dukungan bonus: `GET /api/posts?search=kata` dikirim ke backend.

### Satu kode untuk dua skenario
`BASE_URL` dibaca dari `import.meta.env.VITE_API_URL`, fallback ke jsonplaceholder. Fungsi `unwrap()` menangani respons bungkus `{ data }` maupun respons langsung.

---

## 6. Spesifikasi file

### 6.1 `src/api/posts.ts`

Ekspor wajib:

```ts
export type PostInput = Omit<Post, 'id'>;
export async function getPosts(search?: string, signal?: AbortSignal): Promise<Post[]>;
export async function createPost(input: PostInput): Promise<Post>;
export async function deletePost(id: number): Promise<void>;
```

Perilaku:
1. `BASE_URL` dari `import.meta.env.VITE_API_URL ?? 'https://jsonplaceholder.typicode.com/posts'`.
2. `unwrap<T>(json)`: jika `json` objek dengan properti `data`, kembalikan `json.data`; jika tidak, kembalikan `json` itu sendiri.
3. `getPosts`:
   - Bangun query dengan `URLSearchParams` (otomatis meng-encode). Tambah `search` hanya jika kata kunci (setelah `.trim()`) tidak kosong. Jika URL mengandung `jsonplaceholder`, tambah `_limit=10`.
   - `fetch(url, { signal })`; jika `!res.ok` → `throw new Error(...)` yang menyertakan status.
   - Jika ada kata kunci, **saring juga di klien** berdasarkan `title` (case-insensitive) agar jsonplaceholder tetap berfungsi. Untuk backend yang mendukung `?search=`, hasil tetap sama.
4. `createPost`: `POST`, header `Content-Type: application/json`, `JSON.stringify(input)`. Cek `res.ok`. Kembalikan `{ ...input, ...unwrap(json) }` (field yang tak dikembalikan server tetap terisi).
5. `deletePost`: `DELETE`, cek `res.ok`, tidak mengembalikan data.

Semua `throw` harus berupa `Error` dengan pesan berbahasa Indonesia yang jelas (`'Gagal mengambil data (status 500)'`).

### 6.2 `src/components/PostCard.tsx`

```ts
interface PostCardProps {
  post: Post;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}
```
- Tampilkan `title`, `userId` (badge "User N"), `body` (fallback `'(Tidak ada isi)'`).
- Tombol **Hapus** (`type="button"`) memanggil `onDelete(post.id)`; `disabled` dan teks "Menghapus..." saat `isDeleting`.
- Komponen presentasi murni: **tidak punya state**, tidak memanggil API (lifting state up).

### 6.3 `src/components/PostForm.tsx`

```ts
interface PostFormProps {
  onAdd: (post: PostInput) => Promise<void>;
}
```
- **Controlled form**: `useState` untuk `title` dan `body`, `value` + `onChange` di tiap input/textarea.
- `handleSubmit(e: FormEvent<HTMLFormElement>)`: `e.preventDefault()`, tolak judul kosong (setelah trim), `userId` tetap `1`.
- State `isSubmitting`: tombol `disabled` dan teks "Mengirim..." selama request.
- `await onAdd(...)` di dalam `try/catch/finally`: kosongkan form **hanya jika sukses**; jika gagal isian dipertahankan (pesan error ditampilkan oleh `PostBoard`, jadi `catch` di sini kosong dengan komentar alasannya); `finally` → `setIsSubmitting(false)`.
- Gunakan `label` + `htmlFor` dan `id` unik (`post-title`, `post-body`).

### 6.4 `src/components/PostBoard.tsx` (induk state)

State **wajib** (pola 3 state dari modul):
```ts
const [posts, setPosts] = useState<Post[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```
State tambahan: `actionError: string | null` (error POST/DELETE, agar daftar tidak hilang), `deletingId: number | null`, `search: string`, `debouncedSearch = useDebounce(search, 300)`.

**GET (useEffect)**:
```tsx
useEffect(() => {
  const controller = new AbortController();
  async function loadPosts() {
    setIsLoading(true);
    setError(null);
    try {
      setPosts(await getPosts(debouncedSearch, controller.signal));
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      if (!controller.signal.aborted) setIsLoading(false);
    }
  }
  loadPosts();
  return () => controller.abort();
}, [debouncedSearch]);
```
- **Dependency array wajib** (`[debouncedSearch]`) — tanpa itu terjadi infinite loop.
- Cleanup `abort()` membatalkan request lama (mencegah hasil lama menimpa hasil baru, dan aman untuk StrictMode yang menjalankan efek 2× di dev).
- Jika ESLint `react-hooks` mengeluh soal `setState` di efek, atur ulang struktur (mis. pindahkan reset `isLoading/error` ke handler `onChange` pencarian atau gunakan pola yang lolos lint) — **jangan** menonaktifkan aturan.

**POST (`handleAdd`)**: `await createPost(input)` dulu; **setelah sukses** baru `setPosts((prev) => [...prev, baruDenganIdUnik])`. Id unik: jika `created.id` sudah ada di `prev`, pakai `max(id) + 1`. Jika gagal → `setActionError(...)` lalu **`throw err` lagi** agar `PostForm` tidak mengosongkan isian.

**DELETE (`handleDelete`)**: `setDeletingId(id)`, `await deletePost(id)`, **setelah sukses** `setPosts((prev) => prev.filter((p) => p.id !== id))`; gagal → `setActionError(...)`; `finally` → `setDeletingId(null)`.

**Urutan tampilan** (wajib): `loading → error → kosong → daftar`.
- loading: `"Memuat post..."`
- error: pesan error, `role="alert"`, gaya merah
- kosong: bedakan `"Belum ada post."` dan `"Tidak ada post dengan judul \"{kata}\"."` (saat sedang mencari)
- daftar: `posts.map(...)` dengan **`key={post.id}`**

Struktur JSX: `<main className="post-board">` → `h1` "Daftar Post" → `<PostForm />` → blok `actionError` → `<section>` berisi judul "Post (n)", input cari (`type="search"`, controlled, `aria-label`), lalu konten kondisi di atas. Ekspor `PostBoard` (named) dan default.

### 6.5 `src/App.tsx`

```tsx
import { NotesBoard } from './components/NotesBoard';
import { PostBoard } from './components/PostBoard';
import './App.css';

export default function App() {
  return (
    <>
      <NotesBoard />
      <PostBoard />
    </>
  );
}
```

### 6.6 `src/App.css` (append saja)

Tambahkan di akhir file blok `/* --- Anggota C: papan post (integrasi API) --- */` dengan kelas: `.post-board`, `.post-form` (+ `__field`), `.post-card` (+ `__header`, `__user`, `__body`), `.post-board__search`, `.post-board__status` (+ `--error`), `.post-board__grid`. Gunakan variabel CSS yang sudah ada (bagian 3) agar tampilan seragam dengan catatan. Tombol disabled: `opacity: 0.6; cursor: not-allowed`.

---

## 7. Diagram aliran data

```text
PostForm --onAdd(PostInput)--> PostBoard --createPost()--> API
                                   │  sukses → setPosts([...prev, baru])
                                   ▼
                               PostCard --onDelete(id)--> PostBoard --deletePost()--> API
                                                              sukses → setPosts(prev.filter(...))

input cari --search--> useDebounce(300ms) --debouncedSearch--> useEffect --getPosts(search, signal)--> API
```

---

## 8. Jebakan yang harus dihindari (dari modul bagian 13)

| Gejala | Penyebab | Solusi di proyek ini |
| :-- | :-- | :-- |
| Tab hang / infinite loop | `setState` di `useEffect` tanpa dependency array | `useEffect(..., [debouncedSearch])` |
| `.push()` tapi UI tidak berubah | State array dimutasi | `[...prev, baru]`, `prev.filter(...)` |
| Warning `unique "key" prop` | Lupa `key`, atau id ganda (jsonplaceholder selalu 101) | `key={post.id}` + id unik di klien |
| `CORS policy` | Backend belum izinkan origin Vite | `cors({ origin: 'http://localhost:5173' })` |
| `Parameter 'e' implicitly has an 'any' type` | Handler tanpa tipe | `FormEvent<HTMLFormElement>` |
| `useEffect` jalan 2× di dev | React StrictMode | Normal; cleanup `abort()` menanganinya |
| `{items.length && <X/>}` mencetak `0` | `&&` pada angka | Gunakan kondisi eksplisit (`posts.length === 0`) |
| Hasil pencarian lama menimpa yang baru | Race condition antar request | `AbortController` + debounce |

---

## 9. Urutan kerja yang disarankan untuk agent

1. **Baca dulu**: `instruksi.md`, `src/types/Post.ts`, `src/hooks/useDebounce.ts`, `src/components/NotesBoard.tsx`, `src/App.css`, `package.json`. Jangan berasumsi, cek isinya.
2. **Cek apakah file Anggota C sudah ada** (`src/api/posts.ts`, `Post*.tsx`). Jika sudah ada, **verifikasi** terhadap spesifikasi ini dan perbaiki seperlunya, jangan tulis ulang tanpa alasan.
3. `npm install` jika `node_modules` belum ada.
4. Tulis berurutan: `posts.ts` → `PostCard` → `PostForm` → `PostBoard` → `App.tsx` → append `App.css`.
5. Jalankan verifikasi (bagian 10) dan perbaiki sampai hijau.
6. Commit lokal (bagian 10). **Jangan push.**
7. Tulis laporan akhir singkat (bagian 10).

---

## 10. Verifikasi, commit, dan laporan

### Kriteria selesai (semua harus terpenuhi)
- [ ] `npm run build` lolos tanpa error TypeScript
- [ ] `npm run lint` bersih (tanpa warning baru)
- [ ] Tiga state `posts / isLoading / error` ada, dengan urutan tampilan loading → error → kosong → daftar
- [ ] GET via `useEffect` dengan dependency array dan cleanup
- [ ] POST dan DELETE memperbarui UI **tanpa refresh**, setelah server sukses
- [ ] `key={post.id}` dan tidak ada id ganda di daftar
- [ ] Bonus: pencarian memakai `useDebounce`, query `?search=` dikirim lewat `getPosts`
- [ ] Tidak ada `any`, tidak ada mutasi state, tidak ada dependency baru
- [ ] `Post.ts`, `Note.ts`, dan komponen/hook A dan B **tidak berubah** (`git diff` pada file-file itu kosong)
- [ ] Isi `App.css` lama utuh (hanya bertambah di akhir)

### Pengujian manual (jika memungkinkan; jika tidak, katakan tidak diuji)
- Muat halaman → "Memuat post..." lalu daftar
- Tambah post → langsung muncul
- Hapus post → langsung hilang
- Ketik di kolom cari → daftar menyempit setelah ±300 ms
- Matikan jaringan / salahkan `VITE_API_URL` → pesan error muncul (bukan layar kosong)

### Commit (lokal saja)
```bash
git checkout -b feat/anggota-c        # jika belum
git status --short                     # periksa dulu
git add src/api src/components/PostBoard.tsx src/components/PostCard.tsx \
        src/components/PostForm.tsx src/App.tsx src/App.css penjelasan.md
git commit -m "feat: integrasi REST API posts (Anggota C)"
```
Jika `package-lock.json` muncul sebagai berubah hanya karena `npm install`, kembalikan dengan `git checkout -- package-lock.json`. **Tidak ada `git push`, tidak ada PR.**

### Laporan akhir (format singkat)
1. File yang dibuat/diubah.
2. Hasil `npm run build` dan `npm run lint`.
3. Apa yang **diuji** dan apa yang **tidak** (mis. tidak ada akses jaringan).
4. Keterbatasan yang diketahui (jsonplaceholder tidak menyimpan data; `DELETE` post id ≥ 101 bisa gagal).
5. Hal yang butuh keputusan manusia (mis. bentuk data backend Modul 4 berbeda dari `Post.ts`).

---

## 11. Bahan video (untuk manusia, bukan agent)

Format nama video: `NamaKelompok_Asistensi_Modul5_NamaAsisten`. Isi: **penjelasan kode hasil akhir** (tidak live coding). Pengumpulan: https://forms.gle/qpKhndCBiz3BCx8P8, deadline **Jumat 23:59**.

Urutan bicara bagian Anggota C (±8 menit):

1. **Konteks (30 dtk)**: Tahap 2, React terhubung ke REST API (jsonplaceholder atau backend Modul 4). Tunjukkan `src/api`, `components`, `types`.
2. **`posts.ts` (1 mnt)**: semua `fetch` di satu file; cek `res.ok`; `unwrap` untuk format `{ data }`; query `?search=` dengan `URLSearchParams`.
3. **`PostBoard` state dan GET (1,5 mnt)**: tiga state; `useEffect` dengan `[debouncedSearch]`; `try/catch/finally`; cleanup `abort()`; kenapa dependency array wajib.
4. **Kondisi tampilan (30 dtk)**: loading → error → kosong → daftar.
5. **POST dan DELETE (1,5 mnt)**: tunggu server sukses, lalu `[...prev, baru]` dan `prev.filter(...)`; kenapa tidak boleh `push`; `key={post.id}`.
6. **`PostForm` (45 dtk)**: controlled form, `preventDefault`, `FormEvent`, form dikosongkan hanya saat sukses.
7. **Bonus search (45 dtk)**: `search` vs `debouncedSearch`; `useDebounce` buatan Anggota B; request hanya setelah berhenti mengetik.
8. **Demo (1 mnt)**: loading, tambah, hapus, cari, simulasi error.

Catatan demo: pakai backend Modul 4 bila ingin hapus/tambah terlihat konsisten; jsonplaceholder tidak menyimpan data.
