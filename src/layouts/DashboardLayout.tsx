import { useState, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';

interface DashboardLayoutProps {
  children?: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggleSidebar() {
    if (window.innerWidth < 1024) {
      setMobileOpen((v) => !v);
    } else {
      setCollapsed((v) => !v);
    }
  }

  return (
    <div className="app-shell">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="app-body">
        <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} />

        {mobileOpen && (
          <div
            className="fixed inset-0 top-[var(--topbar-h)] z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
        )}

        <main className="app-content">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}
