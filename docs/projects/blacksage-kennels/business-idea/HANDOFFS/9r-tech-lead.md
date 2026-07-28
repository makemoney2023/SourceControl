---
phase: "9r"
position: tech-lead
reports_to: cto
status: done
verdict_for_manager: ready_to_merge
llm_tier: coding-agent
llm_model: composer-2.5-fast
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Tech Lead → CTO (Phase 9-R Skill-Max)

## Goal (from context packet)

Rebuild home experience to match 12-R cinema (not patch 9d). Photography-first default; licensed GLB pipeline first-class. TDD + verification before claiming done.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `apps/blacksage-kennels/components/home/HomeScrollStage.tsx` | Gate: documentary vs WebGL |
| `apps/blacksage-kennels/components/home/CinemaDocumentaryHome.tsx` | Default home |
| `apps/blacksage-kennels/components/three/HomeScrollCanvas.tsx` | Optional scroll WebGL |
| `apps/blacksage-kennels/lib/home-scroll-story.ts` | Chapter SSOT + Phase 14 copy |
| `apps/blacksage-kennels/lib/home-scroll-story.test.ts` | Story + anti-film-jargon tests |
| `apps/blacksage-kennels/lib/hero-webgl.ts` | Gate helpers |
| `apps/blacksage-kennels/public/images/hero-rottweiler-fallback.svg` | Documentary plate |
| `docs/projects/blacksage-kennels/business-idea/09-build-log.md` | Append Skill-Max delta (if leased) |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | coding-agent |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false |

## Decisions

- `CinemaDocumentaryHome` renders until `isHeroGlbReady()` / HEAD GLB + WebGL gate.
- Missing GLB 404 is expected — not an error path for users.
- Chapter copy aligned to `14-pages/home.md` substance.
- Vitest must stay green before merge.

## Asks for manager (`ask_manager`)

- Peer help needed: none
- Clarification needed: none — GLB is operator optional drop-in

## Risks / blockers

- No licensed GLB in repo → WebGL path inactive.
- Operator contact placeholders remain in constants (launch gate, not eng bug).

## Packs used

| Pack | Decision tied to pack |
|------|------------------------|
| `skills/plugins/superpowers/test-driven-development/` | Tests for story validity + anti-jargon before ship |
| `skills/plugins/superpowers/verification-before-completion/` | Run vitest + typecheck before handoff |
| `skills/plugins/vercel/nextjs/` | App Router + dynamic import for canvas |
| `skills/community/openmontage/.agents/skills/vercel-react-best-practices/` | Dynamic import / no SSR for R3F |
| `skills/community/openmontage/.agents/skills/vercel-composition-patterns/` | Provider/stage composition |
| `skills/community/openmontage/.agents/skills/threejs-fundamentals/` | Optional canvas path only |
| `skills/community/openmontage/.agents/skills/threejs-loaders/` | GLB load contract |
| `skills/community/openmontage/.agents/skills/threejs-lighting/` | Scene lights when WebGL active |
| `skills/community/openmontage/.agents/skills/threejs-materials/` | Subject materials when WebGL active |

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Force WebGL with geometric stand-in as prestige default
