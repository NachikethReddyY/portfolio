import { createImageUrlBuilder } from '@sanity/image-url';

import { hasSanityConfig, sanityClient } from './client';
import type { SanityImage } from '../types';

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
