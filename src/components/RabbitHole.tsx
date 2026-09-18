import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(useGSAP, ScrollTrigger);

function RabbitArtwork({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 110 140" fill="none">
      <ellipse
        cx="40"
        cy="36"
        rx="12"
        ry="31"
        fill="#e9e8df"
        transform="rotate(-14 40 36)"
      />
      <ellipse
        cx="69"
        cy="32"
        rx="11"
        ry="31"
        fill="#e9e8df"
        transform="rotate(12 69 32)"
      />
      <ellipse
        cx="40"
        cy="35"
        rx="5"
        ry="23"
        fill="#9bc6ee"
        transform="rotate(-14 40 35)"
      />
      <ellipse
        cx="69"
        cy="31"
        rx="4"
        ry="22"
        fill="#9bc6ee"
        transform="rotate(12 69 31)"
      />
      <ellipse cx="57" cy="105" rx="31" ry="30" fill="#d4dce4" />
      <circle cx="53" cy="72" r="29" fill="#f0efe9" />
      <circle cx="44" cy="68" r="3" fill="#10151c" />
      <circle cx="65" cy="68" r="3" fill="#10151c" />
      <path d="m51 78 5 5 5-5" stroke="#8d9eaf" strokeWidth="3" />
      <ellipse cx="34" cy="129" rx="15" ry="8" fill="#f0efe9" />
      <ellipse cx="76" cy="129" rx="15" ry="8" fill="#f0efe9" />
      <circle cx="89" cy="108" r="11" fill="#f0efe9" />
    </svg>
  );
}

export function RabbitHole() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const holeOffset = (axis: "x" | "y") => {
          const hole = root
            .current!.querySelector<HTMLElement>(".rabbit-hole")!
            .getBoundingClientRect();
          const origin = root
            .current!.querySelector<HTMLElement>(".rabbit-origin")!
            .getBoundingClientRect();
          return axis === "x"
            ? hole.left + hole.width / 2 - origin.left - origin.width / 2
            : hole.top - origin.bottom;
        };
        const dive = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.25,
            invalidateOnRefresh: true,
          },
        });
        dive
          .fromTo(
            ".story-rabbit",
            { autoAlpha: 0, scale: 0.3, y: 45 },
            {
              autoAlpha: 1,
              scale: 1,
              y: 0,
              duration: 0.18,
              ease: "back.out(1.5)",
            },
          )
          .to({}, { duration: 0.2 })
          .to(".story-rabbit", {
            y: -65,
            x: () => holeOffset("x") * 0.5,
            rotation: -18,
            duration: 0.16,
            ease: "power2.out",
          })
          .fromTo(
            ".rabbit-speed",
            { autoAlpha: 0, scaleY: 0.3 },
            { autoAlpha: 0.8, scaleY: 1, duration: 0.12 },
          )
          .to(
            ".story-rabbit",
            {
              x: () => holeOffset("x"),
              y: () => holeOffset("y"),
              rotation: 100,
              scale: 0.1,
              autoAlpha: 0,
              duration: 0.22,
              ease: "power3.in",
            },
            "<",
          )
          .to(".rabbit-speed", { autoAlpha: 0, duration: 0.08 })
          .to(".rabbit-opening, .rabbit-hole", {
            autoAlpha: 0,
            scale: 0.9,
            duration: 0.16,
          })
          .fromTo(
            ".rabbit-landing",
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: 0.2 },
            "<.05",
          )
          .fromTo(
            ".landing-rabbit",
            { autoAlpha: 0, y: -130, rotation: -12 },
            {
              autoAlpha: 1,
              y: 0,
              rotation: 0,
              duration: 0.24,
              ease: "bounce.out",
            },
          )
          .fromTo(
            ".teaching-circle path",
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.2, ease: "none" },
          )
          .to({}, { duration: 0.25 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <div className="rabbit-stage" ref={root}>
      <div className="rabbit-sticky">
        <div className="rabbit-opening">
          <h3>
            Curiosity became a{" "}
            <span>
              rabbit
              <span className="rabbit-origin" aria-hidden="true">
                <RabbitArtwork className="story-rabbit" />
              </span>
            </span>{" "}
            hole.
          </h3>
          <p>I wanted to understand how models learn.</p>
        </div>
        <div className="rabbit-hole" aria-hidden="true">
          <span className="rabbit-speed">
            <i />
            <i />
            <i />
          </span>
        </div>
        <div className="rabbit-landing">
          <p>Fine-tuning.</p>
          <h3>
            Learning to
            <br />
            <span className="teaching-target">
              teach a model
              <RabbitArtwork className="landing-rabbit" />
              <svg
                className="teaching-circle"
                viewBox="0 0 650 120"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  pathLength="1"
                  d="M614 30C512-4 156-4 38 28S-4 112 306 109 683 56 621 25C547-9 184 2 65 23"
                />
              </svg>
            </span>
          </h3>
          <p>Training it for a specific task, then checking what changed.</p>
        </div>
      </div>
    </div>
  );
}
