import { Code2, Globe2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { formatDate } from '../../lib/dates';
import { getReadingTime } from '../../lib/readingTime';
import { imageUrlFor } from '../../lib/sanity/image';
import { formatProjectType, formatStatus } from '../../lib/status';
import type { Project, ProjectStatus } from '../../lib/types';
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

function limitSentences(value: string, maxSentences = 3) {
  const sentences = value.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((sentence) => sentence.trim()) ?? [];

  if (sentences.length <= maxSentences) {
    return value;
  }

  return `${sentences.slice(0, maxSentences).join(' ')}...`;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const coverImageUrl = imageUrlFor(project.coverImage, 720);
  const dateLabel = project.period ?? (project.createdAt ? formatDate(project.createdAt) : null);
  const readTime = getReadingTime(project.body);

  return (
    <article className="brutal-panel-soft group grid h-full grid-rows-[auto_1fr] overflow-hidden transition duration-300 ease-[var(--ease-premium)] hover:-translate-x-0.5 hover:-translate-y-0.5">
      {coverImageUrl ? (
        <Link to={`/projects/${project.slug}`} className="block border-b border-[#00d2ff]/24">
          <img
            src={coverImageUrl}
            alt={project.coverImage?.alt ?? `${project.title} preview`}
            className="h-[clamp(14rem,28vw,22rem)] w-full object-cover object-top"
          />
        </Link>
      ) : null}

      <div className="grid h-full grid-rows-[1fr_auto_auto] gap-3 p-4 sm:p-5">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-1.5 font-tech text-[0.64rem] font-bold">
            <span
              className={[
                'rounded-none border px-2 py-0.5 font-tech text-[0.64rem] font-bold leading-5',
                statusTagClasses[project.status],
              ].join(' ')}
            >
              {formatStatus(project.status)}
            </span>
            <span className="rounded-none border border-[#00d2ff]/24 bg-surface px-2 py-0.5 leading-5 text-ink">
              {formatProjectType(project.projectType)}
            </span>
            {project.featured ? (
              <span className="rounded-none border border-[#00d2ff]/30 bg-surface px-2 py-0.5 font-tech text-[0.64rem] font-semibold leading-5 text-ink">
                Featured
              </span>
            ) : null}
          </div>
          <h3 className="font-display text-xl font-black leading-[1.35] text-balance text-ink sm:text-2xl">
            <Link to={`/projects/${project.slug}`} className="hover:text-primary-strong">
              {project.title}
            </Link>
          </h3>
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-tech text-[0.72rem] font-semibold text-muted">
            {dateLabel ? <span>{dateLabel}</span> : null}
            <span>{readTime}</span>
          </div>
          {project.role ? (
            <p className="mt-3 font-tech text-xs font-bold leading-5 text-primary-strong">
              {project.role}
            </p>
          ) : null}
          <p className="mt-3 text-sm leading-6 text-pretty text-muted">{limitSentences(project.summary)}</p>
          {project.impact ? (
            <p className="mt-4 border-y border-[#00d2ff]/24 py-3 text-xs font-semibold leading-6 text-ink sm:text-sm">
              {limitSentences(project.impact)}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-1.5 self-end">
          {project.technologies.slice(0, 4).map((skill) => (
            <SkillBadge key={skill._id} skill={skill} />
          ))}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-[#00d2ff]/24 pt-3">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="pressable inline-flex min-h-8 items-center gap-1.5 rounded-none border border-[#00d2ff] bg-[#0d1622] px-2.5 font-tech text-[0.68rem] font-bold uppercase leading-none text-ink shadow-[3px_3px_0_#243a56] hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              <Code2 aria-hidden="true" size={14} />
              Code
            </a>
          ) : null}
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="pressable inline-flex min-h-8 items-center gap-1.5 rounded-none border border-[#00d2ff] bg-[#0d1622] px-2.5 font-tech text-[0.68rem] font-bold uppercase leading-none text-ink shadow-[3px_3px_0_#243a56] hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              <Globe2 aria-hidden="true" size={14} />
              Demo
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
