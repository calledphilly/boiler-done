import { stripeClient } from '@better-auth/stripe/client';
import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from "better-auth/client/plugins";
import {auth} from "server/src/utils/auth"

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
<<<<<<< Updated upstream
  baseURL: 'http://localhost:3000',
  plugins: [
    stripeClient({
      subscription: true,
    }),
  ],
=======
	baseURL: 'http://localhost:3000',
	plugins: [
		inferAdditionalFields<typeof auth>(),
		stripeClient({
			subscription: true, //if you want to enable subscription management
		})
	],
>>>>>>> Stashed changes
});
