# Channel Strategy — Media Placement

**Phase:** 15  
**Scope:** Where Phase 15 media appears on owned channels — **not** paid ads (Phase 19)  
**Locks:** D2 trust-first · SD4 no 3D hero · Q6 photography-first · no FOMO

---

## Executive summary

**v1 launch media is still-first.** The site does not require a hero video, scroll-3D experience, or autoplay montage. Trust is built through the **proof summary band**, education pages, and **operator photography** when Q6 delivers. Optional brand film supports About or future embeds — it does **not** replace the Home proof pathway.

---

## Owned web — v1 placement map

| Route | Media type | v1 requirement | Source | Notes |
|-------|------------|----------------|--------|-------|
| **Home `/`** | Proof band (static) | **Required** | Phase 12 components | Above fold — no video |
| **Home `/`** | Optional hero **still** 16:9 | Should when Q6 | Operator P0 (`photography-shot-list.md` H1–H2) | Paper-warm card; below proof band |
| **Home `/`** | Hero **video** | **Won't v1** | — | SD4 — no WebGL/scroll-3D; no autoplay cinematic hero |
| **Dogs `/dogs`** | Grid stills 3:2 | Tier 2 when populated | Operator P0 D1–D3 | PlaceholderSlot until ready |
| **Dogs `/dogs/[slug]`** | Profile stills | Tier 2 | Operator DD1–DD3 | No video required |
| **Health `/health`** | Diagram still (optional) | Could | Illustration E1 | Label "breed standard reference" |
| **About `/about`** | Operator portrait | Tier 2 when story | Operator A1 | Honest gap copy until then |
| **About `/about`** | Optional brand film embed | Could post-Q6 | `brand-film-script-storyboard.md` | Muted default; user-initiated play |
| **Inquire `/inquire`** | None | — | — | Form-focused; no background video |
| **Footer** | None | — | — | Dark band text only |

### Home — explicit non-requirements

- No full-viewport video background
- No scroll-linked camera / parallax depth stack
- No "Scroll" or "Explore" motion prompt
- No primary **Begin your inquiry** CTA in first viewport (tertiary only, bottom band)

---

## Photography vs video priority

```
LAUNCH (v1)
├── P0: Operator photography → Home hero still, Dogs grid
├── P1: Environment + About portraits
└── Optional brand film → defer until P0/P1 exist

NOT IN v1 LAUNCH
├── AI hero video (Veo / OpenMontage) as proof substitute
├── 3D scroll hero
└── Paid social video ads (Phase 19)
```

---

## Social & referral (later — not launch gate)

Social is **supporting**, not a substitute for site proof IA (strategy SD2).

| Channel | Format | Content direction | When | CTA |
|---------|--------|-------------------|------|-----|
| Instagram / Facebook | 4:5 or 1:1 stills | Operator dog structure; education carousel | Post-Q6 | Link in bio → site `/health` |
| Instagram Reels / TikTok | 9:16 short | Calm B-roll + supers; **no hype cuts** | Phase 19+ optional | "Learn more" → site — not "DM for puppy" |
| YouTube | 16:9 long | Breed education, kennel tour when operator ready | Post-launch | Description link → `/health` |
| Referral / clubs | URL only | Professional site as proof asset | Launch | N/A |

**Social rules:** Same Tier 1–3 claim discipline as site. No prices, no litter countdowns, no guard-dog hooks.

---

## Email / lifecycle (cross-reference)

Lifecycle email may use **static** hero crops from operator photography — not Phase 15 video scope. See lifecycle-marketer for Phase 16+ templates. No FOMO subject lines.

---

## Paid media (Phase 19 — out of scope here)

Phase 15 does **not** produce ad creatives. Phase 19 `video-producer` seat may use `generation_profile: ad-creative` with separate brief. Constraints carry forward: trust-first, no FOMO, no AI dogs as proof.

---

## Asset lifecycle

| Stage | Action |
|-------|--------|
| Pre-Q6 | PlaceholderSlot on Home/Dogs; proof band carries trust |
| Q6 delivery | Operator files → CMS/static → replace placeholders |
| Post-Q6 optional | Brand film edit from B-roll; embed on About only if approved |
| QA | Tier 3 media audit — zero stock/AI dogs as program proof |

---

## Metrics (hypothesis — not launch blockers)

| Signal | Tool | Purpose |
|--------|------|---------|
| Home → `/health` click-through | Analytics | Proof pathway working |
| Time on `/health` | Analytics | Education engagement |
| `/inquire` starts after ≥2 page views | Analytics | Trust-before-inquire (D2) |
| Video play rate (if embedded) | Analytics | Optional — should not exceed still LCP priority |

---

## Decisions log

| Decision | Rationale |
|----------|-----------|
| No Home hero video v1 | SD4 + performance + brand photography-forward |
| Photography primary | Q6 + A9 + PRD media rules |
| Skip AI hero generation Phase 15 | Brand Tier 3 — synthetic dogs risk |
| Brand film optional | Supports mood; not proof substitute |
| Social deferred | Owned web proof IA is anchor |

---

## Open items

| Item | Owner |
|------|-------|
| Q6 shoot schedule | Operator |
| About embed approval for brand film | Operator + creative-director |
| OG image from operator still (NFR-SEO-004) | brand-designer when Q6 satisfied |
