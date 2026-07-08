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
  backend: 'bg-primary',
  ai: 'bg-accent',
  security: 'bg-primary',
  mobile: 'bg-primary',
  database: 'bg-primary',
  cms: 'bg-primary',
  design: 'bg-primary',
  tooling: 'bg-accent',
  systems: 'bg-primary',
};

export function SkillBadge({ skill }: SkillBadgeProps) {
  return (
    <span className="inline-flex min-h-9 items-center gap-2 rounded-none border border-[#00d2ff]/35 bg-terminal px-3 py-1 font-tech text-sm font-bold text-ink">
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
