export interface ActivityLineInput {
  at: string;
  type: string;
  runId?: string;
  position?: string;
  detail?: string;
}

export function formatActivityLine(ev: ActivityLineInput): string {
  const time = ev.at ? ev.at.slice(11, 19) : "--:--:--";
  const pos = ev.position ? ` · ${ev.position}` : "";
  const run = ev.runId ? ` · ${ev.runId}` : "";
  const detail = ev.detail ? ` — ${ev.detail}` : "";
  return `${time} · ${ev.type}${pos}${run}${detail}`;
}
