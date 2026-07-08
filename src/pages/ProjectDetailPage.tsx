import { Code2, Globe2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { ProjectVisual } from '../components/ProjectVisual';
import { RichTextRenderer } from '../components/RichTextRenderer';
import { Seo } from '../components/Seo';
import { ButtonLink } from '../components/ui/ButtonLink';
import { Section } from '../components/ui/Section';
import { SkillBadge } from '../components/ui/SkillBadge';
import { usePageSettings } from '../hooks/usePageSettings';
import { useSanityQuery } from '../hooks/useSanityQuery';
import { fallbackProjects } from '../lib/fallbackData';
import { projectBySlugQuery } from '../lib/sanity/queries';
import { formatStatus } from '../lib/status';
import type { Project } from '../lib/types';

export function ProjectDetailPage() {
  const { slug = '' } = useParams();
  const settings = usePageSettings();
  const fallbackProject = fallbackProjects.find((project) => project.slug === slug) ?? fallbackProjects[0];
  const { data: project } = useSanityQuery<Project>(projectBySlugQuery, fallbackProject, { slug });

  if (!project) {
    return null;
  }

  return (
    <>
      <Seo
        title={project.seoTitle ?? `${project.title} | ${settings.name}`}
        description={project.seoDescription ?? project.summary}
      />
      <Section className="pb-10 pt-14 sm:pt-20">
        <Link
          to="/projects"
          className="pressable inline-flex min-h-11 items-center rounded-none border border-[#00d2ff] bg-[#0d1622] px-3 font-tech text-sm font-bold uppercase text-ink shadow-[5px_5px_0_#243a56] hover:-translate-x-0.5 hover:-translate-y-0.5"
        >
          Back to projects
        </Link>
        <div className="mt-6 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-none border border-[#00d2ff]/45 bg-terminal px-2.5 py-1 font-tech text-[0.68rem] font-bold text-primary-strong">
                {formatStatus(project.status)}
              </span>
              {project.featured ? (
                <span className="rounded-none border border-[#00d2ff]/30 bg-surface px-2.5 py-1 font-tech text-[0.68rem] font-semibold text-ink">
                  Featured
                </span>
              ) : null}
            </div>
            <h1 className="mt-5 font-display text-5xl font-black leading-[0.98] text-balance text-ink sm:text-6xl">
              {project.title}
            </h1>
            <p className="mt-6 text-xl font-semibold leading-8 text-primary-strong text-pretty">
              {project.summary}
            </p>
            <dl className="brutal-panel-soft mt-7 grid gap-3 p-4 sm:grid-cols-3">
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
                  <dd className="mt-1 text-sm font-semibold text-ink">{project.projectType}</dd>
                </div>
              ) : null}
            </dl>
            {project.impact ? (
              <p className="mt-4 rounded-none border border-[#00d2ff] bg-terminal p-4 font-semibold text-ink shadow-[5px_5px_0_#243a56]">
                {project.impact}
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              {project.demoUrl ? (
                <ButtonLink href={project.demoUrl} variant="primary" external>
                  Live demo
                </ButtonLink>
              ) : null}
              {project.githubUrl ? (
                <ButtonLink href={project.githubUrl} variant="secondary" external>
                  GitHub
                </ButtonLink>
              ) : null}
            </div>
          </div>
          <ProjectVisual title={project.title} status={formatStatus(project.status)} />
        </div>
      </Section>

      <Section className="py-8">
        <div className="grid gap-5 md:grid-cols-2">
          <article className="brutal-panel-soft p-6">
            <h2 className="font-display text-3xl font-black text-ink">Problem</h2>
            <p className="mt-4 text-muted">{project.problem}</p>
          </article>
          <article className="brutal-panel-soft p-6">
            <h2 className="font-display text-3xl font-black text-ink">Solution</h2>
            <p className="mt-4 text-muted">{project.solution}</p>
          </article>
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <aside className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-black text-ink">Tech stack</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((skill) => (
                  <SkillBadge key={skill._id} skill={skill} />
                ))}
              </div>
            </div>
            <div className="brutal-panel-soft p-5">
              <h2 className="font-display text-2xl font-black text-ink">Links</h2>
              <div className="mt-4 grid gap-2">
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="pressable inline-flex min-h-11 items-center gap-2 rounded-none border border-[#00d2ff] bg-[#0d1622] px-3 font-tech font-bold uppercase text-ink shadow-[5px_5px_0_#243a56] hover:-translate-x-0.5 hover:-translate-y-0.5"
                  >
                    <Code2 aria-hidden="true" size={18} />
                    Repository
                  </a>
                ) : null}
                {project.demoUrl ? (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="pressable inline-flex min-h-11 items-center gap-2 rounded-none border border-[#00d2ff] bg-[#0d1622] px-3 font-tech font-bold uppercase text-ink shadow-[5px_5px_0_#243a56] hover:-translate-x-0.5 hover:-translate-y-0.5"
                  >
                    <Globe2 aria-hidden="true" size={18} />
                    Live demo
                  </a>
                ) : null}
              </div>
            </div>
          </aside>
          <div className="grid gap-8">
            <DetailList title="Features" items={project.features} />
            <DetailList title="What I personally built" items={project.whatIBuilt} />
            <DetailList title="Constraints and tradeoffs" items={project.constraints} />
            <DetailList title="Lessons learned" items={project.lessonsLearned} />
            <DetailList title="Future improvements" items={project.futureImprovements} />
            <RichTextRenderer value={project.body} />
          </div>
        </div>
      </Section>
    </>
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
