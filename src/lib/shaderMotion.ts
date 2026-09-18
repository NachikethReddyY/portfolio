type Scheduler = {
  request: (callback: (time: number) => void) => number;
  cancel: (id: number) => void;
};

/** Finite, 30fps render bursts. Hidden time never advances the animation. */
export function createShaderMotion(
  draw: (seconds: number) => void,
  scheduler: Scheduler,
) {
  let frame = 0;
  let remaining = 0;
  let previous: number | null = null;
  let visible = false;
  let disposed = false;
  const queue = () => {
    if (!frame && visible && !disposed && remaining > 0)
      frame = scheduler.request(tick);
  };
  const tick = (time: number) => {
    frame = 0;
    if (!visible || disposed) return;
    if (previous === null) {
      previous = time;
      draw(0);
    } else if (time - previous >= 1000 / 30) {
      const elapsed = Math.min(time - previous, 100);
      previous = time;
      remaining = Math.max(0, remaining - elapsed);
      draw(elapsed / 1000);
    }
    queue();
  };
  return {
    play(milliseconds: number) {
      remaining = Math.max(remaining, milliseconds);
      queue();
    },
    setVisible(next: boolean) {
      if (visible === next) return;
      visible = next;
      previous = null;
      if (!visible) {
        scheduler.cancel(frame);
        frame = 0;
      } else queue();
    },
    dispose() {
      disposed = true;
      scheduler.cancel(frame);
      frame = 0;
    },
  };
}
