# Blacksage Kennels

Next.js App Router MVP for Blacksage Kennels — cinematic landing with scroll-driven 3D and inquiry form.

## Run locally

```bash
cd apps/blacksage-kennels
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm test` | Run Vitest unit tests |
| `npm run lint` | ESLint |

## Routes

- `/` — Cinematic landing (Hero, Heritage, Structure, Temperament, Trust, Apply CTA)
- `/apply` — Inquiry form with client-side validation

## Stack

- Next.js 15 App Router + TypeScript + Tailwind CSS v4
- shadcn/ui form primitives (dark theme, amber primary)
- React Three Fiber scroll scene
- Framer Motion scroll reveals
- Zod + react-hook-form validation

## Placeholders

Operator must replace: `[CONTACT_EMAIL]`, `[LOCATION]`, `[CONTACT_PHONE]`, `[HEALTH_TESTS]` in `lib/constants.ts`.
