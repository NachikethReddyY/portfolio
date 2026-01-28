import { defineField, defineType } from 'sanity'

export const project = defineType({
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
        }),
        defineField({
            name: 'tagline',
            title: 'One-line Tagline',
            type: 'string',
            description: 'The main verified outcome.',
        }),
        defineField({
            name: 'type',
            title: 'Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Real-World / Production', value: 'real-world' },
                    { title: 'Personal / Side Project', value: 'personal' },
                    { title: 'Academic / Challenge', value: 'academic' },
                ],
            },
        }),
        defineField({
            name: 'isFeatured',
            title: 'Featured on Home?',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'coverImage',
            title: 'Cover Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'techStack',
            title: 'Tech Stack',
            type: 'array',
            of: [{ type: 'reference', to: { type: 'techSkill' } }],
        }),
        defineField({
            name: 'liveUrl',
            title: 'Live Demo URL',
            type: 'url',
        }),
        defineField({
            name: 'repoUrl',
            title: 'GitHub Repo URL',
            type: 'url',
        }),
        defineField({
            name: 'problem',
            title: 'The Problem',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'solution',
            title: 'The Solution (Technical Approach)',
            type: 'array',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'features',
            title: 'Key Features',
            type: 'array',
            of: [{ type: 'string' }],
        }),
    ],
})
