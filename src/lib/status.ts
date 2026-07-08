import type { ProjectStatus } from './types';

export function formatStatus(status: ProjectStatus) {
  const labels: Record<ProjectStatus, string> = {
    building: 'Building',
    shipped: 'Shipped',
    archived: 'Archived',
    experiment: 'Experiment',
  };

  return labels[status];
}
