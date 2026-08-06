# Phase 22 — CEO Decision Brief: Operator Feedback (3D + Black/Tan Brand)

| Field | Value |
|-------|-------|
| Date | 2026-07-27 |
| Seat | `ceo-strategist` |
| Venture | `blacksage-kennels` |
| Type | Strategy change request (no code) |
| Status | **Operator locked B** (2026-07-27) — hero-only WebGL + black/tan; reopen 11→12→9 |
| `llm_tier` | `frontier-reasoning` |
| `llm_model` | `grok-4.5` |
| `generation_used` | `none` |
| `fallback_applied` | `false` |

---

## 1. Restated operator ask

After previewing the soft-launch trust-first rebuild, the operator wants:

1. **A 3D website** — presence and dimensionality as a primary brand signal, not a flat editorial site alone.
2. **A realistic German Rottweiler 3D model in the hero** — breed-accurate, not cartoon/stylized; German/ADRK preference for natural undocked tail.
3. **Brand colours remapped to black and tan** — ADRK/FCI-aligned black with rich tan markings (not the Phase 11 light-paper system).
4. Feedback routed to CEO for a strategy verdict before creative/CTO execution.

This is a **post–soft-launch change request**. It is not a Phase 21 reopen of launch QA; it is an operating-loop (Phase 22) strategy decision that may reopen branded design + a narrow engineering delta.

---

## 2. Conflict with current locks

| Lock | Current decision | Operator ask | Tension |
|------|------------------|--------------|---------|
| **SD4 / Phase 3** | Scroll 3D / WebGL = **NO** for v1 / primary experience | “3D website” + hero Rottweiler model | Direct conflict with “no WebGL” |
| **v1 Mode E** | Full-page scroll-driven R3F failed as prestige substitute | Full “3D website” risk of regression | High — same anti-pattern if unconstrained |
| **Phase 11 brand REDO** | Editorial light paper `#FAFAF8`, amber/sage accents | Black and tan | Direct conflict with light system |
| **D2 IA + Phase 9/21 rebuild** | Trust-first multi-page; proof before inquire; soft-launch approved | Not explicitly asking to undo IA | Soft conflict only if 3D hijacks trust pathway |
| **Anti-pattern** | Full-page scroll-driven R3F as prestige substitute | “3D website” can be read as that | Must define scope narrowly or reject |

**CEO framing:** Operator is asking for *prestige presence* (hero + colour) after a trust-first soft launch. The correct response is **not** to revive failed scroll-3D. It is to decide whether a **contained** hero WebGL exception + brand reopen can coexist with D2—or whether we hold SD4 and only change colour.

---

## 3. Options

### A) Reject 3D; keep 2D trust-first; reopen brand to black/tan only

| | |
|--|--|
| **What** | Hold SD4: no WebGL / R3F. Remap Phase 11 tokens to black/tan. Keep D2 IA, proof band, routes, CTA. |
| **Pros** | Protects CWV, soft-launch integrity, Mode E lesson; lowest engineering risk; brand ask still honored. |
| **Cons** | Does not meet operator’s “3D website” / hero model ask; risk of operator dissatisfaction after preview. |
| **Reopen** | Phase **11** (brand) → **12** (theme/surfaces) → copy contrast pass **13/14** if needed → Phase **9** CSS/token delta only. |

### B) Approve **hero-only** WebGL + black/tan; keep D2 IA — **narrow SD4 reopen** *(CEO recommendation)*

| | |
|--|--|
| **What** | Reopen SD4 **narrowly**: one contained hero canvas (fixed viewport region, lazy-loaded, no scroll-jacking, no full-page R3F narrative). Black/tan brand remap. D2 routes, proof band, inquire flow unchanged. Static/photoreal fallback if WebGL fails or prefers-reduced-motion. |
| **Pros** | Honors operator intent without Mode E regression; prestige where it matters (hero); trust pathway intact; bounded perf budget. |
| **Cons** | Reopens SD4 (must document exception); asset purchase + license diligence; CTO cost for R3F/Three island; CWV risk if model not optimized. |
| **Reopen** | See §5. |

**Hard constraints if B is chosen:**

- Hero canvas only — not a “3D website” in the scroll-hijack sense.
- No scroll-driven camera path; no full-page R3F as primary experience.
- Prefer optimized GLB **&lt;5–15MB**; progressive enhancement + still fallback.
- Prefer **natural undocked tail** (German/ADRK).
- D2 proof band and education pages remain the trust engine; 3D is presence, not proof of program quality.
- Must not recreate rejected purple/cream AI default aesthetics.

### C) Full “3D website” / scroll-3D return

| | |
|--|--|
| **What** | Primary experience becomes scroll-driven or multi-scene WebGL again. |
| **Pros** | Maximal match to literal “3D website” phrasing. |
| **Cons** | Explicit **v1 Mode E failure risk**; fights D2 trust-first; CWV/SEO/INP damage; prestige-as-substitute anti-pattern. |
| **CEO stance** | **Recommend against** unless operator insists in writing after reviewing Mode E / SD4 history. If insisted → full strategy reopen (Phase 3 + 10), not a soft delta. |

---

## 4. CEO provisional recommendation: **B**

**Pending operator pick.** Label: recommendation, not locked decision.

**Why B:** Soft-launch already delivered the trust layer SD4 was meant to protect. Operator feedback is about *brand presence*, not undoing evidence-before-inquire. A hero-only WebGL exception + black/tan remap satisfies the spirit of the ask while refusing the failed scroll-3D product. Option A under-delivers on a clear operator signal; Option C reopens a known failure mode.

**What B is not:** Permission to rebuild the site as a cinematic WebGL tour. If creative/CTO drift toward scroll-hijack or multi-scene narrative 3D, escalate back to CEO as a C-class request.

---

## 5. Reopen plan (if operator picks B)

Do **not** mark phases complete; orchestrator sequences after operator confirmation.

| Phase / work | Scope |
|--------------|--------|
| **SD4 exception memo** | Document narrow reopen: hero-only WebGL; scroll-3D remains NO |
| **11 Brand** | Black/tan token system; dark ground + tan accent; voice/CTA unchanged unless contrast requires it |
| **12 Web design** | Hero composition with contained 3D slot; fallback still; motion/`prefers-reduced-motion`; keep multi-page IA |
| **13/14 Copy** | Contrast pass only (light→dark surfaces); no CTA/IA rewrite unless copy becomes illegible |
| **9 Build delta** | Dynamic import Three/R3F island; asset pipeline; perf budgets; tests for fallback; no full rewrite |
| **15 Media** | Optional: photography shot list light-notes if stills must match black/tan hero; no Phase 15 video reopen required |
| **C-suite** | Light gate on 11→12→9 delta before merge to soft-launch |

**If operator picks A:** 11 → 12 → token/CSS 9 only; no SD4 reopen.  
**If operator picks C:** Full Phase **3 / 10** strategy reopen first; do not start hero asset work until new SD4 supersedes Mode E lesson.

---

## 6. Model shortlist + license diligence

Candidates for hero (verify licenses **before purchase**; prefer commercial web display rights):

| Priority | Candidate | URL | Notes |
|----------|-----------|-----|-------|
| 1 | Alex Lashko — Game-Ready Rottweiler | https://alexlashko.com/store/np1/rottweiler-game-ready | High quality; **full undocked tail option** (ADRK-aligned); Standard vs Extended commercial — confirm web embed / redistribution rules |
| 2 | CGTrader — Realistic Rottweiler Animated/Rigged | https://www.cgtrader.com/3d-models/animal/mammal/realistic-rottweiler-dog-animated-and-rigged | GLB/glTF; Royalty Free — confirm commercial web use + poly/file size after optimize |
| 3 | CGTrader — Standing Pose Guard Breed | https://www.cgtrader.com/3d-models/animal/mammal/rottweiler-dog-standing-pose-realistic-guard-breed-character | glTF ~30MB standing hero; needs aggressive optimize toward &lt;15MB |
| 4 | CGTrader — Low-poly VR/AR | https://www.cgtrader.com/3d-models/animal/mammal/rottweiler-dog-e7979050-ee77-434e-b858-3a6a714d468b | Game-ready; better budget; breed fidelity may lag |
| Last | Meshy — free AI Rottweilers | https://www.meshy.ai/tags/rottweiler | CC0 claim — quality/breed accuracy risk; **only if CEO accepts** after operator budget refusal |

### License diligence checklist (CTO / creative before buy)

- [ ] Commercial use includes **public website display** (not only personal/game)
- [ ] Clarifies **web streaming / CDN hosting** of the asset (or derivative optimized GLB)
- [ ] Clarifies **no resale / no redistribution** of source files in public repo if required
- [ ] Confirms **animation/rig** rights if idle/loop used in hero
- [ ] Tail: **natural undocked** available (or docked rejected for German presentation)
- [ ] File path: source → optimized GLB target **&lt;5–15MB**; LOD / Draco / texture budget documented
- [ ] Attribution requirements (footer / credits page) if any
- [ ] Refund / preview policy if breed fidelity fails QA

---

## 7. Black & tan brand direction (for creative-director if B or A brand reopen)

ADRK/FCI: black with clearly defined rich tan markings. Propose starting tokens (CD owns final):

| Role | Proposed range | Notes |
|------|----------------|-------|
| Ground / near-black | `#0A0A0A` / `#111111` | Primary surfaces; avoid pure `#000` crushing detail |
| Tan accent | `#C4A35A` – `#A67C52` | Markings, links, CTA fill/outline; pick one primary + one hover |
| Text on dark | Off-white / warm paper tint | Sufficient contrast (WCAG AA+) |
| Proof band | Slightly lifted charcoal or tan-ruled | Keep trust-first hierarchy |

**Must not:** purple-on-white, cream+terracotta AI default, or purple glow.  
**Must preserve:** D2 proof-before-inquire; CTA “Begin your inquiry”; Packages A→B→C.

---

## 8. Ask for operator (max 3)

1. **Pick A, B, or C** — CEO recommends **B** (hero-only WebGL + black/tan; D2 IA held; scroll-3D stays forbidden).
2. **Confirm asset budget** — OK to purchase a commercial model (prefer Alex Lashko Extended/Standard as license requires, else CGTrader RF with web-use confirmation)? Approximate budget cap?
3. **Confirm undocked-tail requirement** — Is natural undocked tail a hard yes for German/ADRK presentation (CEO assumes **yes**)?

---

## 9. What this brief does *not* authorize

- No code, no dependency adds, no Phase ✅ marks
- No creative-director / web-designer / CTO spawn until operator answers §8
- No hard-launch unblock (Q1/Q2/Q6/Q7 / contact / Plausible still separate)
- No reinterpretation of “3D website” as Option C without explicit operator insistence

---

## 10. Return summary (for orchestrator / operator)

| Item | Value |
|------|-------|
| **Recommendation** | **B** |
| **Reopen if B** | SD4 narrow exception + Phases **11 → 12 → (13/14 contrast) → 9 delta** |
| **Operator questions** | Pick A/B/C · asset budget · undocked tail hard requirement |
