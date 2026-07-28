import type { RouteName } from "@/lib/analytics/types";

const ROUTE_NAME_BY_PATH: Record<string, RouteName> = {
  "/": "home",
  "/health": "health",
  "/dogs": "dogs",
  "/about": "about",
  "/inquire": "inquire",
};

export const EVIDENCE_ROUTES = ["/health", "/dogs", "/about"] as const;

export function pathToRouteName(path: string): RouteName | undefined {
  return ROUTE_NAME_BY_PATH[path];
}

export function isEvidenceRoute(path: string): boolean {
  return (EVIDENCE_ROUTES as readonly string[]).includes(path);
}
