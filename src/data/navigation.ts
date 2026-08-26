import type { NavSection } from '../types/navigation';

// Layout-only skeleton: add sections/items here as real pages are built.
const navigation: NavSection[] = [
  {
    label: 'Dashboard',
    icon: 'bi-speedometer2',
    key: 'dashboard',
    items: [{ label: 'Home', path: '/' }, { label: 'Employees', path: '/employees' }],
  },
];

export default navigation;
