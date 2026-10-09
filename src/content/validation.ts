import { z } from "zod";
const webUrl = z
  .string()
  .url()
  .refine((value) => /^https?:\/\//.test(value), "Use an http or https URL");
const imageUrl = z
  .string()
  .refine(
    (value) =>
      value === "" || /^\/(?!\/)/.test(value) || /^https?:\/\//.test(value),
    "Use a local path or web URL",
  );
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const sourceLink = z.object({ label: z.string().min(1), url: webUrl });
const textBlock = z.object({
  _type: z.literal("block"),
  _key: z.string(),
  style: z.enum(["normal", "h2", "h3", "blockquote"]).optional(),
  children: z.array(
    z.object({
      _type: z.literal("span"),
      _key: z.string(),
      text: z.string(),
      marks: z.array(z.string()).optional(),
    }),
  ),
  markDefs: z
    .array(
      z.object({ _key: z.string(), _type: z.literal("link"), href: webUrl }),
    )
    .optional(),
  listItem: z.enum(["bullet", "number"]).optional(),
  level: z.number().optional(),
});
export const bodySchema = z.array(
  z.discriminatedUnion("_type", [
    textBlock,
    z.object({
      _type: z.literal("contentImage"),
      _key: z.string(),
      url: imageUrl,
      alt: z.string().min(1),
      caption: z.string().optional(),
    }),
    z.object({
      _type: z.literal("codeBlock"),
      _key: z.string(),
      language: z.string(),
      code: z.string(),
      filename: z.string().optional(),
    }),
  ]),
);
export const caseStudySchema = z.object({
  slug,
  name: z.string().min(1),
  category: z.enum([
    "AI systems",
    "Web applications",
    "Developer tools",
    "Native apps",
    "Open source",
  ]),
  summary: z.string().min(1),
  headline: z.string().min(1),
  status: z.string().min(1),
  year: z.string(),
  image: imageUrl,
  imageAlt: z.string(),
  accent: z.enum(["mint", "lavender", "warm", "blue"]),
  stack: z.array(z.string()),
  role: z.string(),
  featured: z.boolean(),
  links: z.array(sourceLink),
  body: bodySchema,
  legacyRevision: z.string().optional(),
  legacyBody: z.union([z.array(z.unknown()), z.string()]).optional(),
  gallery: z
    .array(
      z.object({
        url: imageUrl,
        alt: z.string(),
        caption: z.string().optional(),
      }),
    )
    .optional(),
});
export const articleSchema = z.object({
  slug,
  title: z.string().min(1),
  excerpt: z.string().min(1),
  category: z.enum(["Building", "AI workflows", "Notes"]),
  publishedAt: z
    .string()
    .refine((value) => Number.isFinite(Date.parse(value)), "Invalid date"),
  readMinutes: z.number().int().positive(),
  featured: z.boolean(),
  body: bodySchema,
  legacyRevision: z.string().optional(),
  legacyBody: z.union([z.array(z.unknown()), z.string()]).optional(),
  cover: imageUrl.optional(),
  sources: z.array(sourceLink),
});
export const profileSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  aspiration: z.string(),
  location: z.string(),
  availability: z.string(),
  intro: z.string(),
  github: webUrl,
  linkedin: webUrl,
  email: z.string().email().optional(),
  about: z.string().optional(),
  personal: z.string().optional(),
  instagram: webUrl.optional(),
  x: webUrl.optional(),
  tools: z
    .array(
      z.object({
        id: z.string().regex(/^[a-z0-9-]+$/),
        name: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .optional(),
  contributions: z
    .array(
      z.object({
        name: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
        status: z.string().min(1),
        href: webUrl,
        number: z.string(),
      }),
    )
    .optional(),
});
export const experienceSchema = z.object({
  id: z.string(),
  organization: z.string(),
  title: z.string(),
  period: z.string(),
  kind: z.enum(["Education", "Leadership", "Open source"]),
  description: z.string(),
  url: webUrl.optional(),
});
export const portfolioSchema = z.object({
  profile: profileSchema,
  projects: z.array(caseStudySchema),
  articles: z.array(articleSchema),
  experience: z.array(experienceSchema),
});
