import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { BlogCard } from '../components/cards/BlogCard';
import { ProjectCard } from '../components/cards/ProjectCard';
import { Seo } from '../components/Seo';
import { ButtonLink } from '../components/ui/ButtonLink';
import { ErrorState } from '../components/ui/ErrorState';
import { Section } from '../components/ui/Section';
import { SkillBadge } from '../components/ui/SkillBadge';
import { TerminalLine, TerminalSequence } from '../components/ui/TerminalSequence';
import { usePageSettings } from '../hooks/usePageSettings';
import { useSanityQuery } from '../hooks/useSanityQuery';
import { fallbackHomePage } from '../lib/fallbackData';
import { homePageQuery } from '../lib/sanity/queries';
import type { HomePageContent } from '../lib/types';

export function HomePage() {
  const settings = usePageSettings();
  const { data: home, error, isFallback } = useSanityQuery<HomePageContent>(
    homePageQuery,
    fallbackHomePage,
  );
  const evidence = [
    settings.education,
    settings.publicRepoCount && settings.githubUsername
      ? `${settings.publicRepoCount} public GitHub repositories as ${settings.githubUsername}`
      : undefined,
    settings.currentFocus,
    settings.location ? `Based in ${settings.location}` : undefined,
  ].filter(Boolean);
  const positioningBullets = (home.positioningStatement ?? '')
    .replace(': ', '. ')
    .split(/(?<=\.)\s+|,\s+and\s+|,\s+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => (item.endsWith('.') ? item : `${item}.`));

  return (
    <>
      <Seo
        title={home.seoTitle ?? `${settings.name} | ${settings.role}`}
        description={home.seoDescription ?? home.subheadline}
      />
      <Section className="pb-10 pt-10 sm:pt-16 lg:pb-20 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="reveal">
            <h1 className="max-w-5xl font-display text-5xl leading-[0.92] text-balance text-ink sm:text-6xl lg:text-7xl xl:text-8xl">
              {home.headline}
            </h1>
            <p className="mt-5 max-w-2xl font-tech text-sm font-bold leading-6 text-primary-strong">
              {settings.availability}
            </p>
            <p className="mt-6 max-w-3xl text-xl font-bold leading-8 text-primary-strong text-pretty">
              {home.subheadline}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={home.primaryCtaHref} variant="primary">
                {home.primaryCtaLabel}
              </ButtonLink>
              <ButtonLink href={home.secondaryCtaHref} variant="secondary">
                {home.secondaryCtaLabel}
              </ButtonLink>
            </div>
          </div>

          <div className="reveal reveal-delay-1">
            <div className="creator-art-frame mb-4 h-[28rem]">
              <img
                src="/assets/nachiketh-dark-profile-v3.png"
                alt="Editorial portrait illustration of Nachiketh Reddy"
              />
            </div>
            <div className="grid gap-4 border-y-2 border-ink bg-surface-strong py-4">
              <TerminalSequence>
                <TerminalLine tone="command" delay={80}>
                  whoami
                </TerminalLine>
                <TerminalLine tone="success" delay={220}>
                  {settings.name} · {settings.education ?? 'Singapore Polytechnic IT student'}
                </TerminalLine>
                <TerminalLine tone="command" delay={360}>
                  focus --current
                </TerminalLine>
                <TerminalLine tone="info" delay={500}>
                  {settings.currentFocus ?? 'full-stack products + local AI tooling'}
                </TerminalLine>
                <TerminalLine tone="command" delay={640}>
                  status --availability
                </TerminalLine>
                <TerminalLine tone="success" delay={780}>
                  {settings.availability}
                </TerminalLine>
              </TerminalSequence>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 border-b-2 border-ink pb-4">
              <span className="font-tech text-xs font-bold text-muted">live build signal</span>
              <span className="rounded-md border-2 border-ink bg-success px-2.5 py-1 font-tech text-[0.68rem] font-bold text-on-accent">
                GitHub backed
              </span>
            </div>
            <div className="grid pt-2">
              {evidence.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 border-b border-ink/35 py-3 text-left last:border-b-0"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    size={20}
                    className="mt-0.5 shrink-0 text-violet"
                  />
                  <span className="font-semibold">{item}</span>
                </div>
              ))}
            </div>
            <div className="text-on-ink mt-4 border-y-2 border-ink bg-terminal px-4 py-3 font-tech text-xs">
              <span className="text-accent">$</span> shipping useful software while learning the
              hard parts in public
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-10">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <h2 className="font-display text-3xl font-black text-balance text-ink">
            Built to answer the questions hiring teams actually ask.
          </h2>
          <div className="grid gap-3">
            {positioningBullets.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="stamp-panel flex items-start gap-3 rounded-md px-4 py-3"
              >
                <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-sm border-2 border-ink bg-accent font-tech text-[0.62rem] font-black text-on-accent">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold leading-6 text-ink sm:text-base">
                  {item}
                </span>
              </div>
            ))}
            {isFallback && error ? <ErrorState message={error} /> : null}
          </div>
        </div>
      </Section>

      <Section id="projects">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-4xl font-black text-balance text-ink">
              Featured projects
            </h2>
            <p className="mt-3 max-w-2xl text-muted">
              Each project is structured as evidence: context, value, implementation choices, and
              what improved after shipping.
            </p>
          </div>
          <Link
            to="/projects"
            className="pressable hover-text-on-accent inline-flex min-h-11 items-center gap-2 rounded-md border-2 border-ink bg-surface px-4 text-sm font-bold text-ink hover:bg-accent"
          >
            See all projects <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
          {home.featuredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </Section>

      <Section className="py-12">
        <div className="border-y-2 border-ink py-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="font-display text-3xl font-black text-ink">Skills with context</h2>
              <p className="mt-3 text-muted">
                Not a logo wall. These are the tools and practices I use to build and explain
                reliable full-stack and AI-adjacent work.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {home.skills.map((skill) => (
                <SkillBadge key={skill._id} skill={skill} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h2 className="font-display text-4xl font-black text-balance text-ink">
              Current focus
            </h2>
            <p className="mt-3 text-muted">
              The work underneath the portfolio: full-stack apps, local AI tooling, secure coding,
              and shipping steadily.
            </p>
          </div>
          <div className="grid gap-4 lg:col-span-2">
            {home.focusAreas.map((focus) => (
              <article key={focus.title} className="brutal-panel-soft rounded-lg p-5">
                <h3 className="font-display text-2xl font-black text-ink">{focus.title}</h3>
                <p className="mt-2 text-muted">{focus.description}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section className="pt-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-4xl font-black text-balance text-ink">
              Latest writing
            </h2>
            <p className="mt-3 max-w-2xl text-muted">
              Notes on learning, project decisions, AI experiments, security, and the developer
              journey.
            </p>
          </div>
          <Link
            to="/blog"
            className="pressable hover-text-on-accent inline-flex min-h-11 items-center gap-2 rounded-md border-2 border-ink bg-surface px-4 text-sm font-bold text-ink hover:bg-violet"
          >
            Read the blog <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {home.highlightedPosts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      </Section>

      <Section className="pb-24">
        <div className="brutal-panel rounded-lg p-6 sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <h2 className="font-display text-4xl font-black text-balance text-ink">
                Need someone who can build and explain the work?
              </h2>
              <p className="mt-4 max-w-2xl text-muted">
                I am looking for internships, hackathons, and collaborators who value useful
                full-stack products, AI curiosity, secure thinking, and clear communication.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <ButtonLink href="/contact" variant="primary">
                Contact Me
              </ButtonLink>
              {settings.resumeUrl ? (
                <ButtonLink href={settings.resumeUrl} variant="secondary" external>
                  Resume
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
