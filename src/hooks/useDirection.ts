import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../i18n';

export function useDirection() {
  const { i18n } = useTranslation();
  useEffect(() => {
    const lang = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];
    document.documentElement.dir = lang.dir;
    document.documentElement.lang = lang.code;
  }, [i18n.language]);
}
