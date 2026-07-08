import { Search } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';

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

    return projects.filter((project) => {
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      const matchesType = typeFilter === 'all' || project.projectType === typeFilter;
      const matchesQuery = !normalizedQuery || getSearchText(project).includes(normalizedQuery);

      return matchesStatus && matchesType && matchesQuery;
    });
  }, [projects, query, statusFilter, typeFilter]);

  return (
    <>
      <Seo
        title={`Projects | ${settings.name}`}
        description="Project case studies with problem statements, solutions, tech stacks, screenshots, lessons learned, and next steps."
      />
      <Section className="pb-10 pt-14 sm:pt-20">
        <div className="max-w-4xl">
          <h1 className="font-display text-5xl font-black leading-[0.98] text-balance text-ink sm:text-6xl">
            Full-stack apps, local AI tools, and security experiments.
          </h1>
          <p className="mt-6 max-w-[64ch] text-xl font-semibold leading-8 text-primary-strong text-pretty">
            The strongest projects here come from real repo evidence: shipped demos, hackathon
            builds, secure coding coursework, local model tooling, and experiments that show how I
            learn by building.
          </p>
        </div>
        {error ? (
          <div className="mt-8">
            <ErrorState message={error} />
          </div>
        ) : null}
      </Section>
      <Section className="pt-4">
        <div className="mb-6 flex flex-col gap-5 border-y border-[#00d2ff]/24 py-5">
          <div className="relative max-w-2xl">
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

          <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
            <FilterGroup label="Status">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatusFilter(option.value)}
                  className={[
                    'pressable min-h-10 rounded-none border px-3 font-tech text-xs font-bold uppercase',
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
                  'pressable min-h-10 rounded-none border px-3 font-tech text-xs font-bold uppercase',
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
                    'pressable min-h-10 rounded-none border px-3 font-tech text-xs font-bold uppercase',
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

        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-3xl font-black text-ink">Project case studies</h2>
          <p className="font-tech text-xs font-bold text-muted">
            {filteredProjects.length} / {projects.length} shown
          </p>
        </div>

        {filteredProjects.length ? (
          <div className="grid gap-5 md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
            {filteredProjects.map((project) => (
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
