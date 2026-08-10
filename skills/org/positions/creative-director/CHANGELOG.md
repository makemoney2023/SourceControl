# Changelog — creative-director

## 2026-08-10 — img2threejs review pack

**Why:** Phase 12 hero 3D candidates need CD review without generation ownership.

**Changed**
- Skill packs: Added `skills/community/img2threejs/` (review-only; Web Designer generates)

**Spec:** `docs/superpowers/specs/2026-08-10-img2threejs-org-wiring-design.md`

## 2026-08-05 — Figma MCP operational wiring

**Why:** Figma was primary in Integrations but Skill packs / HEARTBEAT / agent did not force-load the adapter or plugin skills.

**Changed**
- Skill packs: Added `figma-use`, `figma-generate-design`, `figma-design-to-code`, `figma-generate-library`
- Phase 11/12: Must-read + procedure load `skills/integrations/figma/` when Figma in scope
- HEARTBEAT / agents / templates: Tool gate before Figma MCP

## 2026-08-05 — May-spawn per phase + playbooks

**Why:** Skill used full org-tree Delegates for every phase; no per-phase May-spawn; no playbooks for shippable 11/12/15; integrations drift vs TOOL-REGISTRY.

**Changed**
- Spawn / May spawn: Per-phase table matching ORG-REGISTRY (11 → brand-designer; 12 → web-designer + brand-designer; 15 → video-producer); Delegates vs May-spawn split
- Phase playbooks: 11, 12, 15 with verbatim scorecards, artifact shapes, production + verifier gates
- Scorecards / done criteria: Shippable production_status reject; photoreal_qa; design brief before Layer B; verifier via orchestrator
- HEARTBEAT / packs / integrations: HEARTBEAT + agent aligned; added openmontage + COLLABORATION; fixed integrations (`ai-toolkit-local` primary)

**Checklist:** Role Upgrade Checklist A–G passed
