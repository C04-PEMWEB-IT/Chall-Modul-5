import { useState } from 'react';
import type { FormEvent } from 'react';
import type { NoteInput } from '../types/Note';

interface NoteFormProps {
  onAdd: (note: NoteInput) => void;
}

export function NoteForm({ onAdd }: NoteFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    onAdd({
      title: trimmedTitle,
      content: content.trim(),
      category: category.trim() || 'Umum',
    });

    setTitle('');
    setContent('');
    setCategory('');
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <h2>Tambah Catatan</h2>

      <div className="note-form__field">
        <label htmlFor="note-title">Judul</label>
        <input
          id="note-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul catatan..."
          required
        />
      </div>

      <div className="note-form__field">
        <label htmlFor="note-category">Kategori</label>
        <input
          id="note-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Contoh: Kuliah, Kerja, Pribadi"
        />
      </div>

      <div className="note-form__field">
        <label htmlFor="note-content">Isi Catatan</label>
        <textarea
          id="note-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tulis isi catatan di sini..."
        />
      </div>

      <button type="submit">Tambah Catatan</button>
    </form>
  );
}
