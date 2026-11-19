import { useState } from 'react';
import { NoteCard } from './NoteCard';
import { NoteForm } from './NoteForm';
import type { Note, NoteInput } from '../types/Note';

export function NotesBoard() {
  const [notes, setNotes] = useState<Note[]>([]);

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

  return (
    <main className="notes-board">
      <h1>Papan Catatan</h1>

      <NoteForm onAdd={handleAdd} />

      <section aria-label="Daftar catatan">
        <h2>Catatan ({notes.length})</h2>

        {notes.length === 0 ? (
          <p className="notes-board__empty">
            Belum ada catatan. Tambahkan catatan pertamamu!
          </p>
        ) : (
          <div className="notes-board__grid">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default NotesBoard;
