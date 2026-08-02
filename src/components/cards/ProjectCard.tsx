import { ArrowRight, Code2, Globe2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { formatDate } from '../../lib/dates';
import { imageUrlFor } from '../../lib/sanity/image';
import { formatProjectType, formatStatus } from '../../lib/status';
import type { Project, ProjectStatus } from '../../lib/types';
import { ProjectVisual } from '../ProjectVisual';
import { SkillBadge } from '../ui/SkillBadge';

type ProjectCardProps = {
  project: Project;
};

const statusTagClasses: Record<ProjectStatus, string> = {
  shipped: 'border-emerald-400/70 bg-emerald-400/10 text-emerald-200',
  building: 'border-amber-300/75 bg-amber-300/10 text-amber-100',
  archived: 'border-slate-400/45 bg-slate-400/10 text-slate-300',
  experiment: 'border-red-400/65 bg-red-400/10 text-red-200',
};

function limitSentences(value: string, maxSentences = 2) {
  const sentences = value.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((sentence) => sentence.trim()) ?? [];

  if (sentences.length <= maxSentences) {
    return value;
  }

  return `${sentences.slice(0, maxSentences).join(' ')}…`;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const coverImageUrl = imageUrlFor(project.coverImage, 960);
  const dateLabel = project.period ?? (project.createdAt ? formatDate(project.createdAt) : null);

  return (
    <article className="project-card group relative">
      <Link
        to={`/projects/${project.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`Read the ${project.title} case study`}
      />

      <div className="project-card-media">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={project.coverImage?.alt ?? `${project.title} preview`}
            loading="lazy"
          />
        ) : (
          <ProjectVisual title={project.title} status={formatStatus(project.status)} />
        )}
      </div>

      <div className="project-card-body">
        <div className="flex flex-wrap items-center gap-1.5 font-tech text-[0.64rem] font-semibold">
          <span className={['border px-2 py-0.5 leading-5', statusTagClasses[project.status]].join(' ')}>
            {formatStatus(project.status)}
          </span>
          <span className="border border-primary/25 bg-surface px-2 py-0.5 leading-5 text-muted">
            {formatProjectType(project.projectType)}
          </span>
        </div>

        <div>
          <h3 className="font-display text-2xl font-bold leading-tight tracking-[-0.02em] text-ink group-hover:text-primary-strong">
            {project.title}
          </h3>
          <p className="mt-2 font-tech text-[0.7rem] text-soft">{dateLabel}</p>
        </div>

        <p className="text-sm leading-6 text-muted">{limitSentences(project.summary)}</p>

        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 3).map((skill) => (
            <SkillBadge key={skill._id} skill={skill} />
          ))}
        </div>

        <div className="project-card-actions">
          <span className="project-card-case-study">
            Case study <ArrowRight aria-hidden="true" size={15} />
          </span>
          <div className="relative z-20 flex gap-1">
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} source code`}
                className="project-card-icon pressable"
              >
                <Code2 aria-hidden="true" size={15} />
              </a>
            ) : null}
            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} live demo`}
                className="project-card-icon pressable"
              >
                <Globe2 aria-hidden="true" size={15} />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
