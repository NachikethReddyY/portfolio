import { defineField, defineType } from 'sanity'

export const techSkill = defineType({
    name: 'techSkill',
    title: 'Tech Skill',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
        }),
        defineField({
            name: 'icon',
            title: 'Icon/Logo',
            type: 'image',
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Core / Working With', value: 'core' },
                    { title: 'Exploring / Learning', value: 'learning' },
                ],
            },
            initialValue: 'core',
        }),
    ],
})
