import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
gsap.registerPlugin(useGSAP);
function TypedText({ text }: { text: string }) {
  return (
    <span aria-label={text}>
      {Array.from(text).map((letter, index) => (
        <span className="typed-char" key={index} aria-hidden="true">
          {letter}
        </span>
      ))}
    </span>
  );
}
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
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const mobile = matchMedia("(max-width:700px)").matches;
        const conversation = gsap
          .timeline({ paused: true })
          .fromTo(
            ".mark-one-prompt",
            { autoAlpha: 0, y: 35, rotation: 0 },
            { autoAlpha: 1, y: 0, duration: 0.3 },
          )
          .from(".prompt-type .typed-char, .prompt-type .mark-one-file-chip", {
            opacity: 0,
            duration: 0.02,
            stagger: 0.012,
          })
          .to(".mark-one-prompt", {
            rotation: mobile ? 1.5 : 3,
            y: -12,
            duration: 0.5,
          })
          .fromTo(
            ".mark-one-response",
            { autoAlpha: 0, y: 35, rotation: 0 },
            { autoAlpha: 1, y: 0, duration: 0.35 },
          )
          .from(".response-type .typed-char", {
            opacity: 0,
            duration: 0.02,
            stagger: 0.014,
          })
          .from(".mark-one-changes", {
            autoAlpha: 0,
            scale: 0.95,
            y: 12,
            duration: 0.45,
            ease: "back.out(1.4)",
          })
          .to(".mark-one-response", {
            rotation: mobile ? -1 : -2,
            y: -8,
            duration: 0.5,
          })
          .fromTo(
            ".mark-one-composer",
            { autoAlpha: 0, y: 35, rotation: 0 },
            {
              autoAlpha: 1,
              y: 0,
              rotation: mobile ? 0.8 : 1.5,
              duration: 0.45,
            },
          );
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            conversation.play();
            observer.disconnect();
          },
          { rootMargin: "0px 0px -20% 0px" },
        );
        observer.observe(root.current!);
        return () => observer.disconnect();
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <figure
      className="mark-one-demo"
      ref={root}
      aria-label="Illustrative local model conversation"
    >
      <div className="mark-one-prompt">
        <p className="prompt-type">
          <TypedText text="Build a typed API client in " />
          <FileChip />
          <TypedText text=". Accept a response parser and an abort signal, handle HTTP errors, then run " />
          <code>
            <TypedText text="pnpm check" />
          </code>
          <TypedText text="." />
        </p>
      </div>
      <div className="mark-one-response">
        <p className="response-type">
          <strong>
            <TypedText text="A small client." />
          </strong>{" "}
          <TypedText text="Typed results, response validation, request cancellation, and clear errors for failed HTTP responses." />
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
