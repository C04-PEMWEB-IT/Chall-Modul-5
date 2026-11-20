import { useEffect, useState } from 'react';
import { getPosts } from '../api/posts';
import type { Post } from '../types/Post';
import { PostCard } from './PostCard';

// PostBoard adalah induk state untuk papan post (Tahap 2 - Anggota C).
// Semua logika API dipusatkan di sini; PostCard hanya presentasi.
export function PostBoard() {
  // Pola 3 state dari modul (bagian 10): data, isLoading, error
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <main className="post-board">
      <h1>Daftar Post</h1>

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
              <PostCard key={post.id} post={post} onDelete={() => {}} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default PostBoard;
