# Changelog — tech-lead

## 2026-08-05 — Context7 + Playwright operational wiring

**Why:** Context7 was primary and Playwright secondary in registry but Phase 9 playbook/HEARTBEAT did not mandate live docs or smoke.

**Changed**
- Integrations: `playwright-browser` promoted to **primary**
- Phase 9: Must-read + procedure require Context7 before library APIs and Playwright smoke for critical routes
- HEARTBEAT / agents / templates: Tool gates + `tool_status` on handoff

## 2026-08-05 — CEO-bar IC upgrade

**Why:** IC seat lacked phase craft playbooks, HEARTBEAT, and durable upgrade history.

**Changed**
- Spawn / Delegates: unchanged (`_None — IC seat_`)
- Phase craft playbooks: Added Phase 9 (TDD MVP) with PRD traceability and production fields
- Scorecards / done criteria: Playbook follow + TDD evidence in build log
- HEARTBEAT: IC variant (TDD, scope→HoP via ask_manager, no spawn verifier)
- Agent template: First action reads SKILL + HEARTBEAT; history pointer

**Checklist:** Role Upgrade Checklist A–G passed (spec `docs/superpowers/specs/2026-08-05-ceo-position-skill-upgrade-design.md`)
