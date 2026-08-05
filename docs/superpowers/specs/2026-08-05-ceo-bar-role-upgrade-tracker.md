# CEO-bar role upgrade tracker

**Date:** 2026-08-05  
**Bar:** Role Upgrade Checklist A–G in [`2026-08-05-ceo-position-skill-upgrade-design.md`](./2026-08-05-ceo-position-skill-upgrade-design.md)  
**Gold pattern:** `ceo-strategist`, `cfo`, `cmo` (May-spawn ≠ Delegates; phase playbooks; HEARTBEAT; CHANGELOG; agent sync)

## Status legend

| Mark | Meaning |
|------|---------|
| ✅ | CEO bar shipped (checklist A–G + agents synced) |
| 🔄 | In progress |
| ⬜ | Not started |
| — | N/A (IC / no phase ownership playbooks beyond IC protocol) |

---

## Wave 1 — Phase-owning managers

| # | Seat | Owns phases | Status | Gaps noted (pre-upgrade) | Commit / notes |
|---|------|-------------|--------|--------------------------|----------------|
| 1 | `ceo-strategist` | 0, 1, 3, 10, 21, 22 | ✅ | Spawn conflict; no playbooks | `87b8267` |
| 2 | `head-of-research` | 2 (+ secondary 10) | ✅ | May-spawn missing seo-manager | `40b3e15` |
| 3 | `cfo` | 4, 4B (+ spend) | ✅ | May-spawn PMM; Office Layer B | `9f84711` |
| 4 | `head-of-product` | 5 (+ scope) | ✅ | No playbook / HEARTBEAT / scope protocol | `6bca302` |
| 5 | `cmo` | 6, 13–14, 16–19 (+0 peer) | ✅ | brand-designer / video-producer forbidden vs registry | `6bca302` |
| 6 | `creative-director` | 11, 12, 15 | ✅ | No May-spawn; no playbooks; shippable 11/12/15 | this pass |
| 7 | `head-of-sales-cs` | 7 | ✅ | No May-spawn; no playbook / HEARTBEAT | this pass |
| 8 | `coo` | 8 (+0 peer, legal) | ✅ | No May-spawn; Phase 0 peer; legal→coo | this pass |
| 9 | `head-of-people` | 8B | ✅ | No May-spawn; no playbook / HEARTBEAT | this pass |
| 10 | `cto` | 9, 9B | ✅ | Shippable eng; verifier spawn; scope→HoP | this pass |
| 11 | `head-of-data` | 20 (+22 on-demand) | ✅ | No May-spawn; Phase 22 peer path | this pass |

**Wave 1 exit:** all 11 managers ✅

---

## Wave 2 — Craft-heavy ICs (after Wave 1)

Prioritize seats that own production / complex craft. Check IC protocol (A4): no May-spawn; Delegates `_None_`; HEARTBEAT + CHANGELOG still required when upgrading.

| Dept | Seats | Status |
|------|-------|--------|
| Creative | `brand-designer`, `web-designer`, `video-producer` | ⬜ |
| Marketing | `lifecycle-marketer`, `copy-chief`, `content-strategist`, `seo-manager`, `paid-media-manager`, `pr-manager`, `product-marketing-manager` | ⬜ (lifecycle already strong craft — still verify A–G) |
| Eng | `tech-lead`, `hardware-engineer`, `verifier` | ⬜ (verifier strong — verify A–G) |
| Finance | `fpa-analyst`, `fundraising-lead` | ⬜ (fundraising has CHANGELOG from Layer B — verify bar) |
| Research | `market-research-analyst`, `competitive-intelligence-analyst` | ⬜ |
| Sales | `sales-enablement-lead`, `outbound-lead`, `customer-success-manager` | ⬜ |
| Ops / People / Data | `ops-manager`, `legal-counsel`, `recruiter`, `analytics-engineer` | ⬜ |
| Product | `product-manager`, `business-analyst` | ⬜ |

---

## Per-seat mini checklist (copy when upgrading)

For each slug:

- [ ] A Registry: Owns + May-spawn match ORG-REGISTRY; peers via orchestrator
- [ ] B Structure: template sections + HEARTBEAT + MODEL/TOOL packs
- [ ] C Playbooks: every owned phase (managers) with scorecard echo + artifact shape
- [ ] D Craft: falsifiable done; production-artifacts on shippable
- [ ] E Handoff chain + do not mark ✅
- [ ] F Consistency vs COLLABORATION / ESCALATION / orchestrator
- [ ] G `CHANGELOG.md` newest-first entry
- [ ] Agent: `templates/org/agents/<slug>.md` + `scripts/sync-org-agents.sh`

---

## Update log

| Date | Change |
|------|--------|
| 2026-08-05 | Tracker created; Wave 1 #1–5 done; #6–11 in this pass |
| 2026-08-05 | Wave 1 complete — all phase-owning managers at CEO bar; agents synced |
