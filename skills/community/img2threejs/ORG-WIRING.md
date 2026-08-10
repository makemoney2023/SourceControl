# Org wiring (ClaudeSkills)

This folder is the vendored [img2threejs](https://github.com/img2threejs/img2threejs) skill for the digital organization.

**Spec:** `docs/superpowers/specs/2026-08-10-img2threejs-org-wiring-design.md`

| Seat | Use |
|------|-----|
| `web-designer` | Generate hero product 3D (Phase 12) when a product reference exists |
| `tech-lead` | Consume `design-system/<venture>/3d/` into `apps/<venture>/` |
| `creative-director` | Review hero 3D scope only |

**SSOT output:** `design-system/<venture>/3d/` (spec JSON + TypeScript factory + `review/` + README).

Keep upstream `SKILL.md` as the craft entrypoint. Re-vendor manually when updating from upstream.
