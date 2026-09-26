import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchSurahList, fetchSurah } from '../services/quranService';
import type { Surah, Passage } from '../types/scripture';
import { VerseCard } from '../components/reader/VerseCard';
import { FadeIn } from '../components/animated/FadeIn';
import { Loader2, ChevronLeft } from 'lucide-react';

export default function Quran() {
  const { t } = useTranslation();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [active, setActive] = useState<Surah | null>(null);
  const [verses, setVerses] = useState<Passage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSurahList().then(setSurahs).catch(() => setError(t('error.generic'))).finally(() => setLoading(false));
  }, [t]);

  async function openSurah(s: Surah) {
    setActive(s);
    setLoading(true);
    setError(null);
    try {
      setVerses(await fetchSurah(s.number));
    } catch {
      setError(t('error.generic'));
    } finally {
      setLoading(false);
    }
  }

  if (active) {
    return (
      <div className="space-y-4">
        <button onClick={() => setActive(null)} className="maar-focus flex items-center gap-1 text-sm text-[var(--maar-muted)]">
          <ChevronLeft size={16} /> {t('nav.quran')}
        </button>
        <h2 className="text-2xl font-semibold">{active.englishName} <span className="text-[var(--maar-muted)] font-normal">— {active.englishNameTranslation}</span></h2>
        {loading && <p className="flex items-center gap-2 text-sm text-[var(--maar-muted)]"><Loader2 className="animate-spin" size={16} /> {t('search.loading')}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="space-y-3">
          {verses.map((v) => <VerseCard key={v.reference} passage={v} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t('nav.quran')}</h1>
      {loading && <p className="flex items-center gap-2 text-sm text-[var(--maar-muted)]"><Loader2 className="animate-spin" size={16} /> {t('search.loading')}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {surahs.map((s, i) => (
          <FadeIn key={s.number} delay={Math.min(i * 0.02, 0.4)}>
            <button onClick={() => openSurah(s)} className="maar-card maar-focus w-full text-start p-3 hover:-translate-y-0.5 transition-transform">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-medium"
                  style={{ background: 'color-mix(in srgb, var(--maar-quran) 12%, transparent)', color: 'var(--maar-quran)' }}
                >
                  {s.number}
                </span>
                <div className="min-w-0">
                  <p className="font-medium truncate">{s.englishName}</p>
                  <p className="text-xs text-[var(--maar-muted)] truncate">{s.englishNameTranslation} · {s.numberOfAyahs} ayahs</p>
                </div>
              </div>
            </button>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
