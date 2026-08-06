# Skill pack gap audit — org roles vs available skills

**Date:** 2026-07-27  
**Trigger:** Blacksage Option B hero WebGL shipped without OpenMontage `threejs-*` packs loaded — agents never saw them because packs were not on role Skill tables.  
**Scope:** All `skills/org/positions/*/SKILL.md` Skill packs tables vs `skills/community`, `skills/plugins`, `skills/integrations`, `skills/user`.

## Verdict

Yes — the threejs miss is a **systemic wiring failure**, not a one-off. Several high-value packs exist in the repo but are **never listed** on the seats that own the work. One pack path is **broken** (legal). Pattern: position SKILL.md is the allowlist; if it’s not listed, ICs correctly skip it.

## Severity rubric

| Level | Meaning |
|-------|---------|
| **P0** | Role owns work that requires the pack; pack unused → measurable quality failure (Blacksage 3D) |
| **P1** | Role owns phase that maps to pack; pack unused → weak/incomplete craft |
| **P2** | Nice-to-have / adjacent; optional later |
| **Broken** | Listed path does not exist |

---

## P0 — same failure mode as threejs

### 1. Tech Lead / CTO — 3D + Next performance packs unwired

**Roles:** `tech-lead`, `cto`  
**Owns:** Phase 9 / 9b build  

| Available but unwired | Why it matters |
|----------------------|----------------|
| `openmontage/.agents/skills/threejs-fundamentals` (+ loaders, lighting, materials, textures, animation, interaction, geometry, postprocessing, shaders) | Hero WebGL / R3F |
| `openmontage/.agents/skills/vercel-react-best-practices` | Bundle, Suspense, dynamic import for 3D islands |
| `openmontage/.agents/skills/vercel-composition-patterns` | Compound UI around hero |
| `plugins/vercel/react-best-practices` | Parallel Vercel pack (CTO review) |
| `openmontage/.agents/skills/web-design-guidelines` | Build-time UI QA |
| `openmontage/.agents/skills/tailwind-design-system` | Token/Tailwind implementation |
| `openmontage/.agents/skills/framer-motion` | Motion (non-WebGL) |

**Observed:** Tech-lead 9b only logged TDD + Next.js + shadcn. Geometric stand-in / weak lighting was predictable without threejs packs.

**CTO pack is especially thin** — TDD + verification + system-design only; no Next.js, no react-best-practices, no 3D review criteria.

### 2. Brand Designer — FLUX pack unwired

**Role:** `brand-designer`  
**Owns:** Phases 11, 14 imagery  

| Available but unwired | Why it matters |
|----------------------|----------------|
| `openmontage/.claude/skills/flux-best-practices` | Plane B says FLUX/Imagen; pack never in allowlist |

**Observed:** Brand remap used visual-skills + inference paths; FLUX-specific prompting (no negatives, hex, prose) may have been skipped.

### 3. CMO — CRO packs unwired for Phase 18

**Role:** `cmo` (Phase 18 CRO ownership)  

| Available but unwired | Why it matters |
|----------------------|----------------|
| `marketingskills/cro/` | Conversion rate optimization |
| `marketingskills/ab-testing/` | Experiment design |
| `marketingskills/signup/` | Form/signup patterns |
| `marketingskills/popups/` / `paywalls/` | Optional patterns |

**Observed:** Phase 18 ran with marketing-plan/loops/launch only — no dedicated CRO pack.

---

## Broken path

| Role | Listed | Actual |
|------|--------|--------|
| `legal-counsel` | `.../06-legal/` | **`.../06-legal-compliance/`** |

Legal IC cannot load compliance/contract packs from the listed path.

---

## P1 — high-value orphans by role

| Role | Unwired packs | Notes |
|------|---------------|-------|
| `web-designer` | `web-design-guidelines`, `tailwind-design-system`, `framer-motion` | Has ui-ux-pro-max; missing OpenMontage web stack |
| `creative-director` | Same web guidelines (review); flux overview for brand QA | Manager can review without IC packs today |
| `customer-success-manager` | `awesome.../11-customer-success/*` (onboarding-playbook, churn-analysis, qbr-builder, …) | Only marketingskills onboarding/churn |
| `analytics-engineer` / `head-of-data` | Deeper `10-data-analytics/*`; GA integration skill already on CMO | Analytics seat thin vs family |
| `cto` | `plugins/vercel/nextjs`, `deployments-cicd`, `env-vars` | Manager should review with same stack as IC |
| `video-producer` | OpenMontage root is listed (OK); hyperframes-* optional | Lower urgency for Blacksage (Phase 15 skipped) |

---

## What was already correctly wired

- Copy / advertising Operator OS → `copy-chief`, `paid-media-manager`
- SEO notfair + marketingskills → `seo-manager`
- Hardware text-to-cad → `hardware-engineer`
- Fundraising finance packs → `fundraising-lead`
- Research deep-research → `head-of-research`
- UI-UX pro-max → `web-designer`, `brand-designer`, `creative-director` (partial)

---

## Root cause (process)

1. **Allowlist discipline** on position SKILL.md is correct — but allowlists were never updated when community packs (OpenMontage threejs/FLUX, marketingskills CRO) landed.  
2. **Tracker “Skills completed”** stayed empty → no feedback loop that packs weren’t loaded.  
3. **No CI/script** validating listed pack paths exist or that domain packs map to owning phases.

---

## Remediation (this session)

1. ~~Wire P0 packs into `tech-lead`, `cto`, `brand-designer`, `cmo`, `web-designer`.~~ **Done**  
2. ~~Fix `legal-counsel` path → `06-legal-compliance/`.~~ **Done**  
3. ~~Wire `customer-success-manager` → `11-customer-success/` family.~~ **Done** (+ creative-director review packs)  
4. ~~`./scripts/sync-org-agents.sh` after SKILL.md edits.~~ **Done**  
5. ~~Re-run Blacksage hero 3D with threejs packs loaded.~~ **Done** — Phase 9-c (`HANDOFFS/9c-tech-lead.md`)  
6. Follow-up (not this session): path-existence check in sync script; RUNBOOK “skills loaded” checklist.

## Decision log stub

- **D-skill-1:** Position Skill packs tables are the source of truth for which community packs agents may load. Expanding the table is the fix; agents should not freestyle outside the list without orchestrator expansion.

---

## Addendum — full inventory audit (subagent)

Deep pass across all 36 positions ([Audit org role skill pack gaps](9a642e1a-6e12-4f1c-ada5-2305f54389b7)): ~58 HIGH gaps, broken legal path, malformed `openmontage/` parent (no `SKILL.md`).

**Follow-up wiring (same session):**
- Added `skills/community/openmontage/SKILL.md` entry pack (parent ref valid).
- Explicit HyperFrames / remotion packs on video-producer + paid-media-manager.
- head-of-research → parallel + firecrawl craft packs.
- brand-designer → flux-image, bfl-api, visual-style.
- tech-lead → verification-before-completion.
- web-designer → shadcn, figma-design-to-code, visual-skills/image.
- analytics-engineer → ab-testing + supabase-postgres-best-practices.
- seo-manager → schema + broken-link-checker.
- creative-director / cmo residual HIGH packs.

**Canonical eng threejs path:** `.agents/skills/threejs-*` (also duplicated under `.claude/skills/` — prefer agents).

**Still open (structural / MED):** OpenMontage curated role manifests; import sales-enablement user skills into repo; sync-script path-existence CI.
