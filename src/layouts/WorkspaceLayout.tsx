import { Outlet } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { WindowProvider } from '../components/common/WindowProvider';

export default function WorkspaceLayout() {
  return (
    <DashboardLayout>
      <Outlet />
      <WindowProvider />
    </DashboardLayout>
  );
}
