---
phase: "14"
position: seo-manager
reports_to: cmo
status: done
verdict_for_manager: ready_to_merge
llm_tier: fast-ops
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: true
production_status: skipped
production_paths: []
design_brief_path: ""
photoreal_qa: ""
license_basis: ""
wire_owner: none
wire_checklist_path: ""
wire_notes: "Paper meta + schema sketches only. No live origin. JSON-LD not deployed."
skip_reason: "Paper meta / on-page briefs. No live site. No store. Schema not deployed."
tool_status:
  ahrefs: unavailable
  google-search-console: unavailable
  firecrawl: unavailable
  app-store-connect: unavailable
---

# Handoff — SEO Manager Phase 14 → CMO

## Operator brief (plain English)

Canonical meta is on paper for Home, How it works, and Pricing only — aligned to Copy’s ★ H1s, not new headlines. How-it-works `<title>` is the 59-character ★ line; Copy’s draft plus brand was 70 and would truncate in the SERP. Schema is Organization + WebApplication + HowTo/Offer/FAQ as fit; LocalBusiness is banned so we do not impersonate the Little Rock trainer. Ahrefs, GSC, and Firecrawl were unavailable, so there are no volumes. Ready to merge; I did not write the manager brief and I did not mark the phase complete.

## What we found

- **[F]** Trio titles: Home 57c (`He froze at the door. Do the next right thing. | Telltail`); How it works 59c (★ H1 verbatim); Pricing 47c (`Sixty honest reads. $12/mo or $99/yr | Telltail`) because the full ★ H1 is 69c.
- **[F]** Descriptions 118 / 148 / 118c. No translator, $9.99, unlimited, or store-badge language.
- **[F]** Phase 2 clusters inherited; tool_status ahrefs/gsc/firecrawl **unavailable**. No KD, TAM, or GSC clicks.
- **[I]** v1 trio will not win “what to do when dog growls” AI Overviews; that is later `/growling` + body-language harvest, `noindex` until then.
- **[F]** In-thread cards are noindex chrome, not ranking routes.

## Next steps

1. **CMO** — merge `14-pages/02-onpage-seo.md`. I will not write the manager brief. Phase 14 is a hard gate after verifier; I do not mark it complete.
2. **Copy (already leased, not spawned)** — optional: paste the two How + two Pricing FAQ lines onto the bodies so FAQPage is valid. Do not fight the canonical titles.
3. **Phase 16 (later)** — live canonical origin, robots/sitemap, deploy JSON-LD, GSC property. Not this pass.
4. No new operator question. A5 / A1 / A4 / K1 stay OPEN.

## Goal (from context packet)

On-page SEO for the marketing trio only: meta, keyword intent, H1 alignment, trio-internal links, schema notes, GEO note. Report to CMO. Do not spawn. Do not mark complete. production_status: skipped.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/telltail/business-idea/14-pages/02-onpage-seo.md` | Canonical meta + briefs + JSON-LD sketches for `/`, `/how-it-works`, `/pricing` |
| `docs/projects/telltail/business-idea/HANDOFFS/14-seo-manager.md` | This handoff |

Local Mac only (`/Users/cbsuperpatch/Desktop/ClaudeSkills/docs/projects/telltail/business-idea/`). Not OneDrive.

**Not written:** `14-pages/home.md`, `how-it-works.md`, `pricing.md`, ASO listing copy, `16-seo.md`, `14-pages/assets/`, `SOURCES/INDEX.md`.

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | fast-ops (position + packet pin) |
| llm_model | composer-2.5 (pinned) |
| generation_profile | none |
| generation_used | none |
| fallback_applied | **true** — this worker executed as Grok, not composer-2.5. Parent should keep `llm_model: composer-2.5` and leave `fallback_applied: true`. |

## Production (shippable phases — required)

| Field | Value |
|-------|-------|
| production_status | skipped |
| production_paths | none |
| design_brief_path | *(empty — no imagery / no Layer B)* |
| photoreal_qa | *(empty)* |
| wire_owner | none |
| wire_notes | Paper meta. No live site. No store. JSON-LD not in a `<head>`. |
| skip_reason | Paper meta / on-page briefs. No live site. No store. Schema not deployed. |

Honest skip, not a hidden complete.

## SDK correlation (optional)

| Field | Value |
|-------|-------|
| sdk_runtime | n/a |
| sdk_agent_id | n/a |
| sdk_run_id | n/a |
| sdk_request_id | n/a |

## Decisions

- Titles follow ★ H1 language; we did not keyword-front “dog training app” onto Home.
- How-it-works brand suffix dropped from `<title>` to stay ≤60; OG may keep it.
- Pricing title = first ★ clause + $12/$99 (full H1 stays on-page at 69c).
- Schema: Organization + WebApplication; HowTo on How; Offer + FAQ on Pricing; **never** LocalBusiness.
- Internal links: trio only. Harvest routes `noindex` until a later pass.
- In-thread cards: noindex. Not SEO routes.
- No ASO listing copy.

## Asks for manager (`ask_manager`)

- Peer help needed: none
- Clarification needed: none

## Risks / blockers

- No origin — canonicals and JSON-LD stay `{origin}` until counsel/ops name a host that is **not** telltail.com.
- Name collision with Telltail Dog Training (Little Rock) is still a brand/legal item; footer + `disambiguatingDescription` only.
- FAQPage is invalid if Copy does not show the Qs — sketches are conditional.
- If A+C or K1 fails, withdraw Plus Offer schema and the Pricing title’s $12 framing with the paywall.
- Qualitative keywords can be overwritten by a real Ahrefs/GSC export later.

## Packs used

| Pack | Decision tied to pack |
|------|------------------------|
| `skills/community/notfair-seo/meta-tags-optimizer/` | Counted titles/descriptions; kept ★ H1 language; cut How-it-works brand suffix at 70c. |
| `skills/community/notfair-seo/seo-page/` | Skipped live scored audit (no URL / no GSC). Applied indexability, one H1, trio-only links on paper. |
| `skills/community/notfair-seo/schema-markup-generator/` | Organization + WebApplication + HowTo + Offer + FAQ. Banned LocalBusiness and AggregateRating. |
| `skills/community/inference-sh/seo-content-brief/` | Per-route intent briefs from Phase 2 clusters + Copy H2s. No invented word-count vs SERP. |
| `skills/community/notfair-seo/geo-optimizer/` | No fabricated evidence; GEO harvest deferred to C/B spokes; no `llms.txt`. |
| `skills/org/HANDOFF-TEMPLATE.md` | This file follows the IC template. |

## Page checklist

| Route | Title ≤60 | Desc ≤155 | ★ H1 aligned | Keywords (intent) | Trio links | Schema recs | robots |
|-------|-----------|-----------|--------------|-------------------|------------|-------------|--------|
| `/` | 57c ✓ | 118c ✓ | ★ + brand ✓ | dog training tool / body language ✓ | How + Pricing ✓ | Organization + WebApplication ✓ | index,follow *when live* |
| `/how-it-works` | 59c ✓ | 148c ✓ | title = ★ ✓ | how Telltail works ✓ | Home + Pricing ✓ | WebApplication + HowTo + FAQ* ✓ | index,follow *when live* |
| `/pricing` | 47c ✓ | 118c ✓ | first clause + SKU ✓ (on-page H1 full 69c) | Plus 60 / $12 ✓ | Home + How ✓ | WebApplication + Offer + FAQ* ✓ | index,follow *when live* |
| In-thread cards | n/a | n/a | n/a | n/a | n/a | none | **noindex** |
| `/vs-dog-translator` · `/science` · C/B spokes | not this pass | — | — | later | not in v1 nav | later | **noindex until then** |

\*FAQPage only if the questions are visible on the page.

## Do not

- Mark the phase complete
- Write the manager brief
- Write outside write_lease
- Spawn other positions
- Invent search volumes or GSC clicks
- Title any page translator / buy Traini keywords
- Promote harvest routes into v1 nav
- Ship LocalBusiness schema
- Write ASO store listing copy
- mkdir `14-pages/assets/`
- Inherit a parent model (tier pinned: fast-ops / composer-2.5; fallback recorded honestly)

Phase 14 is **not** marked complete.
