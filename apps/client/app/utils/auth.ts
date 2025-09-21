import { stripeClient } from '@better-auth/stripe/client';
import { createAuthClient } from 'better-auth/react';

export const {
  signOut,
  signIn,
  signUp,
  useSession,
  sendVerificationEmail,
  requestPasswordReset,
  resetPassword,
  subscription,
  stripe,
  ...auth
} = createAuthClient({
  baseURL: 'http://localhost:3000',
  plugins: [
    stripeClient({
      subscription: true,
    }),
  ],
});
