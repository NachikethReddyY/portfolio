type LineMeasurement = {
  left: number;
  top: number;
  width: number;
  height: number;
  x: number;
  y: number;
  scale: number;
  layoutWidth: number;
  targetLeft: number;
  targetTop: number;
  targetWidth: number;
};

/** Predict left/top-origin transforms before writing either line to the DOM. */
export function headingTransfer(
  lines: readonly LineMeasurement[],
  progress: number,
) {
  const poses = lines.map((line) => ({
    x: (line.targetLeft - line.left + line.x) * progress,
    y: (line.targetTop - line.top + line.y) * progress,
    scale: 1 + (line.targetWidth / line.layoutWidth - 1) * progress,
  }));
  if (lines.length === 2) {
    const bounds = lines.map((line, index) => ({
      left: line.left - line.x + poses[index].x,
      top: line.top - line.y + poses[index].y,
      width: (line.width / line.scale) * poses[index].scale,
      height: (line.height / line.scale) * poses[index].scale,
    }));
    const [first, second] = bounds;
    if (
      second.left < first.left + first.width &&
      second.top < first.top + first.height + 8
    ) {
      poses[1].y += first.top + first.height + 8 - second.top;
    }
  }
  return poses;
}
