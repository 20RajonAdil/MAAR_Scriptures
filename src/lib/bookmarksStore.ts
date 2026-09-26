import type { ScriptureId } from '../types/scripture';
import { localStore } from './localStore';

export interface StoredBookmark {
  scripture: ScriptureId;
  reference: string;
  text: string;
  originalText?: string;
  createdAt: number;
}

const KEY = 'bookmarks';

export function getBookmarks(): StoredBookmark[] {
  return localStore.getJSON<StoredBookmark[]>(KEY, []);
}

export function isBookmarked(scripture: ScriptureId, reference: string): boolean {
  return getBookmarks().some((b) => b.scripture === scripture && b.reference === reference);
}

// Toggle, same shape as MAAR.Quran's toggleBookmark — add if missing, else
// remove. Writes the whole array back to localStorage immediately.
export function toggleBookmark(bookmark: Omit<StoredBookmark, 'createdAt'>) {
  const all = getBookmarks();
  const exists = all.some((b) => b.scripture === bookmark.scripture && b.reference === bookmark.reference);
  const next = exists
    ? all.filter((b) => !(b.scripture === bookmark.scripture && b.reference === bookmark.reference))
    : [...all, { ...bookmark, createdAt: Date.now() }];
  localStore.setJSON(KEY, next);
  return !exists;
}

export function removeBookmark(scripture: ScriptureId, reference: string) {
  const next = getBookmarks().filter((b) => !(b.scripture === scripture && b.reference === reference));
  localStore.setJSON(KEY, next);
}
