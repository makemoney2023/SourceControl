---
phase: "16-eng"
manager: cto
ics_spawned: []
status: ready_for_orchestrator
recommendation: verify
llm_tier: coding-agent
llm_model: composer-2.5
generation_profile: none
fallback_applied: false
---

# Manager brief — Phase 16 P0 SEO (eng follow-up)

## In plain English

Shipped the four P0 technical SEO items from `16-seo.md` in `apps/blacksage-kennels`: sitemap, robots, production URL base (`metadataBase`), and per-page canonical tags on all five Must routes. Tests cover route lists, env fallback, sitemap/robots output, and canonical metadata. No Three.js/R3F. Operator still needs to set `NEXT_PUBLIC_SITE_URL` before production deploy.

## What changed

| Item | File(s) | Notes |
|------|---------|-------|
| `metadataBase` | `app/layout.tsx` | Uses `getSiteUrl()` from `lib/seo/site-url.ts` |
| Per-route canonicals | All `app/*/page.tsx` via `buildPageMetadata()` | `/`, `/dogs`, `/health`, `/about`, `/inquire` |
| Sitemap | `app/sitemap.ts` | Must routes only; excludes `/apply`, `/litters` |
| Robots | `app/robots.ts` | `Allow: /` + sitemap reference |
| Shared SEO lib | `lib/seo/*` | `site-url`, `must-routes`, `page-metadata` |
| Tests | `lib/seo/*.test.ts` | 10 new tests (23 total suite) |

## Env / URL policy

- **`NEXT_PUBLIC_SITE_URL`** — production origin, **no trailing slash** (e.g. `https://blacksagekennels.com` when operator confirms domain).
- **Fallback when unset:** `http://localhost:3000` (local dev only; documented in `lib/seo/site-url.ts`).
- Do **not** invent a production domain in code — operator sets env at deploy.

## Test results

```
npm test  → 8 files, 23 passed
npm run build → success; /sitemap.xml + /robots.txt static routes present
```

## Deferred (not in scope)

- P1: Open Graph + Twitter metadata
- P1: Organization JSON-LD (blocked on domain + `[CONTACT_EMAIL]`)
- P2+: OG image, `not-found.tsx` polish, LocalBusiness (Q2)

## IC handoffs merged

| IC | Handoff | Status |
|----|---------|--------|
| — | CTO implemented directly (narrow scope; delegate budget unused) | done |

## Ready

**yes** — orchestrator can verify build + sitemap output. No formal C-suite gate unless verification fails.

## Asks for operator (non-blocking)

1. Confirm production domain → set `NEXT_PUBLIC_SITE_URL` in Vercel/hosting env.
2. After deploy: submit sitemap in Google Search Console + Bing Webmaster (P1, CMO/operator).
