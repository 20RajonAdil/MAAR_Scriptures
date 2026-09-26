# MAAR Read

**Read the Qur'an, Bible, and Torah side by side — simple, honest, and calm.**

MAAR Read is a respectful, educational scripture-reading and comparison app.
It is **not** a new religion, does not merge faiths, does not rank or rate
them, and never asks anyone to change what they believe. It shows original
sources clearly and separates scripture from translation, explanation, and
any AI-generated summary.

## What's built

- **Quran** — Al Quran Cloud API (`api.alquran.cloud`): full Surah list,
  Arabic (Uthmani script) + English translation side by side, per-ayah audio
  (audio is only shown where a real recitation exists — nothing is faked).
- **Bible** — `bible-api.com`: all 66 books, World English Bible (public
  domain translation).
- **Torah** — Sefaria API (`sefaria.org`): the Five Books of Moses, Hebrew +
  English.
- **Global search** — queries all three sources live for a word or topic and
  shows each result with its scripture, reference, translation and source.
  If nothing is found, MAAR says so plainly — it never invents a verse.
- **Compare mode** — the same search laid out as three columns ("What the
  source says"), plus an "MAAR Summary (AI-assisted)" section that is
  **currently disabled** (see "Enabling AI summaries" below). Nothing here
  ever suggests one scripture is better, more correct, or tries to convert
  anyone — that's a hard rule, not just a style choice.
- **Topics** — a starter list of common subjects (food, pork, alcohol,
  marriage, prayer, fasting, charity, prophets, creation, afterlife, justice,
  etc.) that jump straight into Compare. Search itself isn't limited to this
  list.
- **Bookmarks & Notes — stored locally, ported from MAAR.Quran's pattern.**
  See "How local storage works" below.
- **Settings** — language, light/dark/system theme, text size, offline info,
  and a "clear local data" control.
- **Onboarding** — a 4-screen "Read / Search / Compare / Take notes" intro
  that explains MAAR's purpose and can be skipped.
- **i18n, easy wording** — English, Bangla, and Urdu (Urdu ships full RTL
  layout), written at a level a child can follow. Every UI string comes from
  `src/i18n/locales/*.json`. An Arabic translation already exists in the
  same folder and is wired into i18next, just left out of the language
  switcher for now — see the comment in `src/i18n/index.ts` for how to turn
  it back on once it's had a native-speaker review.
- **PWA** — installable, with a service worker that caches the app shell and
  opportunistically caches scripture API responses, plus a friendly "You are
  offline" banner instead of a broken page.
- **No secret keys, anywhere.** Every API used (Al Quran Cloud, bible-api.com,
  Sefaria) is free and keyless. Nothing is hardcoded that shouldn't be, and
  there's nothing client-side to leak. If you later add a source that needs
  a key, see "Install API keys / config" below for the safe way to do it.
- **Design** — Tailwind v4, a warm/neutral palette with a distinct accent
  color per scripture, and a small set of hand-built animated components in
  the spirit of reactbits.dev (FadeIn, SpotlightCard, AnimatedGradientText,
  Marquee) — reactbits.dev is a copy-paste snippet gallery rather than an
  npm package, so these are original implementations of the same patterns,
  built with framer-motion.

## How local storage works (ported from MAAR.Quran)

MAAR Read's notes and bookmarks intentionally copy MAAR.Quran's storage
behavior rather than reinventing it:

- **Everything lives in `localStorage`**, namespaced under an `mr_` prefix
  (`src/lib/localStore.ts`) — the same pattern as MAAR.Quran's `qm_`-prefixed
  `store` helper. It's plain `JSON.stringify`/`JSON.parse`, wrapped in
  try/catch so a private-browsing quota error never crashes the app.
- **Notes auto-save on every keystroke** (`src/lib/notesStore.ts`) — there is
  no "Save" button, exactly like MAAR.Quran's reflection notes. One note per
  verse, keyed by `${scripture}:${reference}`. The note panel shows "Saved
  to your device" or "Nothing written yet — start typing" live as you type,
  mirroring MAAR.Quran's `NoteOverlay` indicator text.
- **Bookmarks are a simple toggle** (`src/lib/bookmarksStore.ts`) stored as
  an array, add-or-remove on tap — same shape as MAAR.Quran's
  `toggleBookmark`.
- **Nothing is sent anywhere.** Clearing it (Settings → clear local data, or
  clearing browser data) removes it permanently, same as the original app.
- Components re-render on change via a tiny local pub-sub
  (`useLocalStoreVersion`), so you don't need a database or a page refresh
  to see a note or bookmark appear.

## What's intentionally left as a next step

This is a real, working foundation, not the full scope of a v1.0 product in
one pass. In particular:

- **More languages** (Arabic is drafted but unswitched — see above; Hindi,
  French, Spanish, Turkish, Indonesian, Malay, Persian, etc. follow the same
  two-step pattern in `src/i18n/index.ts`). Have a native speaker review
  wording before shipping any new one.
- **AI-assisted Compare summaries** — the UI and copy exist, but no AI call
  is wired up, because that requires a *server-side* key (never a
  client-side one). See "Enabling AI summaries" below.
- **Full-text topic search for Bible/Torah** — `bible-api.com` and Sefaria's
  search API don't map cleanly onto plain-English topic words, so
  `src/services/topicMap.ts` is a small, honest, hand-verified starting set
  of references per topic. Extend that file as you verify more topics — do
  not auto-generate entries, since MAAR must never guess a verse.
- **Deeper offline caching** with per-passage "available offline" indicators
  and a dedicated offline-downloads screen — the service worker caches
  whatever's been fetched, but there's no UI yet to browse or manage that
  cache explicitly.
- **Full WCAG 2.1 AA audit** — accessible markup, focus states, and RTL are
  in place, but this hasn't been run through a formal audit/testing pass.

## Install API keys / config

None of the current integrations need a key — all three scripture sources
are free public APIs. If you add a paid/keyed source later, create a
`.env.local`:

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

