import type { Skill } from '../../lib/types';

type SkillBadgeProps = {
  skill: Skill;
};

const skillIconClasses: Partial<Record<string, string>> = {
  typescript: 'devicon-typescript-plain',
  'react-nextjs': 'devicon-react-original',
  'node-express': 'devicon-nodejs-plain',
  'python-local-ai': 'devicon-python-plain',
  'postgresql-supabase': 'devicon-postgresql-plain',
  'secure-coding-owasp': 'devicon-linux-plain',
  'expo-mobile': 'devicon-expo-original',
  'cli-systems-tools': 'devicon-bash-plain',
};

const categoryIconClasses: Record<Skill['category'], string> = {
  frontend: 'devicon-react-original',
  backend: 'devicon-nodejs-plain',
  ai: 'devicon-python-plain',
  security: 'devicon-linux-plain',
  mobile: 'devicon-android-plain',
  database: 'devicon-postgresql-plain',
  cms: 'devicon-sanity-plain',
  design: 'devicon-figma-plain',
  tooling: 'devicon-bash-plain',
  systems: 'devicon-bash-plain',
};

export function SkillBadge({ skill }: SkillBadgeProps) {
  const iconClass = skillIconClasses[skill.slug] ?? categoryIconClasses[skill.category];

  return (
    <span className="inline-flex min-h-7 max-w-full items-center gap-1.5 rounded-none border border-[#00d2ff]/35 bg-terminal px-2 py-0.5 font-tech text-[0.68rem] font-bold leading-5 text-ink sm:text-xs">
      <i aria-hidden="true" className={[iconClass, 'text-[0.82rem] leading-none text-primary-strong'].join(' ')} />
      <span className="truncate">{skill.title}</span>
    </span>
  );
}
