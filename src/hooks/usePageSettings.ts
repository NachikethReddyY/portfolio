import { useOutletContext } from 'react-router-dom';

import type { SiteSettings } from '../lib/types';

export function usePageSettings() {
  return useOutletContext<{ settings: SiteSettings }>().settings;
}
