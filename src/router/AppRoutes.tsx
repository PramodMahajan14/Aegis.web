import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Blank from '../layouts/Blank';
import Home from '../pages/Home';
import ErrorPage from '../pages/errors/ErrorPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route element={<Blank />}>
        <Route path="*" element={<ErrorPage code="404" />} />
      </Route>
    </Routes>
  );
}
