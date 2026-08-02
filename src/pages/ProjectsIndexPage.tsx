import { Search } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { ProjectCard } from '../components/cards/ProjectCard';
import { Seo } from '../components/Seo';
import { ErrorState } from '../components/ui/ErrorState';
import { Section } from '../components/ui/Section';
import { usePageSettings } from '../hooks/usePageSettings';
import { useSanityQuery } from '../hooks/useSanityQuery';
import { fallbackProjects } from '../lib/fallbackData';
import { allProjectsQuery } from '../lib/sanity/queries';
import { formatProjectType } from '../lib/status';
import type { Project, ProjectStatus, ProjectType } from '../lib/types';

const statusOptions: Array<{ value: 'all' | ProjectStatus; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'building', label: 'In development' },
  { value: 'archived', label: 'Archived' },
  { value: 'experiment', label: 'Experiment' },
];

const projectsPerPage = 9;

function getSearchText(project: Project) {
  return [
    project.title,
    project.summary,
    project.role,
    project.impact,
    project.problem,
    project.solution,
    project.projectType,
    project.status,
    ...project.technologies.map((skill) => skill.title),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function ProjectsIndexPage() {
  const settings = usePageSettings();
  const { data: projects, error } = useSanityQuery<Project[]>(allProjectsQuery, fallbackProjects);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ProjectStatus>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | ProjectType>('all');
  const [page, setPage] = useState(1);

  const typeOptions = useMemo(() => {
    const types = new Set<ProjectType>();

    projects.forEach((project) => {
      if (project.projectType) {
        types.add(project.projectType);
      }
    });

    return Array.from(types).sort((a, b) => formatProjectType(a).localeCompare(formatProjectType(b)));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return [...projects]
      .sort((left, right) =>
        (right.sortDate ?? right.createdAt ?? '').localeCompare(
          left.sortDate ?? left.createdAt ?? '',
        ),
      )
      .filter((project) => {
        const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
        const matchesType = typeFilter === 'all' || project.projectType === typeFilter;
        const matchesQuery = !normalizedQuery || getSearchText(project).includes(normalizedQuery);

        return matchesStatus && matchesType && matchesQuery;
      });
  }, [projects, query, statusFilter, typeFilter]);

  useEffect(() => setPage(1), [query, statusFilter, typeFilter]);

  const pageCount = Math.ceil(filteredProjects.length / projectsPerPage);
  const visibleProjects = filteredProjects.slice(
    (page - 1) * projectsPerPage,
    page * projectsPerPage,
  );

  return (
    <>
      <Seo
        title={`Work | ${settings.name}`}
        description="Projects by Nachiketh Reddy, with screenshots, technical notes, and lessons learned."
      />
      <Section className="!pb-8 !pt-12 lg:!pb-10 lg:!pt-16">
        <div className="max-w-4xl">
          <p className="font-tech text-xs font-semibold uppercase tracking-[0.18em] text-primary-strong">
            Work
          </p>
          <h1 className="mt-4 max-w-[16ch] font-display text-5xl font-semibold leading-[0.98] tracking-[-0.035em] text-balance text-ink sm:text-6xl">
            My work.
          </h1>
          <p className="mt-6 max-w-[64ch] text-lg leading-8 text-muted text-pretty sm:text-xl">
            Projects from classes, client work, hackathons, and my own experiments. Each page
            explains what I did and what I learned.
          </p>
        </div>
        {error ? (
          <div className="mt-8">
            <ErrorState message={error} />
          </div>
        ) : null}
      </Section>
      <Section className="!pb-20 !pt-4 lg:!pb-24 lg:!pt-6">
        <div className="mb-8 flex flex-col gap-4 border-b border-[#00d2ff]/24 pb-5">
          <div className="relative w-full">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              size={18}
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search project name, description, or tech stack"
              className="min-h-12 w-full rounded-none border border-[#00d2ff]/45 bg-terminal py-3 pl-10 pr-4 font-tech text-sm font-bold text-ink placeholder:text-muted"
            />
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <FilterGroup label="Status">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatusFilter(option.value)}
                  className={[
                    'pressable min-h-10 rounded-none border px-2.5 font-tech text-[0.68rem] font-bold uppercase',
                    statusFilter === option.value
                      ? 'border-[#00d2ff] bg-[#00d2ff] text-[#07101a]'
                      : 'border-[#00d2ff]/35 bg-terminal text-ink hover:border-[#00d2ff]',
                  ].join(' ')}
                >
                  {option.label}
                </button>
              ))}
            </FilterGroup>

            <FilterGroup label="Type">
              <button
                type="button"
                onClick={() => setTypeFilter('all')}
                className={[
                  'pressable min-h-10 rounded-none border px-2.5 font-tech text-[0.68rem] font-bold uppercase',
                  typeFilter === 'all'
                    ? 'border-[#00d2ff] bg-[#00d2ff] text-[#07101a]'
                    : 'border-[#00d2ff]/35 bg-terminal text-ink hover:border-[#00d2ff]',
                ].join(' ')}
              >
                All types
              </button>
              {typeOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTypeFilter(type)}
                  className={[
                    'pressable min-h-10 rounded-none border px-2.5 font-tech text-[0.68rem] font-bold uppercase',
                    typeFilter === type
                      ? 'border-[#00d2ff] bg-[#00d2ff] text-[#07101a]'
                      : 'border-[#00d2ff]/35 bg-terminal text-ink hover:border-[#00d2ff]',
                  ].join(' ')}
                >
                  {formatProjectType(type)}
                </button>
              ))}
            </FilterGroup>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-display text-3xl font-semibold text-ink">Project case studies</h2>
        </div>

        {filteredProjects.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visibleProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="brutal-panel-soft p-6">
            <p className="font-tech text-sm font-bold text-ink">No projects match those filters.</p>
            <p className="mt-2 text-sm text-muted">
              Try a status, type, project name, description, or technology like TypeScript.
            </p>
          </div>
        )}

        {pageCount > 1 ? (
          <nav aria-label="Project pages" className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
              className="pressable min-h-11 border border-[#00d2ff]/45 bg-terminal px-4 font-tech text-xs font-bold uppercase text-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span className="font-tech text-xs font-bold uppercase text-muted">
              Page {page} of {pageCount}
            </span>
            <button
              type="button"
              disabled={page === pageCount}
              onClick={() => setPage((current) => current + 1)}
              className="pressable min-h-11 border border-[#00d2ff]/45 bg-terminal px-4 font-tech text-xs font-bold uppercase text-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        ) : null}
      </Section>
    </>
  );
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-tech text-[0.68rem] font-bold uppercase text-muted">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
