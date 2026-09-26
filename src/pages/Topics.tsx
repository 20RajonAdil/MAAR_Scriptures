import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TERMS } from '../services/terminology';
import { FadeIn } from '../components/animated/FadeIn';

const SUBJECTS = [
  'Food', 'Pork', 'Beef', 'Alcohol', 'Marriage', 'Family', 'Prayer', 'Fasting', 'Charity',
  'Creation', 'Forgiveness', 'Afterlife', 'Justice',
];

export default function Topics() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  function go(topic: string) {
    navigate('/compare', { state: { topic } });
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-3xl">{t('nav.topics')}</h1>
        <p className="text-sm text-[var(--maar-muted)] mt-1">{t('search.placeholder')}</p>
      </div>

      <div>
        <h2 className="text-xs font-medium text-[var(--maar-muted)] mb-2">{t('nav.topics')}</h2>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((topic, i) => (
            <FadeIn key={topic} delay={Math.min(i * 0.015, 0.25)}>
              <button
                onClick={() => go(topic)}
                className="maar-surface maar-focus rounded-full px-4 py-2 text-sm hover:-translate-y-0.5 transition-transform"
              >
                {topic}
              </button>
            </FadeIn>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xs font-medium text-[var(--maar-muted)] mb-2">{t('search.alsoKnownAs')}</h2>
        <div className="flex flex-wrap gap-2">
          {TERMS.map((term, i) => (
            <FadeIn key={term.id} delay={Math.min(i * 0.015, 0.25)}>
              <button
                onClick={() => go(term.label.split(' / ')[0])}
                className="maar-surface maar-focus rounded-full px-4 py-2 text-sm hover:-translate-y-0.5 transition-transform"
              >
                {term.label}
              </button>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
