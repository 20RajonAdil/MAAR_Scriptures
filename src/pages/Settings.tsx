import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../i18n';
import { useTheme } from '../hooks/useTheme';
import { localStore } from '../lib/localStore';
import { useState } from 'react';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { mode, setMode } = useTheme();
  const [textSize, setTextSize] = useState(() => Number(localStorage.getItem('maar-text-scale') || 100));
  const [confirming, setConfirming] = useState(false);

  function applyTextSize(v: number) {
    setTextSize(v);
    localStorage.setItem('maar-text-scale', String(v));
    document.documentElement.style.fontSize = `${v}%`;
  }

  async function clearData() {
    localStore.clear(['notes', 'bookmarks']);
    setConfirming(false);
  }

  return (
    <div className="max-w-xl space-y-8">
      <h1 className="text-2xl font-semibold">{t('settings.title')}</h1>

      <section className="maar-surface p-5 space-y-3">
        <h2 className="font-medium">{t('settings.language')}</h2>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => i18n.changeLanguage(l.code)}
              className={`maar-focus rounded-full px-4 py-1.5 text-sm border ${i18n.language === l.code ? 'maar-btn-primary font-medium' : ''}`}
              style={i18n.language !== l.code ? { borderColor: 'var(--maar-line)' } : undefined}
            >
              {l.label}
            </button>
          ))}
        </div>
      </section>

      <section className="maar-surface p-5 space-y-3">
        <h2 className="font-medium">{t('settings.theme')}</h2>
        <div className="flex gap-2">
          {(['light', 'dark', 'system'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`maar-focus rounded-full px-4 py-1.5 text-sm border ${mode === m ? 'maar-btn-primary font-medium' : ''}`}
              style={mode !== m ? { borderColor: 'var(--maar-line)' } : undefined}
            >
              {t(`settings.theme.${m}`)}
            </button>
          ))}
        </div>
      </section>

      <section className="maar-surface p-5 space-y-3">
        <h2 className="font-medium">{t('settings.textSize')}</h2>
        <input
          type="range" min={85} max={130} step={5} value={textSize}
          onChange={(e) => applyTextSize(Number(e.target.value))}
          className="w-full"
        />
      </section>

      <section className="maar-surface p-5 space-y-2 text-sm text-[var(--maar-muted)]">
        <h2 className="font-medium text-[var(--maar-ink)]">{t('settings.offline')}</h2>
        <p>{t('settings.offline.info')}</p>
      </section>

      <section className="maar-surface p-5 space-y-3">
        <p className="text-sm text-[var(--maar-muted)]">{t('settings.dataStored')}</p>
        {!confirming ? (
          <button onClick={() => setConfirming(true)} className="maar-focus rounded-full px-4 py-2 text-sm border border-red-300 text-red-600">
            {t('settings.clearData')}
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm">{t('settings.clearData.confirm')}</p>
            <div className="flex gap-2">
              <button onClick={clearData} className="maar-focus rounded-full px-4 py-1.5 text-sm text-white bg-red-600">{t('settings.clearData')}</button>
              <button onClick={() => setConfirming(false)} className="maar-focus rounded-full px-4 py-1.5 text-sm maar-surface">{t('onboarding.skip')}</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
