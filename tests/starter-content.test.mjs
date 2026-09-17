import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  createStarterDocuments,
  selectMissingStarterDocuments,
} from "../src/cms/starterContent.ts";
import { portfolioSchema } from "../src/content/validation.ts";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const seed = portfolioSchema.parse(
  JSON.parse(readFileSync(join(projectRoot, "src/content/seed.json"), "utf8")),
);

test("starter documents preserve the exporter output and keys", () => {
  const temporaryDirectory = mkdtempSync(join(tmpdir(), "starter-content-"));
  const outputPath = join(temporaryDirectory, "portfolio-drafts.ndjson");

  try {
    execFileSync(process.execPath, ["scripts/export-content.mjs"], {
      cwd: projectRoot,
      env: { ...process.env, CONTENT_EXPORT_OUTPUT: outputPath },
      stdio: "pipe",
    });

    const exported = readFileSync(outputPath, "utf8");
    const starters = createStarterDocuments(seed);
    assert.equal(starters.length, 32);
    assert.equal(
      exported,
      starters.map((document) => JSON.stringify(document)).join("\n") + "\n",
    );
    assert.ok(
      starters.every(
        (document) =>
          document._id.startsWith("drafts.") &&
          typeof document._type === "string",
      ),
    );
  } finally {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  }
});

test("starter selection skips draft or published IDs and same-type slugs", () => {
  const starters = createStarterDocuments(seed);
  const profile = starters.find((document) => document._type === "profile");
  const experiences = starters.filter(
    (document) => document._type === "experience",
  );
  const caseStudies = starters.filter(
    (document) => document._type === "caseStudy",
  );
  assert.ok(profile);
  assert.ok(experiences.length >= 3);
  assert.ok(caseStudies.length >= 3);

  const [publishedIdMatch, draftIdMatch, slugMatch] = caseStudies;
  const existingRecords = [
    {
      _id: publishedIdMatch._id.replace(/^drafts\./, ""),
      _type: publishedIdMatch._type,
    },
    { _id: draftIdMatch._id, _type: draftIdMatch._type },
    {
      _id: "case-study-existing-slug",
      _type: slugMatch._type,
      slug: { current: slugMatch.slug.current },
    },
    { _id: "profile-created-in-studio", _type: profile._type },
  ];

  const selected = selectMissingStarterDocuments(starters, existingRecords);
  assert.equal(
    selected.some(({ _id }) => _id === publishedIdMatch._id),
    false,
  );
  assert.equal(
    selected.some(({ _id }) => _id === draftIdMatch._id),
    false,
  );
  assert.equal(
    selected.some(({ _id }) => _id === slugMatch._id),
    false,
  );
  assert.equal(
    selected.some(({ _id }) => _id === profile._id),
    false,
  );

  const existingWithStableExperienceId = selectMissingStarterDocuments(
    [profile, ...experiences],
    [
      { _id: "profile-with-unrelated-id", _type: "profile" },
      {
        _id: "experience-with-unrelated-id",
        _type: "experience",
        id: experiences[1].id,
      },
    ],
  );
  assert.equal(
    existingWithStableExperienceId.some(({ _id }) => _id === profile._id),
    false,
  );
  assert.equal(
    existingWithStableExperienceId.some(
      ({ _id }) => _id === experiences[1]._id,
    ),
    false,
  );
  assert.deepEqual(
    existingWithStableExperienceId.map(({ _id }) => _id),
    [experiences[0]._id, experiences[2]._id],
  );

  const sameSlugDifferentType = selectMissingStarterDocuments(
    [slugMatch],
    [
      {
        _id: "article-with-same-slug",
        _type: "article",
        slug: { current: slugMatch.slug.current },
      },
    ],
  );
  assert.deepEqual(sameSlugDifferentType, [slugMatch]);
});

test("case-study starter drafts preserve gallery order, alt text and captions", () => {
  const starters = createStarterDocuments(seed);
  for (const project of seed.projects) {
    const document = starters.find(
      (item) => item._id === `drafts.case-study-${project.slug}`,
    );
    assert.ok(Array.isArray(document.gallery));
    assert.deepEqual(
      document.gallery.map(({ url, alt, caption }) => ({
        url,
        alt,
        ...(caption === undefined ? {} : { caption }),
      })),
      project.gallery ?? [],
    );
    assert.ok(
      document.gallery.every(
        (image) =>
          image._type === "contentImage" && typeof image._key === "string",
      ),
    );
  }
});
