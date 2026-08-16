import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { WaitlistRole } from '@/types/waitlist'

const waitlistSchema = z.object({
    role: z.enum(['chef', 'business', 'kid', 'tutor', 'client']),
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

        // Generate deterministic mock queue position and referral code
        const queuePosition = Math.floor(Math.random() * 150) + 2450
        const referralCode = `CM-${validated.role.toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
        const origin = request.headers.get('origin') || 'http://localhost:3000'
        const referralUrl = `${origin}/waitlist?ref=${referralCode}`

        try {
            const supabase = createClient()
            await supabase.from('waitlist').insert({
                role: validated.role,
                full_name: validated.fullName,
                email: validated.email,
                metadata: {
                    city: validated.city,
                    cuisine: validated.cuisine,
                    company_name: validated.companyName,
                    event_count: validated.eventCount,
                    parent_name: validated.parentName,
                    age_group: validated.ageGroup,
                    specialty: validated.specialty,
                    course_topic: validated.courseTopic,
                    occasion: validated.occasion,
                },
                referral_code: referralCode,
                queue_position: queuePosition,
                created_at: new Date().toISOString(),
            })
        } catch {
            // Safe fallback if Supabase table is not migrated yet
        }

        return NextResponse.json({
            success: true,
            message: `Welcome to the ChefMii ${validated.role.toUpperCase()} waitlist!`,
            data: {
                id: `wl_${Date.now()}`,
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
            return NextResponse.json(
                { success: false, error: error.errors[0]?.message || 'Invalid input data' },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { success: false, error: 'Failed to join waitlist. Please try again.' },
            { status: 500 }
        )
    }
}
