---
phase: "9"
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

# Handoff — Phase 9 MVP Rebuild → CTO

## Goal (from context packet)

Rebuild `apps/blacksage-kennels` as a trust-first multi-page Next.js App Router site. No WebGL/R3F. Routes: `/`, `/dogs`, `/health`, `/about`, `/inquire`. 301 `/apply` → `/inquire`. TDD. shadcn/ui. Implement approved copy from `14-pages/*.md`.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `apps/blacksage-kennels/app/layout.tsx` | Light editorial layout; shared header/footer |
| `apps/blacksage-kennels/app/page.tsx` | Home — proof band, positioning, teasers, tertiary inquire |
| `apps/blacksage-kennels/app/dogs/page.tsx` | Dogs empty state (Tier 1) |
| `apps/blacksage-kennels/app/health/page.tsx` | Health & education with anchor sections |
| `apps/blacksage-kennels/app/about/page.tsx` | About — principles, operator gap, contact placeholder |
| `apps/blacksage-kennels/app/inquire/page.tsx` | Inquire form shell + Package A/B mode |
| `apps/blacksage-kennels/app/globals.css` | Editorial light tokens (`#FAFAF8` paper) |
| `apps/blacksage-kennels/next.config.ts` | Permanent redirect `/apply` → `/inquire` |
| `apps/blacksage-kennels/package.json` | Removed `three`, `@react-three/*`, `framer-motion`, `@types/three`; added `@radix-ui/react-checkbox` |
| `apps/blacksage-kennels/lib/nav.ts` | Locked nav order (5 routes) |
| `apps/blacksage-kennels/lib/content/page-meta.ts` | SEO titles, descriptions, H1 per route |
| `apps/blacksage-kennels/lib/site-config.ts` | Package A/B copy + `getInquirePackage()` |
| `apps/blacksage-kennels/lib/constants.ts` | Placeholders, proof band, health categories, principles |
| `apps/blacksage-kennels/lib/validations/inquire-schema.ts` | Zod Package A/B schemas |
| `apps/blacksage-kennels/components/layout/*` | SiteHeader, SiteFooter, SkipLink (light theme) |
| `apps/blacksage-kennels/components/proof/ProofSummaryBand.tsx` | Home 4-cell proof pathway |
| `apps/blacksage-kennels/components/content/PageHero.tsx` | Shared page hero |
| `apps/blacksage-kennels/components/inquire/*` | InquiryForm, PackageModeHeader, InquiryConfirmation |
| `apps/blacksage-kennels/components/ui/checkbox.tsx` | shadcn checkbox for consent fields |
| `apps/blacksage-kennels/lib/*.test.ts` | Nav, page-meta, redirect tests |
| `apps/blacksage-kennels/lib/validations/inquire-schema.test.ts` | Form validation smoke tests |

**Deleted (v1 rebuild-not-patch):** `components/three/*`, scroll sections, `app/apply/page.tsx`, `apply-schema*`, motion/scroll libs.

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | coding-agent |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | no |

## Decisions

- **Package A default:** `getInquirePackage()` reads `NEXT_PUBLIC_INQUIRE_PACKAGE`; defaults to `A` when unset or invalid. Set `B` for waitlist field set + deposit acknowledgment checkbox.
- **Placeholder strategy:** Bracket tokens preserved (`[LOCATION]`, `[CONTACT_EMAIL]`, `[DOG_COUNT]`, `[HEALTH_TESTS]`, `[OPERATOR_STORY]`, `[CONTACT]`, `[RESPONSE_EXPECTATION]`) — no invented prices, certs, or litter claims.
- **Inquire submission:** Mailto handoff (same pattern as v1 apply form) until Q7 API route is wired by CTO/backend.
- **Dogs page:** Tier 1 empty state only; no `/dogs/[slug]` until operator inventory verified.
- **CTA language:** All conversion copy uses **Begin your inquiry** — never Buy / Apply now.
- **Theme:** Editorial light paper `#FAFAF8` default; charcoal dark band in footer only.

## Test results

```
npm test
 Test Files  4 passed (4)
      Tests  13 passed (13)

npm run build
 ✓ Compiled successfully
 ✓ Generating static pages (9/9)
 Routes: /, /about, /dogs, /health, /inquire (all static)
 First Load JS (non-inquire pages): 127 kB — no Three.js/R3F in bundle
```

## Acceptance checklist

- [x] All Must routes render with approved copy structure
- [x] No R3F/Three.js dependency in package.json / imports
- [x] `/apply` → `/inquire` redirect (next.config permanent)
- [x] Proof band + inquire CTA language
- [x] Tests pass for nav/routes/form smoke (13/13)
- [x] Build passes

## Asks for manager (`ask_manager`)

- Peer help needed: none
- Clarification needed: none — Q7 inquire API route deferred; mailto acceptable for MVP per prior pattern

## Risks / blockers

- **Mailto-only submit** may fail silently on some mobile clients — CTO should prioritize `app/api/inquire/route.ts` when Q7 destination is confirmed.
- **README.md** still references `/apply` — CTO may update in build-log pass (outside IC write lease).

## Packs used

- `skills/plugins/superpowers/test-driven-development/` — tests written for nav, routes, redirect, schema before implementation
- `skills/plugins/vercel/nextjs/` — App Router, static pages, redirects
- `skills/plugins/vercel/shadcn/` — form, input, select, checkbox, button primitives

## Do not

- Phase 9 **not** marked complete in RUNBOOK-TRACKER (orchestrator + C-suite gate)
- No `09-build-log.md` or manager brief written (CTO owns post-merge)
