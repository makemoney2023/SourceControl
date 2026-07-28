---
phase: "5"
position: product-manager
reports_to: head-of-product
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5-fast
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Phase 5 PRD → head-of-product

## Goal (from context packet)

Write the full `05-prd.md` with PRD structure (vision, goals, personas, IA, user stories), MoSCoW prioritization, acceptance criteria per major requirement, staged launch tiers (brand-first vs active-program), v1 failure layer coverage (visual, experiential/3D, trust/content, UX/conversion), and packaging A/B/C gated by Q1 (Interest → Waitlist → Placement). Follow all Phase 3–4 strategic locks (D2 trust-first, no 3D v1, no price/payment UX, rebuild not patch).

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/05-prd.md` | Full PRD: vision, goals, personas, IA, user stories, MoSCoW (68 items), four-layer v1 AC, staged launch tiers, inquiry form spec, media rules, packaging A/B/C |
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/5-product-manager.md` | This handoff |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | no |

## Decisions

- **IA locked:** Home → Dogs → Health/Education → About → Contact/Inquire (proof-first per CEO merge).
- **Primary CTA:** "Begin your inquiry" — tertiary on Home until trust sections consumed; no Apply now / Buy / Reserve / Shop.
- **MoSCoW counts:** Must 32, Should 14, Could 10, Won't 12 (68 total).
- **v1 failure layers:** 22 discrete AC IDs across V (5), E (5), T (7), U (8) — all Must-have via M-18–M-21.
- **Staged launch:** Tier 1 brand-first (Package A only) vs Tier 2 active-program (Packages A/B; C off-site only).
- **Media rule:** Placeholders allowed for brand/environment and honest empty states; **never** stock/AI dogs as Blacksage program proof.
- **Inquiry form:** 12 shared fields + honeypot + consent; Package B adds 4 fields when Q1 active; no payment or price fields.
- **Rebuild:** Explicit Must M-04, M-32 — Phase 9 replaces `apps/blacksage-kennels`, does not patch R3F scroll-3D prototype.
- **3D:** Won't W-01; Layer 2 AC E1–E5; optional ambient motion deferred to Could C-10 post-v1 only.

## Asks for manager (`ask_manager`)

- Peer help needed: none
- Clarification needed: **Operator interview before Phase 9** to close Q1, Q2, Q6, Q7, Q8 — PRD flags these as launch gates without inventing answers. Recommend head-of-product schedule with operator prior to build kickoff.

## Risks / blockers

- **Q1 unset:** Determines Tier 1 vs 2 and Package A vs B live UX — PRD supports both but launch config requires operator answer.
- **Q7 unset:** Form destination blocks LG1/LG2 launch gates — Must M-11.
- **Photography delay (Q6):** Tier 1 honest empty states mitigate; Tier 2 requires operator dog photos for named pages.
- **Scope creep risk:** Historical v1 soft locks (scroll 3D, apply-first) — mitigated by explicit Won't list and failure-layer AC.

## Packs used

- `skills/community/awesome-claude-corporate-skills/09-product-management/prd-writer/SKILL.md`
- `skills/org/positions/product-manager/SKILL.md`
- `skills/org/HANDOFF-TEMPLATE.md`

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Inherit parent model when MODEL-REGISTRY pins a different tier (esp. creative/legal)
