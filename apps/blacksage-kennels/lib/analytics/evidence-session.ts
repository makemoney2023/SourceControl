import { isEvidenceRoute } from "@/lib/analytics/routes";

export const EVIDENCE_STORAGE_KEY = "bsk_evidence_pages";

function getStorage(): Storage | null {
  if (typeof globalThis === "undefined" || !("sessionStorage" in globalThis)) {
    return null;
  }

  return globalThis.sessionStorage;
}

function readEvidencePages(): string[] {
  const storage = getStorage();
  if (!storage) {
    return [];
  }

  const raw = storage.getItem(EVIDENCE_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function writeEvidencePages(pages: string[]): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem(EVIDENCE_STORAGE_KEY, JSON.stringify(pages));
}

export function recordEvidencePage(path: string): void {
  if (!isEvidenceRoute(path)) {
    return;
  }

  const pages = readEvidencePages();
  if (pages.includes(path)) {
    return;
  }

  writeEvidencePages([...pages, path]);
}

export function getEvidencePages(): string[] {
  return readEvidencePages();
}

export function getEvidenceCount(): number {
  return getEvidencePages().length;
}
