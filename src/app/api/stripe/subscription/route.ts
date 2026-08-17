import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'

export const dynamic = 'force-dynamic'

// Available subscription plans in ChefMii
const PLANS: Record<string, { name: string; amount: number; interval: 'month' | 'year'; description: string }> = {
    'plus-monthly': {
        name: 'ChefMii Plus (Monthly)',
        amount: 999, // £9.99 in pence
        interval: 'month',
        description: 'Free gourmet delivery, 5% booking cashback, and priority chef access',
    },
    'plus-annual': {
        name: 'ChefMii Plus (Annual)',
        amount: 8999, // £89.99 in pence
        interval: 'year',
        description: 'Free gourmet delivery, 5% booking cashback, and priority chef access (Save 25%)',
    },
    'business-monthly': {
        name: 'ChefMii Business (Monthly)',
        amount: 4999, // £49.99 in pence
        interval: 'month',
        description: 'Corporate catering, 10 team member seats, dedicated account manager',
    },
    'chef-pro-monthly': {
        name: 'ChefMii Pro Chef Membership',
        amount: 2999, // £29.99 in pence
        interval: 'month',
        description: 'Reduced 5% platform commission, priority search ranking, video portfolio',
    },
    'chef-enterprise-monthly': {
        name: 'ChefMii Executive Master Chef',
        amount: 9999, // £99.99 in pence
        interval: 'month',
        description: '0% commission on direct bookings, global brand sponsorship, VIP concierges',
    },
    'academy-monthly': {
        name: 'ChefMii Academy All-Access Pass',
        amount: 1499, // £14.99 in pence
        interval: 'month',
        description: 'Unlimited access to masterclasses, live culinary workshops, and chef certifications',
    },
}

export async function POST(request: NextRequest) {
    try {
        let userId: string | null = null
        let userEmail: string | null = null

        // Verify Firebase Auth Token if available
        const authHeader = request.headers.get('Authorization')
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const idToken = authHeader.split('Bearer ')[1]
            try {
                const decodedToken = await adminAuth.verifyIdToken(idToken)
                userId = decodedToken.uid
                userEmail = decodedToken.email || null
            } catch (authError) {
                console.warn('ID token verification skipped in subscription checkout:', authError)
            }
        }

        const body = await request.json()
        const { planId, returnUrl } = body

        if (!userId && body.userId) {
            userId = body.userId
        }
        if (!userEmail && body.email) {
            userEmail = body.email
        }

        const selectedPlan = PLANS[planId] || PLANS['plus-monthly']
        const origin = returnUrl || request.headers.get('origin') || 'https://chefmii.com'

        // 1. Create or retrieve Stripe Customer
        let customerId: string | undefined
        if (userEmail) {
            try {
                const existingCustomers = await stripe.customers.list({ email: userEmail, limit: 1 })
                if (existingCustomers.data.length > 0) {
                    customerId = existingCustomers.data[0].id
                } else {
                    const newCustomer = await stripe.customers.create({
                        email: userEmail,
                        metadata: {
                            userId: userId || 'anonymous',
                            platform: 'ChefMii',
                        },
                    })
                    customerId = newCustomer.id
                }
            } catch (custErr) {
                console.warn('Stripe customer lookup/creation warning:', custErr)
            }
        }

        // 2. Create Stripe Checkout Session in Subscription mode
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            customer: customerId,
            customer_email: customerId ? undefined : userEmail || undefined,
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'gbp',
                        product_data: {
                            name: selectedPlan.name,
                            description: selectedPlan.description,
                        },
                        unit_amount: selectedPlan.amount,
                        recurring: {
                            interval: selectedPlan.interval,
                        },
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId: userId || 'anonymous',
                planId: planId || 'plus-monthly',
                type: 'subscription',
            },
            subscription_data: {
                trial_period_days: planId?.includes('plus') ? 7 : undefined, // 7-day free trial for Plus
                metadata: {
                    userId: userId || 'anonymous',
                    planId: planId || 'plus-monthly',
                },
            },
            success_url: `${origin}/pricing?session_id={CHECKOUT_SESSION_ID}&status=success&plan=${planId}`,
            cancel_url: `${origin}/pricing?status=cancelled`,
        })

        // 3. Save pending subscription intent to Firestore
        if (userId) {
            try {
                await adminDb.collection('subscriptions').add({
                    user_id: userId,
                    plan_id: planId || 'plus-monthly',
                    plan_name: selectedPlan.name,
                    amount: selectedPlan.amount / 100,
                    interval: selectedPlan.interval,
                    stripe_session_id: session.id,
                    status: 'pending',
                    created_at: FieldValue.serverTimestamp(),
                    updated_at: FieldValue.serverTimestamp(),
                })
            } catch (dbErr) {
                console.warn('Firestore subscription record warning:', dbErr)
            }
        }

        return NextResponse.json({
            sessionId: session.id,
            url: session.url,
        })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Subscription checkout failed'
        console.error('Subscription checkout error:', error)
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
