import { useState, useEffect, useCallback } from 'react'
import {
    collection,
    query,
    where,
    onSnapshot,
    getDocs,
    doc,
    getDoc,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/context/auth-context'

export interface UserBooking {
    id: string
    chef_id: string
    user_id: string
    client_id?: string
    event_type: string
    event_date: string
    start_time: string
    guests: number
    duration_hours: number
    location: string
    special_requests: string | null
    total_price: number
    status: 'pending' | 'confirmed' | 'declined' | 'completed' | 'cancelled'
    created_at: string
    chef?: {
        full_name: string | null
        avatar_url: string | null
    }
}

export interface AvailableChef {
    id: string
    full_name: string
    avatar_url: string | null
    cuisine: string | null
    hourly_rate: number | null
    specialties: string[] | null
    rating?: number
    reviews?: number
}

export interface UserConversation {
    id: string
    participant_id: string
    participant_name: string
    participant_avatar: string | null
    last_message: string | null
    last_message_at: string | null
    unread_count: number
}

export function useUserDashboardData() {
    const { user } = useAuth()
    const [bookings, setBookings] = useState<UserBooking[]>([])
    const [chefs, setChefs] = useState<AvailableChef[]>([])
    const [conversations, setConversations] = useState<UserConversation[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    // 1. Fetch available chefs
    const fetchChefs = useCallback(async () => {
        try {
            const chefsQuery = query(collection(db, 'users'), where('role', '==', 'chef'))
            const snap = await getDocs(chefsQuery)
            const list: AvailableChef[] = []

            snap.forEach(docSnap => {
                const data = docSnap.data()
                list.push({
                    id: docSnap.id,
                    full_name: data.full_name || data.name || 'Chef',
                    avatar_url: data.avatar_url || data.photoURL || null,
                    cuisine: data.cuisine || data.specialties?.[0] || 'International',
                    hourly_rate: data.hourly_rate || 120,
                    specialties: data.specialties || ['Fine Dining', 'Seasonal Menus'],
                    rating: 4.9,
                    reviews: 18,
                })
            })

            // Fallback sample chefs if collection is empty
            if (list.length === 0) {
                list.push(
                    {
                        id: 'chef-marco',
                        full_name: 'Chef Marco Rossi',
                        avatar_url: null,
                        cuisine: 'Italian',
                        hourly_rate: 150,
                        specialties: ['Handmade Pasta', 'Truffle Menus'],
                        rating: 4.9,
                        reviews: 128,
                    },
                    {
                        id: 'chef-yuki',
                        full_name: 'Chef Yuki Tanaka',
                        avatar_url: null,
                        cuisine: 'Japanese',
                        hourly_rate: 200,
                        specialties: ['Omakase', 'Sashimi'],
                        rating: 5.0,
                        reviews: 67,
                    }
                )
            }

            setChefs(list)
        } catch (err) {
            console.warn('Failed to fetch chefs from Firestore:', err)
        }
    }, [])

    // 2. Realtime listener for bookings & conversations
    useEffect(() => {
        if (!user) {
            setLoading(false)
            return
        }

        fetchChefs()

        // Realtime Bookings query
        const bookingsQuery = query(
            collection(db, 'bookings'),
            where('client_id', '==', user.id)
        )

        const unsubBookings = onSnapshot(bookingsQuery, async (snapshot) => {
            const fetchedBookings: UserBooking[] = []

            for (const docSnap of snapshot.docs) {
                const b = docSnap.data()
                let chefInfo = { full_name: 'Chef', avatar_url: null }

                if (b.chef_id) {
                    try {
                        const chefSnap = await getDoc(doc(db, 'users', b.chef_id))
                        if (chefSnap.exists()) {
                            const cData = chefSnap.data()
                            chefInfo = {
                                full_name: cData.full_name || cData.name || 'Chef',
                                avatar_url: cData.avatar_url || null,
                            }
                        }
                    } catch {
                        // ignore
                    }
                }

                fetchedBookings.push({
                    id: docSnap.id,
                    chef_id: b.chef_id || '',
                    user_id: b.user_id || b.client_id || user.id,
                    event_type: b.event_type || 'Private Dining',
                    event_date: b.event_date || new Date().toISOString(),
                    start_time: b.start_time || b.event_time || '19:00',
                    guests: b.guest_count || b.guests || 2,
                    duration_hours: b.duration_hours || 3,
                    location: b.address_city || b.location || 'London, UK',
                    special_requests: b.special_requests || null,
                    total_price: b.total_price || b.total_amount || 250,
                    status: b.status || 'pending',
                    created_at: b.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                    chef: chefInfo,
                })
            }

            setBookings(fetchedBookings)
            setLoading(false)
        }, (err) => {
            console.error('Bookings subscription error:', err)
            setError(err)
            setLoading(false)
        })

        // Realtime Conversations query
        const convQuery1 = query(
            collection(db, 'conversations'),
            where('participant1', '==', user.id)
        )

        const unsubConv1 = onSnapshot(convQuery1, (snapshot) => {
            const convs: UserConversation[] = snapshot.docs.map(docSnap => {
                const data = docSnap.data()
                return {
                    id: docSnap.id,
                    participant_id: data.participant2 || '',
                    participant_name: data.participant2_name || 'Chef',
                    participant_avatar: data.participant2_avatar || null,
                    last_message: data.last_message || null,
                    last_message_at: data.last_message_at || null,
                    unread_count: 0,
                }
            })
            setConversations(convs)
        }, (err) => {
            console.warn('Conversations subscription error:', err)
        })

        return () => {
            unsubBookings()
            unsubConv1()
        }
    }, [user, fetchChefs])

    return { bookings, chefs, conversations, loading, error, refresh: fetchChefs }
}
