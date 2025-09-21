import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('/sign-in', 'routes/auth/login.tsx'),
  route('/sign-up', 'routes/auth/register.tsx'),
  route('/verify-email', 'routes/auth/verify-email.tsx'),
  route('/forgot-password', 'routes/auth/forgot-password.tsx'),
  route('/reset-password', 'routes/auth/reset-password.tsx'),
  layout('routes/layout.tsx', [
    route('/plans', 'routes/plans.tsx'),
    route('/dashboard', 'routes/dashboard.tsx'),
  ]),
] satisfies RouteConfig;
