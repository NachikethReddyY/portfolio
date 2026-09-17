import type { PortfolioContent } from "../content/types.ts";

export type StarterSlug = {
  _type?: "slug";
  current: string;
};

export type StarterDocument = {
  _id: string;
  _type: string;
  title?: string;
  name?: string;
  slug?: StarterSlug;
  [key: string]: unknown;
};

export type ExistingDocumentRecord = {
  _id: string;
  _type: string;
  id?: string;
  slug?: { current: string };
};

const pick = (value: object, fields: string[]) => {
  const source = value as Record<string, unknown>;

  return Object.fromEntries(
    fields.flatMap((field) =>
      source[field] === undefined ? [] : [[field, source[field]]],
    ),
  );
};

const validArrayKey = (value: unknown) =>
  typeof value === "string" &&
  /^[A-Za-z0-9_-]+$/.test(value) &&
  value.length <= 128;

const uniqueArrayKey = (value: unknown, index: number, used: Set<string>) => {
  const base = validArrayKey(value) ? String(value) : `item-${index}`;
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
const addArrayKeys = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    const used = new Set<string>();

    return value.map((item, index) => {
      const object =
        item && typeof item === "object" && !Array.isArray(item)
          ? {
              ...(item as Record<string, unknown>),
              _key: uniqueArrayKey(
                (item as Record<string, unknown>)._key,
                index,
                used,
              ),
            }
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

const withDocumentMeta = (
  source: object,
  _id: string,
  _type: StarterDocument["_type"],
  fields: string[],
): StarterDocument =>
  addArrayKeys({
    _id,
    _type,
    ...pick(source, fields),
  }) as StarterDocument;

const toSlug = (slug: string): StarterSlug => ({
  _type: "slug",
  current: slug,
});

export function createStarterDocuments(
  content: PortfolioContent,
): StarterDocument[] {
  return [
    withDocumentMeta(
      content.profile,
      "drafts.profile-nachiketh-v2",
      "profile",
      [
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
      ],
    ),
    ...content.projects.map((project) =>
      withDocumentMeta(
        {
          ...project,
          gallery: (project.gallery ?? []).map((image) => ({
            ...image,
            _type: "contentImage",
          })),
          hidden: false,
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
          "gallery",
          "accent",
          "stack",
          "role",
          "featured",
          "hidden",
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
            hidden: false,
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
            "hidden",
            "body",
            "sources",
          ],
        ),
      ),
    ...content.experience.map((entry, order) =>
      withDocumentMeta(
        { ...entry, order },
        `drafts.experience-${entry.id}`,
        "experience",
        [
          "order",
          "id",
          "organization",
          "title",
          "period",
          "kind",
          "description",
          "url",
        ],
      ),
    ),
  ];
}

const idVariants = (id: string) => {
  const publishedId = id.startsWith("drafts.") ? id.slice(7) : id;
  return [id, publishedId, `drafts.${publishedId}`];
};

const slugCurrent = (value: unknown) => {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return undefined;

  const current = (value as { current?: unknown }).current;
  return typeof current === "string" ? current : undefined;
};

export function selectMissingStarterDocuments(
  documents: StarterDocument[],
  existingRecords: ExistingDocumentRecord[],
): StarterDocument[] {
  const existingIds = new Set(
    existingRecords.flatMap((record) => idVariants(record._id)),
  );

  return documents.filter((document) => {
    if (idVariants(document._id).some((id) => existingIds.has(id)))
      return false;

    // Profile is a singleton, so any existing record covers the starter even
    // when Studio assigned it an unrelated document ID.
    if (document._type === "profile") {
      return !existingRecords.some((record) => record._type === document._type);
    }

    // Experience has independent records. Its stable content ID is separate
    // from Sanity's document ID, so only suppress the matching starter.
    if (document._type === "experience") {
      const id = typeof document.id === "string" ? document.id : undefined;
      return !existingRecords.some(
        (record) => record._type === "experience" && record.id === id,
      );
    }

    const slug = slugCurrent(document.slug);
    return (
      !slug ||
      !existingRecords.some(
        (record) =>
          record._type === document._type && slugCurrent(record.slug) === slug,
      )
    );
  });
}
