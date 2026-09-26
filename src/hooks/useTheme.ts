import { useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(
    () => (localStorage.getItem('maar-theme') as ThemeMode) || 'system'
  );

  useEffect(() => {
    const apply = () => {
      const isDark =
        mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    };
    apply();
    localStorage.setItem('maar-theme', mode);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [mode]);

  return { mode, setMode };
}
