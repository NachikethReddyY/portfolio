import test from "node:test";
import assert from "node:assert/strict";
import { parse, evaluate } from "groq-js";
import { contentQuery } from "../src/content/query.ts";

test("published content query resolves image uploads, preserves legacy revisions, and excludes drafts and future articles", async () => {
  const upload = {
    asset: { _type: "reference", _ref: "image-cover" },
    crop: { left: 0.1, top: 0.2, right: 0, bottom: 0 },
  };
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
  assert.deepEqual(result.projects[0].coverUpload.crop, upload.crop);
  assert.equal(
    result.projects[0].coverUpload.asset.url,
    "https://cdn.sanity.io/cover.webp",
  );
  assert.deepEqual(result.projects[0].body[0].upload.crop, upload.crop);
  assert.equal(
    Object.hasOwn(result.projects[0], "gallery"),
    false,
    "an absent gallery keeps the local fallback intact",
  );
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

test("published visibility controls suppress hidden and rescheduled seed entries without leaking draft choices", async () => {
  const dataset = [
    {
      _id: "case-hidden",
      _type: "caseStudy",
      slug: { current: "hidden-project" },
      hidden: true,
    },
    {
      _id: "drafts.case-draft",
      _type: "caseStudy",
      slug: { current: "draft-choice" },
      hidden: true,
    },
    {
      _id: "article-hidden",
      _type: "article",
      slug: { current: "hidden-note" },
      hidden: true,
      publishedAt: "2000-01-01T00:00:00Z",
    },
    {
      _id: "article-future",
      _type: "article",
      slug: { current: "rescheduled-note" },
      publishedAt: "2099-01-01T00:00:00Z",
    },
    {
      _id: "drafts.article-hidden",
      _type: "article",
      slug: { current: "draft-note" },
      hidden: true,
    },
    { _id: "experience-b", _type: "experience", id: "leadership", order: 2 },
    { _id: "experience-a", _type: "experience", id: "education", order: 1 },
  ];
  const result = await (await evaluate(parse(contentQuery), { dataset })).get();
  assert.deepEqual(result.projects, []);
  assert.deepEqual(result.articles, []);
  assert.deepEqual(result.hiddenProjects, ["hidden-project"]);
  assert.deepEqual(result.hiddenArticles, ["hidden-note", "rescheduled-note"]);
  assert.deepEqual(
    result.experience.map((x) => x.id),
    ["education", "leadership"],
  );
});

test("project gallery uploads and external images retain editorial order and empty gallery intent", async () => {
  const result = await (
    await evaluate(parse(contentQuery), {
      dataset: [
        {
          _id: "asset-gallery",
          _type: "sanity.imageAsset",
          url: "https://cdn.sanity.io/gallery.webp",
        },
        {
          _id: "gallery-case",
          _type: "caseStudy",
          slug: { current: "gallery" },
          gallery: [
            {
              _key: "uploaded",
              _type: "contentImage",
              upload: { asset: { _ref: "asset-gallery" } },
              alt: "Uploaded screenshot",
              caption: "First",
            },
            {
              _key: "external",
              _type: "contentImage",
              url: "https://example.com/second.webp",
              alt: "External screenshot",
              caption: "Second",
            },
          ],
        },
        {
          _id: "empty-case",
          _type: "caseStudy",
          slug: { current: "empty" },
          gallery: [],
        },
      ],
    })
  ).get();
  const gallery = result.projects.find((p) => p.slug === "gallery").gallery;
  assert.equal(gallery[0].url, "https://cdn.sanity.io/gallery.webp");
  assert.equal(gallery[0].caption, "First");
  assert.equal(gallery[1].url, "https://example.com/second.webp");
  assert.deepEqual(result.projects.find((p) => p.slug === "empty").gallery, []);
});
