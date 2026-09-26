import type { Passage, SearchResultGroup } from '../types/scripture';
import { searchQuran } from './quranService';
import { fetchChapter as fetchBibleChapter, searchBible } from './bibleService';
import { fetchChapter as fetchTorahChapter, searchTorah } from './torahService';
import { BIBLE_TOPIC_REFS, TORAH_TOPIC_REFS } from './topicMap';

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
  const [quran, bible, torah] = await Promise.allSettled([
    searchQuran(query),
    bibleTopicSearch(query),
    torahTopicSearch(query),
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
