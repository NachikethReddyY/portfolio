import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { SiteSettings } from '../../lib/types';

type FooterProps = {
  settings: SiteSettings;
};

export function Footer({ settings }: FooterProps) {
  const primaryContact =
    settings.email != null
      ? { label: settings.email, url: `mailto:${settings.email}` }
      : settings.socialLinks.find((link) => link.kind === 'linkedin') ?? settings.socialLinks[0];

  return (
    <footer className="border-t-2 border-ink bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div>
          <Link to="/" className="font-display text-2xl font-black text-ink">
            {settings.name}
          </Link>
          <p className="mt-4 max-w-2xl text-pretty text-muted">{settings.shortBio}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
          <div>
            <p className="font-tech text-xs font-bold text-violet">Contact</p>
            {primaryContact ? (
              <a
                className="pressable hover-text-on-accent mt-2 inline-flex min-h-11 items-center gap-2 rounded-md border-2 border-ink bg-bg px-3 font-bold text-ink hover:bg-primary"
                href={primaryContact.url}
                target={primaryContact.url.startsWith('http') ? '_blank' : undefined}
                rel={primaryContact.url.startsWith('http') ? 'noreferrer' : undefined}
              >
                {primaryContact.label}
                <ArrowUpRight aria-hidden="true" size={16} />
              </a>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {settings.socialLinks.map((link) => (
              <a
                key={link._id}
                href={link.url}
                target={link.url.startsWith('http') ? '_blank' : undefined}
                rel={link.url.startsWith('http') ? 'noreferrer' : undefined}
                className="pressable hover-text-on-accent inline-flex min-h-11 items-center rounded-md border-2 border-ink bg-bg px-4 text-sm font-bold text-ink hover:bg-accent"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
