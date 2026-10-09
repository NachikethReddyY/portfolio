import { defineArrayMember, defineField, defineType } from "sanity";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const visibilityField = (group: string) =>
  defineField({
    name: "hidden",
    title: "Hide from portfolio",
    type: "boolean",
    group,
    initialValue: false,
    description:
      "Publish this change to hide the matching project or article, including its bundled starter version. Turn off and publish to show it again.",
  });

const slugField = (source: string) =>
  defineField({
    name: "slug",
    title: "Slug",
    type: "slug",
    options: {
      source,
      maxLength: 96,
    },
    validation: (rule) =>
      rule.required().custom((value) => {
        const slug = value?.current;

        if (!slug) return "A slug is required";
        return slugPattern.test(slug)
          ? true
          : "Use lowercase letters, numbers, and single hyphens";
      }),
  });

const requiredUrl = (title: string, name: string, group?: string) =>
  defineField({
    name,
    title,
    type: "url",
    ...(group ? { group } : {}),
    validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }),
  });

const optionalUrl = (title: string, name: string, group?: string) =>
  defineField({
    name,
    title,
    type: "url",
    ...(group ? { group } : {}),
    validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
  });

export const sourceLink = defineType({
  name: "sourceLink",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    requiredUrl("URL", "url"),
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "url",
    },
  },
});

export const contentImage = defineType({
  name: "contentImage",
  title: "Content image",
  type: "object",
  fields: [
    optionalUrl("Image URL", "url"),
    defineField({
      name: "upload",
      title: "Upload an image",
      type: "image",
      options: { hotspot: true },
      description: "An upload takes precedence over the image URL.",
    }),
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "text",
      rows: 2,
    }),
  ],
  validation: (rule) =>
    rule.custom((value) =>
      value && (value.url || value.upload)
        ? true
        : "Upload an image or provide its URL",
    ),
  preview: {
    select: {
      title: "alt",
      subtitle: "caption",
      media: "url",
    },
  },
});

export const codeBlock = defineType({
  name: "codeBlock",
  title: "Code block",
  type: "object",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "code",
      title: "Code",
      type: "text",
      rows: 12,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "filename",
      title: "Filename",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "filename",
      subtitle: "language",
    },
  },
});

const portableTextBlock = defineArrayMember({
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "Heading 2", value: "h2" },
    { title: "Heading 3", value: "h3" },
    { title: "Quote", value: "blockquote" },
  ],
  lists: [
    { title: "Bullet", value: "bullet" },
    { title: "Numbered", value: "number" },
  ],
  marks: {
    decorators: [
      { title: "Strong", value: "strong" },
      { title: "Emphasis", value: "em" },
      { title: "Code", value: "code" },
    ],
    annotations: [
      defineArrayMember({
        type: "object",
        name: "link",
        title: "Link",
        fields: [requiredUrl("URL", "href")],
      }),
    ],
  },
});

const portableTextMembers = [
  portableTextBlock,
  defineArrayMember({ type: "contentImage" }),
  defineArrayMember({ type: "codeBlock" }),
];

const bodyField = (title: string, group?: string) =>
  defineField({
    name: "body",
    title,
    type: "array",
    of: portableTextMembers,
    ...(group ? { group } : {}),
    validation: (rule) => rule.required().min(1),
  });

const sourceLinksField = (
  name: "links" | "sources",
  title: string,
  group?: string,
) =>
  defineField({
    name,
    title,
    type: "array",
    of: [defineArrayMember({ type: "sourceLink" })],
    ...(group ? { group } : {}),
    validation: (rule) => rule.required(),
  });

const profileTool = defineArrayMember({
  name: "profileTool",
  title: "Tool",
  type: "object",
  fields: [
    defineField({
      name: "id",
      title: "ID",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
});

const profileContribution = defineArrayMember({
  name: "profileContribution",
  title: "Contribution",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    requiredUrl("Link", "href"),
    defineField({
      name: "number",
      title: "Number",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
});

export const profile = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "availability", title: "Availability" },
    { name: "social", title: "Social" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "identity",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      group: "identity",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "aspiration",
      title: "Aspiration",
      type: "string",
      group: "identity",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "availability",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "availability",
      title: "Availability",
      type: "string",
      group: "availability",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "text",
      rows: 5,
      group: "identity",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "about",
      title: "About",
      type: "text",
      rows: 5,
      group: "identity",
    }),
    defineField({
      name: "personal",
      title: "Personal",
      type: "text",
      rows: 5,
      group: "identity",
    }),
    requiredUrl("GitHub", "github", "social"),
    requiredUrl("LinkedIn", "linkedin", "social"),
    optionalUrl("Instagram", "instagram", "social"),
    optionalUrl("X", "x", "social"),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "social",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "tools",
      title: "Tools",
      type: "array",
      group: "identity",
      of: [profileTool],
    }),
    defineField({
      name: "contributions",
      title: "Contributions",
      type: "array",
      group: "identity",
      of: [profileContribution],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
    },
  },
});

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "metadata", title: "Metadata" },
    { name: "presentation", title: "Presentation" },
    { name: "links", title: "Links" },
  ],
  fields: [
    slugField("name"),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "metadata",
      options: {
        list: [
          { title: "AI systems", value: "AI systems" },
          { title: "Developer tools", value: "Developer tools" },
          { title: "Native apps", value: "Native apps" },
          { title: "Web applications", value: "Web applications" },
          { title: "Open source", value: "Open source" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "metadata",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      group: "metadata",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image URL or local path",
      type: "string",
      group: "presentation",
      validation: (rule) =>
        rule.custom((value) =>
          !value || /^(https?:\/\/|\/(?!\/))/.test(value)
            ? true
            : "Use a local path or an HTTPS URL",
        ),
    }),
    defineField({
      name: "coverUpload",
      title: "Upload a cover image",
      type: "image",
      group: "presentation",
      options: { hotspot: true },
      description: "An uploaded cover takes precedence over the URL.",
    }),
    defineField({
      name: "imageAlt",
      title: "Image alt text",
      type: "string",
      group: "presentation",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "accent",
      title: "Accent",
      type: "string",
      group: "presentation",
      options: {
        list: [
          { title: "Mint", value: "mint" },
          { title: "Lavender", value: "lavender" },
          { title: "Warm", value: "warm" },
          { title: "Blue", value: "blue" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "stack",
      title: "Stack",
      type: "array",
      group: "metadata",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      group: "metadata",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "presentation",
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Project gallery",
      type: "array",
      group: "presentation",
      of: [defineArrayMember({ type: "contentImage" })],
      initialValue: [],
      description:
        "Drag to reorder. Upload images or use URLs; captions and alt text travel with each image. An empty gallery removes the starter gallery.",
    }),
    sourceLinksField("links", "Project links", "links"),
    visibilityField("presentation"),
    bodyField("Case study body", "content"),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
    },
  },
});

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "metadata", title: "Metadata" },
    { name: "links", title: "Sources" },
  ],
  fields: [
    slugField("title"),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "metadata",
      options: {
        list: [
          { title: "Building", value: "Building" },
          { title: "AI workflows", value: "AI workflows" },
          { title: "Notes", value: "Notes" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "metadata",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "readMinutes",
      title: "Read time (minutes)",
      type: "number",
      group: "metadata",
      validation: (rule) => rule.required().integer().positive(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "metadata",
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cover",
      title: "Cover image URL",
      type: "url",
      group: "content",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "coverUpload",
      title: "Upload a cover image",
      type: "image",
      group: "content",
      options: { hotspot: true },
    }),
    bodyField("Article body", "content"),
    sourceLinksField("sources", "Sources", "links"),
    visibilityField("metadata"),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
    },
  },
});

export const experience = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "links", title: "Links" },
  ],
  fields: [
    defineField({
      name: "order",
      title: "Timeline order",
      type: "number",
      group: "details",
      initialValue: 0,
      description: "Lower numbers appear first.",
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: "id",
      title: "ID",
      type: "string",
      group: "details",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "organization",
      title: "Organization",
      type: "string",
      group: "details",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "details",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "period",
      title: "Period",
      type: "string",
      group: "details",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      group: "details",
      options: {
        list: [
          { title: "Education", value: "Education" },
          { title: "Leadership", value: "Leadership" },
          { title: "Open source", value: "Open source" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      group: "details",
      validation: (rule) => rule.required(),
    }),
    optionalUrl("URL", "url", "links"),
  ],
  preview: {
    select: {
      title: "organization",
      subtitle: "title",
    },
  },
});

export const schemaTypes = [
  sourceLink,
  contentImage,
  codeBlock,
  profile,
  caseStudy,
  article,
  experience,
];

export default schemaTypes;
