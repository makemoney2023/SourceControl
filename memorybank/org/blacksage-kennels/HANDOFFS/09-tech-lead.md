---
phase: "9"
position: tech-lead
reports_to: cto
status: done
verdict_for_manager: ready_to_merge
llm_tier: coding-agent
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Phase 9 MVP Build → CTO

## Goal (from context packet)

Build Next.js App Router MVP at `apps/blacksage-kennels` per approved design + copy. Follow TDD strictly. Deliver working landing (`/`), inquiry form (`/apply`), scroll-driven R3F scene, shadcn/ui dark theme with amber primary, Vitest coverage for apply-schema, passing build. Do **not** mark phase complete.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `apps/blacksage-kennels/` | Full Next.js 15 App Router MVP (project scaffold, deps, config) |
| `apps/blacksage-kennels/lib/validations/apply-schema.ts` | Zod schema + error copy + HOW_HEARD_OPTIONS |
| `apps/blacksage-kennels/lib/validations/apply-schema.test.ts` | 8 unit tests (TDD — written before schema) |
| `apps/blacksage-kennels/lib/scroll-timeline.ts` | Scroll progress → camera keyframes |
| `apps/blacksage-kennels/lib/constants.ts` | SECTIONS nav + placeholder tokens |
| `apps/blacksage-kennels/lib/motion.ts` | Easing + reduced-motion helper |
| `apps/blacksage-kennels/lib/utils.ts` | cn() utility |
| `apps/blacksage-kennels/app/layout.tsx` | Cormorant Garamond + Source Sans 3 fonts, metadata |
| `apps/blacksage-kennels/app/globals.css` | Brand CSS tokens from 11-brand-system.md |
| `apps/blacksage-kennels/app/page.tsx` | Landing with dynamic R3F canvas (ssr:false) |
| `apps/blacksage-kennels/app/apply/page.tsx` | Apply page with locked copy |
| `apps/blacksage-kennels/components/**` | Layout, sections, 3D, form, shadcn/ui, placeholders |
| `apps/blacksage-kennels/hooks/usePrefersReducedMotion.ts` | Reduced-motion detection |
| `apps/blacksage-kennels/vitest.config.ts` | Vitest + `@/` alias |
| `apps/blacksage-kennels/README.md` | Run instructions |
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/09-tech-lead.md` | This handoff |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | coding-agent |
| llm_model | composer-2.5 |
| generation_profile | none |
| generation_used | none |
| fallback_applied | no |

## TDD evidence

1. **RED:** `apply-schema.test.ts` written first; `npm test` failed with `Cannot find module './apply-schema'`.
2. **GREEN:** Minimal `apply-schema.ts` implemented; all 8 tests pass.
3. **Verify:** Re-run after build fixes — still 8/8 pass.

## Test results

```
> vitest run

Test Files  1 passed (1)
     Tests  8 passed (8)
  Duration  ~90ms
```

Coverage: required fields (name, location, howHeard), email validation, textarea min 20 chars (priorExperience, householdDescription), optional phone, valid payload acceptance.

## Build results

```
> next build --turbopack

Exit code: 0

Route (app)
┌ ○ /
└ ○ /apply
```

Static prerender for both routes. No type or lint errors blocking build.

## Implementation summary

### Project setup
- Next.js 15.5.22 + TypeScript + Tailwind v4 + App Router
- shadcn/ui-style components: Button, Form, Input, Textarea, Select, Label
- Dark theme default; amber primary via CSS tokens
- Fonts: Cormorant Garamond (display) + Source Sans 3 (body/UI)

### Routes
- **`/`** — Full-bleed hero wordmark (no cards in viewport 1), scroll-driven R3F canvas, sections Hero → Heritage → Structure → Temperament → Trust → Apply CTA → Footer; PhotoPlaceholder in Structure + Temperament only; Framer Motion scroll reveals; sticky SiteHeader after 80px
- **`/apply`** — shadcn Form + react-hook-form + zod; blur + submit validation; ApplyConfirmation success state; mailto stub to `[CONTACT_EMAIL]`

### 3D
- SceneCanvas (dynamic import, ssr:false), ScrollScene, SilhouetteMesh, LightingRig
- `lib/scroll-timeline.ts` drives camera from scroll progress
- `prefers-reduced-motion`: static radial-gradient poster, camera frozen at arrival frame
- `dpr={[1, 1.5]}` on Canvas

## Decisions

- **Form submit:** mailto stub with encoded body (no backend API in MVP scope); opens client mail client then shows confirmation.
- **Zod v4:** `z.enum(..., { message })` instead of deprecated `required_error`.
- **R3F scope:** Simplified silhouette + architecture planes (not full kennel tour) per brand §7 atmospheric stage guidance.
- **Tailwind v4:** Brand colors via `@theme inline` + CSS custom properties (no separate tailwind.config.js).

## Known gaps

| Gap | Notes |
|-----|-------|
| Operator placeholders | `[CONTACT_EMAIL]`, `[LOCATION]`, `[CONTACT_PHONE]`, `[HEALTH_TESTS]` in `lib/constants.ts` — replace before launch |
| Form backend | mailto only; no server action / API / CRM integration |
| Real photography | PhotoPlaceholder components only; no operator assets |
| Logo SVG | Wordmark typography only; monogram/favicon not generated |
| Mobile nav | Full nav hidden below md; mobile shows Apply link only (no sheet menu) |
| 09-build-log.md | Not updated (outside write_lease) |
| ESLint warnings | None blocking; clean build |

## Asks for manager (`ask_manager`)

- Peer help needed: none
- Clarification needed: Confirm mailto submit acceptable for MVP gate vs. stub API route | none blocking

## Risks / blockers

- mailto flow may not fire in all browsers/environments without configured mail client — acceptable for MVP stub per spec.
- R3F bundle adds ~48 kB to landing route First Load JS — within cinematic MVP scope; monitor LCP on real devices.

## Packs used

- `skills/plugins/superpowers/test-driven-development/` — apply-schema TDD cycle
- Phase 14 copy: `14-pages/homepage.md`, `14-pages/apply.md`
- Brand: `11-brand-system.md`, `13-copy-foundation.md`
- Design IA: `12-web-design.md`

## Do not

- Phase **not** marked complete (orchestrator + C-suite gate pending)
- No writes outside write_lease
- No spawn of other positions
