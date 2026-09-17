import test from "node:test";
import assert from "node:assert/strict";
import { parse, evaluate } from "groq-js";
import { contentQuery } from "../src/content/query.ts";

test("published content query resolves image uploads, preserves legacy revisions, and excludes drafts and future articles", async () => {
  const upload = { asset: { _type: "reference", _ref: "image-cover" } };
  const dataset = [
    {
      _id: "image-cover",
      _type: "sanity.imageAsset",
      url: "https://cdn.sanity.io/cover.webp",
    },
    {
      _id: "project-current",
      _type: "caseStudy",
      slug: { current: "current" },
      year: "2026",
      coverUpload: upload,
      body: [
        { _type: "contentImage", _key: "picture", upload, alt: "A project" },
      ],
    },
    {
      _id: "drafts.project-draft",
      _type: "caseStudy",
      slug: { current: "draft" },
    },
    {
      _id: "article-now",
      _type: "article",
      slug: { current: "published" },
      publishedAt: "2000-01-01T00:00:00Z",
      coverUpload: upload,
    },
    {
      _id: "article-future",
      _type: "article",
      slug: { current: "future" },
      publishedAt: "2099-01-01T00:00:00Z",
    },
    {
      _id: "drafts.article-draft",
      _type: "article",
      slug: { current: "draft" },
      publishedAt: "2000-01-01T00:00:00Z",
    },
    {
      _id: "project-old",
      _type: "project",
      title: "Existing project",
      slug: { current: "existing" },
      summary: "Existing summary",
      _updatedAt: "2026-09-17T14:00:00Z",
    },
    {
      _id: "post-old",
      _type: "post",
      title: "Existing article",
      slug: { current: "old-note" },
      publishedAt: "2000-01-01T00:00:00Z",
      _updatedAt: "2026-09-17T15:00:00Z",
    },
  ];
  const result = await (await evaluate(parse(contentQuery), { dataset })).get();
  assert.deepEqual(
    result.projects.map((p) => p.slug),
    ["current"],
  );
  assert.equal(result.projects[0].image, "https://cdn.sanity.io/cover.webp");
  assert.equal(
    result.projects[0].body[0].url,
    "https://cdn.sanity.io/cover.webp",
  );
  assert.deepEqual(result.projects[0].links, []);
  assert.deepEqual(
    result.articles.map((a) => a.slug),
    ["published"],
  );
  assert.equal(result.articles[0].cover, "https://cdn.sanity.io/cover.webp");
  assert.deepEqual(result.articles[0].sources, []);
  assert.equal(result.legacyProjects[0]._updatedAt, "2026-09-17T14:00:00Z");
  assert.equal(result.legacyArticles[0]._updatedAt, "2026-09-17T15:00:00Z");
});
