import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  seatMocTitle,
  syncVaultGraph,
  upsertGraphFooter,
  writeGraphMocs,
} from "./vault-graph-sync";

describe("writeGraphMocs", () => {
  it("writes agency, customer, initiative, and per-initiative seat notes", () => {
    const root = mkdtempSync(join(tmpdir(), "vault-graph-"));
    writeGraphMocs(root, {
      orgName: "Velocity Agency",
      customers: [
        {
          name: "Blacksage Kennels",
          initiatives: [
            {
              title: "Sieger Show Secretary",
              seats: [{ title: "CEO / Strategist", links: ["[[1-manager-ceo-strategist]]"] }],
            },
            {
              title: "Blacksage Kennels · Main",
              seats: [{ title: "CEO / Strategist", links: [] }],
            },
          ],
        },
      ],
    });
    const agency = readFileSync(join(root, "memorybank/org/GRAPH/Velocity Agency.md"), "utf8");
    expect(agency).toContain("[[Blacksage Kennels]]");
    const siegerSeat = readFileSync(
      join(root, "memorybank/org/GRAPH/seats/CEO / Strategist — Sieger Show Secretary.md"),
      "utf8",
    );
    expect(siegerSeat).toContain("[[1-manager-ceo-strategist]]");
    const mainSeat = readFileSync(
      join(root, "memorybank/org/GRAPH/seats/CEO / Strategist — Blacksage Kennels · Main.md"),
      "utf8",
    );
    expect(mainSeat).not.toContain("[[1-manager-ceo-strategist]]");
    expect(seatMocTitle("CEO / Strategist", "Sieger Show Secretary")).toBe(
      "CEO / Strategist — Sieger Show Secretary",
    );
  });
});

describe("upsertGraphFooter", () => {
  it("appends a footer and is idempotent", () => {
    const body = "---\nphase: \"1\"\n---\n# Brief\n\nHello\n";
    const links = [
      "[[Sieger Show Secretary]]",
      "[[CEO / Strategist — Sieger Show Secretary]]",
    ];
    const once = upsertGraphFooter(body, links);
    const twice = upsertGraphFooter(once, links);
    expect(once).toContain("<!-- graph:start -->");
    expect(once).toContain("[[Sieger Show Secretary]]");
    expect(twice).toBe(once);
    expect(once.startsWith("---\nphase:")).toBe(true);
  });

  it("replaces an existing footer when links change", () => {
    const first = upsertGraphFooter("# A\n", ["[[Old]]"]);
    const next = upsertGraphFooter(first, ["[[New]]"]);
    expect(next).toContain("[[New]]");
    expect(next).not.toContain("[[Old]]");
    expect(next.split("<!-- graph:start -->")).toHaveLength(2);
  });
});

describe("syncVaultGraph", () => {
  it("syncVaultGraph writes MOCs and a footer on an existing handoff", () => {
    const root = mkdtempSync(join(tmpdir(), "vault-sync-"));
    const handoffAbs = join(
      root,
      "memorybank/org/velocity-agency/c/i/HANDOFFS/1-manager-ceo-strategist.md",
    );
    mkdirSync(dirname(handoffAbs), { recursive: true });
    writeFileSync(handoffAbs, "# Brief\n");
    const result = syncVaultGraph(
      root,
      {
        nodes: [
          {
            id: "handoff:1-manager-ceo-strategist.md",
            kind: "handoff",
            label: "1-manager-ceo-strategist",
            slug: "ceo-strategist",
            x: 0,
            y: 0,
          },
        ],
        edges: [],
        legend: [],
        stats: { seatCount: 0, workCount: 1, edgeCount: 0 },
      },
      {
        orgName: "Velocity Agency",
        customers: [
          {
            name: "C",
            initiatives: [
              {
                title: "I",
                seats: [
                  {
                    title: "CEO / Strategist",
                    links: ["[[1-manager-ceo-strategist]]"],
                    handoffAbsPaths: [handoffAbs],
                  },
                ],
              },
            ],
          },
        ],
      },
    );
    expect(result.footers).toBe(1);
    expect(readFileSync(handoffAbs, "utf8")).toContain("<!-- graph:start -->");
  });
});
