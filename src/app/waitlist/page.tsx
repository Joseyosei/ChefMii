'use client'

import { useState, Suspense } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget'
import { WaitlistModal } from '@/components/waitlist/waitlist-modal'
import { Sparkles, ChefHat, Building2, Baby, GraduationCap, Utensils, ShieldCheck, Users, Trophy, Star, ArrowRight } from 'lucide-react'
import type { WaitlistRole } from '@/types/waitlist'

const ROLE_BENEFITS: Record<WaitlistRole, { title: string; desc: string; icon: React.ElementType; perks: string[] }> = {
    chef: {
        title: 'For Private Chefs',
        desc: 'Unlock direct access to high-paying client bookings, zero hidden middleman fees, and free promotional video hosting on ChefTV.',
        icon: ChefHat,
        perks: ['0% platform fee for first 3 months', 'Free verified chef badge', 'Priority listing in search results', 'Instant booking notifications']
    },
    business: {
        title: 'For Corporate & Businesses',
        desc: 'Streamline team meals, executive dining, and company event catering with exclusive bulk discounts and custom invoicing.',
        icon: Building2,
        perks: ['Dedicated corporate concierge', 'Custom corporate meal plans', 'Consolidated monthly invoicing', 'Multi-user team dashboard access']
    },
    kid: {
        title: 'For Kids & Families',
        desc: 'Gamified cooking challenges, XP rewards, collectible badges, and junior masterclasses designed for bonding and skill building.',
        icon: Baby,
        perks: ['Early access to Mini Chefs games', 'Free junior apron welcome pack', 'Parent-child co-cooking dashboard', 'Kids holiday camp discounts']
    },
    tutor: {
        title: 'For Academy Tutors',
        desc: 'Monetize your culinary expertise by building live cohort courses and on-demand video masterclasses on ChefMii Academy.',
        icon: GraduationCap,
        perks: ['75% revenue share on course sales', 'Production support for lessons', 'Custom student progress tracking', 'Featured tutor spot on homepage']
    },
    client: {
        title: 'For Food Lovers & Clients',
        desc: 'Hire top-rated local and international chefs for intimate home dinners, date nights, weddings, and celebrations.',
        icon: Utensils,
        perks: ['£50 voucher toward your first booking', 'Access to exclusive Michelin-starred chefs', 'Priority customer support 24/7', 'Invite to ChefMii VIP food tasting pop-ups']
    }
}

export default function WaitlistPage() {
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState<WaitlistRole>('chef')

    const openWaitlist = (role: WaitlistRole) => {
        setSelectedRole(role)
        setModalOpen(true)
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navbar />
            
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-20 pb-20 sm:pt-32 sm:pb-32 bg-[#0F0F0F] text-white overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-terracotta/20 via-transparent to-transparent opacity-60" />
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        
                        {/* Live counter badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md mb-8">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                            <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                                Join 2,480+ Members on the ChefMii Waitlist
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black mb-6 tracking-tight leading-[1.1]">
                            The Future of Private Dining <br />
                            <span className="gradient-text-brand">& Culinary Creation</span>
                        </h1>

                        <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
                            Whether you are a chef, a business, a parent, an academy tutor, or a food lover — reserve your priority VIP spot today.
                        </p>

                        {/* Role Buttons CTA */}
                        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
                            {(Object.keys(ROLE_BENEFITS) as WaitlistRole[]).map(roleKey => {
                                const roleData = ROLE_BENEFITS[roleKey]
                                const Icon = roleData.icon
                                return (
                                    <button
                                        key={roleKey}
                                        onClick={() => openWaitlist(roleKey)}
                                        className="flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-terracotta hover:bg-terracotta/20 transition-all text-sm font-bold text-white shadow-lg backdrop-blur-sm group"
                                    >
                                        <Icon className="w-4 h-4 text-terracotta group-hover:scale-110 transition-transform" />
                                        <span>Waitlist for {roleKey.charAt(0).toUpperCase() + roleKey.slice(1)}s</span>
                                        <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Role Benefits Grid */}
                <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-xs font-bold text-terracotta uppercase tracking-widest mb-2 block">Why Join Early?</span>
                        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-foreground mb-4">
                            Tailored Perks for Every Category
                        </h2>
                        <p className="text-muted-foreground text-base sm:text-lg">
                            We engineered ChefMii to deliver immense value across all 5 roles of our culinary ecosystem.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {(Object.keys(ROLE_BENEFITS) as WaitlistRole[]).map(roleKey => {
                            const b = ROLE_BENEFITS[roleKey]
                            const Icon = b.icon
                            return (
                                <div key={roleKey} className="bg-card border border-border rounded-3xl p-8 flex flex-col justify-between hover:shadow-xl hover:border-terracotta/40 transition-all group">
                                    <div>
                                        <div className="w-14 h-14 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <Icon className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-2xl font-serif font-bold mb-3">{b.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed mb-6">{b.desc}</p>
                                        
                                        <div className="space-y-2.5 pt-4 border-t border-border/60">
                                            {b.perks.map((p, idx) => (
                                                <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-foreground">
                                                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                                    <span>{p}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => openWaitlist(roleKey)}
                                        className="mt-8 w-full py-3 px-4 gradient-brand text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md"
                                    >
                                        Join as {roleKey.charAt(0).toUpperCase() + roleKey.slice(1)} <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* Live Social Proof Banner */}
                <section className="py-16 bg-muted/40 border-y border-border">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div>
                                <p className="text-3xl sm:text-4xl font-black font-serif text-terracotta mb-1">2,480+</p>
                                <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Registered Waitlist</p>
                            </div>
                            <div>
                                <p className="text-3xl sm:text-4xl font-black font-serif text-terracotta mb-1">5 Roles</p>
                                <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Dedicated Portals</p>
                            </div>
                            <div>
                                <p className="text-3xl sm:text-4xl font-black font-serif text-terracotta mb-1">45+ Cities</p>
                                <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Worldwide Reach</p>
                            </div>
                            <div>
                                <p className="text-3xl sm:text-4xl font-black font-serif text-terracotta mb-1">100% VIP</p>
                                <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Priority Invitations</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
            <ChatbotWidget />

            <WaitlistModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                defaultRole={selectedRole}
            />
        </div>
    )
}
