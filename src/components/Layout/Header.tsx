import { Link } from 'react-router-dom';
import { Menu, MenuDivider, MenuItem, Popover } from '@blueprintjs/core';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../auth/AuthContext';
import { IconButton } from '../ui/IconButton';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <header className="app-topbar">
      <IconButton onClick={onToggleSidebar} aria-label="Toggle menu">
        <i className="bi bi-list text-xl" />
      </IconButton>

      <Link
        to="/"
        className="flex items-center gap-2 pr-1 text-[0.95rem] font-semibold tracking-tight text-foreground hover:text-foreground"
      >
        <span className="grid size-6 place-items-center rounded-md bg-brand text-white">
          <i className="bi bi-shield-fill-check text-[0.7rem]" />
        </span>
        Aegis
      </Link>

      {/* Command-style search */}
      <button
        type="button"
        className="ml-1 hidden h-9 min-w-0 max-w-sm flex-1 items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 text-[0.8125rem] text-muted-foreground transition-colors hover:border-border-strong hover:bg-accent md:flex"
      >
        <i className="bi bi-search text-xs" />
        <span className="truncate">Search…</span>
        <kbd className="ml-auto hidden rounded border border-border bg-surface px-1.5 py-0.5 font-sans text-[0.6875rem] text-muted-foreground lg:block">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-0.5">
        <IconButton
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          <i className={theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars'} />
        </IconButton>

        <IconButton title="Notifications" aria-label="Notifications">
          <i className="bi bi-bell" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-danger ring-2 ring-surface" />
        </IconButton>

        <Popover
          placement="bottom-end"
          content={
            <Menu>
              <MenuItem icon="user" text="Profile" />
              <MenuItem icon="cog" text="Settings" href="/settings" />
              <MenuDivider />
              <MenuItem
                icon="log-out"
                text="Sign out"
                intent="danger"
                onClick={() => void logout()}
              />
            </Menu>
          }
        >
          <button className="ml-1 flex items-center gap-1.5 rounded-lg p-1 transition-colors hover:bg-accent">
            <span className="grid size-7 place-items-center rounded-full bg-brand-soft text-[0.6875rem] font-semibold text-brand-stronger">
              AT
            </span>
            <i className="bi bi-chevron-down hidden pr-1 text-[0.7rem] text-muted-foreground sm:block" />
          </button>
        </Popover>
      </div>
    </header>
  );
}
