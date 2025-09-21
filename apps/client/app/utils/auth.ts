import { stripeClient } from '@better-auth/stripe/client';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { auth as authServer } from '@workspace/server/src/utils/auth';

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
		inferAdditionalFields<typeof authServer>(),
		stripeClient({
			subscription: true, //if you want to enable subscription management
		}),
	],
});
