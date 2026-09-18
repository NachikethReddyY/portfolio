function Chevron() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="m4 6 4 4 4-4" />
    </svg>
  );
}
function FileChip() {
  return (
    <span className="mark-one-file-chip">
      <img src="/icons/typescript.svg" alt="TypeScript" />
      <code>client.ts</code>
    </span>
  );
}
export function MarkOneDemo() {
  return (
    <figure
      className="mark-one-demo"
      data-reveal
      aria-label="Illustrative local model conversation"
    >
      <div className="mark-one-prompt">
        <p>
          Build a typed API client in <FileChip />. Accept a response parser and
          an abort signal, handle HTTP errors, then run <code>pnpm check</code>.
        </p>
      </div>
      <div className="mark-one-response">
        <p>
          <strong>A small client.</strong> Typed results, response validation,
          request cancellation, and clear errors for failed HTTP responses.
        </p>
        <div className="mark-one-changes">
          <span className="changes-heading">
            Files changed <span>Edited 1 file</span>
          </span>
          <div>
            <FileChip />
            <span>Added request handling</span>
          </div>
        </div>
      </div>
      <div
        className="mark-one-composer"
        role="img"
        aria-label="Illustrated prompt composer with Fleet Mark I selected at High effort"
      >
        <span className="composer-placeholder">Ask a follow-up…</span>
        <div className="composer-toolbar">
          <span className="composer-model">
            Fleet Mark I <Chevron />
          </span>
          <span className="composer-effort">
            High <Chevron />
          </span>
          <span className="composer-access">
            <svg viewBox="0 0 24 24">
              <rect x="5" y="10" width="14" height="11" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
            Full access
            <Chevron />
          </span>
          <span className="composer-attach">
            <svg viewBox="0 0 24 24">
              <path d="m8 13 7-7a3 3 0 0 1 4 4L9 20a5 5 0 0 1-7-7L13 2m-7 13 8-8" />
            </svg>
          </span>
          <span className="composer-send">
            <svg viewBox="0 0 24 24">
              <path d="M12 18V6m-5 5 5-5 5 5" />
            </svg>
          </span>
        </div>
      </div>
    </figure>
  );
}
