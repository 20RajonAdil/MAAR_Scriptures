// Cross-tradition name glossary. Many figures and terms are known by
// different names across the Qur'an, Bible, and Torah — this lets a search
// for any one of them find results from all three, and shows the reader
// that the names refer to the same figure or concept. This is presented as
// a neutral cross-reference only: it does not claim which name came first,
// which tradition is the source of a name, or that the traditions describe
// these figures identically — only that a search for one name should also
// surface how the others refer to the same subject.
export type TermCategory = 'deity' | 'prophet' | 'figure' | 'term';

export interface TermEntry {
  id: string;
  label: string; // shown in the UI, e.g. "Jesus / Isa"
  names: string[]; // lowercase match list, also used as Quran search candidates
  quranQuery?: string; // tried first for Quran search, before falling back to `names`
  bibleQuery?: string;
  torahQuery?: string;
  category: TermCategory;
}

export const TERMS: TermEntry[] = [
  { id: 'god', label: 'God / Allah', names: ['god', 'allah', 'yahweh', 'hashem', 'elohim', 'lord'], quranQuery: 'Allah', bibleQuery: 'God', torahQuery: 'God', category: 'deity' },
  { id: 'muhammad', label: 'Muhammad', names: ['muhammad', 'mohammed', 'mohammad'], quranQuery: 'Muhammad', category: 'prophet' },
  { id: 'jesus', label: 'Jesus / Isa', names: ['jesus', 'isa', 'christ', 'messiah'], quranQuery: 'Isa', bibleQuery: 'Jesus', category: 'prophet' },
  { id: 'moses', label: 'Moses / Musa', names: ['moses', 'musa', 'moshe'], quranQuery: 'Musa', bibleQuery: 'Moses', torahQuery: 'Moses', category: 'prophet' },
  { id: 'abraham', label: 'Abraham / Ibrahim', names: ['abraham', 'ibrahim', 'avraham'], quranQuery: 'Ibrahim', bibleQuery: 'Abraham', torahQuery: 'Abraham', category: 'prophet' },
  { id: 'noah', label: 'Noah / Nuh', names: ['noah', 'nuh', 'noach'], quranQuery: 'Nuh', bibleQuery: 'Noah', torahQuery: 'Noah', category: 'prophet' },
  { id: 'adam', label: 'Adam', names: ['adam'], quranQuery: 'Adam', bibleQuery: 'Adam', torahQuery: 'Adam', category: 'figure' },
  { id: 'mary', label: 'Mary / Maryam', names: ['mary', 'maryam', 'miriam'], quranQuery: 'Maryam', bibleQuery: 'Mary', category: 'figure' },
  { id: 'joseph', label: 'Joseph / Yusuf', names: ['joseph', 'yusuf'], quranQuery: 'Yusuf', bibleQuery: 'Joseph', torahQuery: 'Joseph', category: 'prophet' },
  { id: 'jacob', label: 'Jacob / Yaqub', names: ['jacob', 'yaqub', 'israel'], quranQuery: 'Yaqub', bibleQuery: 'Jacob', torahQuery: 'Jacob', category: 'prophet' },
  { id: 'isaac', label: 'Isaac / Ishaq', names: ['isaac', 'ishaq'], quranQuery: 'Ishaq', bibleQuery: 'Isaac', torahQuery: 'Isaac', category: 'prophet' },
  { id: 'ishmael', label: 'Ishmael / Ismail', names: ['ishmael', 'ismail'], quranQuery: 'Ismail', bibleQuery: 'Ishmael', category: 'figure' },
  { id: 'david', label: 'David / Dawud', names: ['david', 'dawud', 'dawood'], quranQuery: 'Dawud', bibleQuery: 'David', torahQuery: 'David', category: 'prophet' },
  { id: 'solomon', label: 'Solomon / Sulaiman', names: ['solomon', 'sulaiman', 'sulayman'], quranQuery: 'Sulaiman', bibleQuery: 'Solomon', torahQuery: 'Solomon', category: 'prophet' },
  { id: 'jonah', label: 'Jonah / Yunus', names: ['jonah', 'yunus'], quranQuery: 'Yunus', bibleQuery: 'Jonah', torahQuery: 'Jonah', category: 'prophet' },
  { id: 'elijah', label: 'Elijah / Ilyas', names: ['elijah', 'ilyas'], quranQuery: 'Ilyas', bibleQuery: 'Elijah', torahQuery: 'Elijah', category: 'prophet' },
  { id: 'john', label: 'John / Yahya', names: ['john', 'yahya'], quranQuery: 'Yahya', bibleQuery: 'John', category: 'prophet' },
  { id: 'aaron', label: 'Aaron / Harun', names: ['aaron', 'harun'], quranQuery: 'Harun', bibleQuery: 'Aaron', torahQuery: 'Aaron', category: 'prophet' },
  { id: 'zechariah', label: 'Zechariah / Zakariya', names: ['zechariah', 'zakariya', 'zachariah'], quranQuery: 'Zakariya', bibleQuery: 'Zechariah', category: 'prophet' },
  { id: 'job', label: 'Job / Ayyub', names: ['job', 'ayyub'], quranQuery: 'Ayyub', bibleQuery: 'Job', torahQuery: 'Job', category: 'prophet' },
  { id: 'lot', label: 'Lot / Lut', names: ['lot', 'lut'], quranQuery: 'Lut', bibleQuery: 'Lot', torahQuery: 'Lot', category: 'prophet' },
  { id: 'gabriel', label: 'Gabriel / Jibril', names: ['gabriel', 'jibril', 'jibreel'], quranQuery: 'Jibril', bibleQuery: 'Gabriel', category: 'figure' },
  { id: 'halal', label: 'Halal (lawful, allowed)', names: ['halal', 'lawful', 'permissible', 'allowed'], quranQuery: 'lawful', category: 'term' },
  { id: 'haram', label: 'Haram (forbidden)', names: ['haram', 'forbidden', 'unlawful', 'prohibited'], quranQuery: 'forbidden', category: 'term' },
];

export function findTermMatch(query: string): TermEntry | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  return TERMS.find((entry) => entry.names.some((n) => n === q));
}

export function suggestTerms(query: string, limit = 6): TermEntry[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return TERMS.filter((entry) => entry.names.some((n) => n.startsWith(q))).slice(0, limit);
}
