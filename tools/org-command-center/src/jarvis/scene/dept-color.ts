export const DEPT_PALETTE = [
  "#3d6b8a",
  "#5a6b3d",
  "#6b4a6b",
  "#6b5a3d",
  "#3d6b5a",
  "#6b3d3d",
  "#3d5a6b",
  "#5a3d6b",
] as const;

function djb2Hash(value: string): number {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return hash >>> 0;
}

export function deptColor(dept: string): string {
  const index = djb2Hash(dept.toLowerCase()) % DEPT_PALETTE.length;
  return DEPT_PALETTE[index]!;
}
