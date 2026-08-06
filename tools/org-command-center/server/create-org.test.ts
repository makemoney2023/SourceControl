import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createOrg } from "./create-org";
import { loadRegistry } from "./paths";

function miniRepo(): string {
  const root = mkdtempSync(join(tmpdir(), "create-org-"));
  mkdirSync(join(root, "projects"), { recursive: true });
  writeFileSync(
    join(root, "projects/registry.json"),
    JSON.stringify({
      version: 2,
      active: { org: "velocity-agency", customer: "demo", initiative: "main" },
      orgs: {
        "velocity-agency": {
          name: "Velocity Agency",
          customers: {
            demo: {
              name: "Demo",
              initiatives: {
                main: {
                  name: "Main",
                  businessIdea: "docs/projects/demo/business-idea",
                  memory: "docs/projects/demo/MEMORY",
                },
              },
            },
          },
        },
      },
    }),
  );
  return root;
}

describe("createOrg", () => {
  let root = "";
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("adds a peer agency without removing velocity-agency", () => {
    root = miniRepo();
    const result = createOrg(root, {
      name: "Superpatch",
      slug: "superpatch",
      activate: false,
    });
    expect(result.org).toBe("superpatch");
    expect(result.name).toBe("Superpatch");
    const reg = loadRegistry(root);
    expect(reg.orgs["velocity-agency"]).toBeTruthy();
    expect(reg.orgs.superpatch.name).toBe("Superpatch");
    expect(reg.orgs.superpatch.customers).toEqual({});
    expect(reg.active.org).toBe("velocity-agency");
  });

  it("rejects duplicate org slug", () => {
    root = miniRepo();
    expect(() =>
      createOrg(root, { name: "Velocity Agency", slug: "velocity-agency" }),
    ).toThrow(/already/i);
  });
});
