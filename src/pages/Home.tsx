import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FadeIn } from '../components/animated/FadeIn';
import { SpotlightCard } from '../components/animated/SpotlightCard';
import { AnimatedGradientText } from '../components/animated/AnimatedGradientText';
import { BookOpen, Search, Scale, NotebookPen } from 'lucide-react';

const scriptures = [
  { to: '/quran', key: 'nav.quran', color: 'var(--maar-quran)', accent: '31,111,92' },
  { to: '/bible', key: 'nav.bible', color: 'var(--maar-bible)', accent: '107,79,160' },
  { to: '/torah', key: 'nav.torah', color: 'var(--maar-torah)', accent: '42,92,168' },
];

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="space-y-14">
      <FadeIn className="text-center max-w-2xl mx-auto pt-6">
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">
          <AnimatedGradientText>{t('app.tagline')}</AnimatedGradientText>
        </h1>
        <p className="mt-4 text-[var(--maar-muted)] text-base sm:text-lg">{t('home.intro')}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/quran" className="maar-focus rounded-full px-5 py-2.5 text-sm font-medium text-white" style={{ background: 'var(--maar-ink)' }}>
            {t('home.cta.read')}
          </Link>
          <Link to="/search" className="maar-focus rounded-full px-5 py-2.5 text-sm font-medium maar-card">
            {t('home.cta.search')}
          </Link>
        </div>
      </FadeIn>

      <div className="grid gap-4 sm:grid-cols-3">
        {scriptures.map((s, i) => (
          <FadeIn key={s.to} delay={i * 0.08}>
            <Link to={s.to}>
              <SpotlightCard accent={s.accent} className="h-full">
                <BookOpen style={{ color: s.color }} className="mb-3" />
                <h3 className="font-semibold text-lg">{t(s.key)}</h3>
              </SpotlightCard>
            </Link>
          </FadeIn>
        ))}
      </div>

      <FadeIn>
        <div className="grid gap-4 sm:grid-cols-4 text-center">
          {[
            { icon: BookOpen, key: 'home.pillar.read' },
            { icon: Search, key: 'home.pillar.search' },
            { icon: Scale, key: 'home.pillar.compare' },
            { icon: NotebookPen, key: 'home.pillar.notes' },
          ].map(({ icon: Icon, key }) => (
            <div key={key} className="maar-card p-5">
              <Icon className="mx-auto mb-2" style={{ color: 'var(--maar-gold)' }} />
              <p className="text-sm font-medium">{t(key)}</p>
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn className="maar-card p-5 text-center text-sm text-[var(--maar-muted)] max-w-2xl mx-auto">
        {t('home.disclaimer')}
      </FadeIn>
    </div>
  );
}
