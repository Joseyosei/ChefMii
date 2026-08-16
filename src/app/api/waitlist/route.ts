import { NextResponse } from 'next/server'
import { z } from 'zod'
import { FieldValue } from 'firebase-admin/firestore'
import { adminDb } from '@/lib/firebase/admin'
import type { WaitlistRole } from '@/types/waitlist'

const waitlistSchema = z.object({
    role: z.enum(['chef', 'business', 'kid', 'tutor', 'client']).default('client'),
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    city: z.string().optional(),
    cuisine: z.string().optional(),
    companyName: z.string().optional(),
    eventCount: z.string().optional(),
    parentName: z.string().optional(),
    ageGroup: z.string().optional(),
    specialty: z.string().optional(),
    courseTopic: z.string().optional(),
    occasion: z.string().optional(),
})

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
                role: validated.role,
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
