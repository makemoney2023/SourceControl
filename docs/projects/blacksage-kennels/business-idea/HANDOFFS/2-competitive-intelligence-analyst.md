---
phase: "2"
position: competitive-intelligence-analyst
reports_to: head-of-research
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5-fast
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Competitive Landscape (German-Type Rottweiler Breeders) → head-of-research

## Goal (from context packet)

Competitive landscape analysis of German-type / ADRK-aligned / working-line Rottweiler breeder websites. Identify patterns that signal quality vs red flags. Output handoff for manager to merge into `02-evidence-base.md`. Do **not** invent Blacksage facts.

**Research date:** 2026-07-27  
**Method:** Firecrawl MCP search + scrape of live breeder sites (public pages only).  
**Scope:** 8 premium/working-line kennels (US + UK). No Blacksage v1 prototype treated as competitor.

---

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/2-competitive-intelligence-analyst.md` | This handoff — competitive set, patterns, red flags, gap vs v1 failure modes, strategic implications |

---

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false |

---

## 1. Competitive set table

| Kennel | URL | Positioning | Standout trust signals | Weaknesses / notes |
|--------|-----|-------------|------------------------|-------------------|
| **Von Evman Rottweilers** | https://vonevmans.com/ | Top-tier US German-line breeder; “100% German bloodline”; hobby kennel tied to separate business | Named OFA certs on all parents; ARC Gold Producer / AKC Breeder of Merit badges; ADRK/ARC/USRC/DVG affiliations; individual dog pages (e.g. Kurt); litter pages link both parents with dates; extensive real-photo socialization gallery; service/therapy dog proof | Dense, dated WordPress layout; heavy homepage scroll; strong sales tone (“NEVER purchase from…”); no published puppy price; contact via form + schedule visit (not instant checkout) |
| **Dreibergen Rottweilers** | https://www.4rottweilers.com/ | Oregon hobby kennel; “complete working Rottweiler”; FCI/ADRK-informed | USRC + ADRK member badges; explicit health list (OFA hips/elbows/cardiac/eyes/JLPP); educational articles (breed standard, Schutzhund, BSL, “Price of a Puppy,” finding breeder); **published purchase agreement**; waitlist with $500 deposit + refund/renew policy; puppies raised in home; natural tail policy stated | Legacy HTML site (early-2000s UX); no modern apply funnel; Facebook for live updates; pricing not on site |
| **Old World Kennel** | https://www.oldworldkennel.com/ | “Finest German Rottweilers” since 1981; import/training/show focus | ADRK + URKA + DVG membership; **partner ADRK kennel in Germany** (von-der-alten-welt.de); named operator (John Bernard) + long credential list; Facility/Males/Females/Puppies/Imports/Training IA; physical address + email + phone | Jimdo template, visually dated; thin homepage; puppy reservations mentioned but no structured waitlist page on scrape; limited health-test naming on homepage |
| **Von Ruelmann Rottweilers** | https://www.vr-rottweilers.com/ | “#1 US breeder”; 45+ years German preservation | Modern funnel site; **Reserve Puppy** form + phone CTAs; names OFA, ADRK HD/ED, JLPP, cardiac; titled working/show lines; per-dog pages for studs/dams; $500 deposit terms stated; Google reviews embedded (5.0 / 136) | Marketing-heavy superlatives; celebrity-clients section; deposit non-refundable (industry norm but buyer-friction); privacy/terms links placeholder on form; no list prices |
| **Von Der Musikstadt** | https://www.vdrrottweilerbreeders.com/ | Nashville; German/European bloodlines only; code-of-ethics breeder | Deep **health education hub** (Embark, JLPP, DM, LEMP, NAD, XLMTM, HFH); ADRK/FCI standard alignment; named studs/dams; **downloadable deposit + pet/show contracts**; Google reviews linked; references + kennel visits encouraged; natural tail policy | Very long legacy site; cluttered nav; **footer spam/hacked SEO links** (casino/gambling — severe trust/maintenance red flag); phone + email + PayPal; payment rules strict (cash on pickup) |
| **Vom Haus Burns** | https://vomhausburns.com/ | Florida; code-of-ethics; American-bred dogs competing in ADRK/VDH venues | Education section reframes “AKC registered” vs quality; show-result chronicle with judge names + certificates; health-tested claim + 2-year guarantee mentioned; Males/Females/Litters/Offspring IA; phone-first CTA repeated; Google review prompt | Extremely long homepage (show log as primary content); repetitive “call today” SEO blocks; lists third-party marketplaces (NextDayPets); no structured online application |
| **Henkershaus Rottweilers** (UK) | https://www.rottweiler-breeder.com/henkershaus-rottweilers | East Midlands UK; 100% German imports; working/security dogs | HD/ED free, JLPP clear, work + show titles; family-home raised; **contract, KC reg, insurance, microchip, vax, puppy pack** listed; real kennel photos on directory page | **No standalone kennel site** in scrape — profile on aggregator; contact email + Facebook only; minimal IA (buyers must off-site) |
| **Henkershaus (Facebook)** | https://www.facebook.com/HenkershausRottweilerKennel | Social proof / updates channel | Live community; photos of real dogs/handlers | Not a replacement for owned web presence |

**International reference (not fully scraped):** Old World’s ADRK partner **von der Alten Welt** (http://www.von-der-alten-welt.de/) — security gate blocked automated scrape; cited by Old World as co-breeder kennel in Germany.

**Category benchmark (standards body, not competitor):** ADRK breeder finder — https://adrk.de/index.php/en/home-en/zuechter

---

## 2. Quality pattern synthesis — what “good” looks like (12 patterns)

1. **Named breeding stock** — Every litter ties to **both parents** with dedicated pages (photos, titles, health notes). Anonymous “available puppies” grids are rare in this tier.

2. **Specific health credentials** — Top sites name **OFA** (hips, elbows, cardiac, eyes), **ADRK HD/ED ratings**, **JLPP**, and increasingly **Embark/panel genetics** — not vague “health tested.”

3. **Club affiliations visible** — **ADRK**, **USRC**, **ARC**, **AKC Breeder of Merit**, **DVG** badges or explicit membership copy. Used as third-party credibility anchors.

4. **Working + conformation proof** — **Schutzhund/IGP/IPO**, **ZTP**, **Sieger/Klubsieger**, **V-ratings**, therapy/service titles. Titles are treated as temperament/work evidence, not vanity.

5. **Education before sale** — Articles on breed standard, finding a breeder, cost of quality, tail policy, genetic diseases. Positions breeder as gatekeeper, not retailer.

6. **Waitlist / deposit discipline** — **$500 deposit** common; wait times acknowledged; matching puppy to home at 7–8 weeks (Dreibergen explicitly). Scarcity is normal; “always in stock” is not.

7. **Published contracts** — Purchase agreements, deposit terms, pet vs show contracts downloadable (Dreibergen, Von Der Musikstadt). Return/take-back and breeder support often implied or stated.

8. **Real photography everywhere** — Whelping, kennel facility, show stack, children/socialization, certificates/trophies. Visual proof substitutes for abstract “premium” design.

9. **Operator identity** — Named people, years in breed, geographic location, phone/email. Referrers and buyers can verify a human program behind the brand.

10. **Structured IA** — Recurring nav: **Home → About → Males → Females → Puppies/Litters → (Health/Education) → Contact**. Optional: Stud service, Imports, Training, Offspring gallery.

11. **Phone + form hybrid** — High-trust breeders still push **phone call** for serious buyers; forms capture interest but rarely close sale alone.

12. **Multi-channel updates** — Facebook/YouTube for litter news; owned site for durable proof. Aggregators (Good Dog, breed directories) supplement but do not replace program story.

**Visual / brand quality bar (category norm):** Prestige is signaled by **evidence density** (certs, titles, real dogs, longevity) — **not** cinematic web effects. Several top kennels use dated templates (Jimdo, legacy HTML, busy WordPress). Buyers in this segment tolerate weak visual polish **if** proof is abundant. None of the 8 sites use scroll-driven 3D or WebGL hero experiences.

---

## 3. Red flag checklist (12 items)

1. **Vague health claims** — “Health guaranteed” or “health tested” with **no named tests or registry links** on parents.

2. **No parent information on litters** — Puppies offered without linked sire/dam profiles or pedigree context.

3. **Always-available puppies** — Multiple litters “ready now” year-round with no waitlist language (puppy-mill signal in this category).

4. **Stock or generic imagery** — Hero shots that don’t match named dogs; no whelping/kennel/show photos.

5. **No club or standards alignment** — Zero mention of ADRK/FCI/USRC/ARC/OFA; “German lines” with no import/pedigree path.

6. **Payment pressure** — Deposit demanded before contract review; **Zelle/PayPal “friends & family”** with no paper trail; refusal to discuss terms (Musikstadt warns about this pattern — also a signal when *combined* with weak proof).

7. **No contract or return policy** — Nothing on purchase agreement, health guarantee scope, or take-back.

8. **Third-party marketplace only** — Primary presence on puppy classifieds with no owned site documenting the program (Henkershaus is partial example — strong copy but aggregator-hosted).

9. **Site neglect / spam injection** — Broken links, casino SEO footer spam, placeholder legal pages (e.g. Von Ruelmann form footer; Musikstadt hacked footer). Undermines trust regardless of kennel quality.

10. **Extreme superlatives without evidence** — “#1 in USA,” “best bloodlines,” with no titles, certs, or verifiable results pages.

11. **Price shopping UX** — Shopping-cart checkout for Rottweiler puppies; treats live dogs like e-commerce SKUs.

12. **Geographic / identity opacity** — No location, no named breeder, contact only via anonymous form or messaging app.

---

## 4. Gap vs Blacksage v1 failure modes (inference only)

Per `01-problem-framing.md`, v1 failed **holistically** (visual polish, 3D, trust/content, UX/conversion). Competitive scan supports the following **inferences** — not Blacksage program facts:

| v1 failure layer | Category “good” baseline | Likely Blacksage v1 gap (inference) |
|------------------|--------------------------|-------------------------------------|
| **Visual polish** | Dated UI acceptable when proof-rich; real dog/kennel/show photos carry prestige | v1 reportedly used **placeholders + scroll 3D** instead of real program photography — fails category norm where authenticity beats aesthetics |
| **3D / experiential** | **Zero competitors** use scroll 3D/WebGL; prestige = certs, titles, litter transparency | 3D was **differentiating tactic not validated** in category; may have added load/complexity without trust ROI |
| **Trust / content** | Named dogs, OFA/JLPP/Embark, club badges, education articles, contracts, operator story | v1 likely lacked **operator-supplied evidence** (program maturity, geography, health docs, pedigrees) — competitors win on content volume even with ugly templates |
| **UX / conversion** | Phone + deposit waitlist + contact form; multi-step qualification; no instant buy | v1 apply path likely **front-loaded conversion without trust prerequisites** — category buyers expect to **evaluate program first**, then call/deposit |

**Cross-cutting inference:** v1 attempted **brand spectacle (3D) + apply** without the **evidence layer** every serious competitor leads with. Category winners are **content-heavy and conversion-conservative**, not experience-heavy.

---

## 5. Strategic implications for Blacksage web strategy (not design specs)

1. **Define site job as trust-first** — Competitive set prioritizes **program evaluation** over visual novelty. Strategy should default **D2 (trust-first)** from problem framing unless operator evidence supports another mix.

2. **Evidence is the product** — Before brand or 3D decisions, inventory what Blacksage can **prove**: parent dogs, health tests, club ties, litter plan, operator bio, geography (when provided). Without this, no competitor-level trust is achievable.

3. **Match category IA, not category aesthetics** — Plan for **Dogs (M/F) → Litters → Health/Education → About → Contact/Apply**. Missing sections (especially named parents + health) will read as amateur regardless of visual system.

4. **De-prioritize 3D as prestige shortcut** — No premium ADRK-aligned competitor uses it. Any experiential investment should be **strategy-selected in Phase 3**, not assumed from v1 sprint.

5. **Conversion = qualification, not checkout** — Industry norm: **waitlist/deposit + phone conversation + puppy matching**. Apply UX should capture intent and screen buyers — not mimic e-commerce.

6. **Education builds authority** — Long-form “how to choose a breeder” / standards-informed content is table stakes for serious buyers and referrers.

7. **Real photography is a gating asset** — Competitors’ visual credibility comes from **authentic kennel life**, not design systems. Media plan precedes “production-quality web” claims.

8. **Contracts and policies on-site** — Publish deposit, health guarantee, and return/take-back **when operator provides terms**. Absence is a red flag to this buyer segment.

9. **Referrer-ready packaging** — Referrers need a **single credible URL** with program story + proof. WordPress-busy or 3D-demo sites without substance hurt referability (per Phase 1 stakeholder pains).

10. **Avoid invented scarcity or facts** — Competitors with waitlists still show **planned breedings** with parent links. Blacksage should mirror **honest posture** (coming-soon vs active) per operator Q1 — not filler litters.

11. **Maintenance and legitimacy** — Site hygiene (no spam, working legal links, SSL) matters for trust. Budget ongoing ops, not just launch.

12. **Phase 3 decision input** — Competitive bar suggests **prestige = proof density + qualification UX**, optional modern visual refresh **after** content exists — aligning with CEO direction to avoid cosmetic rebuild.

---

## 6. Site structure & UX patterns (cross-competitor)

| Pattern | Prevalence | Examples |
|---------|------------|----------|
| Males / Females / Studs index | 8/8 | All sites |
| Litter or puppies page with parent links | 7/8 | Von Evman, Dreibergen, Von Ruelmann, Musikstadt, Vom Haus Burns, Old World (reservations) |
| Health or education section | 6/8 | Dreibergen articles, Musikstadt hub, Vom Haus Burns education, Von Ruelmann breeding program copy |
| Contact + phone prominent | 8/8 | All |
| Online waitlist/form | 6/8 | Von Ruelmann, Von Evman, Musikstadt, Dreibergen (email/waitlist), Vom Haus Burns contact |
| Pricing on site | 0/8 | **Not transparent** in this set — price discussed after qualification |
| Questionnaire / screening | 2/8 implicit | Dreibergen (read articles first); deposit contracts require commitment |
| Club badge row | 7/8 | ADRK/USRC/OFA/AKC logos common |

---

## 7. URLs cited (all sources)

| # | URL | Use |
|---|-----|-----|
| 1 | https://vonevmans.com/ | Von Evman homepage |
| 2 | https://vonevmans.com/rottweiler-puppies-for-sale-fl/ | Von Evman litters |
| 3 | https://www.4rottweilers.com/ | Dreibergen homepage |
| 4 | https://www.4rottweilers.com/puppies.htm | Dreibergen waitlist/deposit |
| 5 | https://www.oldworldkennel.com/ | Old World homepage |
| 6 | https://www.oldworldkennel.com/about-us/ | Old World about/credentials |
| 7 | http://www.von-der-alten-welt.de/ | ADRK partner kennel (referenced; scrape blocked) |
| 8 | https://www.vr-rottweilers.com/ | Von Ruelmann homepage |
| 9 | https://www.vdrrottweilerbreeders.com/ | Von Der Musikstadt homepage |
| 10 | https://www.vdrrottweilerbreeders.com/rottweiler_puppy_contract.html | Musikstadt contracts |
| 11 | https://vomhausburns.com/ | Vom Haus Burns homepage |
| 12 | https://vomhausburns.com/education/ | Vom Haus Burns education |
| 13 | https://www.rottweiler-breeder.com/henkershaus-rottweilers | Henkershaus UK profile |
| 14 | https://www.facebook.com/HenkershausRottweilerKennel | Henkershaus social |
| 15 | https://adrk.de/index.php/en/home-en/zuechter | ADRK breeder registry |
| 16 | https://www.amrottclub.org/ | American Rottweiler Club |
| 17 | https://www.amrottclub.org/rottweiler-breed-referral/ | ARC breed referral |

---

## Decisions

- Competitive set limited to **8 kennels** with live owned or directory-hosted presence; ADRK registry used as standards reference only.
- **No Blacksage kennel facts** asserted; gap analysis labeled inference tied to v1 failure modes in Phase 1 doc.
- **3D/experimental web** documented as **absent** in premium competitor set — strategic input for Phase 3, not a design recommendation.

---

## Asks for manager (`ask_manager`)

- Peer help needed: **none**
- Clarification needed: **none** for merge; operator Q1/Q2/Q6 still block kennel-specific competitive positioning for Blacksage (program maturity, geography, photography) — escalate via market-research / CEO intake, not CI.

---

## Risks / blockers

- **Scrape limitations:** von-der-alten-welt.de blocked automated access; Henkershaus lacks owned-site scrape beyond directory + Facebook.
- **Site integrity:** Von Der Musikstadt footer spam suggests compromised or neglected site — use as **anti-pattern**, not quality endorsement.
- **Recency:** Competitor sites reflect operator-maintained content; no guarantee of current litter availability (expected in category).

---

## Packs used

- `skills/community/marketingskills/competitor-profiling/SKILL.md` (structure, facts-over-opinions)
- `skills/integrations/firecrawl/SKILL.md` (scrape/search via user-firecrawl-mcp)

---

## Do not

- Mark Phase 2 complete
- Write `02-evidence-base.md` or `02-market-research.md`
- Invent Blacksage location, prices, litters, or health claims
