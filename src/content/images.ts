import { createImageUrlBuilder } from "@sanity/image-url";
import { z } from "zod";

const fraction = z.number().min(0).max(1);
const cropSchema = z
  .object({
    left: fraction,
    right: fraction,
    top: fraction,
    bottom: fraction,
  })
  .refine((crop) => crop.left + crop.right < 1 && crop.top + crop.bottom < 1);

/** Resolve the editor's crop before validation strips Sanity-specific metadata. */
export function applyImageCrop(source: string, metadata: unknown): string {
  const parsed = z.object({ crop: cropSchema }).safeParse(metadata);
  if (!parsed.success) return source;
  try {
    const url = new URL(source);
    const match = url.pathname.match(/^\/images\/([^/]+)\/([^/]+)\/[^/]+$/);
    if (url.hostname !== "cdn.sanity.io" || !match) return source;
    const generated = createImageUrlBuilder({
      projectId: match[1],
      dataset: match[2],
    })
      .image({
        asset: { url: `${url.origin}${url.pathname}` },
        crop: parsed.data.crop,
      })
      .url();
    const rect = new URL(generated).searchParams.get("rect");
    if (rect) url.searchParams.set("rect", rect);
    return url.href;
  } catch {
    return source;
  }
}

/** Bound Sanity image downloads while leaving local and third-party assets intact. */
export function portfolioImage(source: string, width: number): string {
  try {
    const url = new URL(source);
    if (
      url.hostname !== "cdn.sanity.io" ||
      !url.pathname.startsWith("/images/")
    )
      return source;
    url.searchParams.set("w", String(width));
    if (!url.searchParams.has("fit")) url.searchParams.set("fit", "max");
    url.searchParams.set("auto", "format");
    url.searchParams.set("q", "82");
    return url.href;
  } catch {
    return source;
  }
}
