'use client'

import { useState } from 'react'
import { X, Sparkles, ChefHat, Building2, Baby, GraduationCap, Utensils, CheckCircle2, Copy, Share2, Loader2, ArrowRight } from 'lucide-react'
import type { WaitlistRole, WaitlistFormData, WaitlistSubmissionResponse } from '@/types/waitlist'

interface WaitlistModalProps {
    isOpen: boolean
    onClose: () => void
    defaultRole?: WaitlistRole
}

const ROLES: { id: WaitlistRole; label: string; icon: React.ElementType; color: string; desc: string }[] = [
    { id: 'chef', label: 'Chefs', icon: ChefHat, color: 'from-orange-500 to-amber-600', desc: 'Join as a private chef to host events & earn' },
    { id: 'business', label: 'Businesses', icon: Building2, color: 'from-blue-500 to-indigo-600', desc: 'Book corporate meals & employee dining plans' },
    { id: 'kid', label: 'Kids & Parents', icon: Baby, color: 'from-pink-500 to-rose-600', desc: 'Gamified cooking challenges & junior classes' },
    { id: 'tutor', label: 'Tutors', icon: GraduationCap, color: 'from-purple-500 to-violet-600', desc: 'Teach courses & masterclasses on ChefMii Academy' },
    { id: 'client', label: 'Clients', icon: Utensils, color: 'from-emerald-500 to-teal-600', desc: 'Book top chefs for home dinners & events' },
]

export function WaitlistModal({ isOpen, onClose, defaultRole = 'chef' }: WaitlistModalProps) {
    const [role, setRole] = useState<WaitlistRole>(defaultRole)
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    
    // Metadata fields
    const [city, setCity] = useState('')
    const [cuisine, setCuisine] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [eventCount, setEventCount] = useState('1-2 per month')
    const [parentName, setParentName] = useState('')
    const [ageGroup, setAgeGroup] = useState('5-8 years')
    const [specialty, setSpecialty] = useState('')
    const [courseTopic, setCourseTopic] = useState('')
    const [occasion, setOccasion] = useState('Dinner Parties')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [result, setResult] = useState<WaitlistSubmissionResponse['data'] | null>(null)
    const [copied, setCopied] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (!fullName.trim() || !email.trim()) {
            setError('Please fill in both your Name and Email address.')
            return
        }

        setLoading(true)
        const payload: WaitlistFormData = {
            role,
            fullName,
            email,
            city,
            cuisine,
            companyName,
            eventCount,
            parentName,
            ageGroup,
            specialty,
            courseTopic,
            occasion,
        }

        try {
            const res = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            const data: WaitlistSubmissionResponse = await res.json()
            if (!data.success || !data.data) {
                throw new Error(data.error || 'Failed to submit')
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

    const activeRoleInfo = ROLES.find(r => r.id === role)!

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Modal Header */}
                <div className="relative p-6 pb-4 border-b border-border bg-muted/40 shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2 text-terracotta text-xs font-bold uppercase tracking-wider mb-1">
                        <Sparkles className="w-4 h-4" /> VIP Priority Access
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                        {result ? "You're on the Waitlist!" : 'Join ChefMii Waitlist'}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {result ? 'Share your referral link to skip ahead in line.' : 'Get early platform access, exclusive perks, and launch invitations.'}
                    </p>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">

                    {result ? (
                        /* Confirmation Screen */
                        <div className="text-center py-4 space-y-6 animate-in zoom-in-95 duration-300">
                            <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-inner">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>

                            <div>
                                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-terracotta/10 text-terracotta uppercase tracking-wider mb-2">
                                    {result.role.toUpperCase()} VIP MEMBER
                                </span>
                                <h3 className="text-2xl font-bold">Welcome, {result.fullName}!</h3>
                                <p className="text-muted-foreground text-sm max-w-md mx-auto mt-1">
                                    We sent a confirmation to <span className="font-semibold text-foreground">{result.email}</span>.
                                </p>
                            </div>

                            {/* Queue Card */}
                            <div className="bg-muted/60 border border-border p-6 rounded-2xl max-w-md mx-auto">
                                <p className="text-xs uppercase font-bold tracking-wider text-muted-foreground mb-1">Your Priority Spot</p>
                                <p className="text-4xl font-black text-terracotta font-serif">#{result.queuePosition}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    You are ahead of 84% of upcoming members!
                                </p>
                            </div>

                            {/* Referral Share Box */}
                            <div className="space-y-3 max-w-md mx-auto text-left">
                                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Your Custom Referral Link (Skip Line)
                                </label>
                                <div className="flex items-center gap-2 p-2 bg-background border border-border rounded-xl">
                                    <input
                                        type="text"
                                        readOnly
                                        value={result.referralUrl}
                                        className="flex-1 bg-transparent px-3 py-1 text-xs font-mono text-muted-foreground focus:outline-none"
                                    />
                                    <button
                                        onClick={handleCopy}
                                        className="px-4 py-2 bg-terracotta text-white rounded-lg text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5 shrink-0"
                                    >
                                        {copied ? 'Copied!' : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full max-w-md py-3.5 gradient-brand text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        /* Form Screen */
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Role Selector Tabs */}
                            <div>
                                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
                                    Select Your Role
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                    {ROLES.map(r => {
                                        const Icon = r.icon
                                        const isSelected = role === r.id
                                        return (
                                            <button
                                                key={r.id}
                                                type="button"
                                                onClick={() => setRole(r.id)}
                                                className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-center justify-center text-center gap-1.5 ${
                                                    isSelected
                                                        ? 'border-terracotta bg-terracotta/10 text-foreground ring-2 ring-terracotta/30'
                                                        : 'border-border bg-background hover:bg-muted text-muted-foreground'
                                                }`}
                                            >
                                                <Icon className={`w-5 h-5 ${isSelected ? 'text-terracotta' : 'text-muted-foreground'}`} />
                                                <span className="text-xs font-bold leading-tight">{r.label}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                                <p className="text-xs text-muted-foreground mt-2 italic text-center">
                                    {activeRoleInfo.desc}
                                </p>
                            </div>

                            {/* Standard Required Inputs */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={e => setFullName(e.target.value)}
                                        placeholder="e.g. Sarah Jenkins"
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-terracotta"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="e.g. sarah@example.com"
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-terracotta"
                                    />
                                </div>
                            </div>

                            {/* Role-Specific Fields */}
                            <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 space-y-4">
                                <span className="text-xs font-bold text-terracotta uppercase tracking-wider block">
                                    Optional Details for {activeRoleInfo.label}
                                </span>

                                {role === 'chef' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-muted-foreground mb-1">Primary Cuisine</label>
                                            <input
                                                type="text"
                                                value={cuisine}
                                                onChange={e => setCuisine(e.target.value)}
                                                placeholder="e.g. Pan-African, French, Omakase"
                                                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-muted-foreground mb-1">City / Location</label>
                                            <input
                                                type="text"
                                                value={city}
                                                onChange={e => setCity(e.target.value)}
                                                placeholder="e.g. London, Lagos, Dubai"
                                                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                )}

                                {role === 'business' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-muted-foreground mb-1">Company / Organization</label>
                                            <input
                                                type="text"
                                                value={companyName}
                                                onChange={e => setCompanyName(e.target.value)}
                                                placeholder="e.g. Acme Corp"
                                                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-muted-foreground mb-1">Est. Events Frequency</label>
                                            <select
                                                value={eventCount}
                                                onChange={e => setEventCount(e.target.value)}
                                                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs focus:outline-none"
                                            >
                                                <option value="1-2 per month">1-2 per month</option>
                                                <option value="3-5 per month">3-5 per month</option>
                                                <option value="Weekly corporate catering">Weekly corporate catering</option>
                                                <option value="One-time large retreat">One-time large retreat</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {role === 'kid' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-muted-foreground mb-1">Parent / Guardian Name</label>
                                            <input
                                                type="text"
                                                value={parentName}
                                                onChange={e => setParentName(e.target.value)}
                                                placeholder="e.g. David Miller"
                                                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-muted-foreground mb-1">Child Age Bracket</label>
                                            <select
                                                value={ageGroup}
                                                onChange={e => setAgeGroup(e.target.value)}
                                                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs focus:outline-none"
                                            >
                                                <option value="5-8 years">5 - 8 years (Mini Chefs)</option>
                                                <option value="9-12 years">9 - 12 years (Junior Cooks)</option>
                                                <option value="13-17 years">13 - 17 years (Teen Masterclass)</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {role === 'tutor' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-muted-foreground mb-1">Culinary Specialty</label>
                                            <input
                                                type="text"
                                                value={specialty}
                                                onChange={e => setSpecialty(e.target.value)}
                                                placeholder="e.g. Artisan Pastry, Knife Skills"
                                                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-muted-foreground mb-1">Proposed Course Topic</label>
                                            <input
                                                type="text"
                                                value={courseTopic}
                                                onChange={e => setCourseTopic(e.target.value)}
                                                placeholder="e.g. Masterclass on Sourdough"
                                                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                )}

                                {role === 'client' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-muted-foreground mb-1">Preferred Cuisines</label>
                                            <input
                                                type="text"
                                                value={cuisine}
                                                onChange={e => setCuisine(e.target.value)}
                                                placeholder="e.g. Italian, West African, Mexican"
                                                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-muted-foreground mb-1">Occasion Type</label>
                                            <select
                                                value={occasion}
                                                onChange={e => setOccasion(e.target.value)}
                                                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-xs focus:outline-none"
                                            >
                                                <option value="Dinner Parties">Intimate Home Dinners</option>
                                                <option value="Weddings">Weddings & Banquets</option>
                                                <option value="Birthday Parties">Birthdays & Anniversaries</option>
                                                <option value="Date Nights">ChefMii Date Nights</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
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
                                    <>Reserve Priority Spot <ArrowRight className="w-5 h-5" /></>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
