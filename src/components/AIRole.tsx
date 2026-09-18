import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/** Keep “Aspiring” plain; only the engineering role reveals the inference illustration. */
export function AIRole({ aspiration }: { aspiration: string }) {
  const root = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [tapped, setTapped] = useState(false);
  const active = hovered || focused || tapped;
  const match = /AI engineer/i.exec(aspiration);
  const prefix = match ? aspiration.slice(0, match.index) : "";
  const label = match?.[0] ?? aspiration;
  const suffix = match ? aspiration.slice(match.index + label.length) : "";

  useGSAP(
    () => {
      if (!active) return;
      const media = gsap.matchMedia();
      media.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          animate: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          if (context.conditions?.reduce) {
            gsap.set(".ai-role-label", { opacity: 0 });
            gsap.set(".ai-role-flow", { opacity: 1 });
            return;
          }
          gsap
            .timeline()
            .fromTo(
              ".ai-role-selection",
              { scaleX: 0, opacity: 1 },
              { scaleX: 1, duration: 0.23, ease: "power2.out" },
            )
            .to(".ai-role-label", { opacity: 0, duration: 0.16 }, "+=0.08")
            .to(".ai-role-selection", { opacity: 0, duration: 0.12 })
            .to(".ai-role-flow", { opacity: 1, duration: 0.18 })
            .fromTo(
              ".ai-flow-wire",
              { strokeDashoffset: 1 },
              {
                strokeDashoffset: 0,
                duration: 0.42,
                stagger: 0.3,
                ease: "none",
              },
            )
            .fromTo(
              ".ai-flow-node",
              { opacity: 0.35 },
              { opacity: 1, duration: 0.25, stagger: 0.3 },
              "<",
            )
            .fromTo(
              ".ai-flow-output",
              { scale: 0.75, transformOrigin: "center" },
              { scale: 1, duration: 0.3, ease: "back.out(1.5)" },
            );
        },
        root,
      );
      return () => media.revert();
    },
    { scope: root, dependencies: [active], revertOnUpdate: true },
  );

  return (
    <p className="hero-aspiration">
      {prefix}
      <button
        ref={root}
        className="ai-role"
        type="button"
        aria-label={`${label}: prompt to model to output`}
        aria-pressed={active}
        onPointerEnter={(event) => {
          if (event.pointerType !== "touch") setHovered(true);
        }}
        onPointerLeave={() => setHovered(false)}
        onFocus={(event) =>
          setFocused(event.currentTarget.matches(":focus-visible"))
        }
        onBlur={() => {
          setFocused(false);
          setTapped(false);
        }}
        onClick={(event) => {
          if (
            event.detail === 0 ||
            !window.matchMedia("(hover: hover)").matches
          )
            setTapped(!tapped);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setHovered(false);
            setFocused(false);
            setTapped(false);
            event.currentTarget.blur();
          }
        }}
      >
        <span className="ai-role-selection" aria-hidden="true" />
        <span className="ai-role-label" aria-hidden="true">
          {label}
        </span>
        <svg className="ai-role-flow" viewBox="0 0 210 42" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeWidth="1.5">
            <path className="ai-flow-wire" pathLength="1" d="M31 13H94" />
            <path className="ai-flow-wire" pathLength="1" d="M116 13H179" />
            <circle className="ai-flow-node" cx="24" cy="13" r="6" />
            <rect
              className="ai-flow-node"
              x="96"
              y="4"
              width="18"
              height="18"
              rx="5"
            />
            <circle
              className="ai-flow-node ai-flow-output"
              cx="186"
              cy="13"
              r="6"
            />
            <path d="m102 13 2 2 4-5m75 3 2 2 4-5" />
          </g>
          <g
            fill="currentColor"
            textAnchor="middle"
            fontSize="11"
            fontFamily="monospace"
          >
            <text x="24" y="39">
              prompt
            </text>
            <text x="105" y="39">
              model
            </text>
            <text x="186" y="39">
              output
            </text>
          </g>
        </svg>
      </button>
      {suffix}
    </p>
  );
}
