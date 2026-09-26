// MAAR Scriptures — Torah service
// Text: Sefaria API (sefaria.org), an open, free digital library of Jewish texts.
// Torah = the Five Books of Moses (Genesis–Deuteronomy) from the Tanakh.
import type { Passage } from '../types/scripture';

const BASE = 'https://www.sefaria.org/api';

export const TORAH_BOOKS = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'];

export async function fetchChapter(book: string, chapter: number): Promise<Passage[]> {
  const res = await fetch(`${BASE}/texts/${encodeURIComponent(book)}.${chapter}?context=0`);
  if (!res.ok) throw new Error('Could not load this chapter right now.');
  const json = await res.json();
  const heb: string[] = json.he ?? [];
  const eng: string[] = json.text ?? [];
  const len = Math.max(heb.length, eng.length);
  const out: Passage[] = [];
  for (let i = 0; i < len; i++) {
    out.push({
      scripture: 'torah',
      bookName: book,
      chapter,
      verseStart: i + 1,
      text: stripHtml(eng[i] ?? ''),
      originalText: stripHtml(heb[i] ?? ''),
      translation: json.versionTitle || 'Sefaria English translation',
      source: 'Sefaria (sefaria.org)',
      license: 'See Sefaria for per-edition licensing (many editions are public domain or CC)',
      reference: `${book} ${chapter}:${i + 1}`,
    });
  }
  return out;
}

export async function searchTorah(query: string): Promise<Passage[]> {
  try {
    const res = await fetch(`${BASE}/search-wrapper`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        type: 'text',
        field: 'naive_lemmatizer',
        size: 10,
        filters: ['Tanakh/Torah'],
      }),
    });
    if (!res.ok) return [];
    const json = await res.json();
    const hits = json?.hits?.hits ?? [];
    return hits.map((h: any) => ({
      scripture: 'torah' as const,
      bookName: h._source?.ref?.split(' ')[0] ?? 'Torah',
      chapter: 0,
      verseStart: 0,
      text: stripHtml(h._source?.exact ?? h._source?.content ?? ''),
      translation: 'Sefaria search index',
      source: 'Sefaria (sefaria.org)',
      reference: h._source?.ref ?? '',
    }));
  } catch {
    return [];
  }
}

function stripHtml(s: string) {
  return s.replace(/<[^>]+>/g, '').trim();
}
