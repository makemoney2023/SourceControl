---
phase: "21-analytics"
ic: tech-lead
status: done
report_to: cto
llm_tier: coding-agent
llm_model: composer-2.5-fast
generation_profile: none
fallback_applied: false
note: Implemented directly by CTO after tech-lead subagent spawn failed (invalid model slug).
---

# IC Handoff — Phase 21 Analytics P0

## Summary

Shipped thin Plausible-ready analytics adapter with session evidence helper and P0 event instrumentation. All calls no-op without production env keys — safe for local/dev.

## What shipped

### Core library (`lib/analytics/`)
| File | Purpose |
|------|---------|
| `types.ts` | Event name union + property interfaces |
| `track.ts` | `track()` + `isAnalyticsEnabled()` — no-op without env |
| `evidence-session.ts` | `bsk_evidence_pages` sessionStorage helper |
| `placements.ts` | CTA placement enum constants |
| `routes.ts` | Route name mapping + evidence route detection |
| `inquire-events.ts` | PII-safe `buildInquireSubmitPayload()` / `buildInquireStartPayload()` |

### Components (`components/analytics/`)
| File | Purpose |
|------|---------|
| `AnalyticsScripts.tsx` | Plausible script (afterInteractive, env-guarded) |
| `PageViewTracker.tsx` | `page_view` + evidence recording on route change |
| `TrackedLink.tsx` | `cta_click` wrapper + `trackCtaClick()` helper |
| `ProofBandTracker.tsx` | `proof_band_view` (IO) + `proof_band_click` |

### Instrumentation wired
| Surface | Events |
|---------|--------|
| `app/layout.tsx` | AnalyticsScripts, PageViewTracker |
| `app/page.tsx` | Home CTAs via TrackedLink; ProofBandTracker |
| `SiteHeader.tsx` | `cta_click` desktop + mobile inquire |
| `InquiryForm.tsx` | `inquire_start`, `inquire_submit`, `inquire_submit_fail` |
| `InquiryConfirmation.tsx` | `confirmation_view` |

## Tests (TDD)

| File | Cases |
|------|-------|
| `lib/analytics/track.test.ts` | No-op when disabled; Plausible dispatch; array serialization; PII key absence |
| `lib/analytics/evidence-session.test.ts` | Empty session; dedup; non-evidence ignore; persistence |
| `lib/analytics/inquire-events.test.ts` | Enum-only submit payload; optional field flags without values |

**Results:** `npm test` — **36/36 passed** (11 files). Build: **pass**.

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | Yes (prod) | Must be `true` to fire events |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` | Yes | `plausible` or `none` |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Yes (Plausible) | Site domain for script + guard |

**Local/dev default:** unset or `NEXT_PUBLIC_ANALYTICS_ENABLED=false` → all tracking no-ops.

**Production example:**
```
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_ANALYTICS_PROVIDER=plausible
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=blacksagekennels.com
```

## Remaining M-* items (not in P0 scope)

| ID | Status | Notes |
|----|--------|-------|
| M-01 | Operator + deploy | Set prod env vars; verify Plausible project |
| M-02 | Code done | Manual walk all 5 Must routes in prod preview |
| M-03 | Code done | Manual test submit |
| M-04 | Code done | confirmation_view wired |
| M-05 | Code done | Header CTA wired |
| M-06 | Code done | Proof band click wired |
| M-07 | Code done | Session evidence on submit |
| M-08 | Code done | Payload builder strips PII |
| M-09 | Operator | Share Plausible dashboard access |
| M-10 | Operator | GSC (Phase 16 parallel) |
| M-11 | Not wired | `health_section_view` — needs HealthSectionObserver |
| M-12 | Code done | `inquire_start` distinct from page_view |
| M-13 | Not done | Weekly dashboard template |
| M-14 | Not done | Operator manual log template |
| M-15 | Not done | Vercel Web Vitals (optional parallel) |

### P1 instrumentation backlog
- Footer nav `cta_click` (`SiteFooter.tsx`)
- Dogs page empty-state CTAs
- Health page section observer + placement card CTAs
- `inquire_field_error` on validation failure
- About page inquire links

## Files changed

**New:** 13 files under `lib/analytics/` and `components/analytics/`

**Modified:** `app/layout.tsx`, `app/page.tsx`, `components/layout/SiteHeader.tsx`, `components/inquire/InquiryForm.tsx`, `components/inquire/InquiryConfirmation.tsx`

**Unchanged but superseded:** `components/proof/ProofSummaryBand.tsx` (replaced by ProofBandTracker on home)

## Ready for launch measurement?

**Partial yes** — P0 code complete; M-01–M-10 require operator env setup + manual verification before public launch.
