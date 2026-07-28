# Page Content Index — Blacksage Kennels

**Phase:** 14 REDO + 14-R Hybrid chapter map  
**Status:** approved (merged by CMO); Hybrid chapter SSOT added for SD4-C  
**Last updated:** 2026-07-27  
**Owner:** cmo

Trust-first **multi-page** copy set. **Phase 14 REDO supersedes v1** two-route deliverable (`homepage.md` + `apply.md`).

**Hybrid note (Option C / Skill-Max):** Home may present as scroll/cinema **chapters**, but **copy substance** still comes from [`home.md`](./home.md) + [`home-scroll-chapters.md`](./home-scroll-chapters.md). Rejected forever: v1 Heritage → Apply beats and film-jargon-only placeholders. App SSOT: `apps/blacksage-kennels/lib/home-scroll-story.ts`.

Every Must page file includes: route, meta title/description (SEO-merged), document H1, full body copy, section anchor IDs, and internal link targets. JSON-LD deferred until operator contact/`[LOCATION]` are set.

---

## Must routes — Phase 14 REDO

| Page | Route | File | Body | Meta | Status |
|------|-------|------|:----:|:----:|--------|
| Home | `/` | [`home.md`](./home.md) | ✅ | ✅ | + Hybrid chapters |
| Dogs | `/dogs` | [`dogs.md`](./dogs.md) | ✅ | ✅ | Ready |
| Health/Education | `/health` | [`health.md`](./health.md) | ✅ | ✅ | Ready |
| About | `/about` | [`about.md`](./about.md) | ✅ | ✅ | Ready |
| Inquire | `/inquire` | [`inquire.md`](./inquire.md) | ✅ | ✅ | Ready |

---

## v1 superseded — do not use in build

| Deprecated file | Superseded by | Reason |
|-----------------|---------------|--------|
| [`homepage.md`](./homepage.md) | [`home.md`](./home.md) | v1 scroll narrative (Heritage → Structure → Temperament → Trust → Apply) **rejected** |
| [`apply.md`](./apply.md) | [`inquire.md`](./inquire.md) | `/apply` route **rejected** — use `/inquire` with CTA **Begin your inquiry** |

Both deprecated files remain as short stubs pointing to their REDO replacements. Build should **301 `/apply` → `/inquire`**.

---

## Page section maps (REDO)

### Home (`home.md`) — Hybrid chapter presentation OK; substance locked

Section order for evidence job (may render as full-viewport chapters):

| Order | Section |
|-------|---------|
| 1 | Page hero (★ H1 + subhead; no CTA above fold) |
| 2 | Proof summary band (4 cells) |
| 3 | Positioning / standards prose |
| 4 | Education teaser → `/health` |
| 5 | Dogs teaser → `/dogs` (About teaser may live on `/about` nav) |
| 6 | Inquire band (tertiary) → `/inquire` |

See also [`home-scroll-chapters.md`](./home-scroll-chapters.md) for chapter ids aligned to app.

### Dogs (`dogs.md`)

| State | Content |
|-------|---------|
| Empty (Tier 1) | Profiles coming soon → Health & testing; tertiary Inquire |
| Populated (Tier 2) | Intro + DogCard grid when operator inventory verified |

### Health (`health.md`) — anchors

| Anchor | H2 |
|--------|-----|
| `#standards` | ADRK / FCI Standard No. 147 |
| `#testing` | Health testing approach |
| `#temperament` | Temperament within the standard |
| `#placement` | Our placement process (Package A/B/C prose) |

### About (`about.md`)

Operator gap copy + program principles + contact placeholders + tertiary inquire CTA.

### Inquire (`inquire.md`) — Package modes

| Mode | When active | Headline |
|------|-------------|----------|
| Package A | Q1 brand-first | Join our interest list |
| Package B | Q1 active program | Submit inquiry for waitlist consideration |

Shared form fields + Package B extras; validation/success copy; trust footer with `[RESPONSE_EXPECTATION]`.

---

## Operator placeholders (do not invent)

| Token | Where |
|-------|-------|
| `[LOCATION]` | About contact |
| `[CONTACT]` / `[CONTACT_EMAIL]` | About, inquire error copy |
| `[OPERATOR_STORY]` | About operator section |
| `[OPERATOR_NAME]` | About operator section |
| `[HEALTH_TESTS]` | Dogs detail, health when inventory |
| `[DOG_COUNT]` | Home proof band Dogs cell |
| `[CLUB_AFFILIATIONS]` | About affiliations (Tier 2 only) |
| `[RESPONSE_EXPECTATION]` | Inquire trust footer |

---

## Deferred (not Phase 14 REDO)

| Item | When |
|------|------|
| `/litters` route copy | Q1 active program |
| `/dogs/[slug]` detail bios | Operator Tier 2 inventory |
| JSON-LD LocalBusiness / Organization | Phase 16 |

---

## Sources

- `13-copy-foundation.md` — ★ headlines, voice, CTA locks, form spec
- `12-web-design.md` — multi-page IA, wireframes, proof band
- `05-prd.md` — inquiry form specification
- `HANDOFFS/14-copy-chief.md`, `14-seo-manager.md`, `14-content-strategist.md`
- `HANDOFFS/14-manager-cmo.md` — Phase 14 REDO merge brief
