import { useState, useEffect, useCallback } from 'react'
import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    getDoc,
    serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/context/auth-context'

export interface BookingRequest {
    id: string
    chef_id: string
    user_id: string
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
    user?: { full_name: string | null; avatar_url?: string | null }
    client_name?: string
}

export interface Conversation {
    id: string
    participant_id: string
    participant_name: string
    participant_avatar: string | null
    last_message: string | null
    last_message_at: string | null
    unread_count: number
}

export interface ChefMedia {
    id: string
    title: string
    video_url: string
    thumbnail_url: string | null
    views: number
    likes: number
    created_at: string
}

export function useDashboardData() {
    const { user } = useAuth()
    const [bookings, setBookings] = useState<BookingRequest[]>([])
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [media, setMedia] = useState<ChefMedia[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const fetchAllData = useCallback(async () => {
        if (!user) {
            setLoading(false)
            return
        }
        // State updates are managed by realtime listeners below
    }, [user])

    useEffect(() => {
        if (!user) {
            setLoading(false)
            return
        }

        // 1. Realtime listener for chef's bookings
        const bookingsQuery = query(
            collection(db, 'bookings'),
            where('chef_id', '==', user.id)
        )

        const unsubBookings = onSnapshot(bookingsQuery, async (snapshot) => {
            const fetchedBookings: BookingRequest[] = []

            for (const docSnap of snapshot.docs) {
                const b = docSnap.data()
                let clientInfo = { full_name: 'Client', avatar_url: null }

                const clientId = b.client_id || b.user_id
                if (clientId) {
                    try {
                        const clientSnap = await getDoc(doc(db, 'users', clientId))
                        if (clientSnap.exists()) {
                            const cData = clientSnap.data()
                            clientInfo = {
                                full_name: cData.full_name || cData.name || 'Client',
                                avatar_url: cData.avatar_url || null,
                            }
                        }
                    } catch {
                        // ignore
                    }
                }

                fetchedBookings.push({
                    id: docSnap.id,
                    chef_id: b.chef_id || user.id,
                    user_id: clientId || '',
                    event_type: b.event_type || 'Private Dinner',
                    event_date: b.event_date || new Date().toISOString(),
                    start_time: b.start_time || b.event_time || '19:00',
                    guests: b.guest_count || b.guests || 4,
                    duration_hours: b.duration_hours || 3,
                    location: b.address_city || b.location || 'London, UK',
                    special_requests: b.special_requests || null,
                    total_price: b.total_price || b.total_amount || 350,
                    status: b.status || 'pending',
                    created_at: b.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                    user: clientInfo,
                })
            }

            // Provide fallback demo booking if empty
            if (fetchedBookings.length === 0) {
                setBookings([
                    {
                        id: 'demo-booking-1',
                        chef_id: user.id,
                        user_id: 'demo-client-1',
                        event_type: 'Anniversary Dinner Party',
                        event_date: new Date().toISOString(),
                        start_time: '19:30',
                        guests: 6,
                        duration_hours: 4,
                        location: 'Kensington, London',
                        special_requests: 'Nut allergy for 1 guest; wine pairing required',
                        total_price: 600,
                        status: 'confirmed',
                        created_at: new Date().toISOString(),
                        user: { full_name: 'Sophia Sterling', avatar_url: null },
                    }
                ])
            } else {
                setBookings(fetchedBookings)
            }

            setLoading(false)
        }, (err) => {
            console.error('Chef bookings subscription error:', err)
            setError(err)
            setLoading(false)
        })

        // 2. Realtime listener for chef's media
        const mediaQuery = query(
            collection(db, 'chef_media'),
            where('chef_id', '==', user.id)
        )

        const unsubMedia = onSnapshot(mediaQuery, (snapshot) => {
            const mediaList: ChefMedia[] = snapshot.docs.map(docSnap => {
                const m = docSnap.data()
                return {
                    id: docSnap.id,
                    title: m.title || 'Culinary Creation',
                    video_url: m.video_url || '',
                    thumbnail_url: m.thumbnail_url || null,
                    views: m.views || 0,
                    likes: m.likes || 0,
                    created_at: m.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                }
            })
            setMedia(mediaList)
        }, (err) => {
            console.warn('Chef media subscription error:', err)
        })

        // 3. Realtime listener for conversations
        const convQuery = query(
            collection(db, 'conversations'),
            where('participant2', '==', user.id)
        )

        const unsubConv = onSnapshot(convQuery, (snapshot) => {
            const convList: Conversation[] = snapshot.docs.map(docSnap => {
                const c = docSnap.data()
                return {
                    id: docSnap.id,
                    participant_id: c.participant1 || '',
                    participant_name: c.participant1_name || 'Client',
                    participant_avatar: c.participant1_avatar || null,
                    last_message: c.last_message || null,
                    last_message_at: c.last_message_at || null,
                    unread_count: 0,
                }
            })
            setConversations(convList)
        }, (err) => {
            console.warn('Chef conversations subscription error:', err)
        })

        return () => {
            unsubBookings()
            unsubMedia()
            unsubConv()
        }
    }, [user])

    const updateBookingStatus = async (id: string, status: BookingRequest['status']) => {
        try {
            await updateDoc(doc(db, 'bookings', id), {
                status,
                updatedAt: serverTimestamp(),
            })
        } catch (e) {
            console.warn('Updating booking status in local state fallback:', e)
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
        }
    }

    const deleteMedia = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'chef_media', id))
        } catch (e) {
            console.warn('Deleting chef media locally:', e)
            setMedia(prev => prev.filter(m => m.id !== id))
        }
    }

    return {
        bookings,
        conversations,
        media,
        loading,
        error,
        updateBookingStatus,
        deleteMedia,
        refresh: fetchAllData,
    }
}
