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
    <main className="not-found shell" role="alert">
      <p>Nachiketh Reddy</p>
      <h1>This page couldn’t finish loading.</h1>
      <p>Reload to try again, or head back to the portfolio.</p>
      <div>
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
    </main>
  );
}
