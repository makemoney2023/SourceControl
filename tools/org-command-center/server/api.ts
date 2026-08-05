import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { watch } from "chokidar";
import { enqueueDispatch } from "../src/lib/dispatch-queue";
import { resolvePhaseOwner } from "../src/lib/parse-registry";
import type { ManagerPacketInput } from "../src/lib/types";
import { ackHandoffAlert } from "./alerts-fs";
import { renderStandupBriefing } from "../src/jarvis/briefings";
import {
  buildCompanyDigest,
  companyDigestBriefScript,
} from "../src/jarvis/company-digest";
import { CSUITE_SLUGS } from "../src/jarvis/csuite";
import { missionBriefScript } from "../src/jarvis/mission";
import { buildSeatReport, seatReportBriefScript } from "../src/jarvis/seat-report";
import { enrichSeatReportWithGrokBrief } from "./jarvis/seat-brief-rewrite";
import { findLatestInboxDeliverableForSeat } from "./jarvis/review-inbox";
import { CHAT_TOOLS, runChatLlm } from "./chat";
import { registerFileRoutes } from "./file-routes";

import {
  activeProjectSlug,
  assertWritable,
  briefingsDir,
  businessIdeaFile,
  businessIdeaRel,
  dispatchRoot,
  handoffsDir,
  resolveRepoRoot,
} from "./paths";
import { appendActivity, readActivityTail } from "./activity";
import { listAgentStates, setSeatPaused } from "./agent-state";
import type { WakeReason } from "../src/lib/runs";
import { validateManagerPacket } from "../src/lib/validate-packet";
import { scoreVentureProduction } from "../src/lib/venture-production-scorecard";
import { parseRoutine, type RoutineDef } from "../src/lib/routines";
import { listRuns, readRun } from "./runs-fs";
import { cancelRun as abortRegisteredRun } from "./run-registry";
import {
  listRoutineDefs,
  routineSummaries,
  startRoutinePoller,
  writeRoutine,
} from "./routines";
import { loadSnapshot } from "./snapshot";
import { rewakeSession, spawnClaimedManager } from "./spawn";
import { loadSpend } from "./spend";
import { mintTalkToken, probeLivekitHealth } from "./livekit-token";
import { omnivoiceHealth, omnivoiceSpeak } from "./voice";
import { registerProjectRoutes } from "./project-routes";
import { registerSourcesRoutes } from "./sources-routes";
import { handleJarvisAct, handleJarvisConfirm } from "./jarvis/act";
import { buildJarvisContext } from "./jarvis/briefing";
import { buildEventsSincePayload } from "./jarvis/events-since";
import { listReviewInbox } from "./jarvis/review-inbox";
import { memoryDigest } from "./memory";
import { handleOccControlRpc } from "./mcp/occ-control";
import { queueValidatedDispatch } from "./queue-validated-dispatch";
import { writeCsuiteDraft } from "./write-csuite-draft";

export function createApi(repoRoot = resolveRepoRoot()) {
  const app = new Hono();
  let bump = 0;
  const stopPoller = startRoutinePoller(repoRoot, 30_000);
  // Watch all ventures so project switch does not require server restart.
  const watchRoots = [
    join(repoRoot, "docs/projects"),
    join(repoRoot, "projects/registry.json"),
  ];
  mkdirSync(handoffsDir(repoRoot), { recursive: true });
  mkdirSync(briefingsDir(repoRoot), { recursive: true });
  mkdirSync(join(dispatchRoot(repoRoot), "queue"), { recursive: true });
  mkdirSync(join(dispatchRoot(repoRoot), "claimed"), { recursive: true });
  mkdirSync(join(dispatchRoot(repoRoot), "runs"), { recursive: true });

  const watcher = watch(watchRoots, { ignoreInitial: true, awaitWriteFinish: { stabilityThreshold: 200 } });
  watcher.on("all", () => {
    bump += 1;
  });

  registerProjectRoutes(app, repoRoot);
  registerSourcesRoutes(app, repoRoot);
  registerFileRoutes(app, repoRoot);

  app.get("/api/health", (c) =>
    c.json({
      ok: true,
      repoRoot,
      bump,
      activeProject: activeProjectSlug(repoRoot),
      businessIdeaRel: businessIdeaRel(repoRoot),
    }),
  );

  app.get("/api/livekit/health", async (c) => {
    const h = await probeLivekitHealth();
    return c.json({
      ...h,
      backend: process.env.OCC_VOICE_BACKEND || "livekit",
    });
  });

  app.post("/api/livekit/token", async (c) => {
    if ((process.env.OCC_VOICE_BACKEND || "livekit") === "legacy") {
      return c.json({ ok: false, error: "OCC_VOICE_BACKEND=legacy" }, 503);
    }
    const body = await c.req
      .json<{ roomName?: string; identity?: string }>()
      .catch(() => ({} as { roomName?: string; identity?: string }));
    try {
      const token = await mintTalkToken(body);
      return c.json({ ok: true, ...token });
    } catch (e) {
      return c.json(
        { ok: false, error: e instanceof Error ? e.message : String(e) },
        500,
      );
    }
  });

  app.get("/api/snapshot", (c) => c.json({ ...loadSnapshot(repoRoot), bump }));

  app.get("/api/seat-report/:slug", async (c) => {
    const slug = c.req.param("slug");
    const snap = loadSnapshot(repoRoot);
    const deliverable = findLatestInboxDeliverableForSeat(repoRoot, slug);
    const report = buildSeatReport({
      slug,
      org: snap.org,
      tracker: snap.tracker,
      handoffs: snap.handoffs,
      queueFiles: snap.queue,
      claimedFiles: snap.claimed,
      runs: snap.runs,
      sessions: snap.sessions,
      briefings: snap.briefings,
      repoRoot,
      spendBySeat: snap.spend.bySeat,
      models: snap.models,
      exists: existsSync,
      deliverableMarkdown: deliverable?.markdown,
    });
    if (!report) return c.json({ ok: false, error: "unknown seat" }, 404);
    const latest = snap.handoffs.filter((h) => h.position === report.slug).at(-1);
    const enriched = await enrichSeatReportWithGrokBrief(report, {
      cwd: repoRoot,
      handoffBody: latest?.body,
      deliverableMarkdown: deliverable?.markdown,
      asks: latest?.asks,
      blockers: latest?.blockers,
    });
    return c.json({ ok: true, report: enriched });
  });

  app.get("/api/company-digest", (c) => {
    const snap = loadSnapshot(repoRoot);
    const digest = buildCompanyDigest({
      org: snap.org,
      tracker: snap.tracker,
      handoffs: snap.handoffs,
      queueFiles: snap.queue,
      claimedFiles: snap.claimed,
      runs: snap.runs,
      sessions: snap.sessions,
      briefings: snap.briefings,
      alerts: snap.alerts,
      spendBySeat: snap.spend.bySeat,
      repoRoot,
      models: snap.models,
    });
    return c.json({ ok: true, digest });
  });

  app.get("/api/production-scorecard", (c) => {
    const venture = activeProjectSlug(repoRoot);
    const card = scoreVentureProduction(repoRoot, {
      venture,
      businessIdeaRel: businessIdeaRel(repoRoot),
    });
    return c.json({ ok: true, scorecard: card });
  });

  app.post("/api/alerts/:id/ack", async (c) => {
    const id = decodeURIComponent(c.req.param("id"));
    const alerts = ackHandoffAlert(dispatchRoot(repoRoot), id);
    bump += 1;
    return c.json({ ok: true, alerts });
  });

  app.post("/api/csuite-draft", async (c) => {
    const body = await c.req.json<{ phase: string; force?: boolean }>();
    const result = writeCsuiteDraft(repoRoot, body);
    if (!result.ok) {
      const status = result.error === "phase required" ? 400 : 409;
      return c.json(result, status);
    }
    bump += 1;
    return c.json(result);
  });

  app.get("/api/events", (c) => {
    let last = bump;
    return streamSSE(c, async (stream) => {
      await stream.writeSSE({ event: "hello", data: JSON.stringify({ bump }) });
      while (true) {
        if (bump !== last) {
          last = bump;
          await stream.writeSSE({
            event: "change",
            data: JSON.stringify({ bump }),
          });
        }
        await stream.sleep(400);
      }
    });
  });

  app.post("/api/assign", async (c) => {
    const body = (await c.req.json()) as ManagerPacketInput;
    const result = queueValidatedDispatch(repoRoot, body);
    if (!result.ok) return c.json({ ok: false, errors: result.errors }, 400);

    return c.json({
      ok: true,
      packet: result.packet,
      path: result.path,
      orchestratorPrompt:
        `Read ${businessIdeaFile(repoRoot, "DISPATCH/queue/")} (claim oldest), spawn the Manager owner only with the packet — do not invent packs. Use company-orchestrator skill.`,
    });
  });

  app.post("/api/briefing", async (c) => {
    const body = await c.req.json<{
      position: string;
      phase_focus?: string;
      status?: "on_track" | "at_risk" | "blocked";
      progress: string;
      asks?: string;
      blockers?: string;
      escalation_tags?: string[];
    }>();
    if (!CSUITE_SLUGS.includes(body.position as (typeof CSUITE_SLUGS)[number])) {
      return c.json({ ok: false, error: "position must be a C-suite/manager seat" }, 400);
    }
    const md = renderStandupBriefing({
      position: body.position,
      phase_focus: body.phase_focus ?? "",
      status: body.status ?? "on_track",
      escalation_tags: body.escalation_tags ?? [],
      progress: body.progress,
      asks: body.asks ?? "",
      blockers: body.blockers ?? "",
    });
    const rel = businessIdeaFile(repoRoot, `BRIEFINGS/${body.position}-standup.md`);
    mkdirSync(briefingsDir(repoRoot), { recursive: true });
    writeFileSync(assertWritable(repoRoot, rel), md);
    return c.json({ ok: true, path: rel });
  });

  app.get("/api/voice/health", async (c) => c.json(await omnivoiceHealth()));

  app.post("/api/voice/speak", async (c) => {
    const { text } = await c.req.json<{ text: string }>();
    if (!text?.trim()) return c.json({ error: "text required" }, 400);
    try {
      const buf = await omnivoiceSpeak(text.trim());
      return new Response(buf, {
        headers: { "Content-Type": "audio/wav" },
      });
    } catch (e) {
      return c.json(
        { error: e instanceof Error ? e.message : String(e), fallback: true },
        503,
      );
    }
  });

  app.post("/api/voice/brief", async (c) => {
    const body = await c.req
      .json<{ mode?: "mission" | "seat" | "digest"; slug?: string }>()
      .catch(() => ({} as { mode?: "mission" | "seat" | "digest"; slug?: string }));
    const mode = body.mode ?? "mission";
    const snap = loadSnapshot(repoRoot);
    if (mode === "digest") {
      const digest = buildCompanyDigest({
        org: snap.org,
        tracker: snap.tracker,
        handoffs: snap.handoffs,
        queueFiles: snap.queue,
        claimedFiles: snap.claimed,
        runs: snap.runs,
        sessions: snap.sessions,
        briefings: snap.briefings,
        alerts: snap.alerts,
        spendBySeat: snap.spend.bySeat,
        repoRoot,
        models: snap.models,
      });
      return c.json({ text: companyDigestBriefScript(digest) });
    }
    if (mode === "seat") {
      const slug = body.slug || "ceo-strategist";
      const deliverable = findLatestInboxDeliverableForSeat(repoRoot, slug);
      const report = buildSeatReport({
        slug,
        org: snap.org,
        tracker: snap.tracker,
        handoffs: snap.handoffs,
        queueFiles: snap.queue,
        claimedFiles: snap.claimed,
        runs: snap.runs,
        briefings: snap.briefings,
        sessions: snap.sessions,
        repoRoot,
        spendBySeat: snap.spend.bySeat,
        models: snap.models,
        exists: existsSync,
        deliverableMarkdown: deliverable?.markdown,
      });
      if (!report) return c.json({ error: "unknown seat" }, 404);
      return c.json({ text: seatReportBriefScript(report) });
    }
    return c.json({ text: missionBriefScript(snap.mission) });
  });

  app.post("/api/voice/chat", async (c) => {
    const body = await c.req.json<{
      message: string;
      history?: { role: "user" | "assistant"; content: string }[];
    }>();
    const snap = loadSnapshot(repoRoot);
    const system = [
      "You are the Situation Room operator for a virtual company of digital workers.",
      "Enforce manager-only dispatch. Never invent packs. Prefer tools for actions.",
      `Mission JSON: ${JSON.stringify(snap.mission)}`,
      `Top tasks: ${JSON.stringify(snap.tasks.slice(0, 12))}`,
    ].join("\n");

    const llm = await runChatLlm({
      system,
      messages: [...(body.history ?? []), { role: "user", content: body.message }],
      tools: CHAT_TOOLS as unknown as typeof CHAT_TOOLS,
    });

    const toolResults: { name: string; result: unknown }[] = [];
    const uiEvents: Record<string, unknown>[] = [];

    for (const call of llm.toolCalls) {
      if (call.name === "get_mission") {
        toolResults.push({ name: call.name, result: snap.mission });
      } else if (call.name === "get_tasks") {
        const status = call.input.status as string | undefined;
        toolResults.push({
          name: call.name,
          result: status
            ? snap.tasks.filter((t) => t.status === status)
            : snap.tasks.slice(0, 20),
        });
      } else if (call.name === "get_seat") {
        const slug = String(call.input.slug ?? "");
        toolResults.push({
          name: call.name,
          result: {
            card: snap.csuite.find((x) => x.slug === slug),
            handoffs: snap.handoffs.filter((h) => h.position === slug),
            reports: snap.org.roster.filter((r) => r.reportsTo === slug),
          },
        });
      } else if (call.name === "get_seat_report") {
        const slug = String(call.input.slug ?? "");
        const deliverable = findLatestInboxDeliverableForSeat(repoRoot, slug);
        toolResults.push({
          name: call.name,
          result: buildSeatReport({
            slug,
            org: snap.org,
            tracker: snap.tracker,
            handoffs: snap.handoffs,
            queueFiles: snap.queue,
            claimedFiles: snap.claimed,
            runs: snap.runs,
            briefings: snap.briefings,
            sessions: snap.sessions,
            repoRoot,
            spendBySeat: snap.spend.bySeat,
            models: snap.models,
            exists: existsSync,
            deliverableMarkdown: deliverable?.markdown,
          }),
        });
      } else if (call.name === "open_ui") {
        uiEvents.push(call.input);
        toolResults.push({ name: call.name, result: { ok: true } });
      } else if (call.name === "file_briefing") {
        const md = renderStandupBriefing({
          position: String(call.input.position),
          phase_focus: String(call.input.phase_focus ?? ""),
          status: (call.input.status as "on_track") ?? "on_track",
          escalation_tags: [],
          progress: String(call.input.progress ?? ""),
          asks: String(call.input.asks ?? ""),
          blockers: String(call.input.blockers ?? ""),
        });
        const pos = String(call.input.position);
        if (!CSUITE_SLUGS.includes(pos as (typeof CSUITE_SLUGS)[number])) {
          toolResults.push({ name: call.name, result: { ok: false, error: "invalid seat" } });
        } else {
          const rel = businessIdeaFile(repoRoot, `BRIEFINGS/${pos}-standup.md`);
          writeFileSync(assertWritable(repoRoot, rel), md);
          toolResults.push({ name: call.name, result: { ok: true, path: rel } });
        }
      } else if (call.name === "queue_dispatch") {
        const phase = String(call.input.phase);
        const goal = String(call.input.goal);
        const org = snap.org;
        const owner = resolvePhaseOwner(org, phase);
        const models = snap.models;
        const input: ManagerPacketInput = {
          phase,
          position: owner?.managerOwner ?? "",
          goal,
          llm_tier: owner ? models[owner.managerOwner]?.llmTier : undefined,
        };
        const result = validateManagerPacket(input, org, models);
        if (!result.ok) toolResults.push({ name: call.name, result: result });
        else {
          const path = enqueueDispatch(dispatchRoot(repoRoot), result.packet);
          toolResults.push({
            name: call.name,
            result: { ok: true, path: relative(repoRoot, path) },
          });
        }
      } else if (call.name === "spawn_manager") {
        const filename =
          typeof call.input.filename === "string" ? call.input.filename : undefined;
        toolResults.push({
          name: call.name,
          result: await spawnClaimedManager(repoRoot, {
            filename,
            wakeReason: "chat",
          }),
        });
      } else if (call.name === "cancel_run") {
        const runId = String(call.input.runId ?? "");
        const aborted = abortRegisteredRun(runId);
        toolResults.push({
          name: call.name,
          result: { ok: aborted, runId, error: aborted ? undefined : "run not active" },
        });
      } else if (call.name === "pause_seat") {
        const slug = String(call.input.slug ?? "");
        const paused = Boolean(call.input.paused);
        const state = setSeatPaused(dispatchRoot(repoRoot), slug, paused);
        appendActivity(dispatchRoot(repoRoot), {
          type: paused ? "seat_paused" : "seat_resumed",
          position: slug,
        });
        toolResults.push({ name: call.name, result: { ok: true, slug, ...state } });
      } else if (call.name === "rewake_session") {
        toolResults.push({
          name: call.name,
          result: await rewakeSession(repoRoot, {
            dispatchFilename:
              typeof call.input.dispatchFilename === "string"
                ? call.input.dispatchFilename
                : undefined,
            agentId: typeof call.input.agentId === "string" ? call.input.agentId : undefined,
            instruction:
              typeof call.input.instruction === "string" ? call.input.instruction : undefined,
            wakeReason: "rewake",
          }),
        });
      }
    }

    return c.json({
      text: llm.text,
      toolResults,
      uiEvents,
    });
  });

  app.post("/api/spawn", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as {
      filename?: string;
      wakeReason?: WakeReason;
    };
    const result = await spawnClaimedManager(repoRoot, {
      filename: body.filename,
      wakeReason: body.wakeReason ?? "on_demand",
    });
    return c.json(result, result.ok ? 200 : 400);
  });

  app.get("/api/runs", (c) => {
    const runs = listRuns(join(dispatchRoot(repoRoot), "runs"), 40);
    return c.json({ runs });
  });

  app.get("/api/runs/:runId", (c) => {
    const run = readRun(join(dispatchRoot(repoRoot), "runs"), c.req.param("runId"));
    if (!run) return c.json({ error: "not found" }, 404);
    return c.json({ run });
  });

  app.post("/api/runs/:runId/cancel", async (c) => {
    const runId = c.req.param("runId");
    const aborted = abortRegisteredRun(runId);
    if (!aborted) {
      return c.json({ ok: false, error: "run not active in this process" }, 404);
    }
    appendActivity(dispatchRoot(repoRoot), {
      type: "spawn_cancelled",
      runId,
      detail: "operator cancel",
    });
    return c.json({ ok: true, runId });
  });

  app.post("/api/agents/:slug/pause", async (c) => {
    const slug = c.req.param("slug");
    const state = setSeatPaused(dispatchRoot(repoRoot), slug, true);
    appendActivity(dispatchRoot(repoRoot), { type: "seat_paused", position: slug });
    return c.json({ ok: true, slug, ...state });
  });

  app.post("/api/agents/:slug/resume", async (c) => {
    const slug = c.req.param("slug");
    const state = setSeatPaused(dispatchRoot(repoRoot), slug, false);
    appendActivity(dispatchRoot(repoRoot), { type: "seat_resumed", position: slug });
    return c.json({ ok: true, slug, ...state });
  });

  app.get("/api/activity", (c) => {
    return c.json({ activity: readActivityTail(dispatchRoot(repoRoot), 40) });
  });

  app.get("/api/agent-states", (c) => {
    return c.json({ agentStates: listAgentStates(dispatchRoot(repoRoot)) });
  });

  app.post("/api/runs/rewake", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as {
      dispatchFilename?: string;
      agentId?: string;
      instruction?: string;
      wakeReason?: WakeReason;
    };
    const result = await rewakeSession(repoRoot, {
      dispatchFilename: body.dispatchFilename,
      agentId: body.agentId,
      instruction: body.instruction,
      wakeReason: body.wakeReason ?? "rewake",
    });
    return c.json(result, result.ok ? 200 : 400);
  });

  app.get("/api/routines", (c) => {
    return c.json({ routines: routineSummaries(dispatchRoot(repoRoot)) });
  });

  app.post("/api/routines", async (c) => {
    const body = (await c.req.json()) as RoutineDef;
    const def = parseRoutine(body);
    if (!def) return c.json({ ok: false, error: "invalid routine" }, 400);
    const path = writeRoutine(dispatchRoot(repoRoot), def);
    return c.json({ ok: true, path, routine: def });
  });

  app.post("/api/routines/:id/enable", async (c) => {
    const id = c.req.param("id");
    const body = (await c.req.json().catch(() => ({}))) as { enabled?: boolean };
    const existing = listRoutineDefs(dispatchRoot(repoRoot)).find((r) => r.id === id);
    if (!existing) return c.json({ ok: false, error: "not found" }, 404);
    existing.enabled = body.enabled !== false;
    writeRoutine(dispatchRoot(repoRoot), existing);
    return c.json({ ok: true, routine: existing });
  });

  app.get("/api/spend", (c) => {
    return c.json({ spend: loadSpend(dispatchRoot(repoRoot)) });
  });

  app.post("/api/jarvis/act", async (c) => {
    const body = await c.req.json();
    const roomId = String((body as { roomId?: string }).roomId || "default");
    const result = await handleJarvisAct(repoRoot, roomId, body);
    const intent = String((body as { intent?: string }).intent ?? "");
    if (
      result.status === "ok" &&
      (intent === "mission.get" || intent === "seat.report" || intent === "digest.get")
    ) {
      bump += 1;
    }
    return c.json(result);
  });

  app.get("/api/jarvis/context", async (c) => c.json(await buildJarvisContext(repoRoot)));

  app.get("/api/jarvis/events/since", (c) => {
    const cursor = c.req.query("cursor") || undefined;
    return c.json(buildEventsSincePayload(repoRoot, cursor));
  });

  app.post("/api/mcp/occ-control", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    return c.json(await handleOccControlRpc(repoRoot, body));
  });

  app.post("/api/jarvis/memory/digest", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as { summary?: string };
    const summary = typeof body.summary === "string" ? body.summary.trim() : undefined;
    const result = await memoryDigest(repoRoot, summary ? { summary } : undefined);
    return c.json(result);
  });

  app.get("/api/jarvis/review-inbox", (c) => {
    return c.json({ items: listReviewInbox(repoRoot) });
  });

  app.post("/api/jarvis/confirm", async (c) => {
    const body = await c.req.json<{ roomId?: string; token?: string; accept?: boolean }>();
    const roomId = String(body.roomId || "default");
    // Token optional — empty resolves latest pending (voice agents omit UUID).
    const token = typeof body.token === "string" ? body.token : "";
    const accept = body.accept === true;
    return c.json(await handleJarvisConfirm(repoRoot, roomId, token, accept));
  });

  // keep poller reference so GC doesn't drop it; stop unused in tests
  void stopPoller;

  return app;
}
