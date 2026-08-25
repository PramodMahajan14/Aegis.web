export interface NavItem {
  label: string;
  path: string;
  slug: string;
  flagship?: boolean;
  bare?: boolean;
}

export interface NavSection {
  label: string;
  icon: string;
  key: string;
  items: NavItem[];
}
