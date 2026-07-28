# OmniVoice for Org Situation Room

This tree is vendored for the ClaudeSkills Org Command Center.

## Start

From `tools/org-command-center`:

```bash
npm run voice:setup   # uv sync or venv — once
npm run voice:up      # serves OpenAI-compatible API on :3900
```

Upstream project: https://github.com/debpalash/OmniVoice-Studio

Model weights are downloaded on first use — do not commit `models/` caches.
