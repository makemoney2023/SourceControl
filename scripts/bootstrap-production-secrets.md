# Bootstrap production secrets (Plane B)

Resolve secrets via Obsidian MCP / `skills/integrations/obsidian-secrets/`, then write **repo-root** `.env.local` (gitignored). Never commit values.

## Local FLUX.2-dev (Mac primary)

| Var | Purpose |
|-----|---------|
| `HF_TOKEN` | Hugging Face token after accepting [FLUX.2-dev](https://huggingface.co/black-forest-labs/FLUX.2-dev) conditions |
| `AI_TOOLKIT_ROOT` | Absolute path to Ostris ai-toolkit (default `/Users/cbsuperpatch/Desktop/ai-toolkit`) |

Commercial Layer B stills from local weights require `license_basis: bfl-self-hosted-commercial` on the handoff (operator legal confirmation). Otherwise mark `photoreal_qa: draft`.

## fal commercial / API upgrade

| Var | Purpose |
|-----|---------|
| `FAL_KEY` or `FAL_AI_API_KEY` | fal FLUX.2 max/pro via `skills/integrations/fal-media/` |

## Other Plane B

| Var | Purpose |
|-----|---------|
| `ELEVENLABS_API_KEY` | Voice / OpenMontage audio |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob upload for ESP-hosted images |

## Verify

```bash
DOCTOR_ALLOW_MISSING_KEYS=0 bash scripts/doctor-production-runtime.sh
```

CI uses `DOCTOR_ALLOW_MISSING_KEYS=1`.
