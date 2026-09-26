import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Search, Scale, Bookmark, NotebookPen, Settings, Info } from 'lucide-react';
import { LANGUAGES } from '../../i18n';

const links = [
  { to: '/quran', key: 'nav.quran', icon: BookOpen },
  { to: '/bible', key: 'nav.bible', icon: BookOpen },
  { to: '/torah', key: 'nav.torah', icon: BookOpen },
  { to: '/search', key: 'nav.search', icon: Search },
  { to: '/compare', key: 'nav.compare', icon: Scale },
  { to: '/saved', key: 'nav.saved', icon: Bookmark },
  { to: '/notes', key: 'nav.notes', icon: NotebookPen },
];

export function TopNav() {
  const { t, i18n } = useTranslation();

  return (
    <header className="sticky top-0 z-40 border-b" style={{ borderColor: 'var(--maar-line)', background: 'color-mix(in srgb, var(--maar-bg) 88%, transparent)', backdropFilter: 'blur(10px)' }}>
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2 font-semibold text-lg shrink-0 maar-focus rounded-md">
          <span
            aria-hidden
            className="inline-block h-7 w-7 rounded-full"
            style={{ background: 'conic-gradient(var(--maar-quran), var(--maar-gold), var(--maar-bible), var(--maar-torah))' }}
          />
          {t('app.name')}
        </NavLink>

        <nav className="hidden md:flex items-center gap-1 overflow-x-auto text-sm">
          {links.map(({ to, key, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-full px-3 py-1.5 whitespace-nowrap maar-focus transition-colors ${
                  isActive ? 'bg-[var(--maar-ink)] text-[var(--maar-bg)]' : 'hover:bg-[var(--maar-line)]'
                }`
              }
            >
              <Icon size={15} /> {t(key)}
            </NavLink>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <select
            aria-label={t('settings.language')}
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="maar-card maar-focus rounded-full px-3 py-1.5 text-sm"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
          <NavLink to="/settings" aria-label={t('nav.settings')} className="maar-focus rounded-full p-2 hover:bg-[var(--maar-line)]">
            <Settings size={18} />
          </NavLink>
          <NavLink to="/about" aria-label={t('nav.about')} className="hidden sm:block maar-focus rounded-full p-2 hover:bg-[var(--maar-line)]">
            <Info size={18} />
          </NavLink>
        </div>
      </div>
    </header>
  );
}
