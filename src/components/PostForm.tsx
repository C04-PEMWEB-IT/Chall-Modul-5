import { useState } from 'react';
import type { FormEvent } from 'react';
import type { PostInput } from '../api/posts';

interface PostFormProps {
  onAdd: (post: PostInput) => Promise<void>;
}

// Controlled form: setiap isian disimpan di state dan dibaca lewat value/onChange.
export function PostForm({ onAdd }: PostFormProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validasi: judul tidak boleh kosong setelah di-trim.
    const trimmedTitle = title.trim();
    if (!trimmedTitle || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAdd({ title: trimmedTitle, body: body.trim(), userId: 1 });
      // Form hanya dikosongkan jika POST sukses.
      // Kalau gagal, PostBoard menampilkan actionError (catch sengaja kosong),
      // dan isian dipertahankan supaya user tidak mengetik ulang.
      setTitle('');
      setBody('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h2>Tambah Post</h2>

      <div className="post-form__field">
        <label htmlFor="post-title">Judul</label>
        <input
          id="post-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul post..."
        />
      </div>

      <div className="post-form__field">
        <label htmlFor="post-body">Isi Post</label>
        <textarea
          id="post-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Tulis isi post di sini..."
        />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Mengirim...' : 'Tambah Post'}
      </button>
    </form>
  );
}
