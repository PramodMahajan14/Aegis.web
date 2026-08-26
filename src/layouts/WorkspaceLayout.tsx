import { Outlet } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';

export default function WorkspaceLayout() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
