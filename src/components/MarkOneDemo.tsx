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
        const composer =
          root.current!.querySelector<HTMLElement>(".mark-one-composer")!;
        const prompt =
          root.current!.querySelector<HTMLElement>(".mark-one-prompt")!;
        const lift = () => composer.offsetTop - prompt.offsetTop;
        const conversation = gsap
          .timeline({ paused: true, defaults: { ease: "power2.out" } })
          .set(".mark-one-prompt, .mark-one-response", { autoAlpha: 0 })
          .set(composer, { y: () => -lift() + 60 })
          .set(".composer-placeholder", { autoAlpha: 0 })
          .set(".composer-draft", { autoAlpha: 1 })
          .from(
            ".composer-draft .typed-char, .composer-draft .mark-one-file-chip",
            {
              opacity: 0,
              duration: 0.01,
              stagger: 0.006,
            },
          )
          .to(".composer-send", { scale: 0.82, duration: 0.1 })
          .to(".composer-send", { scale: 1, duration: 0.12 })
          .set(".composer-draft", { autoAlpha: 0 })
          .set(".composer-placeholder", { autoAlpha: 1 })
          .fromTo(
            ".mark-one-prompt",
            { autoAlpha: 0, y: 60, rotation: 0, scale: 0.96 },
            {
              autoAlpha: 1,
              y: -12,
              rotation: mobile ? 1.5 : 3,
              scale: 1,
              duration: 0.45,
            },
          )
          .to(composer, { y: 0, duration: 0.45 }, "<")
          .fromTo(
            ".mark-one-response",
            { autoAlpha: 0, y: 20, rotation: 0 },
            { autoAlpha: 1, y: -8, rotation: mobile ? -1 : -2, duration: 0.25 },
          )
          .from(".response-type .typed-char", {
            opacity: 0,
            duration: 0.01,
            stagger: 0.008,
          })
          .from(".mark-one-changes", {
            autoAlpha: 0,
            scale: 0.97,
            y: 8,
            duration: 0.2,
          });
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            conversation.play();
            observer.disconnect();
          },
          { rootMargin: "0px 0px -20% 0px" },
        );
        observer.observe(composer);
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
            <TypedText text="Done." />
          </strong>{" "}
          <TypedText text="The typed client is ready for review." />
        </p>
        <div className="mark-one-changes">
          <span className="changes-heading">
            Files changed <span>Illustrative diff · 1 file</span>
          </span>
          <div>
            <FileChip />
            <span
              className="illustrative-diff"
              aria-label="Illustrative diff: 42 lines added, 6 removed"
            >
              <span>+42</span> <span>−6</span>
            </span>
          </div>
        </div>
      </div>
      <div
        className="mark-one-composer"
        role="img"
        aria-label="Illustrated prompt composer with Mark I selected at High effort"
      >
        <p className="composer-draft" aria-hidden="true">
          <TypedText text="Build a typed API client in " />
          <FileChip />
          <TypedText text=". Accept a response parser and an abort signal, handle HTTP errors, then run " />
          <code>
            <TypedText text="pnpm check" />
          </code>
          <TypedText text="." />
        </p>
        <span className="composer-placeholder">Ask a follow-up…</span>
        <div className="composer-toolbar">
          <span className="composer-model">
            Mark I <Chevron />
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
