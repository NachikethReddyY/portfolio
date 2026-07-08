import { ProjectCard } from '../components/cards/ProjectCard';
import { Seo } from '../components/Seo';
import { ErrorState } from '../components/ui/ErrorState';
import { Section } from '../components/ui/Section';
import { usePageSettings } from '../hooks/usePageSettings';
import { useSanityQuery } from '../hooks/useSanityQuery';
import { fallbackProjects } from '../lib/fallbackData';
import { allProjectsQuery } from '../lib/sanity/queries';
import type { Project } from '../lib/types';

export function ProjectsIndexPage() {
  const settings = usePageSettings();
  const { data: projects, error } = useSanityQuery<Project[]>(allProjectsQuery, fallbackProjects);

  return (
    <>
      <Seo
        title={`Projects | ${settings.name}`}
        description="Project case studies with problem statements, solutions, tech stacks, screenshots, lessons learned, and next steps."
      />
      <Section className="pb-10 pt-14 sm:pt-20">
        <div className="max-w-4xl">
          <p className="font-tech text-sm font-bold text-violet">Project Case Studies</p>
          <h1 className="mt-4 font-display text-5xl font-black leading-[0.98] text-balance text-ink sm:text-6xl">
            Full-stack apps, local AI tools, and security experiments.
          </h1>
          <p className="mt-6 text-xl font-semibold leading-8 text-primary-strong text-pretty">
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
        <div className="grid gap-8 md:grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </Section>
    </>
  );
}
