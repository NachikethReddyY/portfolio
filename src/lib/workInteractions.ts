export function previewTilt(x: number, y: number) {
  const clamp = (value: number) => Math.max(0, Math.min(1, value));
  return { x: (0.5 - clamp(y)) * 6, y: (clamp(x) - 0.5) * 6 };
}
export function galleryStep(index: number, direction: number, count: number) {
  return count > 0 ? (index + direction + count) % count : 0;
}
