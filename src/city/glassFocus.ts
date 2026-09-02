// Signature move: the plate in the glass you are on comes into focus. Driven off
// the engine's --sc-seg/--sc-segp and pointer/keyboard focus. Publishes
// data-sc-verify-state so the shoot harness can see the painted state
// (verify.md: bespoke fixed layers must report what they render).

export function glassVerifyState(
  seg: number,
  segp: number,
  focusedId: string | null,
): string {
  return `seg:${seg}|p:${segp.toFixed(2)}|focus:${focusedId ?? "none"}`;
}

export function streamsProgress(
  seg: number,
  segp: number,
  startLeg: number,
  endLeg: number,
): number {
  const span = endLeg - startLeg + 1;
  return Math.min(1, Math.max(0, (seg - startLeg + segp) / span));
}

export function wireGlassFocus(
  root: HTMLElement | null,
  streams: { startLeg: number; endLeg: number },
): () => void {
  if (!root) return () => {};
  const layer = root.querySelector<HTMLElement>("[data-city-glass-layer]");
  if (!layer) return () => {};

  let focusedId: string | null = null;
  let raf = 0;

  const figures = () =>
    layer.querySelectorAll<HTMLElement>("figure[data-glass]");

  const setFocus = (id: string | null) => {
    focusedId = id;
    if (id) layer.setAttribute("data-city-focus", id);
    else layer.removeAttribute("data-city-focus");
    figures().forEach((f) =>
      f.setAttribute("data-focused", String(f.dataset.glass === id)),
    );
  };

  const glassIdFrom = (target: EventTarget | null): string | null =>
    target instanceof Element
      ? (target.closest("figure[data-glass]") as HTMLElement | null)?.dataset
          .glass ?? null
      : null;

  const onFocusIn = (e: Event) => {
    const id = glassIdFrom(e.target);
    if (id) setFocus(id);
  };
  const onFocusOut = () => setFocus(null);
  const onPointerOver = (e: Event) => {
    const id = glassIdFrom(e.target);
    if (id !== focusedId) setFocus(id);
  };

  const paintState = () => {
    raf = 0;
    const cs = getComputedStyle(document.documentElement);
    const seg = Number(cs.getPropertyValue("--sc-seg")) || 0;
    const segp = Number(cs.getPropertyValue("--sc-segp")) || 0;
    layer.setAttribute("data-sc-verify-state", glassVerifyState(seg, segp, focusedId));
    layer.style.setProperty(
      "--city-streams-p",
      streamsProgress(seg, segp, streams.startLeg, streams.endLeg).toFixed(3),
    );
  };
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(paintState);
  };

  layer.addEventListener("focusin", onFocusIn);
  layer.addEventListener("focusout", onFocusOut);
  layer.addEventListener("pointerover", onPointerOver);
  window.addEventListener("scroll", onScroll, { passive: true });
  paintState();

  return () => {
    layer.removeEventListener("focusin", onFocusIn);
    layer.removeEventListener("focusout", onFocusOut);
    layer.removeEventListener("pointerover", onPointerOver);
    window.removeEventListener("scroll", onScroll);
    if (raf) cancelAnimationFrame(raf);
  };
}
