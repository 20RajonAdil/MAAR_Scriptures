import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FadeIn } from '../components/animated/FadeIn';

const TOPICS = [
  'Food', 'Pork', 'Beef', 'Alcohol', 'Marriage', 'Family', 'Prayer', 'Fasting', 'Charity',
  'Creation', 'Adam', 'Moses', 'Jesus', 'Abraham', 'Forgiveness', 'Afterlife', 'Justice',
];

export default function Topics() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">{t('nav.topics')}</h1>
      <p className="text-sm text-[var(--maar-muted)]">{t('search.placeholder')}</p>
      <div className="flex flex-wrap gap-2">
        {TOPICS.map((topic, i) => (
          <FadeIn key={topic} delay={Math.min(i * 0.02, 0.3)}>
            <button
              onClick={() => navigate('/compare', { state: { topic } })}
              className="maar-card maar-focus rounded-full px-4 py-2 text-sm hover:-translate-y-0.5 transition-transform"
            >
              {topic}
            </button>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
