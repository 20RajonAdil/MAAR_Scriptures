import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { searchAllScriptures } from '../services/searchService';
import { findTermMatch, suggestTerms } from '../services/terminology';
import type { SearchResultGroup } from '../types/scripture';
import { FadeIn } from '../components/animated/FadeIn';
import { Loader2, SearchIcon, Sparkles } from 'lucide-react';

const SCRIPTURE_LABEL: Record<string, string> = { quran: 'nav.quran', bible: 'nav.bible', torah: 'nav.torah' };
const SCRIPTURE_COLOR: Record<string, string> = { quran: 'var(--maar-quran)', bible: 'var(--maar-bible)', torah: 'var(--maar-torah)' };

export default function Compare() {
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
    setGroups(await searchAllScriptures(q.trim()));
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
  const anyFound = groups?.some((g) => g.passages.length > 0);
  const activeMatch = groups ? findTermMatch(groups[0]?.query ?? '') : undefined;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl">{t('compare.title')}</h1>
        <p className="text-sm text-[var(--maar-muted)] mt-1">{t('home.disclaimer')}</p>
      </div>

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
        <>
          <div className="grid gap-6 lg:grid-cols-3">
            {groups.map((g, i) => (
              <FadeIn key={g.scripture} delay={i * 0.06}>
                <div className="border-t-2 pt-3" style={{ borderColor: SCRIPTURE_COLOR[g.scripture] }}>
                  <h2 className="font-semibold text-sm" style={{ color: SCRIPTURE_COLOR[g.scripture] }}>
                    {t(SCRIPTURE_LABEL[g.scripture])}
                  </h2>
                  <p className="text-[11px] text-[var(--maar-muted)] mt-0.5">{t('compare.whatSourceSays')}</p>
                  {g.error && <p className="text-sm text-red-600 mt-2">{t('search.error')}</p>}
                  {!g.error && g.notFound && <p className="text-sm text-[var(--maar-muted)] mt-2">{t('search.notFound')}</p>}
                  <div className="mt-2 space-y-4">
                    {g.passages.map((p) => (
                      <div key={p.reference} className="text-sm border-t pt-3 first:border-t-0 first:pt-0" style={{ borderColor: 'var(--maar-line-soft)' }}>
                        <p className="text-xs font-medium mb-1" style={{ color: SCRIPTURE_COLOR[g.scripture] }}>{p.reference}</p>
                        <p className="leading-relaxed">{p.text}</p>
                        <p className="text-[11px] text-[var(--maar-muted)] mt-1">{p.source}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {anyFound && (
            <FadeIn>
              <div className="border-t pt-5" style={{ borderColor: 'var(--maar-line)' }}>
                <h2 className="flex items-center gap-2 font-display text-lg">
                  <Sparkles size={16} style={{ color: 'var(--maar-gold)' }} /> {t('compare.aiSummary')}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 text-sm mt-3">
                  <div>
                    <p className="font-medium mb-1">{t('compare.similarities')}</p>
                    <p className="text-[var(--maar-muted)]">{t('compare.aiSummaryDisabled')}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">{t('compare.differences')}</p>
                    <p className="text-[var(--maar-muted)]">{t('compare.aiSummaryDisabled')}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}
        </>
      )}
    </div>
  );
}
