export const post = {
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (Rule: any) => Rule.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule: any) => Rule.required() },
    { name: "excerpt", title: "Excerpt", type: "text", rows: 3 },
    { name: "category", title: "Category", type: "string" },
    { name: "readTime", title: "Read time", type: "string" },
    { name: "coverImage", title: "Cover image", type: "image", options: { hotspot: true } },
    { name: "tags", title: "Tags", type: "array", of: [{ type: "string" }] },
    {
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "draft",
      options: { list: ["draft", "published"] },
    },
    { name: "publishedAt", title: "Published at", type: "datetime" },
    {
      name: "toc",
      title: "Table of contents",
      type: "array",
      of: [{ type: "object", fields: [{ name: "title", type: "string" }, { name: "anchor", type: "string" }] }],
    },
    {
      name: "benchmarkRows",
      title: "Benchmark rows",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "metric", type: "string" },
            { name: "note", type: "string" },
            {
              name: "values",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    { name: "model", type: "string" },
                    { name: "value", type: "string" },
                    { name: "highlighted", type: "boolean" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "footnotes",
      title: "Footnotes",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string" },
            { name: "text", type: "text", rows: 2 },
            { name: "href", type: "url" },
          ],
        },
      ],
    },
    { name: "body", title: "Body", type: "array", of: [{ type: "block" }, { type: "image", options: { hotspot: true } }] },
  ],
};

export const profile = {
  name: "profile",
  title: "Profile",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string" },
    { name: "intro", title: "Intro", type: "text", rows: 2 },
    { name: "location", title: "Location", type: "string" },
    { name: "about", title: "About paragraphs", type: "array", of: [{ type: "text" }] },
    {
      name: "links",
      title: "Links",
      type: "array",
      of: [{ type: "object", fields: [{ name: "label", type: "string" }, { name: "href", type: "url" }] }],
    },
    {
      name: "stats",
      title: "Stats",
      type: "array",
      of: [{ type: "object", fields: [{ name: "label", type: "string" }, { name: "value", type: "string" }] }],
    },
  ],
};

export const schemaTypes = [post, profile];
