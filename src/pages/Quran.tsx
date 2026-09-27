import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchSurahList, fetchSurah } from '../services/quranService';
import type { Surah, Passage } from '../types/scripture';
import { VerseCard } from '../components/reader/VerseCard';
import { BismillahBlock } from '../components/reader/BismillahBlock';
import { hasSeparateBismillah } from '../lib/bismillah';
import { Loader2, ChevronLeft } from 'lucide-react';

export default function Quran() {
  const { t, i18n } = useTranslation();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [active, setActive] = useState<Surah | null>(null);
  const [verses, setVerses] = useState<Passage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSurahList().then(setSurahs).catch(() => setError(t('error.generic'))).finally(() => setLoading(false));
  }, [t]);

  // Re-fetch the open Surah's translation when the interface language
  // changes, so switching to Bangla/Urdu updates the verse text too, not
  // just the surrounding UI chrome.
  useEffect(() => {
    if (!active) return;
    setLoading(true);
    fetchSurah(active.number, i18n.language)
      .then(setVerses)
      .catch(() => setError(t('error.generic')))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  async function openSurah(s: Surah) {
    setActive(s);
    setLoading(true);
    setError(null);
    try {
      setVerses(await fetchSurah(s.number, i18n.language));
    } catch {
      setError(t('error.generic'));
    } finally {
      setLoading(false);
    }
  }

  if (active) {
    return (
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setActive(null)} className="maar-focus flex items-center gap-1 text-sm text-[var(--maar-muted)] mb-4">
          <ChevronLeft size={16} /> {t('nav.quran')}
        </button>
        <h2 className="font-display text-3xl">{active.englishName}</h2>
        <p className="text-[var(--maar-muted)] mt-1">{active.englishNameTranslation}</p>

        {loading && <p className="flex items-center gap-2 text-sm text-[var(--maar-muted)] mt-6"><Loader2 className="animate-spin" size={16} /> {t('search.loading')}</p>}
        {error && <p className="text-sm text-red-600 mt-6">{error}</p>}

        {!loading && !error && hasSeparateBismillah(active.number) && <BismillahBlock />}

        <div>{verses.map((v) => <VerseCard key={v.reference} passage={v} />)}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="font-display text-3xl">{t('nav.quran')}</h1>
      {loading && <p className="flex items-center gap-2 text-sm text-[var(--maar-muted)]"><Loader2 className="animate-spin" size={16} /> {t('search.loading')}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div>
        {surahs.map((s) => (
          <button
            key={s.number}
            onClick={() => openSurah(s)}
            className="maar-focus w-full text-start py-3.5 border-t first:border-t-0 flex items-center gap-4 hover:bg-[var(--maar-line-soft)] transition-colors -mx-2 px-2 rounded-[var(--maar-radius-sm)]"
            style={{ borderColor: 'var(--maar-line-soft)' }}
          >
            <span className="w-6 shrink-0 text-right text-xs text-[var(--maar-muted)] tabular-nums">{s.number}</span>
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{s.englishName}</p>
              <p className="text-xs text-[var(--maar-muted)] truncate">{s.englishNameTranslation}, {s.numberOfAyahs} ayahs</p>
            </div>
            <span dir="rtl" className="font-scripture-ar text-lg shrink-0" style={{ color: 'var(--maar-quran)' }}>{s.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
