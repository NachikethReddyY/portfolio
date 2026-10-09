import { RecoveryArtwork } from "./RecoveryArtwork";
import { Component } from "react";
import type { ReactNode } from "react";

/** Keep an optional renderer failure inside its own piece of the page. */
export class RenderBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function PageRecovery() {
  return (
    <main className="missing-page recovery-page shell">
      <RecoveryArtwork error />
      <div className="missing-copy" role="alert">
        <p className="missing-status">Page interrupted</p>
        <h1>
          Let’s get you
          <br />
          back on track<span>.</span>
        </h1>
        <p>
          This page couldn’t finish loading. Try a reload, or return to the
          portfolio.
        </p>
        <div className="missing-actions">
          <button
            className="button-primary"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
          <a className="button-secondary" href="/">
            Back home
          </a>
        </div>
      </div>
    </main>
  );
}
