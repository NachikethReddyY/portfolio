import { test } from "node:test";
import { createRss, createSitemap } from "../server/publishing.ts";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  mergeContent,
  convertLegacyProject,
  convertLegacyArticle,
  sanitizeRichBody,
} from "../src/content/merge.ts";
const seed = JSON.parse(
  readFileSync(new URL("../src/content/seed.json", import.meta.url)),
);
test("empty or malformed CMS results leave complete local portfolio available", () => {
  for (const value of [null, {}, { projects: [{ slug: "bad" }] }, "offline"])
    assert.deepEqual(mergeContent(seed, value), seed);
});
test("published overrides merge by slug rather than hiding other local projects", () => {
  const edited = { ...seed.projects[0], summary: "An edited summary" };
  const data = mergeContent(seed, { projects: [edited] });
  assert.equal(data.projects.length, seed.projects.length);
  assert.equal(data.projects[0].summary, "An edited summary");
});
test("legacy projects preserve direct links, content and images without overwriting newer editorial seed", () => {
  const legacy = {
    title: "Older project",
    slug: { current: "older-project" },
    summary: "A real project",
    status: "shipped",
    problem: "A problem",
    solution: "A solution",
    coverImage: { asset: { url: "https://cdn.sanity.io/cover.png" } },
    githubUrl: "https://github.com/person/repo",
    technologies: [{ title: "TypeScript" }],
  };
  const converted = convertLegacyProject(legacy);
  assert.equal(converted.slug, "older-project");
  assert.equal(converted.image, "https://cdn.sanity.io/cover.png");
  const data = mergeContent(seed, {
    legacyProjects: [
      legacy,
      { ...legacy, slug: { current: seed.projects[0].slug } },
    ],
  });
  assert.equal(data.projects[0].summary, seed.projects[0].summary);
  assert.ok(data.projects.some((p) => p.slug === "older-project"));
});
test("legacy post routes retain rich blocks and reject unsafe URLs recursively", () => {
  const post = convertLegacyArticle({
    title: "Existing note",
    slug: { current: "lah01" },
    excerpt: "A note",
    publishedAt: "2026-07-08",
    body: [
      { _type: "divider", _key: "a" },
      { _type: "button", _key: "b", href: "javascript:alert(1)", label: "Bad" },
    ],
  });
  assert.equal(post.slug, "lah01");
  assert.equal(post.legacyBody[0]._type, "divider");
  assert.equal(post.legacyBody[1].href, undefined);
  assert.equal(
    sanitizeRichBody([
      { _type: "image", asset: { url: "data:text/html,unsafe" } },
    ])[0].asset.url,
    undefined,
  );
});
test("an existing legacy document edited after the snapshot updates the site", () => {
  const project = seed.projects.find((p) => p.legacyRevision);
  const update = {
    title: project.name,
    slug: project.slug,
    summary: "New CMS edit",
    status: "building",
    _updatedAt: "2027-01-01T00:00:00Z",
  };
  const data = mergeContent(seed, { legacyProjects: [update] });
  const changed = data.projects.find((p) => p.slug === project.slug);
  assert.equal(changed.summary, "New CMS edit");
  assert.equal(changed.featured, project.featured);
});
test("legacy category inference matches AI terms rather than fragments inside ordinary words", () => {
  const base = {
    title: "Sustainability",
    slug: { current: "sustainable" },
    status: "shipped",
    technologies: [{ title: "HTML / CSS" }],
  };
  assert.equal(
    convertLegacyProject({
      ...base,
      summary: "An educational sustainability website for daily habits.",
    }).category,
    "Web applications",
  );
  assert.equal(
    convertLegacyProject({
      ...base,
      summary: "An AI-assisted local model agent.",
    }).category,
    "AI systems",
  );
});

test("published hide lists remove matching seed and remote entries and leave unrelated content intact", () => {
  const hiddenProject = seed.projects[0].slug;
  const hiddenArticle = seed.articles[0].slug;
  const result = mergeContent(seed, {
    hiddenProjects: [hiddenProject, null, { slug: seed.projects[1].slug }],
    hiddenArticles: [hiddenArticle],
    projects: [seed.projects[0]],
    articles: [seed.articles[0]],
  });
  assert.equal(result.projects.length, seed.projects.length - 1);
  assert.equal(result.articles.length, seed.articles.length - 1);
  assert.ok(!result.projects.some((p) => p.slug === hiddenProject));
  assert.ok(!result.articles.some((a) => a.slug === hiddenArticle));
  assert.ok(result.projects.some((p) => p.slug === seed.projects[1].slug));
  const rss = createRss(result, "https://example.com");
  const sitemap = createSitemap(result, "https://example.com");
  assert.ok(!rss.includes(`/writing/${hiddenArticle}</`));
  assert.ok(!sitemap.includes(`/writing/${hiddenArticle}</`));
  assert.ok(!sitemap.includes(`/projects/${hiddenProject}</`));
});
