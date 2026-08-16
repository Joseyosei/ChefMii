'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase/client'
import { useAuth, dashboardHref } from '@/context/auth-context'
import { ChefHat, Eye, EyeOff, Loader2 } from 'lucide-react'
import { BrandLogo } from '@/components/layout/logo'

function LoginContent() {
    const router = useRouter()
    const params = useSearchParams()
    const { signIn, signInWithGoogle, user, role } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [forgotSent, setForgotSent] = useState(false)

    const redirectTo = params.get('redirectTo') || dashboardHref(role)

    useEffect(() => {
        if (user && role) {
            router.push(redirectTo)
        }
    }, [user, role, redirectTo, router])

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            await signIn(email, password)
            // Redirect handled by useEffect
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Invalid credentials. Please try again.'
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setError(null)
        setGoogleLoading(true)
        try {
            await signInWithGoogle()
            // Redirect handled by useEffect
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Google sign in failed.'
            setError(msg)
        } finally {
            setGoogleLoading(false)
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
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
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
                        Sign in to manage your bookings, connect with chefs, and enjoy extraordinary dining experiences.
                    </p>
                    <div className="mt-10 grid grid-cols-2 gap-4">
                        {['500+ Chefs', '50+ Countries', '4.9★ Rating', '10K+ Events'].map(s => (
                            <div key={s} className="bg-white/10 rounded-xl p-4 font-bold text-sm">{s}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-8">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="mb-8 md:hidden">
                        <BrandLogo size="lg" />
                    </div>

                    <h1 className="text-3xl font-serif font-bold mb-2">Sign In</h1>
                    <p className="text-muted-foreground mb-8">Welcome back! Please enter your details.</p>

                    {/* Error banner */}
                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                    {forgotSent && (
                        <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                            Password reset email sent! Check your inbox.
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Email</label>
                            <input
                                type="email"
                                id="login-email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-terracotta transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    id="login-password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 min-h-[44px] rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-terracotta pr-12 transition-all text-sm"
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
                                    onClick={handleForgotPassword}
                                    className="text-xs text-terracotta hover:underline font-medium"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        </div>

                        <button
                            id="login-submit"
                            onClick={handleEmailLogin}
                            disabled={loading || googleLoading}
                            className="w-full min-h-[44px] py-3 gradient-brand text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all text-sm flex items-center justify-center gap-2"
                        >
                            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Signing in…</> : 'Sign In'}
                        </button>

                        <div className="relative flex items-center gap-3">
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-xs text-muted-foreground">OR</span>
                            <div className="flex-1 h-px bg-border" />
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loading || googleLoading}
                            className="w-full min-h-[44px] py-3 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {googleLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin text-terracotta" />
                            ) : (
                                <>
                                    <span className="font-bold text-blue-600">G</span> Continue with Google
                                </>
                            )}
                        </button>
                    </div>

                    <p className="text-center text-sm text-muted-foreground mt-8">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-terracotta font-semibold hover:underline">Create one free</Link>
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
