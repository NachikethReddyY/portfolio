export type EntranceState = {
  phase: "outline" | "waiting" | "laptop" | "opening" | "complete";
  ready: boolean;
  fallback: boolean;
};
export type EntranceEvent =
  "outlined" | "ready" | "failed" | "shown" | "opened" | "skip";
export const initialEntrance: EntranceState = {
  phase: "outline",
  ready: false,
  fallback: false,
};

/** Loading and animation advance independently; neither may reveal content out of order. */
export function advanceEntrance(
  state: EntranceState,
  event: EntranceEvent,
): EntranceState {
  if (event === "skip") return { ...state, phase: "complete" };
  if (event === "ready" || event === "failed") {
    return {
      ...state,
      ready: true,
      fallback: state.fallback || event === "failed",
      phase:
        event === "failed"
          ? "complete"
          : state.phase === "waiting"
            ? "laptop"
            : state.phase,
    };
  }
  if (event === "outlined" && state.phase === "outline")
    return { ...state, phase: state.ready ? "laptop" : "waiting" };
  if (event === "shown" && state.phase === "laptop")
    return { ...state, phase: state.fallback ? "complete" : "opening" };
  if (event === "opened" && state.phase === "opening")
    return { ...state, phase: "complete" };
  return state;
}
