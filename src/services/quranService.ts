// MAAR Read — Quran service
// Text + translations: api.alquran.cloud (Al Quran Cloud, free public API, no key required)
// Audio: Al Quran Cloud CDN edition audio (per-ayah), public domain reciter recordings.
import type { Passage, Surah } from '../types/scripture';
import { hasSeparateBismillah, stripBismillahPrefix } from '../lib/bismillah';

const BASE = 'https://api.alquran.cloud/v1';

// Which Quran translation edition to load per interface language, so
// switching the app to Bangla or Urdu also translates the verse text
// underneath the Arabic — not just the surrounding UI chrome. If an
// edition ID below turns out to be wrong or gets retired, fetchSurah
// falls back to English rather than showing a broken page.
export const TRANSLATION_EDITION_BY_LANG: Record<string, string> = {
  en: 'en.sahih',
  bn: 'bn.bengali',
  ur: 'ur.jalandhry',
  ar: 'ar.muyassar',
};
const FALLBACK_EDITION = 'en.sahih';

export async function fetchSurahList(): Promise<Surah[]> {
  const res = await fetch(`${BASE}/surah`);
  if (!res.ok) throw new Error('Could not load the list of Surahs.');
  const json = await res.json();
  return json.data as Surah[];
}

async function fetchSurahWithEdition(surahNumber: number, translationEdition: string) {
  const res = await fetch(`${BASE}/surah/${surahNumber}/editions/quran-uthmani,${translationEdition}`);
  if (!res.ok) throw new Error('edition unavailable');
  const json = await res.json();
  if (json.code !== 200 || !json.data) throw new Error('edition unavailable');
  return json.data;
}

export async function fetchSurah(surahNumber: number, uiLang: string = 'en'): Promise<Passage[]> {
  const preferredEdition = TRANSLATION_EDITION_BY_LANG[uiLang] ?? FALLBACK_EDITION;

  let data;
  try {
    data = await fetchSurahWithEdition(surahNumber, preferredEdition);
  } catch {
    // The requested language's edition failed (wrong ID, or the API
    // doesn't have it) — fall back to English rather than error out.
    data = await fetchSurahWithEdition(surahNumber, FALLBACK_EDITION);
  }

  const [arabic, translation] = data;
  const ayahs = arabic.ayahs.map((ayah: any, i: number) => ({
    scripture: 'quran' as const,
    bookName: arabic.englishName,
    bookNumber: surahNumber,
    chapter: surahNumber,
    verseStart: ayah.numberInSurah,
    text: translation.ayahs[i]?.text ?? '',
    originalText: ayah.text,
    translation: translation.edition?.englishName ?? translation.edition?.identifier ?? 'Translation',
    source: 'Al Quran Cloud (alquran.cloud)',
    license: 'Public API — see alquran.cloud for edition-level copyright notices',
    reference: `Surah ${arabic.englishName} ${surahNumber}:${ayah.numberInSurah}`,
    audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`,
  }));

  if (hasSeparateBismillah(surahNumber) && ayahs.length && ayahs[0].originalText) {
    ayahs[0] = { ...ayahs[0], originalText: stripBismillahPrefix(ayahs[0].originalText) };
  }

  return ayahs;
}

async function searchOneTerm(term: string, translationEdition: string): Promise<Passage[]> {
  const res = await fetch(`${BASE}/search/${encodeURIComponent(term)}/all/${translationEdition}`);
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

// Searches api.alquran.cloud's full-text index, which matches against the
// TRANSLATION's actual wording — not the transliterated Arabic name. Most
// English editions (including the default, Sahih International) render
// موسى as "Moses", not "Musa"; a search for "Musa" alone silently returns
// nothing even though the Quran obviously discusses him. To fix that, this
// tries every candidate spelling given (e.g. both "Musa" and "Moses") and
// returns the first one that actually finds matches, so the search engine
// isn't blind to whichever naming convention a given edition happens to use.
export async function searchQuran(candidates: string[], translationEdition: string = 'en.sahih'): Promise<Passage[]> {
  for (const term of candidates) {
    if (!term.trim()) continue;
    const results = await searchOneTerm(term, translationEdition);
    if (results.length > 0) return results;
  }
  return [];
}
