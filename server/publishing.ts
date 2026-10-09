import { resolveSiteUrl } from "../src/content/site.ts";
export { resolveSiteUrl } from "../src/content/site.ts";
import type { PortfolioContent } from "../src/content/types.ts";
const escape = (value: string) =>
  value.replace(
    /[<>&"']/g,
    (character) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[character]!,
  );
export function createRss(content: PortfolioContent, origin: string): string {
  const base = resolveSiteUrl(origin);
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Nachiketh Reddy — Writing</title><link>${base}/writing</link><description>Notes on building software, local AI, and working with agents.</description><language>en</language><atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml"/>${content.articles.map((article) => `<item><title>${escape(article.title)}</title><link>${base}/writing/${article.slug}</link><guid isPermaLink="true">${base}/writing/${article.slug}</guid><pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate><description>${escape(article.excerpt)}</description></item>`).join("")}</channel></rss>`;
}
export function createSitemap(
  content: PortfolioContent,
  origin: string,
): string {
  const base = resolveSiteUrl(origin);
  const paths = [
    "/",
    "/projects",
    "/writing",
    ...content.projects.map((p) => `/projects/${p.slug}`),
    ...content.articles.map((p) => `/writing/${p.slug}`),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${escape(base + path)}</loc></url>`).join("")}</urlset>`;
}
