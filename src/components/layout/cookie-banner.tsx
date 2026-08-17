'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie, ShieldCheck, X, ChevronRight, Settings } from 'lucide-react'

export function CookieBanner() {
    const [mounted, setMounted] = useState(false)
    const [visible, setVisible] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [prefs, setPrefs] = useState({
        essential: true, // Always true
        analytics: true,
        personalization: true,
        marketing: false,
    })

    useEffect(() => {
        setMounted(true)
        const consent = localStorage.getItem('chefmii_cookie_consent')
        if (!consent) {
            const timer = setTimeout(() => setVisible(true), 800)
            return () => clearTimeout(timer)
        }
    }, [])

    if (!mounted || !visible) return null

    const handleAcceptAll = () => {
        const fullConsent = { essential: true, analytics: true, personalization: true, marketing: true, date: new Date().toISOString() }
        localStorage.setItem('chefmii_cookie_consent', JSON.stringify(fullConsent))
        setVisible(false)
        setModalOpen(false)
    }

    const handleRejectNonEssential = () => {
        const minimalConsent = { essential: true, analytics: false, personalization: false, marketing: false, date: new Date().toISOString() }
        localStorage.setItem('chefmii_cookie_consent', JSON.stringify(minimalConsent))
        setVisible(false)
        setModalOpen(false)
    }

    const handleSavePreferences = () => {
        const customConsent = { ...prefs, essential: true, date: new Date().toISOString() }
        localStorage.setItem('chefmii_cookie_consent', JSON.stringify(customConsent))
        setVisible(false)
        setModalOpen(false)
    }

    return (
        <>
            {/* Floating Glassmorphism Banner */}
            <aside
                aria-label="Cookie Consent"
                className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
            >
                <div className="bg-card/95 dark:bg-stone-900/95 backdrop-blur-xl border border-border/80 shadow-2xl rounded-3xl p-5 text-foreground relative">
                    <div className="flex items-start gap-3.5 mb-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
                            <Cookie className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                                Cookie & Privacy Choices
                                <span className="inline-block px-1.5 py-0.2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-full">
                                    GDPR Ready
                                </span>
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                                We use cookies to elevate your private dining experience, personalize chef recommendations, and ensure secure escrow transactions.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-4 px-1">
                        <Link href="/cookies" className="hover:text-terracotta underline underline-offset-2 transition-colors">
                            Cookie Policy
                        </Link>
                        <span>•</span>
                        <Link href="/privacy" className="hover:text-terracotta underline underline-offset-2 transition-colors">
                            Privacy Policy
                        </Link>
                        <span>•</span>
                        <button
                            onClick={() => setModalOpen(true)}
                            className="hover:text-terracotta inline-flex items-center gap-1 font-semibold transition-colors"
                        >
                            <Settings className="w-3 h-3" />
                            Manage
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={handleRejectNonEssential}
                            className="w-full py-2.5 px-3 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-bold text-foreground transition-all"
                        >
                            Decline Optional
                        </button>
                        <button
                            onClick={handleAcceptAll}
                            className="w-full py-2.5 px-3 rounded-xl gradient-brand text-white text-xs font-bold shadow-md hover:opacity-90 transition-all"
                        >
                            Accept All
                        </button>
                    </div>
                </div>
            </aside>

            {/* Granular Preferences Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
                    <div className="bg-card dark:bg-stone-900 border border-border rounded-3xl shadow-2xl max-w-lg w-full p-6 text-foreground space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <div className="flex items-center gap-2">
                                <Cookie className="w-5 h-5 text-terracotta" />
                                <h3 className="font-bold text-base">Cookie Preferences</h3>
                            </div>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            Customize which cookies you want to allow. Essential cookies are required for platform security and booking functionality.
                        </p>

                        <div className="space-y-3">
                            {/* Essential */}
                            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center justify-between">
                                <div className="space-y-0.5 pr-4">
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs font-bold text-foreground">Strictly Essential Cookies</p>
                                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                            Required
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground leading-tight">
                                        Session authentication, Stripe escrow checkout, security CSRF protection.
                                    </p>
                                </div>
                                <input type="checkbox" checked disabled className="w-4 h-4 rounded text-terracotta opacity-60 cursor-not-allowed" />
                            </div>

                            {/* Analytics */}
                            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center justify-between">
                                <div className="space-y-0.5 pr-4">
                                    <p className="text-xs font-bold text-foreground">Performance & Analytics</p>
                                    <p className="text-[11px] text-muted-foreground leading-tight">
                                        Helps us understand booking flow speed, popular chef search regions, and app performance.
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={prefs.analytics}
                                    onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })}
                                    className="w-4 h-4 rounded accent-[#FF5A36] cursor-pointer"
                                />
                            </div>

                            {/* Personalization */}
                            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center justify-between">
                                <div className="space-y-0.5 pr-4">
                                    <p className="text-xs font-bold text-foreground">Chef & Cuisine Personalization</p>
                                    <p className="text-[11px] text-muted-foreground leading-tight">
                                        Remembers your dietary allergies, favorite master chefs, and Mayfair/London location preferences.
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={prefs.personalization}
                                    onChange={(e) => setPrefs({ ...prefs, personalization: e.target.checked })}
                                    className="w-4 h-4 rounded accent-[#FF5A36] cursor-pointer"
                                />
                            </div>

                            {/* Marketing */}
                            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center justify-between">
                                <div className="space-y-0.5 pr-4">
                                    <p className="text-xs font-bold text-foreground">Marketing & VIP Tasting Invitations</p>
                                    <p className="text-[11px] text-muted-foreground leading-tight">
                                        Enables exclusive chef pop-up notifications, partner discounts, and VIP summit invites.
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={prefs.marketing}
                                    onChange={(e) => setPrefs({ ...prefs, marketing: e.target.checked })}
                                    className="w-4 h-4 rounded accent-[#FF5A36] cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                            <button
                                onClick={handleRejectNonEssential}
                                className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground"
                            >
                                Reject Optional
                            </button>
                            <button
                                onClick={handleSavePreferences}
                                className="px-5 py-2 rounded-xl gradient-brand text-white text-xs font-bold shadow-md hover:opacity-90 transition-all"
                            >
                                Save Preferences
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
