---
phase: "8"
position: "ops-manager"
reports_to: "coo"
status: done
verdict_for_manager: ready_to_merge
llm_tier: fast-ops
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
tool_status:
  github: unavailable
  vercel: unavailable
  supabase: unavailable
production_status: skipped
production_paths: []
design_brief_path: ""
skip_reason: "Phase 8 ops lease is Layer A runbook only; no Layer B; explore, no store, nobody is building. 4B closed."
wire_owner: none
wire_checklist_path: ""
wire_notes: ""
---

# Handoff — Ops Manager → COO

## Operator brief (plain English)

The ops slice is in `_leases/08-ops-runbook.md` for you to merge — I did not write `08-operations.md`, the legal/risk sections, or the manager brief. Day-to-day is a consumer IAP loop (reads/quota, hard-stop queue, kids-in-frame refuse, tickets, restore, model vendor), not an inquiry desk. SLA hours stay `[Operator to set]` in the sales playbook; I did not invent them. Legal items are flagged for counsel, not drafted.

## What we found

- Kennel / inquiry-desk waste (pricing form, human re-score, second SLA clock, SDR follow-up) does not belong on this product. Support is IAP ops.
- The load-bearing ops control is the same as product: gate always runs at 0 remaining; support never clears a refuse as “fine.”
- Kids-in-frame is an ops retention event, not a later polish: yes/no only, no template, clip not a training asset. Durations are counsel.
- Vendors are placeholders (Flash-class vision, Apple IAP, crash tool, support desk). No contracts invented.
- Weekly RAG is four loops only. No fake budget or subscriber counts this pass.

## Next steps

1. **COO** — merge this lease into `08-operations.md` with the legal-counsel slice. Banner + risk are yours. Do not mark the phase complete.
2. **legal-counsel (peer, already on Phase 8)** — pick up the flagged list (COPPA/cloud kids, retention, no-train default, DPA, TM, insurance as founder items). Do not expect ToS from this seat.
3. **Operator** — staff L1 names and publish SLA hours in the *sales playbook* block when a build exists. No new Open register id.

## Goal (from context packet)

Ops runbook for a consumer IAP app, not an inquiry desk. Daily/weekly/event checklists, RACI, vendor placeholders, support cadence. Report to coo. Do not spawn. Do not write the manager brief. Do not mark the phase complete. Do not write legal/risk sections or `08-operations.md`.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/telltail/business-idea/_leases/08-ops-runbook.md` | Mergeable ops slice: scope vs out, principles, RACI, checklists, IAP support cadence, vendor placeholders, data-handling SOP, legal flags |
| `docs/projects/telltail/business-idea/HANDOFFS/8-ops-manager.md` | This handoff |

Local Mac only (`/Users/cbsuperpatch/Desktop/ClaudeSkills/docs/projects/telltail/business-idea/`). Not OneDrive.

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | fast-ops |
| llm_model | composer-2.5 |
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
| skip_reason | Explore ops lease; no Layer B; no store; 4B closed |

## SDK correlation (optional)

| Field | Value |
|-------|-------|
| sdk_runtime | n/a |
| sdk_agent_id | n/a |
| sdk_run_id | n/a |
| sdk_request_id | n/a |

## Decisions

- Operate an IAP consumer app, not an inquiry desk / kennel / QBR motion.
- One SLA clock: cross-ref `07-sales-playbook.md` Shared operator SLA. Hours remain `[Operator to set]`.
- Support never re-scores a product refuse; quota never skips the gate at 0 remaining.
- Checklists: daily D1–D7, weekly W1–W7, event-triggered (gate skip, kids retain, vendor/IAP outage, suspected K1, mid-scare paywall).
- RACI uses roles; names `[Operator to set]`. Solo default = founder holds A until seated.
- Vision LLM / IAP / crash / support desk are placeholders. Phase 4 Gemini 2.5 Flash is a planning base, not a signed vendor.
- Data SOP: clip leaves device; no train-on-user-video default; kids-in-frame not a training asset; retention durations deferred to counsel.
- Weekly RAG = four loops (reads/quota, hard-stop, kids-in-frame, IAP+vendor). No invented SPI/budget.
- A5 stays unnamed. Do not buy `telltail.com`. Explore: no go-live date.

## Asks for manager (`ask_manager`)

- Peer help needed: `legal-counsel` (already spawned this phase) for the flagged legal list — ToS/privacy/retention/COPPA/DPA/TM. Do not spawn from this seat.
- Clarification needed: none

## Risks / blockers

- Merging this into a kennel-style / inquiry-desk `08-operations.md`.
- Publishing invented SLA hours or a second clock.
- Support “saving” a skip-the-refuse ticket with a goodwill card.
- Treating Gemini Flash planning prices as a signed vendor.
- Filling retention days without counsel.
- Flattening A+C into a chat-only coach at L1.
- Quiet course swap if K1 fires.
- Buying or inheriting `telltail.com`.

## Packs used

| Pack | Decision tied to pack |
|------|------------------------|
| `skills/community/awesome-claude-corporate-skills/07-operations/process-optimization/` | Mapped kennel/inquiry waste (pricing form, human re-score, duplicate SLA, SDR follow-up) and deleted it. Future-state is checkpoints beside the owner loop, not extra human gates in front of a read. |
| `skills/community/awesome-claude-corporate-skills/07-operations/project-status-report/` | Weekly flash is RAG on four operating loops only. Budget/SPI/FTE tables omitted — no spend this explore pass; fabricating them would be a red flag, not a status. |

## Do not

- Mark the phase complete
- Write `08-operations.md` or the manager brief
- Write legal/risk ToS or `_leases/08-legal-risk.md`
- Spawn other positions
- Invent SLA hours, insurance quotes, counsel opinions, or a go-live date
- Duplicate sales scripts
- Name a public trainer or fill A5
- Copy artifacts to OneDrive / iCloud / Google Drive
