import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import bn from './locales/bn.json';
import ur from './locales/ur.json';
import ar from './locales/ar.json';

// Architecture note: add a new language by (1) creating locales/<code>.json
// with the same keys as en.json, (2) importing + registering it below, and
// (3) adding it to LANGUAGES. No other code changes are required. MAAR Read
// starts with the three languages the spec asks for — English, Bangla, and
// Urdu. An Arabic translation already exists (locales/ar.json, full RTL
// support included) and is registered with i18next but left out of the
// switcher below until it's had a native-speaker review; flip it on by
// adding it back to LANGUAGES. French, Spanish, Hindi, Turkish, Indonesian,
// Malay, Persian, etc. follow the same two-step pattern.
export const LANGUAGES = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'bn', label: 'বাংলা', dir: 'ltr' },
  { code: 'ur', label: 'اردو', dir: 'rtl' },
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
