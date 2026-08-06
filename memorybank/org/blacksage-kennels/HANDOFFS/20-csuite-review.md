---
phase: "20"
reviewer: "ceo-strategist"
secondary_reviewers: []
verdict: approve
date: 2026-07-27
llm_tier: frontier-reasoning
llm_model: cursor-grok-4.5-high-fast
fallback_applied: false
---

# C-suite review — Phase 20 (Analytics)

## In plain English

Phase 20 Analytics is **approved**. The measurement plan matches D2 trust-first: north-star is quality inquiry behavior (evidence before submit), not vanity traffic. Event taxonomy, weekly dashboard, and CTO wiring map are design-ready; analytics is correctly **not** claimed as live in the app. Safe next step is **Phase 21 Launch & final QA** via `ceo-strategist` / company orchestrator. Operator should confirm Plausible (recommended) vs GA4 before CTO implements — preference either way is fine.

## What we found

- **NS-1 operationalizes D2:** Trust-path submit rate (≥2 of `/health`, `/dogs`, `/about` before `/inquire`) aligns with 18-conversion’s conceptual north star and GTM quality > volume; vanity traffic, form volume alone, and revenue are explicitly excluded.
- **Taxonomy covers the owned funnel:** Must-route `page_view`, proof-band view/click, health section depth, full inquire funnel (`start` → `field_error` → `submit` / `submit_fail` → `confirmation_view`), plus CTA placement enums mapped to build surfaces and CRO H1–H10.
- **Dashboard is weekly-operator usable:** Five-row rolling 7d view; paid ROAS/CPA/ad CTR correctly omitted (Phase 19 skip); manual quality tags stay operator-owned until Q7 CRM.
- **Implementation is clear and honest:** No analytics in `apps/blacksage-kennels` today; §4 file map + env guards + Vitest targets + M-01–M-19 P0/P1/P2 launch checks give CTO a Phase 21 ticket without false “done” status.
- **Privacy + Q7 handled:** No PII in events; mailto stub still fires `inquire_submit` with `submit_method: mailto` and fail path — not a design blocker.

## Next steps

1. **Orchestrator** — Mark Phase 20 ✅. Advance **Phase 21 Launch & final QA** via **`ceo-strategist`** (company orchestrator path per runbook). Phase 21 is a **hard C-suite gate**.
2. **CEO / Phase 21** — Exec summary + launch checklist; fold M-01–M-10 as measurement go/no-go; dispatch CTO for `lib/analytics/*` instrumentation per §4 (not “already shipped”).
3. **Operator (non-blocking for design approve)** — Confirm analytics provider (**Plausible** recommended; GA4 or Vercel-only override OK); ~$9/mo Plausible budget if chosen; GSC access for organic row; cookie/consent only if GA4 selected.

## Inputs reviewed

- Manager brief: `HANDOFFS/20-manager-head-of-data.md`
- IC handoff: `HANDOFFS/20-analytics-engineer.md`
- Key artifacts: `20-analytics.md`, `18-conversion.md` (funnel / events / CRO prerequisites)
- Scorecard source: operator Phase 20 task + `skills/org/ORG-REGISTRY.md` (Phase 20: KPI + event plan)

## Scorecard (operator + ORG-REGISTRY)

| Criterion | Pass? | Notes |
|-----------|-------|-------|
| North-star KPI aligned to trust-first D2 (quality inquiries, not vanity traffic) | yes | NS-1 trust-path submit rate; KPI-1–6 + G-1–4 support; raw traffic / revenue / paid excluded |
| Event taxonomy covers Must routes + inquire funnel + proof/evidence signals | yes | `page_view` ×5 Must routes; proof-band + health depth; inquire start→submit→confirm; session evidence storage |
| Dashboard spec usable weekly; paid KPIs correctly omitted (Phase 19 skip) | yes | §3 rows 1–5; §1.4 + §3.7 exclude paid/revenue/vanity |
| Implementation notes clear for Phase 21 CTO (not falsely marked done in app) | yes | Explicit “no analytics today”; §4 wiring + tests; M-01–M-19 launch criteria; phase not marked complete |
| No invented hard revenue/traffic targets without ASSUMPTION labels | yes | Numeric postures ASSUMPTION or 90-day baseline; no revenue/traffic hard goals |
| Privacy: no PII in events; Q7 mailto path handled | yes | Enums only on submit; `submit_method: mailto` → `api` post-Q7; staging enable guard |
| Manager brief + IC handoff present | yes | `20-manager-head-of-data.md` + `20-analytics-engineer.md` |
| Correct model tier used? | yes | HoD strong-general; analytics-engineer coding-agent; this review frontier-reasoning |
| Generation profile correct (11/12/15/19)? | n/a | Phase 20 measurement design; `generation_profile: none` |

## Verdict

**approve** — orchestrator may mark Phase 20 ✅ and advance Phase 21.

## Comments for manager

- Ship `20-analytics.md` as-is. No material revisions.
- Provider: **Plausible primary + optional Vercel Web Vitals** is the locked recommendation unless operator overrides to GA4 — either path is implementable via `lib/analytics/track.ts`.
- Keep event names as `inquire_*` (preferred over Phase 18’s conceptual `form_*`) — document once in CTO ticket so CRO backlog maps stay consistent.
- Manual KPI-5 (qualified tags) remains operator-owned until Q7 — do not block Phase 21 design on CRM join.
- Do not treat Phase 20 as “analytics live”; instrumentation is Phase 21 CTO work gated by M-01–M-10 before public launch.

## Decisions to log in RUNBOOK-TRACKER

- Phase 20 C-suite: **approve** (2026-07-27)
- Next phase owner: **ceo-strategist** → Phase 21 Launch & final QA (hard C-suite gate); CTO implements analytics per `20-analytics.md` §4 during launch readiness
- Provider recommendation held: Plausible (+ optional Vercel Web Vitals); operator may override to GA4
- Phase 19 paid skip remains: no paid KPIs or ad pixels in measurement plan
