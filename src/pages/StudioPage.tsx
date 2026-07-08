import { Studio } from 'sanity';

import config from '../../sanity.config';

export function StudioPage() {
  return <Studio config={config} />;
}
