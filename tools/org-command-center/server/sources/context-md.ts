const OPERATOR_HEADING = "## Operator note";
const DIGEST_HEADING = "## Sources digest";
const DIGEST_START = "<!-- auto:sources-digest -->";
const DIGEST_END = "<!-- /auto:sources-digest -->";

export function seedContextMd(operatorNote = ""): string {
  const note = operatorNote.trim();
  return `# Venture context

${OPERATOR_HEADING}

${note}

${DIGEST_HEADING}

${DIGEST_START}

${DIGEST_END}
`;
}

export function readOperatorNote(md: string): string {
  const start = md.indexOf(OPERATOR_HEADING);
  if (start === -1) return "";
  const afterHeading = md.indexOf("\n", start);
  if (afterHeading === -1) return "";
  const bodyStart = afterHeading + 1;
  const digestStart = md.indexOf(DIGEST_HEADING, bodyStart);
  const bodyEnd = digestStart === -1 ? md.length : digestStart;
  return md.slice(bodyStart, bodyEnd).trim();
}

export function writeOperatorNote(md: string, note: string): string {
  const trimmed = note.trim();
  const start = md.indexOf(OPERATOR_HEADING);
  const digestStart = md.indexOf(DIGEST_HEADING);

  if (start === -1 || digestStart === -1) {
    return seedContextMd(trimmed);
  }

  const afterHeading = md.indexOf("\n", start);
  const bodyStart = afterHeading === -1 ? start + OPERATOR_HEADING.length : afterHeading + 1;
  const before = md.slice(0, bodyStart);
  const after = md.slice(digestStart);
  return `${before}${trimmed}\n\n${after}`;
}

export function writeSourcesDigest(md: string, lines: string[]): string {
  const block = lines.length > 0 ? lines.join("\n") : "";
  const replacement = `${DIGEST_START}\n${block}\n${DIGEST_END}`;

  if (md.includes(DIGEST_START) && md.includes(DIGEST_END)) {
    const start = md.indexOf(DIGEST_START);
    const end = md.indexOf(DIGEST_END, start) + DIGEST_END.length;
    return md.slice(0, start) + replacement + md.slice(end);
  }

  if (md.includes(DIGEST_HEADING)) {
    const headingStart = md.indexOf(DIGEST_HEADING);
    const afterHeading = md.indexOf("\n", headingStart);
    const insertAt = afterHeading === -1 ? md.length : afterHeading + 1;
    return `${md.slice(0, insertAt)}\n${replacement}\n${md.slice(insertAt).trimEnd()}\n`;
  }

  return `${md.trimEnd()}\n\n${DIGEST_HEADING}\n\n${replacement}\n`;
}
