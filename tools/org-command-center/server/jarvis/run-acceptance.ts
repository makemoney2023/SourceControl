import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  parseArtifactQuality,
  qualityFailures,
} from "../../src/lib/artifact-quality";
import {
  parsePackProcedures,
  procedureFailures,
} from "../../src/lib/pack-procedures";
import {
  findLockedReasks,
  findReferenceBlocks,
  parseDecisionRegister,
} from "../../src/lib/decision-register";
import {
  isEmailHtmlPath,
  isImageAssetPath,
  lintEmailHtmlFile,
} from "../../src/lib/email-html-lint";
import { assessHandoffModelQuality } from "../../src/jarvis/model-quality";
import { findBriefEcho, packsNotAllowed } from "../../src/lib/handoff-discipline";
import { indexHandoffs } from "../../src/lib/parse-handoff";
import { parsePositionPacks } from "../../src/lib/parse-position-packs";
import { parseModelRegistry } from "../../src/lib/parse-registry";
import {
  DESIGN_LED_PRODUCTION_PHASES,
  SHIPPABLE_PRODUCTION_PHASES,
} from "../../src/lib/seat-outputs";
import type { HandoffRecord, ManagerPacket } from "../../src/lib/types";
import { businessIdeaFile, handoffsDir, memoryRel, reviewInboxDir } from "../paths";
import { listReviewInbox } from "./review-inbox";

export type RunAcceptance = {
  ok: boolean;
  missing: string[];
  checkedAt: string;
};

function parseFrontmatter(raw: string): Record<string, string> {
  if (!raw.startsWith("---")) return {};
  const end = raw.indexOf("\n---", 3);
  if (end < 0) return {};
  const block = raw.slice(3, end).trim();
  const out: Record<string, string> = {};
  for (const line of block.split("\n")) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    out[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
  return out;
}

const ARTIFACT_INBOX_PHASES = new Set(["3", "5", "6", "9", "11"]);

function inboxItemsWithRunId(repoRoot: string) {
  const dir = reviewInboxDir(repoRoot);
  if (!existsSync(dir)) return [];
  const listed = listReviewInbox(repoRoot);
  return listed.map((item) => {
    const raw = readFileSync(join(dir, item.filename), "utf8");
    const fm = parseFrontmatter(raw);
    return { ...item, runId: fm.runId };
  });
}

function matchingInboxItems(
  repoRoot: string,
  runId: string,
  packet: ManagerPacket,
) {
  const items = inboxItemsWithRunId(repoRoot);
  const byRunId = items.filter((item) => item.runId === runId);
  if (byRunId.length) return byRunId;
  return items.filter(
    (item) =>
      item.position === packet.position &&
      (item.goal === packet.goal ||
        item.goal?.replace(/^["']|["']$/g, "") === packet.goal),
  );
}

function hasMatchingInbox(
  repoRoot: string,
  runId: string,
  packet: ManagerPacket,
): boolean {
  return matchingInboxItems(repoRoot, runId, packet).length > 0;
}

function artifactPathExists(repoRoot: string, artifactPath: string): boolean {
  const cleaned = artifactPath.replace(/^\/+/, "");
  if (existsSync(join(repoRoot, cleaned))) return true;
  const layerB = businessIdeaFile(
    repoRoot,
    cleaned.replace(/^business-idea\//, ""),
  );
  return existsSync(join(repoRoot, layerB));
}

function isValidInboxArtifact(
  repoRoot: string,
  item: { filename: string; path: string; artifact_path?: string },
): boolean {
  const rel = (item.artifact_path ?? "").trim();
  if (!rel) return false;
  if (rel.endsWith("HANDOFFS/")) return false;
  const base = rel.split("/").pop() ?? rel;
  if (rel === item.filename || base === item.filename || rel === item.path) {
    return false;
  }
  return artifactPathExists(repoRoot, rel);
}

function inboxNotArtifact(
  repoRoot: string,
  runId: string,
  packet: ManagerPacket,
): boolean {
  if (!ARTIFACT_INBOX_PHASES.has(String(packet.phase))) return false;
  const items = matchingInboxItems(repoRoot, runId, packet);
  if (!items.length) return false;
  return !items.some((item) => isValidInboxArtifact(repoRoot, item));
}

function loadHandoffs(repoRoot: string): HandoffRecord[] {
  const hd = handoffsDir(repoRoot);
  if (!existsSync(hd)) return [];
  return indexHandoffs(
    readdirSync(hd)
      .filter((n) => n.endsWith(".md") && n !== "README.md")
      .map((name) => ({
        name,
        content: readFileSync(join(hd, name), "utf8"),
      })),
  );
}

function hasIcHandoff(repoRoot: string, preferredIc: string): boolean {
  return loadHandoffs(repoRoot).some(
    (h) =>
      h.position === preferredIc &&
      h.kind === "ic" &&
      h.status.trim().length > 0,
  );
}

function resolveRequireInbox(
  packet: ManagerPacket,
  requireInbox?: boolean,
): boolean {
  if (requireInbox !== undefined) return requireInbox;
  return packet.require_inbox === true;
}

function resolveRequireIcHandoff(
  packet: ManagerPacket,
  requireIcHandoff?: boolean,
): boolean {
  if (requireIcHandoff !== undefined) return requireIcHandoff;
  if (packet.require_ic_handoff !== undefined) return packet.require_ic_handoff;
  return !!packet.preferred_ic;
}

function resolveRequireProduction(
  packet: ManagerPacket,
  requireProduction?: boolean,
): boolean {
  if (requireProduction !== undefined) return requireProduction;
  if (packet.require_production !== undefined) return packet.require_production;
  if (packet.production_skip_committed) return false;
  return SHIPPABLE_PRODUCTION_PHASES.has(packet.phase);
}

function resolveRequireVerifier(
  packet: ManagerPacket,
  requireVerifier?: boolean,
): boolean {
  if (requireVerifier !== undefined) return requireVerifier;
  if (packet.require_verifier !== undefined) return packet.require_verifier;
  return SHIPPABLE_PRODUCTION_PHASES.has(packet.phase);
}

function resolveRequireDesignBrief(
  packet: ManagerPacket,
  requireDesignBrief?: boolean,
): boolean {
  if (requireDesignBrief !== undefined) return requireDesignBrief;
  if (packet.require_design_brief !== undefined) {
    return packet.require_design_brief;
  }
  return DESIGN_LED_PRODUCTION_PHASES.has(packet.phase);
}

function pickProductionHandoff(
  handoffs: HandoffRecord[],
  packet: ManagerPacket,
): HandoffRecord | undefined {
  const phaseMatches = handoffs.filter(
    (h) => String(h.phase) === String(packet.phase) && h.productionStatus,
  );
  return (
    phaseMatches.find(
      (h) => h.kind === "manager" && h.position === packet.position,
    ) ??
    phaseMatches.find((h) => h.position === packet.preferred_ic) ??
    phaseMatches.find((h) => h.kind === "manager") ??
    phaseMatches[0]
  );
}

function draftSkipOk(primary: HandoffRecord): boolean {
  const reason = primary.skipReason.toLowerCase();
  return (
    reason.includes("cursor-draft") ||
    reason.includes("plane-b-missing") ||
    reason.includes("lab-only")
  );
}

function commercialLocalOk(primary: HandoffRecord): boolean {
  const gen = primary.generationUsed.toLowerCase();
  if (!gen.startsWith("local/")) return true;
  const basis = primary.licenseBasis.toLowerCase();
  return (
    basis === "bfl-self-hosted-commercial" ||
    gen.startsWith("fal/") ||
    primary.generationUsed.toLowerCase().startsWith("fal/")
  );
}

function productionQualityMissing(
  repoRoot: string,
  packet: ManagerPacket,
  primary: HandoffRecord,
  requireDesignBrief: boolean,
): string | null {
  if (!primary.wireOwner) return "wire_owner";

  if (requireDesignBrief) {
    if (!primary.designBriefPath) return "design_brief_path";
    if (!existsSync(join(repoRoot, primary.designBriefPath))) {
      return `design_brief_path:${primary.designBriefPath}`;
    }
  }

  if (primary.wireOwner.toLowerCase() !== "none") {
    if (!primary.wireChecklistPath) return "wire_checklist_path";
    if (!existsSync(join(repoRoot, primary.wireChecklistPath))) {
      return `wire_checklist_path:${primary.wireChecklistPath}`;
    }
  }

  const imagePaths = primary.productionPaths.filter(isImageAssetPath);
  if (imagePaths.length) {
    const qa = primary.photorealQa.toLowerCase();
    if (qa === "pass") {
      if (!commercialLocalOk(primary)) return "license_basis";
    } else if (qa === "draft") {
      if (!draftSkipOk(primary)) return "photoreal_qa_draft_reason";
    } else {
      return "photoreal_qa";
    }
  }

  for (const rel of primary.productionPaths) {
    if (!isEmailHtmlPath(rel)) continue;
    const abs = join(repoRoot, rel);
    if (!existsSync(abs)) continue;
    const lint = lintEmailHtmlFile(abs);
    if (!lint.ok) return `email_html_lint:${rel}:${lint.errors[0]}`;
  }

  return null;
}

function productionMissing(
  repoRoot: string,
  packet: ManagerPacket,
  handoffs: HandoffRecord[],
  requireDesignBrief: boolean,
): string | null {
  const primary = pickProductionHandoff(handoffs, packet);
  if (!primary) return "production_status";

  const status = primary.productionStatus.toLowerCase();
  if (status === "skipped") {
    if (!primary.skipReason) return "production_skip_reason";
    return null;
  }
  if (status === "blocked") {
    if (!primary.skipReason && primary.blockers.length === 0) {
      return "production_blocked_reason";
    }
    return null;
  }
  if (status === "complete") {
    if (!primary.productionPaths.length) return "production_paths";
    for (const rel of primary.productionPaths) {
      const abs = join(repoRoot, rel);
      if (!existsSync(abs)) return `production_path:${rel}`;
    }
    return productionQualityMissing(
      repoRoot,
      packet,
      primary,
      requireDesignBrief,
    );
  }
  return "production_status_invalid";
}

function csuiteNewRiskMissing(body: string): boolean {
  const m = body.match(/## New risk or disagreement\s*\n([\s\S]*?)(?=\n## |\s*$)/i);
  if (!m) return true;
  const text = m[1].replace(/^[-*]\s*/, "").trim().toLowerCase();
  return !text || text === "none" || text === "n/a" || text === "…";
}

function qualitySkipStatus(value: string): boolean {
  const status = value.trim().toLowerCase();
  return status === "blocked" || status === "needs_input";
}

function shouldSkipQuality(primary: HandoffRecord | undefined): boolean {
  if (!primary) return false;
  return (
    qualitySkipStatus(primary.status) || qualitySkipStatus(primary.productionStatus)
  );
}

function readQualityArtifact(repoRoot: string, artifactRel: string): string | null {
  const cleaned = artifactRel.replace(/^business-idea\//, "").replace(/^\/+/, "");
  const rel = businessIdeaFile(repoRoot, cleaned);
  const abs = join(repoRoot, rel);
  if (!existsSync(abs)) return null;
  return readFileSync(abs, "utf8");
}

function qualityMissing(
  repoRoot: string,
  packet: ManagerPacket,
  primary: HandoffRecord | undefined,
): string[] {
  if (shouldSkipQuality(primary)) return [];
  const scorecardPath = join(repoRoot, "skills/org/ARTIFACT-QUALITY.md");
  if (!existsSync(scorecardPath)) return [];
  const checks = parseArtifactQuality(readFileSync(scorecardPath, "utf8"));
  const phase = String(packet.phase);
  if (!checks.some((c) => String(c.phase) === phase)) return [];
  return qualityFailures(checks, phase, (rel) => readQualityArtifact(repoRoot, rel));
}

function readPrimaryArtifactBodies(
  repoRoot: string,
  primary: HandoffRecord,
): string[] {
  const bodies: string[] = [];
  for (const art of primary.artifacts) {
    const cleaned = art.path.replace(/^\/+/, "");
    const abs = join(repoRoot, cleaned);
    if (!existsSync(abs)) continue;
    bodies.push(readFileSync(abs, "utf8"));
  }
  return bodies;
}

function readPhaseQualityBodies(
  repoRoot: string,
  packet: ManagerPacket,
): string[] {
  const scorecardPath = join(repoRoot, "skills/org/ARTIFACT-QUALITY.md");
  if (!existsSync(scorecardPath)) return [];
  const checks = parseArtifactQuality(readFileSync(scorecardPath, "utf8"));
  const phase = String(packet.phase);
  const bodies: string[] = [];
  for (const check of checks) {
    if (String(check.phase) !== phase) continue;
    const body = readQualityArtifact(repoRoot, check.artifactRel);
    if (body !== null) bodies.push(body);
  }
  return bodies;
}

function procedureMissing(
  repoRoot: string,
  packet: ManagerPacket,
  primary: HandoffRecord | undefined,
): string[] {
  const mapPath = join(repoRoot, "skills/org/PACK-PROCEDURES.md");
  if (!existsSync(mapPath) || !primary) return [];
  const procedures = parsePackProcedures(readFileSync(mapPath, "utf8"));
  const artifactBodies = [
    ...readPrimaryArtifactBodies(repoRoot, primary),
    ...readPhaseQualityBodies(repoRoot, packet),
  ];
  return procedureFailures(primary.packsUsed, procedures, artifactBodies);
}

function verifierMissing(
  repoRoot: string,
  handoffs: HandoffRecord[],
  packet: ManagerPacket,
): string | null {
  const verifier = handoffs.find(
    (h) =>
      String(h.phase) === String(packet.phase) &&
      (h.position === "verifier" ||
        /-verifier\.md$/i.test(h.filename) ||
        h.filename.toLowerCase().includes("-verifier")),
  );
  if (!verifier) return "verifier_handoff";
  if (verifier.verdict.toLowerCase() !== "pass") return "verifier_pass";
  const spec = String(verifier.happyPathSpec ?? "").trim();
  const status = String(verifier.happyPathStatus ?? "").trim().toLowerCase();
  if (!spec) return "happy_path_spec";
  if (!existsSync(join(repoRoot, spec))) return `happy_path_spec:${spec}`;
  if (status !== "pass") return "happy_path_status";
  return null;
}

export function evaluateRunAcceptance(
  repoRoot: string,
  args: {
    runId: string;
    packet: ManagerPacket;
    requireInbox?: boolean;
    requireIcHandoff?: boolean;
    requireProduction?: boolean;
    requireVerifier?: boolean;
    requireDesignBrief?: boolean;
  },
): RunAcceptance {
  const missing: string[] = [];
  const requireInbox = resolveRequireInbox(args.packet, args.requireInbox);
  const requireIcHandoff = resolveRequireIcHandoff(
    args.packet,
    args.requireIcHandoff,
  );
  const requireProduction = resolveRequireProduction(
    args.packet,
    args.requireProduction,
  );
  const requireVerifier = resolveRequireVerifier(
    args.packet,
    args.requireVerifier,
  );
  const requireDesignBrief = resolveRequireDesignBrief(
    args.packet,
    args.requireDesignBrief,
  );

  if (requireInbox && !hasMatchingInbox(repoRoot, args.runId, args.packet)) {
    missing.push("inbox");
  } else if (
    requireInbox &&
    inboxNotArtifact(repoRoot, args.runId, args.packet)
  ) {
    missing.push("inbox_not_artifact");
  }

  if (requireIcHandoff) {
    const ic = args.packet.preferred_ic;
    if (!ic || !hasIcHandoff(repoRoot, ic)) {
      missing.push("ic_handoff");
    }
  }

  const handoffs = loadHandoffs(repoRoot);

  if (requireProduction) {
    const prod = productionMissing(
      repoRoot,
      args.packet,
      handoffs,
      requireDesignBrief,
    );
    if (prod) missing.push(prod);
  }

  if (requireVerifier) {
    const ver = verifierMissing(repoRoot, handoffs, args.packet);
    if (ver) missing.push(ver);
  }

  const csuite = handoffs.find(
    (h) =>
      String(h.phase) === String(args.packet.phase) &&
      (h.kind === "csuite" || /-csuite-review\.md$/i.test(h.filename)),
  );
  if (csuite && csuiteNewRiskMissing(csuite.body)) {
    missing.push("csuite_no_new_risk");
  }

  const phaseHandoffs = handoffs.filter(
    (h) => String(h.phase) === String(args.packet.phase),
  );
  const primary =
    phaseHandoffs.find((h) => h.position === args.packet.position) ??
    phaseHandoffs.find((h) => h.kind === "manager");

  if (primary) {
    const registryPath = join(repoRoot, "skills/org/MODEL-REGISTRY.md");
    if (existsSync(registryPath)) {
      const models = parseModelRegistry(readFileSync(registryPath, "utf8"));
      const expected = models[primary.position];
      const quality = assessHandoffModelQuality(
        primary,
        expected
          ? {
              llmTier: expected.llmTier,
              generationProfile: expected.generationProfile,
            }
          : undefined,
        String(args.packet.phase),
      );
      if (!quality.ok) missing.push("model_tier");
    }

    const decisionsRel = `${memoryRel(repoRoot)}/decisions.md`;
    if (existsSync(join(repoRoot, decisionsRel))) {
      const register = parseDecisionRegister(
        readFileSync(join(repoRoot, decisionsRel), "utf8"),
      );
      const haystack = `${primary.operatorBrief}\n${primary.nextSteps}\n${primary.asks.join("\n")}`;
      for (const id of findLockedReasks(register, haystack)) {
        missing.push(`reask:${id}`);
      }
      for (const id of findReferenceBlocks(register, primary.position, primary.status)) {
        missing.push(`reference_blocked:${id}`);
      }
    }

    const echo = findBriefEcho(
      primary.operatorBrief,
      phaseHandoffs
        .filter((h) => h.filename !== primary.filename && h.operatorBrief)
        .map((h) => ({ filename: h.filename, brief: h.operatorBrief })),
    );
    if (echo) missing.push(`brief_echo:${echo}`);

    const skillPath = join(
      repoRoot,
      "skills/org/positions",
      primary.position,
      "SKILL.md",
    );
    if (existsSync(skillPath) && primary.kind !== "csuite") {
      if (!primary.packsUsed.length && primary.body.split("\n").length > 20) {
        missing.push("packs_used_missing");
      }
      const notAllowed = packsNotAllowed(
        primary.packsUsed,
        parsePositionPacks(readFileSync(skillPath, "utf8")),
      );
      for (const p of notAllowed) {
        const slug = p.replace(/\/SKILL\.md$/i, "").split("/").filter(Boolean).pop();
        missing.push(`pack_not_allowed:${slug}`);
      }
    }
  }

  missing.push(...qualityMissing(repoRoot, args.packet, primary));
  missing.push(...procedureMissing(repoRoot, args.packet, primary));

  return {
    ok: missing.length === 0,
    missing,
    checkedAt: new Date().toISOString(),
  };
}
