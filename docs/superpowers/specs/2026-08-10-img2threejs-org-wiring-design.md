# img2threejs Org Wiring — Design Spec

**Date:** 2026-08-10  
**Status:** Approved — wiring implemented (2026-08-10)  
**Scope:** ClaudeSkills-wide digital organization (all ventures)  
**Upstream:** [img2threejs/img2threejs](https://github.com/img2threejs/img2threejs) (Apache-2.0)

## Goal

Wire img2threejs into the org position system so product-led ventures get a quality-gated, procedural Three.js hero candidate as a Phase 12 design-system artifact — not an Income Stack–only experiment.

## Locked decisions

| Topic | Choice |
|-------|--------|
| Breadth | Org-wide ClaudeSkills / digital org |
| Ownership | Web Designer generates; Tech Lead wires into app |
| Install | Vendor at `skills/community/img2threejs/` |
| When to run | Default when a product reference exists (product-led) |
| Artifact home | `design-system/<venture>/3d/` (Layer B SSOT) |
| Wiring shape | Position skill-pack wiring only (no TOOL-REGISTRY / integration seat / new IC) |
| Artifact form | Code-as-3D (spec JSON + TypeScript factory + review evidence); GLB export not required |

## Non-goals

- New “3D Designer” IC seat
- `skills/integrations/img2threejs/` or TOOL-REGISTRY `tool_id` for the core path
- MCP server per seat
- Income Stack–only or venture-app-only artifact storage
- Claiming photoreal likeness from a single reference image
- Mandatory GLB/mesh export in v1

## Ownership

| Seat | Responsibility |
|------|----------------|
| **Web Designer** | Invoke img2threejs in Phase 12 when a product reference exists; write SSOT under `design-system/<venture>/3d/`; index in `12-web-design.md` |
| **Tech Lead** | Consume factory into `apps/<venture>/` WebGL island under Phase 9 lease, using existing threejs-* packs |
| **Creative Director** | Review hero 3D scope/coherence (no generation) |
| **CTO** | Optional architecture review via existing threejs packs (unchanged) |

## Packaging & install

1. Vendor upstream into `skills/community/img2threejs/` (skill + `forge/` scripts + grimoire docs as needed).
2. Add pack entries:
   - `skills/org/positions/web-designer/SKILL.md` — generate / gate hero product 3D
   - `skills/org/positions/tech-lead/SKILL.md` — consume `design-system/<venture>/3d/` factory
   - `skills/org/positions/creative-director/SKILL.md` — review-only
3. Do **not** add a TOOL-REGISTRY entry for core (stdlib Python 3.10+, no API keys).
4. Optional reference-fidelity tooling (SAM2, MediaPipe, etc.) remains opt-in and documented in the vendored pack; never silently required for Phase 12 done.

## Architecture

```text
Brand / product reference (Phase 11 assets or leased stills)
        │
        ▼
Web Designer (Phase 12)
  · suitability check
  · img2threejs: assessment → ObjectSculptSpec → pass-gated factory
  · --strict-quality for production candidates
        │
        ▼
design-system/<venture>/3d/          ← SSOT Layer B
  object-sculpt-spec.json
  createObjectModel.ts (or named factory)
  review/ (comparison sheets + pass log)
  README.md (mount contract for eng)
        │
        ├─► 12-web-design.md (hero island + DS index)
        │
        ▼
Tech Lead (Phase 9)
  · import factory into apps/<venture>/ WebGL island
  · threejs-fundamentals / materials / lighting / interaction packs
```

### What “3D artifact” means

When generation runs successfully, Phase 12 produces a **real 3D deliverable**:

1. **`object-sculpt-spec.json`** — component tree, materials, sockets, review history  
2. **TypeScript factory** — `create*Model(spec, options)` → `THREE.Group` with `userData.sculptRuntime` (pivots, sockets, colliders)  
3. **Review evidence** — reference-vs-render sheets and pass decisions  

This is **reconstruction-by-code**, not photogrammetry or a downloaded mesh pack. Animation-ready hierarchy lives on the factory runtime, not a separate GLB (unless a later spec adds export).

## Product reference (trigger)

A **product reference** is a clear image of the venture’s primary hard-surface offer (physical product, device, pack, hero object) from Phase 11 brand assets or a leased still. Mood boards, lifestyle scenes without a distinct object, and typography-only brands do **not** trigger generation — use skip.

## Phase 12 workflow

1. Confirm packet phase `12` and lease covers `12-web-design.md` + `design-system/<venture>/`.
2. Read `11-brand-system.md` and available product references.
3. **If a product reference exists:** run img2threejs with `--strict-quality`; write outputs under `design-system/<venture>/3d/`.
4. **Else:** set handoff `production_status: skipped` with reason; continue IA/DS without inventing geometry.
5. Update `12-web-design.md` with hero 3D island constraints and DS index entry for `3d/`.
6. Write `HANDOFFS/12-web-designer.md` with `production_paths`, model audit; do **not** mark phase ✅.

## Data contracts

### `design-system/<venture>/3d/` layout

| Path | Required | Purpose |
|------|----------|---------|
| `object-sculpt-spec.json` | yes (when not skipped) | Authoritative sculpt spec |
| `createObjectModel.ts` or venture-named factory | yes (when not skipped) | Procedural Three.js factory |
| `review/` | yes (when not skipped) | Comparison sheets + pass log |
| `README.md` | yes (when not skipped) | Mount contract: entry export, peer deps (`three`), island constraints |

### Handoff fields (Web Designer)

When 3D applies or is skipped:

- `production_status`: `complete` \| `skipped` \| `blocked`
- `production_paths`: include `design-system/<venture>/3d/` when complete
- `design_brief_path` / existing Phase 12 fields unchanged
- Skip/block reason when not complete
- Model audit fields (`llm_tier`, `llm_model`, `generation_*`, `fallback_applied`)

## Error handling

| Condition | Action |
|-----------|--------|
| No product reference | Skip with reason; continue Phase 12 |
| Unsuitable image | Skip or `ask_manager`; no shallow factory |
| Strict-quality / forge `BLOCKED` | Refine spec/code or escalate; do not ship |
| Low-confidence / unseen faces | Record in review log; no photoreal claim |
| Python 3.10+ missing | `tool_status: unavailable`; note threejs-geometry stand-in for Tech Lead |

## Testing (org wiring)

TDD targets our wiring, not a full retest of upstream forge:

1. Contract tests for `design-system/<venture>/3d/` layout + README required fields (fixture venture or temp dir).
2. Assertions that web-designer / tech-lead / creative-director `SKILL.md` pack tables include `skills/community/img2threejs/`.
3. Optional later: CI smoke of `forge` probe on a checked-in fixture image (not required for v1 wiring).

## Done criteria

### Phase 12 (when product reference exists)

- [ ] img2threejs run with `--strict-quality`
- [ ] `design-system/<venture>/3d/` contains spec + factory + review + README
- [ ] `12-web-design.md` indexes the 3D island
- [ ] Handoff lists `production_paths` + model audit
- [ ] Phase not marked ✅ by IC

### Phase 12 (no product reference)

- [ ] Honest skip on handoff with reason
- [ ] IA/DS work otherwise complete per existing playbook

### Phase 9 (Tech Lead)

- [ ] Factory consumed into leased `apps/<venture>/` path when 3D SSOT present
- [ ] Island respects threejs / a11y / no scroll-jack constraints from existing packs

## Implementation touchpoints (for plan)

1. Vendor `img2threejs` → `skills/community/img2threejs/`
2. Update position `SKILL.md` files (web-designer, tech-lead, creative-director) + Phase 12 playbook steps
3. Document `design-system/<venture>/3d/` convention (web-designer playbook + optional short note in production-artifacts pack)
4. Add contract tests for layout + pack-list wiring
5. Update `graphify` after code/doc changes

## Risks & honesty

- Single-image reconstruction cannot guarantee hidden geometry; pipeline must report confidence and approximate openly.
- Hard-surface objects are the strength; characters are stylized — product heroes are the default use case.
- Upstream updates require re-vendor (acceptable for Approach 1).

## Approval

- Design sections 1–4 approved in brainstorming (2026-08-10).
- Spec approved; implementation plan executed (vendor + seat wiring + contract tests).
