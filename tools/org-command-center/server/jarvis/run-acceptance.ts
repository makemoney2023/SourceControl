import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  isEmailHtmlPath,
  isImageAssetPath,
  lintEmailHtmlFile,
} from "../../src/lib/email-html-lint";
import { indexHandoffs } from "../../src/lib/parse-handoff";
import {
  DESIGN_LED_PRODUCTION_PHASES,
  SHIPPABLE_PRODUCTION_PHASES,
} from "../../src/lib/seat-outputs";
import type { HandoffRecord, ManagerPacket } from "../../src/lib/types";
import { handoffsDir, reviewInboxDir } from "../paths";
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

function hasMatchingInbox(
  repoRoot: string,
  runId: string,
  packet: ManagerPacket,
): boolean {
  const items = inboxItemsWithRunId(repoRoot);
  const byRunId = items.some((item) => item.runId === runId);
  if (byRunId) return true;
  return items.some(
    (item) =>
      item.position === packet.position &&
      (item.goal === packet.goal ||
        item.goal?.replace(/^["']|["']$/g, "") === packet.goal),
  );
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

function verifierMissing(
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
  }

  if (requireIcHandoff) {
    const ic = args.packet.preferred_ic;
    if (!ic || !hasIcHandoff(repoRoot, ic)) {
      missing.push("ic_handoff");
    }
  }

  const handoffs =
    requireProduction || requireVerifier ? loadHandoffs(repoRoot) : [];

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
    const ver = verifierMissing(handoffs, args.packet);
    if (ver) missing.push(ver);
  }

  return {
    ok: missing.length === 0,
    missing,
    checkedAt: new Date().toISOString(),
  };
}
