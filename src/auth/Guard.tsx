import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from '../components/common/Loader';
import { useAuth } from './AuthContext';

// Routes reachable without an authenticated session.
const PUBLIC_ROUTES = ['/login'];

export default function Guard() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

  if (loading) {
    return <Loader fullscreen />;
  }

  // NOT LOGGED IN
  // if (!user) {
  //   if (isPublicRoute) return <Outlet />;
  //   return <Navigate to="/login" replace state={{ from: location }} />;
  // }

  // LOGGED IN — block auth pages from being revisited
  if (isPublicRoute) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
