import { Code2, Globe2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { formatStatus } from '../../lib/status';
import type { Project } from '../../lib/types';
import { ProjectVisual } from '../ProjectVisual';
import { SkillBadge } from '../ui/SkillBadge';

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="brutal-panel group overflow-hidden transition duration-300 ease-[var(--ease-premium)] hover:-translate-x-0.5 hover:-translate-y-0.5">
      <Link to={`/projects/${project.slug}`} className="block">
        <ProjectVisual title={project.title} status={formatStatus(project.status)} />
      </Link>

      <div className="grid gap-5 p-5 sm:p-6">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-none border border-[#00d2ff]/45 bg-terminal px-2.5 py-1 font-tech text-[0.68rem] font-bold text-primary-strong">
              {formatStatus(project.status)}
            </span>
            {project.featured ? (
              <span className="rounded-none border border-[#00d2ff]/30 bg-surface px-2.5 py-1 font-tech text-[0.68rem] font-semibold text-ink">
                Featured
              </span>
            ) : null}
          </div>
          <h3 className="font-display text-2xl font-black leading-tight text-balance text-ink">
            <Link to={`/projects/${project.slug}`} className="hover:text-primary-strong">
              {project.title}
            </Link>
          </h3>
          {project.role ? (
            <p className="mt-2 font-tech text-xs font-bold leading-5 text-primary-strong">
              {project.role}
            </p>
          ) : null}
          <p className="mt-3 text-pretty text-muted">{project.summary}</p>
          {project.impact ? (
            <p className="mt-4 border-y border-[#00d2ff]/24 py-3 text-sm font-semibold leading-6 text-ink">
              {project.impact}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 4).map((skill) => (
            <SkillBadge key={skill._id} skill={skill} />
          ))}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-[#00d2ff]/24 pt-4">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="pressable inline-flex min-h-11 items-center gap-2 rounded-none border border-[#00d2ff] bg-[#0d1622] px-3 font-tech text-sm font-bold uppercase text-ink shadow-[5px_5px_0_#243a56] hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              <Code2 aria-hidden="true" size={16} />
              Code
            </a>
          ) : null}
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="pressable inline-flex min-h-11 items-center gap-2 rounded-none border border-[#00d2ff] bg-[#0d1622] px-3 font-tech text-sm font-bold uppercase text-ink shadow-[5px_5px_0_#243a56] hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              <Globe2 aria-hidden="true" size={16} />
              Demo
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
