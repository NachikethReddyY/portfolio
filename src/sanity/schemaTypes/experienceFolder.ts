import { defineField, defineType } from 'sanity'

export const experienceFolder = defineType({
    name: 'experienceFolder',
    title: 'Experience Folder',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Folder Label',
            description: 'e.g. Hackathons 2024, Work Experience',
            type: 'string',
        }),
        defineField({
            name: 'coverImage',
            title: 'Sticker / Cover Image',
            type: 'image',
        }),
        defineField({
            name: 'color',
            title: 'Folder Color',
            type: 'string',
            options: {
                list: [
                    { title: 'Blue', value: 'blue-500' },
                    { title: 'Slate', value: 'slate-500' },
                    { title: 'Orange', value: 'orange-500' },
                ],
            },
            initialValue: 'blue-500',
        }),
        defineField({
            name: 'items',
            title: 'Folder Contents',
            type: 'array',
            of: [{ type: 'reference', to: { type: 'experienceItem' } }],
        }),
        defineField({
            name: 'previewImages',
            title: 'Polaroid Preview Images',
            description: 'Images that fan out when hovering the folder.',
            type: 'array',
            of: [{ type: 'image' }],
        }),
    ],
})
