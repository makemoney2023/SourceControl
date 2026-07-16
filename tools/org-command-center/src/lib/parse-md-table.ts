/** Parse a GitHub-flavored markdown table into row objects keyed by header. */
export function parseMarkdownTable(markdown: string, sectionHeading?: string): string[][] {
  let block = markdown;
  if (sectionHeading) {
    const idx = markdown.indexOf(sectionHeading);
    if (idx === -1) return [];
    block = markdown.slice(idx);
    const next = block.slice(sectionHeading.length).search(/\n## /);
    if (next !== -1) block = block.slice(0, sectionHeading.length + next);
  }

  const lines = block
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|"));

  if (lines.length < 2) return [];

  const rows: string[][] = [];
  for (const line of lines) {
    if (/^\|\s*[-:| ]+\|$/.test(line)) continue;
    const cells = line
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((c) => c.trim());
    rows.push(cells);
  }
  return rows;
}

export function tableAsObjects(rows: string[][]): Record<string, string>[] {
  if (rows.length < 1) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((cells) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = (cells[i] ?? "").trim();
    });
    return obj;
  });
}
