'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { BrandLogo } from '@/components/layout/logo'
import {
    Users, Search, Filter, Download, ChefHat, Building2,
    Baby, GraduationCap, Utensils, MapPin, Phone, Mail,
    Calendar, ShieldCheck, RefreshCw, X, ChevronRight, Copy, Check
} from 'lucide-react'
import type { WaitlistEntry } from '@/types/waitlist'

const ROLE_BADGES: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    chef: { label: 'Chef', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20', icon: ChefHat },
    business: { label: 'Business', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: Building2 },
    kid: { label: 'Kids & Family', color: 'bg-pink-500/10 text-pink-600 border-pink-500/20', icon: Baby },
    tutor: { label: 'Tutor', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20', icon: GraduationCap },
    client: { label: 'Client / Foodie', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', icon: Utensils },
    partner: { label: 'Partner', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', icon: Users },
}

export default function AdminWaitlistPage() {
    const [entries, setEntries] = useState<WaitlistEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedRole, setSelectedRole] = useState<string>('all')
    const [selectedEntry, setSelectedEntry] = useState<WaitlistEntry | null>(null)
    const [copiedEmail, setCopiedEmail] = useState<string | null>(null)

    const fetchWaitlist = async () => {
        setLoading(true)
        try {
            const url = selectedRole && selectedRole !== 'all'
                ? `/api/admin/waitlist?role=${selectedRole}`
                : '/api/admin/waitlist'
            const res = await fetch(url)
            const json = await res.json()
            if (json.success && json.entries) {
                setEntries(json.entries)
            }
        } catch (err) {
            console.error('Failed to load waitlist:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchWaitlist()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRole])

    const filteredEntries = useMemo(() => {
        if (!searchQuery.trim()) return entries
        const q = searchQuery.toLowerCase()
        return entries.filter(e =>
            e.fullName?.toLowerCase().includes(q) ||
            e.email?.toLowerCase().includes(q) ||
            (e.phone && e.phone.toLowerCase().includes(q)) ||
            (e.address?.city && e.address.city.toLowerCase().includes(q)) ||
            (e.address?.postalCode && e.address.postalCode.toLowerCase().includes(q)) ||
            (e.address?.line1 && e.address.line1.toLowerCase().includes(q)) ||
            (e.metadata?.cuisine && e.metadata.cuisine.toLowerCase().includes(q)) ||
            (e.metadata?.company_name && e.metadata.company_name.toLowerCase().includes(q)) ||
            (e.referralCode && e.referralCode.toLowerCase().includes(q))
        )
    }, [entries, searchQuery])

    const stats = useMemo(() => {
        return {
            total: entries.length,
            chefs: entries.filter(e => e.role === 'chef').length,
            clients: entries.filter(e => e.role === 'client').length,
            businesses: entries.filter(e => e.role === 'business').length,
            tutors: entries.filter(e => e.role === 'tutor').length,
            kids: entries.filter(e => e.role === 'kid').length,
        }
    }, [entries])

    const handleCopyEmail = (email: string) => {
        navigator.clipboard.writeText(email)
        setCopiedEmail(email)
        setTimeout(() => setCopiedEmail(null), 2000)
    }

    const exportCSV = () => {
        const headers = ['Queue Position', 'Full Name', 'Email', 'Phone', 'Role', 'Street Address', 'City', 'Postal Code', 'Country', 'Referral Code', 'Created At']
        const rows = filteredEntries.map(e => [
            e.queuePosition,
            `"${e.fullName || ''}"`,
            `"${e.email || ''}"`,
            `"${e.phone || ''}"`,
            `"${e.role || ''}"`,
            `"${e.address?.line1 || ''}"`,
            `"${e.address?.city || ''}"`,
            `"${e.address?.postalCode || ''}"`,
            `"${e.address?.country || 'UK'}"`,
            `"${e.referralCode || ''}"`,
            `"${e.createdAt || ''}"`
        ])
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', `chefmii_waitlist_${new Date().toISOString().slice(0, 10)}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-serif font-bold text-foreground">
                                Admin Waitlist Database
                            </h1>
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold">
                                Live Firestore Sync
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Inspect, filter, and manage priority waitlist applicants and location data.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchWaitlist}
                            disabled={loading}
                            className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-bold flex items-center gap-2 transition-colors"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                        </button>
                        <button
                            onClick={exportCSV}
                            className="px-4 py-2.5 rounded-xl gradient-brand text-white text-xs font-bold flex items-center gap-2 shadow-md hover:opacity-90 transition-opacity"
                        >
                            <Download className="w-4 h-4" />
                            <span>Export CSV</span>
                        </button>
                    </div>
                </div>

                {/* Metrics Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <div className="bg-card border border-border p-4 rounded-2xl">
                        <span className="text-xs font-bold text-muted-foreground uppercase">Total Signups</span>
                        <p className="text-2xl font-serif font-black text-foreground mt-1">{stats.total}</p>
                    </div>
                    <div className="bg-card border border-border p-4 rounded-2xl">
                        <span className="text-xs font-bold text-orange-500 uppercase">Chefs</span>
                        <p className="text-2xl font-serif font-black text-orange-500 mt-1">{stats.chefs}</p>
                    </div>
                    <div className="bg-card border border-border p-4 rounded-2xl">
                        <span className="text-xs font-bold text-emerald-500 uppercase">Clients</span>
                        <p className="text-2xl font-serif font-black text-emerald-500 mt-1">{stats.clients}</p>
                    </div>
                    <div className="bg-card border border-border p-4 rounded-2xl">
                        <span className="text-xs font-bold text-blue-500 uppercase">Corporate</span>
                        <p className="text-2xl font-serif font-black text-blue-500 mt-1">{stats.businesses}</p>
                    </div>
                    <div className="bg-card border border-border p-4 rounded-2xl">
                        <span className="text-xs font-bold text-purple-500 uppercase">Tutors</span>
                        <p className="text-2xl font-serif font-black text-purple-500 mt-1">{stats.tutors}</p>
                    </div>
                    <div className="bg-card border border-border p-4 rounded-2xl">
                        <span className="text-xs font-bold text-pink-500 uppercase">Kids / Families</span>
                        <p className="text-2xl font-serif font-black text-pink-500 mt-1">{stats.kids}</p>
                    </div>
                </div>

                {/* Controls Bar: Search & Role Filters */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                    {/* Search Input */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search name, email, city, postcode..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-terracotta"
                        />
                    </div>

                    {/* Role Filter Buttons */}
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                        {['all', 'chef', 'client', 'business', 'tutor', 'kid'].map(r => (
                            <button
                                key={r}
                                onClick={() => setSelectedRole(r)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all shrink-0 ${
                                    selectedRole === r
                                        ? 'bg-terracotta text-white shadow-sm'
                                        : 'bg-muted/60 text-muted-foreground hover:bg-muted border border-border'
                                }`}
                            >
                                {r === 'all' ? 'All Roles' : `${r}s`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 border-b border-border text-xs uppercase font-bold text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-4">Queue #</th>
                                    <th className="px-6 py-4">Name & Role</th>
                                    <th className="px-6 py-4">Contact Info</th>
                                    <th className="px-6 py-4">Location / Address</th>
                                    <th className="px-6 py-4">Key Details</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-16 text-muted-foreground">
                                            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-terracotta" />
                                            <span>Loading waitlist database…</span>
                                        </td>
                                    </tr>
                                ) : filteredEntries.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-16 text-muted-foreground">
                                            <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                            <p className="font-bold">No entries found</p>
                                            <p className="text-xs">Try clearing the search query or role filter.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredEntries.map(e => {
                                        const badge = ROLE_BADGES[e.role] || ROLE_BADGES.client
                                        const RoleIcon = badge.icon
                                        return (
                                            <tr
                                                key={e.id}
                                                className="hover:bg-muted/30 transition-colors cursor-pointer"
                                                onClick={() => setSelectedEntry(e)}
                                            >
                                                {/* Queue # */}
                                                <td className="px-6 py-4 font-mono font-bold text-terracotta">
                                                    #{e.queuePosition}
                                                </td>

                                                {/* Name & Role */}
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-foreground">{e.fullName}</div>
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border mt-1 ${badge.color}`}>
                                                        <RoleIcon className="w-3 h-3" />
                                                        <span>{badge.label}</span>
                                                    </span>
                                                </td>

                                                {/* Contact Info */}
                                                <td className="px-6 py-4 text-xs space-y-1">
                                                    <div className="flex items-center gap-1.5 text-foreground font-medium">
                                                        <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                                                        <span>{e.email}</span>
                                                    </div>
                                                    {e.phone && (
                                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                                            <Phone className="w-3.5 h-3.5" />
                                                            <span>{e.phone}</span>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Location */}
                                                <td className="px-6 py-4 text-xs">
                                                    <div className="flex items-start gap-1.5">
                                                        <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0 mt-0.5" />
                                                        <div>
                                                            {e.address?.line1 && <p className="font-medium text-foreground">{e.address.line1}</p>}
                                                            <p className="text-muted-foreground">
                                                                {[e.address?.city, e.address?.postalCode, e.address?.country || 'UK'].filter(Boolean).join(', ')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Key Details */}
                                                <td className="px-6 py-4 text-xs text-muted-foreground">
                                                    {e.metadata?.cuisine && <p className="font-medium text-foreground">🍳 {e.metadata.cuisine}</p>}
                                                    {e.metadata?.company_name && <p className="font-medium text-foreground">🏢 {e.metadata.company_name}</p>}
                                                    {e.metadata?.occasion && <p>🎉 {e.metadata.occasion}</p>}
                                                    {e.metadata?.notes && <p className="italic text-[11px] truncate max-w-xs">&quot;{e.metadata.notes}&quot;</p>}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={(ev) => {
                                                            ev.stopPropagation()
                                                            handleCopyEmail(e.email)
                                                        }}
                                                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors mr-1"
                                                        title="Copy Email"
                                                    >
                                                        {copiedEmail === e.email ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                                    </button>
                                                    <button
                                                        onClick={() => setSelectedEntry(e)}
                                                        className="px-3 py-1.5 rounded-lg bg-muted hover:bg-border text-xs font-bold transition-colors inline-flex items-center gap-1"
                                                    >
                                                        <span>View</span>
                                                        <ChevronRight className="w-3.5 h-3.5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Detailed Entry Modal Drawer */}
                {selectedEntry && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
                        <div className="bg-card border border-border rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
                            <div className="flex items-start justify-between">
                                <div>
                                    <span className="text-xs font-bold uppercase text-terracotta">Queue Position #{selectedEntry.queuePosition}</span>
                                    <h2 className="text-2xl font-serif font-bold text-foreground mt-0.5">{selectedEntry.fullName}</h2>
                                    <p className="text-xs text-muted-foreground">Joined on {new Date(selectedEntry.createdAt).toLocaleDateString()} at {new Date(selectedEntry.createdAt).toLocaleTimeString()}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedEntry(null)}
                                    className="p-2 rounded-full hover:bg-muted text-muted-foreground"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4 text-sm">
                                {/* Role & Referral */}
                                <div className="grid grid-cols-2 gap-3 p-4 bg-muted/40 rounded-2xl">
                                    <div>
                                        <span className="text-xs text-muted-foreground block">Applicant Role</span>
                                        <span className="font-bold capitalize">{selectedEntry.role}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-muted-foreground block">Referral Code</span>
                                        <span className="font-mono font-bold text-terracotta">{selectedEntry.referralCode}</span>
                                    </div>
                                </div>

                                {/* Contact Details */}
                                <div className="space-y-2 p-4 bg-muted/40 rounded-2xl">
                                    <span className="text-xs font-bold uppercase text-muted-foreground block mb-2">Contact Details</span>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground text-xs">Email:</span>
                                        <span className="font-medium">{selectedEntry.email}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground text-xs">Phone:</span>
                                        <span className="font-medium">{selectedEntry.phone || 'Not provided'}</span>
                                    </div>
                                </div>

                                {/* Address Details */}
                                <div className="space-y-2 p-4 bg-muted/40 rounded-2xl">
                                    <span className="text-xs font-bold uppercase text-muted-foreground block mb-2">Address & Location</span>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground text-xs">Street:</span>
                                        <span className="font-medium">{selectedEntry.address?.line1 || 'Not specified'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground text-xs">City:</span>
                                        <span className="font-medium">{selectedEntry.address?.city || 'Not specified'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground text-xs">Postal Code:</span>
                                        <span className="font-medium">{selectedEntry.address?.postalCode || 'Not specified'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground text-xs">Country:</span>
                                        <span className="font-medium">{selectedEntry.address?.country || 'United Kingdom'}</span>
                                    </div>
                                </div>

                                {/* Metadata & Role Preferences */}
                                {selectedEntry.metadata && Object.keys(selectedEntry.metadata).length > 0 && (
                                    <div className="p-4 bg-muted/40 rounded-2xl space-y-2">
                                        <span className="text-xs font-bold uppercase text-muted-foreground block mb-2">Preferences & Notes</span>
                                        {Object.entries(selectedEntry.metadata).map(([key, val]) => {
                                            if (!val) return null
                                            return (
                                                <div key={key} className="flex items-start justify-between gap-2 text-xs">
                                                    <span className="text-muted-foreground capitalize">{key.replace('_', ' ')}:</span>
                                                    <span className="font-medium text-right text-foreground">{String(val)}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setSelectedEntry(null)}
                                className="w-full py-3 gradient-brand text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
