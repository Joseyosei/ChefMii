import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'

// POST: Create or retrieve Stripe Connect Express Account & Onboarding Link
export async function POST(request: NextRequest) {
    try {
        let chefId: string | null = null
        const authHeader = request.headers.get('Authorization')
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const idToken = authHeader.split('Bearer ')[1]
            try {
                const decodedToken = await adminAuth.verifyIdToken(idToken)
                chefId = decodedToken.uid
            } catch (err) {
                console.warn('ID token verification skipped in connect endpoint:', err)
            }
        }

        const body = await request.json().catch(() => ({}))
        if (!chefId && body.chefId) {
            chefId = body.chefId
        }

        if (!chefId) {
            return NextResponse.json({ error: 'Unauthorized. Chef authentication required.' }, { status: 401 })
        }

        const origin = request.headers.get('origin') || 'http://localhost:3000'

        // Check if chef already has connected account id in Firestore
        let accountId: string | null = null
        try {
            const userDoc = await adminDb.collection('users').doc(chefId).get()
            accountId = userDoc.data()?.stripe_account_id || null
        } catch (dbErr) {
            console.warn('Chef lookup warning in connect endpoint:', dbErr)
        }

        // Create new Stripe Express account if none exists
        if (!accountId) {
            const account = await stripe.accounts.create({
                type: 'express',
                country: 'GB',
                email: body.email || undefined,
                business_type: 'individual',
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true },
                },
                settings: {
                    payouts: {
                        schedule: {
                            interval: 'manual', // Escrow: manual delayed release after event
                        },
                    },
                },
                metadata: {
                    chefId,
                },
            })

            accountId = account.id

            // Save stripe_account_id to Firestore users & chefs collection
            await adminDb.collection('users').doc(chefId).set({
                stripe_account_id: accountId,
                stripe_status: 'pending',
                updated_at: FieldValue.serverTimestamp(),
            }, { merge: true })

            await adminDb.collection('chefs').doc(chefId).set({
                stripe_account_id: accountId,
                stripe_status: 'pending',
                updated_at: FieldValue.serverTimestamp(),
            }, { merge: true })
        }

        // Generate Stripe Connect Onboarding Account Link
        const accountLink = await stripe.accountLinks.create({
            account: accountId,
            refresh_url: `${origin}/chef-dashboard?stripe_refresh=true`,
            return_url: `${origin}/chef-dashboard?stripe_success=true&account_id=${accountId}`,
            type: 'account_onboarding',
        })

        return NextResponse.json({
            success: true,
            accountId,
            url: accountLink.url,
        })
    } catch (error: unknown) {
        console.error('Stripe Connect onboarding error:', error)
        const message = error instanceof Error ? error.message : 'Stripe Connect operation failed'
        return NextResponse.json({ success: false, error: message }, { status: 500 })
    }
}

// GET: Check status of connected chef account
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const accountId = searchParams.get('accountId')

        if (!accountId) {
            return NextResponse.json({ error: 'accountId parameter is required' }, { status: 400 })
        }

        const account = await stripe.accounts.retrieve(accountId)

        return NextResponse.json({
            success: true,
            chargesEnabled: account.charges_enabled,
            payoutsEnabled: account.payouts_enabled,
            detailsSubmitted: account.details_submitted,
            country: account.country,
        })
    } catch (error: unknown) {
        console.error('Stripe account retrieval error:', error)
        return NextResponse.json({ success: false, error: 'Failed to retrieve account details' }, { status: 500 })
    }
}
