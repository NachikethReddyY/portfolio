import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const seed = JSON.parse(
  readFileSync(new URL("../src/content/seed.json", import.meta.url)),
);
const blueprints = JSON.parse(
  readFileSync(new URL("../src/content/case-blueprints.json", import.meta.url)),
);
test("each published project has a complete, distinct three-step explanatory blueprint", () => {
  assert.deepEqual(
    Object.keys(blueprints).sort(),
    seed.projects.map((p) => p.slug).sort(),
  );
  for (const [slug, study] of Object.entries(blueprints)) {
    assert.equal(study.steps.length, 3, slug);
    assert.equal(new Set(study.steps.map((s) => s.label)).size, 3, slug);
    assert.ok(study.title && study.summary && study.limit, slug);
    for (const step of study.steps) {
      assert.ok(
        step.label && step.detail && step.title && step.body.length > 100,
        slug,
      );
    }
  }
});
test("blueprint chapters have stable unique contents targets without replacing project facts", () => {
  for (const p of seed.projects) {
    const keys = p.body.map((b) => b._key);
    assert.ok(!keys.includes("project-blueprint"));
    assert.ok(p.role && p.status && p.body.length, p.slug);
  }
});
