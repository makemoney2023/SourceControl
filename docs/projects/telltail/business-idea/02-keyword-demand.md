# 02 — Keyword / search-demand appendix — Telltail

**Venture slug:** `telltail`  
**Date:** 2026-08-21  
**Phase:** 2 — Keyword research support  
**Owner:** seo-manager  
**Reports to:** head-of-research  
**Status:** qualitative only — no volume tool  
**llm_tier:** strong-general  
**llm_model:** grok-4.5  
**generation_profile:** none  
**fallback_applied:** true (packet `strong-general` prefers `composer-2.5`; this seat ran on grok-4.5)

Label key: **[F]** observed this pass · **[I]** inference · **[A]** assumption

## Scope

This appendix is search-demand intelligence for HoR merge. It does **not** write page bodies, `02-market-research.md`, `02-evidence-base.md`, `02-competitive-landscape.md`, or `16-seo.md`. Routes below are **future** Phase 14 targets only.

Markets: EN US/CA. Surfaces: Google (web) + Apple App Store (iOS-first; ASO is as important as web SEO). Founder lock: trainer / training tool, **not** translator. Naming and store category must be violently non-toy.

## tool_status

| Tool | Status | What we used instead |
|------|--------|----------------------|
| Ahrefs / Semrush / similar | **unavailable** | No export. No volumes. |
| Google Search Console | **unavailable** | No property; no site shipped. |
| App Store Connect | **unavailable** | No listing yet. |
| Firecrawl | **unavailable** (HoR Phase 0) | WebFetch + WebSearch. |
| Google Autocomplete API | **blocked** (HTTP 403 from this host, 2026-08-21) | Bing Autocomplete (`api.bing.com/osjson.aspx`) observed instead. Labeled as Bing, not Google. |
| iTunes Search / Lookup API | **observed** | Public Apple catalog search for US `entity=software`. This is **rank-in-API-results**, not impression volume. |
| Sensor Tower / data.ai | **unavailable** | Store rating *counts* cited only as public display numbers, not downloads. |

`tool_status` summary for the handoff: **qualitative only**.

## Hard rules this pass

- **No invented search volumes.** No KD scores. No opportunity formula.  
- Blog figures such as “22,200 monthly searches” for `dog translator` (flagged in HoR Phase 0) stay **discarded**.  
- Como homepage ticker ($261B / 500M / 78%) unused.  
- Play “5M+” / “50+” buckets are display bands only (already in HoR).  
- Autocomplete lists are **observed suggestions**, not demand proof.  
- iTunes `userRatingCount` is a **public rating count**, not search volume.

## Methodology

1. Seed from intake + HoR split: translator/toy vs trainer/body-language vs what-to-do-now.  
2. Expand with pack patterns (how / what / app / vs) — then **verify** each cluster against a live SERP or store search.  
3. Google SERP composition via WebSearch (US-indexed pages, 2026-08-21).  
4. Autocomplete via Bing OSJSON (2026-08-21).  
5. App Store crowding via iTunes Search API US + Lookup of named comps.  
6. Brand collision check for `telltail`.

## Head terms vs long-tail

| Cluster | Head (do not treat as “volume winners”) | Long-tail / question form | Intent |
|---------|------------------------------------------|---------------------------|--------|
| **Toy / translator** | `dog translator`, `ai dog translator`, `dog translator app`, `dog bark translator` | `what is my dog saying`, `dog translator that works`, `dog translator collar` | Entertainment / transactional-app. **Avoid as primary.** |
| **Body language (learn)** | `dog body language` | `how to read dog body language`, `dog body language chart`, `dog body language fear` | Informational. Authority SERP. |
| **What-to-do-now** | (no clean head; job is the long-tail) | `what to do when dog growls`, `dog resource guarding what to do`, `how to calm a stressed dog` | Instructional. Closest to product job. |
| **Trainer / curriculum app** | `dog training app` | `dog training apps for iphone`, `best dog training app` | Commercial. Curriculum + chat apps own it. |
| **Brand / nav** | `telltail`, `pawfessor`, `traini` | `telltail dog training`, `traini app` | Navigational. See brand collision. |

**[I]** Head “translator” terms are the loudest *app* queries and the worst brand fit. The product job lives in long-tail instruction queries that currently resolve to articles, not apps.

## Intent clusters

### A — Translator / toy (gimmick tax)

**Job:** “Talk to my dog / hear a funny line.”  
**Signals:** `translator`, `bark`, `what is my dog saying`, `game`, `free`, `collar`.  
**Bing autocomplete (2026-08-21):** `dog translator` → app / free / game / online / collar / “that works”. `what is my dog saying` → app / translator.  
**Google SERP (2026-08-21):** App Store listings and toy landing pages — e.g. [Dog Translator AI](https://apps.apple.com/us/app/dog-translator-ai-bark-talk/id6762083263), [Dog Translator*](https://apps.apple.com/us/app/dog-translator/id6743143735), [Dogt](https://dogt.app/).  
**iTunes search `dog translator` (US, 2026-08-21, 14 results):** near-duplicate Entertainment / Games titles. Top of API list includes *Dog Translator - Games for Dog* (Games, 38,065 ratings), *Dog Translator: Pet/Human Talk* (Entertainment, 2,780), *Dog Translator: Game For Dogs* (Games, 40,624). Several listings **disclaimer entertainment**. Iterica *AI Dog Translator* is filed **Entertainment** and says it is not training or science ([listing](https://apps.apple.com/us/app/ai-dog-translator/id6757875245)).  
**Verdict:** **Do not bid this cluster with title, category, or H1.** Using it inherits the BowLingual / sticker tax HoR already named. A single future `/vs-dog-translator` page can harvest commercial “is this real?” intent without becoming the category.

### B — Body language / how-to-read (learn)

**Job:** “Teach me the signals.”  
**Signals:** `body language`, `how to read`, `chart`, `pdf`, Lili Chin.  
**Bing autocomplete (2026-08-21):** `dog body language` → chart / guide / videos / pdf / quiz / Lili Chin / fear.  
**Critical:** query `dog body language app` did **not** return “app” suggestions — it rewrote to guide / poster / pdf / book. **[I]** Searchers in this cluster are not asking the store for software.  
**Google SERP (2026-08-21):** PetMD, AKC, Best Friends, Dogs Trust, independent trainer guides. No vision app in the observed top set.  
**iTunes search `dog body language` (US, 2026-08-21):** toys still leak in first; then real trainers — *Puppr - Dog Training & Tricks* (Lifestyle/Education, 27,147 ratings), *EveryDoggy* (Lifestyle/Education, 3,628). Pawfessor / PN1 / Aplexity **not** in this API page.  
**Verdict:** Pillar cluster for **web**, not the App Store title. Rank here is a long game against AKC/PetMD. Worth it for trust + GEO (question form). Do not put “translator” on this pillar.

### C — What-to-do-now (moment coach) — **primary product cluster**

**Job:** “This is happening. What do I do in the next 60 seconds — and when do I stop?”  
**Signals:** `what to do when`, `growls`, `resource guarding`, `calm a stressed dog`, `showing teeth`.  
**Bing autocomplete (2026-08-21):** `what to do when dog growls` fans into “at you / at me / over food / at my baby / how to stop.” `dog resource guarding` fans into training / food / toys / people / bed.  
**Google SERP growling (2026-08-21):** PetMD, Vetstreet, Whole Dog Journal, Purina — consensus **do not punish the growl**.  
**Google SERP resource guarding (2026-08-21):** AKC, ASPCA, Dogs Trust, Preventive Vet — management + trade + escalate; **no apps**.  
**Verdict:** This is the wedge in language. SERP is article-crowded, app-empty. Future pages should answer in 40–60 words, then refuse (vet / behaviorist) — same as product. **[A]** These queries are when a phone is most likely in-pocket; capture is unproven (HoR E3).

### D — Curriculum / trainer-app (commercial, adjacent)

**Job:** “An app that trains my dog over weeks.”  
**Signals:** `dog training app`, `puppy training`.  
**Bing autocomplete (2026-08-21):** `dog training app` → free / reviews / for iPhone; also apprenticeship / near-me (local).  
**Google SERP (2026-08-21):** listicles (PawChamp, Zigzag, Puppr, Dogo, LowKey) — human curriculum + chat, not camera.  
**Store:** Puppr, Dogo, EveryDoggy already occupy Lifestyle + Education with real rating volume.  
**Verdict:** Adjacent substitute. Telltail is not a 12-week syllabus. Do not try to out-Puppr Puppr. A future `/vs-training-apps` note is enough: we coach the *moment*, they coach the *program*.

### E — Brand / navigational

| Query | Observed (2026-08-21) | Implication |
|-------|----------------------|-------------|
| `telltail` / `telltail dog` | Bing suggests **telltail dog training**. Google: [telltaildogtraining.com](https://telltaildogtraining.com/) (Little Rock force-free trainer) + [Telltail Dog podcast](https://telltaildog.fireside.fm/). | **Name collision is live.** Web “Telltail dog training” is already a person. |
| iTunes `telltail` | 2 results: *TellaTina* (Social Networking, unrelated) and a Finance app. **No dog app.** | Store slug is free; web name is not. |
| `pawfessor` | Bing: vet clinic / cat tree / academy. | Comp brand not owned in search. |
| `traini` | Autocomplete swallowed by generic “training.” `traini app` surfaces the product. | Weak brand-query until “app” is added. |

**[I]** ASO can use Telltail as the brand word. Web must disambiguate vs the Arkansas trainer (not impersonate). Flag for CMO / Legal — not resolved here.

## Google vs App Store crowding

| Query family | Google (web) | App Store (iTunes US search) |
|--------------|--------------|------------------------------|
| Translator | Toy listings + entertainment LP. **Crowded / gimmick.** | Entertainment + Games thicket; 10³–10⁴ public ratings on toys. Vision+instruction comps **absent**. |
| Body language | Authority articles. **Crowded / high E-E-A-T.** | Toys leak; curriculum apps (Puppr) win the non-toy slots. Vision-AI (0-rating) invisible. |
| What-to-do-now | Authority + shelter/vet. **App-empty.** | Not a store query people type. |
| Training app | Listicles of syllabus apps. | Lifestyle/Education incumbents with real ratings. |
| Telltail | Trainer + podcast own it. | No dog app. |

**ASO crowding conclusion [F]:** the default indexed word on iOS is **translator**. Challenger vision apps that *want* to be trainers still put “Translator” in the title (PN1, Aplexity, Iterica). Pawfessor titled *Dog Behavior AI* (Lifestyle + Education, **0** ratings) and still does not appear in `dog translator` or `dog body language` API results this pass. Traini titled *Dog Training & Insights* (Lifestyle, **295** ratings) — the only named vision hybrid with public ratings, still emotion-first in body copy.

**ASO lock for Phase 14 (do not implement now):**

- Primary category: **Lifestyle**. Secondary: **Education**. Never Entertainment. Never Games.  
- Title / subtitle / 100-byte keyword field: **dog training, body language, behavior** — never translator / bark talk / what my dog is saying / games.  
- Screenshot captions (indexed since mid-2025 per ASO pack): show *what to do now* + refuse-first, not a “dog quote.”  
- Hidden keyword field: comma-separated, no repeats of title words. Suggested *direction* only (not a Connect export): `behavior,body language,training,growling,guarding` — confirm in Connect later.  
- Do not stuff “AI” as the differentiator; the toy cluster already did.

## Future routes (Phase 14 prep — do not write pages)

Map is one cluster → one future URL. No bodies.

| Future route | Cluster | Primary query (qualitative) | Intent | Notes |
|--------------|---------|-----------------------------|--------|-------|
| `/` | Product | `telltail` + “dog training app that reads body language” (constructed; not a volume claim) | Commercial / nav | Moment coach. No translator H1. |
| `/how-it-works` | Product | `how telltail works` (future nav) | Informational | Clip → state + confidence → 1–3 actions → refuse. |
| `/dog-body-language` | B pillar | `dog body language`, `how to read dog body language` | Informational / GEO | Compete with PetMD/AKC on extractable structure, not on DA. |
| `/growling` | C | `what to do when dog growls` | Instructional | Lead with “do not punish.” Escalate gate. |
| `/resource-guarding` | C | `dog resource guarding` | Instructional | Management first. Bite-risk refuse. |
| `/stressed-dog` | C | `how to calm a stressed dog` | Instructional | 60-second actions. |
| `/vs-dog-translator` | A (harvest, do not join) | `dog translator` / `is dog translator real` | Commercial | Anti-toy. One page. Do not rank the homepage here. |
| `/science` | Trust | `can ai read dog body language` (constructed) | Informational | Sci Rep + refuse-first. |
| App Store listing | ASO | Indexed: training / behavior / body language | Transactional | See ASO lock. Not a web route. |

Out of scope for v1 routes: cats, show/kennel, local “near me” trainer directories, syllabus lesson libraries.

## GEO / AI-answer note

Question clusters (B and C) are high GEO potential (how / what / why). Google AI features will fan out from “dog body language” into fear / growl / belly-rub misread — the same competence gap Dogs Trust documented. **Do not** write AI-only pages. Structure future articles as people-first answer blocks. No `llms.txt` work this phase (no site).

## Decisions (this seat)

1. Primary organic bet = **what-to-do-now long-tail + body-language pillar**. Not translator head terms.  
2. ASO category and copy must be **Lifestyle + Education**, violently non-translator.  
3. `telltail dog training` is already a navigational query for someone else — disambiguate on web; do not squat their exact brand phrase.  
4. No volumes until a real Ahrefs/GSC/Connect export exists.

## Do not

- Mark Phase 2 complete.  
- Invent TAM or monthly searches.  
- Write page bodies or `16-seo.md`.  
- Title the app “AI Dog Translator.”

## Sources (accessed 2026-08-21)

**Autocomplete / APIs**

- Bing Autocomplete — `https://api.bing.com/osjson.aspx` (queries listed in clusters).  
- iTunes Search US — `https://itunes.apple.com/search?term=dog+translator&entity=software&country=us&limit=15`  
- iTunes Search US — `https://itunes.apple.com/search?term=dog+body+language&entity=software&country=us&limit=12`  
- iTunes Search US — `https://itunes.apple.com/search?term=telltail&entity=software&country=us&limit=5`  
- iTunes Lookup — `https://itunes.apple.com/lookup?id=1607696607,6760047972,6752532377,6757875245,6755426821,6760407916,6747022085`

**Google SERP pages opened/cited**

- https://www.petmd.com/dog/behavior/how-to-read-dog-body-language  
- https://www.akc.org/expert-advice/training/how-to-read-dog-body-language/  
- https://bestfriends.org/pet-care-resources/dog-body-language-signs-comfort-stress-and-more  
- https://www.dogstrust.org.uk/dog-advice/understanding-your-dog/body-language  
- https://www.petmd.com/dog/behavior/why-do-dogs-growl  
- https://www.whole-dog-journal.com/behavior/understand-why-your-dog-growls/  
- https://www.akc.org/expert-advice/training/resource-guarding-in-dogs/  
- https://www.aspca.org/pet-care/dog-care/common-dog-behavior-issues/food-guarding  
- https://www.dogstrust.org.uk/dog-advice/training/unwanted-behaviours/resource-guarding-food-and-toys  
- https://www.preventivevet.com/dogs/resource-guarding-in-dogs  
- https://paw-champ.com/journal/best-dog-training-apps-2026/  
- https://www.aaha.org/trends-magazine/publications/dog-training-apps/

**Store / brand**

- https://apps.apple.com/us/app/pawfessor-dog-behavior-ai/id6760047972  
- https://apps.apple.com/us/app/traini-dog-training-insights/id1607696607  
- https://apps.apple.com/us/app/ai-dog-translator/id6757875245  
- https://apps.apple.com/us/app/ai-dog-translator-pn1/id6755426821  
- https://apps.apple.com/us/app/ai-dog-translator-scanner/id6760407916  
- https://apps.apple.com/us/app/puppr-dog-training-tricks/id1199338956  
- https://telltaildogtraining.com/  
- https://telltaildog.fireside.fm/

**Inputs (internal)**

- `docs/projects/telltail/business-idea/00-intake.md`  
- `docs/projects/telltail/business-idea/HANDOFFS/0-manager-head-of-research.md`

Phase not complete.
