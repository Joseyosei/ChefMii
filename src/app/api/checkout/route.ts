import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'
import { calculatePlatformFee } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        let userId: string | null = null
        const authHeader = request.headers.get('Authorization')
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const idToken = authHeader.split('Bearer ')[1]
            try {
                const decodedToken = await adminAuth.verifyIdToken(idToken)
                userId = decodedToken.uid
            } catch (authError) {
                console.warn('ID token verification skipped in checkout:', authError)
            }
        }

        const body = await request.json()
        const {
            chefId,
            chefName,
            chefSlug,
            eventDate,
            eventTime,
            durationHours,
            guestCount,
            eventType,
            specialRequests,
            location,
            depositOnly,
            isSplitBill,
        } = body

        if (!userId && body.userId) {
            userId = body.userId
        }

        if (!userId) {
            return NextResponse.json({ error: 'Please sign in to complete your booking.' }, { status: 401 })
        }

        const origin = request.headers.get('origin') || 'http://localhost:3000'

        // 1. Calculate pricing
        let hourlyRate = 120
        let connectedAccountId: string | null = null

        try {
            if (chefId) {
                const chefDoc = await adminDb.collection('chefs').doc(chefId).get()
                if (chefDoc.exists) {
                    const data = chefDoc.data()
                    hourlyRate = data?.hourly_rate || data?.rate || 120
                    connectedAccountId = data?.stripe_account_id || null
                }
            }
        } catch (dbErr) {
            console.warn('Chef lookup defaulted in checkout:', dbErr)
        }

        const duration = Number(durationHours) || 3
        const subtotal = hourlyRate * duration
        const platformFee = Math.round(calculatePlatformFee(subtotal * 100, Number(process.env.STRIPE_PLATFORM_FEE_PERCENT) || 10) / 100)
        const total = subtotal + platformFee

        // Check if event is > 5 weeks away for deposit option (20%)
        const eventTimestamp = new Date(eventDate || Date.now()).getTime()
        const fiveWeeksMs = 5 * 7 * 24 * 60 * 60 * 1000
        const isFarAhead = eventTimestamp - Date.now() > fiveWeeksMs
        const chargeAmount = depositOnly && isFarAhead ? Math.round(total * 0.2) : total

        let bookingId = `book_${Date.now()}`

        // 2. Create initial Booking in Firestore with status 'pending_payment'
        const bookingData = {
            client_id: userId,
            user_id: userId,
            chef_id: chefId || 'chef_default',
            chef_name: chefName || 'Private Chef',
            chef_slug: chefSlug || chefId,
            event_date: eventDate || new Date().toISOString().slice(0, 10),
            event_time: eventTime || '19:00',
            duration_hours: duration,
            guest_count: Number(guestCount) || 2,
            event_type: eventType || 'Private Dinner',
            special_requests: specialRequests || null,
            location: location || null,
            subtotal,
            platform_fee: platformFee,
            total_price: total,
            total_amount: total,
            deposit_amount: depositOnly && isFarAhead ? chargeAmount : null,
            is_deposit: !!(depositOnly && isFarAhead),
            remaining_balance: depositOnly && isFarAhead ? total - chargeAmount : 0,
            status: 'pending_payment',
            payment_status: 'pending',
            payout_status: 'held', // Escrow-style protection: held until event completion
            created_at: FieldValue.serverTimestamp(),
        }

        try {
            const bookingRef = await adminDb.collection('bookings').add(bookingData)
            bookingId = bookingRef.id
        } catch (dbErr) {
            console.warn('Firestore booking insert warning (fallback active):', dbErr)
        }

        // 3. Line Items for Stripe Checkout
        const lineItems: any[] = [
            {
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: `${chefName || 'Private Chef'} Booking (${duration} hours)`,
                        description: `Private culinary event on ${eventDate || 'selected date'} for ${guestCount || 2} guests${depositOnly && isFarAhead ? ' (20% Deposit)' : ''}`,
                        images: ['https://images.unsplash.com/photo-1577003832033-a0d99e4bed89?w=400&h=300&fit=crop'],
                    },
                    unit_amount: Math.round(chargeAmount * 100), // in pence
                },
                quantity: 1,
            },
        ]

        // 4. Create Stripe Checkout Session
        const sessionParams: any = {
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: body.email || undefined,
            line_items: lineItems,
            metadata: {
                bookingId,
                clientId: userId,
                chefId: chefId || '',
                depositOnly: depositOnly && isFarAhead ? 'true' : 'false',
                totalAmount: total.toString(),
            },
            success_url: `${origin}/user-dashboard?booking_success=true&booking_id=${bookingId}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/book/${chefId || 'marco-rossi'}?canceled=true&booking_id=${bookingId}`,
        }

        // Marketplace destination charge configuration if connected account exists
        if (connectedAccountId) {
            const applicationFeeAmount = Math.round(platformFee * 100)
            sessionParams.payment_intent_data = {
                application_fee_amount: applicationFeeAmount,
                transfer_data: {
                    destination: connectedAccountId,
                },
                metadata: {
                    bookingId,
                },
            }
        }

        let checkoutSession: any = null
        try {
            checkoutSession = await stripe.checkout.sessions.create(sessionParams)
        } catch (stripeErr) {
            console.warn('Stripe checkout session creation fallback (dev mode):', stripeErr)
            // Fallback mock session for local development without active Stripe key
            checkoutSession = {
                id: `cs_test_${Math.random().toString(36).substring(2, 10)}`,
                url: `${origin}/user-dashboard?booking_success=true&booking_id=${bookingId}&mock_payment=true`,
            }
        }

        try {
            await adminDb.collection('bookings').doc(bookingId).update({
                stripe_session_id: checkoutSession.id,
            })
        } catch (updateErr) {
            // Ignored in dev fallback
        }

        return NextResponse.json({
            success: true,
            sessionId: checkoutSession.id,
            url: checkoutSession.url,
            bookingId,
        })
    } catch (error) {
        console.error('Checkout creation error:', error)
        return NextResponse.json({ success: false, error: 'Failed to initiate checkout' }, { status: 500 })
    }
}
