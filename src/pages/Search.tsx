import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { searchAllScriptures } from '../services/searchService';
import { findTermMatch, suggestTerms } from '../services/terminology';
import type { SearchResultGroup } from '../types/scripture';
import { VerseCard } from '../components/reader/VerseCard';
import { FadeIn } from '../components/animated/FadeIn';
import { Loader2, SearchIcon } from 'lucide-react';

const SCRIPTURE_LABEL: Record<string, string> = { quran: 'nav.quran', bible: 'nav.bible', torah: 'nav.torah' };
const SCRIPTURE_COLOR: Record<string, string> = { quran: 'var(--maar-quran)', bible: 'var(--maar-bible)', torah: 'var(--maar-torah)' };

export default function Search() {
  const { t } = useTranslation();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [groups, setGroups] = useState<SearchResultGroup[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  async function runSearch(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setGroups(null);
    setShowSuggestions(false);
    const res = await searchAllScriptures(q.trim());
    setGroups(res);
    setLoading(false);
  }

  useEffect(() => {
    const topic = (location.state as { topic?: string } | null)?.topic;
    if (topic) {
      setQuery(topic);
      runSearch(topic);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const suggestions = suggestTerms(query);
  const activeMatch = groups ? findTermMatch(groups[0]?.query ?? '') : undefined;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="font-display text-3xl">{t('nav.search')}</h1>
      <form onSubmit={(e) => { e.preventDefault(); runSearch(query); }} className="relative flex gap-2">
        <div className="maar-surface flex flex-1 items-center gap-2 px-3">
          <SearchIcon size={16} className="text-[var(--maar-muted)]" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
            placeholder={t('search.placeholder') ?? ''}
            className="maar-focus flex-1 bg-transparent py-2.5 text-sm outline-none"
          />
        </div>
        <button type="submit" className="maar-focus maar-btn-primary rounded-full px-4 py-2.5 text-sm font-medium">
          {t('search.button')}
        </button>

        {showSuggestions && suggestions.length > 0 && (
          <div className="maar-surface absolute top-full mt-1 left-0 right-16 z-10 overflow-hidden" style={{ boxShadow: 'var(--maar-shadow)' }}>
            {suggestions.map((s) => (
              <button
                key={s.id}
                type="button"
                onMouseDown={() => { setQuery(s.label.split(' / ')[0]); runSearch(s.label.split(' / ')[0]); }}
                className="w-full text-start px-3 py-2 text-sm hover:bg-[var(--maar-line-soft)] border-t first:border-t-0"
                style={{ borderColor: 'var(--maar-line-soft)' }}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </form>

      {loading && <p className="flex items-center gap-2 text-sm text-[var(--maar-muted)]"><Loader2 className="animate-spin" size={16} /> {t('search.loading')}</p>}

      {groups && activeMatch && (
        <p className="text-xs text-[var(--maar-muted)]">
          {t('search.alsoKnownAs')}: <span className="font-medium text-[var(--maar-ink)]">{activeMatch.label}</span>
        </p>
      )}

      {groups && (
        <div className="grid gap-8 lg:grid-cols-3">
          {groups.map((g, i) => (
            <FadeIn key={g.scripture} delay={i * 0.06}>
              <h2 className="font-semibold text-sm" style={{ color: SCRIPTURE_COLOR[g.scripture] }}>
                {t(SCRIPTURE_LABEL[g.scripture])}
              </h2>
              {g.error && <p className="text-sm text-red-600 mt-2">{t('search.error')}</p>}
              {!g.error && g.notFound && <p className="text-sm text-[var(--maar-muted)] mt-2">{t('search.notFound')}</p>}
              <div>{g.passages.map((p) => <VerseCard key={p.reference} passage={p} />)}</div>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
