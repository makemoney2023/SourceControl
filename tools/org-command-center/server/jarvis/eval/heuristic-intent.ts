import type { JarvisIntent } from "../intents";

/** Strip leading confirm/affirmation phrases so "yes, run next" maps to the action intent. */
function stripConfirmPrefix(u: string): string {
  return (
    u
      .replace(
        /^(yes|yeah|yep|confirm|confirmed|ok|okay|go ahead|do it|please|sure)\s*,?\s*/i,
        "",
      )
      .trim() || u
  );
}

export function heuristicIntent(utterance: string): JarvisIntent {
  const u = utterance.toLowerCase().trim();
  const s = stripConfirmPrefix(u);

  if (/\barchitect\b/.test(u) && /\b(mode|switch|enter|go to)\b/.test(u)) {
    return "mode.set";
  }

  if (
    /\b(switch to|set mode|go to|enter|change to)\b.*\b(ops|briefing|review)\b/.test(u) ||
    /\b(ops|briefing|review)\s+mode\b/.test(u)
  ) {
    return "mode.set";
  }

  if (
    /\b(pause|hold|freeze)\b/.test(s) &&
    (/\b(seat|agent|head)\b/.test(s) ||
      /\b(research|legal|product|marketing|sales|people|ops)\b/.test(s))
  ) {
    return "agent.pause";
  }

  if (
    /\b(resume|unpause|unhold)\b/.test(s) &&
    (/\b(seat|agent|head)\b/.test(s) ||
      /\b(research|legal|product|marketing|sales|people|ops)\b/.test(s))
  ) {
    return "agent.resume";
  }

  if (
    /\b(cancel|abort|kill|stop)\b/.test(s) &&
    (/\b(run|execution|dispatch|job|spawn)\b/.test(s) || /\b(the|this|current)\b/.test(s))
  ) {
    return "run.cancel";
  }

  if (/\b(rewake|re-wake|wake up|unstall)\b/.test(s) || /\brewake\b/.test(s)) {
    return "run.rewake";
  }

  if (/\bspawn\b/.test(s) && /\b(ic|copywriter|copy-chief|analyst)\b/.test(s)) {
    return "agent.spawn_ic";
  }

  if (
    /\b(run next|run the next|next dispatch|execute\s+(the\s+)?queue|spawn run|spawn the|launch next)\b/.test(
      s,
    )
  ) {
    return "spawn.run_next";
  }
  if (/\bspawn\b/.test(s) && !/\b(cancel|rewake)\b/.test(s)) {
    return "spawn.run_next";
  }

  if (/\b(create|new)\b/.test(s) && /\b(venture|idea|project)\b/.test(s)) {
    return "venture.create";
  }
  if (/\b(switch|activate|open)\b/.test(s) && /\b(venture|idea|project)\b/.test(s)) {
    return "venture.switch";
  }
  if (/\b(list|show)\b/.test(s) && /\b(venture|idea|project)s?\b/.test(s)) {
    return "venture.list";
  }

  if (
    (/\b(queue|assign|give|task)\b/.test(s) &&
      /\b(head-of-|cfo|cmo|cto|ceo|creative-director|head of)\b/.test(s)) ||
    /\bqueue\b.+\bfor\b.*\b(head-of-|cfo|cmo|cto|ceo|creative-director)\b/.test(s)
  ) {
    return "dispatch.queue_for";
  }

  if (/\bpreview\b/.test(s) && /\b(dispatch|queue|packet)\b/.test(s)) {
    return "dispatch.preview";
  }

  if (/\b(queue|assign|dispatch)\b/.test(s)) {
    return "dispatch.queue";
  }

  if (/\b(ack|acknowledge|clear)\b/.test(s) && /\balert/.test(s)) {
    return "alerts.ack";
  }

  if (/\b(enable|turn on|activate|start)\b/.test(s) && /\broutine/.test(s)) {
    return "routine.enable";
  }

  if (/\b(draft|write|prepare)\b/.test(s) && /\b(c-?suite|executive|ceo memo|board update)/.test(s)) {
    return "csuite.draft";
  }

  if (/\b(read|open|show|load)\b/.test(s) && /\b(file|doc|document|path|readme|spec)\b/.test(s)) {
    return "file.read";
  }

  if (/\b(spend|spending|spent|budget|cost|burn)\b/.test(s)) {
    return "spend.get";
  }

  if (/\b(alert|alerts|notification|notifications)\b/.test(s)) {
    return "alerts.list";
  }

  if (/\b(who owns|who runs|owner of)\b/.test(s) && /\bphase\b/.test(s)) {
    return "seat.who_owns";
  }

  if (
    /\b(seat report|report on|status of|how is)\b/.test(s) ||
    (/\bhead of\b/.test(s) && !/\b(pause|resume|cancel)\b/.test(s))
  ) {
    return "seat.report";
  }

  if (/\b(activity|audit|pulse|recent events?)\b/.test(s)) {
    return "activity.list";
  }

  if (/\b(runs|executions|run history|recent runs)\b/.test(s)) {
    return "runs.list";
  }

  if (/\b(tasks|todos|open items|task list)\b/.test(s)) {
    return "tasks.list";
  }

  if (/\b(digest|company brief|daily brief|morning brief)\b/.test(s)) {
    return "digest.get";
  }

  if (/\b(help|cheatsheet|what can you do|capabilities)\b/.test(s)) {
    return "session.help";
  }

  if (/\b(where are we|mission|status|awg|atmospheric|phase progress|blocker)/.test(s)) {
    return "mission.get";
  }

  return "mission.get";
}
