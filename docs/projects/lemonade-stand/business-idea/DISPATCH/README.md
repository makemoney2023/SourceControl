# DISPATCH/

Queue for **Org Command Center** → **company-orchestrator**.

| Dir | Meaning |
|-----|---------|
| `queue/` | Pending manager packets (YAML). Oldest first. |
| `claimed/` | Packets the orchestrator has claimed and is spawning. |

## Packet shape

See `docs/superpowers/specs/2026-07-16-org-command-center-design.md`.

## Orchestrator rule

On session start / before inventing a phase packet: if `queue/` is non-empty, **claim oldest**, move to `claimed/`, spawn that **manager only** with the packet fields. Do not invent packs. Do not spawn ICs from the queue.
