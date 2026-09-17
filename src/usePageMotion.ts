import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(useGSAP, ScrollTrigger);
export function usePageMotion(key?: string) {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const headings = scope.current?.querySelectorAll(
          ".page-heading h1, .case-heading h1, .article-heading h1",
        );
        if (headings?.length)
          gsap.from(headings, {
            y: 35,
            opacity: 0,
            duration: 0.85,
            ease: "power3.out",
            delay: 0.2,
          });
        scope.current?.querySelectorAll("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            y: 36,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          });
        });
      });
      let active = true;
      document.fonts.ready.then(() => {
        if (active) ScrollTrigger.refresh();
      });
      return () => {
        active = false;
        mm.revert();
      };
    },
    { scope, dependencies: [key], revertOnUpdate: true },
  );
  return scope;
}
