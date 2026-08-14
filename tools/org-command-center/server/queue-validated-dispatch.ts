import { readFileSync, writeFileSync } from "node:fs";
import { relative } from "node:path";
import { enqueueDispatch } from "../src/lib/dispatch-queue";
import { parseModelRegistry, parseOrgRegistry, resolvePhaseOwner } from "../src/lib/parse-registry";
import { patchTrackerPhaseStatus, parseTracker, seedPositionsRow } from "../src/lib/parse-tracker";
import { validateManagerPacket } from "../src/lib/validate-packet";
import type { ManagerPacket, ManagerPacketInput } from "../src/lib/types";
import { buildPhaseIcLeases } from "../src/lib/phase-ic-leases";
import {
  loadSeatOutputPaths,
  mergeUniquePaths,
} from "../src/lib/seat-outputs";
import {
  assertReadable,
  assertWritable,
  businessIdeaFile,
  businessIdeaRel,
  dispatchRoot,
  trackerPath,
  activeArtifactSlug,
} from "./paths";
import { appendVentureContextReads } from "./sources/context-reads";
import { assertClassificationAndDesignGates } from "./jarvis/dispatch-gates";

function mergeUniqueStrings(
  ...lists: (string[] | undefined)[]
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const list of lists) {
    for (const raw of list ?? []) {
      const s = raw.trim();
      if (!s || seen.has(s)) continue;
      seen.add(s);
      out.push(s);
    }
  }
  return out;
}

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
  if (body.position) {
    const ventureCtx = {
      ventureSlug: activeArtifactSlug(repoRoot),
      businessIdeaRel: businessIdeaRel(repoRoot),
    };
    const seatOutputs = loadSeatOutputPaths(repoRoot, body.position, ventureCtx);
    body.outputs = mergeUniquePaths(body.outputs, seatOutputs);
    const handoff = businessIdeaFile(
      repoRoot,
      `HANDOFFS/${body.phase}-manager-${body.position}.md`,
    );
    body.write_lease = mergeUniquePaths(body.write_lease, body.outputs, [
      handoff,
    ]);
    // Phase 17+ dual-lease: hard-fail when maySpawn IC output paths collide.
    // Earlier phases (e.g. Phase 6 PMM ∩ PR on 06-gtm-plan) partition by
    // section in craft — manager assigns non-colliding write_lease subsets.
    if (owner?.maySpawn?.length) {
      const icLeases = buildPhaseIcLeases(repoRoot, org, body.phase, ventureCtx);
      const phaseNum = Number(body.phase);
      const strictDualLease =
        Number.isFinite(phaseNum) && phaseNum >= 17;
      if (!icLeases.ok) {
        if (strictDualLease) {
          return {
            ok: false,
            errors: [
              `${icLeases.error}: ${icLeases.collisions.join("; ")}`,
            ],
          };
        }
      } else if (body.preferred_ic) {
        const preferred = icLeases.leases.find(
          (l) => l.position === body.preferred_ic,
        );
        if (preferred?.write_lease.length) {
          body.write_lease = mergeUniquePaths(
            body.write_lease,
            preferred.write_lease,
          );
        }
      }
    }
  } else if (owner && !body.write_lease?.length) {
    body.write_lease = [
      ...(body.outputs ?? []),
      businessIdeaFile(repoRoot, `HANDOFFS/${body.phase}-manager-${body.position}.md`),
    ];
  }
  const tracker = parseTracker(readFileSync(trackerPath(repoRoot), "utf8"));
  assertClassificationAndDesignGates(repoRoot, {
    phase: body.phase,
    preferred_ic: body.preferred_ic,
    classification: tracker.classification,
  });
  if (!body.idea) body.idea = tracker.idea;
  if (!body.phase_name) {
    body.phase_name = tracker.phases.find((p) => p.phase === body.phase)?.name;
  }
  body.must_read = appendVentureContextReads(repoRoot, body.must_read);
  const result = validateManagerPacket(body, org, models, options);
  if (!result.ok) return { ok: false, errors: result.errors };
  const discipline = [
    "Read MEMORY/decisions.md. Do not restate locked decisions in the operator brief.",
    "Do not re-ask locked ids. At most one new Open question, and only if it is not already on the register.",
    "Operator brief is a delta: what this seat uniquely produced.",
    "Packs used must be rows from your position SKILL.md Skill packs table.",
  ];
  result.packet.constraints = mergeUniqueStrings(
    result.packet.constraints,
    discipline,
  );

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
