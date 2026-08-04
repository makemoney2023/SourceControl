import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import {
  buildQueueForPacket,
  MAX_BATCH,
  previewQueueFor,
  queueDispatchBatch,
} from "./dispatch-for";
import { JarvisExecError } from "./errors";

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), "../../src/lib/fixtures");
const BIZ_IDEA = "docs/projects/passive-grid/business-idea";

function tempRepo() {
  const root = mkdtempSync(join(tmpdir(), "dispatch-for-"));
  mkdirSync(join(root, "projects"), { recursive: true });
  mkdirSync(join(root, "skills/org"), { recursive: true });

  const orgMd = readFileSync(join(FIXTURES, "sample-org-registry.md"), "utf8");
  const extendedOrg = orgMd.replace(
    "| brand-designer | Brand Designer | creative-director | ic | creative |",
    "| brand-designer | Brand Designer | creative-director | ic | creative |\n| cfo | CFO | ceo-strategist | manager | finance |\n| copy-chief | Copy Chief | cmo | ic | marketing |",
  );
  writeFileSync(join(root, "skills/org/ORG-REGISTRY.md"), extendedOrg);

  const modelMd = readFileSync(join(FIXTURES, "sample-model-registry.md"), "utf8");
  const extendedModels = modelMd.replace(
    "| brand-designer | strong-general | `composer-2.5` | brand-stills |",
    "| brand-designer | strong-general | `composer-2.5` | brand-stills |\n| cfo | frontier-reasoning | `grok-4.5` | none |",
  );
  writeFileSync(join(root, "skills/org/MODEL-REGISTRY.md"), extendedModels);

  writeFileSync(
    join(root, "projects/registry.json"),
    JSON.stringify({
      active: "passive-grid",
      projects: {
        "passive-grid": {
          name: "Passive Grid",
          businessIdea: BIZ_IDEA,
          memory: "docs/projects/passive-grid/MEMORY",
        },
      },
    }),
  );
  const idea = join(root, BIZ_IDEA);
  mkdirSync(join(idea, "DISPATCH/queue"), { recursive: true });
  mkdirSync(join(idea, "DISPATCH/claimed"), { recursive: true });
  writeFileSync(
    join(idea, "RUNBOOK-TRACKER.md"),
    readFileSync(join(FIXTURES, "sample-tracker.md"), "utf8"),
  );
  return root;
}

describe("buildQueueForPacket", () => {
  let repo = "";

  afterEach(() => {
    if (repo) rmSync(repo, { recursive: true, force: true });
  });

  it("rejects IC position", () => {
    repo = tempRepo();
    expect(() =>
      buildQueueForPacket(repo, {
        position: "copy-chief",
        goal: "Write homepage copy",
        phase: "6",
      }),
    ).toThrow(/manager/i);
  });

  it("accepts any manager even if not phase owner", () => {
    repo = tempRepo();
    const input = buildQueueForPacket(repo, {
      position: "cfo",
      goal: "Cost model for TEBS",
      phase: "2",
    });
    expect(input.position).toBe("cfo");
    expect(input.phase).toBe("2");
    expect(input.goal).toMatch(/Cost model/);
    expect(input.llm_tier).toBeTruthy();
  });

  it("seeds outputs and write_lease from seat Outputs", () => {
    repo = tempRepo();
    mkdirSync(join(repo, "skills/org/positions/cmo"), { recursive: true });
    writeFileSync(
      join(repo, "skills/org/positions/cmo/SKILL.md"),
      `# CMO

## Outputs
- \`docs/projects/<active>/business-idea/17-channels/email/html/\`
`,
    );
    const input = buildQueueForPacket(repo, {
      position: "cmo",
      goal: "Phase 17 production",
      phase: "17",
    });
    expect(input.outputs).toContain(`${BIZ_IDEA}/17-channels/email/html`);
    expect(input.write_lease).toEqual(
      expect.arrayContaining([
        `${BIZ_IDEA}/17-channels/email/html`,
        `${BIZ_IDEA}/HANDOFFS/17-manager-cmo.md`,
      ]),
    );
  });

  it("defaults phase to current mission phase when omitted", () => {
    repo = tempRepo();
    const input = buildQueueForPacket(repo, {
      position: "head-of-research",
      goal: "Finish evidence base",
    });
    expect(input.phase).toBe("2");
  });

  it("throws JarvisExecError for unknown seat", () => {
    repo = tempRepo();
    expect(() =>
      buildQueueForPacket(repo, { position: "not-a-seat", goal: "Do work", phase: "2" }),
    ).toThrow(JarvisExecError);
  });

  it("sets preferred_ic and acceptance defaults when targetIc provided", () => {
    repo = tempRepo();
    const input = buildQueueForPacket(repo, {
      position: "cmo",
      goal: "Write blog copy",
      phase: "13",
      targetIc: "copy-chief",
    });
    expect(input.preferred_ic).toBe("copy-chief");
    expect(input.require_inbox).toBe(true);
    expect(input.require_ic_handoff).toBe(true);
  });

  it("sets require_inbox when explicitly requested without preferred_ic", () => {
    repo = tempRepo();
    const input = buildQueueForPacket(repo, {
      position: "cmo",
      goal: "Plan awareness campaign",
      phase: "13",
      require_inbox: true,
    });
    expect(input.preferred_ic).toBeUndefined();
    expect(input.require_inbox).toBe(true);
    expect(input.require_ic_handoff).toBeUndefined();
  });
});

describe("previewQueueFor", () => {
  let repo = "";

  afterEach(() => {
    if (repo) rmSync(repo, { recursive: true, force: true });
  });

  it("previews valid manager packet for non-phase owner", () => {
    repo = tempRepo();
    const result = previewQueueFor(repo, {
      position: "cfo",
      goal: "Cost model for TEBS",
      phase: "2",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.packet.position).toBe("cfo");
      expect(result.summary).toMatch(/cfo/i);
    }
  });

  it("includes preferred_ic and acceptance flags when targetIc set", () => {
    repo = tempRepo();
    const result = previewQueueFor(repo, {
      position: "cmo",
      goal: "Write blog copy",
      phase: "13",
      targetIc: "copy-chief",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.packet.preferred_ic).toBe("copy-chief");
      expect(result.packet.require_inbox).toBe(true);
      expect(result.packet.require_ic_handoff).toBe(true);
    }
  });

  it("returns errors for IC position", () => {
    repo = tempRepo();
    expect(() =>
      previewQueueFor(repo, {
        position: "copy-chief",
        goal: "Write copy",
        phase: "2",
      }),
    ).toThrow(/manager/i);
  });
});

describe("queueDispatchBatch", () => {
  let repo = "";

  afterEach(() => {
    if (repo) rmSync(repo, { recursive: true, force: true });
  });

  it("queues multiple managers and returns filenames with spoken summary", () => {
    repo = tempRepo();
    const result = queueDispatchBatch(repo, [
      { position: "head-of-research", goal: "Market evidence", phase: "2" },
      { position: "cfo", goal: "Review burn", phase: "2" },
    ]);
    expect(result.ok).toBe(true);
    expect(result.filenames).toHaveLength(2);
    expect(result.items.map((i) => i.position).sort()).toEqual(["cfo", "head-of-research"]);
    expect(result.spoken).toMatch(/head of research/i);
    expect(result.spoken).toMatch(/cfo/i);
  });

  it(`rejects more than ${MAX_BATCH} items`, () => {
    repo = tempRepo();
    const items = Array.from({ length: MAX_BATCH + 1 }, (_, i) => ({
      position: "head-of-research",
      goal: `Task ${i}`,
      phase: "2",
    }));
    expect(() => queueDispatchBatch(repo, items)).toThrow(/max/i);
  });

  it("rejects empty batch", () => {
    repo = tempRepo();
    expect(() => queueDispatchBatch(repo, [])).toThrow(/items/i);
  });
});
