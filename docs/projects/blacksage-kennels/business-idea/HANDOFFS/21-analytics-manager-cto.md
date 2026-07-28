---
phase: "21-analytics"
manager: cto
ics_spawned: []
status: ready_for_csuite
recommendation: approve
llm_tier: coding-agent
llm_model: composer-2.5-fast
generation_profile: none
fallback_applied: false
---

# Manager brief — Analytics P0 Wiring — Phase 21

## In plain English

The site now has a privacy-safe analytics layer that stays silent in local development and only sends events when production environment variables are set. Key conversion signals — page views, header CTAs, proof-band engagement, and the full inquire funnel — are wired and tested. No personal information (name, email, message) ever leaves the browser in analytics payloads. Operator still needs a Plausible account and production env vars before launch measurement go/no-go (M-01–M-10).

## What we found

- **P0 adapter shipped:** `lib/analytics/track.ts` no-ops without `NEXT_PUBLIC_ANALYTICS_ENABLED=true` + `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.
- **Trust-path evidence works:** `bsk_evidence_pages` sessionStorage tracks `/health`, `/dogs`, `/about` visits; included on `inquire_start` and `inquire_submit` with `trust_path_qualified` flag.
- **Tests green:** 36/36 Vitest pass; production build succeeds.
- **Tech-lead delegate skipped:** Subagent spawn failed (model slug); CTO implemented directly per same spec.
- **P1 backlog remains:** Health section observer, footer/dogs/health CTA coverage, dashboard template — documented in IC handoff.

## Next steps

1. **Operator** — Create Plausible project (~$9/mo) or confirm provider override; set production env vars on Vercel.
2. **CTO / Phase 21 QA** — Manual M-02–M-08 verification in production preview (walk Must routes, test submit, inspect network beacons).
3. **head-of-data / CMO** — Configure weekly dashboard (M-13) once live events confirmed.

## Summary

- Thin Plausible adapter + session evidence helper landed with TDD
- P0 events: page_view, cta_click, proof_band_view/click, inquire_start/submit, confirmation_view
- Safe no-op for local/dev; no PII in event payloads
- 13 new files, 5 modified; 36 tests passing
- Launch measurement blocked on operator env + manual M-01–M-10 checks only

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| tech-lead (CTO direct) | `HANDOFFS/21-analytics-tech-lead.md` | done | coding-agent | none |

## Model routing check

- [x] IC packet had `llm_tier`
- [x] `generation_profile: none` — no generation required
- [x] Fallback: tech-lead spawn failed → CTO direct implementation

## Conflicts resolved

- none

## Artifacts for C-suite review

| Path | Scorecard check |
|------|-----------------|
| `apps/blacksage-kennels/lib/analytics/` | P0 adapter + tests |
| `apps/blacksage-kennels/components/analytics/` | Scripts + trackers |
| `HANDOFFS/21-analytics-tech-lead.md` | IC detail + remaining M-* |

## Escalation tags

- none

## Asks for C-suite

- Confirm operator proceeds with Plausible (recommended) vs GA4 override before launch gate
- Approve P1 instrumentation (health sections, remaining CTAs) as follow-on in Phase 21 QA or post-launch

## Recommendation

**approve** — P0 analytics wiring meets Phase 21 measurement prerequisites; operator env + manual verification remain before public launch.
