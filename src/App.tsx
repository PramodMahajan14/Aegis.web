import type { JSX } from 'react';
import { Routes, Route } from 'react-router-dom';
import navigation from './data/navigation';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import StubPage from './components/StubPage';

import Analytical from './pages/dashboards/Analytical';
import Ecommerce from './pages/dashboards/Ecommerce';
import Inbox from './pages/app/Inbox';
import Chat from './pages/app/Chat';
import Calendar from './pages/app/Calendar';
import Taskboard from './pages/app/Taskboard';
import FileManagerDashboard from './pages/filemanager/Dashboard';
import BlogList from './pages/blog/List';
import Buttons from './pages/ui/Buttons';
import Colors from './pages/ui/Colors';
import Statistics from './pages/widgets/Statistics';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Lockscreen from './pages/auth/Lockscreen';
import ForgotPassword from './pages/auth/ForgotPassword';
import ErrorPage from './pages/errors/ErrorPage';
import Profile from './pages/pages/Profile';
import Pricing from './pages/pages/Pricing';
import Invoices from './pages/pages/Invoices';
import Faq from './pages/pages/Faq';
import FormsBasic from './pages/forms/Basic';
import FormsValidation from './pages/forms/Validation';
import FormsAdvanced from './pages/forms/Advanced';
import TableNormal from './pages/tables/Normal';
import TableDatatable from './pages/tables/Datatable';
import ChartjsPage from './pages/charts/ChartjsPage';
import SparklinePage from './pages/charts/SparklinePage';
import GoogleMap from './pages/maps/GoogleMap';

type Overrides = Record<string, () => JSX.Element>;

// Flagship pages get a hand-built component. Everything else in the sitemap
// is wired to a StubPage so the full 97-page nav is navigable end to end.
const overrides: Overrides = {
  '/': Analytical,
  '/dashboard/ecommerce': Ecommerce,
  '/app/inbox': Inbox,
  '/app/chat': Chat,
  '/app/calendar': Calendar,
  '/app/taskboard': Taskboard,
  '/file-manager/dashboard': FileManagerDashboard,
  '/blog/list': BlogList,
  '/ui/buttons': Buttons,
  '/ui/colors': Colors,
  '/widgets/statistics': Statistics,
  '/pages/login': Login,
  '/pages/register': Register,
  '/pages/lockscreen': Lockscreen,
  '/pages/forgot-password': ForgotPassword,
  '/pages/404': () => <ErrorPage code="404" />,
  '/pages/403': () => <ErrorPage code="403" />,
  '/pages/500': () => <ErrorPage code="500" />,
  '/pages/503': () => <ErrorPage code="503" />,
  '/pages/profile': Profile,
  '/pages/pricing': Pricing,
  '/pages/invoices': Invoices,
  '/pages/faq': Faq,
  '/forms/basic': FormsBasic,
  '/forms/validation': FormsValidation,
  '/forms/advanced': FormsAdvanced,
  '/table/normal': TableNormal,
  '/table/datatable': TableDatatable,
  '/chart/chartjs': ChartjsPage,
  '/chart/sparkline': SparklinePage,
  '/maps/google': GoogleMap,
};

interface RouteEntry {
  path: string;
  element: JSX.Element;
}

const bareRoutes: RouteEntry[] = [];
const shellRoutes: RouteEntry[] = [];

navigation.forEach((section) => {
  section.items.forEach((item) => {
    const Component = overrides[item.path];
    const element = Component ? (
      <Component />
    ) : (
      <StubPage title={item.label} crumbs={[section.label, item.label]} icon={section.icon} />
    );
    const entry: RouteEntry = { path: item.path, element };
    if (item.bare) bareRoutes.push(entry);
    else shellRoutes.push(entry);
  });
});

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        {bareRoutes.map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}
        <Route path="*" element={<ErrorPage code="404" />} />
      </Route>
      <Route element={<DashboardLayout />}>
        {shellRoutes.map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}
      </Route>
    </Routes>
  );
}
