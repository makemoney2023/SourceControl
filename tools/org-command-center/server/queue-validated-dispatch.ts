import { readFileSync, writeFileSync } from "node:fs";
import { relative } from "node:path";
import { enqueueDispatch } from "../src/lib/dispatch-queue";
import { parseModelRegistry, parseOrgRegistry, resolvePhaseOwner } from "../src/lib/parse-registry";
import { patchTrackerPhaseStatus, parseTracker, seedPositionsRow } from "../src/lib/parse-tracker";
import { validateManagerPacket } from "../src/lib/validate-packet";
import type { ManagerPacket, ManagerPacketInput } from "../src/lib/types";
import { assertReadable, assertWritable, businessIdeaFile, dispatchRoot, trackerPath } from "./paths";
import { appendVentureContextReads } from "./sources/context-reads";

export type QueueValidatedDispatchResult =
  | { ok: true; packet: ManagerPacket; path: string }
  | { ok: false; errors: string[] };

export function queueValidatedDispatch(
  repoRoot: string,
  raw: ManagerPacketInput,
  options?: { allowAnyManager?: boolean },
): QueueValidatedDispatchResult {
  const body = { ...raw };
  const org = parseOrgRegistry(
    readFileSync(assertReadable(repoRoot, "skills/org/ORG-REGISTRY.md"), "utf8"),
  );
  const models = parseModelRegistry(
    readFileSync(assertReadable(repoRoot, "skills/org/MODEL-REGISTRY.md"), "utf8"),
  );
  const owner = resolvePhaseOwner(org, body.phase);
  if (owner && !body.position) body.position = owner.managerOwner;
  if (owner && !body.write_lease?.length) {
    body.write_lease = [
      ...(body.outputs ?? []),
      businessIdeaFile(repoRoot, `HANDOFFS/${body.phase}-manager-${body.position}.md`),
    ];
  }
  const tracker = parseTracker(readFileSync(trackerPath(repoRoot), "utf8"));
  if (!body.idea) body.idea = tracker.idea;
  if (!body.phase_name) {
    body.phase_name = tracker.phases.find((p) => p.phase === body.phase)?.name;
  }
  body.must_read = appendVentureContextReads(repoRoot, body.must_read);
  const result = validateManagerPacket(body, org, models, options);
  if (!result.ok) return { ok: false, errors: result.errors };

  const packetPath = enqueueDispatch(dispatchRoot(repoRoot), result.packet);
  let trackerMd = readFileSync(trackerPath(repoRoot), "utf8");
  trackerMd = patchTrackerPhaseStatus(trackerMd, body.phase, "🔄");
  trackerMd = seedPositionsRow(trackerMd, {
    phase: body.phase,
    manager: result.packet.position,
    icsSpawned: "",
    handoffDir: "HANDOFFS/",
    csuiteVerdict: "",
    reviewer: owner?.csuiteReviewer ?? "ceo-strategist",
    managerLlmTier: result.packet.llm_tier,
  });
  writeFileSync(
    assertWritable(repoRoot, businessIdeaFile(repoRoot, "RUNBOOK-TRACKER.md")),
    trackerMd,
  );

  return {
    ok: true,
    packet: result.packet,
    path: relative(repoRoot, packetPath).split("\\").join("/"),
  };
}
