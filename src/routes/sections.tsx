import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

import PrivateRoute from 'src/sections/auth/ProtectedRoute';

export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const InventoryPage = lazy(() => import('src/pages/inventory'));
export const AccountingPage = lazy(() => import('src/pages/accounting'));

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        {
          element: (
            // <PrivateRoute>
            <HomePage />
            // </PrivateRoute>
          ),
          index: true,
        },
        {
          path: 'user',
          element: (
            <PrivateRoute>
              <UserPage />
            </PrivateRoute>
          ),
        },
        {
          path: 'products',
          element: (
            <PrivateRoute>
              <ProductsPage />
            </PrivateRoute>
          ),
        },
        {
          path: 'blog',
          element: (
            <PrivateRoute>
              <BlogPage />
            </PrivateRoute>
          ),
        },
        {
          path: '/inventory',
          element: (
            // <PrivateRoute>
            <InventoryPage />
            // </PrivateRoute>
          ),
        },
        {
          path: '/accounting',
          element: (
            <PrivateRoute>
              <AccountingPage />
            </PrivateRoute>
          ),
        },
      ],
    },
    {
      path: 'sign-in',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
