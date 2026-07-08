import { Outlet } from 'react-router-dom';

import { fallbackSiteSettings } from '../../lib/fallbackData';
import { siteSettingsQuery } from '../../lib/sanity/queries';
import type { SiteSettings } from '../../lib/types';
import { useSanityQuery } from '../../hooks/useSanityQuery';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

export function PageLayout() {
  const { data: settings } = useSanityQuery<SiteSettings>(
    siteSettingsQuery,
    fallbackSiteSettings,
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg text-ink">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <pre className="absolute right-4 top-24 max-w-[44rem] rotate-[-5deg] font-tech text-[0.72rem] leading-6 text-primary/10 sm:text-sm">
          {`const portfolio = {
  owner: "Nachiketh Reddy",
  stack: ["react", "sanity", "ai", "security"],
  mode: "ship / learn / repeat",
  signal: "repo-backed evidence"
}`}
        </pre>
        <svg
          className="absolute left-4 top-[28rem] size-[22rem] text-ink/10 sm:size-[30rem]"
          viewBox="0 0 520 520"
          fill="none"
        >
          <path d="M40 352L150 244L238 286L360 134L480 186" stroke="currentColor" strokeWidth="3" />
          <path d="M72 110H242V206H72V110Z" stroke="currentColor" strokeWidth="3" />
          <path d="M306 306H456V426H306V306Z" stroke="currentColor" strokeWidth="3" />
          <path d="M242 158H344M344 158V306" stroke="currentColor" strokeWidth="3" />
          <circle cx="150" cy="244" r="12" stroke="currentColor" strokeWidth="3" />
          <circle cx="360" cy="134" r="12" stroke="currentColor" strokeWidth="3" />
        </svg>
        <div className="dot-field absolute bottom-0 right-0 h-[34rem] w-full max-w-[56rem] opacity-45" />
      </div>
      <div className="relative z-10">
        <Navbar settings={settings} />
        <main id="main-content">
          <Outlet context={{ settings }} />
        </main>
        <Footer settings={settings} />
      </div>
    </div>
  );
}
