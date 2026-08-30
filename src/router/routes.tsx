import type { RouteObject } from 'react-router-dom';
import Guard from '../auth/Guard';
import { AuthStage } from '../auth/AuthContext';
import WorkspaceLayout from '../layouts/WorkspaceLayout';
import AuthLayout from '../layouts/AuthLayout';
import Blank from '../layouts/Blank';
import Home from '../pages/Home';
import Login from '../pages/AuthPages/Login';
import WorkspaceSelect from '../pages/AuthPages/WorkspaceSelect';
import ErrorPage from '../pages/errors/ErrorPage';

/**
 * Route tree implementing the 3-stage auth flow:
 *
 *   /login         public (redirects away if already authenticated)
 *   /workspaces    requires stage >= AUTHENTICATED_NO_WORKSPACE
 *   / (and /*)     requires stage === WORKSPACE_SCOPED
 *
 * Guard handles booting (full-screen spinner while silent refresh is in flight)
 * and the smart fallback: AUTHENTICATED_NO_WORKSPACE trying to hit an org route
 * → redirected to /workspaces, not all the way to /login.
 */
const routes: RouteObject[] = [
  // ── PUBLIC: Login ──────────────────────────────────────────────────────────
  // redirectIfAuthenticated → logged-in users are bounced away from /login
  {
    element: <Guard minStage={AuthStage.UNAUTHENTICATED} redirectIfAuthenticated />,
    errorElement: <ErrorPage code="500" />,
    children: [
      {
        element: <AuthLayout />,
        children: [{ path: '/login', element: <Login /> }],
      },
    ],
  },

  // ── SEMI-PROTECTED: Workspace selector ─────────────────────────────────────
  // User must be logged in (user-level token), but workspace not yet selected
  {
    element: <Guard minStage={AuthStage.AUTHENTICATED_NO_WORKSPACE} />,
    errorElement: <ErrorPage code="500" />,
    children: [
      {
        element: <AuthLayout />,
        children: [{ path: '/workspaces', element: <WorkspaceSelect /> }],
      },
    ],
  },

  // ── PROTECTED: Full app (org-scoped token required) ────────────────────────
  {
    element: <Guard minStage={AuthStage.WORKSPACE_SCOPED} />,
    errorElement: <ErrorPage code="500" />,
    children: [
      {
        element: <WorkspaceLayout />,
        children: [
          { path: '/', element: <Home /> },
          { path: '/employees', element: <div>Hello Employees</div> },
        ],
      },
    ],
  },

  // ── FALLBACK: 404 ──────────────────────────────────────────────────────────
  {
    element: <Blank />,
    children: [{ path: '*', element: <ErrorPage code="404" /> }],
  },
];

export default routes;
