import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import bn from './locales/bn.json';
import ur from './locales/ur.json';
import ar from './locales/ar.json';

// Architecture note: add a new language by (1) creating locales/<code>.json
// with the same keys as en.json, (2) importing + registering it below, and
// (3) adding it to LANGUAGES. No other code changes are required. This is
// the starting set from the spec (English, Bangla, Urdu, Arabic); French,
// Spanish, Hindi, Turkish, Indonesian, Malay, Persian, etc. follow the same
// pattern and are intentionally left as an exercise for translators so the
// wording can be reviewed by a native speaker before shipping.
export const LANGUAGES = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'bn', label: 'বাংলা', dir: 'ltr' },
  { code: 'ur', label: 'اردو', dir: 'rtl' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
] as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      bn: { translation: bn },
      ur: { translation: ur },
      ar: { translation: ar },
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
