---
phase: "5"
manager: head-of-product
ics_spawned: [product-manager, business-analyst]
status: ready_for_csuite
recommendation: approve
llm_tier: strong-general
llm_model: composer-2.5
generation_profile: none
fallback_applied: false
---

# Manager brief — Phase 5 PRD — Phase 5

## In plain English

Phase 5 defines what Blacksage Kennels will build: a trust-first website where serious buyers can evaluate the program before inquiring — not another reskin of the rejected v1 prototype with scroll-3D and apply-first UX. The PRD locks navigation (Home → Dogs → Health/Education → About → Contact/Inquire), 68 MoSCoW items, acceptance criteria for all four v1 failure layers, staged launch tiers, and inquiry packaging (Interest → Waitlist → Placement) gated by operator program maturity. Public launch still requires operator answers on program status, photography, and inquiry routing — but the product spec is complete enough for C-suite approval and downstream brand/web/copy phases.

## What we found

- **D2 is now buildable:** Evidence-led trust → "Begin your inquiry" is specified with CTA hierarchy, form fields, and explicit bans on prices, payments, and scroll-3D for v1.
- **v1 is anti-pattern only:** `apps/blacksage-kennels` (Next.js + R3F) must be replaced in Phase 9 — not patched; `/inquire` replaces `/apply` routing.
- **Four failure layers covered:** 22 testable AC IDs (Visual, Experiential/3D, Trust/content, UX/conversion) plus `AC-GATE-001` meta-gate before Phase 11 kickoff (SD7).
- **Launch tiers branch on Q1:** Tier 1 brand-first (Interest list only) vs Tier 2 active-program (Dogs, Litters, Waitlist) — quality bar is identical; content population differs.
- **Operator gates remain:** Q1, Q6, Q7, and health inventory block Tier 2 and production form routing — PRD documents defaults without inventing facts.

## Next steps

1. **C-suite (ceo-strategist):** Approve or revise `05-prd.md`; confirm SD7 build gate and operator interview scheduling.
2. **Operator:** Close Q1 (program maturity), Q6 (photography), Q7 (inquiry destination), Q2 (contact) before Phase 9 build kickoff.
3. **Downstream seats (post-approval):** Phase 6 GTM, Phases 11–14 brand/web/copy/content, Phase 10 QA test plan from AC IDs — no build until PRD + operator gates clear.

## Summary

- PRD at `05-prd.md` — MoSCoW **Must 32 · Should 14 · Could 10 · Won't 12**
- Trust-first IA and packaging A/B/C aligned to Phase 3–4 locks
- NFRs: mobile perf ≥85, WCAG 2.2 AA, SEO basics, form security
- Staged launch Tier 0–2 with Operator Decision Register
- Recommendation: **approve** for C-suite gate

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| `product-manager` | `HANDOFFS/5-product-manager.md` | done | strong-general | none |
| `business-analyst` | `HANDOFFS/5-business-analyst.md` | done | strong-general | none |

## Model routing check

- [x] Every IC packet had `llm_tier`
- [x] Creative ICs used correct `generation_profile` (or skip reason) — N/A; none required
- [x] Fallbacks recorded when Max Mode / plan blocked preferred model — none applied

## Conflicts resolved

- **Route naming (BA C2):** v1 `/apply` + D2 copy mismatch → production uses `/inquire` with trust-first nav.
- **Health education vs per-dog claims (BA C4):** Tier 1 category education OK; per-dog OFA links require inventory.
- **Launch date vs photography (BA C3):** Downgrade to Tier 1 rather than placeholder dog photos.

## Artifacts for C-suite review

| Path | Scorecard check |
|------|-----------------|
| `docs/projects/blacksage-kennels/business-idea/05-prd.md` | MoSCoW + AC on all four v1 layers; no 3D/price/payment in Must; rebuild-not-patch; operator gates flagged |
| `HANDOFFS/5-product-manager.md` | IC handoff complete |
| `HANDOFFS/5-business-analyst.md` | RTM + NFR traceability complete |

## Escalation tags

- **evidence** — Operator must supply photography, health inventory, and program facts before Tier 2 public launch
- **scope** — SD7 blocks Phase 11–14/9 until PRD AC pass; no second fast-forward

## Asks for C-suite

1. **Approve** Phase 5 PRD as strategy-to-spec lock for trust-first kennel website v1.
2. **Schedule operator interview** to close Q1, Q2, Q6, Q7 before Phase 9 build — PRD supports tier branches but public launch cannot proceed without these.
3. **Confirm** no RUNBOOK phase advance until C-suite yes/no on this brief.

## Recommendation

**approve** — ship phase artifacts as-is. PRD is complete for downstream phases; operator inputs are correctly gated, not invented. Phase 5 remains unmarked on RUNBOOK pending C-suite gate.
