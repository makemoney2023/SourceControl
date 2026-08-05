# CEO Position Skill Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline) or subagent-driven-development. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `ceo-strategist` executable for phases 0/1/3/10/21/22 via May-spawn alignment, phase playbooks, HEARTBEAT, and CHANGELOG — plus template pointer to the Role Upgrade Checklist.

**Architecture:** Expand the existing position `SKILL.md` in place (no new playbook files). Registry remains source of truth for spawn lists; skill mirrors it. History lives in per-seat `CHANGELOG.md`.

**Tech Stack:** Markdown position skills under `skills/org/`; references `ORG-REGISTRY.md`, handoff templates.

## Global Constraints

- Scope: `ceo-strategist` only (no other position upgrades)
- Playbooks live in `SKILL.md` only
- Do not change ORG-REGISTRY phase ownership
- Do not commit unless operator asks
- Spec: `docs/superpowers/specs/2026-08-05-ceo-position-skill-upgrade-design.md`

---

### Task 1: Rewrite CEO SKILL.md

**Files:**
- Modify: `skills/org/positions/ceo-strategist/SKILL.md`

- [x] **Step 1:** Replace `Delegates to` with org-tree + `May spawn` table + spawn hard rules (per spec)
- [x] **Step 2:** Update Delegation protocol to use May spawn for active phase; never spawn peers; Phase 22 via orchestrator
- [x] **Step 3:** Add `## Phase playbooks` for 0, 1, 3, 10, 21, 22 with Goal/Scorecard/Inputs/Must-read/Spawn/Procedure/Artifacts/Handoffs/Done checks
- [x] **Step 4:** Tighten Done criteria; add `History: see CHANGELOG.md` at end
- [x] **Step 5:** Update Collaborates with for Phase 22 / C-suite reviewer role note

### Task 2: HEARTBEAT + CHANGELOG

**Files:**
- Modify: `skills/org/positions/ceo-strategist/HEARTBEAT.md`
- Create: `skills/org/positions/ceo-strategist/CHANGELOG.md`

- [x] **Step 1:** Rewrite HEARTBEAT per spec (identity, playbook, May spawn, Phase 0/22 rules)
- [x] **Step 2:** Create CHANGELOG with 2026-08-05 entry covering spawn/playbooks/HEARTBEAT; checklist A–G passed

### Task 3: Template + spec status

**Files:**
- Modify: `skills/org/POSITION-TEMPLATE.md`
- Modify: `docs/superpowers/specs/2026-08-05-ceo-position-skill-upgrade-design.md` (status → Approved / Implemented)

- [x] **Step 1:** Add phase playbooks + changelog + checklist pointer to POSITION-TEMPLATE
- [x] **Step 2:** Mark design spec Status Approved / Implemented

### Task 4: Verify

- [x] **Step 1:** Grep CEO skill for May spawn seats matching registry (BA, PMM, HoR)
- [x] **Step 2:** Confirm six `### Phase` playbook headings exist
- [x] **Step 3:** Confirm CHANGELOG + HEARTBEAT + template pointer exist
- [x] **Step 4:** Mentally walk checklist A–G; fix any gaps before finishing
