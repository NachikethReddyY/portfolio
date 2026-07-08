import { defineArrayMember, defineField } from 'sanity';

import { RichTextInput, RichTextPortableTextPlugins } from '../components/RichTextInput';

export const seoFields = [
  defineField({
    name: 'seoTitle',
    title: 'SEO title',
    type: 'string',
    validation: (Rule) => Rule.max(62),
  }),
  defineField({
    name: 'seoDescription',
    title: 'SEO description',
    type: 'text',
    rows: 3,
    validation: (Rule) => Rule.max(160),
  }),
  defineField({
    name: 'seoImage',
    title: 'Social image',
    type: 'image',
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt text',
        type: 'string',
      }),
    ],
  }),
];

export const portableTextField = defineField({
  name: 'body',
  title: 'Body',
  type: 'array',
  components: {
    input: RichTextInput,
    portableText: {
      plugins: RichTextPortableTextPlugins,
    },
  } as any,
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'H5', value: 'h5' },
        { title: 'H6', value: 'h6' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Number', value: 'number' },
        { title: 'Checkmarks', value: 'checkmarks' },
      ],
      of: [
        defineArrayMember({
          name: 'inlineEquation',
          title: 'Inline equation',
          type: 'object',
          fields: [
            defineField({
              name: 'equation',
              title: 'Equation',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              equation: 'equation',
            },
            prepare({ equation }) {
              return {
                title: equation || 'Inline equation',
              };
            },
          },
        }),
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' },
          { title: 'Text highlight', value: 'highlight' },
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (Rule) =>
                  Rule.uri({
                    scheme: ['http', 'https', 'mailto'],
                  }),
              }),
            ],
          }),
          defineArrayMember({
            name: 'textColor',
            title: 'Text colour',
            type: 'object',
            fields: [
              defineField({
                name: 'color',
                title: 'Colour',
                type: 'string',
                options: {
                  list: [
                    { title: 'Default', value: 'default' },
                    { title: 'Cyan', value: 'cyan' },
                    { title: 'Green', value: 'green' },
                    { title: 'Yellow', value: 'yellow' },
                    { title: 'Red', value: 'red' },
                    { title: 'Purple', value: 'purple' },
                  ],
                },
                initialValue: 'default',
              }),
            ],
          }),
          defineArrayMember({
            name: 'backgroundColor',
            title: 'Background colour',
            type: 'object',
            fields: [
              defineField({
                name: 'color',
                title: 'Colour',
                type: 'string',
                options: {
                  list: [
                    { title: 'Cyan', value: 'cyan' },
                    { title: 'Green', value: 'green' },
                    { title: 'Yellow', value: 'yellow' },
                    { title: 'Red', value: 'red' },
                    { title: 'Purple', value: 'purple' },
                    { title: 'Slate', value: 'slate' },
                  ],
                },
                initialValue: 'cyan',
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      name: 'divider',
      title: 'Divider',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Label',
          type: 'string',
        }),
      ],
      preview: {
        select: {
          label: 'label',
        },
        prepare({ label }) {
          return {
            title: label || 'Divider',
          };
        },
      },
    }),
    defineArrayMember({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
        }),
      ],
    }),
    defineArrayMember({
      name: 'codeBlock',
      title: 'Code snippet',
      type: 'object',
      fields: [
        defineField({
          name: 'language',
          title: 'Language',
          type: 'string',
          options: {
            list: [
              { title: 'Plain text', value: 'text' },
              { title: 'Bash', value: 'bash' },
              { title: 'CSS', value: 'css' },
              { title: 'HTML', value: 'html' },
              { title: 'JavaScript', value: 'javascript' },
              { title: 'JSON', value: 'json' },
              { title: 'JSX', value: 'jsx' },
              { title: 'LaTeX', value: 'latex' },
              { title: 'Markdown', value: 'markdown' },
              { title: 'Mermaid', value: 'mermaid' },
              { title: 'TypeScript', value: 'typescript' },
              { title: 'TSX', value: 'tsx' },
            ],
          },
          initialValue: 'text',
        }),
        defineField({
          name: 'filename',
          title: 'Filename',
          type: 'string',
        }),
        defineField({
          name: 'code',
          title: 'Code',
          type: 'text',
          rows: 12,
          validation: (Rule) => Rule.required(),
        }),
      ],
      preview: {
        select: {
          title: 'filename',
          language: 'language',
          code: 'code',
        },
        prepare({ title, language, code }) {
          return {
            title: title || `${language || 'text'} code block`,
            subtitle: code,
          };
        },
      },
    }),
    defineArrayMember({
      name: 'markdownBlock',
      title: 'Markdown / MDX',
      type: 'object',
      fields: [
        defineField({
          name: 'format',
          title: 'Format',
          type: 'string',
          options: {
            list: [
              { title: 'Markdown', value: 'markdown' },
              { title: 'MDX', value: 'mdx' },
            ],
          },
          initialValue: 'markdown',
        }),
        defineField({
          name: 'source',
          title: 'Source',
          type: 'text',
          rows: 14,
          validation: (Rule) => Rule.required(),
        }),
      ],
      preview: {
        select: {
          format: 'format',
          source: 'source',
        },
        prepare({ format, source }) {
          return {
            title: `${format === 'mdx' ? 'MDX' : 'Markdown'} block`,
            subtitle: source,
          };
        },
      },
    }),
    defineArrayMember({
      name: 'table',
      title: 'Table',
      type: 'object',
      fields: [
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
        }),
        defineField({
          name: 'columns',
          title: 'Columns',
          type: 'array',
          of: [defineArrayMember({ type: 'string' })],
          validation: (Rule) => Rule.min(1),
        }),
        defineField({
          name: 'rows',
          title: 'Rows',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'row',
              title: 'Row',
              type: 'object',
              fields: [
                defineField({
                  name: 'cells',
                  title: 'Cells',
                  type: 'array',
                  of: [defineArrayMember({ type: 'string' })],
                  validation: (Rule) => Rule.min(1),
                }),
              ],
              preview: {
                select: {
                  cells: 'cells',
                },
                prepare({ cells }) {
                  return {
                    title: Array.isArray(cells) ? cells.join(' | ') : 'Table row',
                  };
                },
              },
            }),
          ],
          validation: (Rule) => Rule.min(1),
        }),
      ],
      preview: {
        select: {
          caption: 'caption',
          rows: 'rows',
        },
        prepare({ caption, rows }) {
          const rowCount = Array.isArray(rows) ? rows.length : 0;

          return {
            title: caption || 'Table',
            subtitle: `${rowCount} row${rowCount === 1 ? '' : 's'}`,
          };
        },
      },
    }),
    defineArrayMember({
      name: 'todoList',
      title: 'To-do list',
      type: 'object',
      fields: [
        defineField({
          name: 'items',
          title: 'Items',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'item',
              title: 'Item',
              type: 'object',
              fields: [
                defineField({
                  name: 'text',
                  title: 'Text',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'checked',
                  title: 'Checked',
                  type: 'boolean',
                  initialValue: false,
                }),
              ],
              preview: {
                select: {
                  title: 'text',
                  checked: 'checked',
                },
                prepare({ title, checked }) {
                  return {
                    title: `${checked ? '[x]' : '[ ]'} ${title || 'To-do item'}`,
                  };
                },
              },
            }),
          ],
          validation: (Rule) => Rule.min(1),
        }),
      ],
    }),
    defineArrayMember({
      name: 'fileBlock',
      title: 'File',
      type: 'file',
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'string',
        }),
      ],
    }),
    defineArrayMember({
      name: 'webBookmark',
      title: 'Web bookmark',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'url',
          title: 'URL',
          type: 'url',
          validation: (Rule) =>
            Rule.required().uri({
              scheme: ['http', 'https'],
            }),
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 2,
        }),
      ],
      preview: {
        select: {
          title: 'title',
          subtitle: 'url',
        },
      },
    }),
    defineArrayMember({
      name: 'mermaidDiagram',
      title: 'Mermaid diagram',
      type: 'object',
      fields: [
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
        }),
        defineField({
          name: 'code',
          title: 'Mermaid code',
          type: 'text',
          rows: 10,
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineArrayMember({
      name: 'button',
      title: 'Button',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Label',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'href',
          title: 'Link',
          type: 'url',
          validation: (Rule) =>
            Rule.required().uri({
              allowRelative: true,
              scheme: ['http', 'https', 'mailto'],
            }),
        }),
        defineField({
          name: 'variant',
          title: 'Variant',
          type: 'string',
          options: {
            list: [
              { title: 'Primary', value: 'primary' },
              { title: 'Secondary', value: 'secondary' },
            ],
          },
          initialValue: 'primary',
        }),
      ],
    }),
    defineArrayMember({
      name: 'mathBlock',
      title: 'LaTeX block',
      type: 'object',
      fields: [
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
        }),
        defineField({
          name: 'equation',
          title: 'Equation',
          type: 'text',
          rows: 6,
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineArrayMember({
      name: 'callout',
      title: 'Callout',
      type: 'object',
      fields: [
        defineField({
          name: 'tone',
          title: 'Tone',
          type: 'string',
          options: {
            list: [
              { title: 'Insight', value: 'insight' },
              { title: 'Warning', value: 'warning' },
              { title: 'Result', value: 'result' },
            ],
          },
          initialValue: 'insight',
        }),
        defineField({
          name: 'text',
          title: 'Text',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],
});
