---
phase: "6"
manager: cmo
ics_spawned: [product-marketing-manager, content-strategist, pr-manager]
status: ready_for_csuite
recommendation: approve
llm_tier: frontier-reasoning
llm_model: grok-4.5
generation_profile: none
fallback_applied: false
---

# Manager brief — Phase 6 GTM — Phase 6

## In plain English

Phase 6 defines how serious Rottweiler buyers find Blacksage and convert without FOMO ads or price-led acquisition. The owned website is the main surface: education and proof first, then “Begin your inquiry” into Interest list → Waitlist → Placement. Launch follows the PRD tiers (staging → brand-first → active program). Paid media stays off unless the operator later funds Phase 19. The GTM plan is ready for C-suite yes/no; the runbook phase stays unmarked until that gate.

## What we found

- **Organic/trust-first is the only base-case GTM:** Owned site + referrer/club borrowed channels; rented social optional (max 1–2); paid skipped (A7 / Phase 19).
- **Demand path is locked to packaging:** Discover → shortlist → verify on-site → inquire → Package A Interest / B Waitlist / C Placement — never invert with price or availability ahead of trust.
- **Launch outline is tiered:** Tier 0 no public promo; Tier 1 quiet credibility + interest list; Tier 2 controlled announcement only when dogs/health/photos verified.
- **Content ships education before conversion:** E1–E8 Health/Education must-ship set before promoting inquire; ungated education; interest list is the sole capture.
- **PR north star is referrer shareability (M5), not press hits:** Soft intro in breed networks; forum puppy ads and FOMO are explicit anti-patterns.

## Next steps

1. **C-suite (ceo-strategist):** Approve or revise `06-gtm-plan.md`; confirm paid remains skipped unless operator funds Phase 19.
2. **Operator:** Close Q1 (tier), Q2 (geography for local co-marketing), Q6 (photos), Q7 (inquiry routing) before public launch promotion.
3. **Downstream (post-approval):** Phases 13–14 copy/content/pages use CTA locks and E1–E8; Phase 16 SEO on Health/Education topics; Phase 19 stays skipped unless funded.

## Summary

- Artifact: `06-gtm-plan.md` — channels + launch outline + demand path complete  
- Scorecard: organic-first; Tier 0→1→2; Interest→Waitlist→Placement aligned  
- Anti-patterns: no FOMO puppy ads, no price-led acquisition, no marketplace listings  
- Measurement: quality inquiries + M5 referrer share + zero reputation incidents  
- Recommendation: **approve** for hard C-suite gate

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| `product-marketing-manager` | `HANDOFFS/6-product-marketing-manager.md` | done | strong-general | none |
| `content-strategist` | `HANDOFFS/6-content-strategist.md` | done | strong-general | none |
| `pr-manager` | `HANDOFFS/6-pr-manager.md` | done | creative-language | none |

## Model routing check

- [x] Every IC packet had `llm_tier`
- [x] Creative IC (`pr-manager`) used `creative-language`; generation_profile `none` (correct)
- [x] Fallbacks recorded — none applied (`composer-2.5-fast` per fan-out; manager `grok-4.5`)
- [x] CMO merge on `frontier-reasoning` / `grok-4.5`

## Conflicts resolved

- **PMM ask for “public-relations-manager”:** Mapped to spawned `pr-manager` — borrowed-channel detail merged from PR handoff; no peer spawn needed.
- **Content ask for seo-manager:** Deferred to Phase 16 — not blocking GTM merge; flagged in plan §10.
- **Rented social vs skip:** Resolved as **optional, max one platform** at launch if operator has presence; otherwise skip — owned + borrowed sufficient.
- **Lead magnets:** Content ungated default wins over any gated PDF bait — matches D2 and anti-persona filter.

## Artifacts for C-suite review

| Path | Scorecard check |
|------|-----------------|
| `docs/projects/blacksage-kennels/business-idea/06-gtm-plan.md` | Channels + launch outline present; organic-first; A/B/C funnel; Tier 0→1→2; paid skipped |
| `HANDOFFS/6-product-marketing-manager.md` | Launch narrative + ICP channel fit |
| `HANDOFFS/6-content-strategist.md` | Pillars + education path D2 |
| `HANDOFFS/6-pr-manager.md` | Reputation / community / referral PR |

## Escalation tags

- **evidence** — Operator Q1/Q2/Q6/Q7 and health inventory still gate public Tier 2 and local co-marketing
- **spend** — Paid remains skipped; escalate only if operator requests Phase 19 budget
- none for brand/legal at this phase

## Asks for C-suite

1. **Approve** Phase 6 GTM as the go-to-market lock for trust-first, organic kennel demand.  
2. **Confirm** Phase 19 paid stays skipped in base case (exception only with explicit operator funding).  
3. **Schedule / reinforce operator interview** for Q1, Q2, Q6, Q7 before any public launch promotion.  
4. **Do not** mark RUNBOOK Phase 6 ✅ until this C-suite yes/no completes.

## Recommendation

**approve** — ship phase artifacts as-is. Channels and launch outline meet scorecard; IC craft is consistent with D2/SD5/A10 and PRD packaging. Phase 6 remains unmarked on RUNBOOK pending C-suite gate.
