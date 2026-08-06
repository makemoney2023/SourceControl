---
phase: "14"
position: seo-manager
reports_to: cmo
status: done
verdict_for_manager: ready_to_merge
llm_tier: fast-ops
llm_model: composer-2.5-fast
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Phase 14 REDO On-Page Meta → CMO

## Goal (from context packet)

Produce meta title + meta description for every **Must** multi-page route (`/`, `/dogs`, `/health`, `/about`, `/inquire`). Deliver merge-ready strings for CMO merge into `14-pages/*.md` — **do not edit page files directly**.

**Supersedes:** v1 handoff scoped to `/` + `/apply` scroll IA only.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/14-seo-manager.md` | Merge-ready meta table, H1 alignment, canonical/redirect notes, guardrails |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | fast-ops |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false |

---

## Merge-ready meta table (CMO → `14-pages/*.md`)

Primary ★ strings below. Character counts in parentheses. Safe claims only — **ADRK/FCI Standard No. 147 aligned**, not "certified by ADRK."

| Route | File | Meta title | Meta description | Intent |
|-------|------|------------|------------------|--------|
| `/` | `home.md` | **Blacksage Kennels — German / ADRK-aligned Rottweilers** (53) | **Evidence-led German Rottweiler breeding aligned to ADRK/FCI Standard No. 147. Health transparency, standards-informed education, and deliberate placement.** (147) | German Rottweiler breeder; ADRK-aligned program discovery — proof-first, not apply-first |
| `/dogs` | `dogs.md` | **Breeding stock — Blacksage Kennels** (34) | **Sire and dam profiles with health clearances when verified. Honest program status while profiles develop — explore health and education resources.** (138) | Rottweiler breeding stock; kennel dogs index |
| `/health` | `health.md` | **Health & education — Blacksage Kennels** (37) | **ADRK/FCI Standard No. 147, health testing categories, temperament within the standard, and our selective placement process — education before inquiry.** (141) | Rottweiler health testing; breed standards education |
| `/about` | `about.md` | **About Blacksage Kennels** (22) | **Our German / ADRK-aligned Rottweiler program: philosophy, operator story when available, and principles for structure, health, and deliberate placement.** (138) | Kennel about; breeder credibility |
| `/inquire` | `inquire.md` | **Begin your inquiry — Blacksage Kennels** (38) | **Begin your inquiry or join our interest list. Mutual fit review — not a reservation or checkout. We review every submission individually.** (130) | Rottweiler inquiry; interest list — **not** Apply |

### Title alternates (optional post-launch GSC test only)

| Route | Alternate title (chars) | When to use |
|-------|-------------------------|-------------|
| `/` | German Rottweilers \| Blacksage Kennels (38) | Keyword-first SERP test if brand recognition is low |
| `/dogs` | Our dogs — Blacksage Kennels (29) | Plain-language variant — ★ "Breeding stock" preferred for H1 alignment |
| `/inquire` | Rottweiler inquiry \| Blacksage Kennels (40) | **Not recommended** — breaks locked "Begin your inquiry" voice |

**Recommendation:** Ship ★ primary titles above.

---

## H1 alignment check (14-pages REDO)

Meta titles **complement** visible H1s — do not replace them in the DOM.

| Route | Document H1 (`14-pages`) | Meta title relationship | Align? |
|-------|--------------------------|-------------------------|--------|
| `/` | German / ADRK-aligned Rottweilers | Brand + ★ keyword phrase; proof/education framing in description | ✅ |
| `/dogs` | Breeding stock | Opens with "Breeding stock" | ✅ |
| `/health` | Health & education | Matches nav/H1 label | ✅ |
| `/about` | About Blacksage Kennels | Matches H1 exactly | ✅ |
| `/inquire` | Begin your inquiry | Matches locked H1/CTA — mode headline ("Join our interest list") is **not** H1 | ✅ |

### Build rules

| Element | Rule |
|---------|------|
| Home H1 | "German / ADRK-aligned Rottweilers" — **not** tagline-only or apply CTA |
| Home SERP | No apply/buy/reserve language — proof band + education paths only |
| Dogs empty state | H1 stays "Breeding stock"; "profiles coming soon" is H2/prominent copy, not second H1 |
| Inquire | H1 = "Begin your inquiry" — never "Apply" in title, H1, or meta |
| Health sections | `#standards` `#testing` `#temperament` `#placement` use H2s — not H1 |

---

## Canonical path notes

| URL | Canonical | Index | Notes |
|-----|-----------|-------|-------|
| `/` | `{metadataBase}/` | index, follow | Root default metadata |
| `/dogs` | `{metadataBase}/dogs` | index, follow | Include in sitemap |
| `/health` | `{metadataBase}/health` | index, follow | Include in sitemap |
| `/about` | `{metadataBase}/about` | index, follow | Include in sitemap |
| `/inquire` | `{metadataBase}/inquire` | index, follow | Include in sitemap |
| `/apply` | — | **301 → `/inquire`** | Legacy v1 route — retire `/apply` meta entirely |
| `/education` | — | **301 → `/health`** (optional) | If engineer ships alias; canonical remains `/health` |

**Sitemap (Phase 9):** Must routes only — `/`, `/dogs`, `/health`, `/about`, `/inquire`. Omit `/litters` until Q1 active. Omit `/apply`.

**Trailing slash:** Recommend **no trailing slash** — enforce consistently in canonicals, sitemap, and internal links.

---

## Redirect note: `/apply` → `/inquire`

| Legacy | Target | Type | Meta impact |
|--------|--------|------|-------------|
| `/apply` | `/inquire` | **301 permanent** | No standalone meta for `/apply`; update external links to `/inquire` |
| Nav label "Apply" | "Inquire" | — | Header CTA: **Begin your inquiry** |

v1 files (`homepage.md`, `apply.md`) are **superseded** by REDO IA — do not merge v1 meta into production build.

---

## What NOT to put in meta (titles or descriptions)

| Never in SERP-facing strings | Why |
|------------------------------|-----|
| Puppy prices, deposits, "starting at $X" | Operator policy; A10 lock |
| "Buy," "Shop," "Reserve," "Apply now," "Get your puppy" | Voice/IA lock — use **inquire / inquiry** |
| Litter availability, countdowns, "spots left" | Selectivity pillar; may be inaccurate |
| `[LOCATION]`, city, state, or invented geography | Operator Q2 — body/footer placeholders only |
| "Certified by ADRK," "ADRK registered" (unless Tier 2 verified) | Claims guardrail — use *aligned* |
| Named OFA results, test scores, dog names until Tier 2 | Honest empty / omit |
| Guard dog, protection dog, weapon, attack | Brand guardrails |
| "100% healthy," "disease-free," "best breeder," "#1" | Superlative violations |
| "Rare," "exotic," "XL," "limited time," "act now" | Anti-FOMO |

---

## JSON-LD — deferred to Phase 16

Structured data is **out of scope** for Phase 14. Phase 16 (`16-seo.md`) owns:

- `Organization` (site-wide when domain/contact confirmed)
- `LocalBusiness` (gated on Q2 `[LOCATION]` + `[CONTACT]`)
- `FAQ` schema (if warranted post-launch)
- `BreadcrumbList` (optional)

**Do not block Phase 14 merge** on JSON-LD.

---

## Open Graph / Twitter (mirror meta per route)

For each Must route, mirror § merge table title/description in `openGraph` and `twitter`:

- `openGraph.siteName`: Blacksage Kennels
- `openGraph.locale`: en_US
- `openGraph.type`: website
- `twitter.card`: summary_large_image (or summary until OG image exists)
- OG image: brand asset when Q6 — **no fake dog photography**

---

## Decisions

- Refined `13-copy-foundation.md` §12 seed strings for SERP length (~130–150 char descriptions) and five-route REDO scope.
- Home description emphasizes evidence/education/placement — **no apply-first framing** matching proof-band IA.
- Dogs description covers populated **and** empty states without invented names or counts.
- Inquire meta uses locked **Begin your inquiry** — never "Apply"; compatible with Package A/B mode headlines.
- No location, pricing, litter urgency, or named health results in any SERP string.
- JSON-LD explicitly deferred to Phase 16.

## Asks for manager (`ask_manager`)

- Peer help needed: **none**
- Clarification needed: **none** — `[LOCATION]` and contact remain placeholders per guardrails.

## Risks / blockers

- **Low:** Without `metadataBase`, OG URLs may be relative until production domain is set — build should use `NEXT_PUBLIC_SITE_URL`.
- **Low:** No OG image asset yet — social previews generic until brand still available.

## Packs used

- `skills/community/notfair-seo/meta-tags-optimizer/` — title/description length, intent, CTR guidance
- `skills/community/marketingskills/seo-audit/` — on-page checklist, canonical/indexation
- `docs/projects/blacksage-kennels/business-idea/13-copy-foundation.md` §4 ★ headlines, §12 SEO seed
- `docs/projects/blacksage-kennels/business-idea/14-pages/*.md` — H1 alignment skim
- `docs/projects/blacksage-kennels/business-idea/12-web-design.md` — IA, routes, `/apply` redirect

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Edit `14-pages/*.md` directly (CMO merge path)
