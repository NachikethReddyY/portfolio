import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { RenderBoundary } from "./RenderBoundary";
const ConnectShader = lazy(() => import("./ConnectShader"));

export function ConnectAtmosphere() {
  const host = useRef<HTMLDivElement>(null);
  const [nearby, setNearby] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionAllowed(!media.matches);
    update();
    media.addEventListener("change", update);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearby(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" },
    );
    if (host.current) observer.observe(host.current);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
    };
  }, []);
  return (
    <div className="connect-atmosphere" ref={host} aria-hidden="true">
      <div className="connect-atmosphere-poster" />
      {nearby && motionAllowed && (
        <RenderBoundary fallback={null}>
          <Suspense fallback={null}>
            <ConnectShader />
          </Suspense>
        </RenderBoundary>
      )}
    </div>
  );
}
