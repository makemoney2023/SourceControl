#!/usr/bin/env bash
# Write PRODUCTION-SCORECARD.md for a venture (default blacksage-kennels).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENTURE="${1:-blacksage-kennels}"
BIZ="docs/projects/$VENTURE/business-idea"
OUT="$ROOT/$BIZ/PRODUCTION-SCORECARD.md"
FAIL_UNDER="${FAIL_UNDER:-}"

cd "$ROOT/tools/org-command-center"
npx --yes tsx -e "
import { writeFileSync } from 'node:fs';
import { scoreVentureProduction, formatScorecardMarkdown } from './src/lib/venture-production-scorecard.ts';
const card = scoreVentureProduction(process.cwd() + '/../..', {
  venture: '$VENTURE',
  businessIdeaRel: '$BIZ',
});
writeFileSync('$OUT', formatScorecardMarkdown(card));
const p17 = card.phases.find(p => p.phase === '17');
console.log(JSON.stringify({ venture: card.venture, phase17: p17 }, null, 2));
if (process.env.FAIL_UNDER) {
  const min = Number(process.env.FAIL_UNDER);
  if ((p17?.layerB ?? 0) < min) {
    console.error('FAIL_UNDER: phase 17 Layer B', p17?.layerB, '<', min);
    process.exit(1);
  }
}
"
echo "Wrote $OUT"
