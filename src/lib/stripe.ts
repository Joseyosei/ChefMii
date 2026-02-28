import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

export const stripePromise = loadStripe(stripePublishableKey);

export type CheckoutType = 'booking' | 'shop' | 'course';

export interface CheckoutItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CreateCheckoutParams {
  type: CheckoutType;
  items: CheckoutItem[];
  metadata?: Record<string, string>;
  successUrl?: string;
  cancelUrl?: string;
}
