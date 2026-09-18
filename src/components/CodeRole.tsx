import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const lines = [
  "const nachiketh = {",
  '  builds: ["web apps", "iOS apps"],',
  '  exploring: ["AI agents", "local models"],',
  "};",
];

export function CodeRole({ role }: { role: string }) {
  const root = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      const button = root.current;
      if (!button) return;
      const title = button.querySelector(".code-role-title");
      const selection = button.querySelector(".code-role-selection");
      const code = button.querySelector(".code-role-code");
      const characters = [
        ...button.querySelectorAll<HTMLElement>(".code-role-char"),
      ];
      const progress = { count: 0 };
      let lastCount = -1;
      let hovered = false;
      let focused = false;
      let tapped = false;
      const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const draw = () => {
        const count = Math.floor(progress.count);
        if (count === lastCount) return;
        characters.forEach((character, index) => {
          character.style.opacity = index < count ? "1" : "0";
          character.classList.toggle("is-cursor", index === count - 1);
        });
        lastCount = count;
      };
      draw();
      const sequence = gsap
        .timeline({ paused: true })
        .fromTo(
          selection,
          { scaleX: 0, opacity: 1 },
          { scaleX: 1, duration: 0.28, ease: "power2.out" },
        )
        .fromTo(title, { opacity: 1 }, { opacity: 0, duration: 0.14 }, "+=0.12")
        .to(selection, { opacity: 0, duration: 0.12 })
        .fromTo(code, { opacity: 0 }, { opacity: 1, duration: 0.12 })
        .to(progress, {
          count: characters.length,
          duration: 2.4,
          ease: "none",
          onUpdate: draw,
        });
      const reset = () => {
        sequence.pause(0);
        progress.count = 0;
        draw();
      };
      const sync = () => {
        if (hovered || focused || tapped) {
          if (motion.matches) sequence.progress(1).pause();
          else sequence.play();
        } else reset();
      };
      const enter = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        hovered = true;
        sync();
      };
      const leave = () => {
        hovered = false;
        sync();
      };
      const focus = () => {
        focused = button.matches(":focus-visible");
        sync();
      };
      const blur = () => {
        focused = false;
        tapped = false;
        sync();
      };
      const click = (event: PointerEvent) => {
        if (event.pointerType !== "touch") return;
        tapped = !tapped;
        sync();
      };
      const key = (event: KeyboardEvent) => {
        if (event.key !== "Escape") return;
        hovered = focused = tapped = false;
        button.blur();
        reset();
      };
      button.addEventListener("pointerenter", enter);
      button.addEventListener("pointerleave", leave);
      button.addEventListener("focus", focus);
      button.addEventListener("blur", blur);
      button.addEventListener("click", click);
      button.addEventListener("keydown", key);
      motion.addEventListener("change", sync);
      return () => {
        button.removeEventListener("pointerenter", enter);
        button.removeEventListener("pointerleave", leave);
        button.removeEventListener("focus", focus);
        button.removeEventListener("blur", blur);
        button.removeEventListener("click", click);
        button.removeEventListener("keydown", key);
        motion.removeEventListener("change", sync);
      };
    },
    { scope: root },
  );

  return (
    <span className="hero-title-line">
      <span>
        <button
          ref={root}
          type="button"
          className="code-role"
          aria-label={role}
        >
          <span className="code-role-selection" aria-hidden="true" />
          <span className="code-role-title" aria-hidden="true">
            {role}
            <span className="hero-period">.</span>
          </span>
          <code className="code-role-code" aria-hidden="true">
            {lines.map((line, row) => (
              <span className="code-role-row" key={line}>
                <span className="code-role-number">{row + 1}</span>
                <span>
                  {[...line].map((character, column) => (
                    <span
                      key={column}
                      className={`code-role-char${row === 0 && column < 5 ? " code-role-keyword" : line.slice(0, column + 1).split('"').length % 2 === 0 || character === '"' ? " code-role-string" : ""}`}
                    >
                      {character}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </code>
        </button>
      </span>
    </span>
  );
}
