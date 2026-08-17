import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { adminDb } from '@/lib/firebase/admin'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { bookingId, guestCount } = body

        if (!bookingId || !guestCount || guestCount < 2) {
            return NextResponse.json({ error: 'Valid bookingId and guestCount (>= 2) required.' }, { status: 400 })
        }

        const bookingDoc = await adminDb.collection('bookings').doc(bookingId).get()
        if (!bookingDoc.exists) {
            return NextResponse.json({ error: 'Booking not found.' }, { status: 404 })
        }

        const booking = bookingDoc.data()!
        const totalAmount = booking.total_amount || 300
        const perPersonAmount = Math.round((totalAmount / guestCount) * 100) / 100
        const perPersonCents = Math.round(perPersonAmount * 100)

        // Create Price & Payment Link for each guest share
        const price = await stripe.prices.create({
            currency: 'gbp',
            unit_amount: perPersonCents,
            product_data: {
                name: `ChefMii Split Payment — ${booking.chef_name || 'Chef Event'}`,
                metadata: {
                    bookingId,
                },
            },
        })

        const origin = request.headers.get('origin') || 'http://localhost:3000'
        const paymentLink = await stripe.paymentLinks.create({
            line_items: [{ price: price.id, quantity: 1 }],
            metadata: {
                bookingId,
                isSplitShare: 'true',
            },
            after_completion: {
                type: 'redirect',
                redirect: {
                    url: `${origin}/user-dashboard?split_payment_success=true&booking_id=${bookingId}`,
                },
            },
        })

        // Save split info to booking
        await bookingDoc.ref.update({
            is_split_bill: true,
            split_guest_count: guestCount,
            split_per_person_amount: perPersonAmount,
            split_payment_link: paymentLink.url,
            split_shares_paid: 0,
        })

        return NextResponse.json({
            success: true,
            paymentLink: paymentLink.url,
            perPersonAmount,
            guestCount,
        })
    } catch (error: unknown) {
        console.error('Split bill generation error:', error)
        const message = error instanceof Error ? error.message : 'Split bill creation failed'
        return NextResponse.json({ success: false, error: message }, { status: 500 })
    }
}
