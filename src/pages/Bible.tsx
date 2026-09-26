import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BIBLE_BOOKS, fetchChapter } from '../services/bibleService';
import type { Passage } from '../types/scripture';
import { VerseCard } from '../components/reader/VerseCard';
import { Loader2, ChevronLeft } from 'lucide-react';

export default function Bible() {
  const { t } = useTranslation();
  const [book, setBook] = useState<string | null>(null);
  const [chapter, setChapter] = useState(1);
  const [verses, setVerses] = useState<Passage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!book) return;
    setLoading(true);
    setError(null);
    fetchChapter(book, chapter)
      .then(setVerses)
      .catch(() => setError(t('error.generic')))
      .finally(() => setLoading(false));
  }, [book, chapter, t]);

  if (book) {
    return (
      <div className="space-y-4">
        <button onClick={() => setBook(null)} className="maar-focus flex items-center gap-1 text-sm text-[var(--maar-muted)]">
          <ChevronLeft size={16} /> {t('nav.bible')}
        </button>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold">{book} {chapter}</h2>
          <div className="flex gap-1">
            <button disabled={chapter <= 1} onClick={() => setChapter((c) => c - 1)} className="maar-card maar-focus px-2 py-1 text-sm disabled:opacity-40">‹</button>
            <button onClick={() => setChapter((c) => c + 1)} className="maar-card maar-focus px-2 py-1 text-sm">›</button>
          </div>
        </div>
        {loading && <p className="flex items-center gap-2 text-sm text-[var(--maar-muted)]"><Loader2 className="animate-spin" size={16} /> {t('search.loading')}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="space-y-3">{verses.map((v) => <VerseCard key={v.reference} passage={v} />)}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t('nav.bible')}</h1>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {BIBLE_BOOKS.map((b) => (
          <button
            key={b}
            onClick={() => { setBook(b); setChapter(1); }}
            className="maar-card maar-focus text-start p-3 hover:-translate-y-0.5 transition-transform"
            style={{ borderInlineStartWidth: 3, borderInlineStartColor: 'var(--maar-bible)' }}
          >
            {b}
          </button>
        ))}
      </div>
    </div>
  );
}
