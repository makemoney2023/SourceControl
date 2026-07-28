---
phase: "16"
manager: cmo
ics_spawned:
  - seo-manager
status: ready_for_csuite
recommendation: approve
llm_tier: frontier-reasoning
llm_model: grok-4.5
generation_profile: none
fallback_applied: false
---

# Manager brief — SEO implementation — Phase 16

## In plain English

We have a launch-ready SEO plan for the five Must pages: what to build technically (sitemap, robots, canonicals, OG), which trust-first keywords each page owns, and which directories to use (and which to avoid). Local/geo SEO stays blocked until the operator supplies real location and contact facts. Ready for C-suite yes/no; the runbook phase is **not** marked complete.

## What we found

- Phase 14 meta is already in the app (`PAGE_META`); Phase 16 does not rewrite titles/descriptions.
- Build gaps are clear and prioritized: **P0** sitemap, robots, `metadataBase`, canonicals; **P1** OG/Twitter + Organization schema + GSC/Bing.
- Keyword strategy is trust-first D2 (health, ADRK/FCI Standard No. 147 education, kennel credibility) — no price, FOMO, apply/buy, or invented geo.
- `/apply` → `/inquire` 301 is already shipped; sitemap must never list `/apply` or `/litters` (until Q1).
- Geo SEO, Google Business Profile, and `LocalBusiness` schema are explicitly **blocked until Q2**.

## Next steps

1. **C-suite (CEO + peers)** — Approve or revise `16-seo.md` at the gate.
2. **Orchestrator** — On approve, advance runbook; do **not** mark Phase 16 ✅ until C-suite passes. Route eng P0 items to CTO/tech-lead (outside CMO write lease this phase).
3. **Operator** — Supply production domain, `[CONTACT_EMAIL]`, and later Q2 `[LOCATION]` before Organization schema / local SEO / GBP.

## Summary (5 bullets max)

- `16-seo.md` ships: technical checklist, 5-route keyword map, directory list, schema + AI/SEO notes, P0–P3 order.
- CTA/SERP locks held: **Begin your inquiry**; no Buy/price/apply; `/apply` not canonical.
- Geo/NAP/LocalBusiness flagged blocked until Q2 — placeholders not invented.
- Eng P0 blockers documented for post-gate build (sitemap/robots/metadataBase/canonicals).
- Single IC (`seo-manager`); no peer conflicts; collaborates_with eng via orchestrator after approve.

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| `seo-manager` | `HANDOFFS/16-seo-manager.md` | done | fast-ops | none |

## Model routing check

- [x] Every IC packet had `llm_tier`
- [x] Creative ICs N/A this phase (`generation_profile: none`)
- [x] Fallbacks recorded — none applied; IC used `composer-2.5-fast` per orchestrator packet (registry preferred `composer-2.5`; packet pin honored)

## Conflicts resolved

- **Inquire keyword wording:** IC listed "breeder application process" as a secondary search cluster; CMO retitled to **inquiry process** so SERP/on-page language never drifts toward "Apply."
- **Eng ownership:** P0 technical gaps are specified in `16-seo.md` but implementation sits with CTO/tech-lead after C-suite — not an IC conflict.
- none other

## Artifacts for C-suite review

| Path | Scorecard check |
|------|-----------------|
| `16-seo.md` | Technical checklist ✅ · Keyword map (5 routes) ✅ · Directories (no spam) ✅ · Schema recs ✅ · AI/SEO ✅ · P0–P3 order ✅ · Geo blocked Q2 ✅ |
| `HANDOFFS/16-seo-manager.md` | IC done · ready_to_merge · model audit ✅ |
| `HANDOFFS/16-manager-cmo.md` | This brief |

## Scorecard (CMO)

| Criterion | Pass? | Notes |
|-----------|-------|-------|
| Technical SEO checklist complete | ✅ | Sitemap, robots, meta ref, canonical, OG, redirects, CWV |
| Keyword map by Must page | ✅ | Trust-first D2; Avoid lists match locks |
| Directory/submission list | ✅ | GSC/Bing + breed-credible only; spam excluded |
| Structured data recommendations | ✅ | Organization when email/domain; LocalBusiness Q2-gated; FAQ conditional |
| AI/SEO notes | ✅ | `/health` extractability; AI bot Allow; anti-pSEO |
| Route locks (`/apply` not canonical) | ✅ | 301 documented; sitemap exclude |
| CTA language lock | ✅ | Begin your inquiry; no Buy/price-forward SEO |
| Placeholders / geo blocked | ✅ | Q2 gate explicit |
| RUNBOOK Phase 16 not marked ✅ | ✅ | Orchestrator + C-suite only |

## Escalation tags

- none

## Asks for C-suite

- **Approve** Phase 16 SEO plan as launch guidance?
- Confirm production domain ownership path so eng can set `NEXT_PUBLIC_SITE_URL` after gate?
- Accept Q2 block on geo/GBP/LocalBusiness (no inventing NAP)?

## Recommendation

**approve** — ship phase artifacts as-is; route eng P0 to CTO after gate

## collaborates_with

- `cto` / `tech-lead` (post-gate): implement P0 sitemap, robots, metadataBase, canonicals — ask orchestrator to spawn; CMO does not spawn peer managers.
