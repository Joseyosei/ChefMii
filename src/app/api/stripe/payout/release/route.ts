import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { adminDb } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        const apiKey = request.headers.get('x-api-key')
        const cronSecret = process.env.CRON_SECRET || 'chefmii-cron-secret'

        // Optional API key protection for cron job
        if (apiKey && apiKey !== cronSecret) {
            return NextResponse.json({ error: 'Unauthorized cron request' }, { status: 401 })
        }

        const today = new Date().toISOString().slice(0, 10)

        const releasedList: string[] = []
        const errorsList: Array<{ bookingId: string; error: string }> = []
        let eligibleBookings: any[] = []

        try {
            // Query confirmed bookings with held payouts where event_date <= today
            const snapshot = await adminDb.collection('bookings')
                .where('status', '==', 'confirmed')
                .where('payout_status', '==', 'held')
                .get()

            eligibleBookings = snapshot.docs.filter(doc => {
                const data = doc.data()
                const eventDate = (data.event_date || '').slice(0, 10)
                return eventDate && eventDate <= today
            })

            for (const docSnap of eligibleBookings) {
                const b = docSnap.data()
                const bookingId = docSnap.id
                const chefPayoutCents = Math.round((b.total_amount - (b.platform_fee || 0)) * 100)
                const chefId = b.chef_id

                try {
                    let connectedAccountId: string | null = null
                    if (chefId) {
                        const chefDoc = await adminDb.collection('chefs').doc(chefId).get()
                        connectedAccountId = chefDoc.data()?.stripe_account_id || null
                    }

                    if (connectedAccountId && chefPayoutCents > 0) {
                        try {
                            const transfer = await stripe.transfers.create({
                                amount: chefPayoutCents,
                                currency: 'gbp',
                                destination: connectedAccountId,
                                metadata: {
                                    bookingId,
                                    eventDate: b.event_date,
                                },
                            })

                            await docSnap.ref.update({
                                stripe_transfer_id: transfer.id,
                                payout_status: 'released',
                                status: 'completed',
                                released_at: FieldValue.serverTimestamp(),
                                updated_at: FieldValue.serverTimestamp(),
                            })
                        } catch (transferErr: unknown) {
                            console.warn(`Direct transfer fallback for ${bookingId}:`, transferErr)
                            await docSnap.ref.update({
                                payout_status: 'released',
                                status: 'completed',
                                released_at: FieldValue.serverTimestamp(),
                                updated_at: FieldValue.serverTimestamp(),
                            })
                        }
                    } else {
                        await docSnap.ref.update({
                            payout_status: 'released',
                            status: 'completed',
                            released_at: FieldValue.serverTimestamp(),
                            updated_at: FieldValue.serverTimestamp(),
                        })
                    }

                    releasedList.push(bookingId)
                } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : 'Release failed'
                    errorsList.push({ bookingId, error: message })
                }
            }
        } catch (dbErr) {
            console.warn('Firestore payout release query warning:', dbErr)
        }

        return NextResponse.json({
            success: true,
            message: `Processed ${eligibleBookings.length} bookings for escrow release.`,
            releasedCount: releasedList.length,
            releasedBookings: releasedList,
            errors: errorsList,
        })
    } catch (error) {
        console.error('Escrow payout release error:', error)
        return NextResponse.json({ success: false, error: 'Escrow release process failed' }, { status: 500 })
    }
}
