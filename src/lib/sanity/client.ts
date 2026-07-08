import { createClient } from '@sanity/client';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || '508uqyvi';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2026-07-08';

export const hasSanityConfig = Boolean(projectId && projectId !== 'your-project-id');

export const sanityClient = hasSanityConfig
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: 'published',
    })
  : null;

export async function fetchSanity<T>(
  query: string,
  params: Record<string, string | number | boolean> = {},
): Promise<T | null> {
  if (!sanityClient) {
    return null;
  }

  return sanityClient.fetch<T>(query, params);
}
