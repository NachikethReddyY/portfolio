import {
  articleSchema,
  caseStudySchema,
  profileSchema,
  experienceSchema,
} from "./validation.ts";
import { applyImageCrop } from "./images.ts";
import type {
  PortfolioContent,
  CaseStudy,
  Article,
  ContentBlock,
} from "./types.ts";

type RecordValue = Record<string, unknown>;
const record = (value: unknown): RecordValue =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as RecordValue)
    : {};
const string = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;
const list = (value: unknown) => (Array.isArray(value) ? value : []);
const slugOf = (value: unknown) =>
  typeof value === "string" ? value : string(record(value).current);
const web = (value: unknown) =>
  typeof value === "string" && /^https?:\/\//.test(value) ? value : undefined;
export function imageSource(value: unknown): string {
  const image = record(value),
    asset = record(image.asset);
  const direct = web(image.url) || web(asset.url);
  if (direct) return applyImageCrop(direct, image);
  const ref = string(asset._ref).match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/);
  const source = ref
    ? `https://cdn.sanity.io/images/508uqyvi/production/${ref[1]}-${ref[2]}.${ref[3]}`
    : "";
  return applyImageCrop(source, image);
}

function resolveEditorialImages(value: unknown): RecordValue {
  const document = record(value);
  const cover = imageSource(document.coverUpload);
  const resolveImage = (value: unknown) => {
    const image = record(value);
    return { ...image, url: imageSource(image.upload) || image.url };
  };
  return {
    ...document,
    ...(cover ? { image: cover, cover } : {}),
    ...(Array.isArray(document.gallery)
      ? { gallery: document.gallery.map(resolveImage) }
      : {}),
    ...(Array.isArray(document.body)
      ? {
          body: document.body.map((block) =>
            record(block)._type === "contentImage"
              ? resolveImage(block)
              : block,
          ),
        }
      : {}),
  };
}
// Existing Studio blocks are preserved; URLs remain data, never executable protocols.
export function sanitizeRichBody(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeRichBody);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).flatMap(([key, entry]) => {
        if (
          ["href", "url", "src"].includes(key) &&
          typeof entry === "string" &&
          !/^(https?:\/\/|mailto:|\/(?!\/)|#)/.test(entry)
        )
          return [];
        return [[key, sanitizeRichBody(entry)]];
      }),
    );
  return value;
}
function paragraph(
  text: string,
  key: string,
  style: "normal" | "h2" = "normal",
): ContentBlock {
  return {
    _type: "block",
    _key: key,
    style,
    children: [{ _type: "span", _key: `${key}-text`, text, marks: [] }],
    markDefs: [],
  };
}
export function convertLegacyProject(value: unknown): CaseStudy | null {
  const p = record(value);
  if (!p.title || !slugOf(p.slug) || !p.summary) return null;
  const body: ContentBlock[] = [];
  const sections = [
    ["The problem", p.problem],
    ["The approach", p.solution],
    ["My part", p.whatIBuilt],
    ["Constraints", p.constraints],
    ["Features", p.features],
    ["What I learned", p.lessonsLearned],
    ["What comes next", p.futureImprovements],
  ];
  sections.forEach(([title, content], index) => {
    const texts = Array.isArray(content)
      ? content.filter((x) => typeof x === "string")
      : [string(content)].filter(Boolean);
    if (!texts.length) return;
    body.push(paragraph(String(title), `section-${index}`, "h2"));
    texts.forEach((text, i) =>
      body.push(paragraph(text, `section-${index}-${i}`)),
    );
  });
  const summary = string(p.summary);
  if (!body.length) body.push(paragraph(summary, "overview"));
  const technologies = list(p.technologies)
    .map((t) => string(record(t).title))
    .filter(Boolean);
  const category = /\b(?:AI|agents?|models?|inference|whisper|CoreML)\b/i.test(
    [summary, ...technologies].join(" "),
  )
    ? "AI systems"
    : "Web applications";
  const status: Record<string, string> = {
    shipped: "Built",
    building: "In development",
    experiment: "Experiment",
    archived: "Archived",
  };
  const links = [
    { label: "Source code", url: web(p.githubUrl) },
    { label: "Live project", url: web(p.demoUrl) },
  ].filter((link): link is { label: string; url: string } => Boolean(link.url));
  const result = caseStudySchema.safeParse({
    slug: slugOf(p.slug),
    name: string(p.title),
    category,
    summary,
    headline: string(p.impact, summary),
    status: status[string(p.status)] || "Project",
    year: string(p.period) || string(p.sortDate).slice(0, 4) || "Earlier work",
    image: imageSource(p.coverImage),
    imageAlt: string(record(p.coverImage).alt, string(p.title)),
    accent: category === "AI systems" ? "lavender" : "mint",
    stack: technologies,
    role: string(p.role, "Developer"),
    featured: false,
    links,
    body,
    legacyRevision: string(p._updatedAt) || undefined,
    legacyBody: sanitizeRichBody(p.body),
    gallery: list(p.gallery)
      .map((image) => ({
        url: imageSource(image),
        alt: string(record(image).alt, string(p.title)),
        caption: string(record(image).caption),
      }))
      .filter((i) => i.url),
  });
  return result.success ? result.data : null;
}
export function convertLegacyArticle(value: unknown): Article | null {
  const p = record(value);
  if (!p.title || !p.publishedAt) return null;
  const words = JSON.stringify(p.body || "").split(/\s+/).length;
  const result = articleSchema.safeParse({
    slug: slugOf(p.slug),
    title: p.title,
    excerpt: p.excerpt || "",
    category: "Building",
    publishedAt: p.publishedAt,
    readMinutes: Math.max(1, Math.ceil(words / 220)),
    featured: false,
    body: [],
    legacyRevision: string(p._updatedAt) || undefined,
    legacyBody: sanitizeRichBody(p.body),
    cover: imageSource(p.featuredImage),
    sources: [],
  });
  return result.success ? result.data : null;
}
function valid<T>(
  items: unknown,
  parse: (v: unknown) => { success: boolean; data?: T },
): T[] {
  return list(items).flatMap((item) => {
    const result = parse(item);
    return result.success && result.data ? [result.data] : [];
  });
}
function applyNewLegacyRevisions<
  T extends { slug: string; legacyRevision?: string; featured: boolean },
>(base: T[], legacy: T[]): T[] {
  const edited = legacy
    .filter((item) => {
      const current = base.find((p) => p.slug === item.slug);
      return (
        current?.legacyRevision &&
        item.legacyRevision &&
        Date.parse(item.legacyRevision) > Date.parse(current.legacyRevision)
      );
    })
    .map((item) => ({
      ...item,
      featured:
        base.find((p) => p.slug === item.slug)?.featured ?? item.featured,
    }));
  return mergeBySlug(mergeBySlug(legacy, base), edited);
}
function mergeBySlug<T extends { slug: string }>(base: T[], updates: T[]): T[] {
  const map = new Map(base.map((item) => [item.slug, item]));
  updates.forEach((item) =>
    map.set(item.slug, { ...map.get(item.slug), ...item }),
  );
  return [...map.values()];
}
export function mergeContent(
  base: PortfolioContent,
  payload: unknown,
): PortfolioContent {
  const data = record(payload);
  const hiddenProjects = new Set(
    list(data.hiddenProjects).filter((v) => typeof v === "string"),
  );
  const hiddenArticles = new Set(
    list(data.hiddenArticles).filter((v) => typeof v === "string"),
  );
  const profile = profileSchema.safeParse(data.profile);
  const oldProjects = list(data.legacyProjects).flatMap((p) => {
    const project = convertLegacyProject(p);
    return project ? [project] : [];
  });
  const oldArticles = list(data.legacyArticles).flatMap((p) => {
    const article = convertLegacyArticle(p);
    return article ? [article] : [];
  });
  // New editorial content wins over legacy versions; published new-schema edits win over both.
  const projects = mergeBySlug(
    applyNewLegacyRevisions(base.projects, oldProjects),
    valid(data.projects, (v) =>
      caseStudySchema.safeParse(resolveEditorialImages(v)),
    ),
  );
  const articles = mergeBySlug(
    applyNewLegacyRevisions(base.articles, oldArticles),
    valid(data.articles, (v) =>
      articleSchema.safeParse(resolveEditorialImages(v)),
    ),
  );
  const projectOrder = new Map(base.projects.map((p, i) => [p.slug, i]));
  projects.sort(
    (a, b) =>
      (projectOrder.get(a.slug) ?? 999) - (projectOrder.get(b.slug) ?? 999),
  );
  const experience = valid(data.experience, (v) =>
    experienceSchema.safeParse(v),
  );
  return {
    profile: profile.success ? profile.data : base.profile,
    projects: projects.filter((project) => !hiddenProjects.has(project.slug)),
    articles: articles
      .filter((article) => !hiddenArticles.has(article.slug))
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)),
    experience: experience.length ? experience : base.experience,
  };
}
