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
