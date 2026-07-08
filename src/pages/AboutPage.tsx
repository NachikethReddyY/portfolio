import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Seo } from '../components/Seo';
import { Section } from '../components/ui/Section';
import { usePageSettings } from '../hooks/usePageSettings';
import { useSanityQuery } from '../hooks/useSanityQuery';
import { fallbackSkills } from '../lib/fallbackData';
import { allSkillsQuery } from '../lib/sanity/queries';
import type { Skill } from '../lib/types';

const skillIconClasses: Record<string, string> = {
  'typescript': 'devicon-typescript-plain',
  'react-nextjs': 'devicon-react-original',
  'node-express': 'devicon-nodejs-plain',
  'python-local-ai': 'devicon-python-plain',
  'postgresql-supabase': 'devicon-postgresql-plain',
  'secure-coding-owasp': 'devicon-linux-plain',
  'expo-mobile': 'devicon-expo-original',
  'cli-systems-tools': 'devicon-bash-plain',
};

export function AboutPage() {
  const settings = usePageSettings();
  const { data: skills } = useSanityQuery<Skill[]>(allSkillsQuery, fallbackSkills);
  const githubLink = settings.socialLinks.find((link) => link.kind === 'github');
  const linkedinLink = settings.socialLinks.find((link) => link.kind === 'linkedin');

  return (
    <div className="about-cyber">
      <Seo
        title={`About | ${settings.name}`}
        description={settings.shortBio ?? `${settings.name} is a ${settings.role}.`}
      />
      <Section className="pb-12 pt-12 sm:pt-16 lg:pb-16 lg:pt-20">
        <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="relative z-10">
            <h1 className="about-heading text-[var(--about-ink)]">
              About Me
            </h1>
            <p className="mt-5 max-w-[60ch] font-tech text-sm font-bold leading-6 text-[var(--about-blue-soft)]">
              {settings.role}
            </p>
            <ArrowDownLeft
              aria-hidden="true"
              className="absolute right-0 top-0 hidden text-[var(--about-blue-soft)] sm:block"
              size={38}
              strokeWidth={2.5}
            />
            <div className="mt-8 max-w-[60ch] space-y-4 text-base font-semibold leading-7 text-[var(--about-ink)] text-pretty">
              <p>{settings.shortBio}</p>
              <p>
                I am a <span className="gold-link">Year 2 IT Diploma student</span> at Singapore
                Polytechnic building toward full-stack and AI roles where product thinking matters:
                typed app code, APIs, databases, local AI workflows, and project stories that show
                how decisions were made.
              </p>
              <p>
                My current focus is getting better at the whole engineering loop: framing the
                problem, making the UI usable, connecting backend state, understanding security, and
                experimenting with <span className="gold-link">local model tooling</span>.
              </p>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              {githubLink ? (
                <a
                  href={githubLink.url}
                  target="_blank"
                  rel="noreferrer"
                  className="about-start-button pressable px-4"
                >
                  <i aria-hidden="true" className="devicon-github-original about-devicon about-devicon-github" />
                  GitHub
                </a>
              ) : null}
              {linkedinLink ? (
                <a
                  href={linkedinLink.url}
                  target="_blank"
                  rel="noreferrer"
                  className="about-start-button pressable px-4"
                >
                  <i aria-hidden="true" className="devicon-linkedin-plain about-devicon about-devicon-linkedin" />
                  LinkedIn
                </a>
              ) : null}
              <Link to="/projects" className="about-start-button pressable px-4">
                Projects <ArrowUpRight aria-hidden="true" size={17} />
              </Link>
            </div>
          </div>
          <figure className="about-portrait-frame relative z-10">
            <img
              src="/assets/nachiketh-dark-profile-v3.png"
              alt="Editorial portrait illustration of Nachiketh Reddy"
            />
          </figure>
        </div>
      </Section>

      <Section className="py-12 lg:py-16">
        <div className="border-t border-[var(--about-line)] pt-10">
          <div className="max-w-3xl">
            <h2 className="font-display text-4xl text-[var(--about-ink)]">Working style</h2>
            <p className="mt-3 max-w-[42ch] text-[var(--about-muted)]">
              A simple operating system for better projects: ask the right question, build the
              smallest credible version, then turn the experiment into evidence.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {['Clear scope', 'Useful defaults', 'Accessible polish'].map((item, index) => (
              <article key={item} className="about-work-card">
                <p className="font-tech text-sm font-bold text-[var(--about-blue-soft)]">0{index + 1}</p>
                <h3 className="mt-4 font-display text-2xl text-[var(--about-ink)]">{item}</h3>
                <p className="mt-4 text-[var(--about-muted)]">
                  {item === 'Clear scope'
                    ? 'I translate loose ideas into visible goals, constraints, and next actions.'
                    : item === 'Useful defaults'
                      ? 'I design schemas, APIs, and interfaces that make good outcomes easier.'
                      : 'I treat security, responsiveness, keyboard access, and recovery states as part of the work.'}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-12 lg:py-16">
        <div className="about-directory p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr]">
            <div>
              <h2 className="font-display text-4xl text-[var(--about-ink)]">Skills</h2>
              <p className="mt-3 max-w-[42ch] text-[var(--about-muted)]">
                The tools behind the work, kept as rectangular signals rather than a logo wall.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span key={skill._id} className="about-skill-tag px-3">
                  <i
                    aria-hidden="true"
                    className={[
                      skillIconClasses[skill.slug] ?? 'devicon-devicon-plain',
                      'about-devicon',
                    ].join(' ')}
                  />
                  {skill.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
