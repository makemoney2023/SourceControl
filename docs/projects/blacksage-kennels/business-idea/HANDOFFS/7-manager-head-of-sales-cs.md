---
phase: "7"
manager: head-of-sales-cs
ics_spawned: [sales-enablement-lead, outbound-lead, customer-success-manager]
status: ready_for_csuite
recommendation: approve
llm_tier: strong-general
llm_model: composer-2.5
generation_profile: none
fallback_applied: false
---

# Manager brief — Sales & CS Playbook — Phase 7

## In plain English

Phase 7 delivers a single operator-facing playbook for how Blacksage closes kennel inquiries and keeps puppy families after placement. Three specialists worked in parallel: one on qualification talk tracks and objections, one on inbound email triage and follow-up, and one on go-home support and referrals. Their work is merged into `07-sales-playbook.md` as three parts — Close, Respond, and Retain — all aligned to trust-first rules (no on-site prices, no FOMO, Package A/B/C). Response times and dollar amounts are left as operator placeholders until Q7 and deposit policy are set. The artifact is ready for C-suite yes/no; the runbook phase is not marked complete.

## What we found

- **Monetization sequencing is locked:** Trust → inquiry → qualification → price (off-site) → deposit (off-site, post-approval) → contract → placement → CS. Form submission never equals approval or reservation.
- **Three-tag triage drives all inbound follow-up:** qualified / neutral / anti-persona — with distinct sequences and no cold outbound.
- **Package gates are explicit:** A (Interest) → B (Waitlist, Q1 active + qualification call) → C (Placement, litter match + contract). Anti-persona (guard-dog, price-only, impulse, checkout) gets early polite decline.
- **CS starts at Package C only** — go-home checklist, touchpoints, escalation, and referral asks are post-placement with satisfaction gates.
- **Operator gates block polish, not structure:** Q7 (SLA/destination), Q1 (Tier 1 vs 2), OP-P1/P2/P6 (price, deposit, contract) must be closed before scripts go live — playbook uses `[Operator to set]` placeholders throughout.

## Next steps

1. **C-suite (ceo-strategist / orchestrator):** Review `07-sales-playbook.md` for yes/no on Phase 7 artifact; do not advance RUNBOOK ✅ until approved.
2. **Operator:** Close Q7 (inquiry email, owner, SLA), Q1 (Tier 1 vs 2), and OP-P2 (deposit policy) before customizing auto-replies and going live.
3. **Downstream phases:** copy-chief (Phase 13) may align site success-state copy; Phase 17 channels may reference inbound templates if email ops expand.

## Summary (5 bullets max)

- Merged `07-sales-playbook.md` covers close + retain scorecard: qualification, objections, SLAs, deposit/placement, post-placement CS.
- Three IC handoffs merged with no conflicts; scopes were complementary.
- All Blacksage-specific SLA and dollar figures labeled `[Operator to set]` — no invented numbers.
- D2 trust-first, Package A/B/C, and GTM anti-patterns enforced throughout.
- Phase 7 artifact draft complete; RUNBOOK not marked ✅ pending C-suite gate.

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| `sales-enablement-lead` | `HANDOFFS/7-sales-enablement-lead.md` | done | fast-general | none |
| `outbound-lead` | `HANDOFFS/7-outbound-lead.md` | done | fast-general | none |
| `customer-success-manager` | `HANDOFFS/7-customer-success-manager.md` | done | fast-general | none |

## Model routing check

- [x] Every IC packet had `llm_tier`
- [x] Creative ICs used correct `generation_profile` (or skip reason) — N/A; all `none`
- [x] Fallbacks recorded when Max Mode / plan blocked preferred model — none applied

## Conflicts resolved

- **Polite-decline templates:** Enablement and outbound both drafted versions — merged to single canonical template in Part I §2.6; Part II references it.
- **SLA placeholders:** Harmonized to `[Operator to set: e.g., 24–48 business hours]` across auto-replies, site success states, and inbound ops.
- **Referral loop:** Enablement flagged CS peer need; CSM handoff covers post-placement execution — no duplicate referral sections in Part I.

## Artifacts for C-suite review

| Path | Scorecard check |
|------|-----------------|
| `docs/projects/blacksage-kennels/business-idea/07-sales-playbook.md` | ✅ Close: qualification, talk tracks, objections, deposit/placement, A→B→C handoffs |
| | ✅ Respond: triage, SLAs (placeholder), auto-replies, follow-up sequences (inbound only) |
| | ✅ Retain: go-home checklist, touchpoints, health docs, escalation, referral loop, alumni |
| | ✅ Constraints: no on-site price, no FOMO, D2/Package A/B/C aligned |
| | ✅ SLAs labeled assumptions — no invented Blacksage numbers |

## Escalation tags

- none

## Asks for C-suite

- Confirm Phase 7 artifact approves trust-first sales/CS posture before operator customizes templates for launch.
- Flag whether operator interview (Q7, OP-P1/P2/P6) should be scheduled as blocking item before Tier 1 public launch — playbook assumes yes per PRD LG2.

## Recommendation

**approve** — ship Phase 7 artifacts as-is pending operator closure of Q7/OP-P gates for live use. Playbook structure is complete; customization is operator work, not a revise cycle.
