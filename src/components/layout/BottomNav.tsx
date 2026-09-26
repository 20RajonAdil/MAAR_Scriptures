import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Search, Scale, NotebookPen, Menu } from 'lucide-react';

const links = [
  { to: '/', key: 'nav.home', icon: Home },
  { to: '/search', key: 'nav.search', icon: Search },
  { to: '/compare', key: 'nav.compare', icon: Scale },
  { to: '/notes', key: 'nav.notes', icon: NotebookPen },
  { to: '/settings', key: 'nav.settings', icon: Menu },
];

export function BottomNav() {
  const { t } = useTranslation();
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t flex justify-around py-1"
      style={{
        borderColor: 'var(--maar-line)',
        background: 'var(--maar-surface)',
        paddingBottom: 'env(safe-area-inset-bottom, 6px)',
      }}
      aria-label={t('nav.home')}
    >
      {links.map(({ to, key, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1.5 text-[11px] rounded-lg maar-focus ${
              isActive ? 'text-[var(--maar-gold)]' : 'text-[var(--maar-muted)]'
            }`
          }
        >
          <Icon size={20} />
          {t(key)}
        </NavLink>
      ))}
    </nav>
  );
}
