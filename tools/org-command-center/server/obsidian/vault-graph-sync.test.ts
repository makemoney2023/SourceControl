import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  mocMetaFromRegistry,
  seatMocTitle,
  syncVaultGraph,
  upsertGraphFooter,
  writeGraphMocs,
} from "./vault-graph-sync";
import type { OrgWorkGraph } from "../../src/jarvis/org-work-graph";
import type { PortfolioRegistry } from "../portfolio-registry";
import type { RosterEntry } from "../../src/lib/types";

function emptyGraph(): OrgWorkGraph {
  return {
    nodes: [],
    edges: [],
    legend: [],
    stats: { seatCount: 0, workCount: 0, edgeCount: 0 },
  };
}

describe("seatMocTitle", () => {
  it("sanitizes path separators so Obsidian can resolve the note", () => {
    expect(seatMocTitle("CEO / Strategist", "Sieger Show Secretary")).toBe(
      "CEO - Strategist — Sieger Show Secretary",
    );
    expect(seatMocTitle("A\\B", "X")).toBe("A - B — X");
  });
});

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
              seats: [
                { title: "CEO / Strategist", links: ["[[1-manager-ceo-strategist]]"] },
              ],
            },
            {
              title: "Blacksage Kennels · Main",
              seats: [{ title: "CEO / Strategist", links: [] }],
            },
          ],
        },
      ],
    });
    const agency = readFileSync(
      join(root, "memorybank/org/GRAPH/Velocity Agency.md"),
      "utf8",
    );
    expect(agency).toContain("[[Blacksage Kennels]]");
    const siegerSeat = readFileSync(
      join(
        root,
        "memorybank/org/GRAPH/seats/CEO - Strategist — Sieger Show Secretary.md",
      ),
      "utf8",
    );
    expect(siegerSeat).toContain("[[1-manager-ceo-strategist]]");
    // Empty-links seat that does not yet exist: stub is OK on first create.
    const mainSeatPath = join(
      root,
      "memorybank/org/GRAPH/seats/CEO - Strategist — Blacksage Kennels · Main.md",
    );
    expect(existsSync(mainSeatPath)).toBe(true);
    const mainSeat = readFileSync(mainSeatPath, "utf8");
    expect(mainSeat).not.toContain("[[1-manager-ceo-strategist]]");
    // Initiative MOC uses the sanitized wiki-link body so [[seat]] resolves.
    const initFile = readFileSync(
      join(root, "memorybank/org/GRAPH/Sieger Show Secretary.md"),
      "utf8",
    );
    expect(initFile).toContain("[[CEO - Strategist — Sieger Show Secretary]]");
  });

  it("does not clobber a seat MOC that already has links when sync passes empty links", () => {
    const root = mkdtempSync(join(tmpdir(), "vault-graph-preserve-"));
    const seatPath = join(
      root,
      "memorybank/org/GRAPH/seats/CEO - Strategist — Sieger Show Secretary.md",
    );
    mkdirSync(dirname(seatPath), { recursive: true });
    const original = "# CEO - Strategist — Sieger Show Secretary\n\n- [[1-manager-ceo-strategist]]\n";
    writeFileSync(seatPath, original);
    writeGraphMocs(root, {
      orgName: "Velocity Agency",
      customers: [
        {
          name: "Blacksage Kennels",
          initiatives: [
            {
              title: "Sieger Show Secretary",
              seats: [{ title: "CEO / Strategist", links: [] }],
            },
          ],
        },
      ],
    });
    expect(readFileSync(seatPath, "utf8")).toBe(original);
  });

  it("writes skill stubs and per-initiative phase MOCs", () => {
    const root = mkdtempSync(join(tmpdir(), "vault-graph-extras-"));
    writeGraphMocs(root, {
      orgName: "Velocity Agency",
      customers: [
        {
          name: "Blacksage Kennels",
          initiatives: [
            {
              title: "Sieger Show Secretary",
              seats: [{ title: "CEO / Strategist", links: [] }],
              phases: [{ number: "1", links: ["[[1-manager-ceo-strategist]]"] }],
            },
          ],
        },
      ],
      skills: [{ slug: "ceo-strategist", name: "CEO — Strategist" }],
    });
    const skill = readFileSync(
      join(root, "memorybank/org/GRAPH/skills/ceo-strategist.md"),
      "utf8",
    );
    expect(skill).toContain("# CEO — Strategist");
    const phase = readFileSync(
      join(root, "memorybank/org/GRAPH/phases/Phase 1 — Sieger Show Secretary.md"),
      "utf8",
    );
    expect(phase).toContain("[[1-manager-ceo-strategist]]");
  });

  it("skips no-op writes so chokidar does not fire twice", () => {
    const root = mkdtempSync(join(tmpdir(), "vault-graph-noop-"));
    const input = {
      orgName: "Velocity Agency",
      customers: [
        {
          name: "C",
          initiatives: [
            {
              title: "I",
              seats: [{ title: "CEO", links: ["[[1-manager-ceo-strategist]]"] }],
            },
          ],
        },
      ],
    };
    writeGraphMocs(root, input);
    const seatPath = join(root, "memorybank/org/GRAPH/seats/CEO — I.md");
    const firstMtimeMs = statSync(seatPath).mtimeMs;
    // Wait a tick so mtimeMs would change if a write happened.
    const wait = new Date().getTime() + 20;
    while (new Date().getTime() < wait) {
      // busy-wait — this is a test.
    }
    writeGraphMocs(root, input);
    expect(statSync(seatPath).mtimeMs).toBe(firstMtimeMs);
  });
});

describe("upsertGraphFooter", () => {
  it("appends a footer and is idempotent", () => {
    const body = "---\nphase: \"1\"\n---\n# Brief\n\nHello\n";
    const links = [
      "[[Sieger Show Secretary]]",
      "[[CEO - Strategist — Sieger Show Secretary]]",
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
  it("writes MOCs and applies spec-shaped footers from per-file footers input", () => {
    const root = mkdtempSync(join(tmpdir(), "vault-sync-"));
    const handoffAbs = join(
      root,
      "memorybank/org/velocity-agency/c/i/HANDOFFS/1-manager-ceo-strategist.md",
    );
    mkdirSync(dirname(handoffAbs), { recursive: true });
    writeFileSync(handoffAbs, "# Brief\n");
    const result = syncVaultGraph(root, {
      orgName: "Velocity Agency",
      customers: [
        {
          name: "C",
          initiatives: [
            {
              title: "Sieger Show Secretary",
              seats: [
                {
                  title: "CEO / Strategist",
                  links: ["[[1-manager-ceo-strategist]]"],
                },
              ],
              phases: [{ number: "1", links: ["[[1-manager-ceo-strategist]]"] }],
            },
          ],
        },
      ],
      footers: [
        {
          abs: handoffAbs,
          links: [
            "[[Sieger Show Secretary]]",
            "[[CEO - Strategist — Sieger Show Secretary]]",
            "[[Phase 1 — Sieger Show Secretary]]",
            "[[2-ic-business-analyst]]",
          ],
        },
      ],
    });
    expect(result.footers).toBe(1);
    const written = readFileSync(handoffAbs, "utf8");
    expect(written).toContain("<!-- graph:start -->");
    expect(written).toContain("[[Sieger Show Secretary]]");
    expect(written).toContain("[[CEO - Strategist — Sieger Show Secretary]]");
    expect(written).toContain("[[Phase 1 — Sieger Show Secretary]]");
  });

  it("agency-only sync (no work) preserves existing seat MOCs", () => {
    const root = mkdtempSync(join(tmpdir(), "vault-sync-agency-"));
    const seatPath = join(
      root,
      "memorybank/org/GRAPH/seats/CEO - Strategist — Sieger Show Secretary.md",
    );
    mkdirSync(dirname(seatPath), { recursive: true });
    const original =
      "# CEO - Strategist — Sieger Show Secretary\n\n- [[1-manager-ceo-strategist]]\n";
    writeFileSync(seatPath, original);
    const reg: PortfolioRegistry = {
      version: 2,
      active: { org: "velocity-agency", customer: "blacksage-kennels", initiative: "sieger-show-secretary" },
      orgs: {
        "velocity-agency": {
          name: "Velocity Agency",
          customers: {
            "blacksage-kennels": {
              name: "Blacksage Kennels",
              initiatives: {
                "sieger-show-secretary": {
                  name: "Sieger Show Secretary",
                  businessIdea: "docs/orgs/velocity-agency/customers/blacksage-kennels/initiatives/sieger-show-secretary/business-idea",
                  memory: "docs/orgs/velocity-agency/customers/blacksage-kennels/initiatives/sieger-show-secretary/MEMORY",
                },
              },
            },
          },
        },
      },
    };
    const roster: RosterEntry[] = [
      { slug: "ceo-strategist", title: "CEO / Strategist", reportsTo: "", level: "manager", dept: "" },
    ];
    // Agency-only graph has no handoff nodes.
    const meta = mocMetaFromRegistry(reg, [{ customer: "blacksage-kennels", initiative: "sieger-show-secretary" }], roster);
    syncVaultGraph(root, meta);
    expect(readFileSync(seatPath, "utf8")).toBe(original);
  });

  it("initiative sync with work fills seat MOC links + writes spec-shaped footer", () => {
    const root = mkdtempSync(join(tmpdir(), "vault-sync-work-"));
    const businessIdea = "docs/orgs/velocity-agency/customers/c/initiatives/i/business-idea";
    const handoffAbs = join(root, businessIdea, "HANDOFFS", "1-manager-ceo-strategist.md");
    mkdirSync(dirname(handoffAbs), { recursive: true });
    writeFileSync(handoffAbs, "# Brief\n");
    const reg: PortfolioRegistry = {
      version: 2,
      active: { org: "velocity-agency", customer: "c", initiative: "i" },
      orgs: {
        "velocity-agency": {
          name: "Velocity Agency",
          customers: {
            c: {
              name: "C",
              initiatives: {
                i: {
                  name: "Sieger Show Secretary",
                  businessIdea,
                  memory: "docs/orgs/velocity-agency/customers/c/initiatives/i/MEMORY",
                },
              },
            },
          },
        },
      },
    };
    const roster: RosterEntry[] = [
      { slug: "ceo-strategist", title: "CEO / Strategist", reportsTo: "", level: "manager", dept: "" },
      { slug: "business-analyst", title: "Business Analyst", reportsTo: "ceo-strategist", level: "ic", dept: "" },
    ];
    const work: OrgWorkGraph = {
      nodes: [
        { id: "seat:ceo-strategist", kind: "seat", label: "CEO / Strategist", slug: "ceo-strategist", x: 0, y: 0 },
        { id: "seat:business-analyst", kind: "seat", label: "Business Analyst", slug: "business-analyst", x: 0, y: 0 },
        {
          id: "handoff:1-manager-ceo-strategist.md",
          kind: "handoff",
          label: "1-manager-ceo-strategist",
          slug: "ceo-strategist",
          phase: "1",
          icsSpawned: ["business-analyst"],
          packsUsed: ["skills/org/positions/ceo-strategist/SKILL.md"],
          x: 0,
          y: 0,
        },
        {
          id: "handoff:2-ic-business-analyst.md",
          kind: "handoff",
          label: "2-ic-business-analyst",
          slug: "business-analyst",
          phase: "1",
          x: 0,
          y: 0,
        },
        { id: "phase:1", kind: "phase", label: "Phase 1", phase: "1", x: 0, y: 0 },
      ],
      edges: [],
      legend: [],
      stats: { seatCount: 2, workCount: 3, edgeCount: 0 },
    };
    const meta = mocMetaFromRegistry(
      reg,
      [{ customer: "c", initiative: "i", work }],
      roster,
    );
    const result = syncVaultGraph(root, meta);
    // Seat MOC written with the manager handoff link
    const seatPath = join(
      root,
      "memorybank/org/GRAPH/seats/CEO - Strategist — Sieger Show Secretary.md",
    );
    expect(readFileSync(seatPath, "utf8")).toContain("[[1-manager-ceo-strategist]]");
    // Footer applied to the actual handoff file
    expect(result.footers).toBeGreaterThanOrEqual(1);
    const footer = readFileSync(handoffAbs, "utf8");
    expect(footer).toContain("[[Sieger Show Secretary]]");
    expect(footer).toContain("[[CEO - Strategist — Sieger Show Secretary]]");
    expect(footer).toContain("[[Phase 1 — Sieger Show Secretary]]");
    // Skill stub written
    const skillPath = join(root, "memorybank/org/GRAPH/skills/ceo-strategist.md");
    expect(existsSync(skillPath)).toBe(true);
    // Phase MOC per initiative
    const phasePath = join(root, "memorybank/org/GRAPH/phases/Phase 1 — Sieger Show Secretary.md");
    expect(existsSync(phasePath)).toBe(true);
  });
});
