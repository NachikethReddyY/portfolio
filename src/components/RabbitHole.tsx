import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { headingTransfer } from "../lib/headingTransfer";
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
        const circle = root.current!.querySelector<SVGPathElement>(
          ".teaching-circle path",
        )!;
        const circleLength = circle.getTotalLength();
        gsap.set(circle, {
          strokeDasharray: circleLength,
          strokeDashoffset: circleLength,
        });
        const dive = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        const wordOffset = (axis: "x" | "y") => {
          const hole = root
            .current!.querySelector(".rabbit-hole")!
            .getBoundingClientRect();
          const word = root
            .current!.querySelector(".hole-anchor")!
            .getBoundingClientRect();
          return axis === "x"
            ? hole.left + hole.width / 2 - word.left - word.width / 2
            : hole.top + hole.height / 2 - word.top - word.height / 2;
        };
        dive
          .fromTo(
            ".story-rabbit",
            { autoAlpha: 0, scale: 0.3, y: 30 },
            { autoAlpha: 1, scale: 1, y: 0, duration: 0.25 },
          )
          .to({}, { duration: 0.2 })
          .to(".hole-word", {
            x: () => wordOffset("x"),
            y: () => wordOffset("y"),
            duration: 0.65,
            ease: "power2.inOut",
          })
          .to(".hole-word", {
            autoAlpha: 0,
            scale: 0.6,
            filter: "blur(8px)",
            duration: 0.3,
          })
          .fromTo(
            ".rabbit-hole",
            { autoAlpha: 0, scale: 0.4 },
            { autoAlpha: 1, scale: 1, duration: 0.3 },
            "<",
          )
          .to(".story-rabbit", {
            x: () => holeOffset("x") - 80,
            y: () => holeOffset("y") - 20,
            duration: 0.55,
            ease: "power2.inOut",
          })
          .to({}, { duration: 0.2 })
          .to(".story-rabbit", {
            x: () => holeOffset("x") - 30,
            y: () => holeOffset("y") - 95,
            rotation: -18,
            duration: 0.25,
            ease: "power2.out",
          })
          .to(".story-rabbit", {
            x: () => holeOffset("x"),
            y: () => holeOffset("y"),
            rotation: 100,
            scale: 0.1,
            autoAlpha: 0,
            duration: 0.3,
            ease: "power3.in",
          })
          .fromTo(
            ".rabbit-speed",
            { autoAlpha: 0, scaleY: 0.3 },
            { autoAlpha: 0.8, scaleY: 1, duration: 0.1 },
            "<.15",
          )
          .to(".rabbit-speed", { autoAlpha: 0, duration: 0.1 })
          .to(".rabbit-opening, .rabbit-hole", { autoAlpha: 0, duration: 0.25 })
          .fromTo(
            ".rabbit-landing",
            { autoAlpha: 0, y: 25 },
            { autoAlpha: 1, y: 0, duration: 0.25 },
            "<",
          )
          .fromTo(
            ".landing-rabbit",
            { autoAlpha: 0, y: -50, rotation: -8 },
            {
              autoAlpha: 1,
              y: 0,
              rotation: 0,
              duration: 0.3,
              ease: "bounce.out",
            },
          )
          .to({}, { duration: 0.2 })
          .fromTo(
            ".teaching-circle path",
            { strokeDashoffset: circleLength, autoRound: false },
            {
              strokeDashoffset: 0,
              autoRound: false,
              duration: 1.2,
              ease: "none",
            },
          )
          .to({}, { duration: 0.4 });
        const heading =
          root.current!.querySelector<HTMLElement>(".rabbit-landing h3")!;
        const target = root.current!.parentElement!.querySelector<HTMLElement>(
          ".teaching-destination",
        );
        if (target) {
          const transfer = { progress: 0 };
          const sources = [
            ...heading.querySelectorAll<HTMLElement>(".teaching-line"),
          ];
          const destinations = [
            ...target.querySelectorAll<HTMLElement>(":scope > span"),
          ];
          const copy =
            target.parentElement!.querySelector<HTMLElement>(":scope > p")!;
          const reposition = () => {
            // Read both lines first; collision avoidance must not force layout after a write.
            const measurements = sources.map((source, index) => {
              const dest = destinations[index].getBoundingClientRect();
              const from = source.getBoundingClientRect();
              return {
                left: from.left,
                top: from.top,
                width: from.width,
                height: from.height,
                x: Number(gsap.getProperty(source, "x")),
                y: Number(gsap.getProperty(source, "y")),
                scale: Number(gsap.getProperty(source, "scaleX")),
                layoutWidth: source.offsetWidth,
                targetLeft: dest.left,
                targetTop: dest.top,
                targetWidth: dest.width,
              };
            });
            headingTransfer(
              measurements,
              transfer.progress,
              copy.getBoundingClientRect().top,
            ).forEach((pose, index) => {
              gsap.set(sources[index], pose);
            });
          };
          gsap
            .timeline({
              scrollTrigger: {
                trigger: root.current,
                start: "bottom bottom",
                end: "bottom 25%",
                scrub: true,
                onUpdate: reposition,
              },
            })
            .fromTo(target, { autoAlpha: 0 }, { autoAlpha: 0, duration: 0.01 })
            .to(".rabbit-landing > p, .landing-rabbit, .teaching-circle", {
              autoAlpha: 0,
              duration: 0.25,
            })
            .to(
              transfer,
              { progress: 1, duration: 0.7, onUpdate: reposition },
              "<",
            )
            .to(sources, { color: "#f3f1e8", duration: 0.7 }, "<")
            .set(heading, { autoAlpha: 0 })
            .set(target, { autoAlpha: 1 });
        }
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
            <span className="hole-anchor">
              <span className="hole-word">hole.</span>
            </span>
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
            <span className="teaching-line">Learning to</span>
            <br />
            <span className="teaching-target teaching-line">
              teach a model.
              <RabbitArtwork className="landing-rabbit" />
              <svg
                className="teaching-circle"
                viewBox="0 0 650 120"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M614 30C512-4 156-4 38 28S-4 112 306 109 683 56 621 25C547-9 184 2 65 23" />
              </svg>
            </span>
          </h3>
          <p>Training it for a specific task, then checking what changed.</p>
        </div>
      </div>
    </div>
  );
}
