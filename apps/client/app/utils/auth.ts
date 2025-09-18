import { createAuthClient } from 'better-auth/react';

export const {
  signOut,
  signIn,
  signUp,
  useSession,
  sendVerificationEmail,
  requestPasswordReset,
  resetPassword,
} = createAuthClient({
  baseURL: 'http://localhost:3000',
});
