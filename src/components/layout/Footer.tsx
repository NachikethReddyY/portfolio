import { ArrowRight, ArrowUpRight, Code2, Mail, Network } from 'lucide-react';
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
  const githubLink = settings.socialLinks.find((link) => link.kind === 'github');
  const linkedinLink = settings.socialLinks.find((link) => link.kind === 'linkedin');
  const socialIcons = [
    githubLink ? { ...githubLink, iconClass: 'devicon-github-original' } : null,
    linkedinLink ? { ...linkedinLink, iconClass: 'devicon-linkedin-plain' } : null,
    primaryContact ? { _id: 'footer-mail', label: 'Email', url: primaryContact.url, Icon: Mail } : null,
  ].filter((item) => item != null);
  const year = new Date().getFullYear();

  return (
    <footer className="cyber-footer px-4 py-8 sm:px-6 lg:px-8">
      <div className="footer-console mx-auto max-w-7xl">
        <div className="grid min-h-[24rem] lg:grid-cols-[9rem_1fr]">
          <div className="grid place-items-center border-b border-[var(--footer-line)] p-6 lg:border-b-0 lg:border-r">
            <Link to="/" className="footer-mark" aria-label={`${settings.name} home`}>
              <img src="/assets/nachiketh-dark-profile-v3.png" alt="" className="site-logo-img" />
            </Link>
          </div>

          <div className="grid gap-10 p-6 sm:p-8 lg:grid-cols-[0.75fr_0.75fr_0.9fr_1fr] lg:p-12">
            <div>
              <h2 className="footer-heading">About</h2>
              <div className="footer-link-list">
                <Link to="/about">
                  <Network aria-hidden="true" size={15} /> About
                </Link>
                <Link to="/contact">
                  <Mail aria-hidden="true" size={15} /> Contact
                </Link>
                {settings.resumeUrl ? (
                  <a href={settings.resumeUrl} target="_blank" rel="noreferrer">
                    <ArrowUpRight aria-hidden="true" size={15} /> Resume
                  </a>
                ) : null}
              </div>
            </div>

            <div>
              <h2 className="footer-heading">Build</h2>
              <div className="footer-link-list">
                <Link to="/projects">
                  <Code2 aria-hidden="true" size={15} /> Projects
                </Link>
                <Link to="/blog">
                  <Network aria-hidden="true" size={15} /> Writing
                </Link>
                {githubLink ? (
                  <a href={githubLink.url} target="_blank" rel="noreferrer">
                    <Code2 aria-hidden="true" size={15} /> GitHub
                  </a>
                ) : null}
              </div>
            </div>

            <div>
              <h2 className="footer-heading">Focus</h2>
              <div className="footer-link-list">
                <span>Full-stack apps</span>
                <span>Local AI tools</span>
                <span>Security practice</span>
                <span>Clear project evidence</span>
              </div>
            </div>

            <div>
              <h2 className="footer-heading">Build useful software.</h2>
              <p className="mt-7 max-w-sm font-tech text-sm font-semibold leading-7 text-[var(--footer-muted)]">
                {settings.availability}
              </p>
              {primaryContact ? (
                <a
                  className="footer-cta pressable"
                  href={primaryContact.url}
                  target={primaryContact.url.startsWith('http') ? '_blank' : undefined}
                  rel={primaryContact.url.startsWith('http') ? 'noreferrer' : undefined}
                >
                  Connect <ArrowRight aria-hidden="true" size={22} />
                </a>
              ) : null}

              <h2 className="footer-heading mt-12">Social networks</h2>
              <div className="mt-7 flex flex-wrap gap-5">
                {socialIcons.map((item) => {
                  if (item == null) return null;
                  const Icon = 'Icon' in item ? item.Icon : null;
                  const isInternal = item.url.startsWith('/');
                  const icon = 'iconClass' in item && item.iconClass ? (
                    <i aria-hidden="true" className={item.iconClass} />
                  ) : Icon ? (
                    <Icon aria-hidden="true" size={20} />
                  ) : null;

                  return isInternal ? (
                    <Link key={item._id} to={item.url} className="footer-social" aria-label={item.label}>
                      {icon}
                    </Link>
                  ) : (
                    <a
                      key={item._id}
                      href={item.url}
                      target={item.url.startsWith('http') ? '_blank' : undefined}
                      rel={item.url.startsWith('http') ? 'noreferrer' : undefined}
                      className="footer-social"
                      aria-label={item.label}
                    >
                      {icon}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="footer-brand-strip">
          <Link to="/" className="footer-wordmark">
            Nachiketh Reddy
          </Link>
          <div aria-hidden="true" className="footer-circuit" />
        </div>
      </div>

      <div className="footer-legal mx-auto mt-6 max-w-7xl">
        <div className="flex flex-wrap gap-6">
          <Link to="/contact">
            <Mail aria-hidden="true" size={14} /> Contact
          </Link>
          <Link to="/projects">
            <Code2 aria-hidden="true" size={14} /> Projects
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <p>Copyright {year} © {settings.name}. All rights reserved.</p>
          <Link to="/" className="footer-monogram" aria-label={`${settings.name} home`}>
            <img src="/assets/nachiketh-dark-profile-v3.png" alt="" className="site-logo-img" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
