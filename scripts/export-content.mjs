import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { portfolioSchema } from "../src/content/validation.ts";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(
  projectRoot,
  process.env.CONTENT_EXPORT_OUTPUT ??
    "artifacts/content/portfolio-drafts.ndjson",
);

const content = portfolioSchema.parse(
  JSON.parse(
    readFileSync(new URL("../src/content/seed.json", import.meta.url)),
  ),
);

const pick = (value, fields) =>
  Object.fromEntries(
    fields.flatMap((field) =>
      value[field] === undefined ? [] : [[field, value[field]]],
    ),
  );

const validArrayKey = (value) =>
  typeof value === "string" &&
  /^[A-Za-z0-9_-]+$/.test(value) &&
  value.length <= 128;

const uniqueArrayKey = (value, index, used) => {
  const base = validArrayKey(value) ? value : `item-${index}`;
  let key = base;
  let suffix = 1;

  while (used.has(key)) {
    key = `${base}-${suffix}`;
    suffix += 1;
  }

  used.add(key);
  return key;
};

// Sanity requires a unique _key on every object in an object array, including
// nested Portable Text children and mark definitions.
const addArrayKeys = (value) => {
  if (Array.isArray(value)) {
    const used = new Set();

    return value.map((item, index) => {
      const object =
        item && typeof item === "object" && !Array.isArray(item)
          ? { ...item, _key: uniqueArrayKey(item._key, index, used) }
          : item;

      return addArrayKeys(object);
    });
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, addArrayKeys(entry)]),
    );
  }

  return value;
};

const withDocumentMeta = (source, _id, _type, fields) =>
  addArrayKeys({
    _id,
    _type,
    ...pick(source, fields),
  });

const toSlug = (slug) => ({ _type: "slug", current: slug });

const docs = [
  withDocumentMeta(content.profile, "drafts.profile-nachiketh-v2", "profile", [
    "name",
    "role",
    "aspiration",
    "location",
    "availability",
    "intro",
    "about",
    "personal",
    "github",
    "linkedin",
    "instagram",
    "x",
    "email",
    "tools",
    "contributions",
  ]),
  ...content.projects.map((project) =>
    withDocumentMeta(
      {
        ...project,
        slug: toSlug(project.slug),
      },
      `drafts.case-study-${project.slug}`,
      "caseStudy",
      [
        "slug",
        "name",
        "category",
        "summary",
        "headline",
        "status",
        "year",
        "image",
        "imageAlt",
        "accent",
        "stack",
        "role",
        "featured",
        "links",
        "body",
      ],
    ),
  ),
  ...content.articles
    .filter((article) => article.body.length)
    .map((article) =>
      withDocumentMeta(
        {
          ...article,
          slug: toSlug(article.slug),
        },
        `drafts.article-${article.slug}`,
        "article",
        [
          "slug",
          "title",
          "excerpt",
          "cover",
          "category",
          "publishedAt",
          "readMinutes",
          "featured",
          "body",
          "sources",
        ],
      ),
    ),
  ...content.experience.map((entry) =>
    withDocumentMeta(entry, `drafts.experience-${entry.id}`, "experience", [
      "id",
      "organization",
      "title",
      "period",
      "kind",
      "description",
      "url",
    ]),
  ),
];

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(
  outputPath,
  docs.map((doc) => JSON.stringify(doc)).join("\n") + "\n",
);

console.log(
  `Exported ${docs.length} drafts to ${outputPath}. No Sanity data was changed.`,
);
