import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { Post, Profile } from "../types";
import { fallbackPosts, profile as fallbackProfile } from "../data/fallback";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET ?? "production";
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION ?? "2026-06-27";

export const isSanityConfigured = Boolean(projectId);

const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null;

const builder = client ? imageUrlBuilder(client) : null;

const postFields = `
  title,
  "slug": slug.current,
  excerpt,
  category,
  readTime,
  publishedAt,
  tags,
  body,
  toc,
  footnotes,
  benchmarkRows,
  "coverImage": coverImage.asset
`;

export function urlFor(source: unknown) {
  return builder && source ? builder.image(source).width(1400).height(900).fit("crop").url() : undefined;
}

export async function getProfile(): Promise<Profile> {
  if (!client) return fallbackProfile;

  const data = await client.fetch<Profile | null>(`
    *[_type == "profile"][0]{
      name,
      intro,
      location,
      about,
      links,
      stats
    }
  `);

  return data ?? fallbackProfile;
}

export async function getPosts(limit?: number): Promise<Post[]> {
  if (!client) return limit ? fallbackPosts.slice(0, limit) : fallbackPosts;

  const query = `*[_type == "post" && status == "published"] | order(publishedAt desc) ${
    limit ? `[0...${limit}]` : ""
  } { ${postFields} }`;

  const posts = await client.fetch<Post[]>(query);
  return posts.length ? posts : limit ? fallbackPosts.slice(0, limit) : fallbackPosts;
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!client) return fallbackPosts.find((post) => post.slug === slug) ?? null;

  const post = await client.fetch<Post | null>(
    `*[_type == "post" && slug.current == $slug][0]{ ${postFields} }`,
    { slug },
  );

  return post ?? fallbackPosts.find((item) => item.slug === slug) ?? null;
}
