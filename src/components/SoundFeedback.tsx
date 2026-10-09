import { useEffect } from "react";
import { playClick } from "../lib/interfaceSound";

/** Only trusted clicks produce sound; the browser's site mute remains authoritative. */
export function SoundFeedback() {
  useEffect(() => {
    let audio: AudioContext | null = null;
    let lastClick = 0;
    let alive = true;
    const click = (event: MouseEvent) => {
      if (
        !event.isTrusted ||
        document.hidden ||
        !(event.target instanceof Element)
      )
        return;
      const control = event.target.closest("a,button,summary");
      if (
        !control ||
        control.hasAttribute("disabled") ||
        performance.now() - lastClick < 75
      )
        return;
      lastClick = performance.now();
      try {
        const context = (audio ??= new AudioContext());
        void context
          .resume()
          .then(() => {
            if (alive && !document.hidden && context.state === "running")
              playClick(context);
          })
          .catch(() => {});
      } catch {
        /* Audio support is optional; controls still work. */
      }
    };
    document.addEventListener("click", click, true);
    return () => {
      alive = false;
      document.removeEventListener("click", click, true);
      void audio?.close().catch(() => {});
    };
  }, []);
  return null;
}
