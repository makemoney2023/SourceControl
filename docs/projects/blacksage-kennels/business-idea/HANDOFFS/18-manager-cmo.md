---
phase: "18"
manager: cmo
ics_spawned:
  - product-marketing-manager
  - paid-media-manager
status: ready_for_csuite
recommendation: approve
llm_tier: frontier-reasoning
llm_model: grok-4.5
generation_profile: none
fallback_applied: false
---

# Manager brief — Conversion optimization — Phase 18

## In plain English

We mapped the trust-first inquire funnel, audited every CTA on the rebuilt site (passes — no apply-first or FOMO), documented the conversion path including the open mailto→CRM gap, and locked a CRO experiment backlog that never breaks brand rules. Ready for C-suite yes/no; the runbook phase is **not** marked complete. Live testing waits on analytics and Q7.

## What we found

- **Funnel is D2-locked:** Discover → Shortlist (Home proof band) → Verify (Dogs/Health/About) → Inquire → off-site Packages A→B→C.
- **CTA audit passes** against `apps/blacksage-kennels` — **Begin your inquiry** only; Home has no above-fold convert CTA; forbidden patterns absent.
- **Q7 remains open** — mailto stub means conversion is design-complete but not operationally live; CRM/ESP destination required.
- **10 CRO hypotheses** prioritized (P0: proof-band order, Dogs interest-path clarity); permanent REJECT list blocks dark patterns / apply-first / price tests.
- **Measurement blocked** until analytics + form backend (`tool_status: unavailable` for GA/CRM).

## Next steps

1. **C-suite (CEO + peers)** — Approve or revise `18-conversion.md` at the gate.
2. **Orchestrator** — On approve, advance runbook; do **not** mark Phase 18 ✅ until C-suite passes.
3. **Operator** — Set Q7 (`[CONTACT_EMAIL]`, `[RESPONSE_SLA]`, CRM/ESP routing); confirm Q1 Package A vs B before form/copy tests that depend on mode.
4. **CTO (post-approve)** — Wire analytics events + inquire API replacing mailto before executing P0 tests.

## Summary (5 bullets max)

- Merged PMM funnel/CTA/path + paid-media CRO backlog into `18-conversion.md`.
- Site CTA audit: pass; locks held (D2, Begin your inquiry, A→B→C, no FOMO/price).
- Q7 mailto→CRM documented as open; conversion not "live" until closed.
- CRO: H1–H10 + REJECT list; first recommended test = proof-band Health-first order.
- Soft ask: mobile nav "Inquire" vs desktop "Begin your inquiry" — optional polish.

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| `product-marketing-manager` | `HANDOFFS/18-product-marketing-manager.md` | done | strong-general | none |
| `paid-media-manager` | `HANDOFFS/18-paid-media-manager.md` | done | strong-general | none |

## Model routing check

- [x] Every IC packet had `llm_tier`
- [x] Creative ICs used correct `generation_profile` (none — N/A)
- [x] Fallbacks recorded when Max Mode / plan blocked preferred model — none applied

## Conflicts resolved

- **PMM soft opt (unify mobile nav) vs paid H6 (outline button on Home band):** Both low-risk; neither blocks merge. Recommend sequential: ship analytics first, then H1, then optional nav polish — not parallel UI thrash.
- **Health shows A+B cards vs Q1 single form mode:** Kept as intentional education (PMM); live mode stays env-gated on `/inquire`. No conflict with paid hypotheses.
- **Form shorten vs quality:** Both ICs agree — do not remove qualification fields; progressive disclosure (H4) only for Package B structure.

## Artifacts for C-suite review

| Path | Scorecard check |
|------|-----------------|
| `docs/projects/blacksage-kennels/business-idea/18-conversion.md` | Funnel map · CTA audit · conversion path · test hypotheses · measurement · paid readiness brief |
| `HANDOFFS/18-product-marketing-manager.md` | ready_to_merge |
| `HANDOFFS/18-paid-media-manager.md` | ready_to_merge |
| `HANDOFFS/18-manager-cmo.md` | this brief |

## Scorecard (manager)

| Check | Result | Notes |
|-------|--------|-------|
| Funnel map trust-first (D2) | ✅ | Home → evidence → inquire; Packages A→B→C |
| CTA audit vs rebuilt app | ✅ | Begin your inquiry; no apply-first / FOMO / price |
| Conversion path + Q7 open | ✅ | Mailto stub → CRM/ESP documented open |
| Test hypotheses + REJECT list | ✅ | 10 hypotheses P0–P2; 16 permanent rejects |
| No dark patterns in backlog | ✅ | Explicit reject list |
| Phase 19 not over-scoped | ✅ | Paid readiness brief only |
| Runbook Phase 18 marked ✅ | ❌ intentionally | Orchestrator + C-suite gate only |

## Escalation tags

- none

## Asks for C-suite

- Approve Phase 18 conversion artifact as the CRO SSOT?
- Confirm operator will close Q7 before treating inquire as live (non-blocking for craft approve)?
- Confirm Q1 Package A vs B for launch mode (gates H2/H4 execution)?

## Recommendation

**approve** — ship `18-conversion.md` as-is; operator/CTO close Q7 + analytics before executing tests; do not mark runbook Phase 18 ✅ until C-suite gate passes
