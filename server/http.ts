import type { IncomingMessage, ServerResponse } from "node:http";
import { loadPublishedContent } from "./content.ts";
import { createRss, createSitemap, resolveSiteUrl } from "./publishing.ts";
export async function handlePublicApi(
  request: IncomingMessage,
  response: ServerResponse,
  kind: "content" | "rss" | "sitemap" | "health",
) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.statusCode = 405;
    response.setHeader("Allow", "GET, HEAD");
    response.end("Method not allowed");
    return;
  }
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader(
    "Cache-Control",
    kind === "health"
      ? "no-store"
      : "public, max-age=60, s-maxage=300, stale-while-revalidate=3600",
  );
  const result = await loadPublishedContent();
  const origin = resolveSiteUrl(process.env.VITE_SITE_URL);
  const body =
    kind === "rss"
      ? createRss(result.content, origin)
      : kind === "sitemap"
        ? createSitemap(result.content, origin)
        : JSON.stringify(
            kind === "health"
              ? { status: "ok", contentSource: result.source }
              : result.content,
          );
  response.setHeader(
    "Content-Type",
    kind === "rss"
      ? "application/rss+xml; charset=utf-8"
      : kind === "sitemap"
        ? "application/xml; charset=utf-8"
        : "application/json; charset=utf-8",
  );
  response.setHeader("X-Content-Source", result.source);
  response.statusCode = 200;
  response.end(request.method === "HEAD" ? undefined : body);
}
