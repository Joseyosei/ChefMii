'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    doc,
    setDoc,
    getDoc,
    getDocs,
    serverTimestamp,
    type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/context/auth-context'

export interface Message {
    id: string
    conversation_id: string
    sender_id: string
    content: string
    is_read: boolean
    created_at: string
}

export interface Conversation {
    id: string
    participant1: string
    participant2: string
    last_message: string | null
    last_message_at: string
    other_user?: {
        id: string
        full_name: string | null
        avatar_url: string | null
        role: string
    }
    unread_count?: number
}

export function useMessaging(conversationId?: string) {
    const { user } = useAuth()
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)

    /* ── Load conversations ───────────────────────────── */
    const loadConversations = useCallback(async () => {
        if (!user) {
            setLoading(false)
            return
        }

        try {
            const q1 = query(collection(db, 'conversations'), where('participant1', '==', user.id))
            const q2 = query(collection(db, 'conversations'), where('participant2', '==', user.id))

            const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)])
            const allDocs = [...snap1.docs, ...snap2.docs]

            // Deduplicate by ID
            const uniqueMap = new Map<string, Conversation>()

            for (const docSnap of allDocs) {
                if (uniqueMap.has(docSnap.id)) continue

                const c = docSnap.data()
                const otherId = c.participant1 === user.id ? c.participant2 : c.participant1

                let otherUserProfile = {
                    id: otherId || '',
                    full_name: 'ChefMii User',
                    avatar_url: null,
                    role: 'client',
                }

                if (otherId) {
                    try {
                        const userSnap = await getDoc(doc(db, 'users', otherId))
                        if (userSnap.exists()) {
                            const uData = userSnap.data()
                            otherUserProfile = {
                                id: userSnap.id,
                                full_name: uData.full_name || uData.name || 'ChefMii User',
                                avatar_url: uData.avatar_url || null,
                                role: uData.role || 'client',
                            }
                        }
                    } catch {
                        // ignore
                    }
                }

                uniqueMap.set(docSnap.id, {
                    id: docSnap.id,
                    participant1: c.participant1 || user.id,
                    participant2: c.participant2 || otherId,
                    last_message: c.last_message || null,
                    last_message_at: c.last_message_at || c.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                    other_user: otherUserProfile,
                    unread_count: 0,
                })
            }

            setConversations(Array.from(uniqueMap.values()))
        } catch (err) {
            console.warn('Error loading conversations:', err)
        } finally {
            setLoading(false)
        }
    }, [user])

    /* ── Realtime Messages for Selected Conversation ───── */
    useEffect(() => {
        if (!conversationId) {
            setMessages([])
            return
        }

        const msgQuery = query(
            collection(db, 'conversations', conversationId, 'messages'),
            orderBy('createdAt', 'asc')
        )

        let unsub: Unsubscribe | null = null

        try {
            unsub = onSnapshot(msgQuery, (snapshot) => {
                const msgs: Message[] = snapshot.docs.map(docSnap => {
                    const data = docSnap.data()
                    return {
                        id: docSnap.id,
                        conversation_id: conversationId,
                        sender_id: data.sender_id || '',
                        content: data.content || '',
                        is_read: data.is_read ?? true,
                        created_at: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                    }
                })
                setMessages(msgs)
            }, (err) => {
                console.warn('Realtime messages listener error:', err)
            })
        } catch (e) {
            console.warn('Could not attach message onSnapshot:', e)
        }

        return () => {
            if (unsub) unsub()
        }
    }, [conversationId])

    useEffect(() => {
        loadConversations()
    }, [loadConversations])

    /* ── Send Message ──────────────────────────────────── */
    const sendMessage = useCallback(async (convId: string, content: string): Promise<boolean> => {
        if (!user || !content.trim()) return false
        setSending(true)

        try {
            const trimmed = content.trim()
            // 1. Add to sub-collection
            await addDoc(collection(db, 'conversations', convId, 'messages'), {
                conversation_id: convId,
                sender_id: user.id,
                content: trimmed,
                is_read: false,
                createdAt: serverTimestamp(),
            })

            // 2. Update conversation summary
            await setDoc(doc(db, 'conversations', convId), {
                last_message: trimmed,
                last_message_at: new Date().toISOString(),
                updatedAt: serverTimestamp(),
            }, { merge: true })

            setSending(false)
            return true
        } catch (error) {
            console.error('Error sending message:', error)
            setSending(false)
            return false
        }
    }, [user])

    /* ── Get or Create Conversation ────────────────────── */
    const getOrCreateConversation = useCallback(async (otherUserId: string): Promise<string | null> => {
        if (!user) return null

        try {
            // Check existing
            const q1 = query(
                collection(db, 'conversations'),
                where('participant1', '==', user.id),
                where('participant2', '==', otherUserId)
            )
            const q2 = query(
                collection(db, 'conversations'),
                where('participant1', '==', otherUserId),
                where('participant2', '==', user.id)
            )

            const [s1, s2] = await Promise.all([getDocs(q1), getDocs(q2)])
            if (!s1.empty) return s1.docs[0].id
            if (!s2.empty) return s2.docs[0].id

            // Create new
            const newDocRef = await addDoc(collection(db, 'conversations'), {
                participant1: user.id,
                participant2: otherUserId,
                last_message: null,
                last_message_at: new Date().toISOString(),
                createdAt: serverTimestamp(),
            })

            await loadConversations()
            return newDocRef.id
        } catch (error) {
            console.error('Error creating conversation:', error)
            return null
        }
    }, [user, loadConversations])

    const loadMessages = useCallback(async (_convId?: string) => {
        // Handled reactively by onSnapshot
    }, [])

    return {
        conversations,
        messages,
        loading,
        sending,
        sendMessage,
        getOrCreateConversation,
        loadMessages,
        loadConversations,
    }
}
