import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import type { Location } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);

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
  const oldPath = useRef(location.pathname);
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
  useGSAP(
    () => {
      if (location.key === displayed.key) return;
      positions.current.set(displayed.key, window.scrollY);
      const tiles = cover.current?.children;
      if (tiles) gsap.killTweensOf(tiles);
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduced || location.pathname === displayed.pathname || !tiles) {
        covered.current = false;
        gsap.set(cover.current, { visibility: "hidden" });
        setDisplayed(location);
        return;
      }
      covered.current = true;
      gsap.set(cover.current, { visibility: "visible" });
      gsap.fromTo(
        tiles,
        { yPercent: 105 },
        {
          yPercent: 0,
          duration: 0.38,
          stagger: { each: 0.03, from: "start" },
          ease: "power4.inOut",
          onComplete: () => setDisplayed(latest.current),
        },
      );
    },
    { scope: cover, dependencies: [location.key], revertOnUpdate: true },
  );
  useLayoutEffect(() => {
    const wasFirst = first.current;
    first.current = false;
    const pathChanged = oldPath.current !== displayed.pathname;
    oldPath.current = displayed.pathname;
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
  useGSAP(
    () => {
      if (!cover.current || !covered.current) return;
      const tiles = cover.current.children;
      gsap.killTweensOf(tiles);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(cover.current, { visibility: "hidden" });
        covered.current = false;
        return;
      }
      gsap.set(cover.current, { visibility: "visible" });
      gsap.to(tiles, {
        yPercent: -105,
        duration: 0.45,
        stagger: { each: 0.03, from: "end" },
        ease: "power4.inOut",
        onComplete: () => {
          covered.current = false;
          if (cover.current) gsap.set(cover.current, { visibility: "hidden" });
        },
      });
    },
    { scope: cover, dependencies: [displayed.key], revertOnUpdate: true },
  );
  return (
    <>
      <div ref={content} className="route-content">
        {children(displayed)}
      </div>
      <div className="page-shutter" ref={cover} aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i}>
            <span>{i === 2 ? "nr." : ""}</span>
          </div>
        ))}
      </div>
    </>
  );
}
