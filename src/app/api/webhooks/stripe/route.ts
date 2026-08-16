import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { adminDb } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

async function updateBookingByPaymentIntent(paymentIntentId: string, status: string) {
    try {
        const snap = await adminDb.collection('bookings')
            .where('stripe_payment_intent_id', '==', paymentIntentId)
            .get()

        if (snap.empty) {
            console.log(`No booking found for payment intent: ${paymentIntentId}`)
            return
        }

        const batch = adminDb.batch()
        snap.docs.forEach(doc => {
            batch.update(doc.ref, {
                status,
                updatedAt: FieldValue.serverTimestamp(),
            })
        })
        await batch.commit()
    } catch (err) {
        console.error(`Failed to update booking status for intent ${paymentIntentId}:`, err)
    }
}

export async function POST(request: NextRequest) {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature') || ''

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (error) {
        console.error('Webhook signature verification failed:', error)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    switch (event.type) {
        case 'payment_intent.succeeded': {
            const pi = event.data.object as Stripe.PaymentIntent
            await updateBookingByPaymentIntent(pi.id, 'confirmed')
            break
        }
        case 'payment_intent.payment_failed': {
            const pi = event.data.object as Stripe.PaymentIntent
            await updateBookingByPaymentIntent(pi.id, 'cancelled')
            break
        }
        case 'charge.refunded': {
            const charge = event.data.object as Stripe.Charge
            if (charge.payment_intent) {
                const intentId = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent.id
                await updateBookingByPaymentIntent(intentId, 'refunded')
            }
            break
        }
        default:
            console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
}
