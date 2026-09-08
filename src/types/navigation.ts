export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

export interface NavSection {
  label: string;
  icon: string;
  key: string;
  items: NavItem[];
}
