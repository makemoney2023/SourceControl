import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildPhaseIcLeases } from "./phase-ic-leases";
import type { OrgRegistry } from "./types";

function stubSeat(root: string, slug: string, outputs: string[]) {
  const dir = join(root, "skills/org/positions", slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, "SKILL.md"),
    `---\nname: ${slug}\n---\n# ${slug}\n\n## Outputs\n${outputs.map((o) => `- \`${o}\``).join("\n")}\n`,
    "utf8",
  );
}

describe("buildPhaseIcLeases", () => {
  it("returns non-overlapping leases for phase 17 ICs", () => {
    const root = mkdtempSync(join(tmpdir(), "ic-leases-"));
    mkdirSync(join(root, "projects"), { recursive: true });
    writeFileSync(
      join(root, "projects/registry.json"),
      JSON.stringify({
        active: "x",
        projects: {
          x: { name: "X", businessIdea: "docs/projects/x/business-idea" },
        },
      }),
    );
    stubSeat(root, "lifecycle-marketer", [
      "docs/projects/<active>/business-idea/17-channels/email/html/",
    ]);
    stubSeat(root, "content-strategist", [
      "docs/projects/<active>/business-idea/17-channels/social/",
    ]);

    const org: OrgRegistry = {
      roster: [],
      phaseOwners: [
        {
          phase: "17",
          managerOwner: "cmo",
          maySpawn: ["lifecycle-marketer", "content-strategist"],
          csuiteReviewer: "cmo",
          secondary: "",
          scorecard: "",
        },
      ],
    };

    const result = buildPhaseIcLeases(root, org, "17");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.leases).toHaveLength(2);
    expect(result.leases[0].write_lease[0]).toContain("email/html");
    expect(result.leases[1].write_lease[0]).toContain("social");
  });

  it("fails on colliding write_lease paths", () => {
    const root = mkdtempSync(join(tmpdir(), "ic-leases-collide-"));
    mkdirSync(join(root, "projects"), { recursive: true });
    writeFileSync(
      join(root, "projects/registry.json"),
      JSON.stringify({
        active: "x",
        projects: {
          x: { name: "X", businessIdea: "docs/projects/x/business-idea" },
        },
      }),
    );
    stubSeat(root, "lifecycle-marketer", [
      "docs/projects/<active>/business-idea/17-channels/",
    ]);
    stubSeat(root, "content-strategist", [
      "docs/projects/<active>/business-idea/17-channels/",
    ]);

    const org: OrgRegistry = {
      roster: [],
      phaseOwners: [
        {
          phase: "17",
          managerOwner: "cmo",
          maySpawn: ["lifecycle-marketer", "content-strategist"],
          csuiteReviewer: "cmo",
          secondary: "",
          scorecard: "",
        },
      ],
    };

    const result = buildPhaseIcLeases(root, org, "17");
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toBe("write_lease_collision");
    expect(result.collisions.length).toBeGreaterThan(0);
  });
});
