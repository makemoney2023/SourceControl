import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export function seatMocTitle(seatTitle: string, initiativeTitle: string): string {
  return `${seatTitle} — ${initiativeTitle}`;
}

export type MocSeat = { title: string; links: string[] };
export type MocInitiative = { title: string; seats: MocSeat[] };
export type MocCustomer = { name: string; initiatives: MocInitiative[] };
export type MocInput = { orgName: string; customers: MocCustomer[] };

function writeNote(abs: string, body: string) {
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, body.endsWith("\n") ? body : `${body}\n`);
}

export function writeGraphMocs(repoRoot: string, input: MocInput) {
  const base = join(repoRoot, "memorybank/org/GRAPH");
  writeNote(
    join(base, `${input.orgName}.md`),
    `# ${input.orgName}\n\n## Customers\n\n${input.customers.map((c) => `- [[${c.name}]]`).join("\n")}\n`,
  );
  for (const c of input.customers) {
    writeNote(
      join(base, `${c.name}.md`),
      `# ${c.name}\n\n## Initiatives\n\n${c.initiatives.map((i) => `- [[${i.title}]]`).join("\n")}\n`,
    );
    for (const i of c.initiatives) {
      writeNote(
        join(base, `${i.title}.md`),
        `# ${i.title}\n\n## Seats\n\n${i.seats.map((s) => `- [[${seatMocTitle(s.title, i.title)}]]`).join("\n")}\n`,
      );
      for (const s of i.seats) {
        writeNote(
          join(base, "seats", `${seatMocTitle(s.title, i.title)}.md`),
          `# ${seatMocTitle(s.title, i.title)}\n\n${s.links.map((l) => `- ${l}`).join("\n")}\n`,
        );
      }
    }
  }
}

export const FOOTER_START = "<!-- graph:start -->";
export const FOOTER_END = "<!-- graph:end -->";

export function upsertGraphFooter(markdown: string, links: string[]): string {
  const block = `${FOOTER_START}\n${links.join(" · ")}\n${FOOTER_END}\n`;
  const re = new RegExp(
    `${FOOTER_START.replace(/[<>!-]/g, "\\$&")}[\\s\\S]*?${FOOTER_END.replace(/[<>!-]/g, "\\$&")}\\n?`,
  );
  if (re.test(markdown)) return markdown.replace(re, block);
  const trimmed = markdown.endsWith("\n") ? markdown : `${markdown}\n`;
  return `${trimmed}\n${block}`;
}

export function applyFooters(
  repoRoot: string,
  files: { abs: string; links: string[] }[],
) {
  for (const { abs, links } of files) {
    if (!existsSync(abs)) continue;
    const body = readFileSync(abs, "utf8");
    writeFileSync(abs, upsertGraphFooter(body, links));
  }
}
