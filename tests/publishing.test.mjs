import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  createRss,
  createSitemap,
  resolveSiteUrl,
} from "../server/publishing.ts";
const content = JSON.parse(
  readFileSync(new URL("../src/content/seed.json", import.meta.url)),
);
test("RSS escapes editorial text and links each published article to its stable route", () => {
  const copy = {
    ...content,
    articles: [
      {
        ...content.articles[0],
        title: "A < B & C",
        excerpt: 'A "quote" & more',
      },
    ],
  };
  const xml = createRss(copy, "https://portfolio.example");
  assert.ok(xml.includes("A &lt; B &amp; C"));
  assert.ok(!xml.includes("< B"));
  assert.ok(
    xml.includes(`https://portfolio.example/writing/${copy.articles[0].slug}`),
  );
});
test("sitemap covers every retained project and article but excludes the content editor", () => {
  const xml = createSitemap(content, "https://portfolio.example");
  for (const p of content.projects)
    assert.ok(xml.includes(`/projects/${p.slug}`));
  for (const p of content.articles)
    assert.ok(xml.includes(`/writing/${p.slug}`));
  assert.ok(!xml.includes("/studio"));
});
test("canonical base does not trust request host and rejects malformed configured origins", () => {
  assert.equal(resolveSiteUrl(undefined), "https://nachikethreddyy.vercel.app");
  assert.equal(
    resolveSiteUrl("https://example.org/path"),
    "https://example.org",
  );
  assert.equal(
    resolveSiteUrl("javascript:alert(1)"),
    "https://nachikethreddyy.vercel.app",
  );
});
