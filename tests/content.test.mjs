import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { portfolioSchema, articleSchema } from "../src/content/validation.ts";
const seed = JSON.parse(
  readFileSync(new URL("../src/content/seed.json", import.meta.url)),
);
test("all narrative seed content satisfies editorial contract and unique routes", () => {
  const data = portfolioSchema.parse(seed);
  for (const group of [data.projects, data.articles]) {
    assert.equal(new Set(group.map((item) => item.slug)).size, group.length);
    for (const item of group)
      assert.ok(
        item.body.length >= 3 ||
          (Array.isArray(item.legacyBody) && item.legacyBody.length >= 3),
      );
  }
});
test("unsafe content links and invalid article dates are rejected", () => {
  const article = seed.articles[0];
  assert.equal(
    articleSchema.safeParse({
      ...article,
      sources: [{ label: "Bad", url: "javascript:alert(1)" }],
    }).success,
    false,
  );
  assert.equal(
    articleSchema.safeParse({ ...article, publishedAt: "not-a-date" }).success,
    false,
  );
});
