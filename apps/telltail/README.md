# Telltail — Lite explore MVP

**Mode:** explore · **Not** in App Store · **Plus stubbed**

One web chat app (PWA + Capacitor wraps). Chat thread is the product chrome.

## Stack

- Next.js 15 App Router (`apps/telltail/`)
- Tailwind v4 + `design-system/telltail/` tokens
- Gemini `gemini-3.5-flash-lite` — one cloud vision call per read
- Ionic Capacitor config (shell only — no store binaries)
- PWA manifest at `/manifest.webmanifest`

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Chat thread — describe scare + attach media + vision read |
| `/how-it-works` | Marketing |
| `/pricing` | Lite / Plus (stubbed) copy |
| `/api/read` | Server vision gate (POST) |

## Run locally

```bash
cd apps/telltail
npm install
export GEMINI_API_KEY=your_key   # required for live vision reads
npm run dev                      # http://localhost:3010
npm test
npm run build
```

Without `GEMINI_API_KEY`, the UI runs but `/api/read` returns 503.

## Eval harness (keep)

Scoped kid-vs-dog eval — **not** the MVP UI:

```bash
python3 eval/kid_vs_dog.py
```

Fixtures: `fixtures/*.jpg` · Results: `eval/results.json`

## Capacitor (explore shell)

```bash
npx cap add ios      # when Xcode available
npx cap add android  # when Android SDK available
CAPACITOR_SERVER_URL=https://your-host npm run cap:sync
```

Wrapped apps load the hosted web URL — same chrome as PWA.

## PRD scope this pass

Must: US-01–07, US-10–12 (stub), US-19 (config), US-21. Plus / K1 / store listing **not** shipped.
