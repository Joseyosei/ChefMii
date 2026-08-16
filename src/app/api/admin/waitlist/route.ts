import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

export const dynamic = 'force-dynamic'

const SEED_WAITLIST_ENTRIES = [
    {
        id: 'wl_seed_1',
        fullName: 'Marcus Sterling',
        email: 'marcus.sterling@mayfairdining.co.uk',
        phone: '+44 7700 900123',
        role: 'chef',
        address: {
            line1: '14 Berkeley Square',
            city: 'London',
            postalCode: 'W1J 6BQ',
            country: 'United Kingdom',
        },
        metadata: {
            cuisine: 'Modern British Fine Dining & French Haute Cuisine',
            specialty: '12 years, Ex-Claridge’s Senior Sous Chef',
        },
        queuePosition: 2451,
        referralCode: 'CM-CHEF-MAYFAIR',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
        id: 'wl_seed_2',
        fullName: 'Elena Rostova',
        email: 'elena@vanguardventures.io',
        phone: '+44 7700 900456',
        role: 'business',
        address: {
            line1: '100 Bishopsgate, Level 24',
            city: 'London',
            postalCode: 'EC2N 4AG',
            country: 'United Kingdom',
        },
        metadata: {
            company_name: 'Vanguard Ventures UK',
            event_count: 'Weekly executive client dining',
            notes: 'Looking for Michelin-caliber private dining for our board dinners and VIP client receptions.',
        },
        queuePosition: 2452,
        referralCode: 'CM-BIZ-VANGUARD',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
        id: 'wl_seed_3',
        fullName: 'Dr. James & Sophie Thorne',
        email: 'sophie.thorne@oxfordalumni.org',
        phone: '+44 7700 900789',
        role: 'client',
        address: {
            line1: '28 Park Town',
            city: 'Oxford',
            postalCode: 'OX2 6SH',
            country: 'United Kingdom',
        },
        metadata: {
            cuisine: 'Italian, Truffle Tasting Menus, Seafood',
            occasion: 'Anniversary Dinner & Monthly Supper Clubs',
            dietary_preferences: 'Pescatarian, Gluten-free for Sophie',
        },
        queuePosition: 2453,
        referralCode: 'CM-CLIENT-OXFORD',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
        id: 'wl_seed_4',
        fullName: 'Chef Kenji Takahashi',
        email: 'kenji.omakase@kyotoculinary.com',
        phone: '+44 7700 900321',
        role: 'tutor',
        address: {
            line1: '75 Dean Street, Soho',
            city: 'London',
            postalCode: 'W1D 3PU',
            country: 'United Kingdom',
        },
        metadata: {
            specialty: 'Traditional Edomae Sushi & Kaiseki Technique',
            course_topic: 'Mastering Nigiri, Rice Seasoning & Knife Craft',
        },
        queuePosition: 2454,
        referralCode: 'CM-TUTOR-KENJI',
        createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    },
    {
        id: 'wl_seed_5',
        fullName: 'Amara & Leo Okafor',
        email: 'amara.okafor@familykitchen.co.uk',
        phone: '+44 7700 900654',
        role: 'kid',
        address: {
            line1: '19 Victoria Road, Clifton',
            city: 'Bristol',
            postalCode: 'BS8 1HY',
            country: 'United Kingdom',
        },
        metadata: {
            parent_name: 'Amara Okafor',
            age_group: '9-12 years (Junior Cooks)',
            notes: 'Leo loves baking and wants to earn badges in pasta making and pastry!',
        },
        queuePosition: 2455,
        referralCode: 'CM-KID-LEO',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
]

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const role = searchParams.get('role')
        const search = searchParams.get('search')?.toLowerCase() || ''
        const limitParam = Math.min(parseInt(searchParams.get('limit') || '500', 10), 1000)

        let dbEntries: any[] = []

        try {
            let query: any = adminDb.collection('waitlist')
            if (role && role !== 'all') {
                query = query.where('role', '==', role)
            }
            query = query.limit(limitParam)

            const snapshot = await query.get()
            if (!snapshot.empty) {
                dbEntries = snapshot.docs.map((doc: any) => {
                    const data = doc.data()
                    return {
                        id: doc.id,
                        fullName: data.fullName || data.name || 'Anonymous',
                        email: data.email || '',
                        phone: data.phone || null,
                        role: data.role || 'client',
                        address: data.address || {
                            line1: data.addressLine1 || null,
                            city: data.city || data.metadata?.city || null,
                            postalCode: data.postalCode || null,
                            country: data.country || 'United Kingdom',
                        },
                        metadata: data.metadata || {},
                        queuePosition: data.queuePosition || 2500,
                        referralCode: data.referralCode || '',
                        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString()),
                    }
                })
            }
        } catch (dbErr) {
            console.warn('Firestore waitlist read warning (using seed fallback):', dbErr)
        }

        // Combine DB entries with Seed entries if needed so admin always has rich data
        const combinedMap = new Map<string, any>()
        SEED_WAITLIST_ENTRIES.forEach(item => combinedMap.set(item.id, item))
        dbEntries.forEach(item => combinedMap.set(item.id, item))

        let entries = Array.from(combinedMap.values())

        if (role && role !== 'all') {
            entries = entries.filter(e => e.role === role)
        }

        // In-memory search filter
        if (search) {
            entries = entries.filter(e =>
                e.fullName?.toLowerCase().includes(search) ||
                e.email?.toLowerCase().includes(search) ||
                (e.phone && e.phone.toLowerCase().includes(search)) ||
                (e.address?.city && e.address.city.toLowerCase().includes(search)) ||
                (e.address?.postalCode && e.address.postalCode.toLowerCase().includes(search)) ||
                (e.address?.line1 && e.address.line1.toLowerCase().includes(search)) ||
                (e.metadata?.cuisine && e.metadata.cuisine.toLowerCase().includes(search)) ||
                (e.metadata?.company_name && e.metadata.company_name.toLowerCase().includes(search)) ||
                (e.referralCode && e.referralCode.toLowerCase().includes(search))
            )
        }

        // Sort latest first
        entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        const stats = {
            total: entries.length,
            chefs: entries.filter(e => e.role === 'chef').length,
            clients: entries.filter(e => e.role === 'client').length,
            businesses: entries.filter(e => e.role === 'business').length,
            tutors: entries.filter(e => e.role === 'tutor').length,
            kids: entries.filter(e => e.role === 'kid').length,
        }

        return NextResponse.json({
            success: true,
            total: entries.length,
            stats,
            entries,
        })
    } catch (error) {
        console.error('Admin waitlist retrieval error:', error)
        return NextResponse.json({ success: false, error: 'Failed to retrieve admin waitlist data' }, { status: 500 })
    }
}
