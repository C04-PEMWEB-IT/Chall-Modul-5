import type { Post } from '../types/Post';

interface PostCardProps {
  post: Post;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

// Komponen presentasi murni: tidak punya state dan tidak memanggil API.
// Aksi hapus diangkat ke PostBoard lewat props onDelete (lifting state up).
export function PostCard({ post, onDelete, isDeleting = false }: PostCardProps) {
  return (
    <article className="post-card">
      <div className="post-card__header">
        <h3>{post.title}</h3>
        <span className="post-card__user">User {post.userId}</span>
      </div>

      <p className="post-card__body">{post.body || '(Tidak ada isi)'}</p>

      <button
        type="button"
        disabled={isDeleting}
        onClick={() => onDelete(post.id)}
      >
        {isDeleting ? 'Menghapus...' : 'Hapus'}
      </button>
    </article>
  );
}
