---
phase: "4"
manager: cfo
ics_spawned: [fpa-analyst, product-marketing-manager]
status: ready_for_csuite
recommendation: approve
llm_tier: frontier-reasoning
llm_model: grok-4.5
generation_profile: none
fallback_applied: false
---

# Manager brief — Business model & economics — Phase 4

## In plain English

We modeled Blacksage as a selective kennel that makes money when a puppy goes to an approved home — not as a website store or SaaS product. We still do not know Blacksage’s actual puppy price; every dollar figure is a labeled market-context assumption from Phase 2 research. At typical ethical pricing (about $2,000+) and roughly six placements a year, the numbers can work if fixed costs stay modest and the site stays a simple trust-first build (no 3D). Pricing should stay off the website and come after qualification, matching how serious competitors operate. Phase 4 is ready for C-suite yes/no; we did not mark the runbook phase complete.

## What we found

- **Unit:** Qualified placement is the revenue unit; qualified inquiry is the web KPI.  
- **Breakeven (base assumptions):** ~**6 placements/year** at ~$2,250 price and ~$740 variable COGS with ~$9k annual fixed (kennel + amortized web).  
- **Web ROI:** Trust-first static rebuild ~**$3k–$5.5k** Year-1; payback ~**3–4 incremental placements**; **no 3D funding**.  
- **Pricing posture:** No on-site prices/deposits (**Fact:** 0/8 competitors publish); discuss after qualification; packages = Interest list → Waitlist → Placement (Q1-gated).  
- **Blacksage price / deposit policy:** Still **operator-unknown** — ~$500 deposit is category context only.

## Next steps

1. **C-suite** — Approve Phase 4 artifacts (or revise) — do not advance RUNBOOK ✅ until gate clears.  
2. **Operator interview** — Lock OP-P1 price band, OP-P2 deposit/refund, Q1 maturity, Q8 budget, Q6 photos, Q7 inquiry owner before treating scenarios as forecasts.  
3. **Phase 5 (head-of-product)** — After approve: PRD AC for packaging by Q1, no payment UX, no price CTAs, deposit process after qualification.

## Summary (5 bullets max)

- Selective-placement transactional model; bootstrapped; 4B skipped.  
- Category unit economics plausible; low volume + low price breaks without hobby subsidy.  
- Pricing/packaging locked to D2 trust-first.  
- Deposits = working capital, not revenue.  
- Ready for C-suite review.

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| `fpa-analyst` | `HANDOFFS/4-fpa-analyst.md` | done | strong-general | none |
| `product-marketing-manager` | `HANDOFFS/4-product-marketing-manager.md` | done | strong-general | none |

## Model routing check

- [x] Every IC packet had `llm_tier`  
- [x] Creative ICs N/A — `generation_profile: none` for both  
- [x] Fallbacks: fpa recorded `composer-2.5` (packet asked `composer-2.5-fast`); PMM used `composer-2.5-fast` — no Max Mode block; `fallback_applied: false` on both IC handoffs and this brief

## Conflicts resolved

- None material — FP&A scenario midpoints and PMM category bands aligned; both keep Blacksage price UNKNOWN. Hobby-subsidy kept as optional Assumption (C6), not base P&L.

## Artifacts for C-suite review

| Path | Scorecard check |
|------|-----------------|
| `docs/projects/blacksage-kennels/business-idea/04-business-model.md` | Explicit unit economics + pricing posture |
| `HANDOFFS/4-fpa-analyst.md` | Labeled assumptions, sensitivity, web ROI |
| `HANDOFFS/4-product-marketing-manager.md` | Packaging A/B/C, anti-patterns |
| `HANDOFFS/4-manager-cfo.md` | This brief |

## Escalation tags

- none (operator price/deposit are **asks**, not C-suite peer conflicts)

## Asks for C-suite

- Approve Phase 4 business model as **posture + labeled scenario model** (not a firm forecast).  
- Confirm skip of Phase 4B unless operator wants a raise.  
- Confirm operator interview priority list before Phase 5 treats any $ as policy.

## Recommendation

**approve** — ship phase artifacts as-is for C-suite review; firm Blacksage prices remain intentionally open.
