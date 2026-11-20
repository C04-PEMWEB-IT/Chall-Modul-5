import { useState } from 'react';
import { NoteCard } from './NoteCard';
import { NoteForm } from './NoteForm';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Note, NoteInput } from '../types/Note';

export function NotesBoard() {
  // Tahap 1 no.4: catatan disimpan di localStorage lewat custom hook
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
  // Tahap 1 no.3: state untuk kata kunci pencarian
  const [search, setSearch] = useState('');

  const handleAdd = (input: NoteInput) => {
    setNotes((prev) => [
      ...prev,
      {
        ...input,
        id: prev.reduce((max, note) => Math.max(max, note.id), 0) + 1,
      },
    ]);
  };

  const handleDelete = (id: number) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  // Filter berdasarkan judul (case-insensitive). State `notes` asli tidak diubah.
  const visibleNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <main className="notes-board">
      <h1>Papan Catatan</h1>

      <NoteForm onAdd={handleAdd} />

      <section aria-label="Daftar catatan">
        <h2>
          Catatan ({visibleNotes.length}
          {search.trim() && ` dari ${notes.length}`})
        </h2>

        <input
          className="notes-board__search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari judul..."
          aria-label="Cari catatan berdasarkan judul"
        />

        {notes.length === 0 ? (
          <p className="notes-board__empty">
            Belum ada catatan. Tambahkan catatan pertamamu!
          </p>
        ) : visibleNotes.length === 0 ? (
          <p className="notes-board__empty">
            Tidak ada catatan dengan judul "{search}".
          </p>
        ) : (
          <div className="notes-board__grid">
            {visibleNotes.map((note) => (
              <NoteCard key={note.id} note={note} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default NotesBoard;
