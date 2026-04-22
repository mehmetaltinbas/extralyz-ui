import { loadStripe, type Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripePromise(): Promise<Stripe | null> {
    if (!stripePromise) {
        const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
        stripePromise = loadStripe(key ?? '');
    }
    return stripePromise;
}
