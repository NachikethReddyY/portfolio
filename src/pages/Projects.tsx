import { Link, useParams, useSearchParams } from "react-router-dom";
import { useContent } from "../content/store";
import type { ContentBlock, CaseStudy } from "../content/types";
import { Arrow } from "../components/Icons";
import { RichContent, LegacyRichContent } from "../components/RichContent";
import { usePageMotion } from "../usePageMotion";
import NotFound from "./NotFound";
import { ProjectMedia } from "../components/ProjectMedia";
import { ReadingContents } from "../components/ReadingContents";
import { readingSections } from "../lib/readingContents";
import { useMemo, useRef, useEffect } from "react";
import { ProjectGallery } from "../components/ProjectGallery";
import { CaseBlueprint, blueprintFor } from "../components/CaseBlueprint";
import { previewTilt } from "../lib/workInteractions";

export function ProjectCard({
  project,
  index = 0,
}: {
  project: CaseStudy;
  index?: number;
}) {
  const card = useRef<HTMLAnchorElement>(null);
  const frame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const resetTilt = () => {
    cancelAnimationFrame(frame.current);
    card.current?.style.removeProperty("--preview-x");
    card.current?.style.removeProperty("--preview-y");
  };
  return (
    <Link
      ref={card}
      onPointerMove={(event) => {
        if (
          event.pointerType !== "mouse" ||
          !window.matchMedia(
            "(hover: hover) and (prefers-reduced-motion: no-preference)",
          ).matches
        )
          return;
        const element = event.currentTarget;
        const { clientX, clientY } = event;
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
          const box = element.getBoundingClientRect();
          const tilt = previewTilt(
            (clientX - box.left) / box.width,
            (clientY - box.top) / box.height,
          );
          element.style.setProperty("--preview-x", `${tilt.x}deg`);
          element.style.setProperty("--preview-y", `${tilt.y}deg`);
        });
      }}
      onPointerLeave={resetTilt}
      onBlur={resetTilt}
      to={`/projects/${project.slug}`}
      className={`project-card accent-${project.accent}`}
    >
      <div className="project-card-info">
        <div>
          <h3>{project.name}</h3>
          <p>{project.summary}</p>
        </div>
        <span>{project.status}</span>
      </div>
      <div className="project-card-art">
        <ProjectMedia project={project} />
        <span className="project-open">
          <Arrow diagonal />
        </span>
        <span className="project-card-index">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="project-card-stack">
        {project.stack.slice(0, 3).map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </div>
    </Link>
  );
}
export default function Projects() {
  const { projects } = useContent();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const filter = projects.some(
    (project) => project.category === requestedCategory,
  )
    ? requestedCategory!
    : "All work";
  const setFilter = (category: string) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (category === "All work") next.delete("category");
        else next.set("category", category);
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
  };
  const scope = usePageMotion();
  const filtered = projects.filter(
    (p) => filter === "All work" || p.category === filter,
  );
  return (
    <div ref={scope} className="index-page shell">
      <header className="page-heading">
        <p>Projects & experiments</p>
        <h1 tabIndex={-1}>
          Built to figure
          <br />
          things <em>out.</em>
        </h1>
        <div className="page-intro">
          <p>
            Web applications, local AI tools, and the things I build when a
            question won’t leave me alone.
          </p>
          <span aria-live="polite">
            {filtered.length}{" "}
            {filter === "All work"
              ? "projects"
              : `of ${projects.length} projects`}
          </span>
        </div>
      </header>
      <div className="filter-bar" aria-label="Filter projects">
        {["All work", ...new Set(projects.map((p) => p.category))].map(
          (label) => (
            <button
              key={label}
              aria-pressed={label === filter}
              onClick={() => setFilter(label)}
            >
              {label}
            </button>
          ),
        )}
      </div>
      <div className="project-grid">
        {filtered.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </div>
    </div>
  );
}
export function ProjectDetail() {
  const { slug } = useParams();
  const { projects } = useContent();
  const project = projects.find((p) => p.slug === slug);
  const scope = usePageMotion(slug);
  const blueprint = blueprintFor(slug ?? "");
  const sections = useMemo(
    () => [
      { id: "project-overview", label: "Overview" },
      ...(project?.gallery?.length
        ? [{ id: "project-highlights", label: "Highlights" }]
        : []),
      ...readingSections(project?.body ?? []).flatMap((section, index) =>
        index === 1 && blueprint
          ? [
              section,
              { id: "project-blueprint", label: "Workflow & decisions" },
            ]
          : [section],
      ),
    ],
    [project, blueprint],
  );
  if (!project) return <NotFound />;
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  const chapters: ContentBlock[][] = [];
  for (const block of project.body) {
    if (!chapters.length || (block._type === "block" && block.style === "h2"))
      chapters.push([]);
    chapters[chapters.length - 1].push(block);
  }
  return (
    <article ref={scope} className={`detail-page accent-${project.accent}`}>
      <header className="case-heading shell">
        <Link className="back-link" to="/projects">
          ← All projects
        </Link>
        <div className="detail-kicker">
          <span>{project.category}</span>
          <span>{project.status}</span>
        </div>
        <h1 tabIndex={-1}>{project.name}</h1>
        <p className="case-summary">{project.summary}</p>
        <div className="case-links">
          {project.links.map((link) => (
            <a
              href={link.url}
              key={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
              <Arrow diagonal />
            </a>
          ))}
        </div>
      </header>
      <div className="case-cover shell">
        <ProjectMedia project={project} prominent />
      </div>
      <div className="case-body reading-layout shell">
        <ReadingContents sections={sections} label="Case study contents" />
        <div className="reading-main">
          <section className="case-overview" id="project-overview">
            <div className="case-facts">
              <div>
                <span>My role</span>
                <p>{project.role}</p>
              </div>
              <div>
                <span>Timeline & status</span>
                <p>
                  {project.year} · {project.status}
                </p>
              </div>
              <div>
                <span>Built with</span>
                <p>{project.stack.join(" · ")}</p>
              </div>
            </div>
            <div className="case-overview-copy">
              <h2>Overview</h2>
              <p>{project.headline}</p>
              <p>{project.summary}</p>
            </div>
          </section>
          {!!project.gallery?.length && (
            <section className="case-highlights" id="project-highlights">
              <h2>Highlights</h2>
              <ProjectGallery key={project.slug} images={project.gallery} />
            </section>
          )}
          {chapters.map((chapter, index) => (
            <div className="case-chapter-group" key={chapter[0]?._key ?? index}>
              <section className="case-chapter">
                <span className="case-chapter-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <RichContent body={chapter} />
              </section>
              {index === 1 && blueprint && (
                <CaseBlueprint
                  key={project.slug}
                  study={blueprint}
                  name={project.name}
                  status={project.status}
                />
              )}
            </div>
          ))}
          {project.legacyBody && (
            <LegacyRichContent body={project.legacyBody} />
          )}
        </div>
      </div>
      <Link className="next-project shell" to={`/projects/${next.slug}`}>
        <span>Next project</span>
        <h2>{next.name}</h2>
        <Arrow />
      </Link>
    </article>
  );
}
