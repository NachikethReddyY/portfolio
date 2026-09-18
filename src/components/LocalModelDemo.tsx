import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(useGSAP, ScrollTrigger);
const answer =
  "This is a terminal conversation with Gemma 2. Your prompt is processed on your computer, and the response appears here as it is generated.";
export function LocalModelDemo() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".terminal-stream span", {
          opacity: 0,
          duration: 0.08,
          stagger: 0.055,
          scrollTrigger: {
            trigger: root.current,
            start: "top 60%",
            once: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <figure
      ref={root}
      className="local-workspace"
      aria-label="Sample Ollama terminal conversation"
    >
      <div className="ollama-window">
        <div className="ollama-toolbar">
          <span className="window-controls" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>Ollama</span>
        </div>
        <div className="ollama-terminal">
          <p className="terminal-command">
            <span aria-hidden="true">$</span> ollama run gemma2
          </p>
          <p className="terminal-prompt">
            <span aria-hidden="true">&gt;&gt;&gt;</span> Explain this interface.
          </p>
          <div className="terminal-model">
            <img src="/icons/ollama.svg" alt="" />
            <strong>gemma2</strong>
          </div>
          <p className="terminal-stream" aria-label={answer}>
            {answer.split(" ").map((word, index) => (
              <span key={index} aria-hidden="true">
                {word}{" "}
              </span>
            ))}
          </p>
          <span className="terminal-ready" aria-hidden="true">
            &gt;&gt;&gt; <i />
          </span>
        </div>
      </div>
    </figure>
  );
}
