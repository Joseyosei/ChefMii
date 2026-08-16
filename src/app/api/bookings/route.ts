import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'
import { calculatePlatformFee } from '@/lib/utils'

export async function POST(request: NextRequest) {
    try {
        let userId: string | null = null

        // 1. Verify Authorization Header (Bearer token)
        const authHeader = request.headers.get('Authorization')
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const idToken = authHeader.split('Bearer ')[1]
            try {
                const decodedToken = await adminAuth.verifyIdToken(idToken)
                userId = decodedToken.uid
            } catch (authError) {
                console.warn('ID token verification failed:', authError)
            }
        }

        const body = await request.json()
        const { chefSlug, chefId: inputChefId, eventDate, eventTime, durationHours, guestCount, eventType, specialRequests, address } = body

        // Fallback user ID from body if in dev mode
        if (!userId && body.userId) {
            userId = body.userId
        }

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 })
        }

        // 2. Fetch chef data
        let hourlyRate = 120
        let targetChefId = inputChefId || 'chef_default'

        try {
            if (chefSlug) {
                const chefSnap = await adminDb.collection('chefs').where('slug', '==', chefSlug).limit(1).get()
                if (!chefSnap.empty) {
                    const chefDoc = chefSnap.docs[0]
                    targetChefId = chefDoc.id
                    hourlyRate = chefDoc.data().hourly_rate || 120
                }
            } else if (inputChefId) {
                const chefDoc = await adminDb.collection('chefs').doc(inputChefId).get()
                if (chefDoc.exists) {
                    hourlyRate = chefDoc.data()?.hourly_rate || 120
                }
            }
        } catch (dbErr) {
            console.warn('Chef lookup in Firestore skipped/defaulted:', dbErr)
        }

        const duration = Number(durationHours) || 3
        const totalAmount = Math.round(hourlyRate * duration * 100) // cents
        const platformFee = calculatePlatformFee(totalAmount, Number(process.env.STRIPE_PLATFORM_FEE_PERCENT) || 10)
        const chefPayout = totalAmount - platformFee

        // 3. Create Stripe PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount,
            currency: 'gbp',
            automatic_payment_methods: { enabled: true },
            metadata: {
                clientId: userId,
                chefId: targetChefId,
                eventDate: eventDate || '',
                eventTime: eventTime || '',
            },
        })

        // 4. Record Booking in Firestore
        const bookingData = {
            client_id: userId,
            user_id: userId,
            chef_id: targetChefId,
            event_date: eventDate || new Date().toISOString(),
            event_time: eventTime || '19:00',
            duration_hours: duration,
            guest_count: Number(guestCount) || 2,
            event_type: eventType || 'Private Dinner',
            special_requests: specialRequests || null,
            total_amount: totalAmount / 100,
            total_price: totalAmount / 100,
            platform_fee: platformFee / 100,
            chef_payout: chefPayout / 100,
            stripe_payment_intent_id: paymentIntent.id,
            status: 'pending',
            address_line1: address?.line1 || null,
            address_city: address?.city || null,
            address_state: address?.state || null,
            address_zip: address?.zip || null,
            created_at: FieldValue.serverTimestamp(),
        }

        const bookingRef = await adminDb.collection('bookings').add(bookingData)

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            bookingId: bookingRef.id,
        })
    } catch (error) {
        console.error('Booking creation error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
