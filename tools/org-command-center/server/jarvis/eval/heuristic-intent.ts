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

  if (
    /\b(tell them to|also (do|cover|add|include|write|fix)|instruct them|pass along|let them know to)\b/.test(
      s,
    )
  ) {
    return "run.instruct";
  }

  if (
    /\b(is it done|are they done|finished yet|done yet|status of the run|run status)\b/.test(s) ||
    (/\b(ceo|cfo|cmo|cto|manager|run)\b/.test(s) && /\b(done|finished|complete)\b/.test(s))
  ) {
    return "runs.watch";
  }

  if (/\bspawn\b/.test(s) && /\b(ic|copywriter|copy-chief|analyst)\b/.test(s)) {
    return "agent.spawn_ic";
  }

  if (
    /\b(write|writing|creat(?:e|ing)|draft|produce|producing)\b/.test(s) &&
    /\b(blog|article|copy|newsletter|landing\s*page|press\s*release)\b/.test(s)
  ) {
    return "work.resolve";
  }
  if (
    /\b(work request|queue and (spawn|run|start)|start cursor|kick off (the )?work)\b/.test(s)
  ) {
    return "work.request";
  }
  if (/\b(review inbox|needs review|inbox)\b/.test(s)) {
    return "review.inbox_list";
  }

  if (
    /\b(run next|run the next|next dispatch|execute\s+(the\s+)?queue|spawn run|spawn the|launch next)\b/.test(
      s,
    )
  ) {
    return "spawn.run_next";
  }
  if (/\b(run ready|spawn ready|start queued managers?|start the queued)\b/.test(s)) {
    return "spawn.run_ready";
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
    (/\bspin up\b/.test(s) || /\bkick off\b/.test(s)) &&
    /\band\b/.test(s) &&
    (/\b(research|finance|cfo|head.of.research|head-of-research|burn|market)\b/.test(s) ||
      /\bresearch and finance\b/.test(s) ||
      /\bresearch and cfo\b/.test(s))
  ) {
    return "dispatch.queue_batch";
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
    (/\b(ceo|strategist|cfo|cmo|cto|coo)\b/.test(s) &&
      /\b(look|review|reviewed|check|checked|seen|status|report|update)\b/.test(s)) ||
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

  if (/\b(digest this session|session digest|wrap up session|end of session)\b/.test(s)) {
    return "memory.digest";
  }

  if (/\b(digest|company brief|daily brief|morning brief)\b/.test(s)) {
    return "digest.get";
  }

  if (
    /\b(save that answer|save this answer|draft that answer|next question)\b/.test(s)
  ) {
    return "seat.answer_draft";
  }

  if (
    /\b(answer questions?( for)?|answer that seat|continue that seat|the answer is|tell them the answer)\b/.test(
      s,
    ) ||
    (/\b(answer|answers)\b/.test(s) &&
      /\b(seat|research|questions?|geography|budget)\b/.test(s) &&
      !/\b(write|blog|spawn|spin up|queue)\b/.test(s))
  ) {
    return "seat.answer";
  }

  if (
    /\b(resolve that blocker|resolve the blocker|resolve blockers?|unblock)\b/.test(s) ||
    (/\bunblock\b/.test(s) &&
      /\b(research|legal|product|marketing|finance|ceo|cfo|cmo|copy|brand)\b/.test(s))
  ) {
    return "blocker.resolve";
  }

  if (/\b(blockers?|what'?s blocked|what is blocked|list blockers?|show blockers?)\b/.test(s)) {
    return "blocker.list";
  }

  if (
    /\b(think hard|ask grok|deep think|reason about|trade-?offs?|prioritize)\b/.test(s) ||
    (/\b(strategy|strategic)\b/.test(s) && /\b(advice|think|recommend)\b/.test(s))
  ) {
    return "brain.ask";
  }

  if (/\b(help|cheatsheet|what can you do|capabilities)\b/.test(s)) {
    return "session.help";
  }

  if (
    /\b(remember that|remember:|note that|don't forget|dont forget)\b/.test(s) ||
    (/\bremember\b/.test(s) && !/\b(digest|session|where|next)\b/.test(s))
  ) {
    return "memory.note";
  }

  if (/\b(reindex memory|rebuild memory|reindex chroma|rebuild chroma)\b/.test(s)) {
    return "memory.reindex";
  }

  if (/\b(recall memory|search memory|what did we decide|memory search)\b/.test(s)) {
    return "memory.recall";
  }

  if (/\b(where are we|what'?s next|what is next)\b/.test(s)) {
    return "memory.brief";
  }

  if (/\b(mission|status|awg|atmospheric|phase progress)\b/.test(s)) {
    return "mission.get";
  }

  return "mission.get";
}
