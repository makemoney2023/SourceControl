---
phase: "20"
manager: head-of-data
ics_spawned: [analytics-engineer]
status: ready_for_csuite
recommendation: approve
llm_tier: strong-general
llm_model: composer-2.5
generation_profile: none
fallback_applied: false
---

# Manager brief — Analytics & iteration — Phase 20

## In plain English

Phase 20 defines how Blacksage will know whether the trust-first website is working. The north-star metric is **qualified inquiry behavior**: submissions where buyers viewed at least two evidence pages (`/health`, `/dogs`, `/about`) before reaching `/inquire` — not raw form volume. We documented 12+ events, a weekly operator dashboard, and exact wiring points in the Next.js app for CTO to implement later. Analytics is **not in the codebase yet**; Phase 21 launch has explicit go/no-go checks (M-01–M-19) before going public. Recommended stack: **Plausible** for custom events, optional **Vercel Web Vitals** if on Vercel. No paid ad pixels (Phase 19 skipped).

## What we found

- **No analytics today** in `apps/blacksage-kennels` — measurement is design-ready, implementation is CTO Phase 21 work.
- **NS-1 trust-path submit rate** operationalizes D2 (evidence before inquire) using session evidence tracking — aligns with 18-conversion and 06-gtm quality > volume.
- **Mailto stub (Q7 open)** does not block client-side `inquire_submit` — still instrument on Zod pass; server confirmation comes when API ships.
- **Numeric targets deferred** — all volume targets labeled ASSUMPTION or 90-day baseline; no invented traffic/revenue goals.
- **CRO backlog (H1–H10)** event map included but execution blocked until M-01–M-07 instrumentation passes.

## Next steps

1. **C-suite** — approve `20-analytics.md` and provider recommendation (Plausible + optional Vercel Web Vitals).
2. **CTO (Phase 21)** — implement `lib/analytics/*` per §4 wiring map; TDD with Vitest; env-guard staging.
3. **Operator** — confirm analytics provider budget (~$9/mo Plausible) and GSC access for organic row.
4. **CMO** — configure weekly dashboard template (§3) once provider live; hold CRO tests until 4+ weeks baseline.

## Summary (5 bullets max)

- North-star: trust-path inquiry submit rate (≥2 evidence pages before `/inquire`).
- Full event taxonomy with properties, CTA placement enums, and CRO hypothesis map.
- Weekly operator dashboard spec (5 rows) — organic/site/inquiry focus; paid excluded.
- File-level implementation map for `apps/blacksage-kennels` — ready for CTO ticket.
- Phase 21 launch measurement criteria M-01–M-19 (P0 must-pass before public).

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| `analytics-engineer` | `HANDOFFS/20-analytics-engineer.md` | done | coding-agent | none |

## Model routing check

- [x] Every IC packet had `llm_tier`
- [x] Creative ICs used correct `generation_profile` (or skip reason) — N/A (none)
- [x] Fallbacks recorded when Max Mode / plan blocked preferred model — none

## Conflicts resolved

- none — IC draft merged with head-of-data provider recommendation only

## Artifacts for C-suite review

| Path | Scorecard check |
|------|-----------------|
| `docs/projects/blacksage-kennels/business-idea/20-analytics.md` | ✅ North-star + KPIs · ✅ Event taxonomy · ✅ Dashboard spec · ✅ Implementation notes · ✅ Phase 21 criteria · ✅ No invented targets · ✅ Paid KPIs excluded · ✅ Q7/mailto handled |

## Escalation tags

- none

## Asks for C-suite

- Confirm **Plausible** (or override to GA4/Vercel-only) before CTO implementation ticket.
- Acknowledge **manual qualified-inquiry tagging** stays operator-owned until Q7 CRM — not a launch blocker for analytics design.

## Recommendation

**approve** — ship phase artifacts as-is; CTO implements instrumentation in Phase 21 per wiring map.
