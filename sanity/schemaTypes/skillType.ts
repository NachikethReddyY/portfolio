import { defineField, defineType } from 'sanity';

export const skillType = defineType({
  name: 'skill',
  title: 'Skill / Technology',
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
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Frontend', value: 'frontend' },
          { title: 'Backend', value: 'backend' },
          { title: 'AI / ML', value: 'ai' },
          { title: 'Security', value: 'security' },
          { title: 'Mobile', value: 'mobile' },
          { title: 'Database', value: 'database' },
          { title: 'CMS', value: 'cms' },
          { title: 'Design', value: 'design' },
          { title: 'Tooling', value: 'tooling' },
          { title: 'Systems', value: 'systems' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'proficiency',
      title: 'Proficiency',
      type: 'string',
      options: {
        list: [
          { title: 'Daily Driver', value: 'daily' },
          { title: 'Confident', value: 'confident' },
          { title: 'Learning Fast', value: 'learning' },
          { title: 'Exploring', value: 'exploring' },
        ],
      },
      initialValue: 'confident',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
    }),
  ],
});
