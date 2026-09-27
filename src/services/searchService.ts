import type { Passage, SearchResultGroup } from '../types/scripture';
import { searchQuran } from './quranService';
import { fetchChapter as fetchBibleChapter, searchBible } from './bibleService';
import { fetchChapter as fetchTorahChapter, searchTorah } from './torahService';
import { BIBLE_TOPIC_REFS, TORAH_TOPIC_REFS } from './topicMap';
import { findTermMatch } from './terminology';

async function bibleTopicSearch(query: string): Promise<Passage[]> {
  const key = query.trim().toLowerCase();
  const refs = BIBLE_TOPIC_REFS[key];
  if (refs) {
    const results = await Promise.all(refs.map((r) => searchBible(r)));
    return results.flat();
  }
  return searchBible(query);
}

async function torahTopicSearch(query: string): Promise<Passage[]> {
  const key = query.trim().toLowerCase();
  const refs = TORAH_TOPIC_REFS[key];
  if (refs) {
    const results = await Promise.all(
      refs.map(async (r) => {
        const [book, chap] = r.split(' ');
        const chapterNum = parseInt(chap.split('.')[0], 10);
        const verses = await fetchTorahChapter(book, chapterNum);
        const verseNum = parseInt(chap.split('.')[1], 10);
        return verses.filter((v) => v.verseStart === verseNum);
      })
    );
    return results.flat();
  }
  return searchTorah(query);
}

export async function searchAllScriptures(query: string): Promise<SearchResultGroup[]> {
  // If the query matches a known cross-tradition name or term (e.g. "God"
  // matches "Allah", "Jesus" matches "Isa"), search each scripture using
  // the term(s) it actually uses, instead of only the literal typed word.
  const match = findTermMatch(query);
  const bibleQuery = match?.bibleQuery ?? query;
  const torahQuery = match?.torahQuery ?? query;

  // Quran full-text search matches the TRANSLATION's wording, which for
  // most English editions (Sahih International included) uses the common
  // English name — "Moses", not "Musa" — even though the transliteration
  // is what Muslims commonly call him. Try every plausible spelling in
  // turn (the entry's own quranQuery, all its known names, then the raw
  // query) so the search isn't blind to whichever one the edition uses.
  const quranCandidates = Array.from(
    new Set([match?.quranQuery, ...(match?.names ?? []), query].filter((v): v is string => !!v && v.trim().length > 0))
  );

  const [quran, bible, torah] = await Promise.allSettled([
    searchQuran(quranCandidates),
    bibleTopicSearch(bibleQuery),
    torahTopicSearch(torahQuery),
  ]);

  const toGroup = (
    scripture: SearchResultGroup['scripture'],
    result: PromiseSettledResult<Passage[]>
  ): SearchResultGroup => {
    if (result.status === 'fulfilled') {
      return { scripture, query, passages: result.value, notFound: result.value.length === 0 };
    }
    return { scripture, query, passages: [], notFound: true, error: 'We could not reach this source right now.' };
  };

  return [toGroup('quran', quran), toGroup('bible', bible), toGroup('torah', torah)];
}

export { fetchBibleChapter, fetchTorahChapter };
