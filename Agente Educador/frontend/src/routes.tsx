import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { Spinner } from '@chakra-ui/react';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import CursosRoutes from './modules/cursos/routes';
import HistoryRoutes from './modules/history/routes';
import ScienceRoutes from './modules/science/routes';

// Lazy load pages
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.default })));
const NotFound = lazy(() => import('./pages/NotFound').then(module => ({ default: module.default })));
const Register = lazy(() => import('./pages/Register').then(module => ({ default: module.default })));
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.default })));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword').then(module => ({ default: module.default })));
const Dashboard = lazy(() => import('./pages/app/dashboard').then(module => ({ default: module.default })));
const Profile = lazy(() => import('./pages/profile').then(module => ({ default: module.default })));

// Componente de carga
const Loading = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
    <Spinner size="xl" />
  </div>
);

const AppRoutes = () => {
  // Configurar las banderas futuras de React Router
  useEffect(() => {
    if (import.meta.env.MODE === 'development') {
      // @ts-ignore
      window.__reactRouterEnableFuture = {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      };
    }
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        
        {/* Rutas de cursos */}
        <Route path="/cursos/*" element={<CursosRoutes />} />
        
        {/* Rutas de historia */}
        <Route path="/history/*" element={<HistoryRoutes />} />
        
        {/* Rutas de ciencia */}
        <Route path="/science/*" element={<ScienceRoutes />} />
        
        {/* Rutas de autenticación */}
        <Route path="/auth/register" element={<AuthLayout><Register /></AuthLayout>} />
        <Route path="/auth/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/auth/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
        
        {/* Rutas protegidas con el layout principal */}
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
