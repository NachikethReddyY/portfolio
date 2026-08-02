import { createImageUrlBuilder } from '@sanity/image-url';

import { hasSanityConfig, sanityClient } from './client';
import type { Project, SanityImage } from '../types';

const builder = sanityClient ? createImageUrlBuilder(sanityClient) : null;

export function imageUrlFor(image?: SanityImage, width = 1200) {
  if (!image) {
    return undefined;
  }

  if (image.asset?.url) {
    return image.asset.url;
  }

  if (!hasSanityConfig || !builder || !image.asset?._ref) {
    return undefined;
  }

  return builder.image(image).width(width).auto('format').fit('max').url();
}

export function projectCoverUrlFor(project: Project, width: number) {
  const repository = project.githubUrl?.match(/^https:\/\/github\.com\/([^/]+\/[^/#?]+)/i)?.[1];

  return imageUrlFor(project.coverImage, width) ||
    (repository ? `https://opengraph.githubassets.com/1/${repository}` : undefined);
}
