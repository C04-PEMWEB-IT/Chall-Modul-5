import type { Note } from '../types/Note';

interface NoteCardProps {
  note: Note;
  onDelete: (id: number) => void;
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  return (
    <article className="note-card">
      <div className="note-card__header">
        <h3>{note.title}</h3>
        <span className="note-card__category">{note.category}</span>
      </div>

      <p className="note-card__content">{note.content || '(Tidak ada isi)'}</p>

      <button type="button" onClick={() => onDelete(note.id)}>
        Hapus
      </button>
    </article>
  );
}
