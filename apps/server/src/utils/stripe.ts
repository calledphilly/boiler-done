import Stripe from 'stripe';

const { STRIPE_SECRET_KEY } = process.env;

if (!STRIPE_SECRET_KEY) {
	throw new Error('STRIPE_SECRET_KEY is not defined');
}

export const stripeClient = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: '2025-08-27.basil',
});

