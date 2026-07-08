import { defineArrayMember, defineField, defineType } from 'sanity';

import { portableTextField, seoFields } from './objects';

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(260),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Building', value: 'building' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Archived', value: 'archived' },
          { title: 'Experiment', value: 'experiment' },
        ],
      },
      initialValue: 'building',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'projectType',
      title: 'Project type',
      type: 'string',
      options: {
        list: [
          { title: 'AI Tooling', value: 'ai-tooling' },
          { title: 'Full-stack App', value: 'full-stack' },
          { title: 'Cybersecurity', value: 'cybersecurity' },
          { title: 'Mobile / Hardware', value: 'mobile-hardware' },
          { title: 'CLI / Systems', value: 'cli-systems' },
          { title: 'Coursework', value: 'coursework' },
          { title: 'Experiment', value: 'experiment' },
        ],
      },
      initialValue: 'full-stack',
    }),
    defineField({
      name: 'role',
      title: 'Your role',
      type: 'string',
      description: 'Be explicit about what you personally owned.',
    }),
    defineField({
      name: 'period',
      title: 'Period',
      type: 'string',
      description: 'Example: Jun 2026 or SUTD HacX 2025.',
    }),
    defineField({
      name: 'impact',
      title: 'Proof / impact',
      type: 'text',
      rows: 3,
      description: 'A short evidence line: demo shipped, workflow improved, assessment scope, etc.',
    }),
    defineField({
      name: 'featured',
      title: 'Featured project',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image / screenshot',
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
    defineField({
      name: 'gallery',
      title: 'Screenshots / images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'technologies',
      title: 'Tech stack',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'skill' }],
        }),
      ],
    }),
    defineField({
      name: 'problem',
      title: 'Problem statement',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'solution',
      title: 'Solution',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'whatIBuilt',
      title: 'What I personally built',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Use this to avoid vague team-project ownership.',
    }),
    defineField({
      name: 'constraints',
      title: 'Constraints / tradeoffs',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
    }),
    defineField({
      name: 'demoUrl',
      title: 'Live demo URL',
      type: 'url',
    }),
    defineField({
      name: 'lessonsLearned',
      title: 'Lessons learned',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'futureImprovements',
      title: 'Future improvements',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    portableTextField,
    ...seoFields,
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'status',
      media: 'coverImage',
    },
  },
});
