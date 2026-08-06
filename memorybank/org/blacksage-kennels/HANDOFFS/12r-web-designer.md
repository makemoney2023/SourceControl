---
phase: "12r"
position: web-designer
reports_to: creative-director
status: done
verdict_for_manager: ready_to_merge
llm_tier: creative-language
llm_model: composer-2.5-fast
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Web Designer → Creative Director (Phase 12-R Skill-Max)

## Goal (from context packet)

Full surface redesign for Hybrid + SD4-C home under Territory B. ui-ux-pro-max mandatory. Replace Option C geometric/overlay craft with cinema documentary IA that keeps mid-path proof band and inquire-after-proof.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/12-web-design.md` | Skill-Max ACTIVE SSOT (header freeze) |
| `apps/blacksage-kennels/design-system/blacksage-kennels/pages/home.md` | Home page design notes |
| `apps/blacksage-kennels/components/home/CinemaDocumentaryHome.tsx` | Default home experience |
| `apps/blacksage-kennels/components/home/HomeScrollStage.tsx` | GLB/WebGL gate → documentary fallback |
| `apps/blacksage-kennels/components/layout/SiteHeader.tsx` | Film-credit nav (cinema chrome) |
| `apps/blacksage-kennels/components/layout/SiteFooter.tsx` | Matching dark footer |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | creative-language |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false |

## Decisions

- Default home = photography documentary chapters (not box-dog WebGL).
- WebGL ScrollControls only when licensed GLB + gate pass.
- Proof band remains HTML mid-path (Hybrid hard lock).
- No purple/cream; Fraunces/Manrope per 11-R.
- Chapter chrome uses program kickers — not “Scene · id” film meta alone.

## Asks for manager (`ask_manager`)

- Peer help needed: `copy-chief` for chapter body alignment to Phase 14 (done as 14r)
- Clarification needed: none

## Risks / blockers

- Silhouette plate until Q6 photography.
- Secondary pages may still need visual parity pass vs home cinema density.

## Packs used

| Pack | Decision tied to pack |
|------|------------------------|
| `skills/community/ui-ux-pro-max-skill/ui-ux-pro-max/` | Persist MASTER + home design-system |
| `skills/community/ui-ux-pro-max-skill/design/` | Layout hierarchy / anti-dashboard hero |
| `skills/community/ui-ux-pro-max-skill/ui-styling/` | Token application |
| `skills/community/openmontage/.agents/skills/web-design-guidelines/` | Web QA (contrast, focus, reduced motion) |
| `skills/community/openmontage/.agents/skills/tailwind-design-system/` | Token → Tailwind mapping |
| `skills/community/openmontage/.agents/skills/threejs-fundamentals/` | WebGL optional; must not be prestige without GLB |
| `skills/community/openmontage/.agents/skills/site-architecture/` | Hybrid multi-page + home chapters |
| `skills/community/openmontage/.agents/skills/frontend-design/` | Composition / motion restraint |

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Ship geometric stand-in as the “amazing” hero
