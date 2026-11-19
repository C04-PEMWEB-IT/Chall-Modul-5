export interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
}

// Kontrak data dari NoteForm ke NotesBoard (id dibuat oleh komponen induk).
export type NoteInput = Omit<Note, 'id'>;
