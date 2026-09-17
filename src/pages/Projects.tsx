import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useContent } from "../content/store";
import type { CaseStudy } from "../content/types";
import { Arrow } from "../components/Icons";
import { RichContent, LegacyRichContent } from "../components/RichContent";
import { usePageMotion } from "../usePageMotion";
import NotFound from "./NotFound";
import { ProjectPreview } from "../components/ProjectPreview";

export function ProjectCard({
  project,
  index = 0,
}: {
  project: CaseStudy;
  index?: number;
}) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className={`project-card accent-${project.accent}`}
    >
      <div className="project-card-art">
        {project.image ? (
          <img src={project.image} alt={project.imageAlt} loading="lazy" />
        ) : (
          <ProjectPreview project={project} />
        )}
        <span className="project-open">
          <Arrow diagonal />
        </span>
        <span className="project-card-index">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="project-card-info">
        <div>
          <h3>{project.name}</h3>
          <p>{project.summary}</p>
        </div>
        <span>{project.status}</span>
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
  const [filter, setFilter] = useState("All work");
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
  if (!project) return <NotFound />;
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
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
        <div className="case-facts">
          <div>
            <span>My role</span>
            <p>{project.role}</p>
          </div>
          <div>
            <span>When</span>
            <p>{project.year}</p>
          </div>
          <div>
            <span>Built with</span>
            <p>{project.stack.join(" · ")}</p>
          </div>
        </div>
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
      {project.image && (
        <div className="case-cover shell">
          <img src={project.image} alt={project.imageAlt} />
        </div>
      )}
      <div className="case-body shell">
        <aside>
          <p>Inside the project</p>
          <nav aria-label="Case study contents">
            {project.body
              .filter((b) => b._type === "block" && b.style === "h2")
              .map(
                (b) =>
                  b._type === "block" && (
                    <a href={`#${b._key}`} key={b._key}>
                      {b.children.map((s) => s.text).join("")}
                    </a>
                  ),
              )}
          </nav>
        </aside>
        <div>
          <RichContent body={project.body} />
          {project.legacyBody && (
            <LegacyRichContent body={project.legacyBody} />
          )}
          <div className="project-gallery">
            {project.gallery?.map((image) => (
              <figure key={image.url}>
                <img src={image.url} alt={image.alt} loading="lazy" />
                {image.caption && <figcaption>{image.caption}</figcaption>}
              </figure>
            ))}
          </div>
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
