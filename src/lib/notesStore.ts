import type { ScriptureId } from '../types/scripture';
import { localStore } from './localStore';

// One note per verse, keyed like MAAR.Quran's `${surah}:${ayah}` pattern —
// here `${scripture}:${reference}` since MAAR Read spans three scriptures.
export interface StoredNote {
  scripture: ScriptureId;
  reference: string;
  text: string;
  originalText?: string;
  noteBody: string;
  updatedAt: number;
}

type NotesMap = Record<string, StoredNote>;

const KEY = 'notes';

function noteKey(scripture: ScriptureId, reference: string) {
  return `${scripture}:${reference}`;
}

export function getAllNotes(): NotesMap {
  return localStore.getJSON<NotesMap>(KEY, {});
}

export function getNote(scripture: ScriptureId, reference: string): string {
  const all = getAllNotes();
  return all[noteKey(scripture, reference)]?.noteBody ?? '';
}

// Called on every keystroke, same as the reference app's onInput handler —
// it writes straight to localStorage each time, no separate save step.
export function setNote(input: Omit<StoredNote, 'updatedAt'>) {
  const all = getAllNotes();
  const key = noteKey(input.scripture, input.reference);
  if (!input.noteBody.trim()) {
    delete all[key];
  } else {
    all[key] = { ...input, updatedAt: Date.now() };
  }
  localStore.setJSON(KEY, all);
}

export function deleteNote(scripture: ScriptureId, reference: string) {
  const all = getAllNotes();
  delete all[noteKey(scripture, reference)];
  localStore.setJSON(KEY, all);
}
