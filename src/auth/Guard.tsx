import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from '../components/common/Loader';
import { useAuth, AuthStage, stageAtLeast } from './AuthContext';
import type { AuthStageType } from '../hooks/authApi/authTypes';

interface GuardProps {
  /**
   * Minimum auth stage required to access the wrapped routes.
   *
   * Examples:
   *   minStage={AuthStage.UNAUTHENTICATED}        → public routes (login page)
   *   minStage={AuthStage.AUTHENTICATED_NO_WORKSPACE} → workspace selector
   *   minStage={AuthStage.WORKSPACE_SCOPED}        → full authenticated app
   */
  minStage?: AuthStageType;
  /**
   * When true, authenticated users are redirected AWAY from this route group.
   * Use this for the login page — logged-in users should never see it.
   */
  redirectIfAuthenticated?: boolean;
}

/**
 * Route guard component.
 *
 * Renders a full-screen loader while the silent refresh is in flight (booting).
 * Once booting completes, it compares the current auth stage against minStage
 * and either renders <Outlet /> or redirects to the appropriate page.
 *
 * Smart fallback: a user who is AUTHENTICATED_NO_WORKSPACE trying to reach an
 * org-scoped route is sent to /workspaces rather than all the way back to /login.
 */
export default function Guard({
  minStage = AuthStage.WORKSPACE_SCOPED,
  redirectIfAuthenticated = false,
}: GuardProps) {
  const { stage, booting } = useAuth();
  const location = useLocation();

  // Still attempting silent refresh — render a full-page spinner rather than
  // flashing a redirect to /login for users who have a valid session cookie.
  if (booting) {
    return <Loader fullscreen />;
  }

  // ── Public route group (e.g. /login) ──────────────────────────────────────
  if (redirectIfAuthenticated) {
    // If the user is already authenticated at any level, redirect them away
    if (stageAtLeast(stage, AuthStage.AUTHENTICATED_NO_WORKSPACE)) {
      const destination = stageAtLeast(stage, AuthStage.WORKSPACE_SCOPED)
        ? '/'
        : '/workspaces';
      return <Navigate to={destination} replace />;
    }
    return <Outlet />;
  }

  // ── Protected route group ─────────────────────────────────────────────────
  if (!stageAtLeast(stage, minStage)) {
    // Smart fallback: user is logged in but hasn't selected a workspace yet,
    // and is trying to hit an org-scoped route (e.g. bookmark or direct URL).
    // Send them to workspace selection instead of all the way back to /login.
    if (
      minStage === AuthStage.WORKSPACE_SCOPED &&
      stageAtLeast(stage, AuthStage.AUTHENTICATED_NO_WORKSPACE)
    ) {
      return <Navigate to="/workspaces" replace />;
    }

    // Otherwise redirect to login, preserving the intended destination
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
