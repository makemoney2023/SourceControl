# Advertising Skills Pack Implementation Plan

> **For agentic workers:** Execute task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Vendor Kim Barrett’s 12 advertising skills into `skills/community/advertising-skills/` and wire them into the business-idea runbook.

**Architecture:** Mirror upstream category layout under a new community pack; extend existing runbook phases (2, 4, 13, 18, 19, 22) rather than adding a new phase.

**Tech Stack:** Git vendor copy, Markdown docs, Cursor runbook `.mdc`

## Global Constraints

- Pack path: `skills/community/advertising-skills/`
- Layout: `skills/<category>/<skill-name>/SKILL.md` (upstream mirror)
- Do not rewrite skill bodies
- Do not re-run existing `docs/projects/<active>/business-idea/` deliverables
- Do not commit unless user asks

---

### Task 1: Vendor upstream pack

**Files:**
- Create: `skills/community/advertising-skills/**` (from upstream)

- [x] Sparse-clone or archive-copy https://github.com/realkimbarrett/advertising-skills
- [x] Confirm 12 `SKILL.md` files exist
- [x] Preserve `AGENTS.md`, `VERSIONS.md`, `examples/`; move upstream README to `README.upstream.md`

### Task 2: Pack hub + root README

**Files:**
- Create: `skills/community/advertising-skills/README.md`
- Modify: `README.md`

- [x] Write pack hub (source, tables, install, runbook map)
- [x] Add Community section + tree line + install snippet; bump skill total (+12)

### Task 3: Runbook wiring

**Files:**
- Modify: `rules/shared/business-idea-runbook.mdc`

- [x] Phase 2: `avatar-extraction` after `customer-research`
- [x] Phase 4: `offer-extraction` after `offers`
- [x] Phase 13: copy-chief chain + `generic-language-killer`
- [x] Phase 18: `conversion-path-builder`
- [x] Phase 19: operator-os + orchestrator
- [x] Phase 22: `performance-diagnosis`

### Task 4: Verify

- [x] `find … -name SKILL.md | wc -l` == 12
- [x] Grep runbook for `advertising-skills/` == 12 path refs
- [x] Spec status → implemented
