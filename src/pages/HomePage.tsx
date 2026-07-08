import { ArrowRight, CheckCircle2, Code2, GraduationCap, MapPin } from 'lucide-react';
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
  const positioningBullets = (home.positioningStatement ?? '')
    .replace(': ', '. ')
    .split(/(?<=\.)\s+|,\s+and\s+|,\s+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => (item.endsWith('.') ? item : `${item}.`));
  const githubLink = settings.socialLinks.find((link) => link.kind === 'github');
  const linkedinLink = settings.socialLinks.find((link) => link.kind === 'linkedin');
  const hireSignals = [
    {
      label: 'Education',
      value: settings.education ?? 'Singapore Polytechnic IT student',
      icon: GraduationCap,
    },
    {
      label: 'Build evidence',
      value:
        settings.publicRepoCount && settings.githubUsername
          ? `${settings.publicRepoCount} public repos on GitHub`
          : 'Public project evidence on GitHub',
      icon: Code2,
    },
    {
      label: 'Location',
      value: settings.location ? `${settings.location} + remote` : 'Singapore + remote',
      icon: MapPin,
    },
  ];
  const roleFit = [
    {
      title: 'Full-stack product work',
      proof: 'React, Next.js, Node/Express, Supabase, PostgreSQL, auth, dashboards, and workflow UI.',
    },
    {
      title: 'AI-adjacent builder',
      proof: 'Local AI tools, roadmap generation, transcription experiments, fallback states, and model-aware UX.',
    },
    {
      title: 'Security-minded learner',
      proof: 'OWASP review, dependency scanning, SAST patterns, risk reporting, and fix documentation.',
    },
  ];

  return (
    <>
      <Seo
        title={home.seoTitle ?? `${settings.name} | ${settings.role}`}
        description={home.seoDescription ?? home.subheadline}
      />
      <Section className="pb-8 pt-8 sm:pt-12 lg:pb-16 lg:pt-16">
        <div className="home-hero-grid reveal">
          <aside className="home-profile-panel">
            <div className="creator-art-frame h-64 sm:h-80 lg:h-[23rem]">
              <img
                src="/assets/nachiketh-dark-profile-v3.png"
                alt="Editorial portrait illustration of Nachiketh Reddy"
              />
            </div>
            <div className="grid gap-3 p-4 sm:p-5">
              <p className="font-tech text-xs font-bold uppercase text-primary-strong">
                Currently available
              </p>
              <p className="text-sm font-semibold leading-6 text-ink">{settings.availability}</p>
              <div className="flex flex-wrap gap-2 border-t border-[#00d2ff]/24 pt-4">
                {githubLink ? (
                  <ButtonLink href={githubLink.url} variant="ghost" external className="min-h-10">
                    GitHub
                  </ButtonLink>
                ) : null}
                {linkedinLink ? (
                  <ButtonLink href={linkedinLink.url} variant="ghost" external className="min-h-10">
                    LinkedIn
                  </ButtonLink>
                ) : null}
              </div>
            </div>
          </aside>

          <div className="grid content-center gap-8">
            <div>
              <p className="mb-4 max-w-[52ch] font-tech text-xs font-bold uppercase leading-5 text-primary-strong">
                Full-stack student builder · AI tooling · Security curious
              </p>
              <h1 className="max-w-5xl font-display text-5xl leading-[0.96] text-balance text-ink sm:text-6xl lg:text-7xl">
                {home.headline}
              </h1>
              <p className="mt-6 max-w-2xl text-xl font-bold leading-8 text-primary-strong text-pretty">
                {home.subheadline}
              </p>
              <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-muted sm:text-lg">
                Recruiters should be able to see the fit fast: student status, shipped projects,
                real code, technical range, and a clear path to contact.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={home.primaryCtaHref} variant="primary">
                  {home.primaryCtaLabel}
                </ButtonLink>
                <ButtonLink href={home.secondaryCtaHref} variant="secondary">
                  {home.secondaryCtaLabel}
                </ButtonLink>
                {settings.resumeUrl ? (
                  <ButtonLink href={settings.resumeUrl} variant="ghost" external>
                    Resume
                  </ButtonLink>
                ) : null}
              </div>
            </div>

            <div className="home-signal-grid">
              {hireSignals.map((signal) => {
                const Icon = signal.icon;
                return (
                  <div key={signal.label} className="home-signal">
                    <Icon aria-hidden="true" size={19} className="text-primary" />
                    <div>
                      <p className="font-tech text-[0.68rem] font-bold uppercase text-soft">
                        {signal.label}
                      </p>
                      <p className="mt-1 text-sm font-bold leading-6 text-ink">{signal.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="py-2">
              <TerminalSequence>
                <TerminalLine tone="command" delay={80}>
                  match --role internship
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
              </TerminalSequence>
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-10">
        <div className="hireability-board reveal reveal-delay-1">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <h2 className="font-display text-3xl font-black text-balance text-ink sm:text-4xl">
                Built to answer the questions hiring teams actually ask.
              </h2>
              <p className="mt-4 max-w-[60ch] text-muted">
                Clear proof beats mystery: this page now leads with credibility, scope, project
                evidence, and direct next actions.
              </p>
            </div>
            <div className="grid gap-3">
              {positioningBullets.map((item) => (
                <div key={item} className="hire-check-row">
                  <CheckCircle2
                    aria-hidden="true"
                    size={20}
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  <span className="text-sm font-semibold leading-6 text-ink sm:text-base">
                    {item}
                  </span>
                </div>
              ))}
              {isFallback && error ? <ErrorState message={error} /> : null}
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-10">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid content-between gap-6 border-y-2 border-ink py-6">
            <div>
              <h2 className="font-display text-4xl font-black text-balance text-ink">
                Where I fit best
              </h2>
              <p className="mt-3 text-muted">
                Internship and project teams get the most value when the work mixes product UI,
                backend logic, AI experiments, and practical security thinking.
              </p>
            </div>
            <TerminalSequence>
              <TerminalLine tone="command" delay={80}>
                ship --with proof
              </TerminalLine>
              <TerminalLine tone="info" delay={220}>
                demos, GitHub repos, tradeoffs, lessons, and future improvements
              </TerminalLine>
            </TerminalSequence>
          </div>
          <div className="grid gap-4">
            {roleFit.map((item) => (
              <article key={item.title} className="role-fit-row">
                <h3 className="font-display text-xl font-black leading-tight text-ink">
                  {item.title}
                </h3>
                <p className="max-w-[60ch] text-sm font-semibold leading-6 text-muted">
                  {item.proof}
                </p>
              </article>
            ))}
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
            className="pressable inline-flex min-h-11 items-center gap-2 rounded-none border border-[#00d2ff] bg-[#0d1622] px-4 font-tech text-sm font-bold uppercase text-ink shadow-[6px_6px_0_#243a56] hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            See all projects <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
        <div className="mb-8 grid gap-3 border-y-2 border-ink py-5">
          {home.featuredProjects.slice(0, 3).map((project) => (
            <Link
              key={project._id}
              to={`/projects/${project.slug}`}
              className="project-proof-row group"
            >
              <div>
                <p className="font-tech text-[0.68rem] font-bold uppercase text-soft">
                  {project.projectType ?? project.status}
                </p>
                <h3 className="mt-1 font-display text-2xl font-black text-ink group-hover:text-primary-strong">
                  {project.title}
                </h3>
              </div>
              <p className="max-w-[64ch] text-sm font-semibold leading-6 text-muted">
                {project.impact ?? project.summary}
              </p>
              <ArrowRight
                aria-hidden="true"
                size={18}
                className="shrink-0 text-primary transition-transform duration-300 ease-[var(--ease-premium)] group-hover:translate-x-1"
              />
            </Link>
          ))}
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
              <article key={focus.title} className="brutal-panel-soft p-5">
                <h3 className="font-display text-2xl font-black text-ink">{focus.title}</h3>
                <p className="mt-2 max-w-[62ch] text-muted">{focus.description}</p>
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
            className="pressable inline-flex min-h-11 items-center gap-2 rounded-none border border-[#00d2ff] bg-[#0d1622] px-4 font-tech text-sm font-bold uppercase text-ink shadow-[6px_6px_0_#243a56] hover:-translate-x-0.5 hover:-translate-y-0.5"
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
        <div className="brutal-panel p-6 sm:p-8 lg:p-10">
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
