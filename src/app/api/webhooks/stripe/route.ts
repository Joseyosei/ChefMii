import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { adminDb } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature') || ''

    let event: Stripe.Event

    try {
        if (webhookSecret && signature) {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
        } else {
            // Unsigned/development fallback
            event = JSON.parse(body) as Stripe.Event
        }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        console.error(`Webhook signature verification failed: ${message}`)
        return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
    }

    try {
        switch (event.type) {
            // ── 1. Checkout Session Completed (Primary Booking Flow) ──
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session
                const bookingId = session.metadata?.bookingId

                try {
                    if (bookingId) {
                        const bookingRef = adminDb.collection('bookings').doc(bookingId)
                        const docSnap = await bookingRef.get()
                        if (docSnap.exists) {
                            await bookingRef.update({
                                status: 'confirmed',
                                payment_status: 'paid',
                                payout_status: 'held', // Escrow: held until event date
                                stripe_session_id: session.id,
                                stripe_payment_intent_id: (session.payment_intent as string) || null,
                                paid_at: FieldValue.serverTimestamp(),
                                updated_at: FieldValue.serverTimestamp(),
                            })
                        }
                    } else if (session.id) {
                        const snaps = await adminDb.collection('bookings')
                            .where('stripe_session_id', '==', session.id)
                            .limit(1)
                            .get()
                        if (!snaps.empty) {
                            await snaps.docs[0].ref.update({
                                status: 'confirmed',
                                payment_status: 'paid',
                                payout_status: 'held',
                                stripe_payment_intent_id: (session.payment_intent as string) || null,
                                paid_at: FieldValue.serverTimestamp(),
                                updated_at: FieldValue.serverTimestamp(),
                            })
                        }
                    }
                } catch (dbErr) {
                    console.warn('Firestore update warning in webhook checkout.session.completed:', dbErr)
                }
                break
            }

            // ── 2. Payment Intent Succeeded ──
            case 'payment_intent.succeeded': {
                const pi = event.data.object as Stripe.PaymentIntent
                try {
                    const snaps = await adminDb.collection('bookings')
                        .where('stripe_payment_intent_id', '==', pi.id)
                        .limit(1)
                        .get()
                    if (!snaps.empty) {
                        await snaps.docs[0].ref.update({
                            status: 'confirmed',
                            payment_status: 'paid',
                            payout_status: 'held',
                            paid_at: FieldValue.serverTimestamp(),
                            updated_at: FieldValue.serverTimestamp(),
                        })
                    }
                } catch (dbErr) {
                    console.warn('Firestore update warning in webhook payment_intent.succeeded:', dbErr)
                }
                break
            }

            // ── 3. Payment Intent Failed ──
            case 'payment_intent.payment_failed': {
                const pi = event.data.object as Stripe.PaymentIntent
                try {
                    const snaps = await adminDb.collection('bookings')
                        .where('stripe_payment_intent_id', '==', pi.id)
                        .limit(1)
                        .get()
                    if (!snaps.empty) {
                        await snaps.docs[0].ref.update({
                            status: 'payment_failed',
                            payment_status: 'failed',
                            updated_at: FieldValue.serverTimestamp(),
                        })
                    }
                } catch (dbErr) {
                    console.warn('Firestore update warning in webhook payment_intent.payment_failed:', dbErr)
                }
                break
            }

            // ── 4. Connected Account Updated (Stripe Connect Onboarding) ──
            case 'account.updated': {
                const account = event.data.object as Stripe.Account
                try {
                    const chefSnaps = await adminDb.collection('chefs')
                        .where('stripe_account_id', '==', account.id)
                        .limit(1)
                        .get()
                    if (!chefSnaps.empty) {
                        await chefSnaps.docs[0].ref.update({
                            charges_enabled: account.charges_enabled,
                            payouts_enabled: account.payouts_enabled,
                            stripe_status: account.details_submitted ? 'active' : 'pending',
                            updated_at: FieldValue.serverTimestamp(),
                        })
                    }
                } catch (dbErr) {
                    console.warn('Firestore update warning in webhook account.updated:', dbErr)
                }
                break
            }

            // ── 5. Charge Refunded ──
            case 'charge.refunded': {
                const charge = event.data.object as Stripe.Charge
                const piId = typeof charge.payment_intent === 'string' ? charge.payment_intent : null
                if (piId) {
                    try {
                        const snaps = await adminDb.collection('bookings')
                            .where('stripe_payment_intent_id', '==', piId)
                            .limit(1)
                            .get()
                        if (!snaps.empty) {
                            await snaps.docs[0].ref.update({
                                status: 'refunded',
                                payment_status: 'refunded',
                                payout_status: 'reversed',
                                refunded_at: FieldValue.serverTimestamp(),
                                updated_at: FieldValue.serverTimestamp(),
                            })
                        }
                    } catch (dbErr) {
                        console.warn('Firestore update warning in webhook charge.refunded:', dbErr)
                    }
                }
                break
            }

            // ── 6. Subscription Created / Updated (ChefMii Plus, Pro, Business) ──
            case 'customer.subscription.created':
            case 'customer.subscription.updated': {
                const sub = event.data.object as Stripe.Subscription
                const userId = sub.metadata?.userId
                const planId = sub.metadata?.planId

                try {
                    if (userId && userId !== 'anonymous') {
                        await adminDb.collection('users').doc(userId).set({
                            subscription_status: sub.status,
                            subscription_id: sub.id,
                            subscription_plan: planId || 'plus-monthly',
                            subscription_current_period_end: (sub as any).current_period_end ? new Date((sub as any).current_period_end * 1000) : new Date(),
                            updated_at: FieldValue.serverTimestamp(),
                        }, { merge: true })
                    }
                } catch (dbErr) {
                    console.warn('Firestore update warning in webhook subscription update:', dbErr)
                }
                break
            }

            // ── 7. Subscription Cancelled / Deleted ──
            case 'customer.subscription.deleted': {
                const sub = event.data.object as Stripe.Subscription
                const userId = sub.metadata?.userId

                try {
                    if (userId && userId !== 'anonymous') {
                        await adminDb.collection('users').doc(userId).set({
                            subscription_status: 'cancelled',
                            subscription_cancelled_at: FieldValue.serverTimestamp(),
                            updated_at: FieldValue.serverTimestamp(),
                        }, { merge: true })
                    }
                } catch (dbErr) {
                    console.warn('Firestore update warning in webhook subscription delete:', dbErr)
                }
                break
            }

            // ── 8. Recurring Invoice Payment Succeeded ──
            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as Stripe.Invoice
                const subId = typeof (invoice as any).subscription === 'string' ? (invoice as any).subscription : null
                try {
                    if (subId) {
                        const snaps = await adminDb.collection('subscriptions')
                            .where('stripe_subscription_id', '==', subId)
                            .limit(1)
                            .get()
                        if (!snaps.empty) {
                            await snaps.docs[0].ref.update({
                                status: 'active',
                                last_payment_date: FieldValue.serverTimestamp(),
                                updated_at: FieldValue.serverTimestamp(),
                            })
                        }
                    }
                } catch (dbErr) {
                    console.warn('Firestore invoice update warning:', dbErr)
                }
                break
            }

            default:
                break
        }

        return NextResponse.json({ received: true, success: true })
    } catch (error) {
        console.error('Stripe webhook handling error:', error)
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
    }
}
