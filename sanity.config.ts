import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import { schemaTypes } from './sanity/schemaTypes';
import { structure } from './sanity/structure';

declare const process:
  | {
      env?: Record<string, string | undefined>;
    }
  | undefined;

const env = typeof process === 'undefined' ? {} : (process.env ?? {});
const projectId = env.SANITY_STUDIO_PROJECT_ID || '508uqyvi';
const dataset = env.SANITY_STUDIO_DATASET || 'production';

export default defineConfig({
  name: 'nachiketh-portfolio',
  title: 'Nachiketh Reddy Portfolio CMS',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
