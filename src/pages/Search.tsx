import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { searchAllScriptures } from '../services/searchService';
import type { SearchResultGroup } from '../types/scripture';
import { VerseCard } from '../components/reader/VerseCard';
import { FadeIn } from '../components/animated/FadeIn';
import { Loader2, SearchIcon } from 'lucide-react';

const SCRIPTURE_LABEL: Record<string, string> = { quran: 'nav.quran', bible: 'nav.bible', torah: 'nav.torah' };
const SCRIPTURE_COLOR: Record<string, string> = { quran: 'var(--maar-quran)', bible: 'var(--maar-bible)', torah: 'var(--maar-torah)' };

export default function Search() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [groups, setGroups] = useState<SearchResultGroup[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function runSearch(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setGroups(null);
    const res = await searchAllScriptures(q.trim());
    setGroups(res);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t('nav.search')}</h1>
      <form
        onSubmit={(e) => { e.preventDefault(); runSearch(query); }}
        className="flex gap-2"
      >
        <div className="maar-card flex flex-1 items-center gap-2 px-3">
          <SearchIcon size={16} className="text-[var(--maar-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder') ?? ''}
            className="maar-focus flex-1 bg-transparent py-2.5 text-sm outline-none"
          />
        </div>
        <button type="submit" className="maar-focus rounded-full px-4 py-2.5 text-sm text-white" style={{ background: 'var(--maar-ink)' }}>
          {t('search.button')}
        </button>
      </form>

      {loading && <p className="flex items-center gap-2 text-sm text-[var(--maar-muted)]"><Loader2 className="animate-spin" size={16} /> {t('search.loading')}</p>}

      {groups && (
        <div className="grid gap-5 lg:grid-cols-3">
          {groups.map((g, i) => (
            <FadeIn key={g.scripture} delay={i * 0.06} className="space-y-3">
              <h2 className="font-semibold text-sm uppercase tracking-wide" style={{ color: SCRIPTURE_COLOR[g.scripture] }}>
                {t(SCRIPTURE_LABEL[g.scripture])}
              </h2>
              {g.error && <p className="text-sm text-red-600">{t('search.error')}</p>}
              {!g.error && g.notFound && <p className="text-sm text-[var(--maar-muted)]">{t('search.notFound')}</p>}
              {g.passages.map((p) => <VerseCard key={p.reference} passage={p} />)}
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
