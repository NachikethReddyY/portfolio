import {
  lazy,
  Suspense,
  useRef,
  useCallback,
  useReducer,
  useEffect,
} from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContent, localContent } from "../content/store";
import { Arrow } from "../components/Icons";
import { Socials } from "../components/Layout";
import { ProjectCard } from "./Projects";
import { ArticleRow } from "./Writing";
import { AppIcon, projectedApps, additionalTools } from "../components/AppIcon";
import { RoleMascots } from "../components/RoleMascots";
import { AIRole } from "../components/AIRole";
import { advanceEntrance, initialEntrance } from "../lib/heroEntrance";
import { CodeRole } from "../components/CodeRole";
import { FineTuneTerm } from "../components/FineTuneTerm";
import { RabbitHole } from "../components/RabbitHole";
import { LocalModelDemo } from "../components/LocalModelDemo";
import { MarkOneDemo } from "../components/MarkOneDemo";
import { RenderBoundary } from "../components/RenderBoundary";
const LaptopScene = lazy(() => import("../components/LaptopScene"));
const laptopFallback = (
  <div className="laptop-scene">
    <img
      className="laptop-fallback"
      src="/models/laptop-fallback.webp"
      alt=""
    />
  </div>
);
gsap.registerPlugin(ScrollTrigger, useGSAP);
export default function Home() {
  const { profile, projects, articles, experience } = useContent();
  const storyArticle =
    articles.find((article) => article.slug === "fleet-a-working-system") ??
    articles[0];
  const latestArticles = storyArticle
    ? [
        storyArticle,
        ...articles.filter((article) => article.slug !== storyArticle.slug),
      ].slice(0, 3)
    : [];
  const baseSkills = profile.tools ?? localContent.profile.tools ?? [];
  const skills = [
    ...baseSkills.map((tool) =>
      tool.id === "swift" ? { ...tool, name: "Swift" } : tool,
    ),
    ...additionalTools.filter(
      (tool) => !baseSkills.some((skill) => skill.id === tool.id),
    ),
  ].filter((tool) => !["gsap", "blender", "go", "mongodb"].includes(tool.id));
  const toolOrder = [
    "typescript",
    "react",
    "python",
    "express",
    "foundationmodels",
    "tailwindcss",
    "tanstack",
    "nodedotjs",
    "nextdotjs",
    "drizzle",
    "prisma",
    "postgresql",
    "supabase",
    "swift",
    "swiftui",
    "coreml",
    "vision",
    "mlx",
    "lmstudio",
    "ollama",
    "claudecode",
    "codex",
    "vscode",
    "ghostty",
    "xcode",
    "orbstack",
    "vite",
    "expo",
    "git",
    "docker",
    "mysql",
    "javascript",
    "html5",
    "css",
  ];
  skills.sort(
    (a, b) =>
      (toolOrder.indexOf(a.id) < 0 ? 29 : toolOrder.indexOf(a.id)) -
      (toolOrder.indexOf(b.id) < 0 ? 29 : toolOrder.indexOf(b.id)),
  );
  const lessUsed = new Set([
    "nextdotjs",
    "ollama",
    "html5",
    "css",
    "javascript",
    "mysql",
    "expo",
    "claudecode",
    "vision",
    "coreml",
    "foundationmodels",
    "supabase",
  ]);
  // Keep de-emphasized tools together so the active stack has no visual holes.
  skills.sort(
    (a, b) => Number(lessUsed.has(a.id)) - Number(lessUsed.has(b.id)),
  );
  const contributions =
    profile.contributions ?? localContent.profile.contributions ?? [];
  const root = useRef<HTMLDivElement>(null);
  const [entranceState, sendEntrance] = useReducer(
    advanceEntrance,
    initialEntrance,
  );
  const { phase, fallback } = entranceState;
  const laptopOpened = phase === "complete";
  const onLaptopOpen = useCallback(() => sendEntrance("opened"), []);
  const onLaptopReady = useCallback(() => sendEntrance("ready"), []);
  const onLaptopFailure = useCallback(() => sendEntrance("failed"), []);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const skip = () => {
      if (motion.matches) sendEntrance("skip");
    };
    skip();
    motion.addEventListener("change", skip);
    return () => motion.removeEventListener("change", skip);
  }, []);
  useEffect(() => {
    if (entranceState.ready) return;
    // A rejected lazy chunk or slow GPU must never hold the hero content indefinitely.
    const timeout = window.setTimeout(() => sendEntrance("failed"), 6000);
    return () => window.clearTimeout(timeout);
  }, [entranceState.ready]);
  useEffect(() => {
    if (phase === "complete") return;
    // Recover even when a rendered model's animation callback is interrupted.
    const timeout = window.setTimeout(() => sendEntrance("failed"), 10000);
    return () => window.clearTimeout(timeout);
  }, [phase]);
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (phase === "outline") {
        gsap
          .timeline({ onComplete: () => sendEntrance("outlined") })
          .fromTo(
            ".hero-outline rect",
            { strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              autoRound: false,
              duration: 0.4,
              ease: "power2.inOut",
            },
          )
          .to(".hero-outline rect", {
            strokeDashoffset: -1,
            autoRound: false,
            duration: 0.25,
            delay: 0.05,
            ease: "power2.inOut",
          });
      } else if (phase === "laptop") {
        gsap.to(".hero-closed-poster", { opacity: 0, duration: 0.25 });
        gsap.fromTo(
          ".laptop-scene:not(.hero-closed-poster)",
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.25,
            onComplete: () => sendEntrance("shown"),
          },
        );
      } else if (phase === "opening" || (phase === "complete" && fallback)) {
        gsap.fromTo(
          ".hero-person,.hero-bottom,.hero-foot",
          { opacity: 0 },
          { opacity: 1, duration: 0.45, stagger: 0.08, delay: 0.35 },
        );
      }
    },
    { scope: root, dependencies: [phase, fallback], revertOnUpdate: true },
  );
  useGSAP(
    () => {
      if (
        !laptopOpened ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;
      const studio = root.current?.querySelector<HTMLElement>(".hero-studio");
      if (!studio) return;
      const origin = studio.getBoundingClientRect();
      const stickers = [...studio.querySelectorAll<HTMLElement>(".hero-app")];
      const offsets = stickers.map((el) => {
        const box = el.getBoundingClientRect();
        return {
          x: origin.left + origin.width * 0.5 - box.left - box.width / 2,
          y: origin.top + origin.height * 0.58 - box.top - box.height / 2,
        };
      });
      const entrance = gsap.from(stickers, {
        x: (i) => offsets[i].x,
        y: (i) => offsets[i].y,
        scale: 0.12,
        autoAlpha: 0,
        rotation: 0,
        duration: 0.65,
        stagger: 0.035,
        ease: "back.out(1.1)",
      });
      const movers = stickers.map((el) => ({
        el,
        x: gsap.quickTo(el, "x", { duration: 0.65, ease: "power2.out" }),
        y: gsap.quickTo(el, "y", { duration: 0.65, ease: "power2.out" }),
      }));
      const move = (event: PointerEvent) => {
        if (
          event.pointerType !== "mouse" ||
          entrance.isActive() ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        )
          return;
        const box = studio.getBoundingClientRect();
        const px = (event.clientX - box.left) / box.width - 0.5;
        const py = (event.clientY - box.top) / box.height - 0.5;
        movers.forEach(({ el, x, y }) => {
          const icon = el.getBoundingClientRect();
          const side =
            icon.left + icon.width / 2 < box.left + box.width / 2 ? -1 : 1;
          // Move outwards with the laptop's tilt; never pull a sticker into its screen.
          x(side * Math.abs(px) * 22);
          y(-Math.abs(py) * 14);
        });
      };
      const reset = () => {
        if (!entrance.isActive())
          movers.forEach(({ x, y }) => {
            x(0);
            y(0);
          });
      };
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );
      const respectMotion = () => {
        if (!reducedMotion.matches) return;
        entrance.kill();
        movers.forEach(({ x, y }) => {
          x.tween.kill();
          y.tween.kill();
        });
        gsap.set(stickers, { clearProps: "transform,opacity,visibility" });
      };
      reducedMotion.addEventListener("change", respectMotion);
      studio.addEventListener("pointermove", move);
      studio.addEventListener("pointerleave", reset);
      return () => {
        reducedMotion.removeEventListener("change", respectMotion);
        studio.removeEventListener("pointermove", move);
        studio.removeEventListener("pointerleave", reset);
        movers.forEach(({ x, y }) => {
          x.tween.kill();
          y.tween.kill();
        });
      };
    },
    { scope: root, dependencies: [laptopOpened] },
  );
  useGSAP(
    () => {
      const mm = gsap.matchMedia(root);
      // Keep the static page readable until the browser can paint animations.
      const frame = requestAnimationFrame(() => {
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          root.current
            ?.querySelectorAll<HTMLElement>("[data-reveal]")
            .forEach((el) =>
              gsap.from(el, {
                y: 38,
                opacity: 0,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 91%", once: true },
              }),
            );
          const about =
            root.current?.querySelector<HTMLElement>(".hello-section");
          if (about) {
            // Translate the whole hero behind the opaque story, without DOM reparenting.
            gsap.to(".story-hero", {
              y: () =>
                about.getBoundingClientRect().top -
                (root.current?.getBoundingClientRect().top ?? 0),
              ease: "none",
              scrollTrigger: {
                trigger: root.current,
                start: "top top",
                endTrigger: about,
                end: "top top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            });
            const handoff = gsap.timeline({
              scrollTrigger: {
                trigger: about,
                start: "top 95%",
                end: "top 5%",
                scrub: true,
              },
            });
            handoff
              .fromTo(
                ".hello-word",
                { x: -120, y: 65, opacity: 0 },
                { x: 0, y: 0, opacity: 1, duration: 0.35 },
              )
              .fromTo(
                ".hello-intro, .hello-name",
                { x: 90, y: 45, opacity: 0 },
                { x: 0, y: 0, opacity: 1, duration: 0.4, stagger: 0.12 },
                0.15,
              )
              .fromTo(
                ".hello-portrait",
                { y: 100, rotation: -8, scale: 0.93, opacity: 0 },
                { y: 0, rotation: 3, scale: 1, opacity: 1, duration: 0.4 },
                0.4,
              );
            gsap.fromTo(
              ".hello-copy > .section-index",
              { opacity: 0 },
              {
                opacity: 1,
                scrollTrigger: {
                  trigger: about,
                  start: "top 45%",
                  end: "top 20%",
                  scrub: true,
                },
              },
            );
            // Supporting details wait for the portrait, then unfold over more scroll.
            const details = gsap.utils.toArray<HTMLElement>(".hello-detail");
            if (window.matchMedia("(min-width: 701px)").matches) {
              gsap.fromTo(
                details,
                { y: 35, autoAlpha: 0 },
                {
                  y: 0,
                  autoAlpha: 1,
                  stagger: 0.16,
                  ease: "none",
                  scrollTrigger: {
                    trigger: about,
                    start: "top 20%",
                    end: "top -15%",
                    scrub: true,
                  },
                },
              );
            } else {
              details.forEach((detail) =>
                gsap.fromTo(
                  detail,
                  { y: 25, autoAlpha: 0 },
                  {
                    y: 0,
                    autoAlpha: 1,
                    ease: "none",
                    scrollTrigger: {
                      trigger: detail,
                      start: "top 90%",
                      end: "top 65%",
                      scrub: true,
                    },
                  },
                ),
              );
            }
          }
          root.current
            ?.querySelectorAll<HTMLElement>(".journey-item")
            .forEach((el) => {
              gsap.from(el, {
                x: -28,
                autoAlpha: 0,
                duration: 0.7,
                scrollTrigger: {
                  trigger: el,
                  start: "top 86%",
                  toggleActions: "play none none reverse",
                },
              });
            });
          root.current
            ?.querySelectorAll<HTMLElement>(".project-reveal")
            .forEach((el) => {
              gsap.fromTo(
                el,
                { y: 45, autoAlpha: 0 },
                {
                  y: 0,
                  rotation: 0,
                  autoAlpha: 1,
                  duration: 0.85,
                  ease: "power3.out",
                  scrollTrigger: {
                    trigger: el,
                    start: "top 88%",
                    toggleActions: "play none none reverse",
                  },
                },
              );
            });
          const updateWorkGap = () =>
            gsap.set(".home-work .project-grid", {
              marginTop: () =>
                -innerHeight * 0.78 +
                (root.current?.querySelector<HTMLElement>(
                  ".work-stage .section-header",
                )?.offsetHeight ?? 240) /
                  2 +
                64,
            });
          updateWorkGap();
          const work = gsap.timeline({
            scrollTrigger: {
              trigger: ".work-stage",
              onRefreshInit: updateWorkGap,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
          work
            .fromTo(
              ".work-title",
              { autoAlpha: 0, scale: 0.65, y: 35 },
              {
                autoAlpha: 1,
                scale: 1,
                y: 0,
                duration: 0.2,
                ease: "back.out(1.4)",
              },
            )
            .fromTo(
              ".work-stage p",
              { autoAlpha: 0, y: 15 },
              { autoAlpha: 1, y: 0, duration: 0.15 },
            )
            .to({}, { duration: 0.55 })
            .to(".work-stage .section-header", {
              y: () => -innerHeight * 0.28,
              duration: 0.35,
              ease: "power2.inOut",
            })
            .fromTo(
              ".work-stage .inline-link",
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 0.15 },
            )
            .fromTo(
              ".home-work .project-grid",
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 0.35 },
              0.9,
            );
          const word = root.current?.querySelector<HTMLElement>(".models-word");
          const destination = root.current?.querySelector<HTMLElement>(
            ".models-destination",
          );
          if (word && destination) {
            gsap.set(word, { x: 0, y: 0, scale: 1 });
            const anchor = word.parentElement!;
            const handoff = { progress: 0 };
            const positionWord = () => {
              const source = anchor.getBoundingClientRect();
              const target = destination.getBoundingClientRect();
              gsap.set(word, {
                x: (target.left - source.left) * handoff.progress,
                y: (target.top - source.top) * handoff.progress,
                scale:
                  1 +
                  (destination.offsetWidth / word.offsetWidth - 1) *
                    handoff.progress,
              });
            };
            const travel = gsap.timeline({
              scrollTrigger: {
                trigger: ".learning-transition",
                start: "top top",
                end: "bottom 20%",
                scrub: true,
                invalidateOnRefresh: true,
                onUpdate: positionWord,
              },
            });
            travel
              .fromTo(
                ".learning-transition-copy > p",
                { autoAlpha: 0, y: 20 },
                { autoAlpha: 1, y: 0, duration: 0.2 },
              )
              .fromTo(
                ".learning-transition-copy > h2, .learning-transition-copy > span",
                { autoAlpha: 0, y: 25 },
                { autoAlpha: 1, y: 0, duration: 0.3 },
              )
              .to({}, { duration: 0.55 })
              .to(".models-lead", {
                opacity: 0,
                filter: "blur(10px)",
                duration: 0.25,
              })
              .to({}, { duration: 0.25 })
              .to(handoff, {
                progress: 1,
                duration: 0.65,
                ease: "power2.inOut",
                onUpdate: positionWord,
              })
              .set(word, { visibility: "hidden" })
              .fromTo(
                destination,
                { visibility: "hidden" },
                { visibility: "visible", duration: 0.01 },
              )
              .fromTo(
                ".ai-section > .shell > .ai-intro > h2 > em, .ai-after-models",
                { autoAlpha: 0, y: 30 },
                { autoAlpha: 1, y: 0, duration: 0.3 },
              );
          }
          gsap
            .timeline({
              scrollTrigger: {
                trigger: ".home-writing",
                start: "top 75%",
                end: "top 15%",
                scrub: true,
              },
            })
            .fromTo(
              ".story-article",
              { y: 20, scale: 1 },
              { y: 0, scale: 1, duration: 0.7, ease: "power2.inOut" },
            )
            .fromTo(
              ".writing-heading",
              { autoAlpha: 0, y: 20 },
              { autoAlpha: 1, y: 0, duration: 0.3 },
              0,
            );
          gsap.from(".local-workspace", {
            y: 65,
            opacity: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: ".local-workspace",
              start: "top 85%",
              once: true,
            },
          });
          gsap.from(".tool-grid", {
            y: 35,
            duration: 0.7,
            scrollTrigger: {
              trigger: ".tool-grid",
              start: "top 85%",
              once: true,
            },
          });
        });
      });
      let alive = true;
      document.fonts.ready.then(() => {
        if (alive) ScrollTrigger.refresh();
      });
      return () => {
        alive = false;
        cancelAnimationFrame(frame);
        mm.revert();
      };
    },
    { scope: root },
  );
  return (
    <div ref={root} className="home-page">
      <section
        className="story-hero shell"
        aria-labelledby="hero-heading"
        data-entrance={import.meta.env.SSR ? "complete" : phase}
      >
        {phase === "outline" && !import.meta.env.SSR && (
          <svg
            className="hero-outline"
            viewBox="0 0 600 360"
            aria-hidden="true"
          >
            <rect x="2" y="2" width="596" height="356" rx="18" pathLength="1" />
          </svg>
        )}
        <div className={`hero-studio ${laptopOpened ? "is-open" : ""}`}>
          {(phase === "waiting" || phase === "laptop") &&
            !import.meta.env.SSR && (
              <div
                className="laptop-scene hero-closed-poster"
                aria-hidden="true"
              >
                <img
                  className="laptop-fallback"
                  src="/models/laptop-closed.webp"
                  alt=""
                />
              </div>
            )}
          <div className="hero-person">
            <div>
              <p className="identity-name">{profile.name}</p>
              <p className="identity-location">{profile.location} · UTC+8</p>
              <p className="hero-availability">
                <span className="availability-dot" />
                {profile.availability}
              </p>
            </div>
          </div>
          <ul className="hero-apps" aria-label="Development and AI tools">
            {projectedApps.map((app) => (
              <li className={"hero-app hero-app--" + app.id} key={app.id}>
                <AppIcon id={app.id} />
                <span>{app.name}</span>
              </li>
            ))}
          </ul>
          <RenderBoundary fallback={laptopFallback}>
            <Suspense fallback={laptopFallback}>
              {import.meta.env.SSR || fallback ? (
                laptopFallback
              ) : (
                <LaptopScene
                  open={phase === "opening" || phase === "complete"}
                  onReady={onLaptopReady}
                  onFailure={onLaptopFailure}
                  onOpen={onLaptopOpen}
                />
              )}
            </Suspense>
          </RenderBoundary>
        </div>
        <div className="hero-bottom">
          <div className="hero-roles">
            <div className="hero-aspiration-stage">
              <RoleMascots />
              <AIRole aspiration={profile.aspiration} />
            </div>
            <h1 id="hero-heading" tabIndex={-1}>
              <CodeRole role={profile.role} />
            </h1>
          </div>
          <div className="hero-actions">
            <Link className="button-primary" to="/projects">
              View projects <Arrow />
            </Link>
          </div>
        </div>
        <div className="hero-foot">
          <Socials />
        </div>
      </section>
      <div className="home-story">
        <section id="about" className="hello-section shell">
          <div className="hello-word" aria-hidden="true">
            hello<span>!</span>
          </div>
          <div className="hello-grid">
            <div className="hello-portrait">
              <img
                src="/images/nachiketh-sketch.webp"
                alt="Illustrated portrait of Nachiketh Reddy"
                loading="lazy"
              />
              <span className="portrait-caption">
                The person behind the projects.
              </span>
            </div>
            <div className="hello-copy">
              <p className="section-index">About me</p>
              <h2>
                <span className="hello-intro">I’m</span>{" "}
                <span className="hello-name">Nachiketh.</span>
              </h2>
              <p className="hello-detail hello-study">
                IT student at Singapore Polytechnic.
              </p>
              <p className="hello-detail">
                {(profile.about ?? localContent.profile.about)?.replace(
                  /^I’m Nachiketh, an IT student at Singapore Polytechnic\.\s*/,
                  "",
                )}
              </p>
              <p className="hello-detail">
                {(profile.personal ?? localContent.profile.personal)
                  ?.replace(", occasionally on a kart track", "")
                  .replace(
                    " and help organise the National Software Competition 2026",
                    "",
                  )}
              </p>
              <Link className="inline-link hello-detail" to="/writing">
                Read my writing <Arrow />
              </Link>
            </div>
          </div>
        </section>
        <section className="stack-section shell">
          <div className="section-header" data-reveal>
            <div>
              <p className="section-index">My everyday tools</p>
              <h2>
                The stack
                <br />
                <em>behind the work.</em>
              </h2>
            </div>
          </div>
          <p className="stack-tip">
            <span aria-hidden="true">↙</span> Hover to see the stack I actually
            use day to day.
          </p>
          <div
            className="stack-groups"
            tabIndex={0}
            aria-label="Technology stack. Hover or focus to highlight everyday tools."
          >
            {[
              {
                name: "Web development",
                ids: [
                  "typescript",
                  "react",
                  "express",
                  "tailwindcss",
                  "tanstack",
                  "nodedotjs",
                  "nextdotjs",
                  "drizzle",
                  "prisma",
                  "postgresql",
                  "supabase",
                  "vite",
                  "mysql",
                  "javascript",
                  "html5",
                  "css",
                ],
              },
              {
                name: "App development",
                ids: ["swift", "swiftui", "expo", "xcode"],
              },
              {
                name: "AI",
                ids: [
                  "python",
                  "mlx",
                  "lmstudio",
                  "ollama",
                  "foundationmodels",
                  "coreml",
                  "vision",
                  "claudecode",
                  "codex",
                ],
              },
            ].map((group) => (
              <section
                className="stack-group"
                key={group.name}
                aria-label={group.name}
              >
                <h3 className="stack-group-label">{group.name}</h3>
                <div className="tool-grid">
                  {skills
                    .filter(
                      (skill) =>
                        group.ids.includes(skill.id) && !lessUsed.has(skill.id),
                    )
                    .map((skill) => (
                      <article
                        className={`tool-item${lessUsed.has(skill.id) ? " tool-item--older" : ""}`}
                        key={skill.id}
                        tabIndex={lessUsed.has(skill.id) ? 0 : undefined}
                      >
                        <AppIcon id={skill.id} />
                        <h4>{skill.name}</h4>
                      </article>
                    ))}
                </div>
              </section>
            ))}
            <div className="stack-older" aria-label="Previously used tools">
              {skills
                .filter((skill) => lessUsed.has(skill.id))
                .map((skill) => (
                  <article
                    className="tool-item tool-item--older"
                    key={skill.id}
                    tabIndex={0}
                  >
                    <AppIcon id={skill.id} />
                    <h4>{skill.name}</h4>
                  </article>
                ))}
            </div>
            <p className="stack-tools-label">Tools that I use</p>
            <div className="stack-shared" aria-label="Shared development tools">
              {skills
                .filter((skill) =>
                  ["vscode", "ghostty", "orbstack", "git", "docker"].includes(
                    skill.id,
                  ),
                )
                .map((skill) => (
                  <article className="tool-item" key={skill.id}>
                    <AppIcon id={skill.id} />
                    <h4>{skill.name}</h4>
                  </article>
                ))}
            </div>
          </div>
        </section>
        <section className="journey-section shell">
          <div className="section-header" data-reveal>
            <h2>Education</h2>
          </div>
          <div className="journey-list">
            {experience
              .filter((item) => item.kind === "Education")
              .map((item) => (
                <article className="journey-item" key={item.id}>
                  <div>
                    <img
                      className="school-logo"
                      src="/icons/organizations/sp.png"
                      alt="Singapore Polytechnic logo"
                    />
                    <span className="journey-kind">{item.organization}</span>
                    <p>{item.period}</p>
                  </div>
                  <div>
                    <h3>{item.title}</h3>

                    <p>{item.description}</p>
                  </div>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${item.organization}`}
                    >
                      <Arrow diagonal />
                    </a>
                  )}
                </article>
              ))}
          </div>
          <details className="education-details">
            <summary>
              Beyond the classroom <span aria-hidden="true">＋</span>
            </summary>
            {experience
              .filter((item) => item.kind !== "Education")
              .map((item) => (
                <article key={item.id}>
                  <img
                    className="organization-logo"
                    src={
                      item.organization.includes("Apple")
                        ? "/icons/organizations/ads.png"
                        : "/icons/organizations/autodesk.svg"
                    }
                    alt={`${item.organization} logo`}
                  />
                  <p>
                    {item.organization} · {item.period}
                  </p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {item.url && (
                    <a
                      className="inline-link"
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn more <Arrow diagonal />
                    </a>
                  )}
                </article>
              ))}
          </details>
        </section>
        <section id="work" className="home-work shell">
          <div className="work-stage">
            <div className="work-sticky">
              <div className="section-header">
                <div>
                  <h2 className="work-title">
                    Work<span>.</span>
                  </h2>
                  <p>Some of the things I’ve been building.</p>
                </div>
                <Link className="inline-link" to="/projects">
                  All projects <Arrow />
                </Link>
              </div>
            </div>
          </div>
          <div className="project-grid">
            {projects
              .filter((p) => p.featured && p.category === "Web applications")
              .slice(0, 4)
              .map((project, i) => (
                <div className="project-reveal" key={project.slug}>
                  <ProjectCard project={project} index={i} />
                </div>
              ))}
          </div>
        </section>
        <section className="contributions shell">
          <div className="section-header" data-reveal>
            <h2>
              I love contributing to
              <br />
              <em>open source when I can.</em>
            </h2>
          </div>
          <div className="contribution-apps">
            {contributions.map((c, i) => (
              <a
                key={c.name}
                href={`${c.href.split("/pull/")[0]}/pulls?q=${encodeURIComponent("is:pr author:NachikethReddyY")}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${c.name}: my pull requests on GitHub`}
              >
                <img
                  src={`/icons/apps/${i === 0 ? "t3-code" : "vorssaint"}-small.webp`}
                  alt=""
                  width="120"
                  height="120"
                />
                <h3>{c.name}</h3>
                <span>
                  My pull requests <Arrow diagonal />
                </span>
              </a>
            ))}
          </div>
        </section>
        <section
          className="learning-transition shell"
          aria-label="From web development to AI"
        >
          <div className="models-sticky">
            <div className="learning-transition-copy">
              <p className="models-lead">It started with web apps.</p>
              <h2>
                <span className="models-lead">Now I’m exploring</span>
                <br />
                <em>
                  <span className="models-lead">how </span>
                  <span className="models-anchor">
                    <span className="models-word">Models</span>
                  </span>
                  <span className="models-lead"> work.</span>
                </em>
              </h2>
              <span className="models-lead" aria-hidden="true">
                ↓
              </span>
            </div>
          </div>
        </section>
        <section id="ai" className="ai-section">
          <div className="shell">
            <div className="ai-intro">
              <h2>
                <span className="models-destination">Models</span>
                <br />
                <em>on my own computer.</em>
              </h2>
            </div>
            <div className="ai-after-models">
              <div className="local-origin">
                <div className="local-origin-copy" data-reveal>
                  <p className="story-date">November 2024</p>
                  <h3>It started with Ollama.</h3>
                  <p>
                    I could run local models on my computer, without a paid chat
                    subscription. Trying a few models quickly turned into
                    something I wanted to understand.
                  </p>
                  <p>
                    It started with a simple experiment: could I do this on my
                    own computer? Soon I wanted more than just a place to run a
                    model.
                  </p>
                </div>
                <LocalModelDemo />
              </div>
              <ol
                className="local-evolution"
                aria-label="My local-model timeline"
              >
                <li data-reveal>
                  <span className="evolution-number">01</span>
                  <h3>Ollama was only the beginning.</h3>
                  <p>
                    I tried Open WebUI next. Running a model was one thing;
                    finding an interface I wanted to use every day was another.
                  </p>
                  <span className="evolution-app">Open WebUI</span>
                </li>
                <li data-reveal>
                  <span className="evolution-number">02</span>
                  <AppIcon id="lmstudio" />
                  <h3>Then came LM Studio.</h3>
                  <p>
                    I kept experimenting with local models and made LM Studio
                    part of my workflow.
                  </p>
                </li>
                <li data-reveal>
                  <span className="evolution-number">03</span>
                  <AppIcon id="mlx" />
                  <h3>A Mac opened another door.</h3>
                  <p>
                    After switching to Mac, I discovered MLX. Now I wanted to
                    understand what was happening underneath the chat.
                  </p>
                </li>
              </ol>
              <RabbitHole />
              <div className="ai-chapter teaching-chapter">
                <h3 className="teaching-destination">
                  <span>Learning to</span> <span>teach a model.</span>
                </h3>
                <p>
                  Running models made me want to understand how they learn. I
                  started learning to <FineTuneTerm /> models, which took me
                  deeper into Python, training data, and MLX on Apple silicon.
                </p>
                <p>
                  One earlier experiment is on Hugging Face: my{" "}
                  <a
                    className="text-link"
                    href="https://huggingface.co/nachikethreddyy/qwen3.5-8b-distilled-MLX"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Qwen coding fine-tune
                  </a>
                  . I’m still learning how to train and evaluate these models.
                </p>
                <div className="ai-tool-pair">
                  <span>
                    <AppIcon id="python" />
                    Python
                  </span>
                  <span>
                    <AppIcon id="mlx" />
                    MLX
                  </span>
                  <span>
                    <AppIcon id="lmstudio" />
                    LM Studio
                  </span>
                </div>
                <Link className="inline-link" to="/projects/qwen3-distill">
                  Inside my fine-tuning experiments <Arrow />
                </Link>
              </div>
              <div className="ai-intro ai-specialists" data-reveal>
                <p>
                  After <strong className="months-highlight">six months</strong>{" "}
                  of running local agents, I realized something.
                </p>
                <h2>
                  One model can’t
                  <br />
                  <em>do everything.</em>
                </h2>
                <p>
                  What if I trained smaller models for specific tasks, then ran
                  them together as agents on the same computer?
                </p>
              </div>
              <MarkOneDemo />
              <div className="legion-story">
                <p data-reveal>
                  The goal is to give each specialist a clear job, then make
                  their handoffs reliable. Less overhead, useful results, and a
                  setup I can understand.
                </p>
                <h3 data-reveal>
                  Smaller specialists.
                  <br />
                  <em>A stronger team.</em>
                </h3>
                <p data-reveal>
                  That’s the idea behind <strong>Legion</strong>: different
                  models for different stages of a task, small enough to run
                  several on the same computer.
                </p>
                <p data-reveal>
                  I’m exploring whether a 2B specialist can outperform a 30B
                  generalist at one task. That’s the experiment—not a benchmark
                  result yet.
                </p>
                <p className="legion-status" data-reveal>
                  I’m currently preparing training data for model training.
                </p>
                <p data-reveal>
                  With two friends, I’m building LAH to explore tool calls,
                  memory, and that coordination.
                </p>
                <p data-reveal>
                  Legion will work with our custom harness, currently codenamed{" "}
                  <a
                    className="text-link"
                    href="https://github.com/NachikethReddyY/LAH"
                    target="_blank"
                    rel="noreferrer"
                  >
                    LAH (Local Agent Harness)
                  </a>
                  .
                  <span className="repository-note">
                    GitHub repository is currently private.
                  </span>
                </p>
                <div className="legion-links" data-reveal>
                  <Link className="inline-link" to="/projects/qwen3-distill">
                    Fine-tuning experiments <Arrow />
                  </Link>
                </div>
                <p className="writing-bridge">
                  Explore more in my{" "}
                  <a className="text-link" href="#latest-writing">
                    writing <Arrow />
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="home-writing shell">
          <div id="latest-writing" className="section-header writing-heading">
            <div>
              <h2>
                Latest writing<span>.</span>
              </h2>
            </div>
            <Link className="inline-link" to="/writing">
              All writing <Arrow />
            </Link>
          </div>
          {latestArticles.map((article, index) => (
            <div
              key={article.slug}
              className={index === 0 ? "story-article" : undefined}
              data-reveal={index > 0 ? "" : undefined}
            >
              <ArticleRow article={article} index={index} />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
