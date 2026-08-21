---
phase: "0"
manager: "cfo"
ics_spawned: []
status: ready_for_csuite
recommendation: revise
llm_tier: frontier-reasoning
llm_model: grok-4.5
generation_profile: none
generation_used: none
fallback_applied: false
tool_status: "stripe/obsidian-secrets unused; public list prices via official pages + live fetch 2026-08-21"
---

# Manager brief — Telltail — Phase 0 (CFO peer)

## Operator brief (plain English)

The $9–13 seed holds if each read is **one Flash-class multimodal LLM call** capped at **60 included reads**. Founder locked both the stack (multimodal LLM) and the cap (60). It still breaks if those 60 are frontier+thinking (Opus / Sol): ~$5.1–$5.7 COGS vs $6.30 net on $9 after 30%. Apple’s take is still the bigger bite on Flash. Packaging revise stands — metered Plus + credits — no 4B, phase not complete.

## What we found

- **Stack lock (this thread). [F]** Operator: “we are using a multimodal llm for this.” COGS is API tokens in/out. No custom vision model, no on-device specialist, and no “cheap classifier then LLM” assumed.
- **Flash-class 10s video is pennies. [F] list price × [A] tokens.** Gemini 2.5 Flash-Lite ~$0.0005–$0.0012 / read; 2.5 Flash ~$0.002–$0.006. Official: https://ai.google.dev/gemini-api/docs/pricing (retrieved 2026-08-21). Video tokenize ~300 tok/s default / ~100 tok/s low (https://ai.google.dev/gemini-api/docs/video-understanding).
- **Frontier 8-frame + thinking can erase a cheap Plus. [F]×[A]** Claude Opus 5 ~$0.085 / read; GPT-5.6 Sol ~$0.095. At 80 reads/mo that is ~$6.83–$7.57 COGS vs $6.30 net on a $9 plan after 30% store take — **negative contribution**.
- **Store take dominates Flash COGS. [F]** Apple Small Business 15% (https://developer.apple.com/app-store/small-business-program/); standard 30%. $9 → $7.65 / $6.30 net. Google Play subscriptions typically 15% first $1M (https://support.google.com/googleplay/android-developer/answer/112622). iOS-first: model Apple.
- **Included reads locked at 60. [F]** Operator this thread: “60.” 20 / 80 remain sensitivities only. No subscribers or revenue invented. Free 3–5 Flash still ~$0.003–$0.03 / user / mo.

## Next steps

1. **Orchestrator** — merge this into the Phase 0 peer set. Relay the multimodal-LLM lock to CEO, CMO, COO, HoR so nobody sizes a custom-vision or on-device stack. Do not mark Phase 0 complete. Do not spawn FP&A / PMM / Fundraising Lead.
2. **CEO** — accept a **revise** on packaging, not a kill: Plus must be metered; default model is Flash-class; frontier is a cascade, not the hot path.
3. **Operator:** included reads answered (**60**). Budget/timeline stay founder-only and non-blocking; I will not invent a raise.

## Summary (5 bullets max)

- Unit works on Gemini 2.5 Flash / Flash-Lite (or GPT-5.6 Luna / Gemini 3.1 Flash-Lite) at **60 included** reads (~$0.03–$0.37 vision COGS).
- Kill / reprice if Plus is unlimited frontier, or if every tap is 2–3 Opus/Sol retries.
- Credits ($8–12 / 20) have ~$0.28–$0.51 / read budget after store take — plenty for Flash, tight only if every credit is frontier+thinking.
- Annual $79 after 30% is $4.61 / mo — **60 Flash is fine**; **60 Opus/Sol think is a kill** on that SKU.
- Phase 4B: skip. Explore is bootstrap until founder names a budget.

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| — | — | none spawned (Phase 0 peer) | — | none |

## Model routing check

- [x] No IC packets
- [x] This seat used `frontier-reasoning` / grok-4.5
- [x] No generation profile required
- [x] No fallback

## Conflicts resolved

- Founder/operator stack = multimodal LLM. **Accepted.** Prior intake “cloud vs on-device unknown” is still open for *where* the call runs; *what* runs is an LLM, not a purpose-built CV model.
- CMO note that $9–13 WTP is unproven: **agreed.** This brief tests cost-to-serve, not willingness to pay.

## Artifacts for C-suite review

| Path | Scorecard check |
|------|-----------------|
| `docs/projects/telltail/business-idea/00-intake.md` | Pricing seed + vision-COGS ask |
| `HANDOFFS/0-manager-cfo.md` | This brief |

## Production check (shippable phases)

| Field | Value |
|-------|-------|
| production_status (merged) | skipped |
| Layer B paths | none |
| wire_owner | n/a |
| skip_reason | Phase 0 is not a shippable / Office phase |

## Escalation tags

- spend (vision / multimodal API COGS vs seed)
- scope (metered vs unlimited Plus)

## Asks for C-suite

- Log the stack: **multimodal LLM per read**.
- Do not treat $9–13 as an unlimited-read price.
- Keep 4B closed. Do not spawn finance ICs.
- After peer merge, CEO issues the Phase 0 verdict. This seat does not approve the phase.

## Recommendation

**revise** — keep exploring, change the seed’s packaging:

| Keep | Change |
|------|--------|
| $9–13/mo and $79–99/yr as a **price band** | Add a **hard included-read cap: 60 Flash-class reads / mo** (operator lock 2026-08-21). Overage = credits. |
| Free 3–5 / mo | Serve free **only** on Flash-Lite / Luna. Never Opus / Sol on the free path. |
| Trainer seat $29–49 later | Out of v1 COGS. Ignore for this brief. |
| Credit pack $8–12 / 20 | Prefer this over raising list price if COGS spikes. |

**Do not kill** on COGS if the default path is one Flash-class multimodal call.

---

## Economics (peer substance)

Label key: **[F]** public list price or official tokenize rule, retrieved 2026-08-21 · **[A]** working assumption · **[I]** inference

### Unit definition

One **read** = one owner clip (or stills) → one multimodal LLM request → what-we-see + state + 1–3 next-60s actions + safety escalate. **[A]** aligned to intake; stack confirmed multimodal LLM **[F]** this thread.

Two-pass (vision call + second writer call) and user retries multiply COGS. Shown as sensitivities, not the base.

### Architecture cases [A]

| ID | Shape | Token recipe used |
|----|--------|-------------------|
| A | 8 stills from a ~10s clip, ~768px | Claude: ⌈768/28⌉² = 784 tok/image ([vision docs](https://platform.claude.com/docs/en/build-with-claude/vision)). OpenAI high-detail 768²: 85 + 4×170 = 765 tok ([images-vision](https://developers.openai.com/api/docs/guides/images-vision)). Gemini 2.5: 258 tok/frame. Gemini 3 default image: 1120 tok. Plus 800 text in / 400 text out. |
| B | Native ~10s video | Gemini 2.5 default ~300 tok/s (258 frame + 32 audio); low ~100 tok/s. Gemini 3 default video ~70 tok/frame (~100 tok/s). Plus 800 / 400. |
| C | Cascade | 80% Architecture B on Flash-Lite; 20% escalate to Opus 5, 8 stills, 2k thinking tokens. |

Thinking / “including thinking tokens” billed as output on Gemini and material on Claude/OpenAI reasoning: **[A]** 2,000 extra output tokens on the “think” column. If product needs 4k+ thinking, double that column.

### Public list prices used [F]

| Vendor | Model | Input / 1M | Output / 1M | Source |
|--------|-------|------------|-------------|--------|
| Google | Gemini 2.5 Flash-Lite | $0.10 (text/image/video) | $0.40 | [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) |
| Google | Gemini 2.5 Flash | $0.30 | $2.50 | same |
| Google | Gemini 2.5 Pro (≤200k) | $1.25 | $10.00 | same |
| Google | Gemini 3.1 Flash-Lite | $0.25 | $1.50 | same |
| Google | Gemini 3.7 Flash (promo through 2026-12-31) | $0.75 | $3.75 | same (rises to $1.50 / $7.50 on 2027-01-01) |
| Anthropic | Haiku 4.5 | $1 | $5 | [anthropic.com/pricing](https://www.anthropic.com/pricing) |
| Anthropic | Sonnet 5 | $2 | $10 | same |
| Anthropic | Sonnet 4.6 | $3 | $15 | same |
| Anthropic | Opus 5 | $5 | $25 | same |
| OpenAI | GPT-5.6 Luna | $0.20 | $1.20 | [developers.openai.com pricing](https://developers.openai.com/api/docs/pricing) |
| OpenAI | GPT-4.1 | $2.00 | $8.00 | [GPT-4.1 model card](https://developers.openai.com/api/docs/models/gpt-4.1) |
| OpenAI | GPT-4o | $2.50 | $10.00 | [GPT-4o model card](https://developers.openai.com/api/docs/models/gpt-4o) |
| OpenAI | GPT-5.6 Terra | $2.00 | $12.00 | [OpenAI pricing](https://developers.openai.com/api/docs/pricing) |
| OpenAI | GPT-5.6 Sol | $5.00 | $30.00 | same |

Gemini 2.0 Flash is **shut down** (deprecated 2026-06-01) — do not plan on it.

Batch / Flex ~50% off on several Gemini SKUs is **not** assumed for interactive reads.

### Cost per read (arithmetic)

Formula: `(input_tokens × input_$ / 1e6) + (output_tokens × output_$ / 1e6)`.

| Path | In tokens | $ / read (400 out) | $ / read (2k think out) |
|------|-----------|--------------------|-------------------------|
| Gemini 2.5 Flash-Lite · B 10s default | 3,800 | $0.0005 | $0.0012 |
| Gemini 2.5 Flash · B 10s default | 3,800 | $0.0021 | $0.0061 |
| Gemini 2.5 Pro · B 10s default | 3,800 | $0.0088 | $0.0248 |
| Gemini 3.1 Flash-Lite · B ~100 tok/s | 1,800 | $0.0010 | $0.0034 |
| Gemini 3.7 Flash promo · B ~100 tok/s | 1,800 | $0.0029 | $0.0089 |
| Gemini 3.7 Flash promo · A 8×1120 | 9,760 | $0.0088 | $0.0148 |
| GPT-5.6 Luna · A 8 stills | 6,920 | $0.0019 | $0.0038 |
| GPT-4.1 · A 8 stills | 6,920 | $0.0170 | $0.0298 |
| GPT-4o · A 8 stills | 6,920 | $0.0213 | $0.0373 |
| GPT-5.6 Terra · A 8 stills | 6,920 | $0.0186 | $0.0378 |
| GPT-5.6 Sol · A 8 stills | 6,920 | $0.0466 | $0.0946 |
| Claude Haiku 4.5 · A 8 stills | 7,072 | $0.0091 | $0.0171 |
| Claude Sonnet 5 · A 8 stills | 7,072 | $0.0181 | $0.0341 |
| Claude Sonnet 4.6 · A 8 stills | 7,072 | $0.0272 | $0.0512 |
| Claude Opus 5 · A 8 stills | 7,072 | $0.0454 | $0.0854 |
| Cascade C (80% Flash-Lite B + 20% Opus think) | — | — | **$0.0175** |
| Two-pass: Flash B + Sonnet 5 text (~1.5k/400) | — | **$0.0091** | — |
| 2× retry Flash think | — | — | $0.0123 |
| 2× retry Opus think | — | — | $0.1707 |

Live camera: Gemini 3.1 Flash Live lists image/video at $1.00 / 1M **or** $0.002 / min ([same pricing page](https://ai.google.dev/gemini-api/docs/pricing)). A 10s live slice is still cents. Long live sessions with audio-out ($12 / 1M on that SKU) are a different product — do not put live-unlimited on $9 Plus. **[I]**

### Monthly vision COGS vs net ARPU (no other opex)

Net after store, **no users assumed**:

| List | After 15% | After 30% |
|------|-----------|-----------|
| $9 / mo | $7.65 | $6.30 |
| $11 / mo | $9.35 | $7.70 |
| $13 / mo | $11.05 | $9.10 |
| $79 / yr | $67.15 ($5.60 / mo) | $55.30 ($4.61 / mo) |
| $99 / yr | $84.15 ($7.01 / mo) | $69.30 ($5.77 / mo) |
| $8 / 20 credits | $6.80 ($0.34 / read) | $5.60 ($0.28 / read) |
| $12 / 20 credits | $10.20 ($0.51 / read) | $8.40 ($0.42 / read) |

Contribution on **$9 / 30% = $6.30 net** (worst store case we should plan):

| Path | 20 reads | 40 reads | 80 reads | CM @ 80 / $6.30 |
|------|----------|----------|----------|-----------------|
| Flash-Lite B | $0.01 | $0.02 | $0.04 | ~99% |
| Flash B + think | $0.12 | $0.25 | $0.49 | ~92% |
| 3.7 Flash promo B + think | $0.18 | $0.35 | $0.71 | ~89% |
| Cascade C | $0.35 | $0.70 | $1.40 | ~78% |
| Opus 5 A + think | $1.71 | $3.41 | $6.83 | **−8% (kill)** |
| Sol A + think | $1.89 | $3.78 | $7.57 | **−20% (kill)** |

Free tier 3–5 reads: Flash-Lite **~$0.002–$0.006 / user / mo**; Opus think **~$0.26–$0.43**. Free is a cost center. I will not guess attach rate. If free is large and served on frontier, cash burns before any Plus dollar. **[I]**

### Does the unit work?

**Yes**, if:

1. Default model is Flash-class multimodal (Gemini 2.5 Flash / Flash-Lite, Gemini 3.1 Flash-Lite, or GPT-5.6 Luna).
2. Plus has a **hard included-read cap of 60** / mo. **[F]** operator 2026-08-21.
3. Frontier (Sonnet / Terra / Pro / Opus / Sol) is a **confidence / safety cascade**, not 100% of traffic.
4. Free is 3–5 on the cheap SKU only.
5. We are on Apple Small Business 15% or we still have ~90%+ vision CM after 30% on the Flash path.

**No / reprice**, if any of the kill triggers below fire.

### Kill or reprice triggers

| Trigger | Why | Action |
|---------|-----|--------|
| Plus sold as unlimited + users hit ~80 frontier+think reads | Opus/Sol COGS > $6.30 net on $9 / 30% | **Kill unlimited.** Cap + credits. Or reprice ≥ $13 and still cap. |
| Every read is 2–3 Opus/Sol retries (bad clip / “try again”) | $0.17–$0.28 / tap; 40 taps ≈ $7–$11 | Rate-limit retries; first retry on Flash only. |
| Accuracy review says Flash-class cannot do the safety job | Then unit is frontier-shaped; $9 unlimited dies | Either raise + cap hard, or **kill** until a cheaper accurate path exists. |
| Free served on Opus/Sol at scale | Cash leak; no revenue | Free = Lite only, or kill free. |
| Live session billed as minutes of audio-out, bundled into $9 | Different COGS shape | Separate SKU or disable live on Plus. |
| Gemini 3.7 Flash promo expires 2027-01-01 | Input/output **2×** on that SKU | Default v1 on 2.5 Flash / Flash-Lite, not the promo. |
| Apple proceeds > $1M and we lose SBP 15% | Net on $9 drops from $7.65 → $6.30 | Still fine on Flash; **recheck** if we have shifted to frontier. |
| Refunds on “wrong read” | Unknown; not priced | COO/product; treat as a later leak, not a Phase 0 kill. |
| GPT-4o-mini at `detail=high` as the “cheap” default | Official tile tokens are 2,833 + 5,667/tile — **~$0.031/read**, more than GPT-4o high (~$0.021). [F] https://developers.openai.com/api/docs/guides/images-vision | Use `low`, 4.1-mini, or Gemini Flash. Never mini-high. |
| OpenAI/Claude native video as the v1 path | No public understand-video SKU. Sora-2 is **generation** ($0.10/s) — $1/10s read. | Video reads = Gemini (or later Nova if $ is published). |


**60 included (locked) vs net [F×A]**

| Path | 60-read COGS | CM on $9 / 30% ($6.30) | CM on $79 yr / 30% ($4.61/mo) |
|------|--------------|------------------------|-------------------------------|
| Flash-Lite B | $0.03 | 99% | 99% |
| Flash B + think | $0.37 | 94% | 92% |
| Cascade C (20% Opus think) | $1.05 | 83% | 77% |
| Opus 5 A + think | $5.12 | **19% — reprice/kill** | **negative — kill** |
| Sol A + think | $5.68 | **10% — kill** | **negative — kill** |

60 Flash-class **clears**. 60 frontier+think does **not** on $9 or $79 after Apple 30%.

I am **not** killing Telltail on COGS today. I **am** rejecting an uncapped $9–13 “unlimited multimodal” offer.

### Funding / 4B

- Founder budget: **unknown — founder only.** I will not invent a raise, ARR, or runway.
- 4B: **skip.** Vision COGS at Flash-class does not require outside capital.
- Explore spend = API evals + a small labeled-clip set. Order-of-magnitude only: a 1,000-clip Flash eval is **< $10** at these list prices. **[I]** from the table, not a budget request.

### Anti-patterns

- Do not price as if on-device is free (stack is an LLM).
- Do not use PE LTV/CAC / NDR — zero customers.
- Do not use competitor download counts as revenue.
- Do not put “unlimited reads” on a consumer Plus to win the App Store screenshot.
- Do not default to GPT-4o-mini `detail=high` (official tiles make it costlier than GPT-4o high).
- Gemini tokenize pages differ slightly (tokens guide **263 tok/s** vs video-understanding **~300 tok/s** incl. audio). Both keep Flash B near **$0.002/read** — not a verdict change.

## Decisions

- Stack for costing: **multimodal LLM per read.** **[F]** operator this thread.
- Working default path: Gemini 2.5 Flash or Flash-Lite, native short video (Architecture B), **60 included**. **[A]/[F]**
- Seed $9–13 / $79–99 is a **band**. Included reads on Plus = **60**. **[F]**
- 4B closed. No finance ICs.

## Asks for manager (`ask_manager`)

- Peer help needed: none (HoR demand / CMO WTP / COO claims are their briefs; I am not spawning)
- Clarification needed: none (included reads = 60).

## Risks / blockers

- Accuracy may force frontier (CTO + HoR). That is the only COGS path that actually kills $9 Plus.
- Promo Gemini 3.7 Flash expires; do not build v1 COGS on a sunset rate.
- Annual $79 after 30% is $4.61 / mo — easy to over-grant reads.
- Free:paid mix unknown; I will not paper over it with a conversion guess.

## Packs used

| Pack | Decision tied to pack |
|------|------------------------|
| `skills/community/awesome-claude-corporate-skills/02-finance-accounting/unit-economics/` | Contribution after store take only; refused LTV/CAC/NDR with no customers |
| `skills/community/marketingskills/pricing/` | Value metric = **metered reads**, not an unlimited seat; credits as the overage metric |
| `skills/org/HANDOFF-TEMPLATE.md` / `MANAGER-BRIEF-TEMPLATE.md` | Phase 0 peer path `0-manager-cfo.md`; no IC spawn |

## Do not

- Mark the phase complete
- Write outside this handoff
- Spawn FP&A, PMM, Fundraising Lead, or peer managers
- Invent revenue, subscribers, TAM, or a raise
- Self-approve the C-suite review
