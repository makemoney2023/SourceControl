/** Default active venture path (matches projects/registry.json passive-grid). */
export const DEFAULT_BUSINESS_IDEA_REL = "docs/projects/passive-grid/business-idea";

export function resolveArtifactPath(p: string, businessIdeaRel: string): string {
  return p.startsWith("docs/") ? p : `${businessIdeaRel}/${p}`;
}

export function managerHandoffPath(
  businessIdeaRel: string,
  phase: string,
  position: string,
): string {
  return `${businessIdeaRel}/HANDOFFS/${phase}-manager-${position}.md`;
}

export function handoffFilePath(businessIdeaRel: string, filename: string): string {
  return `${businessIdeaRel}/HANDOFFS/${filename}`;
}

export function stripBusinessIdeaPrefix(path: string, businessIdeaRel: string): string {
  const prefix = `${businessIdeaRel}/`;
  return path.startsWith(prefix) ? path.slice(prefix.length) : path;
}
