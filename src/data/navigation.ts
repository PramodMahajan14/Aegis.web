import type { NavSection } from '../types/navigation';

const navigation: NavSection[] = [
  {
    label: 'Sales',
    icon: 'bi-graph-up-arrow',
    key: 'sales',
    items: [
      { label: 'Dashboard', path: '/', icon: 'bi-grid-1x2' },
      { label: 'Pipeline', path: '/pipeline', icon: 'bi-kanban' },
      { label: 'Prospects', path: '/prospects', icon: 'bi-folder' },
      { label: 'Daily Planner', path: '/planner', icon: 'bi-check2-square' },
    ],
  },
  {
    label: 'Administrator',
    icon: 'bi-shield-lock',
    key: 'administrator',
    items: [
      { label: 'Master', path: '/master', icon: 'bi-database' },
      { label: 'Employee', path: '/employee', icon: 'bi-person-badge' },
      { label: 'Settings', path: '/settings', icon: 'bi-gear' },
    ],
  },
];

export default navigation;
