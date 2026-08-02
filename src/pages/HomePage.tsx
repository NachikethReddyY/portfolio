import { ArrowRight, Code2, GraduationCap, MapPin, Network } from 'lucide-react';
import { Link } from 'react-router-dom';

import { BlogCard } from '../components/cards/BlogCard';
import { ProjectCard } from '../components/cards/ProjectCard';
import { Seo } from '../components/Seo';
import { ButtonLink } from '../components/ui/ButtonLink';
import { Section } from '../components/ui/Section';
import { SkillBadge } from '../components/ui/SkillBadge';
import { usePageSettings } from '../hooks/usePageSettings';
import { useSanityQuery } from '../hooks/useSanityQuery';
import { fallbackHomePage } from '../lib/fallbackData';
import { homePageQuery } from '../lib/sanity/queries';
import type { HomePageContent } from '../lib/types';

const workingAreas = [
  'Web applications',
  'AI tools',
  'Cloud and security',
];

const leadershipWork = [
  'Lead the Apple Developer Society committee and help set its technical roadmap.',
  'Plan workshops and major student activities, including the Swift Nano Bootcamp.',
  'Teach Swift and SwiftUI, mentor participants, and help debug unfamiliar code.',
];

export function HomePage() {
  const settings = usePageSettings();
  const { data: home } = useSanityQuery<HomePageContent>(homePageQuery, fallbackHomePage);
  const githubLink = settings.socialLinks.find((link) => link.kind === 'github');
  const linkedinLink = settings.socialLinks.find((link) => link.kind === 'linkedin');
  const featuredProjects = home.featuredProjects.slice(0, 3);

  return (
    <>
      <Seo
        title={home.seoTitle ?? `${settings.name} | ${settings.role}`}
        description={home.seoDescription ?? home.subheadline}
      />

      <Section className="pb-12 pt-4 sm:pt-6 lg:pb-16 lg:pt-8">
        <div className="landing-hero reveal">
          <div className="landing-portrait-image">
            <img
              src="/assets/nachiketh-dark-profile-v3.png"
              alt="Portrait of Nachiketh Reddy"
            />
          </div>

          <div className="landing-hero-copy">
            <p className="font-tech text-xs font-semibold uppercase tracking-[0.18em] text-primary-strong">
              Nachiketh Reddy · Singapore
            </p>
            <h1 className="mt-6 max-w-[15ch] font-display text-5xl font-semibold leading-[0.98] tracking-[-0.035em] text-ink sm:text-6xl lg:text-7xl">
              {home.headline}
            </h1>
            <p className="mt-7 max-w-[62ch] text-lg leading-8 text-muted sm:text-xl">
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

            <div className="landing-focus-list" aria-label="Areas of work">
              {workingAreas.map((area, index) => (
                <div key={area}>
                  <span className="font-tech text-[0.68rem] text-primary-strong">0{index + 1}</span>
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="landing-availability-panel">
            <div className="grid gap-4 p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="font-tech text-xs font-semibold uppercase text-primary-strong">
                  Available for internships
                </p>
                <span aria-hidden="true" className="size-2 bg-emerald-300" />
              </div>
              <p className="text-sm leading-6 text-muted">{settings.availability}</p>
              <div className="flex flex-wrap gap-2 border-t border-primary/20 pt-4">
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
        </div>
      </Section>

      <Section id="projects" className="py-14 lg:py-18">
        <div className="section-heading-row">
          <div>
            <p className="font-tech text-xs font-semibold uppercase tracking-[0.18em] text-primary-strong">
              Selected work
            </p>
            <h2 className="mt-3 max-w-[18ch] font-display text-4xl font-semibold tracking-[-0.025em] text-ink sm:text-5xl">
              Recent projects.
            </h2>
            <p className="mt-4 max-w-[65ch] text-muted">
              Client work, team projects, and experiments, with clear notes on what I did and what
              is still unfinished.
            </p>
          </div>
          <Link to="/projects" className="section-link pressable">
            View all work <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </Section>

      <Section id="about" className="scroll-mt-24 py-14 lg:py-20">
        <div className="about-landing-grid">
          <div>
            <p className="font-tech text-xs font-semibold uppercase tracking-[0.18em] text-primary-strong">
              About
            </p>
            <h2 className="mt-4 max-w-[14ch] font-display text-4xl font-semibold leading-tight tracking-[-0.025em] text-ink sm:text-5xl">
              I learn by building.
            </h2>
            <p className="mt-6 max-w-[62ch] text-lg leading-8 text-muted">
              I&apos;m a Year 2 Information Technology student at Singapore Polytechnic,
              specialising in cloud computing and cybersecurity. I mostly build web applications
              and experiment with local AI tools.
            </p>
            <p className="mt-5 max-w-[62ch] leading-7 text-muted">
              AI helps me prototype, research, and test ideas faster, but I still take
              responsibility for understanding the implementation, checking its assumptions, and
              maintaining what I build.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {home.skills.map((skill) => (
                <SkillBadge key={skill._id} skill={skill} />
              ))}
            </div>
          </div>

          <div className="about-fact-stack">
            <article>
              <GraduationCap aria-hidden="true" size={19} />
              <div>
                <p className="font-tech text-[0.68rem] uppercase text-soft">Education</p>
                <h3>Diploma in Information Technology</h3>
                <p>Singapore Polytechnic · Cloud Computing and Cybersecurity</p>
              </div>
            </article>
            <article>
              <Network aria-hidden="true" size={19} />
              <div>
                <p className="font-tech text-[0.68rem] uppercase text-soft">Leadership</p>
                <h3>President, Apple Developer Society</h3>
                <p>Technical workshops, mentoring, committee direction, and student events.</p>
              </div>
            </article>
            <article>
              <Code2 aria-hidden="true" size={19} />
              <div>
                <p className="font-tech text-[0.68rem] uppercase text-soft">Approach</p>
                <h3>How I use AI</h3>
                <p>I use it to explore ideas, then read, test, and maintain the code myself.</p>
              </div>
            </article>
            <article>
              <MapPin aria-hidden="true" size={19} />
              <div>
                <p className="font-tech text-[0.68rem] uppercase text-soft">Based in</p>
                <h3>{settings.location ?? 'Singapore'}</h3>
                <p>Open to full-stack internships and software projects.</p>
              </div>
            </article>
          </div>
        </div>

        <div className="leadership-strip">
          <div>
            <p className="font-tech text-xs font-semibold uppercase tracking-[0.18em] text-primary-strong">
              Leadership and teaching
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink">
              What I do at Apple Developer Society.
            </h2>
          </div>
          <ul>
            {leadershipWork.map((item) => (
              <li key={item}>
                <span aria-hidden="true">↳</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section className="py-12 lg:py-16">
        <div className="section-heading-row">
          <div>
            <p className="font-tech text-xs font-semibold uppercase tracking-[0.18em] text-primary-strong">
              Writing
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.025em] text-ink sm:text-4xl">
              Notes from my projects.
            </h2>
          </div>
          <Link to="/blog" className="section-link pressable">
            Search all writing <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {home.highlightedPosts.slice(0, 3).map((post) => (
            <BlogCard key={post._id} post={post} compact />
          ))}
        </div>
      </Section>

      <Section className="pb-20 pt-12">
        <div className="contact-panel">
          <div>
            <p className="font-tech text-xs font-semibold uppercase tracking-[0.18em] text-primary-strong">
              Get in touch
            </p>
            <h2 className="mt-4 max-w-[20ch] font-display text-4xl font-semibold tracking-[-0.025em] text-ink sm:text-5xl">
              Open to internships and project work.
            </h2>
            <p className="mt-4 max-w-[62ch] text-muted">
              I want to work with experienced engineers, contribute code, and improve through real
              project work.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <ButtonLink href="/contact" variant="primary">
              Get in Touch
            </ButtonLink>
            {linkedinLink ? (
              <ButtonLink href={linkedinLink.url} variant="secondary" external>
                LinkedIn
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </Section>
    </>
  );
}
