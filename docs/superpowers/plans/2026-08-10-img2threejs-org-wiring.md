# img2threejs Org Wiring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (or subagent-driven-development). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Vendor img2threejs and wire it into Web Designer / Tech Lead / Creative Director so product-led Phase 12 ventures produce a code-as-3D SSOT under `design-system/<venture>/3d/`.

**Architecture:** Position skill-pack wiring only. Upstream skill lives at `skills/community/img2threejs/`. Web Designer generates; Tech Lead consumes; Creative Director reviews. No TOOL-REGISTRY entry.

**Tech Stack:** Vendored Apache-2.0 skill (Python 3.10+ stdlib forge), Markdown position skills, Vitest contract tests in org-command-center.

**Spec:** `docs/superpowers/specs/2026-08-10-img2threejs-org-wiring-design.md`

## Global Constraints

- Org-wide (all ventures), not Income Stack–only
- Artifact SSOT: `design-system/<venture>/3d/`
- `--strict-quality` required for production candidates
- No new IC seat; no integrations wrapper; no mandatory GLB
- TDD for org wiring tests before position SKILL edits that those tests assert
- Do not commit unless the user explicitly asks (user git rule overrides plan commit steps)

---

## File map

| Path | Responsibility |
|------|----------------|
| `skills/community/img2threejs/` | Vendored upstream skill + forge |
| `skills/org/positions/web-designer/SKILL.md` | Pack + Phase 12 playbook for generation |
| `skills/org/positions/tech-lead/SKILL.md` | Pack for consume path |
| `skills/org/positions/creative-director/SKILL.md` | Pack for review-only |
| `skills/org/packs/production-artifacts/SKILL.md` | Canonical Layer B path for `3d/` |
| `tools/org-command-center/src/lib/img2threejs-wiring.test.ts` | Contract tests: pack lists + `3d/` layout |
| `tools/org-command-center/src/lib/designSystem3d.ts` | Pure helpers validating `3d/` layout |
| Position CHANGELOGs | History entries |

---

### Task 1: Contract helpers + failing tests

**Files:**
- Create: `tools/org-command-center/src/lib/designSystem3d.ts`
- Create: `tools/org-command-center/src/lib/img2threejs-wiring.test.ts`
- Test: same test file

**Interfaces:**
- Produces: `REQUIRED_3D_FILES`, `validateDesignSystem3dLayout(dir: string): { ok: boolean; missing: string[] }`, `seatSkillMentionsPack(skillMd: string, packPath: string): boolean`

- [x] **Step 1: Write failing tests**
- [x] **Step 2: Run tests — expect FAIL** (missing pack mentions / helper)
- [x] **Step 3: Implement `designSystem3d.ts` minimal helpers**
- [x] **Step 4: Run tests — layout tests PASS; pack-list tests still FAIL until Task 3**

---

### Task 2: Vendor img2threejs

**Files:**
- Create: `skills/community/img2threejs/` (git clone sparse or full)

- [x] **Step 1: Clone upstream into `skills/community/img2threejs`**
- [x] **Step 2: Verify `SKILL.md` and `forge/` exist; Python probe smoke optional**
- [x] **Step 3: Add thin `ORG-WIRING.md` note pointing to org spec + seats** (keep upstream SKILL.md intact)

---

### Task 3: Wire position skills + production-artifacts

**Files:**
- Modify: `skills/org/positions/web-designer/SKILL.md`
- Modify: `skills/org/positions/tech-lead/SKILL.md`
- Modify: `skills/org/positions/creative-director/SKILL.md`
- Modify: `skills/org/packs/production-artifacts/SKILL.md`
- Modify: position CHANGELOGs

- [x] **Step 1: Add pack rows + Phase 12 procedure steps (web-designer)**
- [x] **Step 2: Add consume pack row (tech-lead)**
- [x] **Step 3: Add review pack row (creative-director)**
- [x] **Step 4: Add Layer B path row for `design-system/<venture>/3d/`
- [x] **Step 5: Re-run contract tests — all PASS**

---

### Task 4: Graphify + spec status

- [x] **Step 1: Update spec status to Approved / implemented wiring**
- [x] **Step 2: `graphify update .` from repo root**
- [x] **Step 3: Report completion to user (no commit unless asked)**
