import { stripe } from '@better-auth/stripe';
import { db } from '@workspace/db';
import * as schema from '@workspace/db/schema/auth';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createAuthMiddleware, openAPI } from 'better-auth/plugins';
import { plans } from '../constants/plans';
import { ConfirmPaymentMailer } from '../mail/confirm-payment';
import { ResetPasswordMailer } from '../mail/reset-password';
import { VerifyEmailMaliler } from '../mail/verify-email';
import { WelcomeMailer } from '../mail/welcome';
import { stripeClient } from '../utils/stripe';

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, STRIPE_WEBHOOK_SECRET } =
  process.env;

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  trustedOrigins: ['http://localhost:5173', 'http://localhost:3000'],

  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      ...schema,
    },
  }),
  user: {
    additionalFields: {
      address: {
        type: 'string',
        required: false,
      },
      city: {
        type: 'string',
        required: false,
      },
      region: {
        type: 'string',
        required: false,
      },
      postalCode: {
        type: 'string',
        required: false,
      },
      country: {
        type: 'string',
        required: false,
      },
    },
  },

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

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const mailer = new WelcomeMailer();

          await mailer.send({
            to: user.email,
            subject: 'Welcome to our platform',
            data: {
              name: user.name,
            },
          });
        },
      },
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

  plugins: [
    openAPI(),
    ...(STRIPE_WEBHOOK_SECRET
      ? [
          stripe({
            stripeClient,
            stripeWebhookSecret: STRIPE_WEBHOOK_SECRET,
            createCustomerOnSignUp: true,
            subscription: {
              enabled: true,
              authorizeReference: async () => true,
              plans,
            },
            onEvent: async (event) => {
              switch (event.type) {
                case 'invoice.payment_succeeded': {
                  if (event.data.object.customer_email) {
                    const mailer = new ConfirmPaymentMailer();

                    await mailer.send({
                      to: event.data.object.customer_email,
                      subject: 'Payment Confirmation',
                      data: {
                        order_id: String(event.data.object.id),
                        amount: event.data.object.amount_paid / 100 || 0,
                        currency: event.data.object.currency || 'USD',
                        invoice_url: event.data.object.invoice_pdf || undefined,
                        name: event.data.object.customer_name || undefined,
                      },
                    });
                  }
                }
              }
            },
          }),
        ]
      : []),
  ],
});
