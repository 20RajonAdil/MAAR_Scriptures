export type ScriptureId = 'quran' | 'bible' | 'torah';

export interface ScriptureMeta {
  id: ScriptureId;
  color: string;
}

export interface Passage {
  scripture: ScriptureId;
  bookName: string;   // Surah name / Book name
  bookNumber?: number;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  text: string;
  originalText?: string; // Arabic / Hebrew where available
  translation: string;   // translation/edition name
  source: string;        // API / publisher name
  license?: string;
  reference: string;     // human readable e.g. "Surah Al-Baqarah 2:255"
  audioUrl?: string;
}

export interface SearchResultGroup {
  scripture: ScriptureId;
  query: string;
  passages: Passage[];
  notFound: boolean;
  error?: string;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Note {
  id: string;
  scripture: ScriptureId;
  reference: string;
  text: string;
  originalText?: string;
  noteBody: string;
  createdAt: number;
  updatedAt: number;
}

export interface Bookmark {
  id: string;
  scripture: ScriptureId;
  reference: string;
  text: string;
  originalText?: string;
  createdAt: number;
}
