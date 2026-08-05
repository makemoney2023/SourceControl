# Position skill template

Copy to `positions/<slug>/SKILL.md`. See also HANDOFF-TEMPLATE, MANAGER-BRIEF-TEMPLATE, CSUITE-REVIEW-TEMPLATE, COLLABORATION, ESCALATION.

Required sections: Purpose, Reports to, Delegates to, Collaborates with, Owns phases, Skill packs, Integrations (from TOOL-REGISTRY), Inputs, Outputs, Delegation protocol (manager or IC), Reporting chain, Context packet, Model profile, Done criteria.

Managers must: spawn → await handoffs → merge → manager brief → return for C-suite.  
ICs must: write lease only → IC handoff → ask_manager for peers → never spawn.

## Phase playbooks & upgrades

- Managers who own phases: include `## Phase playbooks` (and a **May spawn** table aligned to ORG-REGISTRY). See Role Upgrade Checklist §C in [`docs/superpowers/specs/2026-08-05-ceo-position-skill-upgrade-design.md`](../../docs/superpowers/specs/2026-08-05-ceo-position-skill-upgrade-design.md).
- On each intentional skill upgrade: append `positions/<slug>/CHANGELOG.md` (checklist §G). Optional one-line pointer at end of SKILL.md: `History: see CHANGELOG.md`.
- Before shipping a position upgrade, complete the Role Upgrade Checklist in that spec (sections A–G). Do not duplicate the full checklist here (avoid drift).

## HEARTBEAT

Copy `skills/org/templates/HEARTBEAT.md` to `positions/<slug>/HEARTBEAT.md` and tailor.
