// MAAR Scriptures — Bible service
// Text: bible-api.com, a free public API serving the World English Bible (WEB)
// and King James Version (KJV), both public-domain translations.
import type { Passage } from '../types/scripture';

const BASE = 'https://bible-api.com';

export const BIBLE_BOOKS = [
  'Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth',
  '1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah',
  'Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah',
  'Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum',
  'Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts',
  'Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians',
  '1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews',
  'James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation',
];

export async function fetchChapter(book: string, chapter: number, translation = 'web'): Promise<Passage[]> {
  const res = await fetch(`${BASE}/${encodeURIComponent(book)}+${chapter}?translation=${translation}`);
  if (!res.ok) throw new Error('Could not load this chapter right now.');
  const json = await res.json();
  if (!json.verses) return [];
  return json.verses.map((v: any) => ({
    scripture: 'bible' as const,
    bookName: v.book_name,
    chapter: v.chapter,
    verseStart: v.verse,
    text: v.text.trim(),
    translation: translation === 'web' ? 'World English Bible (public domain)' : 'King James Version (public domain)',
    source: 'bible-api.com',
    license: 'Public domain translation',
    reference: `${v.book_name} ${v.chapter}:${v.verse}`,
  }));
}

export async function searchBible(query: string, translation = 'web'): Promise<Passage[]> {
  // bible-api.com supports fetching a reference or short passage; for topic search
  // MAAR queries a curated set of well-known passages client-side is out of scope here,
  // so we ask the API for the query as if it were a reference, and fall back to "not found".
  try {
    const res = await fetch(`${BASE}/${encodeURIComponent(query)}?translation=${translation}`);
    if (!res.ok) return [];
    const json = await res.json();
    if (!json.verses) return [];
    return json.verses.map((v: any) => ({
      scripture: 'bible' as const,
      bookName: v.book_name,
      chapter: v.chapter,
      verseStart: v.verse,
      text: v.text.trim(),
      translation: translation === 'web' ? 'World English Bible (public domain)' : 'King James Version (public domain)',
      source: 'bible-api.com',
      reference: `${v.book_name} ${v.chapter}:${v.verse}`,
    }));
  } catch {
    return [];
  }
}
