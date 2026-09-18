import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { parse } from "parse5";
import { portfolioSchema } from "../src/content/validation.ts";
const routes = JSON.parse(readFileSync("dist/route-manifest.json", "utf8"));
assert.ok(routes.length >= 3);
assert.equal(
  new Set(routes).size,
  routes.length,
  "route manifest contains no duplicates",
);

function descendants(node) {
  return [node, ...(node.childNodes || []).flatMap(descendants)];
}
function attr(node, key) {
  return node.attrs?.find((a) => a.name === key)?.value;
}
const titles = new Set();
for (const path of routes) {
  const html = readFileSync(
    `dist${path === "/" ? "" : path}/index.html`,
    "utf8",
  );
  const nodes = descendants(parse(html));
  const snapshots = nodes.filter((n) => attr(n, "id") === "portfolio-content");
  assert.equal(snapshots.length, 1, `${path}: one browser content snapshot`);
  const content = portfolioSchema.parse(
    JSON.parse(snapshots[0].childNodes.map((n) => n.value || "").join("")),
  );
  assert.ok(
    content.projects.every((project) =>
      routes.includes(`/projects/${project.slug}`),
    ) &&
      content.articles.every((article) =>
        routes.includes(`/writing/${article.slug}`),
      ),
    `${path}: initial browser content matches prerendered routes`,
  );
  const heading = nodes.filter((n) => n.tagName === "h1");
  assert.equal(heading.length, 1, `${path}: one primary heading`);
  const title = nodes
    .find((n) => n.tagName === "title")
    .childNodes.map((n) => n.value || "")
    .join("");
  assert.ok(!titles.has(title), `${path}: unique page title`);
  titles.add(title);
  assert.equal(
    nodes.filter((n) => n.tagName === "link" && attr(n, "rel") === "canonical")
      .length,
    1,
    `${path}: canonical`,
  );
  assert.ok(
    !html.includes("Loading article…"),
    `${path}: rich article rendered`,
  );
  for (const node of nodes.filter((n) => n.tagName === "img")) {
    assert.ok(
      node.attrs.some((a) => a.name === "alt"),
      `${path}: image alternative`,
    );
    const source = attr(node, "src");
    if (source?.startsWith("/"))
      assert.ok(existsSync(`dist${source}`), `${path}: ${source} exists`);
  }
  for (const node of nodes.filter((n) => n.tagName === "a")) {
    const href = attr(node, "href");
    if (!href?.startsWith("/") || href.startsWith("//")) continue;
    const target = href.split("#")[0].split("?")[0] || "/";
    assert.ok(
      routes.includes(target) || ["/rss.xml", "/sitemap.xml"].includes(target),
      `${path}: internal link ${href} resolves`,
    );
  }
}
if (routes.includes("/writing/lah01")) {
  const legacy = readFileSync("dist/writing/lah01/index.html", "utf8");
  assert.ok(
    legacy.includes("Local AI setups have a problem"),
    "legacy article text exists before JavaScript",
  );
  assert.ok(
    !legacy.includes('hidden id="S:'),
    "legacy article text is not hidden behind streaming JavaScript",
  );
}
console.log(
  `Verified ${routes.length} prerendered routes: headings, metadata, local images, internal links, and readable legacy article.`,
);

// Rich content remains readable in the pre-render even when its optional engines are lazy.
const { render } = await import("../.evidence/build-ssr/entry-server.js");
const fixture = JSON.parse(readFileSync("src/content/seed.json", "utf8"));
const fixtureArticle = fixture.articles[0];
fixtureArticle.body = [];
fixtureArticle.legacyBody = [
  { _key: "math-proof", _type: "mathBlock", equation: "E = mc^2" },
  {
    _key: "diagram-proof",
    _type: "mermaidDiagram",
    code: "flowchart LR\nA[Research] --> B[Build]",
  },
];
const richHtml = await render(`/writing/${fixtureArticle.slug}`, fixture);
assert.ok(
  richHtml.includes('class="katex"'),
  "math is pre-rendered before JavaScript",
);
assert.ok(
  richHtml.includes("flowchart LR"),
  "diagram source is readable before its engine loads",
);
assert.ok(
  !richHtml.includes("Loading article…"),
  "lazy rich-content modules resolve before publishing",
);
console.log(
  "Verified rich article pre-render: equation output and diagram source fallback.",
);

// Missing URLs must render recovery content before JavaScript, including nested content routes.
for (const path of [
  "/not-a-real-page",
  "/projects/not-a-project",
  "/writing/not-an-article",
]) {
  const missingHtml = await render(path, fixture);
  const missingNodes = descendants(parse(missingHtml));
  assert.equal(
    missingNodes.filter((n) => n.tagName === "h1").length,
    1,
    `${path}: one recovery heading`,
  );
  assert.ok(
    missingHtml.includes("Page not found"),
    `${path}: custom recovery content`,
  );
  for (const target of ["/", "/projects"]) {
    assert.ok(
      missingNodes.some((n) => n.tagName === "a" && attr(n, "href") === target),
      `${path}: recovery link ${target}`,
    );
  }
}
assert.ok(
  readFileSync("dist/404.html", "utf8").includes(
    'name="robots" content="noindex"',
  ),
  "static 404 is non-indexable",
);
console.log(
  "Verified unknown, missing-project and missing-article recovery, plus static 404 output.",
);

const homeHtml = await render("/", fixture);
const homeNodes = descendants(parse(homeHtml));
const aiTrigger = homeNodes.find(
  (n) => n.tagName === "button" && attr(n, "class") === "ai-role",
);
assert.ok(aiTrigger, "AI engineer has its own keyboard/touch trigger");
assert.equal(
  attr(aiTrigger, "aria-label"),
  "AI engineer: prompt to model to output",
);
const aiAspiration = homeNodes.find(
  (n) => n.tagName === "p" && attr(n, "class") === "hero-aspiration",
);
assert.ok(
  aiAspiration.childNodes.some(
    (n) => n.nodeName === "#text" && n.value.includes("Aspiring"),
  ),
  "Aspiring is outside the AI interaction",
);
assert.ok(
  homeHtml.includes('data-entrance="complete"'),
  "server-rendered hero remains visible before JavaScript",
);
console.log(
  "Verified independent AI role trigger and readable pre-JavaScript hero.",
);
