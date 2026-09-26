// Ported 1:1 from MAAR.Quran's Bismillah handling. Every surah opens with
// the Bismillah except Al-Fatihah (1, where it IS ayah 1) and At-Tawbah (9,
// which has none). Al Quran Cloud's Uthmani text embeds it inside ayah 1's
// own string, so it has to be detected and separated out, or it shows up
// twice — once as its own header, once duplicated inside the first verse.
export const BISMILLAH_AR = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
export const BISMILLAH_EN = 'In the name of Allah, the Most Gracious, the Most Merciful';

// Diacritic- and alef-variant-tolerant matcher: Uthmani text can use
// ٱ/ا/أ/إ interchangeably and stacks harakat (diacritics) directly on the
// letters, so a literal string match against one exact Unicode form
// silently fails. This builds a pattern that matches regardless.
function lenientArabicPattern(word: string): string {
  const DIAC = '[\\u064B-\\u065F\\u0670\\u06D6-\\u06ED\\u0640]*';
  return [...word].map((ch) => (ch === 'ا' ? '[اٱأإ]' : ch) + DIAC).join('');
}

const BISMILLAH_STRIP_RE = new RegExp(
  '^' + ['بسم', 'الله', 'الرحمن', 'الرحيم'].map(lenientArabicPattern).join('\\s*') + '\\s*'
);

export function hasSeparateBismillah(surahNumber: number): boolean {
  return surahNumber !== 1 && surahNumber !== 9;
}

export function stripBismillahPrefix(arabicText: string): string {
  const stripped = arabicText.replace(BISMILLAH_STRIP_RE, '').trim();
  return stripped !== arabicText.trim() ? stripped : arabicText;
}
