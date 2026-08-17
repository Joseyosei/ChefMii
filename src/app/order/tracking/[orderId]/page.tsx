'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import {
    MapPin,
    Phone,
    MessageCircle,
    Clock,
    CheckCircle,
    Truck,
    Home,
    ChefHat,
    Navigation,
    Compass,
    Layers,
    ZoomIn,
    ZoomOut,
    ShieldCheck,
    Send,
    X,
    Star,
    Sparkles,
    ArrowLeft
} from 'lucide-react'

// Waypoint coordinates representing road path from Mayfair Kitchen (top right) to Oxford Street (bottom left)
const ROUTE_WAYPOINTS = [
    { x: 720, y: 140, heading: 210, speed: 22, street: 'Davies Street' },
    { x: 640, y: 190, heading: 225, speed: 28, street: 'Berkeley Square' },
    { x: 550, y: 240, heading: 240, speed: 30, street: 'Curzon Street' },
    { x: 460, y: 280, heading: 270, speed: 26, street: 'Park Lane' },
    { x: 380, y: 320, heading: 300, speed: 24, street: 'Marble Arch' },
    { x: 300, y: 350, heading: 320, speed: 20, street: 'Oxford Street West' },
    { x: 230, y: 375, heading: 340, speed: 15, street: 'Oxford Street (Approaching 123)' },
]

export default function OrderTrackingPage() {
    const params = useParams()
    const orderId = typeof params.orderId === 'string' ? params.orderId : 'ORD-8921'

    const [currentStepIndex, setCurrentStepIndex] = useState(3) // 3 = Driver on the way
    const [waypointIndex, setWaypointIndex] = useState(1)
    const [driverPos, setDriverPos] = useState({ x: 640, y: 190, heading: 225, speed: 28, street: 'Berkeley Square' })
    const [etaMinutes, setEtaMinutes] = useState(12)
    const [mapTheme, setMapTheme] = useState<'standard' | 'dark' | 'satellite'>('standard')
    const [zoomLevel, setZoomLevel] = useState(1)
    const [chatOpen, setChatOpen] = useState(false)
    const [chatMessages, setChatMessages] = useState<Array<{ sender: 'driver' | 'user'; text: string; time: string }>>([
        { sender: 'driver', text: "Hi! I just picked up your gourmet order from Chef Marco. Hot and safely packed. On my way now!", time: '2 mins ago' },
    ])
    const [chatInput, setChatInput] = useState('')
    const [selectedTip, setSelectedTip] = useState<number | null>(3)

    // Simulate real-time smooth GPS vehicle motion along waypoints
    useEffect(() => {
        const interval = setInterval(() => {
            setWaypointIndex((prevIdx) => {
                const nextIdx = (prevIdx + 1) % ROUTE_WAYPOINTS.length
                const wp = ROUTE_WAYPOINTS[nextIdx]
                setDriverPos(wp)
                setEtaMinutes((prev) => (prev > 2 ? prev - 1 : 2))
                return nextIdx
            })
        }, 4000)

        return () => clearInterval(interval)
    }, [])

    const handleSendChat = (e: React.FormEvent) => {
        e.preventDefault()
        if (!chatInput.trim()) return
        const newMsg = { sender: 'user' as const, text: chatInput.trim(), time: 'Just now' }
        setChatMessages((prev) => [...prev, newMsg])
        setChatInput('')

        // Simulate driver quick confirmation
        setTimeout(() => {
            setChatMessages((prev) => [
                ...prev,
                { sender: 'driver', text: "Got it! See you in just a few minutes 👍", time: 'Just now' }
            ])
        }, 1500)
    }

    const steps = [
        { title: 'Order Confirmed', desc: 'Chef Marco accepted order', time: '18:40', done: true },
        { title: 'Chef Cooking', desc: 'Freshly prepared & boxed hot', time: '18:52', done: true },
        { title: 'Picked Up by Driver', desc: 'Driver Ahmed collected food', time: '19:04', done: true },
        { title: 'Driver On The Way', desc: 'Live GPS navigation active', time: '19:08', done: true, current: true },
        { title: 'Arriving at Destination', desc: '123 Oxford Street, London', time: 'Est. 19:20', done: false },
    ]

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-stone-50 dark:bg-stone-950 pb-24">
                {/* Top Navigation Bar */}
                <div className="bg-white dark:bg-stone-900 border-b border-border shadow-xs">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                        <Link
                            href="/order"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Order Hub
                        </Link>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                Live GPS Tracking
                            </span>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
                    {/* Hero ETA Header */}
                    <div className="bg-white dark:bg-stone-900 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 bg-terracotta/10 text-terracotta font-bold text-xs rounded-full">
                                    Order #{orderId.slice(-6).toUpperCase()}
                                </span>
                                <span className="text-xs text-muted-foreground">• Trattoria di Marco</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
                                Arriving in <span className="text-terracotta">{etaMinutes} mins</span>
                            </h1>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                <Navigation className="w-4 h-4 text-emerald-500 shrink-0" />
                                Driver is on <span className="font-semibold text-foreground">{driverPos.street}</span> ({driverPos.speed} mph)
                            </p>
                        </div>

                        {/* Progress Bar Ribbon */}
                        <div className="w-full md:w-80 bg-stone-100 dark:bg-stone-800 rounded-2xl p-4 border border-border">
                            <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-terracotta">Driver on way</span>
                                <span className="text-muted-foreground">75% Complete</span>
                            </div>
                            <div className="w-full h-2.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-terracotta to-emerald-500 w-3/4 rounded-full transition-all duration-1000" />
                            </div>
                        </div>
                    </div>

                    {/* Main Grid: Map (Left) + Driver / Order Info (Right) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Interactive Uber-Style Live Map (Left 8 Cols) */}
                        <div className="lg:col-span-8 bg-white dark:bg-stone-900 border border-border/80 rounded-3xl overflow-hidden shadow-lg flex flex-col">
                            {/* Map Canvas Header Controls */}
                            <div className="bg-stone-100/90 dark:bg-stone-800/90 px-4 py-3 border-b border-border flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <Compass className="w-4 h-4 text-terracotta animate-spin" style={{ animationDuration: '10s' }} />
                                    <span className="font-bold text-foreground">London Metro Dispatch Grid</span>
                                    <span className="text-muted-foreground hidden sm:inline">• Live Satellite Feeds</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex bg-white dark:bg-stone-900 rounded-lg p-0.5 border border-border">
                                        {(['standard', 'dark', 'satellite'] as const).map((mode) => (
                                            <button
                                                key={mode}
                                                onClick={() => setMapTheme(mode)}
                                                className={`px-2 py-1 rounded text-[11px] font-bold capitalize transition-all ${
                                                    mapTheme === mode
                                                        ? 'bg-terracotta text-white'
                                                        : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                            >
                                                {mode}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                                            className="p-1 bg-white dark:bg-stone-900 rounded border border-border hover:bg-stone-200"
                                            title="Zoom in"
                                        >
                                            <ZoomIn className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
                                            className="p-1 bg-white dark:bg-stone-900 rounded border border-border hover:bg-stone-200"
                                            title="Zoom out"
                                        >
                                            <ZoomOut className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Animated SVG Map Container */}
                            <div className={`relative h-[460px] sm:h-[520px] w-full overflow-hidden ${
                                mapTheme === 'dark' ? 'bg-[#12161f]' : mapTheme === 'satellite' ? 'bg-[#1c241d]' : 'bg-[#eef2f5]'
                            }`}>
                                <svg
                                    className="w-full h-full transition-transform duration-500"
                                    viewBox="0 0 900 550"
                                    style={{ transform: `scale(${zoomLevel})` }}
                                >
                                    {/* Map Grid / River Thames & Green Parks */}
                                    <path
                                        d="M 0,460 Q 300,420 500,470 T 900,430 L 900,550 L 0,550 Z"
                                        fill={mapTheme === 'dark' ? '#0d1d2d' : mapTheme === 'satellite' ? '#142c33' : '#cbdbe8'}
                                    />
                                    {/* Hyde Park Greenery */}
                                    <rect
                                        x="40"
                                        y="40"
                                        width="180"
                                        height="200"
                                        rx="30"
                                        fill={mapTheme === 'dark' ? '#1a2e22' : mapTheme === 'satellite' ? '#223c27' : '#d8ecd9'}
                                    />
                                    <text x="70" y="140" fill={mapTheme === 'dark' ? '#3d6349' : '#5b8264'} fontSize="12" fontWeight="bold">
                                        HYDE PARK
                                    </text>

                                    {/* Major City Streets Network */}
                                    <line x1="50" y1="360" x2="850" y2="360" stroke={mapTheme === 'dark' ? '#263147' : '#ffffff'} strokeWidth="14" />
                                    <line x1="50" y1="360" x2="850" y2="360" stroke={mapTheme === 'dark' ? '#1a2233' : '#e2e8f0'} strokeWidth="10" />

                                    <line x1="300" y1="50" x2="300" y2="500" stroke={mapTheme === 'dark' ? '#263147' : '#ffffff'} strokeWidth="12" />
                                    <line x1="500" y1="50" x2="500" y2="500" stroke={mapTheme === 'dark' ? '#263147' : '#ffffff'} strokeWidth="12" />
                                    <line x1="700" y1="50" x2="700" y2="500" stroke={mapTheme === 'dark' ? '#263147' : '#ffffff'} strokeWidth="12" />

                                    <line x1="50" y1="180" x2="850" y2="180" stroke={mapTheme === 'dark' ? '#263147' : '#ffffff'} strokeWidth="10" />
                                    <line x1="50" y1="260" x2="850" y2="260" stroke={mapTheme === 'dark' ? '#263147' : '#ffffff'} strokeWidth="10" />

                                    {/* Active Delivery Route Polyline */}
                                    <polyline
                                        points="720,140 640,190 550,240 460,280 380,320 300,350 230,375"
                                        fill="none"
                                        stroke="#FF5A36"
                                        strokeWidth="5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    {/* Glowing Route Pulse */}
                                    <polyline
                                        points="720,140 640,190 550,240 460,280 380,320 300,350 230,375"
                                        fill="none"
                                        stroke="#FF5A36"
                                        strokeWidth="12"
                                        strokeOpacity="0.25"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />

                                    {/* 1. Chef's Restaurant Pin (Start: 720, 140) */}
                                    <g transform="translate(720, 140)">
                                        <circle r="22" fill="#FF5A36" fillOpacity="0.2" className="animate-ping" />
                                        <circle r="14" fill="#FF5A36" stroke="#ffffff" strokeWidth="2.5" />
                                        <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">🍳</text>
                                        {/* Tag */}
                                        <rect x="-65" y="-36" width="130" height="22" rx="6" fill="#1c1917" fillOpacity="0.9" />
                                        <text x="0" y="-22" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Trattoria di Marco</text>
                                    </g>

                                    {/* 2. Customer Destination Pin (End: 230, 375) */}
                                    <g transform="translate(230, 375)">
                                        <circle r="24" fill="#10B981" fillOpacity="0.25" className="animate-pulse" />
                                        <circle r="15" fill="#10B981" stroke="#ffffff" strokeWidth="2.5" />
                                        <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="11">🏠</text>
                                        {/* Tag */}
                                        <rect x="-70" y="24" width="140" height="22" rx="6" fill="#10b981" />
                                        <text x="0" y="38" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">123 Oxford Street (You)</text>
                                    </g>

                                    {/* 3. Real-Time Animated Delivery Vehicle Marker (driverPos.x, driverPos.y) */}
                                    <g
                                        transform={`translate(${driverPos.x}, ${driverPos.y})`}
                                        className="transition-all duration-1000 ease-linear"
                                    >
                                        {/* Radar Beam */}
                                        <circle r="28" fill="#FF5A36" fillOpacity="0.2" className="animate-ping" />
                                        {/* Vehicle Base */}
                                        <circle r="18" fill="#111827" stroke="#ffffff" strokeWidth="3" className="drop-shadow-md" />
                                        <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="12">🚗</text>
                                        {/* Direction arrow */}
                                        <polygon
                                            points="0,-24 -5,-18 5,-18"
                                            fill="#FF5A36"
                                            transform={`rotate(${driverPos.heading})`}
                                        />
                                        {/* Live Speed Tag */}
                                        <rect x="-45" y="-46" width="90" height="20" rx="5" fill="#FF5A36" />
                                        <text x="0" y="-33" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                                            Driver Ahmed • {driverPos.speed} mph
                                        </text>
                                    </g>
                                </svg>

                                {/* Floating Live GPS Telemetry Badge */}
                                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white p-3 rounded-2xl border border-white/10 text-xs space-y-1 shadow-lg">
                                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                        GPS Telemetry Connected
                                    </div>
                                    <p className="text-[11px] text-white/70">
                                        Next Turn: Left on Oxford St in 200m
                                    </p>
                                </div>

                                {/* Floating Quick Action Buttons */}
                                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                                    <button
                                        onClick={() => setDriverPos(ROUTE_WAYPOINTS[waypointIndex])}
                                        className="px-3 py-1.5 bg-white dark:bg-stone-900 text-foreground font-bold text-xs rounded-xl shadow-lg border border-border hover:bg-stone-100 flex items-center gap-1.5"
                                    >
                                        <Navigation className="w-3.5 h-3.5 text-terracotta" />
                                        Center Driver
                                    </button>
                                </div>
                            </div>

                            {/* Driver Profile Bar (Uber-style) */}
                            <div className="bg-white dark:bg-stone-900 p-4 sm:p-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-border shrink-0 shadow-md">
                                        <Image
                                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                                            alt="Driver Ahmed Hassan"
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-base text-foreground">Ahmed Hassan</h3>
                                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded text-[11px] font-bold">
                                                ★ 4.98 (1,420 Deliveries)
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            🚗 Blue Honda Civic • License Plate: <span className="font-bold text-foreground">LJ19 ABC</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <button
                                        onClick={() => setChatOpen(true)}
                                        className="flex-1 sm:flex-none px-4 py-2.5 bg-stone-100 dark:bg-stone-800 text-foreground hover:bg-stone-200 font-bold text-xs rounded-xl border border-border flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <MessageCircle className="w-4 h-4 text-terracotta" />
                                        Message Driver
                                    </button>
                                    <a
                                        href="tel:+442079460912"
                                        className="px-4 py-2.5 gradient-brand text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-opacity"
                                    >
                                        <Phone className="w-4 h-4" />
                                        Call Driver
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Order Timeline & Receipt (Right 4 Cols) */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Order Status Stepper */}
                            <div className="bg-white dark:bg-stone-900 border border-border/80 rounded-3xl p-6 shadow-sm space-y-6">
                                <h3 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-terracotta" />
                                    Live Order Timeline
                                </h3>

                                <div className="space-y-4">
                                    {steps.map((step, idx) => (
                                        <div key={idx} className="flex gap-3 relative">
                                            {/* Step connector line */}
                                            {idx < steps.length - 1 && (
                                                <div
                                                    className={`absolute left-3.5 top-7 bottom-0 w-0.5 ${
                                                        step.done ? 'bg-terracotta' : 'bg-stone-200 dark:bg-stone-800'
                                                    }`}
                                                />
                                            )}
                                            {/* Icon circle */}
                                            <div
                                                className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                                                    step.current
                                                        ? 'bg-terracotta text-white ring-4 ring-terracotta/20 animate-pulse'
                                                        : step.done
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-stone-200 dark:bg-stone-800 text-muted-foreground'
                                                }`}
                                            >
                                                {step.done ? '✓' : idx + 1}
                                            </div>
                                            {/* Step details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h4 className={`text-xs font-bold ${step.current ? 'text-terracotta' : 'text-foreground'}`}>
                                                        {step.title}
                                                    </h4>
                                                    <span className="text-[11px] text-muted-foreground">{step.time}</span>
                                                </div>
                                                <p className="text-[11px] text-muted-foreground mt-0.5">{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Itemized Receipt with 100% Escrow Protection */}
                            <div className="bg-white dark:bg-stone-900 border border-border/80 rounded-3xl p-6 shadow-sm space-y-4">
                                <h3 className="font-serif font-bold text-base text-foreground">
                                    Order Summary
                                </h3>

                                <div className="space-y-2 text-xs divide-y divide-border/40">
                                    <div className="flex justify-between py-1.5">
                                        <span className="font-medium text-foreground">Handmade Black Truffle Tagliatelle x2</span>
                                        <span className="font-bold text-foreground">£37.00</span>
                                    </div>
                                    <div className="flex justify-between py-1.5">
                                        <span className="font-medium text-foreground">Truffle Risotto with Aged Parmigiano x1</span>
                                        <span className="font-bold text-foreground">£22.00</span>
                                    </div>
                                    <div className="flex justify-between py-1.5 text-muted-foreground">
                                        <span>Gourmet Delivery Fee</span>
                                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</span>
                                    </div>
                                    <div className="flex justify-between py-1.5 text-muted-foreground">
                                        <span>Packaging & Temp Control</span>
                                        <span>£1.50</span>
                                    </div>
                                    <div className="flex justify-between pt-2 text-sm font-bold text-foreground">
                                        <span>Total (Escrow Protected)</span>
                                        <span className="text-terracotta text-base">£60.50</span>
                                    </div>
                                </div>

                                {/* Escrow Guarantee Badge */}
                                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                                    <span><strong>100% Escrow Protection:</strong> Funds released to the chef only after successful delivery confirmation.</span>
                                </div>

                                {/* Driver Tip Selector */}
                                <div className="pt-2">
                                    <p className="text-xs font-bold text-foreground mb-2">Tip Driver Ahmed:</p>
                                    <div className="grid grid-cols-4 gap-1.5">
                                        {[2, 3, 5, 10].map((tip) => (
                                            <button
                                                key={tip}
                                                onClick={() => setSelectedTip(selectedTip === tip ? null : tip)}
                                                className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                                                    selectedTip === tip
                                                        ? 'bg-terracotta text-white border-terracotta'
                                                        : 'bg-stone-100 dark:bg-stone-800 text-foreground border-border hover:border-terracotta'
                                                }`}
                                            >
                                                £{tip}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* In-App Live Driver Chat Modal */}
                {chatOpen && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-border flex flex-col h-[500px]">
                            {/* Modal Header */}
                            <div className="gradient-brand p-4 text-white flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/30">
                                        <Image
                                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                                            alt="Driver"
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Driver Ahmed Hassan</p>
                                        <p className="text-[11px] text-white/80">Active on delivery route</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setChatOpen(false)}
                                    className="p-1 rounded-full hover:bg-white/20"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Chat Stream */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {chatMessages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                                                msg.sender === 'user'
                                                    ? 'gradient-brand text-white rounded-tr-xs'
                                                    : 'bg-stone-100 dark:bg-stone-800 text-foreground rounded-tl-xs'
                                            }`}
                                        >
                                            {msg.text}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground mt-0.5 px-1">{msg.time}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Chat Input */}
                            <form onSubmit={handleSendChat} className="p-3 border-t border-border flex gap-2">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="Message driver (e.g. buzzer code)..."
                                    className="flex-1 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-foreground text-xs outline-none focus:ring-2 focus:ring-terracotta/40"
                                />
                                <button
                                    type="submit"
                                    disabled={!chatInput.trim()}
                                    className="p-2 gradient-brand text-white rounded-xl disabled:opacity-40"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    )
}
