import { useId, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

type Pet = "codex" | "claude";

/** Each pet pauses its own play loop while introducing itself. */
export function RoleMascots() {
  const root = useRef<HTMLDivElement>(null);
  const cutout = useId();
  const bubbleId = useId();
  const [active, setActive] = useState<Pet | null>(null);
  const activeRef = useRef<Pet | null>(null);
  const syncMotion = useRef<() => void>(() => {});
  const introduce = (pet: Pet | null) => {
    activeRef.current = pet;
    setActive(pet);
    syncMotion.current();
    const host = root.current;
    const player = pet && host?.querySelector(`.pet-player--${pet}`);
    if (host && player) {
      const hostBox = host.getBoundingClientRect();
      const petBox = player.getBoundingClientRect();
      const center = petBox.left + petBox.width / 2 - hostBox.left;
      const bubbleWidth = Math.min(235, window.innerWidth - 40);
      const left = Math.max(
        0,
        Math.min(
          center - bubbleWidth / 2,
          window.innerWidth - hostBox.left - bubbleWidth - 20,
        ),
      );
      host.style.setProperty("--bubble-left", `${left}px`);
      host.style.setProperty(
        "--bubble-tail",
        `${Math.max(12, Math.min(bubbleWidth - 12, center - left))}px`,
      );
    }
  };

  useGSAP(
    () => {
      const host = root.current;
      if (!host) return;
      const media = gsap.matchMedia();
      media.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          const buttons = [
            ...host.querySelectorAll<HTMLElement>(".pet-player"),
          ];
          const eyes = host.querySelectorAll(".mascot-eye");
          const lids = host.querySelector(".codex-eyelids");
          gsap.set(lids, { scaleY: 0, transformOrigin: "center" });
          // Percentages are translated against a full-width carrier, so resizing
          // preserves the playhead and keeps each pet on its own part of the line.
          const loops = buttons.map((button, index) => {
            const carrier = button.parentElement;
            const blink = index === 0 ? lids : eyes;
            const start = index === 0 ? 3 : 72;
            const end = index === 0 ? 36 : 52;
            const loop = gsap.timeline({
              paused: true,
              repeat: -1,
              repeatDelay: 0.8,
              delay: index * 0.65,
            });
            loop
              .fromTo(
                carrier,
                { x: 0, xPercent: start },
                { xPercent: end, duration: 2.4, ease: "sine.inOut" },
                0,
              )
              .to(
                button,
                {
                  y: -2.5,
                  rotation: index ? -4 : 4,
                  duration: 0.15,
                  yoyo: true,
                  repeat: 15,
                  ease: "sine.inOut",
                },
                0,
              )
              .to(
                blink,
                {
                  scaleY: index ? 0.08 : 1,
                  transformOrigin: "center",
                  duration: 0.1,
                  repeat: 1,
                  yoyo: true,
                },
                2.7,
              )
              .to(
                button,
                {
                  y: 44,
                  rotation: index ? 7 : -7,
                  duration: 0.4,
                  ease: "power2.in",
                },
                3.2,
              )
              .to(
                button,
                { y: 0, rotation: 0, duration: 0.5, ease: "back.out(1.3)" },
                4.1,
              )
              .to(
                carrier,
                { xPercent: start, duration: 2.4, ease: "sine.inOut" },
                4.9,
              )
              .to(
                button,
                {
                  y: -2.5,
                  rotation: index ? 4 : -4,
                  duration: 0.15,
                  yoyo: true,
                  repeat: 15,
                  ease: "sine.inOut",
                },
                4.9,
              )
              .to(
                blink,
                {
                  scaleY: index ? 0.08 : 1,
                  duration: 0.1,
                  repeat: 1,
                  yoyo: true,
                },
                7.5,
              );
            return loop;
          });
          let visible = false;
          const sync = () =>
            loops.forEach((loop, index) =>
              loop.paused(
                !visible ||
                  document.hidden ||
                  activeRef.current === (index === 0 ? "codex" : "claude"),
              ),
            );
          syncMotion.current = sync;
          const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            sync();
          });
          observer.observe(host);
          document.addEventListener("visibilitychange", sync);
          return () => {
            observer.disconnect();
            document.removeEventListener("visibilitychange", sync);
            syncMotion.current = () => {};
          };
        },
        host,
      );
      return () => media.revert();
    },
    { scope: root },
  );

  const petProps = (pet: Pet) => ({
    onPointerEnter: (event: React.PointerEvent) => {
      if (event.pointerType !== "touch") introduce(pet);
    },
    onPointerLeave: (event: React.PointerEvent) => {
      if (
        event.pointerType !== "touch" &&
        document.activeElement !== event.currentTarget
      )
        introduce(null);
    },
    onFocus: () => introduce(pet),
    onBlur: () => introduce(null),
    onClick: () => introduce(pet),
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === "Escape") introduce(null);
    },
    "aria-describedby": active === pet ? bubbleId : undefined,
  });

  return (
    <div className="role-mascots" ref={root}>
      <div className="pet-track">
        <div className="pet-carrier pet-carrier--codex">
          <button
            type="button"
            className="pet-player pet-player--codex"
            aria-label="Meet Codex"
            {...petProps("codex")}
          >
            <svg
              aria-hidden="true"
              className="role-mascot role-mascot--codex"
              viewBox="52 51 165 196"
            >
              <defs>
                <filter id={cutout} colorInterpolationFilters="sRGB">
                  <feColorMatrix
                    type="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  6 6 6 0 -0.5"
                  />
                </filter>
              </defs>
              <image
                filter={`url(#${cutout})`}
                href="/images/mascots/codex-reference.png"
                width="278"
                height="278"
              />
              <rect
                className="codex-eyelids"
                x="108"
                y="117"
                width="74"
                height="35"
                rx="5"
                fill="#23366a"
              />
            </svg>
          </button>
        </div>
        <div className="pet-carrier pet-carrier--claude">
          <button
            type="button"
            className="pet-player pet-player--claude"
            aria-label="Meet Claude Code"
            {...petProps("claude")}
          >
            <svg
              aria-hidden="true"
              className="role-mascot role-mascot--claude"
              viewBox="0 4.5 24 15"
              shapeRendering="crispEdges"
            >
              <path
                fill="#D97757"
                d="M21 10.5h3v3h-3v3h-1.5v3H18v-3h-1.5v3H15v-3H9v3H7.5v-3H6v3H4.5v-3H3v-3H0v-3h3v-6h18Z"
              />
              <g fill="#080a0b">
                <rect
                  className="mascot-eye"
                  x="6"
                  y="7.5"
                  width="1.5"
                  height="3"
                />
                <rect
                  className="mascot-eye"
                  x="16.5"
                  y="7.5"
                  width="1.5"
                  height="3"
                />
              </g>
            </svg>{" "}
          </button>
        </div>
      </div>
      {active && (
        <div className="pet-bubble" id={bubbleId} role="tooltip">
          <strong>I’m {active === "codex" ? "Codex" : "Claude Code"}.</strong>
          <span>
            Nachiketh’s favourite model is{" "}
            {active === "codex" ? "Astra" : "Haiku"} on high.
          </span>
        </div>
      )}
    </div>
  );
}
