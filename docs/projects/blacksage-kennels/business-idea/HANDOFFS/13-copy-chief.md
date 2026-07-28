---
phase: "13"
position: copy-chief
reports_to: cmo
status: done
verdict_for_manager: ready_to_merge
llm_tier: creative-language
llm_model: composer-2.5-fast
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Copy Foundation REDO → CMO

## Goal (from context packet)

Full replace of v1 copy foundation (cinematic landing + `/apply` + heritage scroll H2 system) with trust-first **multi-page** copy system aligned to Phase 12 REDO IA. Deliver `13-copy-foundation.md` and this handoff. Do not mark phase complete.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/13-copy-foundation.md` | Complete v2 replace — 13 sections, multi-page IA |
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/13-copy-chief.md` | This REDO handoff |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | creative-language |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false |

## Decisions

- **v1 rejected entirely:** Scroll narrative (Heritage → Structure → Temperament → Trust → Apply), `/apply` route, scroll-linked ★ H2s as section system, "Scroll" hint, CTA in viewport 1, tagline-as-hero.
- **Multi-page IA locked:** `/`, `/dogs`, `/health`, `/about`, `/inquire` — pillars map to routes, not scroll depth.
- **CTA lock:** Button copy **Begin your inquiry** only; nav label **Inquire**; never Buy / Apply now / Reserve / Shop.
- **Proof before inquire:** Home leads with proof summary band (4 cells); tertiary inquire band at bottom; no primary inquire CTA above fold.
- **★ Home h1/subhead:** "German / ADRK-aligned Rottweilers" + evidence-led subhead (Tier 1).
- **★ Proof band bodies:** Standards-aligned (ADRK/FCI No. 147) · Health approach (testing categories) · Our dogs (count or coming soon) · Deliberate placement (selective inquiry).
- **★ Dogs empty state:** "Breeding stock profiles are coming soon." — exact string per Phase 12 wireframe.
- **★ Health H2s:** `#standards` ADRK/FCI Standard No. 147 · `#testing` Health testing approach · `#temperament` Temperament within the standard · `#placement` Our placement process.
- **★ Package A/B:** A "Join our interest list" / B "Submit inquiry for waitlist consideration" — deposit-after-approval, no amount.
- **★ Confirmation:** "Inquiry received" — calm, no confetti.
- **Tagline:** "Power with nobility." relegated to optional footer/supporting line; evidence-led credibility leads.
- **Placeholders:** `[LOCATION]`, `[CONTACT]`, `[OPERATOR_STORY]`, `[HEALTH_TESTS]`, `[DOG_COUNT]`, etc. — no invented kennel facts.
- **v1 ★ H2s banned as scroll system:** "Born of German standard." / "Built to standard." / "Steady by nature." / "Trust earned in the details." — not restored as scroll beats; `#temperament` alt only if needed.

## Asks for manager (`ask_manager`)

- Peer help needed: none
- Clarification needed: none — operator placeholders ([OPERATOR_STORY], Q1/Q2/Q7) remain until operator input; copy is Tier 1-safe

## Risks / blockers

- Tier 2 copy (named dogs, OFA links, operator bio) blocked on operator facts — placeholders documented in §9.
- Package B form copy live only when Q1 = active program.
- `[CONTACT]` in error copy should be omitted or generic until Q2 if email not configured.

## Packs used

- `skills/org/positions/copy-chief/SKILL.md`
- `skills/community/marketingskills/copywriting/SKILL.md`
- `skills/user/natural-human-voice/SKILL.md`
- `skills/community/advertising-skills/skills/copy-chief/headline-matrix/SKILL.md`
- `skills/community/advertising-skills/skills/qa/generic-language-killer/SKILL.md`

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Restore v1 scroll/heritage copy system or `/apply` route language

## ★ Headline picks summary (for CMO / Phase 14)

| Surface | ★ Pick |
|---------|--------|
| Home h1 | German / ADRK-aligned Rottweilers |
| Home subhead | Evidence-led breeding — health transparency, standards-informed education, and deliberate placement. |
| Proof — Standards | ADRK / FCI No. 147 type |
| Proof — Health | Testing categories overview |
| Proof — Dogs | [DOG_COUNT] or Profiles coming soon |
| Proof — Process | Selective inquiry process |
| Dogs h1 | Breeding stock |
| Dogs empty | Breeding stock profiles are coming soon. |
| Health h1 | Health & education |
| Health `#standards` | ADRK / FCI Standard No. 147 |
| Health `#testing` | Health testing approach |
| Health `#temperament` | Temperament within the standard |
| Health `#placement` | Our placement process |
| About h1 | About Blacksage Kennels |
| About gap | Our story is being prepared. |
| Inquire A | Join our interest list |
| Inquire B | Submit inquiry for waitlist consideration |
| Confirmation | Inquiry received |
