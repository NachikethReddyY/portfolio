import { ArrowDownLeft, Code2, Mail, Network } from 'lucide-react';

import { Seo } from '../components/Seo';
import { Section } from '../components/ui/Section';
import { SkillBadge } from '../components/ui/SkillBadge';
import { usePageSettings } from '../hooks/usePageSettings';
import { useSanityQuery } from '../hooks/useSanityQuery';
import { fallbackSkills } from '../lib/fallbackData';
import { allSkillsQuery } from '../lib/sanity/queries';
import type { Skill } from '../lib/types';

const socialIconMap = {
  github: Code2,
  linkedin: Network,
  email: Mail,
  resume: Mail,
  other: Network,
};

export function AboutPage() {
  const settings = usePageSettings();
  const { data: skills } = useSanityQuery<Skill[]>(allSkillsQuery, fallbackSkills);
  const featuredLinks = settings.socialLinks.slice(0, 5);

  return (
    <>
      <Seo
        title={`About | ${settings.name}`}
        description={settings.shortBio ?? `${settings.name} is a ${settings.role}.`}
      />
      <Section className="pb-10 pt-10 sm:pt-16 lg:pt-20">
        <div className="relative grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="dot-field absolute bottom-0 left-[18rem] hidden h-96 w-[42rem] opacity-45 lg:block" />
          <div className="relative z-10">
            <p className="mb-5 font-tech text-sm font-bold text-primary-strong">{settings.role}</p>
            <h1 className="mega-heading text-ink">
              <span className="block">About</span>
              <span className="block">Me</span>
            </h1>
            <ArrowDownLeft
              aria-hidden="true"
              className="mt-6 text-ink sm:ml-[24rem] sm:-mt-10"
              size={52}
              strokeWidth={2.5}
            />
            <div className="mt-10 max-w-2xl space-y-5 text-lg font-bold leading-8 text-ink text-pretty">
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
            <div className="mt-8 flex flex-wrap gap-4">
              {featuredLinks.map((link) => {
                const Icon = socialIconMap[link.kind] ?? Network;

                return (
                  <a
                    key={link._id}
                    href={link.url}
                    target={link.url.startsWith('http') ? '_blank' : undefined}
                    rel={link.url.startsWith('http') ? 'noreferrer' : undefined}
                    className="pressable grid size-12 place-items-center border-2 border-ink bg-terminal text-ink hover:bg-primary hover-text-on-accent"
                    aria-label={link.label}
                  >
                    <Icon aria-hidden="true" size={22} strokeWidth={2.4} />
                  </a>
                );
              })}
            </div>
          </div>
          <figure className="creator-art-frame relative z-10 min-h-[34rem]">
            <img
              src="/assets/nachiketh-editorial-tech.png"
              alt="Illustrated student developer working at a laptop with Singapore skyline, network cables, and AI nodes"
            />
          </figure>
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <h2 className="font-display text-4xl text-ink">Working style</h2>
            <p className="mt-3 text-muted">
              A simple operating system for better projects: ask the right question, build the
              smallest credible version, then turn the experiment into evidence.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {['Clear scope', 'Useful defaults', 'Accessible polish'].map((item, index) => (
              <article key={item} className="brutal-panel-soft rounded-none p-5">
                <p className="font-tech text-sm font-bold text-primary-strong">0{index + 1}</p>
                <h3 className="mt-3 font-display text-2xl text-ink">{item}</h3>
                <p className="mt-3 text-muted">
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

      <Section className="pt-8">
        <div className="brutal-panel rounded-none p-6 sm:p-8">
          <h2 className="font-display text-4xl text-ink">Skills</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {skills.map((skill) => (
              <SkillBadge key={skill._id} skill={skill} />
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
