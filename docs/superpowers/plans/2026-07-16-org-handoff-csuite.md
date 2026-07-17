# Org Handoff + C-Suite Review Chain — Implementation Plan

> **For agentic workers:** Execute task-by-task. Do not edit the prior org-position plan file.

**Goal:** Close hierarchy gaps — manager-only fan-out, structured IC/manager/C-suite handoffs, mandatory exec review before phase ✅ — plus RACI, escalation, write leases, tracker columns, and a Phase 13 smoke scenario.

**Architecture:** Orchestrator → Manager → ICs → Manager brief → C-suite review → phase complete.

**Tech stack:** Markdown skills/agents in ClaudeSkills; Cursor Task/custom agents at runtime.

## Global constraints

- Do not rewrite community skill packs.
- Orchestrator never spawns ICs directly (CEO may act as manager for its own phases).
- Handoffs are files under `docs/projects/<active>/business-idea/HANDOFFS/`.
- Do not edit `docs/superpowers/plans` prior org plan or the `.cursor/plans` attachment.

---

### Task 1: Shared contracts

**Files:**
- Create: `skills/org/HANDOFF-TEMPLATE.md`
- Create: `skills/org/MANAGER-BRIEF-TEMPLATE.md`
- Create: `skills/org/CSUITE-REVIEW-TEMPLATE.md`
- Create: `skills/org/COLLABORATION.md`
- Create: `skills/org/ESCALATION.md`
- Create: `templates/business-idea/HANDOFFS/README.md`

- [x] **Step 1:** Write IC handoff template (status, artifacts, decisions, asks for manager, risks, write_lease paths used)
- [x] **Step 2:** Write manager brief template (merged summary, IC list, open asks for C-suite, recommendation)
- [x] **Step 3:** Write C-suite review template (verdict: approve | revise | escalate; comments; reviewer slug)
- [x] **Step 4:** Write COLLABORATION.md RACI for phases 14, 15, 19 + rule: peers only via manager
- [x] **Step 5:** Write ESCALATION.md (legal→coo, brand→creative-director, spend→cfo, scope→head-of-product, evidence→head-of-research)
- [x] **Step 6:** HANDOFFS README with path conventions

---

### Task 2: Orchestrator rewrite

**Files:**
- Modify: `skills/org/orchestrator/SKILL.md`

- [ ] **Step 1:** Replace dispatch loop with manager-only fan-out
- [ ] **Step 2:** Expand context packet (`write_lease`, `budget_usd`, `collaborators`, `must_read`, `parent_position`, `report_to`)
- [ ] **Step 3:** Require manager brief + C-suite review before tracker ✅
- [ ] **Step 4:** `revise` → re-dispatch manager; do not advance
- [ ] **Step 5:** Update rationalization prevention for bypass / skip-review

---

### Task 3: Registry + scorecards

**Files:**
- Modify: `skills/org/ORG-REGISTRY.md`

- [ ] **Step 1:** Document “May delegate = manager may spawn, not orchestrator”
- [ ] **Step 2:** Add C-suite reviewer column per phase
- [ ] **Step 3:** Add one-line scorecard per phase
- [ ] **Step 4:** Link COLLABORATION.md for 14/15/19

---

### Task 4: Regen positions + agents

**Files:**
- Modify: all `skills/org/positions/*/SKILL.md`
- Modify: all `templates/org/agents/*.md`
- Modify: `skills/org/POSITION-TEMPLATE.md` (new required sections)

- [ ] **Step 1:** Extend generator / bulk update for manager spawn-await-merge-brief protocol
- [ ] **Step 2:** IC: handoff path, ask_manager, write_lease, no phase complete
- [ ] **Step 3:** CEO: C-suite review checklist (hard gates 3, 6, 10, 14, 19, 21)
- [ ] **Step 4:** Add `collaborates_with` on CMO, CD, CTO, HoP, etc.
- [ ] **Step 5:** Regen agent.md files with matching instructions
- [ ] **Step 6:** Confirm 36/36 slug parity

---

### Task 5: Runbook + tracker

**Files:**
- Modify: `rules/shared/business-idea-runbook.mdc`
- Modify: `templates/business-idea/RUNBOOK-TRACKER.md`

- [ ] **Step 1:** Principle #9 = manager-only fan-out + C-suite gate + handoff paths
- [ ] **Step 2:** Add Positions & handoffs table to tracker template
- [ ] **Step 3:** Decisions log notes exec verdict

---

### Task 6: Docs, smoke, canvas

**Files:**
- Create: `docs/superpowers/specs/2026-07-16-org-handoff-csuite-design.md`
- Create: `skills/org/examples/phase-13-smoke.md`
- Modify: canvas `virtual-org-stack.canvas.tsx` (reporting-chain view)
- Modify: `skills/org/README.md` (reporting chain section)
- Modify: root `README.md` (one paragraph on handoffs / C-suite gate)

- [ ] **Step 1:** Design spec
- [ ] **Step 2:** Phase 13 smoke scenario (docs-only)
- [ ] **Step 3:** Canvas reporting-chain view
- [ ] **Step 4:** README updates

---

### Task 7: Verify

- [ ] Grep orchestrator: forbids direct IC spawn
- [ ] Grep managers: spawn/await/merge/manager brief
- [ ] Grep ICs: HANDOFF + ask_manager + write_lease
- [ ] Tracker has Positions & handoffs
- [ ] COLLABORATION covers 14, 15, 19
- [ ] Position/agent/registry slug parity = 36

## Additional improvements included

| Item | Where |
|------|--------|
| Write leases | Context packet + IC skills |
| Conflict protocol | Manager protocol + COLLABORATION.md |
| Budget envelope | Packet `budget_usd` + ESCALATION → CFO |
| Shared must_read | product-marketing.md in packets |
| Phase scorecards | ORG-REGISTRY |
| Escalation matrix | ESCALATION.md |
| Positions log | Tracker table |
| Phase 22 standup | ceo-strategist + orchestrator note |

## Out of scope

- Cursor Task harness changes
- Auto-install to `~/.cursor/agents`
- Human UI approval boards
- OpenMontage internal agent rewrite
