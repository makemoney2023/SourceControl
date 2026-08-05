export type WorkspaceViewState = {
  theater: boolean;
  opsTables: boolean;
};

export function setTheaterVisible(
  state: WorkspaceViewState,
  theater: boolean,
): WorkspaceViewState {
  return { theater, opsTables: theater ? state.opsTables : true };
}

export function setOpsVisible(
  state: WorkspaceViewState,
  opsTables: boolean,
): WorkspaceViewState {
  return { theater: opsTables ? state.theater : true, opsTables };
}

export function toggleTheater(state: WorkspaceViewState): WorkspaceViewState {
  return setTheaterVisible(state, !state.theater);
}

export function toggleOpsTables(state: WorkspaceViewState): WorkspaceViewState {
  return setOpsVisible(state, !state.opsTables);
}
