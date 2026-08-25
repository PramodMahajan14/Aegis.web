import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggleSidebar() {
    if (window.innerWidth < 992) {
      setMobileOpen((v) => !v);
    } else {
      setCollapsed((v) => !v);
    }
  }

  return (
    <div className="app-shell">
      <Topbar onToggleSidebar={toggleSidebar} />
      <div className="app-body">
        <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
