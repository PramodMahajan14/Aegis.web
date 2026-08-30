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
    if (window.innerWidth < 992) {
      setMobileOpen((v) => !v);
    } else {
      setCollapsed((v) => !v);
    }
  }

  return (
    <div className="aegis-main">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="aegis-body">
        <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} />
        <main className="main-content">
          {children ?? <Outlet />}
        </main>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
