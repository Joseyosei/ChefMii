'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget'
import {
    LayoutDashboard, Calendar, FileText, Users, GraduationCap,
    Settings, LogOut, TrendingUp, DollarSign, CheckCircle,
    Download, Plus, ChevronRight, Bell, Building2, Loader2, Star
} from 'lucide-react'
import { useBusinessDashboardData, CorporateEvent } from '@/hooks/useBusinessDashboardData'

/* ── Types ─────────────────────────────────────────────── */
type InvoiceStatus = 'paid' | 'pending' | 'overdue'
interface Invoice { id: string; ref: string; event: string; date: string; amount: string; status: InvoiceStatus }
interface TeamMember { id: string; name: string; role: string; dept: string; training: number }

/* ── Mock data ─────────────────────────────────────────── */
// Temporary placeholders for incomplete sections
const INVOICES: Invoice[] = [
    { id: '1', ref: 'INV-2026-012', event: 'Q1 Leadership Summit', date: '1 Mar 2026', amount: '£8,400', status: 'pending' },
    { id: '2', ref: 'INV-2026-008', event: 'Annual Company Banquet', date: '15 Jan 2026', amount: '£42,000', status: 'paid' },
    { id: '3', ref: 'INV-2026-003', event: 'Xmas Party 2025', date: '20 Dec 2025', amount: '£12,300', status: 'paid' },
    { id: '4', ref: 'INV-2025-094', event: 'Board Retreat Catering', date: '5 Oct 2025', amount: '£6,750', status: 'overdue' },
]
const TEAM: TeamMember[] = [
    { id: '1', name: 'Sarah Mitchell', role: 'Head of Events', dept: 'Hospitality', training: 4 },
    { id: '2', name: 'David Okafor', role: 'Event Coordinator', dept: 'Hospitality', training: 2 },
    { id: '3', name: 'Linda Chen', role: 'Executive Assistant', dept: 'Admin', training: 6 },
    { id: '4', name: 'James Patel', role: 'F&B Manager', dept: 'Catering', training: 5 },
]
const COURSES = [
    { id: '1', title: 'Food Safety & Hygiene Level 2', staff: 3, progress: 80, due: '31 Mar 2026' },
    { id: '2', title: 'Event Planning Masterclass', staff: 2, progress: 45, due: '15 Apr 2026' },
    { id: '3', title: 'Allergen Awareness for Hospitality', staff: 4, progress: 100, due: 'Completed' },
]

const INV_STYLES: Record<InvoiceStatus, string> = {
    paid: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    overdue: 'bg-red-100 text-red-700',
}

const totalSpend = 69450
const thisMonth = 8400

const NAV = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'academy', label: 'Staff Training', icon: GraduationCap },
    { id: 'reviews', label: 'Reviews & Ratings', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
]

/* ── Sub-views ─────────────────────────────────────────── */
function OverviewView({ events }: { events: CorporateEvent[] }) {
    const activeEventsCount = events.filter(e => e.status !== 'completed').length
    const calculatedSpend = events.filter(e => e.status === 'completed').reduce((sum, e) => sum + Number(e.budget || 0), 0)
    return (
        <div className="space-y-8">
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: 'Total Spend 2026', value: `£${(calculatedSpend || totalSpend).toLocaleString()}`, sub: 'YTD', icon: DollarSign, color: 'text-terracotta' },
                    { label: 'This Month', value: `£${thisMonth.toLocaleString()}`, sub: '1 confirmed event', icon: TrendingUp, color: 'text-blue-500' },
                    { label: 'Active Events', value: activeEventsCount.toString(), sub: 'planned & confirmed', icon: Calendar, color: 'text-green-500' },
                    { label: 'Staff Enrolled', value: '9', sub: '3 courses active', icon: GraduationCap, color: 'text-purple-500' },
                ].map(({ label, value, sub, icon: Icon, color }) => (
                    <div key={label} className="bg-card border border-border rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"><Icon className={`w-4 h-4 ${color}`} /></div>
                        </div>
                        <p className={`text-3xl font-black ${color}`}>{value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
                    </div>
                ))}
            </div>

            {/* Upcoming events */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-bold">Upcoming Events</h2>
                    <button className="text-xs font-bold text-terracotta hover:underline flex items-center gap-1">+ Add Event</button>
                </div>
                {events.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">No corporate events listed.</div>
                ) : events.filter(e => e.status !== 'completed').slice(0, 3).map(ev => (
                    <div key={ev.id} className="px-6 py-4 border-b border-border last:border-0 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">{ev.name}</p>
                            <p className="text-xs text-muted-foreground">{new Date(ev.event_date).toLocaleDateString()} · {ev.guests} guests</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-terracotta">£{ev.budget}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ev.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{ev.status}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pending invoices */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border"><h2 className="font-bold">Outstanding Invoices</h2></div>
                {INVOICES.filter(i => i.status !== 'paid').map(inv => (
                    <div key={inv.id} className="px-6 py-4 border-b border-border last:border-0 flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-sm">{inv.ref}</p>
                            <p className="text-xs text-muted-foreground">{inv.event} · {inv.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <p className="font-bold">{inv.amount}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${INV_STYLES[inv.status]}`}>{inv.status}</span>
                            <button className="px-3 py-1.5 text-xs gradient-brand text-white rounded-lg font-bold hover:opacity-90">Pay Now</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function EventsView({ events }: { events: CorporateEvent[] }) {
    const [showNew, setShowNew] = useState(false)
    return (
        <div>
            <button onClick={() => setShowNew(!showNew)} className="mb-6 flex items-center gap-2 px-5 py-2.5 gradient-brand text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4" />New Event
            </button>
            {showNew && (
                <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                    <h2 className="font-bold text-lg mb-4">Create New Event</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[{ label: 'Event Name', placeholder: 'e.g. Q2 Product Launch' }, { label: 'Date', placeholder: 'DD/MM/YYYY' }, { label: 'Expected Guests', placeholder: 'e.g. 50' }, { label: 'Estimated Budget (£)', placeholder: 'e.g. 5000' }].map(f => (
                            <div key={f.label}>
                                <label className="block text-sm font-semibold mb-1.5">{f.label}</label>
                                <input placeholder={f.placeholder} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-terracotta" />
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button className="px-5 py-2.5 gradient-brand text-white text-sm font-bold rounded-xl hover:opacity-90">Create Event</button>
                        <button onClick={() => setShowNew(false)} className="px-5 py-2.5 border border-border rounded-xl text-sm hover:bg-muted transition-colors">Cancel</button>
                    </div>
                </div>
            )}
            <div className="space-y-4">
                {events.length === 0 ? (
                    <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground">
                        No corporate events planned yet.
                    </div>
                ) : events.map(ev => (
                    <div key={ev.id} className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-terracotta/10 flex items-center justify-center shrink-0">
                            <Calendar className="w-6 h-6 text-terracotta" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                <p className="font-bold">{ev.name}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ev.status === 'completed' ? 'bg-blue-100 text-blue-700' : ev.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{ev.status}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{new Date(ev.event_date).toLocaleDateString()} · {ev.guests} guests</p>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                            <p className="font-black text-lg text-terracotta">£{ev.budget}</p>
                            <button className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function InvoicesView() {
    return (
        <div>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-bold">Invoice History</h2>
                    <button className="text-xs border border-border px-3 py-1.5 rounded-lg hover:bg-muted transition-colors flex items-center gap-1"><Download className="w-3 h-3" />Export CSV</button>
                </div>
                <table className="w-full">
                    <thead className="bg-muted/50">
                        <tr>
                            {['Reference', 'Event', 'Date', 'Amount', 'Status', 'Action'].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {INVOICES.map(inv => (
                            <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3 text-sm font-mono font-semibold">{inv.ref}</td>
                                <td className="px-4 py-3 text-sm">{inv.event}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">{inv.date}</td>
                                <td className="px-4 py-3 text-sm font-bold">{inv.amount}</td>
                                <td className="px-4 py-3">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${INV_STYLES[inv.status]}`}>{inv.status}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <button className="flex items-center gap-1 text-xs text-terracotta hover:underline font-medium"><Download className="w-3 h-3" />PDF</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function TeamView() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground text-sm">{TEAM.length} team members</p>
                <button className="flex items-center gap-2 px-4 py-2 gradient-brand text-white text-sm font-bold rounded-xl hover:opacity-90"><Plus className="w-4 h-4" />Invite Member</button>
            </div>
            {TEAM.map(m => (
                <div key={m.id} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl gradient-brand text-white font-bold text-sm flex items-center justify-center shrink-0">{m.name.split(' ').map(w => w[0]).join('')}</div>
                    <div className="flex-1">
                        <p className="font-bold">{m.name}</p>
                        <p className="text-sm text-muted-foreground">{m.role} · {m.dept}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">Courses completed</p>
                        <p className="font-black text-xl gradient-text-brand">{m.training}</p>
                    </div>
                    <button className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"><Settings className="w-4 h-4 text-muted-foreground" /></button>
                </div>
            ))}
        </div>
    )
}

function AcademyView() {
    return (
        <div>
            <div className="bg-terracotta/10 border border-terracotta/20 rounded-2xl p-5 mb-8 flex items-center gap-4">
                <GraduationCap className="w-8 h-8 text-terracotta shrink-0" />
                <div>
                    <p className="font-bold">ChefMii Academy for Teams</p>
                    <p className="text-sm text-muted-foreground">Upskill your hospitality and events team with expert-led online courses.</p>
                </div>
                <Link href="/academy" className="shrink-0 px-4 py-2 gradient-brand text-white text-sm font-bold rounded-xl hover:opacity-90">Browse Courses</Link>
            </div>
            <h2 className="font-bold text-lg mb-4">Active Training Programmes</h2>
            <div className="space-y-4">
                {COURSES.map(c => (
                    <div key={c.id} className="bg-card border border-border rounded-2xl p-5">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <p className="font-bold">{c.title}</p>
                                <p className="text-sm text-muted-foreground">{c.staff} staff enrolled · Due: {c.due}</p>
                            </div>
                            <span className={`text-sm font-black ${c.progress === 100 ? 'text-green-500' : 'text-terracotta'}`}>{c.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                            <div className={`h-2 rounded-full transition-all ${c.progress === 100 ? 'bg-green-500' : 'gradient-brand'}`} style={{ width: `${c.progress}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function SettingsView() {
    const [saved, setSaved] = useState(false)
    const [companyName, setCompanyName] = useState('Apex Enterprises Ltd')
    const [industry, setIndustry] = useState('Financial Services')
    const [billingEmail, setBillingEmail] = useState('finance@apex.com')
    const [vatNumber, setVatNumber] = useState('GB123456789')

    // Bank & Stripe state
    const [bankName, setBankName] = useState('HSBC Commercial Banking UK')
    const [accountHolder, setAccountHolder] = useState('Apex Enterprises Ltd Treasury')
    const [sortCode, setSortCode] = useState('40-05-15')
    const [accountNumber, setAccountNumber] = useState('98314201')
    const [showBankModal, setShowBankModal] = useState(false)
    const [showCardModal, setShowCardModal] = useState(false)
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    const [paymentMethods, setPaymentMethods] = useState([
        { id: 'pm-1', brand: 'Visa Corporate', last4: '7123', exp: '09/27', isDefault: true },
        { id: 'pm-2', brand: 'Mastercard Enterprise', last4: '4091', exp: '12/28', isDefault: false },
    ])

    const handleSaveProfile = () => {
        setSaved(true)
        setToastMessage('Company profile and tax invoicing details saved.')
        setTimeout(() => { setSaved(false); setToastMessage(null) }, 3000)
    }

    const handleSaveBank = (e: React.FormEvent) => {
        e.preventDefault()
        setShowBankModal(false)
        setToastMessage('Corporate bank account successfully linked and verified.')
        setTimeout(() => setToastMessage(null), 4000)
    }

    return (
        <div className="max-w-4xl space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-foreground">Company & Financial Settings</h2>
                <p className="text-xs text-muted-foreground mt-1">Manage corporate billing, Stripe account, business bank deposits, and automated invoicing.</p>
            </div>

            {toastMessage && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-700 dark:text-emerald-300 text-xs font-bold animate-in fade-in">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{toastMessage}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Stripe & Corporate Payment Methods */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg gradient-brand text-white flex items-center justify-center font-bold text-xs">
                                    S
                                </div>
                                <h3 className="font-bold text-base text-foreground">Corporate Stripe Billing</h3>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase">
                                Stripe Active
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Used for instant multi-chef bookings, summit banquets, and automated escrow deposits.
                        </p>

                        <div className="mt-4 space-y-2">
                            {paymentMethods.map(pm => (
                                <div key={pm.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border/50 text-xs">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-5 rounded bg-stone-200 dark:bg-stone-700 flex items-center justify-center font-bold text-[9px]">
                                            💳
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">{pm.brand} •••• {pm.last4}</p>
                                            <p className="text-[10px] text-muted-foreground">Expires {pm.exp}</p>
                                        </div>
                                    </div>
                                    {pm.isDefault && (
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                                            Default
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => setShowCardModal(true)}
                        className="w-full py-2.5 px-4 gradient-brand text-white font-bold rounded-xl text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-sm"
                    >
                        <span>+ Link New Stripe Corporate Card / Account</span>
                    </button>
                </div>

                {/* 2. Business Bank Account */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 text-foreground flex items-center justify-center font-bold text-xs">
                                    🏦
                                </div>
                                <h3 className="font-bold text-base text-foreground">Linked Corporate Bank</h3>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase">
                                Verified
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Bank account used for BACS direct invoice debits, event security deposit returns, and treasury reconciliation.
                        </p>

                        <div className="mt-4 p-3 bg-muted/50 rounded-xl space-y-1.5 border border-border/50 text-xs">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Bank Name</span>
                                <span className="text-foreground font-semibold">{bankName}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Treasury Holder</span>
                                <span className="text-foreground font-semibold">{accountHolder}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Sort Code</span>
                                <span className="font-mono text-foreground font-semibold">{sortCode}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Account Number</span>
                                <span className="font-mono text-foreground font-semibold">•••• {accountNumber.slice(-4)}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowBankModal(true)}
                        className="w-full py-2.5 px-4 border border-border bg-card hover:bg-muted font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 text-foreground"
                    >
                        <span>Change Corporate Bank Account ⚙️</span>
                    </button>
                </div>
            </div>

            {/* 3. Company Profile & VAT Registration */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-foreground">Company Details & VAT Invoicing</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                        <label className="block font-bold text-muted-foreground uppercase mb-1">Company Registered Name</label>
                        <input
                            type="text"
                            value={companyName}
                            onChange={e => setCompanyName(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-terracotta"
                        />
                    </div>
                    <div>
                        <label className="block font-bold text-muted-foreground uppercase mb-1">Industry Sector</label>
                        <input
                            type="text"
                            value={industry}
                            onChange={e => setIndustry(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-terracotta"
                        />
                    </div>
                    <div>
                        <label className="block font-bold text-muted-foreground uppercase mb-1">Billing & Accounts Email</label>
                        <input
                            type="email"
                            value={billingEmail}
                            onChange={e => setBillingEmail(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-terracotta"
                        />
                    </div>
                    <div>
                        <label className="block font-bold text-muted-foreground uppercase mb-1">VAT / Tax Identification Number</label>
                        <input
                            type="text"
                            value={vatNumber}
                            onChange={e => setVatNumber(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-terracotta font-mono"
                        />
                    </div>
                </div>
                <div className="pt-2 flex justify-end">
                    <button
                        onClick={handleSaveProfile}
                        className="px-6 py-2.5 gradient-brand text-white font-bold rounded-xl text-xs hover:opacity-90 transition-opacity shadow-sm"
                    >
                        {saved ? '✓ Saved!' : 'Save Company Details'}
                    </button>
                </div>
            </div>

            {/* Bank Modal */}
            {showBankModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-card border border-border rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h3 className="font-bold text-base text-foreground">Link Business Bank Account</h3>
                            <button onClick={() => setShowBankModal(false)} className="text-muted-foreground hover:text-foreground text-sm font-bold">✕</button>
                        </div>
                        <form onSubmit={handleSaveBank} className="space-y-3.5 text-xs">
                            <div>
                                <label className="block font-bold text-muted-foreground uppercase mb-1">Bank Name *</label>
                                <select
                                    value={bankName}
                                    onChange={e => setBankName(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none text-xs"
                                >
                                    <option value="HSBC Commercial Banking UK">HSBC Commercial Banking UK</option>
                                    <option value="Barclays Corporate">Barclays Corporate</option>
                                    <option value="Lloyds Commercial Banking">Lloyds Commercial Banking</option>
                                    <option value="NatWest Commercial">NatWest Commercial</option>
                                    <option value="JPMorgan Chase Commercial">JPMorgan Chase Commercial</option>
                                    <option value="Citibank Corporate">Citibank Corporate</option>
                                </select>
                            </div>
                            <div>
                                <label className="block font-bold text-muted-foreground uppercase mb-1">Company Treasury Account Name *</label>
                                <input
                                    type="text"
                                    value={accountHolder}
                                    onChange={e => setAccountHolder(e.target.value)}
                                    required
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none text-xs"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-muted-foreground uppercase mb-1">Sort Code *</label>
                                    <input
                                        type="text"
                                        value={sortCode}
                                        onChange={e => setSortCode(e.target.value)}
                                        placeholder="40-05-15"
                                        required
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none font-mono text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-muted-foreground uppercase mb-1">Account Number *</label>
                                    <input
                                        type="text"
                                        value={accountNumber}
                                        onChange={e => setAccountNumber(e.target.value)}
                                        placeholder="98314201"
                                        required
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none font-mono text-xs"
                                    />
                                </div>
                            </div>
                            <div className="pt-2 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowBankModal(false)}
                                    className="flex-1 py-2.5 border border-border rounded-xl font-bold text-muted-foreground hover:text-foreground text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 gradient-brand text-white font-bold rounded-xl text-xs hover:opacity-90 shadow-md"
                                >
                                    Save Corporate Bank →
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Card Modal */}
            {showCardModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-card border border-border rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h3 className="font-bold text-base text-foreground">Link Corporate Payment Card</h3>
                            <button onClick={() => setShowCardModal(false)} className="text-muted-foreground hover:text-foreground text-sm font-bold">✕</button>
                        </div>
                        <div className="space-y-3.5 text-xs">
                            <div>
                                <label className="block font-bold text-muted-foreground uppercase mb-1">Cardholder Full Name</label>
                                <input
                                    type="text"
                                    defaultValue="Apex Enterprises Ltd"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none text-xs"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-muted-foreground uppercase mb-1">Card Number</label>
                                <input
                                    type="text"
                                    placeholder="4000 1234 5678 9010"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none font-mono text-xs"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-muted-foreground uppercase mb-1">Expiry Date</label>
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none font-mono text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-muted-foreground uppercase mb-1">CVC / CVV</label>
                                    <input
                                        type="password"
                                        placeholder="•••"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none font-mono text-xs"
                                    />
                                </div>
                            </div>
                            <div className="pt-2 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCardModal(false)}
                                    className="flex-1 py-2.5 border border-border rounded-xl font-bold text-muted-foreground hover:text-foreground text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCardModal(false)
                                        setToastMessage('Corporate card successfully linked with Stripe 3D-Secure verification.')
                                        setTimeout(() => setToastMessage(null), 4000)
                                    }}
                                    className="flex-1 py-2.5 gradient-brand text-white font-bold rounded-xl text-xs hover:opacity-90 shadow-md"
                                >
                                    Verify & Link with Stripe →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function BusinessReviewsView() {
    return (
        <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold font-serif text-foreground">Corporate Catering Reviews & Feedback</h2>
                    <p className="text-xs text-muted-foreground mt-1">Submit feedback on corporate dining events, executive retreats, and team lunch stipends.</p>
                </div>
                <Link
                    href="/reviews"
                    className="px-5 py-2.5 gradient-brand text-white text-xs font-bold rounded-xl shadow-xs hover:opacity-90 transition-opacity shrink-0 flex items-center gap-1.5"
                >
                    <Star className="w-3.5 h-3.5 fill-white" />
                    Write Corporate Review →
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                    <span className="text-xs font-bold text-terracotta uppercase">Executive Quality Assurance</span>
                    <h3 className="font-bold text-base text-foreground">Enterprise Rating System</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Your corporate ratings directly impact which Master Chefs are prioritized for VIP summit banquets and recurring team meal deliveries.
                    </p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                    <span className="text-xs font-bold text-blue-600 uppercase">VAT & Escrow Verified</span>
                    <h3 className="font-bold text-base text-foreground">Official Corporate Endorsements</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Reviews submitted from this corporate dashboard receive the verified &ldquo;Corporate Event Organizer&rdquo; badge on the ChefMii public platform.
                    </p>
                </div>
            </div>
        </div>
    )
}

/* ── Page ──────────────────────────────────────────────── */
export default function BusinessDashboardPage() {
    const [tab, setTab] = useState('overview')
    const { events, loading, error } = useBusinessDashboardData()

    const titles: Record<string, string> = {
        overview: 'Good morning, Apex Team! 🏢',
        events: 'Event Management',
        invoices: 'Invoice History',
        team: 'Team Management',
        academy: 'Staff Training',
        reviews: 'Corporate Reviews & Ratings',
        settings: 'Company Settings',
    }
    return (
        <>
            <Navbar />
            <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
                {/* Sidebar */}
                <aside className="w-64 border-r border-border bg-card flex-col hidden md:flex shrink-0">
                    <div className="p-5 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-foreground text-background font-black flex items-center justify-center text-sm"><Building2 className="w-5 h-5" /></div>
                            <div>
                                <p className="font-bold text-sm">Apex Enterprises</p>
                                <p className="text-xs text-muted-foreground">Enterprise Account</p>
                            </div>
                        </div>
                    </div>
                    <nav className="flex-1 p-3 space-y-0.5">
                        {NAV.map(({ id, label, icon: Icon }) => (
                            <button key={id} onClick={() => setTab(id)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${tab === id ? 'gradient-brand text-white' : 'text-foreground/70 hover:bg-muted hover:text-foreground'}`}>
                                <Icon className="w-4 h-4" />{label}
                                {id === 'invoices' && <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">1</span>}
                            </button>
                        ))}
                    </nav>
                    <div className="p-3 border-t border-border">
                        <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted transition-colors">
                            <LogOut className="w-4 h-4" />Sign Out
                        </Link>
                    </div>
                </aside>

                {/* Main */}
                <main className="flex-1 overflow-y-auto">
                    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold">{titles[tab]}</h1>
                            <p className="text-xs text-muted-foreground">Friday, 6 March 2026</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                                <Bell className="w-5 h-5 text-muted-foreground" />
                                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                            </button>
                            <div className="w-8 h-8 rounded-full bg-foreground text-background font-bold text-xs flex items-center justify-center"><Building2 className="w-4 h-4" /></div>
                        </div>
                    </div>
                    <div className="p-6">
                        {loading ? (
                            <div className="h-64 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
                            </div>
                        ) : error ? (
                            <div className="p-6 text-red-500 font-bold text-center">Failed to load business data: {error.message}</div>
                        ) : (
                            <>
                                {tab === 'overview' && <OverviewView events={events} />}
                                {tab === 'events' && <EventsView events={events} />}
                                {tab === 'invoices' && <InvoicesView />}
                                {tab === 'team' && <TeamView />}
                                {tab === 'academy' && <AcademyView />}
                                {tab === 'reviews' && <BusinessReviewsView />}
                                {tab === 'settings' && <SettingsView />}
                            </>
                        )}
                    </div>
                </main>
            </div>
            <ChatbotWidget />
        </>
    )
}
