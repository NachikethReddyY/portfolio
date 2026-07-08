import { Code2, Mail, Network } from 'lucide-react';

import { Seo } from '../components/Seo';
import { ButtonLink } from '../components/ui/ButtonLink';
import { Section } from '../components/ui/Section';
import { usePageSettings } from '../hooks/usePageSettings';

const iconMap = {
  github: Code2,
  linkedin: Network,
  email: Mail,
  resume: Mail,
  other: Mail,
};

export function ContactPage() {
  const settings = usePageSettings();
  const primaryContact =
    settings.email != null
      ? { label: 'Email me', url: `mailto:${settings.email}` }
      : settings.socialLinks.find((link) => link.kind === 'linkedin') ?? settings.socialLinks[0];

  return (
    <>
      <Seo
        title={`Contact | ${settings.name}`}
        description={`Contact ${settings.name} for internships, AI projects, full-stack collaborations, and hackathons.`}
      />
      <Section className="pb-16 pt-14 sm:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <h1 className="font-display text-5xl font-black leading-[0.98] text-balance text-ink sm:text-6xl">
              Have a role, project, or sharp piece of feedback?
            </h1>
            <p className="mt-6 max-w-2xl text-xl font-semibold leading-8 text-primary-strong text-pretty">
              I am open to internships, hackathons, AI tooling work, full-stack projects, and teams
              that care about useful software more than buzzwords.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {primaryContact ? (
                <ButtonLink href={primaryContact.url} variant="primary" external>
                  {primaryContact.label}
                </ButtonLink>
              ) : null}
              {settings.resumeUrl ? (
                <ButtonLink href={settings.resumeUrl} variant="secondary" external>
                  Resume
                </ButtonLink>
              ) : null}
            </div>
          </div>

          <aside className="brutal-panel rounded-lg p-5 sm:p-6">
            <h2 className="font-display text-2xl font-black text-ink">Useful links</h2>
            <div className="mt-5 grid gap-3">
              {settings.socialLinks.map((link) => {
                const Icon = iconMap[link.kind] ?? Mail;
                return (
                  <a
                    key={link._id}
                    href={link.url}
                    target={link.url.startsWith('http') ? '_blank' : undefined}
                    rel={link.url.startsWith('http') ? 'noreferrer' : undefined}
                    className="pressable hover-text-on-accent flex min-h-14 items-center gap-3 rounded-md border-2 border-ink bg-surface px-4 font-bold text-ink hover:bg-accent"
                  >
                    <Icon aria-hidden="true" size={20} />
                    <span>{link.label}</span>
                  </a>
                );
              })}
            </div>
            <div className="mt-6 border-y-2 border-ink bg-primary py-4">
              <p className="px-1 font-tech text-xs font-bold uppercase text-on-accent">Availability</p>
              <p className="mt-2 px-1 font-semibold text-on-accent">{settings.availability}</p>
              {settings.location ? (
                <p className="text-on-accent-soft mt-2 px-1 text-sm font-semibold">{settings.location}</p>
              ) : null}
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
