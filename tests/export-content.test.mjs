import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";
import { schemaTypes } from "../src/cms/schema.ts";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const keyPattern = /^[A-Za-z0-9_-]+$/;
const schemaFields = Object.fromEntries(
  schemaTypes
    .filter((schema) => schema.type === "document")
    .map((schema) => [schema.name, schema.fields.map((field) => field.name)]),
);
const requiredFields = {
  profile: schemaFields.profile.filter(
    (field) =>
      ![
        "email",
        "about",
        "personal",
        "instagram",
        "x",
        "tools",
        "contributions",
      ].includes(field),
  ),
  caseStudy: schemaFields.caseStudy.filter(
    (field) => !["image", "coverUpload"].includes(field),
  ),
  article: schemaFields.article.filter(
    (field) => !["cover", "coverUpload"].includes(field),
  ),
  experience: schemaFields.experience.filter((field) => field !== "url"),
};

const assertArrayKeys = (value, path) => {
  if (Array.isArray(value)) {
    const objectItems = value.filter(
      (item) => item && typeof item === "object" && !Array.isArray(item),
    );
    const keys = objectItems.map((item) => item._key);

    assert.equal(
      keys.length,
      new Set(keys).size,
      `${path} contains duplicate _key values`,
    );
    for (const [index, key] of keys.entries()) {
      assert.equal(typeof key, "string", `${path}[${index}] is missing _key`);
      assert.match(key, keyPattern, `${path}[${index}] has an invalid _key`);
      assert.ok(key.length <= 128, `${path}[${index}] _key is too long`);
    }

    value.forEach((item, index) => assertArrayKeys(item, `${path}[${index}]`));
    return;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, entry]) =>
      assertArrayKeys(entry, `${path}.${key}`),
    );
  }
};

test("content export is schema-shaped and keys every object array", () => {
  const temporaryDirectory = mkdtempSync(join(tmpdir(), "portfolio-export-"));
  const outputPath = join(temporaryDirectory, "portfolio-drafts.ndjson");

  try {
    execFileSync(process.execPath, ["scripts/export-content.mjs"], {
      cwd: projectRoot,
      env: { ...process.env, CONTENT_EXPORT_OUTPUT: outputPath },
      stdio: "pipe",
    });

    const documents = readFileSync(outputPath, "utf8")
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));

    assert.ok(documents.length > 0);
    for (const document of documents) {
      assert.match(document._id, /^drafts\.[A-Za-z0-9_-]+$/);
      assert.ok(schemaFields[document._type], `unknown type ${document._type}`);

      const fields = Object.keys(document).filter(
        (field) => field !== "_id" && field !== "_type",
      );
      assert.ok(
        fields.every((field) => schemaFields[document._type].includes(field)),
        `${document._type} contains fields outside the current schema`,
      );

      for (const field of requiredFields[document._type]) {
        assert.ok(field in document, `${document._type} is missing ${field}`);
      }

      assertArrayKeys(document, document._id);
    }
  } finally {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  }
});
