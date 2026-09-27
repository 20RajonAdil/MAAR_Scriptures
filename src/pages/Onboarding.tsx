import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, Scale, NotebookPen } from 'lucide-react';
import { FadeIn } from '../components/animated/FadeIn';

const slides = [
  { icon: BookOpen, title: 'onboarding.read.title', body: 'onboarding.read.body' },
  { icon: Search, title: 'onboarding.search.title', body: 'onboarding.search.body' },
  { icon: Scale, title: 'onboarding.compare.title', body: 'onboarding.compare.body' },
  { icon: NotebookPen, title: 'onboarding.notes.title', body: 'onboarding.notes.body' },
];

export default function Onboarding() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  function finish() {
    localStorage.setItem('maar-onboarded', '1');
    navigate('/');
  }

  const Slide = slides[step];
  const Icon = Slide.icon;

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <FadeIn key={step} className="max-w-sm space-y-4">
        <Icon size={40} style={{ color: 'var(--maar-gold)' }} className="mx-auto" />
        <h1 className="text-2xl font-semibold">{t(Slide.title)}</h1>
        <p className="text-[var(--maar-muted)]">{t(Slide.body)}</p>
      </FadeIn>

      <div className="mt-8 flex gap-1.5">
        {slides.map((_, i) => (
          <span key={i} className="h-1.5 rounded-full transition-all" style={{ width: i === step ? 20 : 8, background: i === step ? 'var(--maar-gold)' : 'var(--maar-line)' }} />
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <button onClick={finish} className="maar-focus text-sm text-[var(--maar-muted)]">{t('onboarding.skip')}</button>
        <button
          onClick={() => (step < slides.length - 1 ? setStep((s) => s + 1) : finish())}
          className="maar-focus maar-btn-primary rounded-full px-5 py-2 text-sm font-medium"
        >
          {step < slides.length - 1 ? t('onboarding.next') : t('onboarding.start')}
        </button>
      </div>
    </div>
  );
}
