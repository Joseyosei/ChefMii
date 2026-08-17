import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'

export const dynamic = 'force-dynamic'

async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
    const authHeader = request.headers.get('Authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const idToken = authHeader.split('Bearer ')[1]
        try {
            const decodedToken = await adminAuth.verifyIdToken(idToken)
            return decodedToken.uid
        } catch (e) {
            console.warn('Profile route: ID token verification failed:', e)
        }
    }
    return null
}

export async function GET(request: NextRequest) {
    try {
        const userId = await getUserIdFromRequest(request)
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userDoc = await adminDb.collection('users').doc(userId).get()
        if (!userDoc.exists) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
        }

        return NextResponse.json({
            profile: { id: userDoc.id, ...userDoc.data() },
        })
    } catch (error) {
        console.error('Profile GET error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const userId = await getUserIdFromRequest(request)
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { full_name, phone, avatar_url } = body

        const updateData: Record<string, unknown> = {
            updatedAt: FieldValue.serverTimestamp(),
        }
        if (full_name !== undefined) updateData.full_name = full_name
        if (phone !== undefined) updateData.phone = phone
        if (avatar_url !== undefined) updateData.avatar_url = avatar_url

        const userRef = adminDb.collection('users').doc(userId)
        await userRef.set(updateData, { merge: true })

        const updatedDoc = await userRef.get()
        return NextResponse.json({
            profile: { id: updatedDoc.id, ...updatedDoc.data() },
        })
    } catch (error) {
        console.error('Profile PATCH error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
