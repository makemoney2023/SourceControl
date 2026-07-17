# Passive Grid — Memory

Filesystem memory for this venture. Loaded when the venture is active (`projects/registry.json`).

| Path | Purpose |
|------|---------|
| `decisions.md` | Durable decisions and rationale |
| `sessions/` | Session summaries (append chronologically) |
| `entities/` | Named entity notes (competitors, partners, parts) |

No vector DB in v1 — search with grep / ripgrep. Chroma may be added later for semantic recall only.
