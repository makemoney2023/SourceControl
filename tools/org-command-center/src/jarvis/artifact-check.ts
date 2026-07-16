function joinRoot(repoRoot: string, rel: string) {
  return `${repoRoot.replace(/\/+$/, "")}/${rel.replace(/^\/+/, "")}`;
}

export function checkArtifacts(
  repoRoot: string,
  items: Array<{ path: string; fromHandoff: string }>,
  exists: (abs: string) => boolean,
): Array<{ path: string; exists: boolean; fromHandoff: string }> {
  return items.map((i) => ({
    ...i,
    exists: exists(joinRoot(repoRoot, i.path)),
  }));
}
