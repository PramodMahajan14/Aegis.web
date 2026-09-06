import { Outlet } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { WindowProvider } from '../components/common/WindowProvider';
import { ConfirmProvider } from '../components/common/ConfirmProvider';

export default function WorkspaceLayout() {
  return (
    <DashboardLayout>
      <Outlet />
      <WindowProvider />
      <ConfirmProvider />
    </DashboardLayout>
  );
}
