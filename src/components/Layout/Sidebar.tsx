import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, MenuDivider, MenuItem, Popover, Tooltip } from '@blueprintjs/core';
import navigation from '../../data/navigation';
import type { NavSection } from '../../types/navigation';
import { useAuth } from '../../auth/AuthContext';
import { cn } from '../../lib/cn';

function sectionContainsPath(section: NavSection, pathname: string): boolean {
  return section.items.some((item) => item.path === pathname);
}

interface SidebarProps {
  mobileOpen: boolean;
  collapsed: boolean;
}

const itemBase =
  'flex items-center gap-2.5 rounded-lg border px-2.5 py-[0.4rem] text-[0.8125rem] transition-colors';
const itemActive = 'border-transparent bg-accent font-medium text-foreground';
const itemIdle = 'border-transparent text-muted-foreground hover:bg-accent/60 hover:text-foreground';

export default function Sidebar({ mobileOpen, collapsed }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const [openKeys, setOpenKeys] = useState<Set<string>>(() => {
    const active = navigation.find((s) => sectionContainsPath(s, location.pathname));
    return new Set(active ? [active.key] : navigation.map((s) => s.key));
  });

  // "/" focuses the nav search, like the hint in the field says.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== '/' || collapsed) return;
      const t = e.target as HTMLElement;
      if (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) return;
      e.preventDefault();
      searchRef.current?.focus();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [collapsed]);

  function toggle(key: string) {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const flatItems = navigation.flatMap((s) => s.items);
  const q = query.trim().toLowerCase();
  const sections = q
    ? navigation
        .map((s) => ({ ...s, items: s.items.filter((i) => i.label.toLowerCase().includes(q)) }))
        .filter((s) => s.items.length > 0)
    : navigation;

  const displayName = user?.name || user?.email || 'Signed in';
  const userInitials = displayName.slice(0, 2).toUpperCase();

  return (
    <aside className="app-sidebar" data-collapsed={collapsed} data-mobile-open={mobileOpen}>
      {/* Workspace */}
      <div className={cn('flex items-center gap-2.5 px-3.5 pb-2 pt-3.5', collapsed && 'justify-center px-0')}>
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
          <i className="bi bi-shield-fill-check text-[0.85rem]" />
        </span>
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="truncate text-[0.875rem] font-semibold text-foreground">Aegis</div>
              <div className="truncate text-[0.6875rem] text-muted-foreground">Sales workspace</div>
            </div>
            <i className="bi bi-chevron-expand text-xs text-muted-foreground" />
          </>
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
                    'grid size-9 place-items-center rounded-lg border text-[1rem] transition-colors',
                    isActive ? itemActive : itemIdle,
                  )
                }
              >
                <i className={cn('bi', item.icon ?? 'bi-dot')} />
              </NavLink>
            </Tooltip>
          ))}
        </nav>
      ) : (
        <>
          <div className="px-3 pb-1 pt-2">
            <label className="flex h-8 items-center gap-2 rounded-lg border border-border bg-surface px-2.5 text-[0.8125rem] text-muted-foreground focus-within:border-ring">
              <i className="bi bi-search text-xs" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== 'Escape') return;
                  setQuery('');
                  e.currentTarget.blur();
                }}
                placeholder="Search"
                className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded-sm border border-border px-1.5 font-sans text-[0.625rem] leading-4">/</kbd>
            </label>
          </div>

          <nav className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-3 py-2">
            {sections.map((section) => {
              const isOpen = q !== '' || openKeys.has(section.key);
              return (
                <div key={section.key}>
                  <button
                    type="button"
                    onClick={() => toggle(section.key)}
                    className="flex w-full items-center gap-1.5 px-1 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground/80 transition-colors hover:text-foreground"
                  >
                    <i className={cn('bi bi-chevron-up text-[0.6rem] transition-transform', !isOpen && 'rotate-180')} />
                    {section.label}
                  </button>

                  <div className={cn('mt-0.5 space-y-0.5', !isOpen && 'hidden')}>
                    {section.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) => cn(itemBase, isActive ? itemActive : itemIdle)}
                      >
                        {({ isActive }) => (
                          <>
                            <i
                              className={cn(
                                'bi w-4 text-center text-[0.9rem]',
                                item.icon ?? 'bi-dot',
                                isActive ? 'text-foreground' : 'text-muted-foreground',
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
            {sections.length === 0 && (
              <p className="px-1 py-2 text-xs text-muted-foreground">No pages match “{query}”.</p>
            )}
          </nav>
        </>
      )}

      {/* User */}
      <div className={cn('flex items-center gap-2.5 border-t border-border px-3.5 py-3', collapsed && 'justify-center px-0')}>
        <span className="relative grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-[0.6875rem] font-semibold text-brand-stronger">
          {userInitials}
          <span className="absolute bottom-0 right-0 size-2 rounded-full bg-success ring-2 ring-sidebar" />
        </span>
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="truncate text-[0.8125rem] font-medium text-foreground">{displayName}</div>
              <div className="truncate text-[0.6875rem] text-muted-foreground">{user?.role || user?.email}</div>
            </div>
            <Popover
              placement="top-end"
              content={
                <Menu>
                  <MenuItem icon="user" text="Profile" />
                  <MenuItem icon="cog" text="Settings" href="/settings" />
                  <MenuDivider />
                  <MenuItem icon="log-out" text="Sign out" intent="danger" onClick={() => void logout()} />
                </Menu>
              }
            >
              <button
                type="button"
                aria-label="Account menu"
                className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <i className="bi bi-three-dots" />
              </button>
            </Popover>
          </>
        )}
      </div>
    </aside>
  );
}
