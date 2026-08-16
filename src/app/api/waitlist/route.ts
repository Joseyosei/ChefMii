import { NextResponse } from 'next/server'
import { z } from 'zod'
import { FieldValue } from 'firebase-admin/firestore'
import { adminDb } from '@/lib/firebase/admin'
import type { WaitlistRole } from '@/types/waitlist'

export const dynamic = 'force-dynamic'

const waitlistSchema = z.object({
    role: z.enum(['chef', 'business', 'kid', 'tutor', 'client', 'partner', 'foodie']).default('client'),
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
    cuisine: z.string().optional(),
    companyName: z.string().optional(),
    eventCount: z.string().optional(),
    parentName: z.string().optional(),
    ageGroup: z.string().optional(),
    specialty: z.string().optional(),
    courseTopic: z.string().optional(),
    occasion: z.string().optional(),
    dietaryPreferences: z.string().optional(),
    notes: z.string().optional(),
})

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const role = searchParams.get('role')
        const limitParam = parseInt(searchParams.get('limit') || '100', 10)

        let query = adminDb.collection('waitlist').orderBy('createdAt', 'desc').limit(limitParam)
        if (role && role !== 'all') {
            query = adminDb.collection('waitlist').where('role', '==', role).orderBy('createdAt', 'desc').limit(limitParam)
        }

        const snapshot = await query.get()
        const entries = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : new Date().toISOString(),
        }))

        return NextResponse.json({
            success: true,
            total: entries.length,
            entries,
        })
    } catch (error) {
        console.error('Failed to fetch waitlist entries:', error)
        return NextResponse.json({ success: false, error: 'Failed to retrieve waitlist entries' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const validated = waitlistSchema.parse(body)

        const queuePosition = Math.floor(Math.random() * 150) + 2450
        const referralCode = `CM-${validated.role.toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
        const origin = request.headers.get('origin') || 'http://localhost:3000'
        const referralUrl = `${origin}/waitlist?ref=${referralCode}`

        let docId = `wl_${Date.now()}`

        try {
            const docRef = await adminDb.collection('waitlist').add({
                name: validated.fullName,
                fullName: validated.fullName,
                email: validated.email.toLowerCase().trim(),
                phone: validated.phone || null,
                role: validated.role,
                address: {
                    line1: validated.addressLine1 || null,
                    line2: validated.addressLine2 || null,
                    city: validated.city || null,
                    state: validated.state || null,
                    postalCode: validated.postalCode || null,
                    country: validated.country || 'United Kingdom',
                },
                metadata: {
                    city: validated.city || null,
                    cuisine: validated.cuisine || null,
                    company_name: validated.companyName || null,
                    event_count: validated.eventCount || null,
                    parent_name: validated.parentName || null,
                    age_group: validated.ageGroup || null,
                    specialty: validated.specialty || null,
                    course_topic: validated.courseTopic || null,
                    occasion: validated.occasion || null,
                    dietary_preferences: validated.dietaryPreferences || null,
                    notes: validated.notes || null,
                },
                referralCode,
                queuePosition,
                createdAt: FieldValue.serverTimestamp(),
            })
            docId = docRef.id
        } catch (dbError) {
            console.warn('Firestore waitlist insert warning (fallback active):', dbError)
        }

        return NextResponse.json({
            success: true,
            message: `Welcome to the ChefMii ${validated.role.toUpperCase()} waitlist!`,
            data: {
                id: docId,
                role: validated.role as WaitlistRole,
                fullName: validated.fullName,
                email: validated.email,
                phone: validated.phone,
                city: validated.city,
                postalCode: validated.postalCode,
                queuePosition,
                referralCode,
                referralUrl,
            }
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            const zErr = error as unknown as { issues?: Array<{ message: string }>; errors?: Array<{ message: string }> }
            const errorMsg = zErr.issues?.[0]?.message || zErr.errors?.[0]?.message || 'Invalid input data'
            return NextResponse.json(
                { success: false, error: errorMsg },
                { status: 400 }
            )
        }
        console.error('Waitlist API error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to join waitlist. Please try again.' },
            { status: 500 }
        )
    }
}
