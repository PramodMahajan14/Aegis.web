import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="main-content-auth">
      <Outlet />
    </div>
  );
}
