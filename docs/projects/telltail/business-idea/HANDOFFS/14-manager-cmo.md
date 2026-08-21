---
phase: "14"
manager: cmo
ics_spawned:
  - copy-chief
  - seo-manager
  - content-strategist
status: ready_for_verifier
recommendation: approve
llm_tier: frontier-reasoning
llm_model: grok-4.5
generation_profile: none
generation_used: none
fallback_applied: false
---

# Manager brief — Telltail — Phase 14 (CMO)

**Holding line (do not rewrite):** *See the signal. Do the next right thing — and know when to stop.* **[F]**

## Operator brief (plain English)

I merged the three Phase 14 IC leases into `14-pages/` — edited, not pasted — and I am not marking the phase complete. Copy wrote the marketing trio on Phase 13 ★ H1s. SEO wrote canonical meta (titles win; How drops brand to fit 60c). Content wrote in-thread moment / refuse / paywall and did not open a blog. Imagery is an honest skip: Phase 11 assets empty, brand-designer not spawned, no `14-pages/assets/`. No material conflict. Verifier can score body + meta + skip. Hard gate after that. Explore only — paper, no live site, no store.

## What we found

- Trio bodies present. ★ Home: “He froze at the door. Do the next right thing.” Freeze is a next step (AC-04.1). Pricing discloses $12 / $99 · 60 beside price. Never $9.99. Never unlimited. One chat product (PWA + Capacitor). Unpaid CTA stays Film this moment. **[F]**
- In-thread cards bodied. Kids leftover = refuse variant. Paywall after Lite only. Withdraw if A+C or K1. **[F]**
- Canonical titles: 57c / 59c / 47c. No volumes. Ahrefs/GSC/Firecrawl unavailable. LocalBusiness schema banned. In-thread noindex. **[F]**
- SEO `fallback_applied: true` (worker ran Grok; pin stays composer-2.5). Copy and Content: no fallback. **[F]**
- Imagery skip is load-bearing. Do not treat paper as shipped stills. **[F]**

## Next steps

1. **Verifier** — scorecard: all listed pages have body + meta; imagery skip documented. Phase 14 is shippable-verifier.
2. **C-suite** — hard-gate after verifier pass. Do not mark complete.
3. **Product / CTO (not spawned)** — K1 remains yours.
4. **Founder / counsel** — A5 unnamed; origin ≠ telltail.com.

## Summary

- CMO-merged pages ready for verifier. Status `ready_for_verifier`. Recommendation **approve**.
- Scorecard: Home / How / Pricing bodies + canonical meta; in-thread moment / refuse / paywall; imagery skip; production skipped.
- A+C stays a test. $12 / $99 · 60 is presentation, not WTP.
- Phase 14 is not marked complete.

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used | fallback |
|----|--------------|--------|----------|-----------------|----------|
| `copy-chief` | `HANDOFFS/14-copy-chief.md` | done / ready_to_merge | creative-language | none | false |
| `seo-manager` | `HANDOFFS/14-seo-manager.md` | done / ready_to_merge | fast-ops | none | **true** (ran Grok; pin composer-2.5) |
| `content-strategist` | `HANDOFFS/14-content-strategist.md` | done / ready_to_merge | strong-general | none | false |

## Model routing check

- [x] Every IC packet had `llm_tier`
- [x] Copy Chief: `creative-language` / `composer-2.5`
- [x] SEO: `fast-ops` / `composer-2.5` (fallback_applied true, recorded)
- [x] Content: `strong-general` / `composer-2.5`
- [x] This brief: `frontier-reasoning` / `grok-4.5`; no fallback

## Conflicts resolved

- **None material.** Chair: SEO `<title>`s are canonical; Copy draft slots now point at them. On-page H1s stay the full ★ lines.
- FAQPage schema stays **conditional** until How / Pricing display the FAQ lines. Not flattened into a deploy.
- Content stayed off `14-pages/blog/`. No sixth pillar.
- A+C remains a test. AC-04.1 carried. No invented volumes.

## Artifacts for verifier / C-suite

| Path | Scorecard check |
|------|-----------------|
| `docs/projects/telltail/business-idea/14-pages/00-cmo-merge.md` | This merge index |
| `docs/projects/telltail/business-idea/14-pages/home.md` | Body + ★ H1 |
| `docs/projects/telltail/business-idea/14-pages/how-it-works.md` | Body + ★ H1 |
| `docs/projects/telltail/business-idea/14-pages/pricing.md` | Body + ★ H1 + $12/60 viewport |
| `docs/projects/telltail/business-idea/14-pages/02-onpage-seo.md` | Canonical meta + schema recs |
| `docs/projects/telltail/business-idea/14-pages/in-thread/moment.md` | In-thread body |
| `docs/projects/telltail/business-idea/14-pages/in-thread/refuse.md` | In-thread body |
| `docs/projects/telltail/business-idea/14-pages/in-thread/paywall.md` | In-thread body |
| `docs/projects/telltail/business-idea/14-pages/assets/` | **Not created** — honest skip |
| `docs/projects/telltail/business-idea/HANDOFFS/14-manager-cmo.md` | This brief |

Canonical Mac: `/Users/cbsuperpatch/Desktop/ClaudeSkills/docs/projects/telltail/business-idea/` (local only, no OneDrive).

## Production check (shippable phases)

| Field | Value |
|-------|-------|
| production_status (merged) | skipped |
| Layer B paths | none |
| design_brief_path | none |
| wire_owner | none |
| skip_reason | Explore · page bodies on paper · no live site · no store · no imagery. Phase 11 assets empty; brand-designer not spawned. Schema not deployed. |

Phase 14 is shippable-verifier. Honest imagery + Layer B skip. Verifier may pass the skip.

## Escalation tags

- none blocking
- K1 (soft / product): Flash-refuse — withdraw Plus if it fails
- A5 (soft): unnamed; no face
- legal (soft): host ≠ telltail.com; Little Rock; no LocalBusiness schema
- evidence (soft): A1 / A4 OPEN; no volumes

## Asks for C-suite

- After verifier: **approve** the paper pages as Layer A.
- Do not flatten A+C into a launch lock.
- Do not mark Phase 14 complete.
- Do not spawn brand-designer from this brief to “fill” the skip.
- Do not treat paper as a live site or store listing.
- Do not buy `telltail.com`.

## Recommendation

**approve** — ship the merged `14-pages/` for verifier, then hard-gate C-suite. Explore only. Phase remains open. Do not mark the phase complete.

<!-- graph:start -->
[[Telltail]] · [[CMO — Telltail]] · [[Phase 14 — Telltail]]
<!-- graph:end -->
