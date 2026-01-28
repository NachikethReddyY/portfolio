import { type SchemaTypeDefinition } from 'sanity'
import { project } from './project'
import { techSkill } from './techSkill'
import { experienceItem } from './experience'
import { experienceFolder } from './experienceFolder'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [project, techSkill, experienceItem, experienceFolder],
}
