---
name: parallel-research
description: >-
  Use when running web search, extract, deep research, or data enrichment via Parallel MCP/plugin skills.
---

# Parallel Research

Thin adapter for digital workers. See `skills/org/TOOL-REGISTRY.md`.

## Preferred access
Parallel plugin skills + MCP

## Env / secrets
`PARALLEL_API_KEY`

Resolve via `skills/integrations/obsidian-secrets/` then `.env.local`.

## MCP
Parallel plugin server (web-search, web-extract, deep-research, data-enrichment)

## Primary ops
1. Load `skills/plugins/parallel/` skill that matches the task
2. Prefer Parallel for multi-source research; Firecrawl for site-specific crawl
3. Cite sources; label confidence on handoffs

## Fallback
firecrawl + context7-docs + browser

## Common failures
Deep research is expensive — use only when explicitly needed
