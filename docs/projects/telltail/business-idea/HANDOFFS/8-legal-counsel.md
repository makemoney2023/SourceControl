---
phase: "8"
position: "legal-counsel"
reports_to: "coo"
status: done
verdict_for_manager: ready_to_merge
llm_tier: frontier-reasoning
llm_model: grok-4.5
generation_profile: none
generation_used: none
fallback_applied: false
tool_status:
  firecrawl: unused
  parallel-research: unused
production_status: skipped
production_paths: []
design_brief_path: ""
skip_reason: "Explore Layer A — legal/risk checklist only; no Layer B, no store, no paid, nobody is building. Phase 8 is not a shippable production phase."
wire_owner: none
wire_checklist_path: ""
wire_notes: ""
---

# Handoff — Legal Counsel → COO

## Operator brief (plain English)

Phase 8 legal/risk slice is on disk as a lease, not the merged ops doc. Highest leftover exposure is cloud kids-in-frame video plus public-brand TM — both stay counsel-gated even if product locks ship. IAP/refunds and SLA hours are placeholders only; I did not invent terms or hours. Banner is at the top of the lease. Ready for you to merge — I did not write `08-operations.md` or mark the phase done.

## What we found

- Every v1 read transmits the clip, so the COPPA on-device exception is unavailable; kids-in-frame must refuse, store no face template, and not keep the clip as a training asset.
- A “relaxed / safe / won’t bite” chip is the kill-shot representation; a ToS footer does not un-say it.
- TELLTAIL Class 45 RN 7495734 + Class 35 RN 7031825 + Little Rock Telltail Dog Training + sunset `telltail.com` stay **planning risk-accepted only** — name locked, counsel before public brand, do not buy the domain.
- Sales playbook already points refunds at Apple and leaves SLA hours `[Operator to set]`; legal must not fill those.
- A5 stays OPEN: no named trainer, no celebrity catalog.

## Next steps

1. **COO** — merge `_leases/08-legal-risk.md` into `08-operations.md` with the ops runbook. Do not have this seat write the manager brief or mark Phase 8 complete.
2. **Founder (blocking for public brand / paid / listing, not for explore)** — engage licensed US (+ CA) counsel on the pre-launch list (privacy, ToS, IAP, DPA, COPPA/BIPA, TM coexistence, E&O bind). No quotes invented here.
3. **No new operator ask.** Do not re-ask the name, $12 / $99, 60 Flash, never $9.99, cloud-upload, or A5.

## Goal (from context packet)

Risk/compliance checklist for Telltail Phase 8: claims, privacy/kids, cloud video, TM collision, ToS/not-a-vet, attorney-review list. Required not-licensed-legal-advice banner. Report to `coo`. `delegate_budget: 0`. Do not spawn. Do not write the manager brief. Do not mark the phase complete. Do not write ops runbook / RACI / daily checklists.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/telltail/business-idea/_leases/08-legal-risk.md` | Banner first; scorecard; compliance (FTC, App Store, COPPA/PIPEDA/BIPA/CPRA, vet line, cloud-upload); IAP flags as `[Attorney to draft]`; privacy/PII; TM planning note; ToS flags; pre-launch attorney-review list |
| `docs/projects/telltail/business-idea/HANDOFFS/8-legal-counsel.md` | This handoff |

Local Mac only (`/Users/cbsuperpatch/Desktop/ClaudeSkills/docs/projects/telltail/business-idea/`). Not OneDrive.

**Not written (per packet):** `08-operations.md`, `_leases/08-ops-runbook.md`, `HANDOFFS/8-ops-manager.md`.

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | frontier-reasoning |
| llm_model | grok-4.5 |
| generation_profile | none |
| generation_used | none |
| fallback_applied | no |

## Production (shippable phases — required)

| Field | Value |
|-------|-------|
| production_status | skipped |
| production_paths | none |
| wire_owner | none |
| wire_notes | n/a |
| skip_reason | Explore Layer A; legal checklist is markdown; no Layer B / store / paid. Phase 8 has no ARTIFACT-QUALITY row |

Phase 8 is not a shippable Layer B phase in `ARTIFACT-QUALITY.md` (no q8 row). Production skipped on purpose.

## SDK correlation (optional)

| Field | Value |
|-------|-------|
| sdk_runtime | n/a |
| sdk_agent_id | n/a |
| sdk_run_id | n/a |
| sdk_request_id | n/a |

## Decisions

- Authored the legal/risk **lease**, not `08-operations.md` — COO merges.
- Banner placed at the top of the lease (verbatim intent). Confirmed present.
- Scored risks with the pack matrix (sev × like). Unmitigated RED: R2 kids-in-frame cloud (20), R3 cloud-upload architecture (20). Kill-shot ORANGE: R1 relaxed/safe chip (15). TM public-brand ORANGE (12), planning-accepted only.
- IAP/subscription flags are `[Attorney to draft]` only. Refunds point at Apple’s process. SLA hours left `[Operator to set]`.
- No insurance quotes, no counsel opinion, no claim we own or bought `telltail.com`.
- A5 unnamed; reward-based / no-dominance; do not name Cesar Millan.
- `verdict_for_manager: ready_to_merge` means the **lease is mergeable**, not that Phase 8 is approved.

## Asks for manager (`ask_manager`)

- Peer help needed: `ops-manager` for data-handling / retention SOP cross-ref when you merge — **do not have me spawn them**. External counsel engagement is a founder item on L1–L14, not a spawn.
- Clarification needed: none

## Risks / blockers

- Public brand / App Store / paid stay **blocked on counsel** (L1–L12). Explore may continue.
- Class 9/41/42 TELL TAIL software search and CIPO TELLTAIL search remain **incomplete** from Phase 0 — not cleared.
- K1 / A+C test fail withdraws Plus; refund/cancel path is still `[Attorney to draft]`.
- If product skips refuse-first or ships a safety chip, R1/R2 return to RED/ORANGE unmitigated.
- Insurance unbound — founder item; this seat did not quote.

## Packs used

| Pack | Decision tied to pack |
|------|------------------------|
| `skills/community/awesome-claude-corporate-skills/06-legal-compliance/legal-risk-assessment/` | Used sev × like (1–5) and GREEN/YELLOW/ORANGE/RED bands for the scorecard. R2/R3 score 20 RED unmitigated → escalate to outside counsel before listing, not “accept and ship.” R1 = 15 ORANGE (kill-shot chip). |
| `skills/community/awesome-claude-corporate-skills/06-legal-compliance/compliance/` | Built the privacy section around COPPA collection-via-video, PIPEDA under-13 consent, CPRA notice/DSR, and a vendor DPA (Art. 28-style elements) because every v1 read is a processor call. Flagged GDPR as out of v1 geo, not “cleared.” |
| `skills/community/awesome-claude-corporate-skills/06-legal-compliance/contract-review/` | No playbook on disk → labeled IAP review as general commercial standards. Tier-1 missing pieces (DPA, refund/auto-renew, liability/governing law) stay `[Attorney to draft]`; did not invent redline language or refund statutes. |

## Do not

- Mark the phase complete
- Write outside write_lease (`08-operations.md`, ops runbook, ops-manager handoff, manager brief)
- Spawn other positions (`delegate_budget: 0`)
- Inherit a weaker model — this seat is `frontier-reasoning` / `grok-4.5`
- Name-drop packs without a decision row
- Invent insurance quotes, counsel opinions, refund law, SLA hours, or that we bought `telltail.com`
- Name Cesar Millan or scrape a celebrity catalog
