import Dexie, { type Table } from 'dexie';
import type { Note, Bookmark } from '../types/scripture';

class MaarDB extends Dexie {
  notes!: Table<Note, string>;
  bookmarks!: Table<Bookmark, string>;

  constructor() {
    super('maar-scriptures-db');
    this.version(1).stores({
      notes: 'id, scripture, reference, updatedAt',
      bookmarks: 'id, scripture, reference, createdAt',
    });
  }
}

// All notes and bookmarks live only in this browser's IndexedDB.
// Nothing here is sent to any server. Clearing it (Settings > Clear local data,
// or clearing browser data) removes it permanently.
export const db = new MaarDB();

export function newId() {
  return crypto.randomUUID();
}
