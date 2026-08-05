/**
 * drei Html defaults to zIndexRange ≈ 16M, which stacks seat titles above
 * Situation Room drawers (z-index ~90). Keep scene labels under HUD chrome.
 */
export const SCENE_HTML_Z_INDEX_RANGE: [number, number] = [40, 5];
