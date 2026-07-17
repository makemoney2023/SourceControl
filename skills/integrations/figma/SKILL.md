---
name: figma
description: >-
  Use when reading or writing Figma designs, Code Connect, or design-system work via Figma MCP and plugin skills.
---

# Figma

Thin adapter for digital workers. See `skills/org/TOOL-REGISTRY.md`.

## Preferred access
Figma MCP + `skills/plugins/figma/` skills

## Env / secrets
Figma auth via MCP (whoami / mcp_auth as needed)

Resolve via `skills/integrations/obsidian-secrets/` then `.env.local`.

## MCP
`plugin-figma-figma`, `user-Figma`

## Primary ops
1. Load mandatory figma-* skills before use_figma / get_design_context
2. Parse fileKey/nodeId from figma.com URLs
3. search_design_system before generating components

## Fallback
Exported frames / screenshots in the repo

## Common failures
Auth errors → mcp_auth; never invent design tokens
