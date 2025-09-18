import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('/sign-in', 'routes/auth/login.tsx'),
  route('/sign-up', 'routes/auth/register.tsx'),
  route('/verify-email', 'routes/auth/verify-email.tsx'),
] satisfies RouteConfig;
