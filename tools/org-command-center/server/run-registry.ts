const controllers = new Map<string, AbortController>();

export function registerRun(runId: string, controller: AbortController) {
  controllers.set(runId, controller);
}

export function unregisterRun(runId: string) {
  controllers.delete(runId);
}

export function cancelRun(runId: string): boolean {
  const c = controllers.get(runId);
  if (!c) return false;
  c.abort();
  return true;
}

export function getAbortSignal(runId: string): AbortSignal | undefined {
  return controllers.get(runId)?.signal;
}

/** test helper */
export function clearRunRegistry() {
  controllers.clear();
}
