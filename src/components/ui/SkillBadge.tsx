import type { Skill } from '../../lib/types';

type SkillBadgeProps = {
  skill: Skill;
};

const proficiencyLabels: Record<NonNullable<Skill['proficiency']>, string> = {
  daily: 'Daily',
  confident: 'Confident',
  learning: 'Learning',
  exploring: 'Exploring',
};

const categorySwatches: Record<Skill['category'], string> = {
  frontend: 'bg-primary',
  backend: 'bg-violet',
  ai: 'bg-accent',
  security: 'bg-danger',
  mobile: 'bg-warning',
  database: 'bg-success',
  cms: 'bg-primary',
  design: 'bg-violet',
  tooling: 'bg-accent',
  systems: 'bg-warning',
};

export function SkillBadge({ skill }: SkillBadgeProps) {
  return (
    <span className="inline-flex min-h-9 items-center gap-2 rounded-md border-2 border-ink bg-surface px-3 py-1 text-sm font-semibold text-ink">
      <span aria-hidden="true" className={['size-2.5 rounded-sm', categorySwatches[skill.category]].join(' ')} />
      <span>{skill.title}</span>
      {skill.proficiency ? (
        <span className="font-tech text-[0.68rem] font-medium text-muted">
          {proficiencyLabels[skill.proficiency]}
        </span>
      ) : null}
    </span>
  );
}
