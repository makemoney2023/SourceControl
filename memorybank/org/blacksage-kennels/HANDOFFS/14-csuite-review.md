---
phase: "14"
reviewer: "ceo-strategist"
secondary_reviewers: []
verdict: approve
label: REDO
supersedes: "v1 Phase 14 csuite approve (homepage.md + apply.md two-route set)"
date: 2026-07-27
llm_tier: frontier-reasoning
llm_model: cursor-grok-4.5-high-fast
fallback_applied: false
---

# C-suite review — Phase 14 (Page content REDO)

## In plain English

Phase 14 page content **REDO is approved**. The v1 two-route set (`homepage.md` + `apply.md` scroll/apply IA) is dead for build — this review **supersedes** the prior Phase 14 approve. All five Must routes ship body + meta, proof-first Home, `/inquire` with Package A/B language, and CTA **Begin your inquiry**. Safe next step is **Phase 9 rebuild via `cto`**. Operator placeholders stay open — not a revise reason. This seat does **not** mark RUNBOOK-TRACKER complete.

## What we found

- **REDO is a full replace, not a patch:** `14-pages/` now indexes `home` / `dogs` / `health` / `about` / `inquire` with body ✅ + meta ✅. v1 `homepage.md` and `apply.md` are deprecated stubs with 301 notes. Prior csuite approve for homepage+apply is **not binding**.
- **D2 trust-first holds:** Home leads with ★ H1 + four-cell proof band (Standards / Health / Dogs / Process); no primary CTA above fold; inquire is tertiary bottom band only. CTA copy locked to **Begin your inquiry** — no Buy / Apply now / Reserve.
- **Packages + placeholders clean:** Inquire carries Package A ("Join our interest list") and Package B ("Submit inquiry for waitlist consideration"); Package C education-only on `/health#placement`. Bracketed tokens only (`[LOCATION]`, `[CONTACT]`/`[CONTACT_EMAIL]`, `[HEALTH_TESTS]`, `[OPERATOR_STORY]`, `[RESPONSE_EXPECTATION]`, etc.) — no invented prices, FOMO, or kennel facts.
- **Aligned to Phase 12 IA + Phase 13 ★ picks:** Multi-page nav path; Home proof pathway; Health anchors `#standards` `#testing` `#temperament` `#placement`; Dogs empty state; About operator gap. ★ H1s match foundation (German/ADRK-aligned; Breeding stock; Health & education; About Blacksage Kennels; Begin your inquiry).
- **Process complete:** Manager brief `14-manager-cmo.md` (recommend approve) + IC REDO handoffs (copy-chief, seo-manager, content-strategist) present; model tiers correct; generation `none`.

## Next steps

1. **Orchestrator** — Mark Phase 14 ✅ (**REDO**). Advance **Phase 9 rebuild via `cto`** (multi-page App Router against Phase 12 design + these page files). Do **not** treat prior v1 Phase 14 approve as authoritative. Do **not** build from deprecated stubs.
2. **CTO / tech-lead** — Implement Must routes from `home.md` / `dogs.md` / `health.md` / `about.md` / `inquire.md`; 301 `/apply` → `/inquire`; keep placeholders until operator fills contact/health/story.
3. **Operator (parallel, non-blocking)** — Supply `[LOCATION]`, `[CONTACT]`/`[CONTACT_EMAIL]`, `[OPERATOR_STORY]`, `[HEALTH_TESTS]`, `[RESPONSE_EXPECTATION]`, Q1 Package A vs B mode before launch contact/schema (Phase 16).

## Inputs reviewed

- Manager brief: `HANDOFFS/14-manager-cmo.md` (REDO — recommendation approve)
- IC handoffs: `HANDOFFS/14-copy-chief.md`, `14-seo-manager.md`, `14-content-strategist.md`
- Key artifacts: `14-pages/README.md`, `home.md`, `dogs.md`, `health.md`, `about.md`, `inquire.md`
- Deprecated stubs verified: `14-pages/homepage.md`, `14-pages/apply.md`
- Foundations: `13-copy-foundation.md` (REDO ★ + packages), `12-web-design.md` (multi-page IA), `05-prd.md` (Must routes + CTA + packages)
- Prior artifact superseded: this file’s previous v1 **approve** (homepage + apply only)
- Scorecard source: operator task Phase 14 REDO hard gate + ORG-REGISTRY Phase 14

## Scorecard (Phase 14 REDO hard gate)

| Criterion | Pass? | Notes |
|-----------|-------|-------|
| All Must routes have page files with body + meta: home, dogs, health, about, inquire | yes | Five files complete; README indexes Must set; meta titles/descriptions merged per SEO handoff |
| `apply.md` deprecated; `inquire.md` is primary CTA page | yes | Stubs point to replacements; CTA/route = `/inquire` + Begin your inquiry; build 301 `/apply` → `/inquire` |
| Proof band / trust-first D2 voice; CTA "Begin your inquiry" (never Buy/Apply now) | yes | 4-cell proof band; tertiary inquire; no Buy/Apply now/Reserve/Shop in live copy |
| Package A/B on inquire; placeholders only — no invented facts/prices/FOMO | yes | A/B mode headers + form; C on `/health#placement`; bracketed operator tokens only |
| Aligns Phase 12 IA + Phase 13 ★ headlines | yes | Multi-page IA; ★ H1s and proof/placement frameworks match foundation |
| Explicit REDO supersedes v1 homepage+apply approve | yes | README, manager brief, IC handoffs, and this review all label REDO / supersedes |
| Manager brief + IC handoffs present | yes | `14-manager-cmo.md` + copy-chief / seo-manager / content-strategist REDO handoffs |
| Correct model tier used? | yes | copy-chief creative-language; seo fast-ops; content-strategist strong-general; CMO + this review frontier-reasoning |
| Generation profile correct (11/12/15/19)? | n/a | Phase 14 text-only; `generation_profile: none` |

## Verdict

**approve** — orchestrator may mark Phase 14 ✅ (**REDO**). Prior v1 Phase 14 approve (homepage + apply) is **superseded**.

## Comments for manager

- Ship REDO as-is. No material revisions.
- Build must consume `home.md` / `inquire.md` (not deprecated stubs).
- Brand-designer skip for this copy gate is acceptable; Phase 9 / creative track owns visual polish against Phase 12.
- Operator open items → placeholders through Phase 9/16; invent nothing at build time.

## Decisions to log in RUNBOOK-TRACKER

- Phase 14 C-suite: **approve** — label **REDO** (2026-07-27); supersedes v1 homepage+apply approve
- Next phase owner: **cto** → Phase 9 rebuild (multi-page Must routes + 301 `/apply` → `/inquire`)
- Operator deps remain open (non-blocking for this gate): Q1 package mode, Q2 contact/location, health inventory, operator story, Q7 response SLA
