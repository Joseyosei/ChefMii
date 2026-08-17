'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget'
import {
    LayoutDashboard,
    DollarSign,
    TrendingUp,
    Users,
    Share2,
    Copy,
    Check,
    Sparkles,
    Video,
    Award,
    ChevronRight,
    ArrowUpRight,
    Calendar,
    Wallet,
    Download
} from 'lucide-react'

interface ReferralBooking {
    id: string
    follower: string
    chefName: string
    eventType: string
    bookingValue: number
    commissionRate: number
    commissionEarned: number
    date: string
    status: 'paid' | 'pending' | 'processing'
}

const REFERRALS: ReferralBooking[] = [
    { id: 'ref-1', follower: 'sophia_foodie', chefName: 'Chef Marco Rossi', eventType: 'Private Birthday Dinner', bookingValue: 750, commissionRate: 0.10, commissionEarned: 75.00, date: 'Today, 14:20', status: 'processing' },
    { id: 'ref-2', follower: 'alex_eats_ldn', chefName: 'Chef Yuki Tanaka', eventType: '10-Person Omakase Tasting', bookingValue: 1200, commissionRate: 0.10, commissionEarned: 120.00, date: 'Yesterday', status: 'paid' },
    { id: 'ref-3', follower: 'tasty_travels', chefName: 'Chef Pierre Dubois', eventType: 'Intimate Anniversary Dinner', bookingValue: 450, commissionRate: 0.08, commissionEarned: 36.00, date: '14 Aug 2026', status: 'paid' },
    { id: 'ref-4', follower: 'marcus_chef_fan', chefName: 'Chef Marcus Vance', eventType: 'Wood-Fired Smokehouse Feast', bookingValue: 980, commissionRate: 0.10, commissionEarned: 98.00, date: '11 Aug 2026', status: 'paid' },
    { id: 'ref-5', follower: 'london_bites', chefName: 'Chef Aisha Okafor', eventType: 'Afro-Fusion Summer Party', bookingValue: 1600, commissionRate: 0.10, commissionEarned: 160.00, date: '08 Aug 2026', status: 'paid' },
]

export default function InfluencerDashboardPage() {
    const [copied, setCopied] = useState(false)
    const [handle, setHandle] = useState('tastelondon')
    const [activeTab, setActiveTab] = useState<'overview' | 'referrals' | 'campaigns' | 'payouts'>('overview')

    const referralUrl = `https://chefmii.com/?ref=${handle}`

    const handleCopy = () => {
        navigator.clipboard.writeText(referralUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const totalEarned = REFERRALS.filter(r => r.status === 'paid').reduce((s, r) => s + r.commissionEarned, 0)
    const pendingEarned = REFERRALS.filter(r => r.status === 'processing' || r.status === 'pending').reduce((s, r) => s + r.commissionEarned, 0)
    const totalBookingsGenerated = REFERRALS.length

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-stone-50 dark:bg-stone-950 pb-24 font-sans text-foreground">
                {/* Creator Header */}
                <div className="bg-white dark:bg-stone-900 border-b border-border shadow-xs">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center text-white text-2xl font-bold shadow-md">
                                📱
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                                        Creator Affiliate Hub
                                    </h1>
                                    <span className="px-2.5 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs rounded-full border border-purple-500/20">
                                        ★ Tier 1 Partner (10% Tier)
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                                    Track booking referrals, sponsored chef collaborations, and automated monthly payouts.
                                </p>
                            </div>
                        </div>

                        {/* Direct Payout CTA */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => setActiveTab('payouts')}
                                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                            >
                                <Wallet className="w-4 h-4" />
                                Instant Stripe Payout (£{totalEarned.toFixed(2)})
                            </button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-4 overflow-x-auto no-scrollbar border-t border-border/50 pt-2">
                        {[
                            { id: 'overview', label: 'Overview & Stats', icon: LayoutDashboard },
                            { id: 'referrals', label: 'Booking Referrals', icon: Users, badge: REFERRALS.length },
                            { id: 'campaigns', label: 'Chef Collaborations', icon: Video },
                            { id: 'payouts', label: 'Payout History', icon: DollarSign },
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id as any)}
                                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
                                    activeTab === t.id
                                        ? 'border-terracotta text-terracotta'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <t.icon className="w-4 h-4" />
                                {t.label}
                                {t.badge && (
                                    <span className="px-1.5 py-0.2 bg-terracotta/10 text-terracotta rounded-full text-[11px]">
                                        {t.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
                    {/* Shareable Link Hero Card */}
                    <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-xl z-10">
                            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold">
                                🔗 Your Custom Referral Link
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-serif font-bold leading-tight">
                                Earn 10% commission on every follower booking
                            </h2>
                            <p className="text-white/80 text-xs sm:text-sm">
                                Share your link on Instagram, TikTok, YouTube, or your blog. Every time a follower books a chef, you get paid automatically.
                            </p>
                        </div>

                        {/* Link Copy Box */}
                        <div className="w-full md:w-auto bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 z-10 shrink-0">
                            <div className="flex items-center bg-white/10 px-3.5 py-2.5 rounded-xl text-xs font-mono text-white/90 truncate">
                                {referralUrl}
                            </div>
                            <button
                                onClick={handleCopy}
                                className="px-5 py-2.5 bg-white text-black hover:bg-white/90 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shrink-0"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 text-emerald-600" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        Copy Link
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            {/* Stat Cards */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                {[
                                    { label: 'Total Paid Earnings', value: `£${totalEarned.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-600 dark:text-emerald-400', sub: 'Instant bank payout' },
                                    { label: 'Pending Commission', value: `£${pendingEarned.toFixed(2)}`, icon: TrendingUp, color: 'text-amber-500', sub: 'Processing events' },
                                    { label: 'Bookings Referred', value: totalBookingsGenerated.toString(), icon: Users, color: 'text-terracotta', sub: '14.2% Conversion rate' },
                                    { label: 'Link Clicks', value: '1,420', icon: Share2, color: 'text-purple-500', sub: 'From social bios' },
                                ].map((stat, idx) => (
                                    <div key={idx} className="bg-white dark:bg-stone-900 border border-border/80 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                                                {stat.label}
                                            </span>
                                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                        </div>
                                        <div>
                                            <p className={`text-2xl sm:text-3xl font-black ${stat.color}`}>
                                                {stat.value}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground mt-1">
                                                {stat.sub}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Recent Referrals Table */}
                            <div className="bg-white dark:bg-stone-900 border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-serif font-bold text-lg text-foreground">
                                        Recent Referral Activity
                                    </h3>
                                    <button
                                        onClick={() => setActiveTab('referrals')}
                                        className="text-xs font-bold text-terracotta hover:underline"
                                    >
                                        View Full Report →
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-stone-50 dark:bg-stone-800 text-muted-foreground uppercase font-bold border-b border-border">
                                            <tr>
                                                <th className="p-3">Follower</th>
                                                <th className="p-3">Chef Booked</th>
                                                <th className="p-3">Event Type</th>
                                                <th className="p-3">Booking Total</th>
                                                <th className="p-3">Your 10% Cut</th>
                                                <th className="p-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/40 font-medium">
                                            {REFERRALS.map((ref) => (
                                                <tr key={ref.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/50">
                                                    <td className="p-3 font-bold text-foreground">@{ref.follower}</td>
                                                    <td className="p-3">{ref.chefName}</td>
                                                    <td className="p-3 text-muted-foreground">{ref.eventType}</td>
                                                    <td className="p-3 font-bold">£{ref.bookingValue}</td>
                                                    <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                                                        +£{ref.commissionEarned.toFixed(2)}
                                                    </td>
                                                    <td className="p-3">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                                                            ref.status === 'paid'
                                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                                : 'bg-amber-500/10 text-amber-600'
                                                        }`}>
                                                            {ref.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Referrals Detailed Tab */}
                    {activeTab === 'referrals' && (
                        <div className="bg-white dark:bg-stone-900 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                            <div>
                                <h3 className="font-serif font-bold text-xl text-foreground mb-1">
                                    All Referred Chef Bookings
                                </h3>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    Full audit log of all meals and private dining events generated by your community
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-stone-100 dark:bg-stone-800 text-muted-foreground uppercase font-bold border-b border-border">
                                        <tr>
                                            <th className="p-3.5">Ref ID</th>
                                            <th className="p-3.5">Follower</th>
                                            <th className="p-3.5">Chef Booked</th>
                                            <th className="p-3.5">Event</th>
                                            <th className="p-3.5">Date</th>
                                            <th className="p-3.5">Booking Amount</th>
                                            <th className="p-3.5">Commission</th>
                                            <th className="p-3.5">Payout Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40 font-medium">
                                        {REFERRALS.map((r) => (
                                            <tr key={r.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                                                <td className="p-3.5 font-mono text-muted-foreground">{r.id}</td>
                                                <td className="p-3.5 font-bold text-foreground">@{r.follower}</td>
                                                <td className="p-3.5">{r.chefName}</td>
                                                <td className="p-3.5">{r.eventType}</td>
                                                <td className="p-3.5 text-muted-foreground">{r.date}</td>
                                                <td className="p-3.5 font-bold">£{r.bookingValue.toFixed(2)}</td>
                                                <td className="p-3.5 font-bold text-emerald-600">£{r.commissionEarned.toFixed(2)}</td>
                                                <td className="p-3.5">
                                                    <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold">
                                                        {r.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Campaigns Tab */}
                    {activeTab === 'campaigns' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-stone-900 border border-border/80 rounded-3xl p-6 space-y-4 shadow-sm">
                                <span className="px-3 py-1 bg-terracotta/10 text-terracotta rounded-full text-xs font-bold">
                                    🎥 Active Sponsored Campaign
                                </span>
                                <h4 className="font-serif font-bold text-lg text-foreground">
                                    Chef Marco Rossi x Summer Truffle Tour
                                </h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Create a 60-second TikTok / Reel showcasing Chef Marco’s handmade Umbrian truffle pasta tasting menu. Receive £250 base fee + 10% booking commissions.
                                </p>
                                <div className="pt-2 flex items-center justify-between text-xs font-bold">
                                    <span className="text-emerald-600">£250 Base + 10% Commission</span>
                                    <button className="px-4 py-2 gradient-brand text-white rounded-xl shadow-xs">
                                        Accept Collaboration →
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-stone-900 border border-border/80 rounded-3xl p-6 space-y-4 shadow-sm">
                                <span className="px-3 py-1 bg-purple-500/10 text-purple-600 rounded-full text-xs font-bold">
                                    🍣 Omakase Masterclass Feature
                                </span>
                                <h4 className="font-serif font-bold text-lg text-foreground">
                                    Chef Yuki Tanaka Tokyo VIP Night
                                </h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Host a live interactive ChefTV cooking session with Chef Yuki demonstrating nigiri knife skills.
                                </p>
                                <div className="pt-2 flex items-center justify-between text-xs font-bold">
                                    <span className="text-purple-600">VIP Chef Dinner Included</span>
                                    <button className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-black rounded-xl shadow-xs">
                                        Apply for Feature →
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payouts Tab */}
                    {activeTab === 'payouts' && (
                        <div className="bg-white dark:bg-stone-900 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 max-w-2xl">
                            <div>
                                <h3 className="font-serif font-bold text-xl text-foreground mb-1">
                                    Stripe Instant Bank Payouts
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Earnings are deposited directly into your linked bank account via Stripe Connect
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-sm">Available Balance: £{totalEarned.toFixed(2)}</p>
                                    <p className="text-emerald-600 dark:text-emerald-400">Ready for instant transfer to Barclays •••• 4892</p>
                                </div>
                                <button className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-xs">
                                    Transfer Now
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
            <ChatbotWidget />
        </>
    )
}
