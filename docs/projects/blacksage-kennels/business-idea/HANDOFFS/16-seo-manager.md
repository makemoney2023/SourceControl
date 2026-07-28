---
phase: "16"
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

# Handoff — Phase 16 Technical SEO → CMO

## Goal (from context packet)

Produce `16-seo.md`: technical SEO checklist, keyword map by page, directory/submission list (breed-appropriate; no spam), structured data recommendations, AI/SEO notes if relevant. Write `HANDOFFS/16-seo-manager.md`.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/16-seo.md` | Full Phase 16 deliverable — technical checklist, keyword map (5 Must routes), directories, schema, AI/SEO, prioritized implementation order |
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/16-seo-manager.md` | This handoff |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | fast-ops |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false |

## Decisions

- Phase 14 meta titles/descriptions referenced, not rewritten — implemented in `lib/content/page-meta.ts` ✅.
- Sitemap and robots scoped to Must routes only; `/apply` and `/litters` excluded.
- Trailing slash policy: no trailing slash; enforce via `metadataBase` + canonicals.
- `Organization` JSON-LD recommended at launch when domain + real email confirmed; `LocalBusiness` gated on Q2 `[LOCATION]` + NAP.
- FAQ schema deferred unless visible FAQ blocks added — no schema without on-page Q&A match.
- Geo keywords and Google Business Profile explicitly **blocked until Q2** operator facts.
- Directory list limited to credible breed/club/health registry channels; spam farms explicitly excluded.
- Programmatic SEO rejected at launch — `/dogs/[slug]` manual Tier 2 only when inventory exists.
- AI bot policy: recommend Allow for major search/citation bots so `/health` education can be cited.
- Build gaps documented: missing `sitemap.ts`, `robots.ts`, `metadataBase`, canonicals, OG/Twitter, JSON-LD — eng P0/P1.

## Asks for manager (`ask_manager`)

- Peer help needed: **none**
- Clarification needed: **none** for merge — operator Q2 facts remain placeholders per guardrails.
- **Eng delegation:** CMO should route P0 items (sitemap, robots, metadataBase, canonicals) to CTO/tech-lead — not in seo-manager write lease.

## Risks / blockers

- **Medium:** Launch without sitemap/robots/metadataBase delays indexation and weakens canonical/OG signals — documented as P0 in `16-seo.md`.
- **Low:** No GSC/Ahrefs connected — keyword volumes are strategic estimates, not live data (`tool_status: unavailable` below).
- **Blocked (operator):** Local SEO, GBP, LocalBusiness schema, geo keyword targeting until Q2.

## Packs used

- `skills/community/marketingskills/seo-audit/` — crawlability, indexation, on-page, CWV framework
- `skills/community/notfair-seo/keyword-research/` — intent classification, trust-first clusters
- `skills/community/notfair-seo/schema-markup-generator/` — Organization, LocalBusiness, FAQ, Breadcrumb guidance
- `skills/community/marketingskills/ai-seo/` — AI Overviews, extractability, AI bot robots policy
- `skills/community/marketingskills/programmatic-seo/` — anti-pSEO at launch rationale

## tool_status

| tool_id | Status | Notes |
|---------|--------|-------|
| `google-search-console` | unavailable | No live domain / credentials in IC session — submission steps documented for operator post-launch |
| `google-analytics` | unavailable | Not in scope Phase 16 |
| `pagespeed-insights` | unavailable | Post-launch monitoring recommended in doc |
| `firecrawl` | not attempted | App source audited locally |
| `playwright-browser` | not attempted | Build gaps verified via source grep + `09-build-log.md` |

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Write manager brief (`16-manager-seo-manager.md`)
