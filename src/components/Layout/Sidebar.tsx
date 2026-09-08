import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Tooltip } from '@blueprintjs/core';
import navigation from '../../data/navigation';
import type { NavSection } from '../../types/navigation';
import { cn } from '../../lib/cn';

function sectionContainsPath(section: NavSection, pathname: string): boolean {
  return section.items.some((item) => item.path === pathname);
}

interface SidebarProps {
  mobileOpen: boolean;
  collapsed: boolean;
}

const itemBase =
  'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[0.8125rem] transition-colors ' +
  'before:absolute before:left-0 before:top-1/2 before:h-4 before:w-[3px] before:-translate-y-1/2 ' +
  'before:rounded-full before:bg-brand before:opacity-0 before:transition-opacity';

export default function Sidebar({ mobileOpen, collapsed }: SidebarProps) {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<Set<string>>(() => {
    const active = navigation.find((s) => sectionContainsPath(s, location.pathname));
    return new Set(active ? [active.key] : navigation.map((s) => s.key));
  });

  function toggle(key: string) {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const flatItems = navigation.flatMap((s) => s.items);

  return (
    <aside className="app-sidebar" data-collapsed={collapsed} data-mobile-open={mobileOpen}>
      {/* User card */}
      <div
        className={cn(
          'flex items-center gap-3 border-b border-border px-3.5 py-3.5',
          collapsed && 'justify-center px-0',
        )}
      >
        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-[0.8125rem] font-semibold text-primary-foreground">
          AT
        </div>
        {!collapsed && (
          <div className="min-w-0 leading-tight">
            <div className="truncate text-[0.8125rem] font-semibold text-foreground">
              Alizee Thomas
            </div>
            <div className="truncate text-[0.6875rem] text-muted-foreground">Administrator</div>
          </div>
        )}
      </div>

      {collapsed ? (
        <nav className="no-scrollbar flex flex-1 flex-col items-center gap-1 overflow-y-auto py-3">
          {flatItems.map((item) => (
            <Tooltip key={item.path} content={item.label} placement="right" compact>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'relative grid size-9 place-items-center rounded-lg text-[1.05rem] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
                    'before:absolute before:left-0 before:top-1/2 before:h-4 before:w-[3px] before:-translate-y-1/2 before:rounded-full before:bg-brand before:opacity-0',
                    isActive && 'bg-accent text-brand before:opacity-100',
                  )
                }
              >
                <i className={cn('bi', item.icon ?? 'bi-dot')} />
              </NavLink>
            </Tooltip>
          ))}
        </nav>
      ) : (
        <nav className="no-scrollbar flex-1 space-y-4 overflow-y-auto px-2.5 py-4">
          {navigation.map((section) => {
            const isOpen = openKeys.has(section.key);
            return (
              <div key={section.key}>
                <button
                  type="button"
                  onClick={() => toggle(section.key)}
                  className="flex w-full items-center justify-between rounded-md px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {section.label}
                  <i
                    className={cn(
                      'bi bi-chevron-down text-[0.7rem] transition-transform',
                      !isOpen && '-rotate-90',
                    )}
                  />
                </button>

                <div className={cn('mt-1 space-y-0.5', !isOpen && 'hidden')}>
                  {section.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/'}
                      className={({ isActive }) =>
                        cn(
                          itemBase,
                          isActive
                            ? 'bg-accent font-medium text-foreground before:opacity-100'
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <i
                            className={cn(
                              'bi w-4 text-center text-[0.9rem]',
                              item.icon ?? 'bi-dot',
                              isActive ? 'text-brand' : 'text-muted-foreground',
                            )}
                          />
                          <span className="truncate">{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
      )}

      <div
        className={cn(
          'border-t border-border px-3.5 py-3 text-[0.6875rem] text-muted-foreground',
          collapsed && 'text-center',
        )}
      >
        {collapsed ? 'v1' : `© ${new Date().getFullYear()} Aegis · v1.0`}
      </div>
    </aside>
  );
}
