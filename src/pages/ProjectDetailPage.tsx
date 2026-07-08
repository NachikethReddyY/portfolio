import { Code2, Globe2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { ProjectVisual } from '../components/ProjectVisual';
import { RichTextRenderer } from '../components/RichTextRenderer';
import { Seo } from '../components/Seo';
import { Section } from '../components/ui/Section';
import { SkillBadge } from '../components/ui/SkillBadge';
import { usePageSettings } from '../hooks/usePageSettings';
import { useSanityQuery } from '../hooks/useSanityQuery';
import { formatDate } from '../lib/dates';
import { fallbackProjects } from '../lib/fallbackData';
import { getReadingTime } from '../lib/readingTime';
import { imageUrlFor } from '../lib/sanity/image';
import { projectBySlugQuery } from '../lib/sanity/queries';
import { formatProjectType, formatStatus } from '../lib/status';
import type { Project } from '../lib/types';

export function ProjectDetailPage() {
  const { slug = '' } = useParams();
  const settings = usePageSettings();
  const fallbackProject = fallbackProjects.find((project) => project.slug === slug) ?? fallbackProjects[0];
  const { data: project } = useSanityQuery<Project>(projectBySlugQuery, fallbackProject, { slug });

  if (!project) {
    return null;
  }

  const coverImageUrl = imageUrlFor(project.coverImage, 1600);
  const dateLabel = project.period ?? (project.createdAt ? formatDate(project.createdAt) : null);
  const readingTime = getReadingTime(project.body);
  const routeLine = ['project', formatProjectType(project.projectType), formatStatus(project.status)]
    .filter(Boolean)
    .join(' / ');

  return (
    <>
      <Seo
        title={project.seoTitle ?? `${project.title} | ${settings.name}`}
        description={project.seoDescription ?? project.summary}
      />
      <Section className="article-page pb-10 pt-12 sm:pt-18">
        <article className="mx-auto max-w-5xl">
          <header className="article-hero reveal">
            <p className="article-route">{routeLine}</p>
            <h1 className="article-title">{project.title}</h1>
            <p className="article-deck">{project.summary}</p>
            <div className="article-media">
              {coverImageUrl ? (
                <img src={coverImageUrl} alt={project.coverImage?.alt ?? `${project.title} preview`} />
              ) : (
                <ProjectVisual title={project.title} status={formatStatus(project.status)} />
              )}
            </div>
          </header>

          <div className="article-meta-rail">
            <div className="article-author">
              <span className="article-avatar" aria-hidden="true">
                <img src="/assets/nachiketh-dark-profile-v3.png" alt="" />
              </span>
              <span>{settings.name}</span>
            </div>
            <div className="article-meta">
              {dateLabel ? <span>{dateLabel}</span> : null}
              <span>{readingTime}</span>
              <span>{formatStatus(project.status)}</span>
            </div>
          </div>

          {project.demoUrl || project.githubUrl ? (
            <nav aria-label="Project links" className="article-quick-links">
              {project.demoUrl ? (
                <a href={project.demoUrl} target="_blank" rel="noreferrer">
                  <Globe2 aria-hidden="true" size={16} />
                  Live demo
                </a>
              ) : null}
              {project.githubUrl ? (
                <a href={project.githubUrl} target="_blank" rel="noreferrer">
                  <Code2 aria-hidden="true" size={16} />
                  Repository
                </a>
              ) : null}
            </nav>
          ) : null}

          <div className="article-body">
            <p className="project-impact-line">{project.impact ?? project.summary}</p>
            <dl className="project-facts-grid">
              {project.role ? (
                <div>
                  <dt className="font-tech text-[0.68rem] font-bold text-muted">Role</dt>
                  <dd className="mt-1 text-sm font-semibold text-ink">{project.role}</dd>
                </div>
              ) : null}
              {project.period ? (
                <div>
                  <dt className="font-tech text-[0.68rem] font-bold text-muted">Period</dt>
                  <dd className="mt-1 text-sm font-semibold text-ink">{project.period}</dd>
                </div>
              ) : null}
              {project.projectType ? (
                <div>
                  <dt className="font-tech text-[0.68rem] font-bold text-muted">Type</dt>
                  <dd className="mt-1 text-sm font-semibold text-ink">
                    {formatProjectType(project.projectType)}
                  </dd>
                </div>
              ) : null}
            </dl>

            <section className="project-story-pair">
              <article>
                <h2>Problem</h2>
                <p>{project.problem}</p>
              </article>
              <article>
                <h2>Solution</h2>
                <p>{project.solution}</p>
              </article>
            </section>

            <section>
              <h2 className="article-section-heading">Tech stack</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((skill) => (
                  <SkillBadge key={skill._id} skill={skill} />
                ))}
              </div>
            </section>
          </div>
        </article>
      </Section>

      <Section>
        <div className="article-body mx-auto grid max-w-5xl gap-8">
          <ProjectGallery project={project} />
          <DetailList title="Features" items={project.features} />
          <DetailList title="What I personally built" items={project.whatIBuilt} />
          <DetailList title="Constraints and tradeoffs" items={project.constraints} />
          <DetailList title="Lessons learned" items={project.lessonsLearned} />
          <DetailList title="Future improvements" items={project.futureImprovements} />
          <RichTextRenderer value={project.body} />
        </div>
      </Section>
    </>
  );
}

function ProjectGallery({ project }: { project: Project }) {
  const images = (project.gallery ?? [])
    .map((image) => ({
      image,
      url: imageUrlFor(image, 1400),
    }))
    .filter((item): item is { image: NonNullable<Project['gallery']>[number]; url: string } =>
      Boolean(item.url),
    );

  if (!images.length) {
    return null;
  }

  return (
    <section className="grid gap-5">
      <h2 className="font-display text-3xl font-black text-ink">Project images</h2>
      <div className="grid gap-5">
        {images.map(({ image, url }) => (
          <figure key={url} className="brutal-panel-soft overflow-hidden">
            <img
              src={url}
              alt={image.alt ?? `${project.title} screenshot`}
              className="max-h-[42rem] w-full object-cover object-top"
              loading="lazy"
            />
            {image.caption ? (
              <figcaption className="border-t border-[#00d2ff]/24 p-4 text-sm text-muted">
                {image.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </section>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) {
    return null;
  }

  return (
    <section className="brutal-panel-soft p-6">
      <h2 className="font-display text-3xl font-black text-ink">{title}</h2>
      <ul className="mt-5 grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-muted">
            <span aria-hidden="true" className="mt-2.5 size-3 shrink-0 rounded-none bg-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
