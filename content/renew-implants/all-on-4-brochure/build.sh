#!/usr/bin/env bash
# Renders brochure.html to a print-ready US Letter PDF with headless Chrome,
# then rasterizes each page to PNG for visual review.
set -euo pipefail
cd "$(dirname "$0")"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT="All-on-4-Total-Solutions-Care-Plan.pdf"

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=4000 \
  --print-to-pdf="$PWD/$OUT" \
  "file://$PWD/brochure.html" 2>/dev/null

mkdir -p preview
pdftoppm -r 110 -png "$OUT" preview/page
echo "Wrote $OUT ($(python3 -c "from pypdf import PdfReader;print(len(PdfReader('$OUT').pages))" 2>/dev/null || echo '?') pages)"
ls preview
