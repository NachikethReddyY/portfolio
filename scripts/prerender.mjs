import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { render } from "../.evidence/build-ssr/entry-server.js";
import { resolveSiteUrl } from "../server/publishing.ts";
import { loadPublishedContent } from "../server/content.ts";
import { parse } from "parse5";
const { content, source } = await loadPublishedContent();
let template = readFileSync("dist/index.html", "utf8")
  .replace(
    /<script id="portfolio-content" type="application\/json">[\s\S]*?<\/script>/g,
    "",
  )
  .replace(/<link rel="canonical"[^>]*>/g, "")
  .replace(/<meta (?:property="og:[^"]+"|name="twitter:[^"]+")[^>]*>/g, "");
const findRoot = (node) =>
  node.attrs?.some((a) => a.name === "id" && a.value === "root")
    ? node
    : node.childNodes?.map(findRoot).find(Boolean);
const root = findRoot(parse(template, { sourceCodeLocationInfo: true }));
if (!root?.sourceCodeLocation?.startTag || !root.sourceCodeLocation.endTag)
  throw new Error("Missing prerender root");
template =
  template.slice(0, root.sourceCodeLocation.startTag.endOffset) +
  template.slice(root.sourceCodeLocation.endTag.startOffset);
const snapshot = `<script id="portfolio-content" type="application/json">${JSON.stringify(content).replace(/</g, "\\u003c")}</script>`;
const base = resolveSiteUrl(process.env.VITE_SITE_URL);
const escape = (value) =>
  value.replace(
    /[<>&"']/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[c],
  );
const routes = [
  {
    path: "/404",
    title: "Page not found — Nachiketh Reddy",
    description:
      "This page could not be found. Return home or explore Nachiketh’s projects.",
    noindex: true,
  },
  {
    path: "/",
    title: "Nachiketh Reddy — Full-stack developer & aspiring AI engineer",
    description:
      "Student developer in Singapore building web applications, local AI tools, and agent workflows. Available for internships and projects.",
  },
  {
    path: "/projects",
    title: "Projects — Nachiketh Reddy",
    description:
      "Web applications, local AI tools, and experiments by Nachiketh Reddy.",
  },
  {
    path: "/writing",
    title: "Writing — Nachiketh Reddy",
    description:
      "Notes from building software, working with AI, and learning by doing.",
  },
  ...content.projects.map((p) => ({
    path: `/projects/${p.slug}`,
    title: `${p.name} — Nachiketh Reddy`,
    description: p.summary,
    image: p.image,
  })),
  ...content.articles.map((a) => ({
    path: `/writing/${a.slug}`,
    title: `${a.title} — Nachiketh Reddy`,
    description: a.excerpt,
    type: "article",
    image: a.cover,
  })),
];
for (const route of routes) {
  const canonical = base + route.path;
  const image = new URL(route.image || "/images/nachiketh-sketch.webp", base)
    .href;
  const tags = `${route.noindex ? '<meta name="robots" content="noindex">' : ""}<link rel="canonical" href="${escape(canonical)}"><meta property="og:title" content="${escape(route.title)}"><meta property="og:description" content="${escape(route.description)}"><meta property="og:url" content="${escape(canonical)}"><meta property="og:image" content="${escape(image)}"><meta property="og:type" content="${route.type || "website"}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:creator" content="@Nachikethreddyy">`;
  const markup = (await render(route.path, content)).replace(
    /<template\b[^>]*>[\s\S]*?<\/template>/g,
    "",
  );
  const html = template
    .replace(/<title>.*?<\/title>/, `<title>${escape(route.title)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*">/,
      `<meta name="description" content="${escape(route.description)}">`,
    )
    .replace("</head>", tags + "</head>")
    .replace("</body>", snapshot + "</body>")
    .replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
  const folder = route.path === "/" ? "dist" : `dist${route.path}`;
  mkdirSync(folder, { recursive: true });
  writeFileSync(`${folder}/index.html`, html);
  if (route.path === "/404") writeFileSync("dist/404.html", html);
}
writeFileSync(
  "dist/route-manifest.json",
  JSON.stringify(routes.map((route) => route.path)),
);
console.log(
  `Content source: ${source}. Prerendered ${routes.length} public routes with readable HTML and social metadata.`,
);
