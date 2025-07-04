import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Lazy load pages
const Home = lazy(() => import('@/pages/Home'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Componente de prueba (solo para desarrollo)
const RegisterTest = lazy(() => import('@/test/RegisterTest'));

// Layout Wrapper para rutas públicas
const PublicLayout = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

// Layout Wrapper para rutas protegidas
const ProtectedLayout = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="auth">
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          
          {/* Ruta de prueba para desarrollo */}
          {import.meta.env.DEV && (
            <Route path="test/register" element={<RegisterTest />} />
          )}
          
          <Route path="terminos" element={<NotFound />} />
          <Route path="privacidad" element={<NotFound />} />
          <Route path="contacto" element={<NotFound />} />
        </Route>

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedLayout />}>
          <Route index element={<Dashboard />} />
        </Route>

        {/* Redirect to login if not authenticated */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
