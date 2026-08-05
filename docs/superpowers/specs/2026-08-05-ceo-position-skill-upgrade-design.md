# Design: CEO Position Skill Upgrade (+ reusable role checklist)

**Date:** 2026-08-05  
**Status:** Approved / Implemented (2026-08-05)  
**Scope:** `ceo-strategist` only (first pass)  
**Extends:** `2026-07-16-org-position-subagents-design.md`, `2026-07-17-phase0-csuite-roundtable-design.md`  
**Related:** `skills/org/ORG-REGISTRY.md`, `skills/org/orchestrator/SKILL.md`, `skills/org/POSITION-TEMPLATE.md`

## Purpose

Make the CEO seat detailed enough to run owned phases without guessing spawn rules or artifact shape. Capture a **copyable upgrade checklist** so the same quality bar can roll to other roles later.

## Decisions (locked)

| Decision | Choice |
|----------|--------|
| First-pass scope | **CEO only** (`ceo-strategist`) |
| Depth | **Phase playbooks in the skill** (goal, must-read, procedure, scorecard, artifact shape) — not routing-only, not full pack paste |
| Playbook location | **All in** `skills/org/positions/ceo-strategist/SKILL.md` |
| Spawn authority | Align skill with `ORG-REGISTRY` “Manager may spawn”; keep “never spawn peer managers” except via orchestrator |
| Phase 22 peers | Document exception: request `cmo` / `head-of-data` / `paid-media-manager` via orchestrator; do not self-spawn peers |
| Phase 0 peers | Unchanged: Jarvis/OCC roundtable spawns CFO/CMO/COO/HoR; CEO merges into `0-csuite-review.md` |
| Packs | Keep listed packs for craft depth; playbooks say which pack + required artifact shape |
| Template | Light update to `POSITION-TEMPLATE.md` + publish reusable checklist in this spec |
| Changelogs | **Per-position** `positions/<slug>/CHANGELOG.md` (newest-first); not org-wide, not inline in SKILL.md |
| Registry ownership | No phase-owner rewrite in this pass |

## Problem today

1. **Spawn conflict:** CEO `Delegates to` lists only peer managers, but registry requires IC spawns for phases 1, 3, 10 (`business-analyst`, `product-marketing-manager`, `head-of-research`). Orchestrator says “spawn only Delegates to from position SKILL.md” → CEO cannot legally do the phase.
2. **Phase 22 conflict:** Registry allows on-demand peers; skill forbids peer spawn with no orchestrator exception path.
3. **No phase playbooks:** Owns 0/1/3/10/21/22 but only lists output filenames. Craft deferred to thin packs with no venture-path wiring.
4. **Uneven bar:** Seats like `verifier` / `lifecycle-marketer` have step-by-step craft; most managers (including CEO) are structural scaffolding only.

## Non-goals (this pass)

- Upgrading other positions (use checklist after CEO lands)
- Changing ORG-REGISTRY phase owners or hard gates
- New `phases/*.md` or shared `phase-playbooks/` files
- Pasting full community pack content into the CEO skill
- Changing Phase 0 roundtable OCC behavior

---

## Design — CEO skill

### Files

| File | Change |
|------|--------|
| `skills/org/positions/ceo-strategist/SKILL.md` | Primary: spawn lists + phase playbooks + tighter done criteria |
| `skills/org/positions/ceo-strategist/HEARTBEAT.md` | Align with template + new spawn/playbook rules |
| `skills/org/positions/ceo-strategist/CHANGELOG.md` | **Create** — first entry for this upgrade (newest-first) |
| `skills/org/POSITION-TEMPLATE.md` | Phase playbooks note + changelog + pointer to Role Upgrade Checklist |
| This spec | Source of truth for checklist and acceptance |

### Spawn model (CEO)

Keep two lists so org tree and phase authority stay clear:

```markdown
## Reports to
`—`

## Delegates to (org tree — manager reports)
- head-of-research, cfo, head-of-product, cmo, creative-director,
  head-of-sales-cs, coo, head-of-people, cto, head-of-data

## May spawn (phase ICs — must match ORG-REGISTRY)
| Phase | May spawn |
|-------|-----------|
| 0 | — (Jarvis peer roundtable; do not spawn peers) |
| 1 | business-analyst |
| 3 | product-marketing-manager, business-analyst |
| 10 | head-of-research, business-analyst |
| 21 | — (CEO craft) |
| 22 | on demand via orchestrator only: head-of-data, cmo, paid-media-manager |

## Spawn hard rules
1. Spawn only seats listed for the active phase in May spawn (or Delegates to when acting as manager of another seat’s IC — N/A for CEO-owned phases).
2. Never spawn peer managers yourself.
3. Phase 22 peers: set `ask_orchestrator` / return with collaborator request — orchestrator spawns.
4. Every IC packet: `write_lease`, `report_to: ceo-strategist`, `delegate_budget: 0`, `llm_tier` from MODEL-REGISTRY.
```

Update Delegation protocol step 1 to reference **May spawn for this phase**, not only org-tree Delegates to.

### Phase playbook shape (each owned phase)

Add section `## Phase playbooks` with one subsection per phase using this skeleton:

```markdown
### Phase <id> — <title>

**Goal:** <one sentence>  
**Scorecard (must pass):** <from ORG-REGISTRY>  
**Hard C-suite gate?** yes/no

**Inputs**
- …

**Must-read**
- position packs relevant to this phase
- prior artifacts / MEMORY when present

**Spawn**
- none | list ICs + lease guidance

**Procedure**
1. …
2. …

**Artifacts**
| Path | Required contents (shape) |
|------|---------------------------|
| … | … |

**Handoffs**
- IC handoffs (if any)
- `HANDOFFS/<phase>-manager-ceo-strategist.md`
- `HANDOFFS/<phase>-csuite-review.md` (when CEO is reviewer / merge owner)

**Done checks**
- [ ] scorecard items
- [ ] model audit fields
- [ ] do not mark phase ✅
```

### Playbook content requirements (CEO phases)

| Phase | Craft focus | Spawn | Key artifacts |
|-------|-------------|-------|---------------|
| 0 | Intake + classification; await/merge peer roundtable | none | `00-intake.md`, `0-manager-ceo-strategist.md`, merge `0-csuite-review.md` |
| 1 | Problem framing; assumptions labeled | `business-analyst` optional/as needed | `01-problem-framing.md` |
| 3 | Strategy ownership; product-marketing agent brief | PMM + BA | `03-strategy.md`, `.agents/product-marketing.md` |
| 10 | Strategy QA / load-bearing fact-check | HoR + BA | `10-strategy-review.md` |
| 21 | Launch QA / exec summary | none | `21-executive-summary.md` + launch checklist |
| 22 | Operating loop cadence entry | peers via orchestrator on demand | `22-operating-cadence.md` |

Procedure steps should be concrete (5–12 steps), reference packs by path, and echo scorecard language from `ORG-REGISTRY`.

Use existing venture artifacts (e.g. Blacksage `01-problem-framing.md`) as **shape references** when writing playbook “Required contents,” without hardcoding that venture.

### HEARTBEAT

Replace thin CEO HEARTBEAT with template-aligned checklist:

1. Identity / packet / `llm_tier`
2. Confirm phase playbook for this phase
3. Spawn only May-spawn for phase; non-colliding leases
4. Await handoffs → merge → manager brief
5. Phase 0: merge peer briefs into csuite review; do not spawn peers
6. Phase 22: request peers via orchestrator
7. Never mark phase ✅; exit with next action for orchestrator

### Done criteria (CEO skill)

Extend beyond generic bullets:

- [ ] Phase playbook procedure followed for active phase
- [ ] Scorecard criteria addressed in manager brief / csuite review
- [ ] Spawn list matched registry for phase
- [ ] Craft outputs + handoffs on disk
- [ ] Model audit fields present
- [ ] Summary up the chain only

### Per-position changelog

**Path:** `skills/org/positions/<slug>/CHANGELOG.md`  
**Audience:** humans and agents upgrading seats — not loaded on every phase wake (HEARTBEAT does not require reading it).

**Why it sits outside SKILL.md:** Working prompts stay lean; history stays durable without bloating craft instructions.

**Format (newest-first):**

```markdown
# Changelog — <slug>

## YYYY-MM-DD — <short title>

**Why:** <one sentence>

**Changed**
- Spawn / May spawn: …
- Phase playbooks: …
- Scorecards / done criteria: …
- HEARTBEAT / packs / integrations: …

**Checklist:** Role Upgrade Checklist A–G passed (or list deferred gaps)
```

**CEO first entry (this pass)** must record: May-spawn alignment with ORG-REGISTRY, six phase playbooks added, HEARTBEAT tightened, Phase 22 orchestrator exception.

**Rules**
- Append-only for past entries (don’t rewrite history)
- One entry per upgrade PR / intentional skill revision
- Optional one-line pointer at bottom of SKILL.md: `History: see CHANGELOG.md` — do not paste entries into the skill

---

## Role Upgrade Checklist (copy to other roles)

Use this checklist when upgrading any `skills/org/positions/<slug>/SKILL.md`.  
CEO is the first application; later seats should pass the same bar.

### A. Registry alignment (blocking)

- [ ] **A1.** `Owns phases` matches `ORG-REGISTRY` manager-owner rows for this slug
- [ ] **A2.** `May spawn` / `Delegates to` includes every seat in registry “Manager may spawn” for owned phases
- [ ] **A3.** Peer managers are **not** in self-spawn lists; collaboration goes through orchestrator (`Collaborates with` or `ask_manager` / `ask_orchestrator`)
- [ ] **A4.** IC seats have `Delegates to: _None_` and IC delegation protocol (no spawn)
- [ ] **A5.** Orchestrator constraint “spawn only from position skill” would succeed for every owned phase
- [ ] **A6.** Escalation tags / secondary reviewers from registry noted where this seat is reviewer or owner

### B. Structural completeness (template)

- [ ] **B1.** Required sections present: Purpose, Reports to, Delegates to, Collaborates with, Owns phases, Skill packs, Inputs, Outputs, Delegation protocol, Reporting chain, Context packet, Model profile, Integrations, Done criteria
- [ ] **B2.** Core question + real company titles
- [ ] **B3.** Skill packs exist on disk (no broken paths); each has a one-line “use for”
- [ ] **B4.** Integrations match `TOOL-REGISTRY` for this seat
- [ ] **B5.** Model profile matches `MODEL-REGISTRY` (`llm_tier`, preferred model, generation_profile)
- [ ] **B6.** HEARTBEAT.md exists and mirrors template + seat-specific rules

### C. Phase playbooks (managers who own phases)

- [ ] **C1.** Every owned phase has a playbook subsection in the position `SKILL.md` (or documented exception)
- [ ] **C2.** Each playbook has: Goal, Scorecard, Inputs, Must-read, Spawn, Procedure (5–12 steps), Artifacts table, Handoffs, Done checks
- [ ] **C3.** Scorecard text matches `ORG-REGISTRY` (not a weaker paraphrase)
- [ ] **C4.** Artifact paths match runbook / registry outputs
- [ ] **C5.** Artifact **shape** described (sections / required fields), not only filenames
- [ ] **C6.** Hard C-suite gates called out when phase is 3, 6, 10, 14, 19, or 21
- [ ] **C7.** Shippable phases (9, 9B, 11, 12, 14, 15, 17, 18, 19) reference `production-artifacts` + verifier pass

### D. Craft quality (IC and manager)

- [ ] **D1.** Purpose answers a load-bearing core question
- [ ] **D2.** Procedure tells the agent what to do without inventing process
- [ ] **D3.** Packs cited with concrete decisions expected (not name-drops)
- [ ] **D4.** Done criteria are falsifiable (someone can fail the seat)
- [ ] **D5.** Standing-context / production packs listed when seat touches copy, brand, HTML, video, or paid
- [ ] **D6.** Compare bar: at least as actionable as `verifier` or `lifecycle-marketer` for craft-heavy seats

### E. Handoff & chain hygiene

- [ ] **E1.** IC → manager brief → C-suite path explicit
- [ ] **E2.** Templates named: `HANDOFF-TEMPLATE`, `MANAGER-BRIEF-TEMPLATE`, `CSUITE-REVIEW-TEMPLATE`
- [ ] **E3.** “Do not mark phase ✅” stated
- [ ] **E4.** Model audit fields required on handoffs
- [ ] **E5.** Write-lease discipline stated; colliding leases forbidden when parallel

### F. Consistency pass (before calling done)

- [ ] **F1.** No contradiction between skill, `ORG-REGISTRY`, and `orchestrator/SKILL.md`
- [ ] **F2.** No contradiction with COLLABORATION.md / ESCALATION.md for owned phases
- [ ] **F3.** Smoke read: cold agent could run one owned phase from skill + packet alone
- [ ] **F4.** Checklist items A–E and G ticked for this slug; gaps filed or fixed

### G. Changelog (per position)

- [ ] **G1.** `skills/org/positions/<slug>/CHANGELOG.md` exists
- [ ] **G2.** Newest-first entry for this upgrade with date + why
- [ ] **G3.** Entry lists deltas: spawn/May spawn, playbooks, scorecards/done criteria, HEARTBEAT/packs/tools as applicable
- [ ] **G4.** Entry notes checklist status (A–G passed or deferred gaps)
- [ ] **G5.** Past entries not rewritten; SKILL.md does not embed full history (optional one-line pointer only)

### Suggested roll order (after CEO)

1. `ceo-strategist` ← this pass  
2. Other phase-owning managers: `head-of-research`, `cfo`, `head-of-product`, `cmo`, `creative-director`, `head-of-sales-cs`, `coo`, `head-of-people`, `cto`, `head-of-data`  
3. Craft-heavy ICs first within each dept (e.g. under CMO: `lifecycle-marketer`, `copy-chief`, `content-strategist`, …)  
4. Remaining ICs  

Copy this entire **Role Upgrade Checklist** section into a handoff note or ticket when starting the next seat.

---

## POSITION-TEMPLATE touch

Add a short note under required sections:

> Managers who own phases: include `## Phase playbooks` (see `docs/superpowers/specs/2026-08-05-ceo-position-skill-upgrade-design.md` Role Upgrade Checklist §C).  
> On each intentional skill upgrade: append `positions/<slug>/CHANGELOG.md` (§G).  
> Before shipping a position upgrade, complete the Role Upgrade Checklist in that spec (A–G).

Do not duplicate the full checklist into the template (avoid drift); link to this spec.

---

## Acceptance criteria (CEO pass)

1. CEO `May spawn` matches registry for phases 0, 1, 3, 10, 21, 22 (with Phase 22 peer exception documented).
2. Six phase playbooks present in `ceo-strategist/SKILL.md` with scorecards + procedures + artifact shapes.
3. HEARTBEAT updated; Delegation protocol references May spawn.
4. Role Upgrade Checklist exists in this spec (including §G Changelog) and is referenced from `POSITION-TEMPLATE.md`.
5. `ceo-strategist/CHANGELOG.md` exists with a first entry covering this upgrade.
6. Cold read: skill alone is enough to attempt Phase 1 or Phase 3 without inventing structure.
7. No ORG-REGISTRY ownership changes required for acceptance.

## Implementation notes

- Prefer editing existing CEO skill sections over new files.
- Keep playbooks lean: point at packs; don’t paste pack bodies.
- When registry and skill disagree, **registry wins for spawn lists**; fix the skill.
- Commit only when operator asks (repo commit policy).

## Open questions

_None locked outstanding for CEO pass. Future seats may choose split playbook files if `SKILL.md` exceeds ~500 lines._
