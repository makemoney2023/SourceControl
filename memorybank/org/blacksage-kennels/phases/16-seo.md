# 16 SEO — Technical Implementation & Keyword Map

**Phase:** 16  
**Status:** ready for C-suite review (merged by CMO)  
**Last updated:** 2026-07-27  
**Owner:** cmo (merged from seo-manager IC)  
**Venture:** Blacksage Kennels  
**Scope:** Must routes only — `/`, `/dogs`, `/health`, `/about`, `/inquire`

---

## Executive summary

Phase 16 defines **technical SEO implementation**, a **trust-first keyword map** aligned to Phase 14 meta, **breed-appropriate directory submissions** (no spam), **structured data** recommendations, and **AI/SEO** guidance for `/health` education content.

**Top priorities for engineering + operator:**

1. Ship `sitemap.ts` and `robots.ts` (Must routes only; omit `/apply`, `/litters`).
2. Set `metadataBase` from `NEXT_PUBLIC_SITE_URL` and add per-route `alternates.canonical`.
3. Add Open Graph + Twitter metadata mirroring Phase 14 titles/descriptions.
4. Implement site-wide `Organization` JSON-LD when production domain + `[CONTACT_EMAIL]` are confirmed.
5. Submit to Google Search Console + Bing Webmaster after domain is live.
6. **Defer** `LocalBusiness`, geo keywords, and NAP-dependent listings until Q2 `[LOCATION]` + contact facts are verified.

**Build audit (`apps/blacksage-kennels/`):** Per-route title/description ✅ · `/apply` → `/inquire` 301 ✅ · sitemap ❌ · robots ❌ · metadataBase ❌ · canonicals ❌ · OG/Twitter ❌ · JSON-LD ❌

---

## 1. Technical SEO checklist

### 1.1 Crawlability & indexation

| Item | Requirement | Current state | Action |
|------|-------------|---------------|--------|
| **Must routes indexable** | `/`, `/dogs`, `/health`, `/about`, `/inquire` — `index, follow` | Static RSC pages; no `noindex` | ✅ Keep default indexable |
| **`/apply`** | **301 permanent** → `/inquire`; no standalone meta; **not** in sitemap | `next.config.ts` redirect ✅ | Update external links to `/inquire` |
| **`/litters`** | Omit until Q1 active | Not built | Do not add to sitemap or nav |
| **`/education` alias** | Optional 301 → `/health` | Not implemented | Engineer optional; canonical remains `/health` |
| **Trailing slash** | **No trailing slash** — consistent canonicals, sitemap, internal links | Next.js default (no slash) | Enforce in `metadataBase` + sitemap URLs |
| **404** | Custom `not-found.tsx` with nav back to Must routes | Default Next 404 | Polish in eng backlog (12-web-design § checklist) |

### 1.2 XML sitemap

**File:** `app/sitemap.ts` (Next.js MetadataRoute.Sitemap)

**Include (Must routes only):**

| URL | Priority | changefreq | Notes |
|-----|----------|------------|-------|
| `{baseUrl}/` | 1.0 | monthly | Home — proof band entry |
| `{baseUrl}/health` | 0.9 | monthly | Education pillar; anchor sections `#standards` `#testing` `#temperament` `#placement` are same URL |
| `{baseUrl}/dogs` | 0.8 | monthly | Update when Tier 2 profiles ship |
| `{baseUrl}/about` | 0.7 | monthly | Operator story updates |
| `{baseUrl}/inquire` | 0.6 | yearly | Conversion page; stable |

**Exclude:**

- `/apply` (redirect only)
- `/litters` (Q1-gated)
- `/dogs/[slug]` (until verified profiles exist)
- API routes, static assets, `_next/*`

**Reference in robots.txt:** `Sitemap: {baseUrl}/sitemap.xml`

**Post-launch:** Submit sitemap in Google Search Console and Bing Webmaster Tools.

### 1.3 robots.txt

**File:** `app/robots.ts` (Next.js MetadataRoute.Robots)

**Recommended policy:**

```txt
User-agent: *
Allow: /

# Must routes only — no Disallow on public trust pages
Sitemap: {baseUrl}/sitemap.xml
```

**AI crawler policy (business decision):**

| Bot | Platform | Recommendation |
|-----|----------|----------------|
| `Googlebot` | Google Search / AI Overviews | Allow |
| `Google-Extended` | Gemini / AI training opt-out separate from Search | Allow if citations desired |
| `GPTBot` / `ChatGPT-User` | ChatGPT | Allow — education content on `/health` is citation-worthy |
| `PerplexityBot` | Perplexity | Allow |
| `ClaudeBot` / `anthropic-ai` | Claude | Allow |
| `Bingbot` | Copilot | Allow |

Do **not** blanket-disallow AI bots if `/health` education is a strategic asset. Blocking prevents citation in AI answers.

**Staging/preview:** If a non-production URL exists, use `Disallow: /` on staging **or** `noindex` via env guard — never let staging index alongside production.

### 1.4 Meta tags (Phase 14 reference)

Meta titles and descriptions are **locked in Phase 14** and implemented in `lib/content/page-meta.ts` + per-page `export const metadata`. **Do not rewrite** unless CMO approves a GSC-driven test.

| Route | Title (chars) | Description (chars) | Source |
|-------|---------------|---------------------|--------|
| `/` | Blacksage Kennels — German / ADRK-aligned Rottweilers (53) | Evidence-led German Rottweiler breeding aligned to ADRK/FCI Standard No. 147. Health transparency, standards-informed education, and deliberate placement. (147) | `PAGE_META.home` |
| `/dogs` | Breeding stock — Blacksage Kennels (34) | Sire and dam profiles with health clearances when verified. Honest program status while profiles develop — explore health and education resources. (138) | `PAGE_META.dogs` |
| `/health` | Health & education — Blacksage Kennels (37) | ADRK/FCI Standard No. 147, health testing categories, temperament within the standard, and our selective placement process — education before inquiry. (141) | `PAGE_META.health` |
| `/about` | About Blacksage Kennels (22) | Our German / ADRK-aligned Rottweiler program: philosophy, operator story when available, and principles for structure, health, and deliberate placement. (138) | `PAGE_META.about` |
| `/inquire` | Begin your inquiry — Blacksage Kennels (38) | Begin your inquiry or join our interest list. Mutual fit review — not a reservation or checkout. We review every submission individually. (130) | `PAGE_META.inquire` |

**H1 alignment:** Meta titles complement visible H1s — they do not replace them. See `HANDOFFS/14-seo-manager.md` § H1 alignment check.

**Gap:** Root `app/layout.tsx` sets home title/description as layout default. Child routes override correctly; consider moving layout default to a template `{ title: { default: 'Blacksage Kennels', template: '%s — Blacksage Kennels' } }` for consistent brand suffix on future pages.

### 1.5 Canonical URLs

| Route | Canonical | Index |
|-------|-----------|-------|
| `/` | `{metadataBase}/` | index, follow |
| `/dogs` | `{metadataBase}/dogs` | index, follow |
| `/health` | `{metadataBase}/health` | index, follow |
| `/about` | `{metadataBase}/about` | index, follow |
| `/inquire` | `{metadataBase}/inquire` | index, follow |
| `/apply` | — | 301 → `/inquire` (link equity passes to inquire canonical) |

**Implementation (Next.js App Router):**

```ts
// app/layout.tsx or lib/seo/metadata.ts
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com'),
  // ...
};

// Per page, e.g. app/health/page.tsx
export const metadata: Metadata = {
  title: PAGE_META.health.title,
  description: PAGE_META.health.description,
  alternates: { canonical: '/health' },
};
```

**Env:** `NEXT_PUBLIC_SITE_URL` — production origin, no trailing slash (e.g. `https://blacksagekennels.com`).

**Current gap:** No `metadataBase` or `alternates.canonical` in app — **P0 eng**.

### 1.6 Open Graph & Twitter cards

Mirror Phase 14 title/description per route. Recommended shared shape:

| Field | Value |
|-------|-------|
| `openGraph.title` | Same as meta title |
| `openGraph.description` | Same as meta description |
| `openGraph.url` | Canonical absolute URL |
| `openGraph.siteName` | Blacksage Kennels |
| `openGraph.locale` | en_US |
| `openGraph.type` | website |
| `openGraph.images` | Brand OG image when Q6 — **no fake dog photography** |
| `twitter.card` | `summary_large_image` (or `summary` until OG image exists) |
| `twitter.title` / `twitter.description` | Mirror OG |

**Current gap:** Not implemented — **P1 eng** (can ship text-only OG before image asset).

### 1.7 Redirects

| Source | Target | Type | Status |
|--------|--------|------|--------|
| `/apply` | `/inquire` | 301 permanent | ✅ `next.config.ts` + `lib/redirect.test.ts` |

**SEO note:** Do not create meta tags or sitemap entries for `/apply`. Update any legacy backlinks, social bios, or printed materials to `/inquire`.

### 1.8 Structured data (JSON-LD)

Validate with [Google Rich Results Test](https://search.google.com/test/rich-results) after deploy — static fetch alone cannot detect JS-injected schema.

#### Site-wide — `Organization` (ship when domain + email confirmed)

**When:** Production domain live + `[CONTACT_EMAIL]` replaced with real address.

**Where:** `app/layout.tsx` via `<script type="application/ld+json">` or Next.js JSON-LD component.

**Minimum properties:**

- `@type`: Organization
- `name`: Blacksage Kennels
- `url`: `{metadataBase}`
- `logo`: Brand logo URL when available
- `email`: Verified contact email (not placeholder)
- `description`: One sentence aligned to home meta — evidence-led, ADRK/FCI Standard No. 147 **aligned**
- `sameAs`: Only verified social/profile URLs — **empty array until operator confirms**

**Do not include:** `"certifiedBy": "ADRK"`, fake addresses, or unverified club memberships.

#### Gated — `LocalBusiness` / `PetStore` (Q2 only)

**Blocked until:** `[LOCATION]`, `[CONTACT_EMAIL]`, and operator NAP verified (Q2).

**Why wait:** LocalBusiness with placeholder geo harms trust signals and can trigger rich-result errors.

**When unblocked:** Use `LocalBusiness` with verified `address`, `geo`, `telephone`, `email`, and `areaServed` — not invented city/state.

#### Optional — `BreadcrumbList`

Low priority for flat 5-page IA. Consider when `/dogs/[slug]` profiles ship:

```json
Home → Breeding stock → [Dog name]
```

#### FAQ — `FAQPage` (conditional)

**Do not ship FAQ schema at launch** unless visible FAQ Q&A blocks exist on-page (not just prose sections).

**Candidate (post-launch):** If operator approves a dedicated FAQ section on `/health#placement` or `/inquire` with exact visible Q&A matching schema, add `FAQPage` for questions like:

- "Why doesn't Blacksage list puppy prices on the website?"
- "What does ADRK-aligned mean?"
- "What happens after I submit an inquiry?"

Schema text must match visible copy exactly.

#### `/health` — `Article` or `WebPage` (optional)

The `/health` page is educational pillar content. Optional `WebPage` with `about` referencing Rottweiler breed standard education — low rich-result upside; prioritize Organization first.

### 1.9 On-page technical (existing build)

| Check | Status | Notes |
|-------|--------|-------|
| Unique title per route | ✅ | `PAGE_META` + page exports |
| Unique description per route | ✅ | |
| One H1 per page | ✅ | `PageHero` component |
| Logical H2 hierarchy on `/health` | ✅ | `#standards` `#testing` `#temperament` `#placement` |
| Internal linking (proof band → health/dogs) | ✅ | |
| `lang="en"` on `<html>` | ✅ | `app/layout.tsx` |
| HTTPS | Deploy-time | Vercel/hosting default |
| Semantic HTML (`<main>`, skip link) | ✅ | |
| Image alt text | Partial | Placeholder components — real photos need descriptive alt when Q6 |
| Mobile responsive | ✅ | Tailwind breakpoints |

### 1.10 Core Web Vitals & performance

Static RSC pages ~127 kB First Load JS on content routes (per `09-build-log.md`). `/inquire` heavier (~242 kB) due to form — acceptable for conversion page.

**Monitor post-launch:** PageSpeed Insights + Search Console CWV report. No scroll-jacking or WebGL — positive for LCP/INP vs v1.

### 1.11 Build/app gaps summary

| Gap | Priority | Owner | File(s) |
|-----|----------|-------|---------|
| `app/sitemap.ts` | **P0** | Eng | New |
| `app/robots.ts` | **P0** | Eng | New |
| `metadataBase` + `NEXT_PUBLIC_SITE_URL` | **P0** | Eng | `app/layout.tsx`, env |
| Per-route `alternates.canonical` | **P0** | Eng | Each `app/*/page.tsx` |
| Open Graph + Twitter metadata | **P1** | Eng | Shared metadata helper |
| `Organization` JSON-LD | **P1** | Eng | After domain + email confirmed |
| OG image asset | **P2** | Operator / brand | Q6 |
| `not-found.tsx` polish | **P2** | Eng | |
| `LocalBusiness` JSON-LD | **Blocked Q2** | Eng + operator | |
| `/education` → `/health` 301 | **P3 optional** | Eng | `next.config.ts` |
| `llms.txt` (AI context file) | **P3 optional** | Eng | Site root — see §5 |

---

## 2. Keyword map by page

**Strategy:** Trust-first D2 clusters — health, ADRK/FCI Standard No. 147 education, kennel credibility, deliberate placement. **Avoid** FOMO, availability, price, guard-dog hype, and "apply/buy/reserve" language.

**Volume/difficulty:** Estimates only — no GSC/Ahrefs connected at Phase 16. Prioritize intent fit and claim safety over head terms.

### `/` — Home

| Role | Keyword / phrase cluster | Intent | Aligns with Phase 14 meta |
|------|--------------------------|--------|---------------------------|
| **Primary** | German Rottweiler breeder | Commercial investigation | ✅ Title + description |
| **Primary (support)** | ADRK-aligned Rottweiler breeding | Commercial / educational | ✅ "ADRK-aligned" + Standard No. 147 |
| **Secondary** | evidence-led Rottweiler program | Commercial — trust | ✅ "Evidence-led" |
| **Secondary** | FCI Standard No. 147 Rottweiler | Informational → commercial | ✅ Standard reference |
| **Secondary** | health transparent Rottweiler kennel | Commercial | ✅ "Health transparency" |
| **Secondary** | deliberate Rottweiler placement | Commercial | ✅ "Deliberate placement" |
| **Long-tail** | responsible German Rottweiler breeding program | Commercial | Body + proof band |
| **Avoid** | Rottweiler puppies for sale, buy Rottweiler, Rottweiler price, Rottweiler near me, guard dog for sale, apply for puppy | Transactional / geo / hype | Locked out |

### `/dogs` — Breeding stock

| Role | Keyword / phrase cluster | Intent | Aligns with Phase 14 meta |
|------|--------------------------|--------|---------------------------|
| **Primary** | Rottweiler breeding stock | Commercial investigation | ✅ "Breeding stock" title/H1 |
| **Secondary** | Rottweiler sire and dam profiles | Commercial | ✅ Description |
| **Secondary** | Rottweiler health clearances breeding dogs | Commercial / educational | ✅ "Health clearances when verified" |
| **Secondary** | ADRK-aligned Rottweiler kennel dogs | Commercial | Body copy |
| **Long-tail** | Rottweiler pedigree health testing program | Commercial | Link to `/health#testing` |
| **Avoid** | Rottweiler puppies available, litter announcement, champion Rottweiler for stud (until verified), named dogs (until Tier 2) | Availability / unverified claims | Empty state honest |

### `/health` — Health & education (pillar page)

| Role | Keyword / phrase cluster | Intent | Aligns with Phase 14 meta |
|------|--------------------------|--------|---------------------------|
| **Primary** | Rottweiler health testing | Informational / commercial | ✅ `#testing` section |
| **Primary (support)** | ADRK FCI Standard No. 147 Rottweiler | Informational | ✅ `#standards` |
| **Secondary** | Rottweiler hip elbow OFA testing | Informational | Health categories copy |
| **Secondary** | Rottweiler temperament breed standard | Informational | ✅ `#temperament` |
| **Secondary** | responsible Rottweiler breeder placement process | Commercial | ✅ `#placement` |
| **Secondary** | JLPP Rottweiler testing | Informational | Health categories |
| **Long-tail** | what health tests should Rottweiler breeders do | Informational (AI Overview candidate) | Expand `#testing` |
| **Long-tail** | ADRK-aligned vs American Rottweiler type | Informational | Standards section — careful, factual |
| **Avoid** | 100% healthy Rottweiler, disease-free, best Rottweiler breeder, protection dog training | Superlatives / hype | Brand guardrails |

### `/about` — About

| Role | Keyword / phrase cluster | Intent | Aligns with Phase 14 meta |
|------|--------------------------|--------|---------------------------|
| **Primary** | Blacksage Kennels | Navigational | ✅ Title/H1 |
| **Secondary** | about ADRK-aligned Rottweiler breeder | Commercial investigation | ✅ Description |
| **Secondary** | Rottweiler breeding philosophy | Commercial | Program principles |
| **Secondary** | German Rottweiler breeding program | Commercial | Subhead + body |
| **Long-tail** | selective Rottweiler placement kennel | Commercial | Principles list |
| **Avoid** | best breeder in [city], #1 Rottweiler kennel, certified by ADRK (unless Tier 2 verified) | Geo / superlative / false cert | Q2 geo blocked |

### `/inquire` — Begin your inquiry

| Role | Keyword / phrase cluster | Intent | Aligns with Phase 14 meta |
|------|--------------------------|--------|---------------------------|
| **Primary** | Rottweiler inquiry | Commercial / transactional (soft) | ✅ "Begin your inquiry" |
| **Secondary** | Rottweiler breeder interest list | Commercial | Package A copy |
| **Secondary** | contact Rottweiler breeder | Transactional (soft) | Form context |
| **Secondary** | Rottweiler breeder inquiry process | Commercial | Mutual fit framing — never "Apply" in SERP copy |
| **Long-tail** | how to inquire with a responsible Rottweiler breeder | Informational → transactional | Expectation copy |
| **Avoid** | apply for Rottweiler puppy, reserve Rottweiler, Rottweiler deposit, buy Rottweiler puppy online | Hard transactional | **Never** — use inquire language |

### Keyword cannibalization guardrails

| Topic | Canonical page | Do not duplicate on |
|-------|----------------|---------------------|
| Breed standard / ADRK alignment | `/health#standards` | Home (teaser only), About (summary only) |
| Health testing detail | `/health#testing` | `/dogs` (link out) |
| Placement process | `/health#placement` | `/inquire` (CTA only) |
| Kennel credibility / story | `/about` | Home (teaser only) |
| Conversion | `/inquire` | Home (tertiary band only) |

### Geo keywords — **blocked until Q2**

Do not target `[LOCATION]`, "Rottweiler breeder near me," or city/state variants until operator verifies geography. When unblocked, `/about` and footer NAP become the geo anchor — not a programmatic city-page play.

---

## 3. Directory & submission list

### 3.1 Essential (ship at launch)

| Platform | Purpose | Blocker | Action |
|----------|---------|---------|--------|
| **Google Search Console** | Indexation, CWV, query data | Production domain + DNS | Verify domain; submit sitemap; set preferred domain (non-www vs www — match `metadataBase`) |
| **Bing Webmaster Tools** | Bing/Copilot indexation | Production domain | Verify; submit sitemap |
| **Google Business Profile** | Local discovery | **Q2** — verified `[LOCATION]`, phone, hours | **Blocked** until real NAP |

### 3.2 Breed-appropriate / credible (operator-verified only)

Submit or claim **only** when operator holds verified membership or program facts support listing. Never invent affiliations.

| Listing type | Examples | When | Notes |
|--------------|----------|------|-------|
| **National breed club directories** | AKC breeder referral (if AKC involvement verified), regional Rottweiler clubs | Tier 2 club affiliations confirmed | Link to `/health`, not `/inquire` as primary |
| **Health registry profiles** | OFA database (individual dogs), PennHIP when dogs listed | Tier 2 dog profiles live | Links from `/dogs` cards — not kennel spam |
| **FCI / ADRK ecosystem** | ADRK member kennel listing | **Only if operator is ADRK member** — never "aligned" as membership | Use "aligned to Standard No. 147" on site; listing only with proof |
| **Responsible breeding education** | Rottweiler Health Foundation, breed health initiatives | When operator participates | Credibility, not SEO spam |
| **USRC / regional Rottweiler clubs** | United States Rottweiler Club and similar | Verified membership | One accurate profile beats many thin citations |

### 3.3 Explicitly exclude (spam / low trust)

| Category | Examples | Why exclude |
|----------|----------|-------------|
| **General "free directory" farms** | Hotfrog, Brownbook clones, mass DA submitters | Spam signals; no breed relevance |
| **Pet classified aggregators** | PuppyFind-style marketplaces, "free puppy ads" | Conflicts with D2 trust positioning |
| **Bulk local citation services** | Yext-style NAP blast without verified address | Placeholder NAP harm |
| **AI-generated "best breeder" listicles** | Paid inclusion farms | No editorial trust |
| **Guard dog / protection directories** | Protection-dog marketplaces | Brand guardrail violation |
| **International mirror directories** | Auto-scraped clones | No value |

### 3.4 Blocked pending operator facts

| Item | Required facts | Owner |
|------|----------------|-------|
| Google Business Profile | `[LOCATION]`, phone, hours, service area | Operator Q2 |
| Local citation consistency (NAP) | Verified name, address, phone | Operator Q2 |
| Club directory listings | `[CLUB_AFFILIATIONS]` Tier 2 | Operator |
| OFA/external dog links | Named dogs + verified results | Operator inventory |
| Social `sameAs` in Organization schema | Verified profile URLs | Operator |

---

## 4. AI / SEO notes

Google states core SEO best practices apply to AI Overviews — no separate "AI SEO" markup required. For Blacksage, **non-Google AI engines** (ChatGPT, Perplexity, Claude) may cite well-structured education on `/health`.

### 4.1 Strategic fit

| Asset | AI opportunity | Action |
|-------|----------------|--------|
| `/health#standards` | "What is ADRK-aligned Rottweiler?" / FCI Standard No. 147 | Lead sections with 40–60 word direct answers; cite FCI/ADRK as sources |
| `/health#testing` | "What health tests do Rottweiler breeders do?" | Bulleted categories (hips, elbows, eyes, cardiac, JLPP) — already structured |
| `/health#temperament` | "Rottweiler temperament breed standard" | FCI-aligned quote + plain-English gloss (13-copy-foundation §10) |
| `/health#placement` | "Why don't ethical breeders list puppy prices?" | Objection-handling prose — citation-worthy, not salesy |

### 4.2 Extractability checklist (`/health` priority)

| Check | Target |
|-------|--------|
| Clear definition in first paragraph of each `#` section | ✅ Mostly — maintain on content updates |
| Self-contained answer blocks | Expand with explicit "In short:" lead sentences if AI citation testing shows gaps |
| Statistics with sources | Add sourced breed health stats when operator approves — +37–40% AI visibility (GEO research) |
| FAQ visible + schema match | Only if FAQ block added — see §1.8 |
| Expert attribution | `[OPERATOR_NAME]` / credentials on About when Tier 2 |
| Freshness | "Last updated" date in footer or health page when material changes |
| AI bots allowed in robots.txt | Recommended Allow — see §1.3 |

### 4.3 Entity clarity

- **Brand entity:** Blacksage Kennels — consistent naming in title tags, Organization schema, and footer.
- **Breed entity:** Rottweiler, FCI Standard No. 147, ADRK — use correct terminology; **aligned**, not "certified."
- **Third-party citations:** AI systems often cite Wikipedia, Reddit, and breed clubs over kennel sites — long-term, authentic participation in breed-education communities matters more than on-site keyword density.

### 4.4 Optional — `llms.txt`

Not required by Google. Optional site-root file summarizing program, Must routes, and link to `/health` for non-Google AI agents. **P3** — after core technical SEO ships.

### 4.5 Programmatic SEO — not recommended at launch

Per programmatic-seo pack: quality over quantity. **Do not** generate location pages, litter pages, or `[city] Rottweiler breeder` templates until Q2 geo is verified and operator has unique per-page value. Future `/dogs/[slug]` profiles are **manual, Tier 2** — not pSEO.

---

## 5. Prioritized implementation order

### P0 — Engineering (pre-launch / launch week)

1. Set `NEXT_PUBLIC_SITE_URL` in production env.
2. Add `metadataBase` to root layout.
3. Add `alternates.canonical` on all five Must route pages.
4. Create `app/sitemap.ts` (Must routes only).
5. Create `app/robots.ts` with sitemap reference.
6. Verify `/apply` → `/inquire` 301 in production (already in config).
7. Run production build; confirm five routes in sitemap output.

### P1 — Engineering + operator (launch week)

8. Add Open Graph + Twitter metadata (shared helper from `PAGE_META`).
9. Deploy `Organization` JSON-LD when domain + real `[CONTACT_EMAIL]` confirmed.
10. Register Google Search Console + Bing Webmaster; submit sitemap.
11. Request indexing for `/` and `/health` in GSC URL Inspection.

### P2 — Post-launch (30 days)

12. Add brand OG image when Q6 asset exists.
13. PageSpeed Insights baseline + Search Console CWV monitoring.
14. Review GSC queries — tune titles only via CMO-approved tests (Phase 14 alternates table).
15. Custom `not-found.tsx` with internal links.
16. Consider visible FAQ on `/health#placement` + matching FAQ schema if content added.

### P3 — Q2+ (operator-dependent)

17. Replace `[LOCATION]`, `[CONTACT_EMAIL]`, `[CONTACT_PHONE]` in `lib/constants.ts`.
18. Ship `LocalBusiness` JSON-LD + Google Business Profile.
19. Consistent NAP on verified club directories.
20. `/dogs/[slug]` profiles with Dog/Person schema only when Tier 2 data exists.
21. Optional `/education` → `/health` redirect; optional `llms.txt`.
22. `/litters` route + sitemap entry when Q1 operator approves — separate phase.

---

## 6. SERP guardrails (do not regress)

| Never in SEO-facing strings | Why |
|-----------------------------|-----|
| Puppy prices, deposits, "starting at $X" | A10 lock |
| Buy, Shop, Reserve, Apply now, Get your puppy | Voice/IA lock |
| Litter availability, countdowns, spots left | Anti-FOMO |
| `[LOCATION]`, invented city/state | Q2 blocked |
| "Certified by ADRK," "ADRK registered" (unless Tier 2) | Claims guardrail |
| Named OFA results, dog names until Tier 2 | Honest empty states |
| Guard dog, protection dog, weapon, attack | Brand guardrails |
| 100% healthy, disease-free, best breeder, #1 | Superlative violations |

---

## Open items

| Item | Owner | Blocks |
|------|-------|--------|
| Production domain URL | Operator / deploy | metadataBase, GSC, sitemap absolute URLs |
| `[CONTACT_EMAIL]` verification | Operator Q2 | Organization schema, GBP |
| `[LOCATION]` verification | Operator Q2 | Local SEO, LocalBusiness, geo keywords |
| OG image asset | Operator Q6 | Rich social previews |
| GSC/Bing access | Operator | Performance monitoring |
| Club affiliations proof | Operator Tier 2 | Directory submissions |

---

## Sources / skills used

- `docs/projects/blacksage-kennels/business-idea/HANDOFFS/14-seo-manager.md` — Phase 14 meta, canonical notes, JSON-LD deferral
- `docs/projects/blacksage-kennels/business-idea/14-pages/*.md` — H1 and page copy alignment
- `docs/projects/blacksage-kennels/business-idea/13-copy-foundation.md` — §10 breed anchors, §12 SEO seed, guardrails
- `docs/projects/blacksage-kennels/business-idea/12-web-design.md` — IA, sitemap.ts spec
- `docs/projects/blacksage-kennels/business-idea/09-build-log.md` — build verification, known gaps
- `docs/projects/blacksage-kennels/business-idea/05-prd.md` — D2, A10, tier rules
- `apps/blacksage-kennels/` — `page-meta.ts`, `next.config.ts`, route metadata audit
- `skills/community/marketingskills/seo-audit/` — technical checklist framework
- `skills/community/notfair-seo/keyword-research/` — intent clusters, topic grouping
- `skills/community/notfair-seo/schema-markup-generator/` — JSON-LD type selection
- `skills/community/marketingskills/ai-seo/` — AI Overviews, extractability, robots AI bots
- `skills/community/marketingskills/programmatic-seo/` — anti-pSEO at launch

**IC model:** seo-manager · `fast-ops` / composer-2.5-fast · generation none  
**CMO merge:** owner → cmo · inquire secondary keyword retitled to "inquiry process" (no Apply drift) · status ready for C-suite
