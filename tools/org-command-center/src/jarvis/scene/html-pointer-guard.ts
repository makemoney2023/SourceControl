const GUARD_MS = 350;
let until = 0;

export function markHtmlPointer(): void {
  until = Date.now() + GUARD_MS;
}

export function htmlPointerRecently(): boolean {
  return Date.now() < until;
}
