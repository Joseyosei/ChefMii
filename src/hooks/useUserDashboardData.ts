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
    badge?: string
    location?: string
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

const DEFAULT_CHEFS: AvailableChef[] = [
    { id: 'marco-rossi', full_name: 'Chef Marco Rossi', cuisine: 'Italian', hourly_rate: 150, rating: 4.9, reviews: 128, location: 'London, UK', badge: 'Fine Dining', avatar_url: '/images/chefs/chef_marco_rossi.png', specialties: ['Handmade Pasta', 'Truffle Menus'] },
    { id: 'yuki-tanaka', full_name: 'Chef Yuki Tanaka', cuisine: 'Japanese', hourly_rate: 200, rating: 5.0, reviews: 67, location: 'Dubai, UAE', badge: 'Omakase Master', avatar_url: '/images/chefs/chef_yuki_tanaka.png', specialties: ['Omakase', 'Sashimi'] },
    { id: 'pierre-dubois', full_name: 'Chef Pierre Dubois', cuisine: 'French', hourly_rate: 180, rating: 4.7, reviews: 212, location: 'Paris, France', badge: 'Haute Cuisine', avatar_url: '/images/chefs/chef_pierre_dubois.png', specialties: ['Haute Cuisine', 'Wine Pairing'] },
    { id: 'marcus-vance', full_name: 'Chef Marcus Vance', cuisine: 'American', hourly_rate: 160, rating: 4.9, reviews: 142, location: 'New York, USA', badge: 'Farm-to-Table', avatar_url: '/images/chefs/chef_marcus_vance.png', specialties: ['Wood-Fired Smokehouse', 'Dry-Aged Steaks'] },
    { id: 'elena-beauchamp', full_name: 'Chef Éléna Beauchamp', cuisine: 'French-Canadian', hourly_rate: 140, rating: 4.8, reviews: 98, location: 'Montreal, Canada', badge: 'Nordic-French', avatar_url: '/images/chefs/chef_elena_beauchamp.png', specialties: ['Wild Foraged Herbs', 'Atlantic Seafood'] },
    { id: 'wei-zhang', full_name: 'Chef Wei Zhang', cuisine: 'Chinese', hourly_rate: 175, rating: 5.0, reviews: 184, location: 'Shanghai, China', badge: 'Dim Sum & Wok Master', avatar_url: '/images/chefs/chef_wei_zhang.png', specialties: ['Cantonese Banquet', 'Handmade Dim Sum'] },
    { id: 'olena-kovalenko', full_name: 'Chef Olena Kovalenko', cuisine: 'Ukrainian', hourly_rate: 110, rating: 4.9, reviews: 115, location: 'Kyiv, Ukraine', badge: 'Heritage Cuisine', avatar_url: '/images/chefs/chef_olena_kovalenko.png', specialties: ['Heritage Fermentation', 'Smoked Delicacies'] },
    { id: 'henrik-lindqvist', full_name: 'Chef Henrik Lindqvist', cuisine: 'Nordic', hourly_rate: 190, rating: 4.9, reviews: 87, location: 'Oslo, Norway', badge: 'Michelin Nordic', avatar_url: '/images/chefs/chef_henrik_lindqvist.png', specialties: ['Cold-Smoked Fjord Salmon', 'Reindeer Tartare'] },
    { id: 'kenji-sato', full_name: 'Chef Kenji Sato', cuisine: 'Japanese', hourly_rate: 220, rating: 5.0, reviews: 153, location: 'Kyoto, Japan', badge: 'Kaiseki Master', avatar_url: '/images/chefs/chef_kenji_sato.png', specialties: ['Seasonal Kaiseki', 'Wagyu A5'] },
    { id: 'min-jun-park', full_name: 'Chef Min-Jun Park', cuisine: 'Korean', hourly_rate: 165, rating: 4.9, reviews: 126, location: 'Seoul, South Korea', badge: 'K-Fine Dining', avatar_url: '/images/chefs/chef_min_jun_park.png', specialties: ['10-Year Aged Jang', 'Hanwoo Beef'] },
    { id: 'tariq-al-ghamdi', full_name: 'Chef Tariq Al-Ghamdi', cuisine: 'Middle Eastern', hourly_rate: 195, rating: 4.9, reviews: 109, location: 'Riyadh, Saudi Arabia', badge: 'Royal Banquet', avatar_url: '/images/chefs/chef_tariq_al_ghamdi.png', specialties: ['Royal Banquet', 'Najdi Lamb'] },
    { id: 'aisha-okafor', full_name: 'Chef Aisha Okafor', cuisine: 'West African', hourly_rate: 80, rating: 4.8, reviews: 94, location: 'Lagos, Nigeria', badge: 'Traditional', avatar_url: '/images/chefs/chef_aisha_okafor.png', specialties: ['Jollof Rice', 'Suya Spiced Grills'] },
    { id: 'sofia-mendez', full_name: 'Chef Sofía Mendez', cuisine: 'Spanish', hourly_rate: 120, rating: 4.9, reviews: 89, location: 'Barcelona, Spain', badge: 'Tapas & Paella', avatar_url: '/images/chefs/chef_sofia_mendez.png', specialties: ['Paella Socarrat', 'Modernist Tapas'] },
    { id: 'james-osei', full_name: 'Chef James Osei', cuisine: 'Pan-African', hourly_rate: 70, rating: 4.8, reviews: 156, location: 'Accra, Ghana', badge: 'Events Specialist', avatar_url: '/images/chefs/chef_james_osei.png', specialties: ['Pan-African Feasts', 'Plantain Gastronomy'] },
    { id: 'meera-patel', full_name: 'Chef Meera Patel', cuisine: 'Indian', hourly_rate: 95, rating: 4.9, reviews: 203, location: 'Birmingham, UK', badge: 'Ayurvedic Chef', avatar_url: '/images/chefs/chef_meera_patel.png', specialties: ['Ayurvedic Menus', 'Tandoori Mastery'] },
    { id: 'carlos-garcia', full_name: 'Chef Carlos Garcia', cuisine: 'Mexican', hourly_rate: 85, rating: 4.7, reviews: 71, location: 'Mexico City', badge: 'Street Food Expert', avatar_url: '/images/chefs/chef_carlos_garcia.png', specialties: ['Oaxacan Moles', 'Artisanal Tacos'] },
]

export function useUserDashboardData() {
    const { user } = useAuth()
    const [bookings, setBookings] = useState<UserBooking[]>([])
    const [chefs, setChefs] = useState<AvailableChef[]>(DEFAULT_CHEFS)
    const [conversations, setConversations] = useState<UserConversation[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    // 1. Fetch available chefs with fallback
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
                    rating: data.rating || 4.9,
                    reviews: data.reviews || 18,
                })
            })

            if (list.length > 0) {
                // Merge custom DB chefs with default roster
                const existingIds = new Set(list.map(c => c.id))
                const merged = [...list, ...DEFAULT_CHEFS.filter(c => !existingIds.has(c.id))]
                setChefs(merged)
            } else {
                setChefs(DEFAULT_CHEFS)
            }
        } catch (err) {
            console.warn('Using default chefs roster:', err)
            setChefs(DEFAULT_CHEFS)
        }
    }, [])

    // 2. Realtime listener for bookings & conversations
    useEffect(() => {
        fetchChefs()

        if (!user) {
            setLoading(false)
            return
        }

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
                                avatar_url: cData.avatar_url || cData.photoURL || null,
                            }
                        }
                    } catch {
                        // ignore error
                    }
                }

                fetchedBookings.push({
                    id: docSnap.id,
                    chef_id: b.chef_id || '',
                    user_id: b.user_id || b.client_id || user.id,
                    client_id: b.client_id,
                    event_type: b.event_type || 'Private Dining',
                    event_date: b.event_date || 'Upcoming',
                    start_time: b.start_time || '19:00',
                    guests: b.guests || 2,
                    duration_hours: b.duration_hours || 3,
                    location: b.location || 'London, UK',
                    special_requests: b.special_requests || null,
                    total_price: b.total_price || 350,
                    status: b.status || 'confirmed',
                    created_at: b.created_at || new Date().toISOString(),
                    chef: chefInfo,
                })
            }

            setBookings(fetchedBookings)
            setLoading(false)
        }, (err) => {
            console.error('Error listening to user bookings:', err)
            setError(err)
            setLoading(false)
        })

        // Realtime Conversations query
        const convQuery = query(
            collection(db, 'conversations'),
            where('participant_ids', 'array-contains', user.id)
        )

        const unsubConv = onSnapshot(convQuery, (snapshot) => {
            const fetchedConvs: UserConversation[] = []

            snapshot.forEach(docSnap => {
                const data = docSnap.data()
                const participantId = data.participant_ids?.find((id: string) => id !== user.id) || ''
                const participantName = data.participant_names?.[participantId] || 'Chef'
                const participantAvatar = data.participant_avatars?.[participantId] || null

                fetchedConvs.push({
                    id: docSnap.id,
                    participant_id: participantId,
                    participant_name: participantName,
                    participant_avatar: participantAvatar,
                    last_message: data.last_message || null,
                    last_message_at: data.last_message_at ? data.last_message_at.toDate?.()?.toISOString() : null,
                    unread_count: data.unread_counts?.[user.id] || 0,
                })
            })

            setConversations(fetchedConvs)
        }, (err) => {
            console.error('Error listening to conversations:', err)
        })

        return () => {
            unsubBookings()
            unsubConv()
        }
    }, [user, fetchChefs])

    return {
        bookings,
        chefs,
        conversations,
        loading,
        error,
        refetchChefs: fetchChefs,
    }
}
