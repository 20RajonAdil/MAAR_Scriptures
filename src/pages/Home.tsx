import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FadeIn } from '../components/animated/FadeIn';
import { SpotlightCard } from '../components/animated/SpotlightCard';
import { BookOpen, Search, Scale, NotebookPen } from 'lucide-react';

const scriptures = [
  { to: '/quran', key: 'nav.quran', color: 'var(--maar-quran)', accent: '31,111,92' },
  { to: '/bible', key: 'nav.bible', color: 'var(--maar-bible)', accent: '140,74,58' },
  { to: '/torah', key: 'nav.torah', color: 'var(--maar-torah)', accent: '42,92,168' },
];

const pillars = [
  { icon: BookOpen, key: 'home.pillar.read' },
  { icon: Search, key: 'home.pillar.search' },
  { icon: Scale, key: 'home.pillar.compare' },
  { icon: NotebookPen, key: 'home.pillar.notes' },
];

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="space-y-16">
      <FadeIn className="text-center max-w-xl mx-auto pt-8">
        <p className="font-scripture-ar maar-gold-shimmer text-lg mb-3">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
        <h1 className="font-display text-4xl sm:text-5xl leading-tight">{t('app.tagline')}</h1>
        <p className="mt-4 text-[var(--maar-muted)] text-base sm:text-lg leading-relaxed">{t('home.intro')}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/quran" className="maar-focus maar-btn-primary rounded-full px-5 py-2.5 text-sm font-medium">
            {t('home.cta.read')}
          </Link>
          <Link to="/search" className="maar-focus rounded-full px-5 py-2.5 text-sm font-medium border" style={{ borderColor: 'var(--maar-line)' }}>
            {t('home.cta.search')}
          </Link>
        </div>
      </FadeIn>

      <div className="grid gap-3 sm:grid-cols-3">
        {scriptures.map((s, i) => (
          <FadeIn key={s.to} delay={i * 0.08}>
            <Link to={s.to}>
              <SpotlightCard accent={s.accent} className="h-full">
                <BookOpen style={{ color: s.color }} className="mb-3" size={22} />
                <h3 className="font-display text-xl">{t(s.key)}</h3>
              </SpotlightCard>
            </Link>
          </FadeIn>
        ))}
      </div>

      <FadeIn>
        <div className="flex flex-col sm:flex-row rounded-[var(--maar-radius)] border overflow-hidden" style={{ borderColor: 'var(--maar-line)' }}>
          {pillars.map(({ icon: Icon, key }) => (
            <div
              key={key}
              className="flex-1 flex items-center gap-3 px-5 py-4 border-t sm:border-t-0 sm:border-s first:border-t-0 first:sm:border-s-0"
              style={{ borderColor: 'var(--maar-line)' }}
            >
              <Icon size={18} style={{ color: 'var(--maar-gold)' }} className="shrink-0" />
              <span className="text-sm font-medium">{t(key)}</span>
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn className="max-w-xl mx-auto text-center">
        <p className="text-sm text-[var(--maar-muted)] leading-relaxed border-t pt-5" style={{ borderColor: 'var(--maar-line)' }}>
          {t('home.disclaimer')}
        </p>
      </FadeIn>
    </div>
  );
}
