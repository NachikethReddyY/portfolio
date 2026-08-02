import type { ProjectStatus, ProjectType } from './types';

export function formatStatus(status: ProjectStatus) {
  const labels: Record<ProjectStatus, string> = {
    building: 'In development',
    shipped: 'Completed',
    archived: 'Archived',
    experiment: 'Prototype / experiment',
  };

  return labels[status];
}

export function formatProjectType(type?: ProjectType) {
  if (!type) {
    return 'Project';
  }

  const labels: Record<ProjectType, string> = {
    'ai-tooling': 'AI tools',
    'full-stack': 'Full-stack',
    cybersecurity: 'Cybersecurity',
    'mobile-hardware': 'Mobile / Hardware',
    'cli-systems': 'CLI / Systems',
    coursework: 'Coursework',
    experiment: 'Experiment',
  };

  return labels[type];
}
