---
venture: telltail
org: Velocity Agency
phase: "9"
title: Build log — Lite explore MVP (full pass)
owner: cto
status: MVP landed — phase not complete
date: 2026-08-21
llm_tier: coding-agent
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
production_status: complete
design_brief_path: docs/projects/telltail/business-idea/12-web-design.md
wire_owner: operator
4B: closed
---

# 09 — Build log — Telltail Lite explore MVP

**Mode:** explore · **4B:** closed · **Phase 9 not marked complete**

Full Lite explore MVP in `apps/telltail/` — chat thread chrome, attach-in-thread vision read, refuse-first gate, moment/refuse cards, PWA + Capacitor shell. Prior scoped kid-vs-dog eval harness **kept** under `eval/` + `fixtures/`.

Label key: **[F]** measured · **[I]** inference · **[A]** assumption

---

## Summary

Shipped a **runnable Next.js 15 chat app** at `apps/telltail/` implementing the Lite explore loop (US-01–07, US-10–11, US-19 config, US-21). Chat thread is the product chrome. One **Gemini 3.5 Flash Lite** cloud vision call per read via `/api/read`. Refuse-first for kids-in-frame, bite-risk, medical, confidence floor. Freeze / whale-eye / stare are gate **inputs**, not auto-refuse (AC-04.1). No clip → no vision card. Plus / K1 / store listing **stubbed or out of scope**.

Design tokens persisted at repo-root `design-system/telltail/` from Phase 12 Design brief (Paper, Ink, Sign, Refuse; Newsreader + IBM Plex).

**Build:** `npm run build` passes · **Tests:** 7/7 vitest · **Smoke:** curl 200 on `/`, `/how-it-works`, `/pricing`, manifest; Playwright navigated home + how-it-works.

**Vision live reads** require `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) on the server. Cloud agent had no key — API returns honest 503; UI shows refuse card with escalate message.

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15.5 App Router (`apps/telltail/`) |
| UI | Tailwind v4 + `design-system/telltail/tokens.css` |
| Fonts | Newsreader, IBM Plex Sans, IBM Plex Mono (Google fonts) |
| Vision | `gemini-3.5-flash-lite` — one `generateContent` per read |
| Lite quota | Client localStorage (5 reads grant) |
| PWA | `public/manifest.webmanifest` + icons |
| Native wrap | `@capacitor/core` v7 + `capacitor.config.ts` (shell only; loads hosted URL) |
| Tests | Vitest (gate + quota unit tests) |
| Eval (kept) | `eval/kid_vs_dog.py` + `fixtures/` (3/3 prior live stills) |

**Not shipped:** Plus IAP, Flash-class reads, K1 bite-risk eval, App Store / Play listing, Supabase auth, Vercel deploy wire.

Context7 MCP: **unavailable** (quota exceeded) — used existing repo Next patterns + official Gemini REST shape from prior eval.

---

## Routes shipped

| Route | PRD / purpose |
|-------|----------------|
| `/` | **Chat thread** — US-21 chrome; describe scare + context chips + attach media + vision read |
| `/how-it-works` | Marketing — Stage 0 loop copy |
| `/pricing` | Lite / Plus (stubbed) disclosure |
| `/api/read` | POST — one cloud vision call; refuse-first gate server-side |
| `/manifest.webmanifest` | PWA install manifest (US-19 PWA leg) |

**Deferred:** `/vs-dog-translator`, `/science`, history (US-16), after-action upload hero (US-14), live camera capture indicator (AC-01.1 partial — file attach works; MediaRecorder not wired).

---

## PRD traceability (Lite Must scope)

| ID | Requirement | This pass |
|----|-------------|-----------|
| **US-01** | Capture / upload clip | Attach image/video in composer; cloud disclosure checkbox (US-11) |
| **US-02** | One cloud read per clip | `/api/read` — single Gemini call; in-flight lock via UI disabled state |
| **US-03** | Refuse-first before card | Server post-process + UI renders refuse card before moment card |
| **US-04** | Kids / bite / medical / floor; quota cannot skip | Gate prompt + `applyRefuseRules`; Lite refuses same paths; reads consumed on model run |
| **US-04.1** | Freeze/whale-eye/stare = inputs not auto-refuse | Prompt + unit test `does not auto-refuse on freeze alone` |
| **US-04.5–04.6** | Child vs dog vs adult | Same one-call detect; eval harness 3/3; app uses full gate prompt |
| **US-05** | Moment card | In-thread `MomentCard`: signals, confidence, ≤3 actions, stop-rule |
| **US-06** | Banned claims | `BANNED_PATTERNS` strip + refuse on leak |
| **US-07** | Lite 3–5 reads; first scare completes | 5-read grant; paywall stub after exhaust; no mid-moment paywall |
| **US-08–09** | Plus paywall | **STUBBED** — `PaywallStub` + pricing copy; no IAP |
| **US-10** | Escalate don’t diagnose | Refuse card escalate copy + footer disclaimer |
| **US-11** | Cloud disclosure | `DisclosureBanner` + send checkbox |
| **US-12 / K1** | Flash-refuse eval | **STUBBED** — documented open; no eval run |
| **US-19** | PWA + Capacitor | Manifest + `capacitor.config.ts`; no store binaries |
| **US-21** | Chat + attach in thread | `ChatThread` — text context without vision claim; media triggers read |

---

## Design system

| Path | Contents |
|------|----------|
| `design-system/telltail/tokens.css` | Paper `#F6F2E9`, Field `#EFE9DC`, Ink `#1A1814`, Sign `#B5522A`, Refuse `#6B2C28` |
| `design-system/telltail/README.md` | Token map + brief pointer |

Consumed in `apps/telltail/app/globals.css` via `@import`. Sign is primary — **no green success bar** for confidence.

---

## Tests run

```bash
cd apps/telltail && npm test     # 7 passed
cd apps/telltail && npm run build # success
curl localhost:3010/             # 200
# Playwright smoke: / and /how-it-works loaded 2026-08-21
python3 apps/telltail/eval/kid_vs_dog.py  # requires GEMINI_API_KEY locally
```

---

## Demo path

1. `cd apps/telltail && npm install && export GEMINI_API_KEY=… && npm run dev`
2. Open http://localhost:3010/
3. Describe scare in thread; optionally pick context chips
4. Attach still from `fixtures/dog-only.jpg` (or phone clip)
5. Check disclosure → **Read clip**
6. See moment card or refuse card in thread
7. Repeat until Lite meter exhausts → paywall stub

Production: `npm run build && npm start -p 3010`

---

## Production

| Field | Value |
|-------|-------|
| production_status | **complete** |
| production_paths | `apps/telltail/` (Next app), `design-system/telltail/` |
| design_brief_path | `docs/projects/telltail/business-idea/12-web-design.md` § Design brief |
| wire_owner | **operator** — set `GEMINI_API_KEY`, deploy to Vercel/Render, set `CAPACITOR_SERVER_URL` for wraps |
| skip_reason | — |

---

## Open items

- **K1 / US-12:** Flash bite-risk refuse eval not designed or run — Plus remains planning-only
- **Kids leftover (Phase 8):** Product delete-on-kids-refuse storage path not built — gate fires in UI only
- **GEMINI_API_KEY:** Operator must wire for live reads in deployed env
- **Live camera capture:** File attach only; MediaRecorder / AC-01.1 recording indicator deferred
- **Plus / IAP:** Stubbed — do not claim Plus shipped
- **Store listing:** Out of scope — Capacitor config only
- **Vendor pin:** Lite model id `gemini-3.5-flash-lite` (2.5-flash-lite 404 for new keys)
- **Phase 8:** stays escalate · **Phase 9:** not marked ✅

---

## NOT doing

- Mark Phase 9 complete
- App Store / Play listing
- Plus meter with real Flash-class calls
- K1 eval design or run
- Delete eval harness or fixtures
- On-device vision claims
- PetGPT / named trainer (A5)
