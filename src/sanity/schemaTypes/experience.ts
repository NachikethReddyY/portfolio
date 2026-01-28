import { defineField, defineType } from 'sanity'

export const experienceItem = defineType({
    name: 'experienceItem',
    title: 'Experience Item',
    type: 'document',
    fields: [
        defineField({
            name: 'role',
            title: 'Role',
            type: 'string',
        }),
        defineField({
            name: 'company',
            title: 'Company / Organization',
            type: 'string',
        }),
        defineField({
            name: 'startDate',
            title: 'Start Date',
            type: 'date',
        }),
        defineField({
            name: 'endDate',
            title: 'End Date',
            type: 'date',
            description: 'Leave blank if current.',
        }),
        defineField({
            name: 'description',
            title: 'Key Achievements',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'skillsDemonstrated',
            title: 'Skills Demonstrated',
            type: 'array',
            of: [{ type: 'reference', to: { type: 'techSkill' } }],
        }),
    ],
})
