// MAAR Scriptures — Quran service
// Text + translations: api.alquran.cloud (Al Quran Cloud, free public API, no key required)
// Audio: Al Quran Cloud CDN edition audio (per-ayah), public domain reciter recordings.
import type { Passage, Surah } from '../types/scripture';

const BASE = 'https://api.alquran.cloud/v1';

export async function fetchSurahList(): Promise<Surah[]> {
  const res = await fetch(`${BASE}/surah`);
  if (!res.ok) throw new Error('Could not load the list of Surahs.');
  const json = await res.json();
  return json.data as Surah[];
}

export async function fetchSurah(
  surahNumber: number,
  translationEdition: string = 'en.sahih'
): Promise<Passage[]> {
  // Fetch Arabic (uthmani script) and one translation together
  const res = await fetch(`${BASE}/surah/${surahNumber}/editions/quran-uthmani,${translationEdition}`);
  if (!res.ok) throw new Error('Could not load this Surah right now.');
  const json = await res.json();
  const [arabic, translation] = json.data;
  return arabic.ayahs.map((ayah: any, i: number) => ({
    scripture: 'quran' as const,
    bookName: arabic.englishName,
    bookNumber: surahNumber,
    chapter: surahNumber,
    verseStart: ayah.numberInSurah,
    text: translation.ayahs[i]?.text ?? '',
    originalText: ayah.text,
    translation: translation.edition?.englishName ?? translationEdition,
    source: 'Al Quran Cloud (alquran.cloud)',
    license: 'Public API — see alquran.cloud for edition-level copyright notices',
    reference: `Surah ${arabic.englishName} ${surahNumber}:${ayah.numberInSurah}`,
    audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`,
  }));
}

export async function searchQuran(query: string, translationEdition: string = 'en.sahih'): Promise<Passage[]> {
  const res = await fetch(`${BASE}/search/${encodeURIComponent(query)}/all/${translationEdition}`);
  if (!res.ok) return [];
  const json = await res.json();
  if (json.code !== 200 || !json.data?.matches) return [];
  return json.data.matches.map((m: any) => ({
    scripture: 'quran' as const,
    bookName: m.surah.englishName,
    bookNumber: m.surah.number,
    chapter: m.surah.number,
    verseStart: m.numberInSurah,
    text: m.text,
    translation: translationEdition,
    source: 'Al Quran Cloud (alquran.cloud)',
    reference: `Surah ${m.surah.englishName} ${m.surah.number}:${m.numberInSurah}`,
  }));
}
