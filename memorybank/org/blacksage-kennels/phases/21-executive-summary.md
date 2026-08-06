# 21 Executive Summary — Blacksage Kennels

**Phase:** 21 — Launch & final QA  
**Status:** **superseded for product craft** — soft-launch gates still apply  
**Last updated:** 2026-07-27 (Skill-Max SSOT freeze)  
**Author:** ceo-strategist  
**Venture:** Blacksage Kennels  

> **SSOT freeze:** This document was rewritten after Option B → Option C → Skill-Max reopens. Do **not** treat pre–Skill-Max “Zero Three.js / light paper” language as current. Canonical product locks: `MEMORY/context.md`, `MEMORY/decisions.md`, `03-strategy.md` (SD4-C), `11-brand-system.md` (11-R), `12-web-design.md` (Skill-Max active), `HANDOFFS/24-ceo-option-c-lock.md`, `HANDOFFS/25-ceo-creative-reboot.md`.

---

## 1. Idea

Blacksage Kennels is a **German / ADRK-aligned Rottweiler breeding program** whose public website exists so serious buyers can **shortlist and verify** the kennel before contact. Prestige is **evidence density** (standards literacy, health transparency, honest program posture) plus a **Working-Dog Cinema** presentation on `/` — then a calm invitation to **qualified inquiry**. Not a puppy storefront, not Mode E empty spectacle, not apply-first.

---

## 2. Market / strategy lock (current)

| Lock | Decision |
|------|----------|
| **Strategy** | **D2 Hybrid** — trust-first, inquire-after-proof |
| **Home experience** | **SD4-C** — scroll narrative / cinema home on `/` only; secondary pages HTML |
| **Craft expression** | **Skill-Max · Territory B Working-Dog Cinema** (void black + ADRK tan; Fraunces/Manrope) |
| **3D / WebGL** | Optional upgrade when licensed GLB present; **default = photography-first documentary** |
| **Site job** | Evidence-led trust → qualified inquiry |
| **Rejected** | D3 apply-first · FOMO / price-led · aggression marketing · film-jargon copy without kennel substance |
| **Claim discipline** | Operator-verified facts only; honest empty states (SD5) |

**Positioning:** For serious Rottweiler buyers who research health, structure, and program integrity before a 10+ year commitment, Blacksage leads with verifiable evidence and standards-informed education — then invites qualified inquiry.

---

## 3. Product

### Must routes (locked IA)

| Route | Job |
|-------|-----|
| `/` | Cinema / scroll chapters + mid-path **HTML proof band** — no convert CTA in first viewport |
| `/dogs` | Breeding stock **or** honest Tier 1 empty state |
| `/health` | Standards, testing, temperament, placement |
| `/about` | Program principles + operator story when verified |
| `/inquire` | Package A/B inquiry — conversion surface |
| `/apply` | **301 → `/inquire`** |

### CTA lock

| Use | Avoid |
|-----|-------|
| **Begin your inquiry** | Apply now / Buy / Shop / Reserve |
| Join our interest list (A) | Limited time / Only X left |

### Packages (Q1-gated)

| Package | Mode |
|---------|------|
| **A — Interest list** | Default (`NEXT_PUBLIC_INQUIRE_PACKAGE=A`) |
| **B — Waitlist** | When Q1 = active program |
| **C — Placement** | Off-site only — never site checkout |

---

## 4. GTM summary

Trust-first **organic** kennel. Owned web primary. Phase **15 video skipped**. Phase **19 paid skipped** ($0). Instagram gated on Q6 photography.

**Demand path:** Discover → Shortlist (Home proof) → Verify (Dogs / Health / About) → Begin your inquiry → Qualify off-site.

---

## 5. What's built (current)

App: **`apps/blacksage-kennels`**

| Highlight | Detail |
|-----------|--------|
| Stack | Next.js App Router · TypeScript · Tailwind v4 · shadcn/ui · optional R3F |
| Theme | Void `#070707` · tan `#C4A35A` · Fraunces + Manrope |
| Home | `CinemaDocumentaryHome` default; WebGL `HomeScrollCanvas` only if WebGL gate + GLB |
| Copy | Phase 14 kennel substance in `lib/home-scroll-story.ts` (not film placeholders) |
| Routes | Five Must routes + proof band + inquire |
| SEO | sitemap / robots / metadataBase helper |
| Analytics | Plausible-ready adapter (env-gated) |
| Form | mailto stub until Q7 |
| Tests | Vitest suite green |

---

## 6. Launch checklist

### Done (product / process)

| Item | Status |
|------|--------|
| D2 Hybrid + SD4-C locks | ✅ |
| Skill-Max cinema craft delta | ✅ (photography-first) |
| Phase 14 copy restored on home chapters | ✅ |
| Must routes + CTA audit | ✅ |
| SEO scaffolding | ✅ |
| Analytics wire (no-op without keys) | ✅ |
| Skill-pack allowlist remediation (HANDOFFS/23) | ✅ |
| Phase 15 / 19 | ⏭️ skipped |

### Blocked — operator (hard-launch / soft-launch)

| Gate | Owner | Blocks |
|------|-------|--------|
| **Q1** program maturity / Package A vs B | Operator | Form mode; `/litters` |
| **Q2** geography + real NAP | Operator | About/footer; local SEO |
| **Q6** real kennel photography | Operator | Visual prestige; Instagram |
| **Q7** CRM/ESP + monitored email + SLA | Operator | Live conversion |
| **`NEXT_PUBLIC_SITE_URL`** | Operator | Canonicals / sitemap / OG |
| **Plausible domain key** | Operator | Measurement go-live |
| Contact placeholders in `lib/constants.ts` | Operator | `[CONTACT_EMAIL]`, `[LOCATION]`, etc. |
| Licensed GLB (optional) | Operator | WebGL subject upgrade |

See `OPERATOR-LAUNCH-BLOCKERS.md`.

### Soft-launch minimum

1. Tier 1 + Package A (default if Q1 open).  
2. Real monitored `[CONTACT_EMAIL]`.  
3. Set `NEXT_PUBLIC_SITE_URL`.  
4. Honest empty states — no fake dogs/photos.  
5. Prefer private/referrer until Q6 + analytics.  

---

## 7. Soft-launch recommendation

**Soft-launch yes (after contact + site URL) · Hard public launch no.**

Strategy↔build is aligned to **D2 Hybrid + SD4-C + Skill-Max cinema**. Remaining gap is **operator facts + measurement + delivery**, not product direction.

---

## 8. Next 90 days

| Window | Focus |
|--------|-------|
| **0–14** | Close Q7 + site URL; claim audit; Plausible; M5 sniff test |
| **15–30** | Soft Tier 1 live; interest list; GSC sitemap |
| **31–60** | Swap placeholders as Q1/Q2/Q6 arrive |
| **61–90** | Tier 2 readiness; **Phase 22 Operate**; reopen 19 only if funded |

---

## 9. Consistency QA (strategy → build) — post Skill-Max

| Thread | Consistent? | Notes |
|--------|-------------|-------|
| D2 Hybrid | ✅ | Proof band mid-home; inquire after evidence |
| SD4-C home cinema | ✅ | Documentary default; GLB optional |
| CTA / packages | ✅ | Begin your inquiry; A/B env |
| Claim honesty | ✅ | Placeholders + dogs empty state |
| Phase 14 kennel copy on home | ✅ | Restored 2026-07-27 |
| Measurement | ⚠️ env-gated | Keys still operator |
| Operator facts | ⚠️ blocked | Expected |

**Historical note:** An earlier Phase 21 draft claimed “Zero Three.js” and light-paper theme. That draft is **void**. Current locks supersede it.

---

## Sources

- `03-strategy.md` · `05-prd.md` · `09-build-log.md`  
- `11-brand-system.md` · `12-web-design.md` · `14-pages/` · `home-scroll-chapters.md`  
- `HANDOFFS/23`–`26` · `OPERATOR-LAUNCH-BLOCKERS.md` · `RUNBOOK-TRACKER.md`  
- `apps/blacksage-kennels/`
