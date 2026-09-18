import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import type { Location } from "react-router-dom";
import gsap from "gsap";

export default function PageTransition({
  children,
}: {
  children: (location: Location) => ReactNode;
}) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [displayed, setDisplayed] = useState(location);
  const cover = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const positions = useRef(new Map<string, number>());
  const latest = useRef(location);
  latest.current = location;
  const navigation = useRef(navigationType);
  navigation.current = navigationType;
  const first = useRef(true);
  const covered = useRef(false);
  const motion = useRef<gsap.core.Timeline | null>(null);
  const previousLocation = useRef(location);
  useEffect(() => {
    const previous = history.scrollRestoration;
    history.scrollRestoration = "manual";
    return () => {
      history.scrollRestoration = previous;
    };
  }, []);
  useEffect(() => {
    const save = () => positions.current.set(displayed.key, window.scrollY);
    window.addEventListener("scroll", save, { passive: true });
    return () => {
      save();
      window.removeEventListener("scroll", save);
    };
  }, [displayed.key]);
  // One timeline owns the cover. Never revert it when the destination mounts.
  useLayoutEffect(() => {
    if (location.key === displayed.key) return;
    positions.current.set(displayed.key, window.scrollY);
    motion.current?.kill();
    const host = cover.current;
    const tiles = host?.querySelectorAll(".shutter-tile");
    const stamp = host?.querySelector(".route-stamp");
    if (
      !host ||
      !tiles ||
      !stamp ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      location.pathname === displayed.pathname
    ) {
      covered.current = false;
      if (host) {
        gsap.set(host, { visibility: "hidden" });
        host.classList.remove("is-active");
      }
      setDisplayed(location);
      return;
    }
    covered.current = true;
    host.classList.add("is-active");
    gsap.set(host, { visibility: "visible" });
    gsap.set(stamp, { opacity: 0, scale: 1.6, rotation: -18 });
    motion.current = gsap
      .timeline()
      .fromTo(
        tiles,
        { yPercent: 105, y: 0 },
        { yPercent: 0, duration: 0.56, stagger: 0.045, ease: "power3.inOut" },
      )
      .to(stamp, {
        opacity: 1,
        scale: 1,
        rotation: -7,
        duration: 0.28,
        ease: "back.out(1.5)",
      })
      .to({}, { duration: 0.16 })
      .call(() => setDisplayed(latest.current));
  }, [location.key]);
  useEffect(
    () => () => {
      motion.current?.kill();
    },
    [],
  );
  useLayoutEffect(() => {
    const wasFirst = first.current;
    first.current = false;
    const previous = previousLocation.current;
    const pathChanged = previous.pathname !== displayed.pathname;
    const queryOnly =
      !pathChanged &&
      previous.hash === displayed.hash &&
      previous.search !== displayed.search;
    previousLocation.current = displayed;
    // Filtering/searching replaces the current index state without moving the reader.
    if (queryOnly && navigation.current !== "POP") return;
    const frame = requestAnimationFrame(() => {
      let target: HTMLElement | null = null;
      try {
        if (displayed.hash)
          target = document.getElementById(
            decodeURIComponent(displayed.hash.slice(1)),
          );
      } catch {
        /* A malformed hash must not break navigation. */
      }
      if (target) {
        target.scrollIntoView({ behavior: "instant" });
        if (!wasFirst) {
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        }
      } else if (!wasFirst) {
        window.scrollTo({
          top:
            navigation.current === "POP"
              ? (positions.current.get(displayed.key) ?? 0)
              : 0,
          behavior: "instant",
        });
        if (pathChanged)
          content.current
            ?.querySelector<HTMLElement>("h1")
            ?.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [displayed.key, displayed.hash, displayed.pathname]);
  useLayoutEffect(() => {
    const host = cover.current;
    if (!host || !covered.current) return;
    const frame = requestAnimationFrame(() => {
      motion.current?.kill();
      motion.current = gsap
        .timeline({
          onComplete: () => {
            covered.current = false;
            gsap.set(host, { visibility: "hidden" });
            host.classList.remove("is-active");
          },
        })
        .to(".route-stamp", { opacity: 0, scale: 0.94, duration: 0.18 }, 0.12)
        .to(
          host.querySelectorAll(".shutter-tile"),
          {
            yPercent: -105,
            y: 0,
            duration: 0.6,
            stagger: { each: 0.04, from: "end" },
            ease: "power3.inOut",
          },
          0.25,
        );
    });
    return () => cancelAnimationFrame(frame);
  }, [displayed.key]);
  return (
    <>
      <div ref={content} className="route-content">
        {children(
          location.pathname === displayed.pathname ? location : displayed,
        )}
      </div>
      <div className="page-shutter" ref={cover} aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <div className="shutter-tile" key={i} />
        ))}
        <div className="route-stamp">
          <span className="stamp-monogram">
            N<span>↗</span>
          </span>
          <span>Nachiketh Reddy</span>
        </div>
      </div>
    </>
  );
}
