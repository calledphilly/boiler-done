import { stripe } from '@better-auth/stripe';
import { db } from '@workspace/db';
import * as schema from '@workspace/db/schema/auth';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createAuthMiddleware, openAPI } from 'better-auth/plugins';
import { ResetPasswordMailer } from '../mail/reset-password';
import { VerifyEmailMaliler } from '../mail/verify-email';
import { WelcomeMailer } from '../mail/welcome';
import { stripeClient } from './stripe';

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

export const auth = betterAuth({
	trustedOrigins: ['http://localhost:5173', 'http://localhost:3000'],

	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: {
			...schema,
		},
	}),

	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }) => {
			const mailer = new ResetPasswordMailer();

			await mailer.send({
				to: user.email,
				subject: 'Reset your password',
				data: {
					name: user.name,
					url,
				},
			});
		},
	},

	emailVerification: {
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }) => {
			const mailer = new VerifyEmailMaliler();

			await mailer.send({
				to: user.email,
				subject: 'Verify your email',
				data: {
					name: user.name,
					url,
				},
			});
		},
	},

	hooks: {
		after: createAuthMiddleware(async (ctx) => {
			if (ctx.path.startsWith('/sign-up')) {
				const mailer = new WelcomeMailer();

				await mailer.send({
					to: ctx.body.email,
					subject: 'Welcome to our platform',
					data: {
						name: ctx.body.name,
					},
				});
			}
		}),
	},

	advanced: {
		crossSubDomainCookies: { enabled: true },
		crossOriginCookies: {
			allowLocalhostUnsecure: true,
		},
	},

	socialProviders: {
		// Add github provider only if the env variables are set
		...(GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET
			? {
					github: {
						clientId: GITHUB_CLIENT_ID,
						clientSecret: GITHUB_CLIENT_SECRET,
					},
				}
			: {}),
	},

	plugins: [
		openAPI(),
		stripe({
			stripeClient,
			stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
			createCustomerOnSignUp: true,
		}),
	],
});
