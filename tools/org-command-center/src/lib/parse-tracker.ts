import { parseMarkdownTable, tableAsObjects } from "./parse-md-table";
import type { PhaseRow, PositionsRow, Tracker } from "./types";

function metaField(md: string, label: string): string {
  const re = new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+)`);
  const m = md.match(re);
  return m?.[1]?.trim() ?? "";
}

export function parseTracker(md: string): Tracker {
  const phaseRows = tableAsObjects(parseMarkdownTable(md, "## Phase status"));
  const phases: PhaseRow[] = phaseRows
    .filter((r) => r.Phase)
    .map((r) => ({
      phase: r.Phase,
      name: r.Name ?? "",
      status: r.Status ?? "",
      artifact: r.Artifact ?? "",
      notes: r.Notes ?? "",
    }));

  const posRows = tableAsObjects(parseMarkdownTable(md, "## Positions & handoffs"));
  const positions: PositionsRow[] = posRows
    .filter((r) => r.Phase)
    .map((r) => ({
      phase: r.Phase,
      manager: r.Manager ?? "",
      icsSpawned: r["ICs spawned"] ?? "",
      handoffDir: (r["Handoff dir"] ?? "").replace(/`/g, ""),
      csuiteVerdict: r["C-suite verdict"] ?? "",
      reviewer: r.Reviewer ?? "",
      managerLlmTier: r["Manager llm_tier"] ?? "",
    }));

  return {
    idea: metaField(md, "Idea"),
    classification: metaField(md, "Classification"),
    mode: metaField(md, "Mode"),
    depth: metaField(md, "Depth"),
    currentPhase: metaField(md, "Current phase"),
    phases,
    positions,
    raw: md,
  };
}

export function patchTrackerPhaseStatus(
  md: string,
  phase: string,
  status: string,
): string {
  const lines = md.split("\n");
  let inPhaseTable = false;
  const out = lines.map((line) => {
    if (line.startsWith("## Phase status")) {
      inPhaseTable = true;
      return line;
    }
    if (inPhaseTable && line.startsWith("## ")) {
      inPhaseTable = false;
    }
    if (inPhaseTable && line.startsWith("|")) {
      const cells = line
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((c) => c.trim());
      if (cells[0] === phase && cells.length >= 3 && !/^[-:]+$/.test(cells[0])) {
        cells[2] = status;
        return `| ${cells.join(" | ")} |`;
      }
    }
    return line;
  });

  let result = out.join("\n");
  result = result.replace(
    /\*\*Current phase:\*\*\s*.+/,
    `**Current phase:** ${phase}`,
  );
  result = result.replace(
    /\*\*Last updated:\*\*\s*.+/,
    `**Last updated:** ${new Date().toISOString().slice(0, 10)}`,
  );
  return result;
}

export function seedPositionsRow(
  md: string,
  row: {
    phase: string;
    manager: string;
    icsSpawned: string;
    handoffDir: string;
    csuiteVerdict: string;
    reviewer: string;
    managerLlmTier: string;
  },
): string {
  const newRow = `| ${row.phase} | ${row.manager} | ${row.icsSpawned} | \`${row.handoffDir}\` | ${row.csuiteVerdict} | ${row.reviewer} | ${row.managerLlmTier} |`;

  const lines = md.split("\n");
  let inPos = false;
  let headerSeen = false;
  let sepSeen = false;
  let inserted = false;
  const out: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("## Positions & handoffs")) {
      inPos = true;
      out.push(line);
      continue;
    }
    if (inPos && line.startsWith("## ")) {
      if (!inserted) {
        out.push(newRow);
        inserted = true;
      }
      inPos = false;
      out.push(line);
      continue;
    }
    if (inPos && line.startsWith("|")) {
      const cells = line
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((c) => c.trim());
      if (!headerSeen) {
        headerSeen = true;
        out.push(line);
        continue;
      }
      if (!sepSeen && /^[-:| ]+$/.test(cells.join("|")) || cells.every((c) => /^[-:]+$/.test(c))) {
        sepSeen = true;
        out.push(line);
        continue;
      }
      if (cells[0] === row.phase) {
        out.push(newRow);
        inserted = true;
        continue;
      }
      // Skip empty placeholder row
      if (!cells[0] || cells[0] === "") {
        if (!inserted) {
          out.push(newRow);
          inserted = true;
        }
        continue;
      }
      out.push(line);
      continue;
    }
    out.push(line);
  }

  if (inPos && !inserted) {
    out.push(newRow);
  }

  return out.join("\n");
}
