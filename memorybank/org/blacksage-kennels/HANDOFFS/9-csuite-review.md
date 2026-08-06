---
phase: "9"
reviewer: "ceo-strategist"
secondary_reviewers: []
verdict: approve
date: 2026-07-27
llm_tier: frontier-reasoning
llm_model: grok-4.5
generation_profile: none
generation_used: none
fallback_applied: false
supersedes: "Any prior Phase 9 / scroll-3D v1 approve — this review covers the Software MVP REBUILD only"
---

# C-suite review — Phase 9 (Software MVP REBUILD)

## In plain English

The Phase 9 rebuild passes the C-suite gate. Engineering replaced the rejected scroll-3D / apply-first site with a trust-first multi-page Next.js app that matches Phases 11–14 REDO. All five Must routes are live, `/apply` redirects to `/inquire`, R3F/Three.js is gone, and tests plus production build are documented green. Remaining gaps are operator placeholders and Q7 mailto — not strategy regressions. Orchestrator may mark Phase 9 ✅; recommend advancing to Phase 15 (video/media) next.

## What we found

- **Rebuild-not-patch holds:** `package.json` has no `three` / `@react-three/*`; `components/three/*` and `/apply` page deleted; build log labels v2 vs deprecated v1.
- **D2 IA shipped:** Nav order Home → Dogs → Health/Education → About → Inquire; home leads with proof band + positioning; inquire CTA is tertiary **"Begin your inquiry"**.
- **Copy discipline intact:** Bracket placeholders preserved; no Buy/Apply-now/Shop/Reserve; no invented prices or deposit amounts.
- **Quality bar met for MVP scope:** 13/13 Vitest + successful `next build` documented in IC handoff, CTO brief, and `09-build-log.md`.
- **Known gaps are operator/ops, not product strategy:** `[CONTACT_EMAIL]`, `[LOCATION]`, mailto stub (Q7), photography, README polish, mobile nav Sheet.

## Next steps

1. **Orchestrator** — mark Phase 9 ✅ in RUNBOOK-TRACKER (C-suite does not mark).
2. **Recommend next phase: Phase 15 (video/media)** — brand/web/copy/pages + rebuild are coherent; media work is the next creative deliverable.
3. **Operator (parallel, non-blocking for Phase 9)** — replace placeholders in `lib/constants.ts`; soft preview of the live rebuild before media spend if desired. Do **not** block Phase 9 on preview.
4. **CTO / Phase 10+** — wire `app/api/inquire/route.ts` when Q7 destination confirmed; update README so it no longer describes v1 R3F.

## Inputs reviewed

| Input | Path |
|-------|------|
| CTO manager brief | `HANDOFFS/9-manager-cto.md` (recommendation: approve) |
| Tech-lead IC handoff | `HANDOFFS/9-tech-lead.md` |
| Build log | `09-build-log.md` |
| PRD (failure layers A–E, Must routes, NFR no R3F) | `05-prd.md` |
| Web design IA / SD4 | `12-web-design.md` |
| Page copy index (14 REDO) | `14-pages/README.md` |
| App spot-check | `apps/blacksage-kennels` — package.json, routes, `next.config.ts`, nav, home, CTA language |

## Scorecard (Phase 9 rebuild gate)

| # | Criterion | Pass? | Notes |
|---|-----------|-------|-------|
| 1 | Rebuild-not-patch: no R3F/Three.js; v1 scroll-3D removed | **yes** | Zero 3D deps in package.json; no `components/three`; grep clean except stale README note (documented polish gap) |
| 2 | Must routes live: `/` `/dogs` `/health` `/about` `/inquire` | **yes** | All five `app/**/page.tsx` present; build lists all five static routes |
| 3 | `/apply` → `/inquire` redirect | **yes** | Permanent 301 in `next.config.ts`; covered by redirect test |
| 4 | Trust-first D2: proof band, nav order, CTA "Begin your inquiry" | **yes** | `ProofSummaryBand` on home; `NAV_ITEMS` locked order; CTA language site-wide |
| 5 | Copy/pages alignment with 14-pages | **yes** | Home section order matches README map; placeholders; no invented prices |
| 6 | Tests + build documented passing | **yes** | 13/13 Vitest; build exit 0; First Load JS ~127 kB on trust pages |
| 7 | Known gaps only operator Qs — not strategy regressions | **yes** | Q7 mailto, placeholders, photography, README/mobile polish |
| 8 | Manager brief + IC handoff; labeled rebuild superseding v1 | **yes** | Both present; build log + briefs explicitly supersede scroll-3D v1 |
| — | Correct model tier used? | **yes** | IC/manager: coding-agent; this review: frontier-reasoning |
| — | Generation profile correct? | **n/a** | Phase 9 is engineering — no image/video generation |

## Verdict

**approve** — orchestrator may mark Phase 9 ✅.

This review **supersedes** any prior Phase 9 / scroll-3D v1 approval. The production MVP is the trust-first multi-page rebuild, not the cinematic prototype.

## Comments for manager (CTO)

- Mailto stub acceptable for MVP; prioritize API route when Q7 lands — do not treat as Phase 9 blocker.
- Package A default is correct for brand-first / Q1 posture.
- Please clear README v1 R3F language in a polish pass so docs match the rebuild.
- Mobile nav Sheet remains optional polish — not a gate failure.

## Decisions to log in RUNBOOK-TRACKER

- Phase 9 Software MVP **REBUILD** C-suite: **approve** (2026-07-27) — supersedes v1 Phase 9 / scroll-3D.
- Next recommended phase: **15 (video/media)**; operator placeholder fill + soft preview may run in parallel.
- Inquire backend (Q7) deferred past Phase 9; mailto remains interim.
