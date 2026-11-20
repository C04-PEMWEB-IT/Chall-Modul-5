import { useEffect, useState } from 'react';
import { createPost, deletePost, getPosts } from '../api/posts';
import type { PostInput } from '../api/posts';
import type { Post } from '../types/Post';
import { PostCard } from './PostCard';
import { PostForm } from './PostForm';

// PostBoard adalah induk state untuk papan post (Tahap 2 - Anggota C).
// Semua logika API dipusatkan di sini; PostCard hanya presentasi.
export function PostBoard() {
  // Pola 3 state dari modul (bagian 10): data, isLoading, error
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Error aksi POST/DELETE dipisah agar daftar (hasil GET) tidak hilang
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // GET: jalan saat mount. AbortController di cleanup membatalkan request
  // saat komponen unmount (aman untuk StrictMode yang menjalankan efek 2x di dev).
  useEffect(() => {
    const controller = new AbortController();

    async function loadPosts() {
      setIsLoading(true);
      setError(null);
      try {
        setPosts(await getPosts(undefined, controller.signal));
      } catch (err) {
        // Request yang dibatalkan cleanup bukan error sungguhan; abaikan.
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadPosts();
    return () => controller.abort();
  }, []);

  const handleAdd = async (input: PostInput) => {
    setActionError(null);
    try {
      // Tunggu server sukses dulu, baru update UI (tanpa refresh).
      const created = await createPost(input);
      setPosts((prev) => {
        // jsonplaceholder selalu membalas id 101 sehingga bisa ganda;
        // buat id unik di klien agar key tidak bentrok.
        const id = prev.some((p) => p.id === created.id)
          ? prev.reduce((max, p) => Math.max(max, p.id), 0) + 1
          : created.id;
        return [...prev, { ...created, id }];
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Terjadi kesalahan saat menambah post';
      setActionError(message);
      // Dilempar lagi agar PostForm tahu gagal dan tidak mengosongkan isian.
      throw err;
    }
  };

  const handleDelete = async (id: number) => {
    setActionError(null);
    setDeletingId(id);
    try {
      await deletePost(id);
      // Update UI langsung dari state array, tanpa refresh (immutable).
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus post',
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="post-board">
      <h1>Daftar Post</h1>

      <PostForm onAdd={handleAdd} />

      {actionError && (
        <p className="post-board__status post-board__status--error" role="alert">
          {actionError}
        </p>
      )}

      <section aria-label="Daftar post dari API">
        <h2>Post ({posts.length})</h2>

        {/* Urutan tampilan wajib: loading -> error -> kosong -> daftar */}
        {isLoading ? (
          <p className="post-board__status">Memuat post...</p>
        ) : error ? (
          <p className="post-board__status post-board__status--error" role="alert">
            {error}
          </p>
        ) : posts.length === 0 ? (
          <p className="post-board__status">Belum ada post.</p>
        ) : (
          <div className="post-board__grid">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handleDelete}
                isDeleting={deletingId === post.id}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default PostBoard;
