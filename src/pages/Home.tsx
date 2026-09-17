import { lazy, Suspense, useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContent, localContent } from "../content/store";
import { Arrow } from "../components/Icons";
import { Socials } from "../components/Layout";
import { ProjectCard } from "./Projects";
import { ArticleRow } from "./Writing";
const toolIcons = new Set([
  "typescript",
  "react",
  "python",
  "nodedotjs",
  "postgresql",
  "swift",
  "git",
  "docker",
  "nextdotjs",
  "ollama",
  "anthropic",
  "blender",
  "github",
]);
const LaptopScene = lazy(() => import("../components/LaptopScene"));
gsap.registerPlugin(ScrollTrigger, useGSAP);
export default function Home() {
  const { profile, projects, articles, experience } = useContent();
  const skills = profile.tools ?? localContent.profile.tools ?? [];
  const contributions =
    profile.contributions ?? localContent.profile.contributions ?? [];
  const roleWords = profile.role.split(" ");
  const roleLast = roleWords.pop();
  const aspiration = profile.aspiration.replace(/^Aspiring\s+/, "");
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .from(".hero-identity", { y: 20, opacity: 0, duration: 0.65 })
          .from(
            ".hero-title-line>span",
            { yPercent: 100, rotation: 3, duration: 0.95, stagger: 0.12 },
            0.1,
          )
          .from(
            ".hero-availability,.hero-actions",
            { y: 20, opacity: 0, duration: 0.7, stagger: 0.12 },
            0.5,
          )
          .from(
            ".scene-note",
            { y: 25, opacity: 0, scale: 0.9, duration: 0.8, stagger: 0.13 },
            0.9,
          );
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
        gsap.fromTo(
          ".hello-portrait",
          { rotation: -8, y: 50 },
          {
            rotation: 3,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: ".hello-section",
              start: "top bottom",
              end: "center center",
              scrub: 0.8,
            },
          },
        );
        gsap.fromTo(
          ".hello-word",
          { xPercent: -5 },
          {
            xPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: ".hello-section",
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );
        const workflow = gsap.timeline({
          scrollTrigger: {
            trigger: ".workflow-stage",
            start: "top 85%",
            end: "center 35%",
            scrub: 0.7,
          },
        });
        workflow
          .from(
            ".workflow-card--request",
            { x: 90, y: -20, rotation: 5, opacity: 0, duration: 1 },
            0,
          )
          .from(
            ".workflow-card--build",
            { x: -110, y: 50, rotation: -7, opacity: 0, duration: 1 },
            0.25,
          )
          .from(
            ".workflow-card--review",
            { y: 110, rotation: 6, opacity: 0, duration: 1 },
            0.5,
          );
        gsap.from(".tool-item", {
          y: 45,
          opacity: 0,
          stagger: 0.1,
          duration: 0.75,
          scrollTrigger: {
            trigger: ".tool-grid",
            start: "top 85%",
            once: true,
          },
        });
      });
      let alive = true;
      document.fonts.ready.then(() => {
        if (alive) ScrollTrigger.refresh();
      });
      return () => {
        alive = false;
        mm.revert();
      };
    },
    { scope: root },
  );
  return (
    <div ref={root} className="home-page">
      <section className="story-hero shell" aria-labelledby="hero-heading">
        <div className="hero-identity">
          <span className="identity-name">{profile.name}</span>
          <span>Based in {profile.location} · UTC+8</span>
        </div>
        <div className="story-hero-grid">
          <div className="story-hero-copy">
            <h1 id="hero-heading" tabIndex={-1}>
              <span className="hero-title-line">
                <span>{roleWords.join(" ")}</span>
              </span>
              <span className="hero-title-line">
                <span>
                  {roleLast}
                  <span className="warm">.</span>
                </span>
              </span>
            </h1>
            <p className="hero-aspiration">
              Aspiring <span>{aspiration}.</span>
            </p>
            <p className="hero-description">{profile.intro}</p>
            <p className="hero-availability">
              <span className="availability-dot" />
              {profile.availability}
            </p>
            <div className="hero-actions">
              <Link className="button-primary" to="/projects">
                Explore my work <Arrow />
              </Link>
              <a
                className="button-secondary"
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                Say hello <Arrow diagonal />
              </a>
            </div>
          </div>
          <div className="hero-studio">
            <Suspense
              fallback={
                <div className="laptop-scene">
                  <img
                    className="laptop-fallback"
                    src="/models/laptop-fallback.webp"
                    alt=""
                  />
                </div>
              }
            >
              {import.meta.env.SSR ? (
                <div className="laptop-scene">
                  <img
                    className="laptop-fallback"
                    src="/models/laptop-fallback.webp"
                    alt=""
                  />
                </div>
              ) : (
                <LaptopScene />
              )}
            </Suspense>
            <div className="scene-note scene-note--code">
              <span className="note-symbol">{"{ }"}</span>
              <div>
                <span>From idea</span>
                <strong>to working code.</strong>
              </div>
            </div>
            <div className="scene-note scene-note--ai">
              <span className="note-symbol">✳</span>
              <div>
                <span>Currently exploring</span>
                <strong>Agents & local AI</strong>
              </div>
            </div>
            <div className="scene-caption">
              <span className="tiny-line" /> Building. Breaking. Figuring it
              out.
            </div>
          </div>
        </div>
        <div className="hero-foot">
          <a href="#about">
            A little about me <span aria-hidden="true">↓</span>
          </a>
          <Socials />
        </div>
      </section>
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
          <div className="hello-copy" data-reveal>
            <p className="section-index">01 / A little about me</p>
            <h2>
              I like making
              <br />
              complex things
              <br />
              <em>feel simple.</em>
            </h2>
            <p>{profile.about ?? localContent.profile.about}</p>
            <p>{profile.personal ?? localContent.profile.personal}</p>
            <Link className="inline-link" to="/writing">
              More of the thinking <Arrow />
            </Link>
          </div>
        </div>
      </section>
      <section className="journey-section shell">
        <div className="section-header" data-reveal>
          <div>
            <p className="section-index">02 / Along the way</p>
            <h2>
              Learning.
              <br />
              <em>Then putting it to work.</em>
            </h2>
          </div>
          <p>
            School, community, and the projects
            <br />
            that connect the two.
          </p>
        </div>
        <div className="journey-list">
          {experience.map((item) => (
            <article className="journey-item" key={item.id} data-reveal>
              <div>
                <span className="journey-kind">{item.kind}</span>
                <p>{item.period}</p>
              </div>
              <div>
                <h3>{item.title}</h3>
                <p className="journey-org">{item.organization}</p>
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
      </section>
      <section id="work" className="home-work shell">
        <div className="section-header" data-reveal>
          <div>
            <p className="section-index">03 / Selected work</p>
            <h2>
              Some things
              <br />
              <em>I’ve been building.</em>
            </h2>
          </div>
          <Link className="inline-link" to="/projects">
            All projects <Arrow />
          </Link>
        </div>
        <div className="project-grid">
          {projects
            .filter((p) => p.featured)
            .slice(0, 4)
            .map((project, i) => (
              <div key={project.slug} data-reveal>
                <ProjectCard project={project} index={i} />
              </div>
            ))}
        </div>
      </section>
      <section id="ai" className="ai-section">
        <div className="shell">
          <div className="ai-intro" data-reveal>
            <p className="section-index">04 / Going underneath the prompt</p>
            <h2>
              First, I used the tools.
              <br />
              Then I wanted to
              <br />
              <em>understand the system.</em>
            </h2>
            <p>
              That’s where my AI work started. Building a local agent harness,
              experimenting with model fine-tuning, and shaping a repeatable
              workflow for the agents I use every day.
            </p>
          </div>
          <div className="workflow-stage">
            <div className="workflow-grid" aria-hidden="true" />
            <div className="workflow-card workflow-card--request">
              <div className="workflow-avatar">nr.</div>
              <p>
                Explore the repo. Make a plan.
                <br />
                Build the smallest useful change.
                <br />
                <strong>Show me that it works.</strong>
              </p>
              <span>My working brief</span>
            </div>
            <div className="workflow-card workflow-card--build">
              <div className="workflow-bar">
                <span />
                <span />
                <span />
                <code>fleet / working loop</code>
              </div>
              <div className="workflow-lines">
                <p>
                  <i>01</i>
                  <span>Research the actual problem</span>
                  <b>context</b>
                </p>
                <p>
                  <i>02</i>
                  <span>Give each agent a bounded task</span>
                  <b>scope</b>
                </p>
                <p>
                  <i>03</i>
                  <span>Implement and inspect the result</span>
                  <b>build</b>
                </p>
                <p>
                  <i>04</i>
                  <span>Keep proof, carry lessons forward</span>
                  <b>review</b>
                </p>
              </div>
              <div className="workflow-file">
                <span>↳</span>
                <code>instructions + skills + evidence</code>
              </div>
            </div>
            <div className="workflow-card workflow-card--review">
              <span className="review-check">✓</span>
              <p>“Done” needs evidence.</p>
              <span>A build. A test. The actual interface.</span>
            </div>
          </div>
          <div className="ai-columns">
            <article data-reveal>
              <span>01</span>
              <h3>Fleet</h3>
              <p>
                My shared home for agent instructions, skills, and workflows. I
                coordinate research, implementation, and review while keeping
                the product decisions with me.
              </p>
              <Link
                className="inline-link"
                to="/writing/fleet-a-working-system"
              >
                The workflow <Arrow />
              </Link>
            </article>
            <article data-reveal>
              <span>02</span>
              <h3>Local agents</h3>
              <p>
                With two friends, I’m building LAH to explore streaming, tool
                calls, memory, and the constraints of smaller local models.
              </p>
              <Link className="inline-link" to="/projects/lah">
                Inside LAH <Arrow />
              </Link>
            </article>
            <article data-reveal>
              <span>03</span>
              <h3>Model experiments</h3>
              <p>
                Fine-tuning scripts, curated coding examples, and local
                inference. I’m learning how data choices and hardware
                constraints shape a model’s behaviour.
              </p>
              <Link className="inline-link" to="/projects/qwen3-distill">
                The experiment <Arrow />
              </Link>
            </article>
          </div>
        </div>
      </section>
      <section className="contributions shell">
        <div className="section-header" data-reveal>
          <div>
            <p className="section-index">05 / Working in the open</p>
            <h2>
              Small contributions.
              <br />
              <em>Real systems.</em>
            </h2>
          </div>
          <p>
            Learning to work inside code
            <br />I didn’t write from scratch.
          </p>
        </div>
        {contributions.map((c) => (
          <a
            className="contribution-row"
            key={c.name}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            data-reveal
          >
            <div>
              <span className="contribution-name">{c.name}</span>
              <span className="contribution-number">#{c.number}</span>
            </div>
            <div>
              <h3>{c.title}</h3>
              <p>{c.description}</p>
              <span className="contribution-status">{c.status}</span>
            </div>
            <Arrow diagonal />
          </a>
        ))}
      </section>
      <section className="stack-section shell">
        <div className="section-header" data-reveal>
          <div>
            <p className="section-index">06 / My everyday tools</p>
            <h2>
              The stack
              <br />
              <em>behind the work.</em>
            </h2>
          </div>
          <p>
            A few tools I use and keep learning.
            <br />
            The project decides the rest.
          </p>
        </div>
        <div className="tool-grid">
          {skills.map((skill) => (
            <article className="tool-item" key={skill.id}>
              <img
                src={`/icons/${toolIcons.has(skill.id) ? skill.id : "code"}.svg`}
                alt=""
                width="64"
                height="64"
              />
              <h3>{skill.name}</h3>
              <p>{skill.description}</p>
            </article>
          ))}
        </div>
        <div className="supporting-tools">
          <span>Also in the toolkit</span>
          {["Git", "Next.js", "Docker", "Local models", "GSAP", "Blender"].map(
            (tool) => (
              <span key={tool}>{tool}</span>
            ),
          )}
        </div>
      </section>
      <section className="home-writing shell">
        <div className="section-header" data-reveal>
          <div>
            <p className="section-index">07 / Notes from the work</p>
            <h2>
              Still figuring
              <br />
              <em>things out.</em>
            </h2>
          </div>
          <Link className="inline-link" to="/writing">
            All writing <Arrow />
          </Link>
        </div>
        {articles.slice(0, 3).map((article, index) => (
          <div key={article.slug} data-reveal>
            <ArticleRow article={article} index={index} />
          </div>
        ))}
      </section>
    </div>
  );
}
