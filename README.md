# MAAR Scriptures

**Different scriptures. Honest learning.**

MAAR Scriptures is a calm, respectful, educational platform for reading and
comparing what the Qur'an, Bible, and Torah actually say. It is **not** a new
religion, does not merge faiths, does not rank or rate them, and never asks
anyone to change what they believe. It shows original sources clearly and
separates scripture from translation, explanation, and any AI-generated
summary.

## What's built

- **Quran** — Al Quran Cloud API (`api.alquran.cloud`): full Surah list,
  Arabic (Uthmani script) + English translation side by side, per-ayah audio.
- **Bible** — `bible-api.com`: all 66 books, World English Bible (public
  domain translation).
- **Torah** — Sefaria API (`sefaria.org`): the Five Books of Moses, Hebrew +
  English.
- **Search** — queries all three sources live for a word or topic and shows
  each result with its scripture, reference, translation and source. If
  nothing is found, MAAR says so — it never invents a verse.
- **Compare** — same search, laid out as three columns ("What the source
  says"), plus an "MAAR Summary (AI-assisted)" section that is **currently
  disabled** (see "Enabling AI summaries" below).
- **Topics** — a starter list of common subjects (food, pork, alcohol,
  marriage, prayer, fasting, charity, prophets, creation, afterlife, justice,
  etc.) that jump into Compare. Search itself is not limited to this list.
- **Notes & Saved (bookmarks)** — stored only in the browser via IndexedDB
  (Dexie). No account required, nothing leaves the device.
- **Settings** — language, light/dark/system theme, text size, offline info,
  and a "clear local data" control.
- **Onboarding** — a 4-screen "Read / Search / Compare / Take notes" intro
  that explains MAAR's purpose and can be skipped.
- **i18n** — English, Bangla, Urdu, and Arabic (Urdu/Arabic ship full RTL
  layout). Every UI string comes from `src/i18n/locales/*.json`.
- **PWA** — installable, with a service worker that caches the app shell and
  opportunistically caches scripture API responses so pages you've already
  opened keep working offline.
- **Design** — Tailwind v4, a warm/neutral "manuscript-adjacent" palette with
  a distinct accent color per scripture (Quran/Bible/Torah), and a small set
  of hand-built animated components in the spirit of reactbits.dev (FadeIn,
  SpotlightCard, AnimatedGradientText, Marquee) — reactbits.dev is a
  copy-paste snippet gallery rather than an npm package, so these are
  original implementations using the same patterns, built with framer-motion.

## What's intentionally left as a next step

This is a real, working foundation, not the full scope of the original spec
in one pass. In particular:

- **More languages** (Hindi, French, Spanish, Turkish, Indonesian, Malay,
  Persian, etc.) — add a `locales/<code>.json` with the same keys as
  `en.json`, register it in `src/i18n/index.ts`, done. Have a native speaker
  review wording before shipping, as the spec asks.
- **AI-assisted Compare summaries** — the UI and copy exist, but no AI call
  is wired up, because that requires a *server-side* key (never a
  client-side one). See "Enabling AI summaries" below for a safe way to add
  it via a small serverless function.
- **Full-text topic search for Bible/Torah** — `bible-api.com` and Sefaria's
  search API don't map cleanly onto plain-English topic words, so
  `src/services/topicMap.ts` is a small, honest, hand-verified starting set
  of references per topic. Extend that file as you verify more topics — do
  not auto-generate entries, since MAAR must never guess a verse.
- **Deeper offline caching** with per-passage "available offline" indicators,
  a dedicated offline-downloads screen, and audio pre-download — the service
  worker caches whatever's been fetched, but there's no UI yet to browse or
  manage that cache explicitly.
- **Full WCAG 2.1 AA audit** — accessible markup, focus states, and RTL are
  in place, but this hasn't been run through a formal audit/testing pass.

## Install API keys / config

None of the current integrations need a key — all three scripture sources
are free public APIs. If you add a paid/keyed source (e.g. a licensed Bible
translation) or the optional AI summary backend, create a `.env.local`:

```
VITE_SOME_PUBLIC_CONFIG=...
```

**Never put a secret key in a `VITE_`-prefixed variable** — anything
prefixed `VITE_` ships in the client bundle. Secret keys belong only in a
server-side function (see below).

## Enabling AI summaries (optional, safe pattern)

1. Deploy a small serverless function (Vercel Function, Cloudflare Worker,
   etc.) that holds your Anthropic/OpenAI key server-side only.
2. That function should receive the retrieved passages as context and be
   instructed to summarize *only* what's given, and say so plainly if the
   sources don't contain enough information — never invent scripture or
   declare a religion correct.
3. Point `src/pages/Compare.tsx` at that endpoint instead of the disabled
   `compare.aiSummaryDisabled` message, and label all output "MAAR Summary
   (AI-assisted)" as already scaffolded.

## Adding a new scripture provider

Each scripture has its own file in `src/services/` (`quranService.ts`,
`bibleService.ts`, `torahService.ts`) returning the shared `Passage` type
from `src/types/scripture.ts`. Add a new file following the same shape, then
wire it into `searchService.ts` and add a page/route.

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build      # production build to dist/
npm run preview    # preview the production build
```

## Deploy

Static build (`dist/`) — deploy free on Vercel, Netlify, GitHub Pages, or
Cloudflare Pages. No backend is required unless you enable AI summaries.

## Copyright & sources

- Quran text: Al Quran Cloud (public API, edition-level licensing shown per
  translation).
- Bible text: World English Bible via bible-api.com (public domain).
- Torah text: Sefaria (see sefaria.org for per-edition licensing).

MAAR shows the source and translation name on every passage and never
reproduces a translation outside what its license allows for this kind of
reading app. Verify licensing again before any commercial deployment.
