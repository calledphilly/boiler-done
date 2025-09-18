import { betterAuth } from 'better-auth';
import { db } from '@workspace/db';
import * as schema from '@workspace/db/schema/auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { openAPI } from 'better-auth/plugins';
import { VerifyEmailMaliler } from '../mail/verify-email';

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
  },

  emailVerification: {
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const mailer = new VerifyEmailMaliler();

      await mailer.send({
        to: user.email,
        data: {
          name: user.name,
          url,
        },
      });
    },
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

  plugins: [openAPI()],
});
