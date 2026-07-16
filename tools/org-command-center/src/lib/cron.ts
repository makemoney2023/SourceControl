/** Minimal 5-field cron: minute hour dom month dow (UTC). */

export function cronMatches(expr: string, date: Date): boolean {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return false;
  const [min, hour, dom, month, dow] = parts;
  return (
    fieldMatches(min, date.getUTCMinutes(), 0) &&
    fieldMatches(hour, date.getUTCHours(), 0) &&
    fieldMatches(dom, date.getUTCDate(), 1) &&
    fieldMatches(month, date.getUTCMonth() + 1, 1) &&
    fieldMatches(dow, date.getUTCDay(), 0)
  );
}

function fieldMatches(field: string, value: number, min: number): boolean {
  if (field === "*") return true;
  for (const part of field.split(",")) {
    if (part.includes("/")) {
      const [base, stepStr] = part.split("/");
      const step = Number(stepStr);
      if (!Number.isFinite(step) || step <= 0) continue;
      const start = base === "*" ? min : Number(base);
      if (!Number.isFinite(start)) continue;
      if (value >= start && (value - start) % step === 0) return true;
      continue;
    }
    if (part.includes("-")) {
      const [a, b] = part.split("-").map(Number);
      if (value >= a && value <= b) return true;
      continue;
    }
    if (Number(part) === value) return true;
  }
  return false;
}

/** Next fire at or after `from` (minute resolution, UTC), scanning up to 366 days. */
export function nextCronFire(expr: string, from: Date): Date | null {
  const start = new Date(from);
  start.setUTCSeconds(0, 0);
  // if currently matching, return next minute onward for "next"
  const cursor = new Date(start.getTime());
  for (let i = 0; i < 366 * 24 * 60; i++) {
    if (cronMatches(expr, cursor) && cursor.getTime() >= start.getTime()) {
      // if exactly on from and from had seconds, still OK
      if (cursor.getTime() === start.getTime() && from.getUTCSeconds() > 0) {
        cursor.setUTCMinutes(cursor.getUTCMinutes() + 1);
        continue;
      }
      return new Date(cursor);
    }
    cursor.setUTCMinutes(cursor.getUTCMinutes() + 1);
  }
  return null;
}

/** True if due now and not already fired in this UTC minute. */
export function isCronDue(expr: string, now: Date, lastRunAt: string | null | undefined): boolean {
  if (!cronMatches(expr, now)) return false;
  if (!lastRunAt) return true;
  const last = new Date(lastRunAt);
  if (Number.isNaN(last.getTime())) return true;
  return (
    last.getUTCFullYear() !== now.getUTCFullYear() ||
    last.getUTCMonth() !== now.getUTCMonth() ||
    last.getUTCDate() !== now.getUTCDate() ||
    last.getUTCHours() !== now.getUTCHours() ||
    last.getUTCMinutes() !== now.getUTCMinutes()
  );
}
