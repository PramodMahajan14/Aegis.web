import type { NavSection } from '../types/navigation';

// Layout-only skeleton: add sections/items here as real pages are built.
const navigation: NavSection[] = [
  {
    label: 'Dashboard',
    icon: 'bi-speedometer2',
    key: 'dashboard',
    items: [{ label: 'Home', path: '/' }, { label: 'Prospects', path: '/prospects' }],
  },
  {
    label: 'Administrator',
    icon: 'bi-shield-lock',
    key: 'administrator',
    items: [
      { label: 'Settings', path: '/settings' },
      { label: 'Master', path: '/master' },
      { label: 'Employee', path: '/employee' }
    ],
  },
];

export default navigation;
