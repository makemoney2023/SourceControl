---
name: production-artifacts
description: >-
  Craft → Production → Wire contract for shippable org phases. Use when producing
  or reviewing HTML email, app routes, brand stills, video finals, social assets,
  paid creatives, design-system files, or any Layer B artifact beyond business-idea
  markdown. Required reading for lifecycle-marketer, tech-lead, brand-designer,
  web-designer, video-producer, paid-media-manager, content-strategist,
  hardware-engineer, verifier, and their managers (cmo, creative-director, cto).
---

# Production Artifacts

Markdown under `docs/projects/<active>/business-idea/` is **Layer A craft** (SSOT for strategy and copy). Shippable phases also need **Layer B production** files (HTML, code, images, video) before C-suite may treat the work as ready to launch. **Wire** (ESP, ad accounts, DNS) may stay with the operator but must be named — never silently assumed.

## Hard rules

1. **Craft ≠ shipped.** Non-empty `.md` alone does not satisfy production for shippable phases.
2. **Lease production paths** in the IC `write_lease`. Write only leased paths.
3. **`production_status` required** on handoffs for phases in the matrix below: `complete` | `skipped` | `blocked`.
4. **Skip only with reason** — document why Layer B is deferred (budget, operator waiver, Tier-1 capacity). Manager brief must repeat the skip.
5. **Ask peers for production help** via `ask_manager` (e.g. lifecycle → brand for email headers). Do not spawn peers.
6. **Teach via skill packs** listed in the matrix — read those packs before writing Layer B files.
7. **Wire is explicit** — handoff lists `wire_owner` (`operator` | seat slug | `none`) and what remains after approve.
8. **Figma ≠ Layer B.** Editing in Figma alone is not production. Export PNG/SVG/PDF (or tokens/components) into the leased path before `production_status: complete`.
9. **Verifier gate.** Shippable phases require `HANDOFFS/<phase>-verifier.md` with `verdict: pass` before C-suite may approve (see `positions/verifier/`).

## Three layers

| Layer | Meaning | Typical paths |
|-------|---------|----------------|
| **Craft** | Strategy, copy, journeys, specs | `business-idea/**/*.md` |
| **Production** | Importable / deployable / renderable files | `.html`, `apps/…`, images, video finals, design tokens |
| **Wire** | Live systems | ESP automations, ad accounts, DNS, analytics property |

Flow: **Craft → Production → Wire**

## Canonical Layer B paths

`<venture>` = active project slug from `projects/registry.json`. Paths under `docs/projects/<active>/business-idea/` unless noted.

| Asset class | Canonical path | Naming |
|-------------|----------------|--------|
| App / MVP | `apps/<venture>/` | Next app conventions |
| Design system | `design-system/<venture>/` (repo root — SSOT; do not treat `apps/<venture>/design-system/` as SSOT) | tokens, components, docs |
| Brand stills | `11-brand/assets/` | `<slug>-<w>x<h>.{png,webp,jpg}` |
| Page imagery | `14-pages/assets/` | `<page>-<slug>.{png,webp}` |
| Video finals | `15-media/openmontage/` | `<slug>-final.{mp4,webm}` |
| Email HTML | `17-channels/email/html/` | `<journey>-<n>-<slug>.html` |
| Email headers | `17-channels/email/assets/` | `<journey>-header.{png,jpg}` |
| Social stills | `17-channels/social/assets/` | `<platform>-<slug>.{png,webp}` |
| Paid creatives | `19-paid/creatives/` | `<platform>-<size>-<slug>.{png,jpg}` |
| Paid video | `19-paid/openmontage/` | `<slug>-ad-final.{mp4,webm}` |
| Hardware / CAD | `09b-hardware/` | export formats per CAD pack |

## Artifact classes (what bound skills must leave behind)

| Artifact class | What “done” looks like | Typical packs | Typical paths |
|----------------|------------------------|---------------|---------------|
| **Craft deliverable (Layer A)** | Non-empty markdown / brief under `business-idea/` named in seat Outputs | BA, strategy, sales research, CS QBR, SEO briefs, most marketingskills | `05-prd.md`, `07-sales-playbook.md`, `17-channels/**/*.md`, `HANDOFFS/…` |
| **Production deliverable (Layer B)** | Importable / deployable / renderable file leased in `write_lease` | email-design, landing-page-design, OpenMontage/Remotion, Next/shadcn, brand stills, CAD exports | Canonical paths above |
| **Tooling / method** | Improves how the seat works; deliverable is still Craft or Production | TDD, context-engineering, writing-plans, figma-use (as editor) | Same as the phase matrix — tooling alone is never “shipped” |

### Rules for agents

1. **Every pack used in a turn must contribute to at least one artifact** listed in the handoff **Artifacts written** table (or an explicit `ask_manager` for a peer who will write it).
2. **Craft packs → Layer A files.** Do not claim production complete from craft alone on shippable phases.
3. **Production packs → Layer B files** when the phase matrix requires them (or `production_status: skipped` with reason).
4. **Tooling packs** must still leave a Craft or Production artifact for the phase.
5. If a pack’s own `SKILL.md` defines Outputs, map them into org leased paths (never invent paths outside `write_lease`).

## Phase matrix (shippable)

| Phase | Craft (Layer A) | Production owner | Production paths (Layer B) | Teach with | Wire (default) |
|-------|-----------------|------------------|----------------------------|------------|----------------|
| **9** | `09-build-log.md`, `05-prd.md`, `14-pages/` | `tech-lead` | `apps/<venture>/` | Next/shadcn/vercel packs | Vercel/DNS — operator or cto |
| **9B** | `09b-hardware-build.md` | `hardware-engineer` | `09b-hardware/` | text-to-cad + production-artifacts | Fabrication — operator |
| **11** | `11-brand-system.md` | `brand-designer` | `11-brand/assets/` | visual-skills + fal/inference + **photoreal-stills** | Brand kit — operator |
| **12** | `12-web-design.md` | `web-designer` (+ brand) | `design-system/<venture>/`; UI stills when leased | shadcn, figma-design-to-code, brand-stills | Consumed by Phase 9 — eng |
| **14** | `14-pages/*.md` | Craft: copy/seo/content; **Imagery:** `brand-designer`; **HTML/app:** `tech-lead` (P9) | `14-pages/assets/`; app via `apps/<venture>/` | copy + visual-skills; eng packs | Deploy — operator/cto |
| **15** | `15-media/` scripts | `video-producer` | `15-media/openmontage/` (or skip) | OpenMontage + `hero-video`; doctor green or skip | Upload — operator |
| **17** | `17-channels/email/*.md`, `social/*.md` | Email HTML: `lifecycle-marketer`; Headers/social: `brand-designer` via ask | `17-channels/email/html/*.html`; `email/assets/`; `social/assets/` | emails + **email-design**; brand-stills | ESP — **operator** |
| **18** | `18-conversion.md` | Spec; forms → `tech-lead` | `apps/<venture>/` when leased | cro + eng | Analytics — head-of-data / operator |
| **19** | `19-paid.md` | Stills: `paid-media-manager` (+ brand); Video: `video-producer` | `19-paid/creatives/`; `19-paid/openmontage/` | ads + fal/OpenMontage; budget > $0 or skip | Ad accounts — operator |

Phases **0–8, 10, 13, 16, 20–22** are primarily Craft/SPEC. Production not required unless the packet adds a lease.

**Budget:** Phases **15** and **19** require `budget_usd > 0` on the packet **or** explicit `production_status: skipped` with reason.

## Email HTML standard (Phase 17)

1. Craft journeys first under `17-channels/email/*.md` (subject, preview, body, CTA).
2. For **each** send-ready email: `17-channels/email/html/<journey>-<n>-<slug>.html`
3. Follow `skills/community/inference-sh/email-design/`: max-width 600px, single column, bulletproof CTA tables, alt text, unsubscribe placeholder, mobile-safe fonts (≥14px).
4. Header images → `17-channels/email/assets/` via `brand-designer` (`ask_manager`). Text-only HTML OK with note “headers deferred”.
5. ESP merge tags stay placeholders. Do not invent operator facts.
6. SMS remains skippable with rationale.

### Email HTML QA checklist (lifecycle + verifier)

- [ ] File exists under `17-channels/email/html/`
- [ ] Max-width ~600px, single column
- [ ] Primary CTA is a bulletproof table button (or equivalent)
- [ ] Images have alt text (or no images)
- [ ] Unsubscribe / contact placeholder present
- [ ] Body font ≥14px; readable on mobile
- [ ] Matches craft MD subject/preview/CTA intent

## Wire checklist (operator after approve)

- [ ] ESP: import HTML, set merge tags, schedule/automation
- [ ] Ads: upload creatives, map UTMs
- [ ] DNS / hosting: production domain + TLS
- [ ] Analytics: property + conversion events
- Record `wire_owner: operator` (or seat) and remaining items in `wire_notes`.

## Handoff fields (required on shippable phases)

```yaml
production_status: complete | skipped | blocked
production_paths:
  - docs/projects/<active>/business-idea/17-channels/email/html/...
wire_owner: operator | tech-lead | none
wire_notes: "Import HTML into ESP; set Q7 CONTACT_EMAIL"
skip_reason: "" # required if production_status=skipped
```

Also list production paths in the **Artifacts written** table. `production_paths` is the light asset registry for the phase.

## Manager / C-suite / verifier gates

Managers **reject** shippable-phase IC handoffs that lack `production_status` or that claim `complete` without listed production files (unless `skipped` with reason).

After the manager brief on shippable phases, orchestrator/CTO spawns **`verifier`**. C-suite may **approve** only when `HANDOFFS/<phase>-verifier.md` has `verdict: pass` (or production was `skipped`/`blocked` with documented reason and verifier confirms the skip is honest).

C-suite scorecards must include **Production** and **Verifier pass?** rows (see ORG-REGISTRY).

## Rationalizations

| Excuse | Reality |
|--------|---------|
| “Full emails in MD is enough” | Phase 17 needs `email/html/` or explicit skip |
| “Operator will make HTML later” | That is a **skip** — record it |
| “tech-lead write_lease is only build-log” | Lease `apps/<venture>/` for MVP routes |
| “Figma file is the deliverable” | Export into leased path first |
| “design-system lives in the app” | SSOT is `design-system/<venture>/` |
| “No ESP in TOOL-REGISTRY” | Wire = operator; Production HTML still required |
| “Manager said it’s done” | Verifier must still pass |
