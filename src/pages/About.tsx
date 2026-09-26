import { useTranslation } from 'react-i18next';
import { FadeIn } from '../components/animated/FadeIn';

export default function About() {
  const { t } = useTranslation();
  return (
    <FadeIn className="max-w-2xl mx-auto space-y-4 text-center py-8">
      <h1 className="text-3xl font-semibold">{t('about.title')}</h1>
      <p className="text-[var(--maar-muted)] leading-relaxed">{t('about.body')}</p>
    </FadeIn>
  );
}
