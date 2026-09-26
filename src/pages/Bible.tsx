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
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setBook(null)} className="maar-focus flex items-center gap-1 text-sm text-[var(--maar-muted)] mb-4">
          <ChevronLeft size={16} /> {t('nav.bible')}
        </button>
        <div className="flex items-center gap-3">
          <h2 className="font-display text-3xl">{book} {chapter}</h2>
          <div className="flex gap-1 ms-auto">
            <button disabled={chapter <= 1} onClick={() => setChapter((c) => c - 1)} className="maar-focus maar-surface px-2.5 py-1 text-sm disabled:opacity-40">‹</button>
            <button onClick={() => setChapter((c) => c + 1)} className="maar-focus maar-surface px-2.5 py-1 text-sm">›</button>
          </div>
        </div>
        {loading && <p className="flex items-center gap-2 text-sm text-[var(--maar-muted)] mt-6"><Loader2 className="animate-spin" size={16} /> {t('search.loading')}</p>}
        {error && <p className="text-sm text-red-600 mt-6">{error}</p>}
        <div>{verses.map((v) => <VerseCard key={v.reference} passage={v} />)}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="font-display text-3xl">{t('nav.bible')}</h1>
      <div>
        {BIBLE_BOOKS.map((b, i) => (
          <button
            key={b}
            onClick={() => { setBook(b); setChapter(1); }}
            className="maar-focus w-full text-start py-3 border-t first:border-t-0 flex items-center gap-4 hover:bg-[var(--maar-line-soft)] transition-colors -mx-2 px-2 rounded-[var(--maar-radius-sm)]"
            style={{ borderColor: 'var(--maar-line-soft)' }}
          >
            <span className="w-6 shrink-0 text-right text-xs text-[var(--maar-muted)] tabular-nums">{i + 1}</span>
            <span className="font-medium" style={{ color: 'var(--maar-bible)' }}>{b}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
