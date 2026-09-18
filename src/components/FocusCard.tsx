import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function FocusCard({
  title,
  items,
  className,
}: {
  title: string;
  items: readonly string[];
  className: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const cycleRef = useRef<gsap.core.Timeline | null>(null);
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const toggle = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
    cycleRef.current?.paused(pausedRef.current);
  };
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const lines =
          root.current?.querySelectorAll<HTMLElement>(".focus-item");
        if (!lines?.length || lines.length < 2) return;
        const cycle = gsap.timeline({ repeat: -1, paused: true });
        cycleRef.current = cycle;
        gsap.set(lines, { autoAlpha: 0, y: 8 });
        gsap.set(lines[0], { autoAlpha: 1, y: 0 });
        lines.forEach((line, i) => {
          cycle
            .to(line, { autoAlpha: 0, y: -8, duration: 0.25 }, "+=3")
            .fromTo(
              lines[(i + 1) % lines.length],
              { autoAlpha: 0, y: 8 },
              { autoAlpha: 1, y: 0, duration: 0.3, immediateRender: false },
            );
        });
        let inView = false;
        const sync = () => {
          if (inView && !document.hidden && !pausedRef.current) cycle.play();
          else cycle.pause();
        };
        const observer = new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          sync();
        });
        observer.observe(root.current!);
        document.addEventListener("visibilitychange", sync);
        return () => {
          cycleRef.current = null;
          observer.disconnect();
          document.removeEventListener("visibilitychange", sync);
        };
      });
      return () => media.revert();
    },
    { scope: root },
  );
  return (
    <div ref={root} className={`focus-card ${className}`}>
      <p>
        <svg
          className="focus-symbol"
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {title === "Development" ? (
            <>
              <path d="m8 6-6 6 6 6M16 6l6 6-6 6M14 3l-4 18" />
            </>
          ) : (
            <>
              <rect x="6" y="6" width="12" height="12" rx="3" />
              <path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4" />
            </>
          )}
        </svg>
        <span className="sr-only">{title}</span>
      </p>
      <button
        className="focus-pause"
        onClick={toggle}
        aria-label={`${paused ? "Resume" : "Pause"} ${title} examples`}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          {paused ? (
            <path d="M5 3l8 5-8 5z" fill="currentColor" />
          ) : (
            <path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="2" />
          )}
        </svg>
      </button>
      <span className="sr-only">{items.join(", ")}</span>
      <div className="focus-items" aria-hidden="true">
        {items.map((item) => (
          <span className="focus-item" key={item}>
            {item}
          </span>
        ))}
      </div>
      <div className="focus-static" aria-hidden="true">
        {items.join(" · ")}
      </div>
    </div>
  );
}
