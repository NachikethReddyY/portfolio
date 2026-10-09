import { useState } from "react";

/** Local-only interaction: restore the lost window without delaying navigation. */
export function RecoveryArtwork({ error = false }: { error?: boolean }) {
  const [restored, setRestored] = useState(false);
  return (
    <div className={`recovery-art${restored ? " is-restored" : ""}`}>
      <div className="recovery-orbit" aria-hidden="true" />
      <button
        className="lost-window"
        onClick={() => setRestored(!restored)}
        aria-label={
          restored ? "Scatter the window again" : "Bring the lost window back"
        }
        aria-pressed={restored}
      >
        <span className="lost-window-bar" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>portfolio / {error ? "connection" : "page"}</span>
        </span>
        <span className="lost-window-code" aria-hidden="true">
          {restored ? "↵" : error ? "…" : "404"}
        </span>
        <span className="lost-window-message">
          {restored
            ? "There you are."
            : error
              ? "Something interrupted the page."
              : "A little off the map."}
        </span>
        <span className="lost-window-hint">
          {restored
            ? "The links will take you home ↓"
            : "Tap to bring the window back"}
        </span>
      </button>
      <span className="recovery-coordinate" aria-hidden="true">
        {restored ? "Location found" : "Location unknown"}
      </span>
    </div>
  );
}
