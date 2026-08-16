import { useState, useEffect, useCallback } from 'react'
import {
    collection,
    query,
    where,
    onSnapshot,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/context/auth-context'

export interface CorporateEvent {
    id: string
    business_id: string
    name: string
    event_date: string
    guests: number
    budget: number
    status: 'planned' | 'confirmed' | 'completed' | 'cancelled'
    created_at: string
}

export function useBusinessDashboardData() {
    const { user } = useAuth()
    const [events, setEvents] = useState<CorporateEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const fetchAllData = useCallback(async () => {
        if (!user) {
            setLoading(false)
            return
        }
    }, [user])

    useEffect(() => {
        if (!user) {
            setLoading(false)
            return
        }

        const eventsQuery = query(
            collection(db, 'corporate_requests'),
            where('business_id', '==', user.id)
        )

        const unsub = onSnapshot(eventsQuery, (snapshot) => {
            const list: CorporateEvent[] = snapshot.docs.map(docSnap => {
                const e = docSnap.data()
                return {
                    id: docSnap.id,
                    business_id: e.business_id || user.id,
                    name: (e.company_name ? `${e.company_name} Event` : e.name) || 'Executive Dinner',
                    event_date: e.event_date || e.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                    guests: e.guest_count || e.guests || 25,
                    budget: e.budget || 3500,
                    status: e.status || 'confirmed',
                    created_at: e.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                }
            })

            // Fallback demo events if collection is empty
            if (list.length === 0) {
                setEvents([
                    {
                        id: 'corp-1',
                        business_id: user.id,
                        name: 'Quarterly Executive Gala',
                        event_date: new Date(Date.now() + 86400000 * 7).toISOString(),
                        guests: 40,
                        budget: 4800,
                        status: 'confirmed',
                        created_at: new Date().toISOString(),
                    },
                    {
                        id: 'corp-2',
                        business_id: user.id,
                        name: 'Product Launch Catering',
                        event_date: new Date(Date.now() + 86400000 * 14).toISOString(),
                        guests: 80,
                        budget: 9500,
                        status: 'planned',
                        created_at: new Date().toISOString(),
                    }
                ])
            } else {
                setEvents(list)
            }

            setLoading(false)
        }, (err) => {
            console.warn('Corporate requests subscription error:', err)
            setError(err)
            setLoading(false)
        })

        return () => unsub()
    }, [user])

    return { events, loading, error, refresh: fetchAllData }
}
