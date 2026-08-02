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
