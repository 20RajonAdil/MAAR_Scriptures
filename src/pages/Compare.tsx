import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { searchAllScriptures } from '../services/searchService';
import type { SearchResultGroup } from '../types/scripture';
import { FadeIn } from '../components/animated/FadeIn';
import { Loader2, SearchIcon, Sparkles } from 'lucide-react';

const SCRIPTURE_LABEL: Record<string, string> = { quran: 'nav.quran', bible: 'nav.bible', torah: 'nav.torah' };
const SCRIPTURE_COLOR: Record<string, string> = { quran: 'var(--maar-quran)', bible: 'var(--maar-bible)', torah: 'var(--maar-torah)' };

export default function Compare() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [groups, setGroups] = useState<SearchResultGroup[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function runSearch(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setGroups(null);
    setGroups(await searchAllScriptures(q.trim()));
    setLoading(false);
  }

  const anyFound = groups?.some((g) => g.passages.length > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('compare.title')}</h1>
        <p className="text-sm text-[var(--maar-muted)] mt-1">{t('home.disclaimer')}</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); runSearch(query); }} className="flex gap-2">
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
        <>
          <div className="grid gap-5 lg:grid-cols-3">
            {groups.map((g, i) => (
              <FadeIn key={g.scripture} delay={i * 0.06}>
                <div className="maar-card p-4 space-y-3" style={{ borderTopWidth: 3, borderTopColor: SCRIPTURE_COLOR[g.scripture] }}>
                  <h2 className="font-semibold text-sm uppercase tracking-wide" style={{ color: SCRIPTURE_COLOR[g.scripture] }}>
                    {t(SCRIPTURE_LABEL[g.scripture])}
                  </h2>
                  <p className="text-[11px] uppercase tracking-wide text-[var(--maar-muted)]">{t('compare.whatSourceSays')}</p>
                  {g.error && <p className="text-sm text-red-600">{t('search.error')}</p>}
                  {!g.error && g.notFound && <p className="text-sm text-[var(--maar-muted)]">{t('search.notFound')}</p>}
                  <div className="space-y-2">
                    {g.passages.map((p) => (
                      <div key={p.reference} className="text-sm">
                        <p className="text-xs font-medium" style={{ color: SCRIPTURE_COLOR[g.scripture] }}>{p.reference}</p>
                        <p>{p.text}</p>
                        <p className="text-[11px] text-[var(--maar-muted)]">{p.source}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {anyFound && (
            <FadeIn className="maar-card p-5 space-y-3">
              <h2 className="flex items-center gap-2 font-semibold">
                <Sparkles size={16} style={{ color: 'var(--maar-gold)' }} /> {t('compare.aiSummary')}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <p className="font-medium mb-1">{t('compare.similarities')}</p>
                  <p className="text-[var(--maar-muted)]">{t('compare.aiSummaryDisabled')}</p>
                </div>
                <div>
                  <p className="font-medium mb-1">{t('compare.differences')}</p>
                  <p className="text-[var(--maar-muted)]">{t('compare.aiSummaryDisabled')}</p>
                </div>
              </div>
            </FadeIn>
          )}
        </>
      )}
    </div>
  );
}
