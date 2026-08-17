'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    doc,
    setDoc,
    serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import {
    LayoutDashboard, Calendar, MessageSquare, Star, Settings,
    LogOut, ChefHat, Clock, CheckCircle, XCircle, MapPin,
    Search, Bell, Loader2, Send, Camera, Upload, Check, ChevronRight
} from 'lucide-react'
import { BrandLogo } from '@/components/layout/logo'
import { useUserDashboardData, UserBooking, AvailableChef, UserConversation } from '@/hooks/useUserDashboardData'

const STATUS_STYLES: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    declined: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}
const STATUS_ICONS: Record<string, React.ElementType> = {
    confirmed: CheckCircle, pending: Clock, completed: CheckCircle, cancelled: XCircle, declined: XCircle
}

/* ── Sub-views ─────────────────────────────────────────── */
function OverviewView({ userName, goTo, bookings }: { userName: string; goTo: (t: string) => void, bookings: UserBooking[] }) {
    const upcoming = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending')
    const spent = bookings.filter(b => b.status === 'completed').reduce((s, b) => s + Number(b.total_price), 0)
    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-5">
                {[
                    { label: 'Total Bookings', value: bookings.length.toString(), color: 'text-terracotta' },
                    { label: 'Upcoming', value: upcoming.length.toString(), color: 'text-green-500' },
                    { label: 'Total Spent', value: `£${spent.toLocaleString()}`, color: 'text-blue-500' },
                    { label: 'Reviews Given', value: '2', color: 'text-yellow-500' },
                ].map(s => (
                    <div key={s.label} className="bg-card border border-border rounded-2xl p-4 sm:p-5">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">{s.label}</p>
                        <p className={`text-2xl sm:text-3xl font-black ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>
            {/* Upcoming */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-bold text-base sm:text-lg">Upcoming Bookings</h2>
                    <button onClick={() => goTo('bookings')} className="text-terracotta text-sm font-medium hover:underline">View all</button>
                </div>
                {upcoming.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground text-sm">
                        <ChefHat className="w-10 h-10 mx-auto mb-3 opacity-30 text-terracotta" />
                        <p className="font-semibold text-foreground mb-1">No upcoming bookings</p>
                        <p className="text-xs text-muted-foreground mb-4">Explore our 16 international master chefs and reserve your tasting menu.</p>
                        <button onClick={() => goTo('book')} className="px-5 py-2.5 gradient-brand text-white text-xs font-bold rounded-xl shadow-sm">
                            Browse & Book Chefs →
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {upcoming.map(b => (
                            <div key={b.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/40 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl gradient-brand text-white font-bold flex items-center justify-center text-sm shrink-0">
                                        👨‍🍳
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-foreground">{b.chef?.full_name || 'Master Chef'}</p>
                                        <p className="text-xs text-muted-foreground">{b.event_type} · {b.event_date} at {b.start_time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${STATUS_STYLES[b.status] || 'bg-stone-100'}`}>
                                        {b.status}
                                    </span>
                                    <p className="font-bold text-sm text-terracotta">£{b.total_price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function BookingsView({ bookings }: { bookings: UserBooking[] }) {
    const [filter, setFilter] = useState('all')
    const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)
    return (
        <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-1">
                {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-colors border ${
                            filter === f ? 'bg-terracotta text-white border-terracotta' : 'bg-card border-border hover:border-terracotta/50'
                        }`}>
                        {f}
                    </button>
                ))}
            </div>
            {filtered.length === 0 ? (
                <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground text-sm">
                    No bookings found under this filter.
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(b => (
                        <div key={b.id} className="bg-card border border-border rounded-2xl p-5 hover:border-terracotta/40 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl gradient-brand text-white font-bold flex items-center justify-center text-base shrink-0">
                                        🍳
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-base text-foreground">{b.chef?.full_name || 'Chef'}</p>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${STATUS_STYLES[b.status]}`}>
                                                {b.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">{b.event_type} · {b.guests} Guests · {b.duration_hours}h</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                            <MapPin className="w-3 h-3 text-terracotta" />
                                            {b.location}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap">
                                    <div className="text-right mr-2">
                                        <span className="text-[10px] text-muted-foreground block uppercase font-bold">Total</span>
                                        <span className="font-black text-lg text-terracotta">£{b.total_price}</span>
                                    </div>
                                    <Link
                                        href="/reviews"
                                        className="px-3.5 py-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold rounded-xl hover:bg-amber-500 hover:text-white transition-all flex items-center gap-1"
                                    >
                                        ⭐ Rate Chef
                                    </Link>
                                    <Link
                                        href={`/order/tracking/${b.chef_id || 'marco-rossi'}`}
                                        className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-black text-xs font-bold rounded-xl hover:opacity-90 transition-opacity"
                                    >
                                        Track Order →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function UserReviewsView() {
    return (
        <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold font-serif text-foreground">Verified Dining Reviews & Feedback</h2>
                    <p className="text-xs text-muted-foreground mt-1">Share your dining feedback or browse reviews from fellow clients worldwide.</p>
                </div>
                <Link
                    href="/reviews"
                    className="px-5 py-2.5 gradient-brand text-white text-xs font-bold rounded-xl shadow-xs hover:opacity-90 transition-opacity shrink-0 flex items-center gap-1.5"
                >
                    <Star className="w-3.5 h-3.5 fill-white" />
                    Open Public Reviews Hub →
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                    <span className="text-xs font-bold text-terracotta uppercase">100% Escrow Feedback</span>
                    <h3 className="font-bold text-base text-foreground">Why Review Your Chef?</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Reviews help our Michelin-trained private chefs build their global reputation, unlock higher booking tiers, and maintain our strict 7-stage quality vetting standards.
                    </p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                    <span className="text-xs font-bold text-emerald-600 uppercase">Earn Loyalty Credits</span>
                    <h3 className="font-bold text-base text-foreground">Get £25 Off Your Next Feast</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Every verified review submitted with a dining photo credits your account with £25 toward your next private chef booking or marketplace order.
                    </p>
                </div>
            </div>
        </div>
    )
}

function BookChefView({ chefs }: { chefs: AvailableChef[] }) {
    const router = useRouter()
    const [query, setQuery] = useState('')
    const [cuisine, setCuisine] = useState('All')
    const [maxRate, setMaxRate] = useState(500)

    const CUISINE_FILTERS = [
        'All', 'Italian', 'Japanese', 'French', 'American', 'Chinese', 'Ukrainian',
        'Nordic', 'Korean', 'Middle Eastern', 'West African', 'Spanish', 'Pan-African', 'Indian', 'Mexican'
    ]

    const filtered = chefs.filter(c => {
        const matchesCuisine = (cuisine === 'All' || (c.cuisine && c.cuisine.toLowerCase() === cuisine.toLowerCase()))
        const matchesRate = (c.hourly_rate || 500) <= maxRate
        const matchesQuery = !query || (
            c.full_name.toLowerCase().includes(query.toLowerCase()) ||
            (c.cuisine && c.cuisine.toLowerCase().includes(query.toLowerCase())) ||
            (c.location && c.location.toLowerCase().includes(query.toLowerCase()))
        )
        return matchesCuisine && matchesRate && matchesQuery
    })

    return (
        <div className="space-y-6">
            {/* Search & Filter Header */}
            <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
                <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3">
                    <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search by chef name, cuisine, or city (e.g. Marco, Omakase, London)…"
                        className="flex-1 bg-transparent text-sm text-foreground focus:outline-none"
                    />
                    {query && (
                        <button onClick={() => setQuery('')} className="text-xs font-bold text-muted-foreground hover:text-foreground">
                            Clear
                        </button>
                    )}
                </div>

                {/* Cuisine Scroller */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {CUISINE_FILTERS.map(c => (
                        <button
                            key={c}
                            onClick={() => setCuisine(c)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                                cuisine === c
                                    ? 'bg-terracotta text-white border-terracotta shadow-xs'
                                    : 'bg-card border-border hover:border-terracotta/50 text-foreground'
                            }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                {/* Price Slider */}
                <div className="flex items-center justify-between gap-4 pt-1 border-t border-border/50">
                    <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">
                        Max Rate: <span className="text-terracotta font-black">£{maxRate}/hr</span>
                    </span>
                    <input
                        type="range"
                        min="50"
                        max="500"
                        step="10"
                        value={maxRate}
                        onChange={e => setMaxRate(Number(e.target.value))}
                        className="flex-1 max-w-xs accent-terracotta"
                    />
                </div>
            </div>

            {/* Chef Cards Grid */}
            {filtered.length === 0 ? (
                <div className="bg-card border border-border rounded-2xl p-12 text-center space-y-3">
                    <p className="text-3xl">👨‍🍳</p>
                    <p className="font-bold text-base text-foreground">No chefs match your current filters</p>
                    <p className="text-xs text-muted-foreground">Try clearing your search term or adjusting the price filter.</p>
                    <button
                        onClick={() => { setQuery(''); setCuisine('All'); setMaxRate(500); }}
                        className="px-4 py-2 gradient-brand text-white text-xs font-bold rounded-xl"
                    >
                        Reset Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filtered.map(c => {
                        const initials = c.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
                        return (
                            <div
                                key={c.id}
                                className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs hover:shadow-lg hover:border-terracotta/50 transition-all duration-300 flex flex-col justify-between group"
                            >
                                <div className="relative h-48 w-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                                    {c.avatar_url ? (
                                        <Image
                                            src={c.avatar_url}
                                            alt={c.full_name}
                                            fill
                                            unoptimized
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full gradient-brand flex items-center justify-center text-white text-3xl font-black">
                                            {initials}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
                                    {c.badge && (
                                        <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10">
                                            {c.badge}
                                        </span>
                                    )}
                                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
                                        <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px]">
                                            <MapPin className="w-3 h-3 text-terracotta" />
                                            {c.location || 'London, UK'}
                                        </span>
                                        <span className="flex items-center gap-1 bg-amber-500/90 text-white px-1.5 py-0.5 rounded-md text-[11px]">
                                            <Star className="w-3 h-3 fill-white text-white" />
                                            {c.rating || 4.9}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                    <div>
                                        <h3 className="font-bold text-sm text-foreground group-hover:text-terracotta transition-colors truncate">
                                            {c.full_name}
                                        </h3>
                                        <p className="text-xs text-terracotta font-bold">{c.cuisine}</p>
                                        {c.specialties && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {c.specialties.slice(0, 2).map((s, i) => (
                                                    <span key={i} className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-2.5 border-t border-border/50 flex items-center justify-between">
                                        <div>
                                            <span className="text-[9px] text-muted-foreground uppercase font-bold block">Rate</span>
                                            <span className="text-terracotta font-black text-base">£{c.hourly_rate}/hr</span>
                                        </div>
                                        <button
                                            onClick={() => router.push(`/book/${c.id}`)}
                                            className="px-3.5 py-2 gradient-brand text-white text-xs font-bold rounded-xl hover:opacity-90 shadow-xs transition-opacity"
                                        >
                                            Book Chef →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function MessagesView({ conversations }: { conversations: UserConversation[] }) {
    const [active, setActive] = useState<UserConversation | null>(conversations[0] || null)
    const [reply, setReply] = useState('')
    const { user } = useAuth()
    const [msgs, setMsgs] = useState<any[]>([])
    const [loadingMsgs, setLoadingMsgs] = useState(false)

    useEffect(() => {
        if (!active || !user) return

        const msgQuery = query(
            collection(db, 'conversations', active.id, 'messages'),
            orderBy('createdAt', 'asc')
        )

        const unsub = onSnapshot(msgQuery, (snapshot) => {
            const list = snapshot.docs.map(docSnap => ({
                id: docSnap.id,
                ...docSnap.data(),
            }))
            setMsgs(list)
            setLoadingMsgs(false)
        }, () => {
            setLoadingMsgs(false)
        })

        return () => unsub()
    }, [active, user])

    const send = async () => {
        if (!reply.trim() || !active || !user) return
        const text = reply.trim()
        setReply('')

        try {
            await addDoc(collection(db, 'conversations', active.id, 'messages'), {
                conversation_id: active.id,
                sender_id: user.id,
                content: text,
                createdAt: serverTimestamp(),
            })

            await setDoc(doc(db, 'conversations', active.id), {
                last_message: text,
                last_message_at: serverTimestamp(),
            }, { merge: true })
        } catch (e) {
            console.error('Error sending message:', e)
        }
    }

    if (conversations.length === 0) {
        return (
            <div className="bg-card border border-border rounded-2xl p-12 text-center space-y-3">
                <MessageSquare className="w-10 h-10 mx-auto text-terracotta opacity-40" />
                <p className="font-bold text-base text-foreground">No conversations yet</p>
                <p className="text-muted-foreground text-xs">Book a chef or initiate a chat inquiry to start messaging!</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4" style={{ height: 'calc(100vh - 14rem)' }}>
            {/* Thread list */}
            <div className="sm:w-64 bg-card border border-border rounded-2xl overflow-hidden flex flex-col max-h-48 sm:max-h-none shrink-0">
                <p className="px-4 py-3 font-bold border-b border-border text-xs uppercase tracking-wider text-muted-foreground shrink-0">Master Chefs</p>
                <div className="overflow-y-auto">
                    {conversations.map(m => {
                        const initials = m.participant_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
                        return (
                            <button
                                key={m.id}
                                onClick={() => setActive(m)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted transition-colors border-b border-border/50 ${
                                    active?.id === m.id ? 'bg-muted font-bold' : ''
                                }`}
                            >
                                <div className="w-9 h-9 rounded-full gradient-brand text-white font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden">
                                    {m.participant_avatar ? <img src={m.participant_avatar} alt="" className="w-full h-full object-cover" /> : initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-xs truncate text-foreground">{m.participant_name}</p>
                                    <p className="text-[11px] text-muted-foreground truncate">{m.last_message || 'New conversation'}</p>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>
            {/* Chat Area */}
            <div className="flex-1 bg-card border border-border rounded-2xl flex flex-col overflow-hidden min-h-0">
                <div className="px-4 py-3 border-b border-border flex items-center gap-3 shrink-0">
                    <div className="w-8 h-8 rounded-full gradient-brand text-white font-bold text-xs flex items-center justify-center overflow-hidden">
                        {active?.participant_avatar ? <img src={active.participant_avatar} alt="" className="w-full h-full object-cover" /> : active?.participant_name.slice(0, 2).toUpperCase()}
                    </div>
                    <p className="font-bold text-sm text-foreground">{active?.participant_name}</p>
                </div>
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {loadingMsgs ? (
                        <div className="h-full flex items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-terracotta" />
                        </div>
                    ) : msgs.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
                            No messages yet. Say hello to your chef!
                        </div>
                    ) : (
                        msgs.map((m, i) => {
                            const isMe = m.sender_id === user?.id
                            return (
                                <div key={m.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm max-w-[80%] ${
                                        isMe ? 'gradient-brand text-white rounded-tr-sm' : 'bg-muted text-foreground rounded-tl-sm'
                                    }`}>
                                        {m.content}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
                <div className="p-3 border-t border-border flex gap-2 shrink-0">
                    <input
                        value={reply}
                        onChange={e => setReply(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && send()}
                        placeholder="Type a message to your chef…"
                        className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none"
                    />
                    <button
                        onClick={send}
                        disabled={!reply.trim()}
                        className="px-4 gradient-brand text-white rounded-xl text-xs font-bold hover:opacity-90 disabled:opacity-50 flex items-center justify-center"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

function SettingsView({ profile }: { profile: { full_name: string | null; role: string | null; avatar_url?: string | null; phone?: string | null } | null }) {
    const { user, refreshProfile } = useAuth()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [name, setName] = useState(profile?.full_name || '')
    const [phone, setPhone] = useState(profile?.phone || '')
    const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url || null)
    const [saved, setSaved] = useState(false)
    const [saving, setSaving] = useState(false)
    const [uploadingPhoto, setUploadingPhoto] = useState(false)

    // Handle Profile Photo Upload
    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || !files.length) return

        const file = files[0]
        setUploadingPhoto(true)

        const reader = new FileReader()
        reader.onload = async () => {
            const base64Data = reader.result as string
            setAvatarUrl(base64Data)

            if (user) {
                try {
                    await setDoc(doc(db, 'users', user.id), {
                        avatar_url: base64Data,
                        photoURL: base64Data,
                        updatedAt: serverTimestamp(),
                    }, { merge: true })
                    await refreshProfile()
                } catch (err) {
                    console.error('Error saving avatar:', err)
                }
            }
            setUploadingPhoto(false)
            setSaved(true)
            setTimeout(() => setSaved(false), 2500)
        }
        reader.readAsDataURL(file)
    }

    const save = async () => {
        setSaving(true)
        if (user) {
            try {
                await setDoc(doc(db, 'users', user.id), {
                    full_name: name,
                    phone,
                    avatar_url: avatarUrl,
                    photoURL: avatarUrl,
                    updatedAt: serverTimestamp(),
                }, { merge: true })
                await refreshProfile()
            } catch (e) {
                console.error('Error saving user profile settings:', e)
            }
        }
        setSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    return (
        <div className="max-w-xl space-y-6">
            <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-6 shadow-xs">
                <h2 className="font-serif font-bold text-lg text-foreground">Profile & Account Settings</h2>

                {/* Profile Photo Uploader */}
                <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden gradient-brand text-white font-black text-xl flex items-center justify-center shadow-md border-2 border-white dark:border-stone-800">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?'
                        )}
                        {uploadingPhoto && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <Loader2 className="w-5 h-5 text-white animate-spin" />
                            </div>
                        )}
                    </div>
                    <div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoSelect}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-foreground text-xs font-bold rounded-xl border border-border transition-colors flex items-center gap-1.5"
                        >
                            <Camera className="w-3.5 h-3.5 text-terracotta" />
                            Change Profile Photo
                        </button>
                        <p className="text-[11px] text-muted-foreground mt-1">JPG, PNG, or GIF up to 5MB</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Your full name"
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-terracotta"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="+44 7123 456789"
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-terracotta"
                        />
                    </div>
                </div>

                <button
                    onClick={save}
                    disabled={saving}
                    className="px-6 py-3 gradient-brand text-white text-xs font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2 shadow-xs"
                >
                    {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : saved ? <><Check className="w-4 h-4" /> Profile Updated!</> : 'Save Changes'}
                </button>
            </div>
        </div>
    )
}

/* ── Page ─────────────────────────────────────────────── */
export default function UserDashboardPage() {
    const router = useRouter()
    const { user, profile, loading: authLoading, signOut } = useAuth()
    const { bookings, chefs, conversations, loading: dataLoading, error } = useUserDashboardData()
    const [tab, setTab] = useState('book')
    const [signingOut, setSO] = useState(false)

    const handleSignOut = async () => {
        setSO(true)
        await signOut()
        router.replace('/')
    }

    const initials = profile?.full_name
        ? profile.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : '?'

    const avatar = profile?.avatar_url || null

    const pendingMessages = conversations.reduce((acc, c) => acc + c.unread_count, 0)
    
    const TABS = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'bookings', label: 'Bookings', icon: Calendar, badge: bookings.length > 0 ? bookings.length : undefined },
        { id: 'book', label: 'Book Master Chef', icon: ChefHat },
        { id: 'reviews', label: 'Reviews & Feedback', icon: Star },
        { id: 'messages', label: 'Messages', icon: MessageSquare, badge: pendingMessages > 0 ? pendingMessages : undefined },
        { id: 'settings', label: 'Settings', icon: Settings },
    ]

    if (authLoading || dataLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
            </div>
        )
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background flex-col font-sans text-foreground">
            {/* Topbar */}
            <div className="h-14 border-b border-border bg-background/95 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <BrandLogo size="sm" />
                    <div className="hidden sm:block pl-2 border-l border-border">
                        <p className="text-xs font-bold text-foreground">
                            {tab === 'overview' ? `Welcome, ${profile?.full_name?.split(' ')[0] || 'Foodie'}! 👋` : TABS.find(t => t.id === tab)?.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Client Dining Dashboard</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push('/order')}
                        className="px-3 py-1.5 gradient-brand text-white text-xs font-bold rounded-lg shadow-xs hover:opacity-90"
                    >
                        Order Food 🛵
                    </button>
                    <div
                        className="w-8 h-8 rounded-full gradient-brand text-white font-bold text-xs flex items-center justify-center cursor-pointer overflow-hidden border border-white/20"
                        onClick={() => setTab('settings')}
                    >
                        {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : initials}
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Desktop sidebar */}
                <aside className="hidden md:flex w-56 lg:w-64 border-r border-border bg-card flex-col shrink-0">
                    <div className="p-4 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl gradient-brand text-white font-black text-sm flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                                {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : initials}
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-xs truncate text-foreground">{profile?.full_name || user?.email || 'ChefMii Diner'}</p>
                                <span className="text-[10px] px-1.5 py-0.2 bg-terracotta/10 text-terracotta font-bold rounded">
                                    ★ VIP Diner
                                </span>
                            </div>
                        </div>
                    </div>
                    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                        {TABS.map(({ id, label, icon: Icon, badge }) => (
                            <button
                                key={id}
                                onClick={() => setTab(id)}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                                    tab === id ? 'gradient-brand text-white shadow-xs' : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <Icon className="w-4 h-4 shrink-0" />
                                    {label}
                                </div>
                                {badge && (
                                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                                        tab === id ? 'bg-white text-terracotta' : 'bg-terracotta text-white'
                                    }`}>
                                        {badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                    <div className="p-3 border-t border-border">
                        <button
                            onClick={handleSignOut}
                            disabled={signingOut}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            {signingOut ? 'Signing out…' : 'Sign Out'}
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-stone-50 dark:bg-stone-950">
                    <div className="max-w-7xl mx-auto">
                        {tab === 'overview' && <OverviewView userName={profile?.full_name || 'Foodie'} goTo={setTab} bookings={bookings} />}
                        {tab === 'bookings' && <BookingsView bookings={bookings} />}
                        {tab === 'book' && <BookChefView chefs={chefs} />}
                        {tab === 'reviews' && <UserReviewsView />}
                        {tab === 'messages' && <MessagesView conversations={conversations} />}
                        {tab === 'settings' && <SettingsView profile={profile as any} />}
                    </div>
                </main>
            </div>
        </div>
    )
}
