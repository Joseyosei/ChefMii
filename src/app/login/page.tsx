'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase/client'
import { useAuth, dashboardHref, UserRole } from '@/context/auth-context'
import { ChefHat, Eye, EyeOff, Loader2, Sparkles, Building2, User as UserIcon } from 'lucide-react'
import { BrandLogo } from '@/components/layout/logo'

function LoginContent() {
    const router = useRouter()
    const params = useSearchParams()
    const { signIn, signInWithGoogle, signInAsDemo, user, role } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [demoLoading, setDemoLoading] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [forgotSent, setForgotSent] = useState(false)

    const redirectTo = params.get('redirectTo')

    useEffect(() => {
        if (user && role) {
            const dest = redirectTo || dashboardHref(role)
            router.push(dest)
        }
    }, [user, role, redirectTo, router])

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        if (!email.trim() || !password.trim()) {
            setError('Please enter your email and password.')
            return
        }
        setLoading(true)
        try {
            const res = await signIn(email.trim(), password)
            if (res.error) {
                setError(res.error)
                setLoading(false)
            } else {
                const dest = redirectTo || '/user-dashboard'
                router.push(dest)
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Invalid credentials. Please try again.'
            setError(msg)
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setError(null)
        setGoogleLoading(true)
        try {
            const res = await signInWithGoogle()
            if (res.error) {
                setError(res.error)
                setGoogleLoading(false)
            } else {
                const dest = redirectTo || '/user-dashboard'
                router.push(dest)
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Google sign in failed.'
            setError(msg)
            setGoogleLoading(false)
        }
    }

    const handleDemoLogin = async (demoRole: UserRole) => {
        setError(null)
        setDemoLoading(demoRole)
        try {
            await signInAsDemo(demoRole)
            const dest = redirectTo || dashboardHref(demoRole)
            router.push(dest)
        } catch (err) {
            setError('Demo login failed. Please try again.')
        } finally {
            setDemoLoading(null)
        }
    }

    const handleForgotPassword = async () => {
        if (!email) {
            setError('Please enter your email address first.')
            return
        }
        try {
            await sendPasswordResetEmail(auth, email)
            setForgotSent(true)
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to send password reset email.'
            setError(msg)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleEmailLogin(e as unknown as React.FormEvent)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans text-foreground">
            {/* Left brand panel — hidden on mobile */}
            <div className="hidden md:flex flex-1 gradient-brand items-center justify-center p-12">
                <div className="text-white max-w-md">
                    <div className="mb-8 p-3 bg-white rounded-2xl inline-block shadow-lg">
                        <BrandLogo size="lg" />
                    </div>
                    <h2 className="text-4xl font-serif font-bold mb-4 leading-tight">
                        Welcome back to the world&apos;s finest chef marketplace
                    </h2>
                    <p className="text-white/80 text-lg">
                        Sign in to manage your bookings, connect with 16 master chefs, and enjoy extraordinary private dining experiences.
                    </p>
                    <div className="mt-10 grid grid-cols-2 gap-4">
                        {['500+ Chefs', '16 Global Cuisines', '4.9★ Verified Rating', '100% Escrow Protection'].map(s => (
                            <div key={s} className="bg-white/10 backdrop-blur-md rounded-xl p-4 font-bold text-sm border border-white/10">{s}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md space-y-6">
                    {/* Mobile logo */}
                    <div className="md:hidden">
                        <BrandLogo size="lg" />
                    </div>

                    <div>
                        <h1 className="text-3xl font-serif font-bold text-foreground">Sign In</h1>
                        <p className="text-muted-foreground text-sm mt-1">Welcome back! Please enter your details or use instant demo sign-in.</p>
                    </div>

                    {/* Quick 1-Click Demo Login for Testing / Hackathon Judges */}
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <span>1-Click Instant Demo Login (Hackathon Access)</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => handleDemoLogin('client')}
                                disabled={Boolean(demoLoading)}
                                className="py-2 px-2.5 bg-white dark:bg-stone-900 border border-border hover:border-terracotta rounded-xl text-xs font-bold text-foreground flex items-center justify-center gap-1 shadow-xs transition-colors"
                            >
                                <UserIcon className="w-3.5 h-3.5 text-terracotta" />
                                {demoLoading === 'client' ? 'Loading…' : 'Client'}
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDemoLogin('chef')}
                                disabled={Boolean(demoLoading)}
                                className="py-2 px-2.5 bg-white dark:bg-stone-900 border border-border hover:border-terracotta rounded-xl text-xs font-bold text-foreground flex items-center justify-center gap-1 shadow-xs transition-colors"
                            >
                                <ChefHat className="w-3.5 h-3.5 text-terracotta" />
                                {demoLoading === 'chef' ? 'Loading…' : 'Chef'}
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDemoLogin('business')}
                                disabled={Boolean(demoLoading)}
                                className="py-2 px-2.5 bg-white dark:bg-stone-900 border border-border hover:border-terracotta rounded-xl text-xs font-bold text-foreground flex items-center justify-center gap-1 shadow-xs transition-colors"
                            >
                                <Building2 className="w-3.5 h-3.5 text-terracotta" />
                                {demoLoading === 'business' ? 'Loading…' : 'Business'}
                            </button>
                        </div>
                    </div>

                    {/* Error banner */}
                    {error && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold">
                            {error}
                        </div>
                    )}
                    {forgotSent && (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                            Password reset email sent! Check your inbox.
                        </div>
                    )}

                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">Email Address</label>
                            <input
                                type="email"
                                id="login-email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-terracotta transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    id="login-password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-terracotta pr-12 transition-all text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <div className="flex justify-end mt-1.5">
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="text-xs text-terracotta hover:underline font-bold"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            id="login-submit"
                            disabled={loading || googleLoading || Boolean(demoLoading)}
                            className="w-full min-h-[46px] py-3 gradient-brand text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all text-xs flex items-center justify-center gap-2 shadow-md"
                        >
                            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : 'Sign In to Dashboard →'}
                        </button>
                    </form>

                    <div className="relative flex items-center gap-3">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">OR</span>
                        <div className="flex-1 h-px bg-border" />
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading || googleLoading || Boolean(demoLoading)}
                        className="w-full min-h-[44px] py-3 border border-border rounded-xl text-xs font-bold hover:bg-muted transition-colors flex items-center justify-center gap-3 disabled:opacity-50 text-foreground"
                    >
                        {googleLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-terracotta" />
                        ) : (
                            <>
                                <span className="font-bold text-blue-600">G</span> Continue with Google
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-muted-foreground pt-2">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-terracotta font-bold hover:underline">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-terracotta animate-spin" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    )
}
