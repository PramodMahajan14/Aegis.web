import type { RouteObject } from 'react-router-dom';
import Guard from '../auth/Guard';
import WorkspaceLayout from '../layouts/WorkspaceLayout';
import AuthLayout from '../layouts/AuthLayout';
import Blank from '../layouts/Blank';
import Home from '../pages/Home';
import Login from '../pages/AuthPages/Login';
import ErrorPage from '../pages/errors/ErrorPage';

const routes: RouteObject[] = [
  {
    element: <Guard />,
    errorElement: <ErrorPage code="500" />,
    children: [
      // ── AUTH ──────────────────────────────────────────────────────────────
      {
        element: <AuthLayout />,
        children: [{ path: '/login', element: <Login /> }],
      },

      // ── WORKSPACE ────────────────────────────────────────────────────────
      {
        element: <WorkspaceLayout />,
        children: [
          { path: '/', element: <Home /> },
          { path: '/employees', element: < div> Hellow EMppllu </div> },
        ],
      },

      // ── FALLBACK ─────────────────────────────────────────────────────────
      {
        element: <Blank />,
        children: [{ path: '*', element: <ErrorPage code="404" /> }],
      },
    ],
  },
];

export default routes;
