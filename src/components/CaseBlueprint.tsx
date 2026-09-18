import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import blueprints from "../content/case-blueprints.json";

gsap.registerPlugin(useGSAP, ScrollTrigger);
type Blueprint = (typeof blueprints)[keyof typeof blueprints];
export function blueprintFor(slug: string): Blueprint | undefined {
  return Object.hasOwn(blueprints, slug)
    ? blueprints[slug as keyof typeof blueprints]
    : undefined;
}

function PlanDrawing({ study }: { study: Blueprint }) {
  return (
    <svg
      className="blueprint-drawing"
      viewBox="0 0 600 480"
      role="img"
      aria-label={study.steps.map((s) => `${s.label}: ${s.detail}`).join(". ")}
    >
      <defs>
        <pattern
          id="blueprint-hatch"
          width="9"
          height="9"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <path
            d="M0 0V9"
            stroke="currentColor"
            strokeWidth=".5"
            opacity=".2"
          />
        </pattern>
      </defs>
      <g className="blueprint-dimensions">
        <path d="M35 22H565 M35 16V28 M565 16V28 M582 45V410 M576 45H588 M576 410H588" />
        <text x="300" y="16" textAnchor="middle">
          Workflow
        </text>
      </g>
      <g className="blueprint-room blueprint-room-0">
        <path className="room-fill" d="M35 45H290V210H35Z" />
        <path
          className="room-wall"
          d="M35 210V45H290V210H180 M125 210H35 M125 210V155 M125 155A55 55 0 0 1 180 210"
        />
        <rect className="room-detail" x="57" y="66" width="52" height="19" />
        <path className="room-detail" d="M121 70H262 M121 80H221 M57 99H262" />
        <text className="room-number" x="68" y="80">
          01
        </text>
        <text className="room-name" x="162" y="126" textAnchor="middle">
          {study.steps[0].label}
        </text>
        <text className="room-subtitle" x="162" y="149" textAnchor="middle">
          {study.steps[0].detail}
        </text>
      </g>
      <g className="blueprint-room blueprint-room-1">
        <path className="room-fill" d="M290 45H565V210H290Z" />
        <path
          className="room-wall"
          d="M290 45H565V210H440 M385 210H290 M385 210V155 M385 155A55 55 0 0 1 440 210"
        />
        <rect className="room-detail" x="314" y="66" width="52" height="19" />
        <path className="room-detail" d="M378 70H537 M378 80H498 M314 99H537" />
        <text className="room-number" x="325" y="80">
          02
        </text>
        <text className="room-name" x="432" y="126" textAnchor="middle">
          {study.steps[1].label}
        </text>
        <text className="room-subtitle" x="432" y="149" textAnchor="middle">
          {study.steps[1].detail}
        </text>
      </g>
      <path className="room-wall" d="M35 210V265H565V210" />
      <path className="blueprint-route" d="M86 237H520" />
      <path className="blueprint-route" d="m511 231 10 6-10 6" />
      <g className="blueprint-room blueprint-room-2">
        <path className="room-fill" d="M35 265H565V410H35Z" />
        <path
          className="room-wall"
          d="M35 265V410H565V265 M260 265V320 M260 320A55 55 0 0 0 315 265"
        />
        <rect
          className="room-detail"
          x="432"
          y="285"
          width="110"
          height="103"
          fill="url(#blueprint-hatch)"
        />
        <path
          className="room-detail"
          d="M455 310H520 M455 326H501 M455 342H520 M455 358H490"
        />
        <text className="room-number" x="455" y="305">
          03
        </text>
        <text className="room-name" x="220" y="347" textAnchor="middle">
          {study.steps[2].label}
        </text>
        <text className="room-subtitle" x="220" y="376" textAnchor="middle">
          {study.steps[2].detail}
        </text>
      </g>
      <g className="blueprint-dimensions">
        <path d="M35 440H565 M35 433V447 M565 433V447" />
        <text x="300" y="461" textAnchor="middle">
          {study.steps.map((s) => s.label).join(" → ")}
        </text>
      </g>
    </svg>
  );
}

export function CaseBlueprint({
  study,
  name,
  status,
}: {
  study: Blueprint;
  name: string;
  status: string;
}) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const sheet = root.current!.querySelector(".blueprint-sheet")!;
        const walls = gsap.utils.toArray<SVGGeometryElement>(
          ".room-wall",
          root.current,
        );
        const details = gsap.utils.toArray<SVGGeometryElement>(
          ".room-detail, .blueprint-dimensions path",
          root.current,
        );
        const labels = root.current!.querySelectorAll(
          ".room-name, .room-subtitle, .room-number, .blueprint-dimensions text",
        );
        // Real path lengths let the same drawing sequence work at every screen size.
        [...walls, ...details].forEach((line) => {
          const length = line.getTotalLength();
          gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        });
        gsap.set(labels, { opacity: 0 });
        const drawing = gsap
          .timeline({ paused: true })
          .to(walls, {
            strokeDashoffset: 0,
            duration: 1.15,
            stagger: 0.12,
            ease: "power2.inOut",
          })
          .to(
            details,
            {
              strokeDashoffset: 0,
              duration: 0.7,
              stagger: 0.045,
              ease: "power1.out",
            },
            0.65,
          )
          .to(labels, { opacity: 1, duration: 0.45, stagger: 0.035 }, 1.3)
          .from(
            ".blueprint-title-block",
            { opacity: 0, y: 8, duration: 0.4 },
            1.7,
          );
        // Actual visibility avoids starting early while image/font layout is settling.
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              drawing.play();
              observer.disconnect();
            }
          },
          { threshold: 0.25 },
        );
        observer.observe(sheet);
        return () => observer.disconnect();
      });
      mm.add(
        "(min-width: 1000px) and (prefers-reduced-motion: no-preference)",
        () => {
          const rooms = gsap.utils.toArray<SVGGElement>(
            ".blueprint-room",
            root.current,
          );
          const steps = gsap.utils.toArray<HTMLElement>(
            ".blueprint-step",
            root.current,
          );
          rooms.forEach((room, index) => {
            gsap.fromTo(
              room.querySelector(".room-fill"),
              { opacity: 0.02 },
              {
                opacity: 0.15,
                ease: "none",
                scrollTrigger: {
                  trigger: steps[index],
                  start: "top 65%",
                  end: "top 35%",
                  scrub: 0.35,
                },
              },
            );
          });
          const route =
            root.current!.querySelector<SVGPathElement>(".blueprint-route")!;
          gsap.fromTo(
            root.current!.querySelectorAll(".blueprint-route")[1],
            { opacity: 0 },
            {
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: steps[2],
                start: "top 60%",
                end: "top 40%",
                scrub: 0.4,
              },
            },
          );
          const length = route.getTotalLength();
          gsap.fromTo(
            route,
            { strokeDasharray: length, strokeDashoffset: length },
            {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: {
                trigger: root.current,
                start: "top 50%",
                end: "bottom 70%",
                scrub: 0.4,
              },
            },
          );
        },
      );
      return () => mm.revert();
    },
    { scope: root, dependencies: [study], revertOnUpdate: true },
  );
  return (
    <section className="case-blueprint" id="project-blueprint" ref={root}>
      <header className="blueprint-heading">
        <h2>{study.title}</h2>
        <p>{study.summary}</p>
      </header>
      <div className="blueprint-layout">
        <figure className="blueprint-sheet">
          <PlanDrawing study={study} />
          <figcaption className="blueprint-title-block">
            <span>
              Project<strong>{name}</strong>
            </span>
            <span>
              View<strong>Workflow</strong>
            </span>
            <span>
              Status<strong>{status}</strong>
            </span>
          </figcaption>
        </figure>
        <div className="blueprint-explanation">
          {study.steps.map((step, index) => (
            <section className="blueprint-step" key={step.label}>
              <span className="blueprint-step-number">
                0{index + 1} / {step.label}
              </span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </section>
          ))}
        </div>
      </div>
      <p className="blueprint-limit">{study.limit}</p>
    </section>
  );
}
