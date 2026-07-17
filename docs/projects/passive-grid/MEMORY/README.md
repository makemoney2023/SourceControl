# Passive Grid — Memory

Filesystem memory for this venture. Loaded when the venture is active (`projects/registry.json`).

| Path | Purpose |
|------|---------|
| `notes.md` | Dated operator notes (`## YYYY-MM-DD` sections) |
| `decisions.md` | Durable decisions table (`date \| decision \| rationale`) |
| `preferences.md` | Standing preferences (bullets) |
| `context.md` | Operator context note (sources index digest; not overwritten by Jarvis `memory.note`) |
| `sessions/` | Session summaries and lifecycle lines (`YYYY-MM-DD.md`, digest files `YYYY-MM-DD-HHmm.md`) |
| `entities/` | Named entity notes (`<slug>.md`) |

**Search:** Jarvis uses semantic recall via local Chroma when running (`tools/org-command-center/.data/chroma/`); grep fallback always works over this tree.

**Chroma (optional):** Run from OCC root:

```bash
cd tools/org-command-center
npx chroma run --path .data/chroma --port 8000
```

Filesystem is source of truth; Chroma is a rebuildable index only.
