import { defineArrayMember, defineField, defineType } from 'sanity';

import { seoFields } from './objects';

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Positioning',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'education',
      title: 'Education',
      type: 'string',
      description: 'Example: Year 2 IT Diploma student at Singapore Polytechnic.',
    }),
    defineField({
      name: 'currentFocus',
      title: 'Current focus',
      type: 'string',
      description: 'Example: Full-stack apps, local AI tooling, and secure systems.',
    }),
    defineField({
      name: 'githubUsername',
      title: 'GitHub username',
      type: 'string',
    }),
    defineField({
      name: 'publicRepoCount',
      title: 'Public repository count',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'email',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'availability',
      title: 'Availability',
      type: 'string',
      description: 'Example: Open to internships, hackathons, AI projects, or collaborations.',
    }),
    defineField({
      name: 'shortBio',
      title: 'Short bio',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'resumeUrl',
      title: 'Resume URL',
      type: 'url',
    }),
    defineField({
      name: 'portfolioUrl',
      title: 'Portfolio URL',
      type: 'url',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'socialLink' }],
        }),
      ],
    }),
    ...seoFields,
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
    },
  },
});
