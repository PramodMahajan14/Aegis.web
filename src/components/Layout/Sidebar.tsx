import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import navigation from '../../data/navigation';
import type { NavSection } from '../../types/navigation';

function sectionContainsPath(section: NavSection, pathname: string): boolean {
  return section.items.some((item) => item.path === pathname);
}

interface SidebarProps {
  mobileOpen: boolean;
  collapsed: boolean;
}

export default function Sidebar({ mobileOpen, collapsed }: SidebarProps) {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<Set<string>>(() => {
    const active = navigation.find((s) => sectionContainsPath(s, location.pathname));
    return new Set(active ? [active.key] : ['dashboard']);
  });

  function toggle(key: string) {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <aside
      className={
        'sidebar' + (collapsed ? ' collapsed' : '') + (mobileOpen ? ' mobile-open' : '')
      }
    >
      <div className="sidebar-user">
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center fw-semibold"
            style={{ width: 32, height: 32, background: 'var(--aegis-accent)', color: '#fff' }}
          >
            AT
          </div>
          <div>
            <div className="small text-muted">Welcome,</div>
            <div className="fw-semibold" style={{ color: 'var(--aegis-text-strong)' }}>
              Alizee Thomas
            </div>
          </div>
        </div>
      </div>
      <ul className="sidebar-nav">
        {navigation.map((section) => {
          const isOpen = openKeys.has(section.key);
          return (
            <li key={section.key} className={'sidebar-group' + (isOpen ? ' open' : '')}>
              <a className="sidebar-link" onClick={() => toggle(section.key)}>
                <span>
                  <i className={'bi ' + section.icon + ' me-2'} />
                  {section.label}
                </span>
                <i className="bi bi-chevron-right chevron" />
              </a>
              <ul className="sidebar-submenu">
                {section.items.map((item) => (
                  <li key={item.path}>
                    <NavLink to={item.path} end={item.path === '/'} className="border-none text-decoration-none">
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
