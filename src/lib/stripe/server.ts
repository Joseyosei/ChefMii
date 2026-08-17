import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_for_build_time'

export const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2026-02-25.clover',
    typescript: true,
})
