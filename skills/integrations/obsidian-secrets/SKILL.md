---
name: obsidian-secrets
description: >-
  Use when resolving API keys or credentials from Obsidian vault notes before calling external APIs, or when .env.local values are empty.
---

# Obsidian Secrets

Thin adapter for digital workers. See `skills/org/TOOL-REGISTRY.md`.

## Preferred access
Obsidian MCP (when configured)

## Env / secrets
— (reads vault; writes nothing secret to git)

Resolve via `skills/integrations/obsidian-secrets/` then `.env.local`.

## MCP
Obsidian MCP server if available — otherwise skip to `.env.local`

## Primary ops
1. Search vault for the named key (e.g. FIRECRAWL_API_KEY, GA4_PROPERTY_ID)
2. If MCP absent, read repo `.env.local` placeholders only
3. Never print full secrets in handoffs — reference env var names
4. Never commit secrets into docs/business-idea

## Fallback
`.env.local` in repo root

## Common failures
If neither source has the key → tool_status unavailable; ask human
