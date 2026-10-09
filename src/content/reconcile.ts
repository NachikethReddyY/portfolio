/** Preserve React consumer identity when a background refresh matches the rendered snapshot. */
export function reconcileContent<T>(current: T, incoming: T): T {
  return JSON.stringify(current) === JSON.stringify(incoming) ? current : incoming;
}
