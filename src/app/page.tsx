'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget'
import { WaitlistModal } from '@/components/waitlist/waitlist-modal'
import { FeaturedChefs } from '@/components/home/featured-chefs'
import {
    Sparkles, ChefHat, Building2, Baby, GraduationCap, Utensils,
    ShieldCheck, ArrowRight, CheckCircle2, Copy, Loader2, Star, Users, Award, PlayCircle
} from 'lucide-react'
import type { WaitlistRole, WaitlistFormData, WaitlistSubmissionResponse } from '@/types/waitlist'

const ROLES: { id: WaitlistRole; label: string; icon: React.ElementType; color: string; desc: string }[] = [
    { id: 'chef', label: 'Chefs', icon: ChefHat, color: 'from-orange-500 to-amber-600', desc: 'Join as a private chef to host events & earn' },
    { id: 'business', label: 'Businesses', icon: Building2, color: 'from-blue-500 to-indigo-600', desc: 'Book corporate meals & employee dining plans' },
    { id: 'kid', label: 'Kids & Parents', icon: Baby, color: 'from-pink-500 to-rose-600', desc: 'Gamified cooking challenges & junior classes' },
    { id: 'tutor', label: 'Tutors', icon: GraduationCap, color: 'from-purple-500 to-violet-600', desc: 'Teach courses & masterclasses on ChefMii Academy' },
    { id: 'client', label: 'Clients', icon: Utensils, color: 'from-emerald-500 to-teal-600', desc: 'Book top chefs for home dinners & events' },
]

export default function IntroductoryWaitlistHomePage() {
    const [modalOpen, setModalOpen] = useState(false)
    const [modalRole, setModalRole] = useState<WaitlistRole>('chef')

    // Inline form state
    const [role, setRole] = useState<WaitlistRole>('chef')
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [result, setResult] = useState<WaitlistSubmissionResponse['data'] | null>(null)
    const [copied, setCopied] = useState(false)

    const openModalForRole = (r: WaitlistRole) => {
        setModalRole(r)
        setModalOpen(true)
    }

    const handleInlineSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (!fullName.trim() || !email.trim()) {
            setError('Please fill in both your Name and Email address.')
            return
        }

        setLoading(true)
        const payload: WaitlistFormData = { role, fullName, email }

        try {
            const res = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            const data: WaitlistSubmissionResponse = await res.json()
            if (!data.success || !data.data) {
                throw new Error(data.error || 'Failed to join waitlist')
            }
            setResult(data.data)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = () => {
        if (!result) return
        navigator.clipboard.writeText(result.referralUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Navbar />

            <main className="flex-1">
                {/* 🌟 INTRODUCTORY WAITLIST HERO 🌟 */}
                <section className="relative pt-16 pb-24 lg:pt-28 lg:pb-36 bg-[#0B0B0C] text-white overflow-hidden border-b border-border/40">
                    {/* Background effects */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-terracotta/25 via-background/80 to-background opacity-90" />
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF5A36]/15 rounded-full blur-[140px] pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

                            {/* Left Col: Hero Messaging */}
                            <div className="lg:col-span-7 text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md mb-6 shadow-md">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                                    <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                                        OFFICIAL WAITLIST • 2,480+ RESERVED SPOTS
                                    </span>
                                </div>

                                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black mb-6 tracking-tight leading-[1.08]">
                                    The Future of Private Chefs <br className="hidden sm:block" />
                                    <span className="gradient-text-brand">& Culinary Creation</span>
                                </h1>

                                <p className="text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed font-normal">
                                    ChefMii is launching the world&apos;s premier platform uniting <strong>Private Chefs</strong>, <strong>Corporate Businesses</strong>, <strong>Kids & Parents</strong>, <strong>Academy Tutors</strong>, and <strong>Clients</strong>.
                                </p>

                                {/* 5 Role Quick Badges */}
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mb-10">
                                    {ROLES.map(r => {
                                        const Icon = r.icon
                                        return (
                                            <button
                                                key={r.id}
                                                onClick={() => openModalForRole(r.id)}
                                                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-terracotta hover:bg-terracotta/20 text-xs font-bold text-white transition-all shadow-sm group"
                                            >
                                                <Icon className="w-3.5 h-3.5 text-terracotta group-hover:scale-110 transition-transform" />
                                                <span>{r.label}</span>
                                            </button>
                                        )
                                    })}
                                </div>

                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                                    <Link href="/find-chefs" className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-all flex items-center gap-2 backdrop-blur-sm">
                                        Explore Live Chef Demo <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>

                            {/* Right Col: Instant Inline Registration Card */}
                            <div className="lg:col-span-5">
                                <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-terracotta/10 rounded-full blur-2xl -translate-y-10 translate-x-10 pointer-events-none" />

                                    {result ? (
                                        /* Success State */
                                        <div className="text-center py-6 space-y-6 animate-in fade-in zoom-in-95 duration-300">
                                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-inner">
                                                <CheckCircle2 className="w-9 h-9" />
                                            </div>

                                            <div>
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-terracotta/10 text-terracotta uppercase tracking-wider mb-2">
                                                    {result.role.toUpperCase()} VIP MEMBER
                                                </span>
                                                <h3 className="text-2xl font-bold text-foreground">You&apos;re on the List!</h3>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Confirmation sent to <span className="font-semibold text-foreground">{result.email}</span>.
                                                </p>
                                            </div>

                                            <div className="bg-muted/70 border border-border p-5 rounded-2xl">
                                                <p className="text-xs uppercase font-bold tracking-wider text-muted-foreground mb-1">Your Priority Spot</p>
                                                <p className="text-4xl font-black text-terracotta font-serif">#{result.queuePosition}</p>
                                            </div>

                                            <div className="space-y-2 text-left">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                                    Your Custom Referral Link
                                                </label>
                                                <div className="flex items-center gap-2 p-2 bg-background border border-border rounded-xl">
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        value={result.referralUrl}
                                                        className="flex-1 bg-transparent px-2 py-1 text-xs font-mono text-muted-foreground focus:outline-none"
                                                    />
                                                    <button
                                                        onClick={handleCopy}
                                                        className="px-3.5 py-2 bg-terracotta text-white rounded-lg text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1 shrink-0"
                                                    >
                                                        {copied ? 'Copied!' : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Form State */
                                        <form onSubmit={handleInlineSubmit} className="space-y-5">
                                            <div>
                                                <div className="flex items-center gap-2 text-terracotta text-xs font-bold uppercase tracking-wider mb-1">
                                                    <Sparkles className="w-4 h-4" /> VIP Early Access Registration
                                                </div>
                                                <h2 className="text-2xl font-serif font-bold text-foreground">Join the Waitlist</h2>
                                                <p className="text-xs text-muted-foreground mt-0.5">Select your role and reserve your priority spot.</p>
                                            </div>

                                            {/* Role Selector Grid */}
                                            <div>
                                                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                                    I am joining as a:
                                                </label>
                                                <div className="grid grid-cols-5 gap-1.5">
                                                    {ROLES.map(r => {
                                                        const Icon = r.icon
                                                        const isSelected = role === r.id
                                                        return (
                                                            <button
                                                                key={r.id}
                                                                type="button"
                                                                onClick={() => setRole(r.id)}
                                                                className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                                                                    isSelected
                                                                        ? 'border-terracotta bg-terracotta/15 text-foreground ring-2 ring-terracotta/30 font-bold'
                                                                        : 'border-border bg-background hover:bg-muted text-muted-foreground'
                                                                }`}
                                                            >
                                                                <Icon className={`w-4 h-4 ${isSelected ? 'text-terracotta' : 'text-muted-foreground'}`} />
                                                                <span className="text-[10px] truncate w-full">{r.label.split(' ')[0]}</span>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            {/* Full Name */}
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                                                    Full Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={fullName}
                                                    onChange={e => setFullName(e.target.value)}
                                                    placeholder="Enter your full name"
                                                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-terracotta"
                                                />
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                                                    Email Address <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    placeholder="Enter your email address"
                                                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-terracotta"
                                                />
                                            </div>

                                            {error && (
                                                <p className="text-xs font-semibold text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                                                    {error}
                                                </p>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full py-4 gradient-brand text-white font-bold text-base rounded-2xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-2"
                                            >
                                                {loading ? (
                                                    <><Loader2 className="w-5 h-5 animate-spin" /> Reserving Spot...</>
                                                ) : (
                                                    <>Reserve My VIP Spot <ArrowRight className="w-5 h-5" /></>
                                                )}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* 🌟 5 ROLE VALUE PROPOSITION GRID 🌟 */}
                <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-xs font-bold text-terracotta uppercase tracking-widest mb-2 block">Built For The Entire Ecosystem</span>
                        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-foreground mb-4">
                            Why Join The ChefMii Waitlist?
                        </h2>
                        <p className="text-muted-foreground text-base sm:text-lg">
                            Dedicated benefits tailored to Private Chefs, Corporate Businesses, Families, Academy Tutors, and Clients.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {ROLES.map(r => {
                            const Icon = r.icon
                            return (
                                <div key={r.id} className="bg-card border border-border rounded-3xl p-8 flex flex-col justify-between hover:shadow-2xl hover:border-terracotta/40 transition-all duration-300 group">
                                    <div>
                                        <div className="w-14 h-14 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <Icon className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-2xl font-serif font-bold mb-3">{r.label}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed mb-6">{r.desc}</p>
                                        
                                        <div className="space-y-2.5 pt-4 border-t border-border/60">
                                            <div className="flex items-start gap-2 text-xs font-semibold text-foreground">
                                                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                                <span>Priority VIP launch invitation</span>
                                            </div>
                                            <div className="flex items-start gap-2 text-xs font-semibold text-foreground">
                                                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                                <span>Exclusive founding member badge</span>
                                            </div>
                                            <div className="flex items-start gap-2 text-xs font-semibold text-foreground">
                                                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                                <span>Early access referral bonuses</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => openModalForRole(r.id)}
                                        className="mt-8 w-full py-3.5 px-4 gradient-brand text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md"
                                    >
                                        Join Waitlist for {r.label} <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* 🌟 FEATURED CHEFS SHOWCASE PREVIEW 🌟 */}
                <FeaturedChefs />

            </main>

            <Footer />
            <ChatbotWidget />

            <WaitlistModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                defaultRole={modalRole}
            />
        </div>
    )
}
