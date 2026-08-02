import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Seo } from '../components/Seo';
import { Section } from '../components/ui/Section';
import { usePageSettings } from '../hooks/usePageSettings';
import { useSanityQuery } from '../hooks/useSanityQuery';
import { fallbackSkills } from '../lib/fallbackData';
import { allSkillsQuery } from '../lib/sanity/queries';
import type { Skill } from '../lib/types';

const skillIconClasses: Record<string, string> = {
  typescript: 'devicon-typescript-plain',
  'react-nextjs': 'devicon-react-original',
  nextjs: 'devicon-nextjs-plain',
  'node-express': 'devicon-nodejs-plain',
  'python-local-ai': 'devicon-python-plain',
  'postgresql-supabase': 'devicon-postgresql-plain',
  supabase: 'devicon-supabase-plain',
  mysql: 'devicon-mysql-original',
  'secure-coding-owasp': 'devicon-linux-plain',
  'expo-mobile': 'devicon-expo-original',
  'cli-systems-tools': 'devicon-bash-plain',
  'agent-architecture': 'devicon-bash-plain',
};

const principles = [
  {
    title: 'Start with the people and task',
    description: 'Before choosing a framework, I find out who will use the software, what they need to do, and which questions are still unanswered.',
  },
  {
    title: 'Finish the main task first',
    description: 'I would rather make the most important feature work well than leave many features half-finished.',
  },
  {
    title: 'Review what AI produces',
    description: 'AI helps me explore options quickly, but I still read the implementation, test assumptions, and own the result.',
  },
];

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

      <Section className="pb-12 pt-12 sm:pt-16 lg:pb-20 lg:pt-20">
        <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="relative z-10">
            <p className="font-tech text-xs font-bold uppercase tracking-[0.16em] text-primary-strong">
              About Nachiketh
            </p>
            <h1 className="about-heading mt-4 text-[var(--about-ink)]">I build to understand.</h1>
            <div className="mt-8 max-w-[66ch] space-y-5 text-base font-semibold leading-8 text-[var(--about-ink)] text-pretty">
              <p>
                I am a Year 2 Information Technology student at Singapore Polytechnic,
                specialising in cloud computing and cybersecurity.
              </p>
              <p>
                Most of my work is web development. I use React, TypeScript, Node.js, and
                PostgreSQL. I also test local models, automation tools, and Linux.
              </p>
              <p>
                I learn best by building something real. That has taken me from documenting a
                tablet-first workflow for community vision-screening events to developing a
                terminal-based AI agent harness with two friends.
              </p>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              {githubLink ? (
                <a href={githubLink.url} target="_blank" rel="noreferrer" className="about-start-button pressable px-4">
                  <i aria-hidden="true" className="devicon-github-original about-devicon about-devicon-github" />
                  GitHub
                </a>
              ) : null}
              {linkedinLink ? (
                <a href={linkedinLink.url} target="_blank" rel="noreferrer" className="about-start-button pressable px-4">
                  <i aria-hidden="true" className="devicon-linkedin-plain about-devicon about-devicon-linkedin" />
                  LinkedIn
                </a>
              ) : null}
              <Link to="/projects" className="about-start-button pressable px-4">
                View Work <ArrowUpRight aria-hidden="true" size={17} />
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

      <Section className="py-12 lg:py-20">
        <div className="principle-panel">
          <p className="font-tech text-xs font-bold uppercase tracking-[0.16em] text-primary-strong">
            AI and coding
          </p>
          <h2 className="mt-5 max-w-[24ch] font-display text-4xl text-[var(--about-ink)] sm:text-5xl">
            I use AI, then check the work.
          </h2>
          <p className="mt-6 max-w-[72ch] text-lg leading-8 text-[var(--about-muted)]">
            I use AI to research, prototype, and debug. I still read the code, test it, and check
            the documentation. If I cannot explain or maintain the result, it is not ready to ship.
          </p>
        </div>
      </Section>

      <Section className="py-12 lg:py-20">
        <div className="border-t border-[var(--about-line)] pt-10">
          <div className="max-w-3xl">
            <p className="font-tech text-xs font-bold uppercase tracking-[0.16em] text-primary-strong">
              How I work
            </p>
            <h2 className="mt-3 font-display text-4xl text-[var(--about-ink)]">How I approach projects</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {principles.map((item, index) => (
              <article key={item.title} className="about-work-card">
                <p className="font-tech text-sm font-bold text-[var(--about-blue-soft)]">0{index + 1}</p>
                <h3 className="mt-4 font-display text-2xl text-[var(--about-ink)]">{item.title}</h3>
                <p className="mt-4 text-[var(--about-muted)]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-12 lg:py-20">
        <div className="leadership-grid">
          <div>
            <p className="font-tech text-xs font-bold uppercase tracking-[0.16em] text-primary-strong">
              Leadership and community
            </p>
            <h2 className="mt-3 font-display text-4xl text-[var(--about-ink)]">
              Apple Developer Society at Singapore Polytechnic
            </h2>
          </div>
          <div className="grid gap-7">
            <article>
              <p className="font-tech text-xs font-bold uppercase text-primary-strong">President · Apr 2026–present</p>
              <p className="mt-3 text-[var(--about-muted)]">
                I help set the society roadmap, coordinate the committee and stakeholders, plan
                major activities, and communicate our direction. Current work includes the Swift
                Nano Bootcamp and National Software Competition 2026.
              </p>
            </article>
            <article className="border-t border-[var(--about-line)] pt-7">
              <p className="font-tech text-xs font-bold uppercase text-primary-strong">Sub-Committee Member · Jul 2025–Apr 2026</p>
              <p className="mt-3 text-[var(--about-muted)]">
                I created workshop material, explained Swift and SwiftUI concepts such as state,
                mentored participants, debugged code I did not write, and supported event delivery.
              </p>
            </article>
          </div>
        </div>
      </Section>

      <Section className="py-12 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <article className="about-work-card">
            <p className="font-tech text-xs font-bold uppercase text-primary-strong">Education</p>
            <h2 className="mt-4 font-display text-3xl text-[var(--about-ink)]">Singapore Polytechnic</h2>
            <p className="mt-3 font-semibold text-[var(--about-ink)]">Diploma in Information Technology</p>
            <p className="mt-2 text-[var(--about-muted)]">Apr 2025–approximately Feb 2028 · Cloud Computing and Cybersecurity</p>
            <h3 className="mt-8 font-display text-2xl text-[var(--about-ink)]">Montfort Secondary School</h3>
            <p className="mt-2 text-[var(--about-muted)]">Jan 2021–Dec 2024</p>
          </article>
          <article className="about-work-card">
            <p className="font-tech text-xs font-bold uppercase text-primary-strong">Career direction</p>
            <h2 className="mt-4 font-display text-3xl text-[var(--about-ink)]">What I want to do next.</h2>
            <p className="mt-4 text-[var(--about-muted)]">
              I am looking for a full-stack role where I can work on web applications and learn
              from experienced engineers. I also want to keep building AI tools and learning more
              about cloud computing and security.
            </p>
          </article>
        </div>
      </Section>

      <Section className="py-12 lg:py-20">
        <div className="grid gap-8 border-y border-[var(--about-line)] py-10 lg:grid-cols-2">
          <article>
            <p className="font-tech text-xs font-bold uppercase text-primary-strong">Selected certifications</p>
            <ul className="mt-5 grid gap-3 text-[var(--about-muted)]">
              <li>Statistical Thinking in Python, Part 1</li>
              <li>Learn Express.js</li>
              <li>Google Prompting Essentials</li>
              <li>Claude Code in Action and Claude 101</li>
              <li>Data Scientist Associate</li>
              <li>Rock Your LinkedIn Profile</li>
            </ul>
          </article>
          <article>
            <p className="font-tech text-xs font-bold uppercase text-primary-strong">Awards and service</p>
            <ul className="mt-5 grid gap-3 text-[var(--about-muted)]">
              <li>People&apos;s Choice Award · Autodesk Singapore Hackathon 2026</li>
              <li>Best Unit Cadet</li>
              <li>NPCC Unit Proficiency Overall Gold</li>
              <li>Accessibility volunteer · Apple Developer Center Singapore</li>
              <li>Freshman Orientation speaker · Apple Developer Society</li>
            </ul>
          </article>
        </div>
      </Section>

      <Section className="py-12 lg:py-20">
        <div className="about-directory p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr]">
            <div>
              <h2 className="font-display text-4xl text-[var(--about-ink)]">Tools I have used</h2>
              <p className="mt-3 max-w-[46ch] text-[var(--about-muted)]">
                Context, not percentage bars. My strongest current tools are TypeScript, React,
                Node.js, and PostgreSQL; the rest reflect working knowledge or active exploration.
              </p>
            </div>
            <div className="flex flex-wrap content-start gap-3">
              {skills.map((skill) => (
                <span key={skill._id} className="about-skill-tag px-3">
                  <i aria-hidden="true" className={[skillIconClasses[skill.slug] ?? 'devicon-devicon-plain', 'about-devicon'].join(' ')} />
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
