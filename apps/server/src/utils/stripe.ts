import Stripe from 'stripe';

const { STRIPE_CLIENT_SECRET } = process.env;

if (!STRIPE_CLIENT_SECRET) {
  throw new Error('STRIPE_CLIENT_SECRET is not defined');
}

export const stripeClient = new Stripe(STRIPE_CLIENT_SECRET);
