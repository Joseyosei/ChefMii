'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut as fbSignOut,
    updateProfile as fbUpdateProfile,
    type User as FirebaseUser,
} from 'firebase/auth'
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp,
} from 'firebase/firestore'
import { auth, db, googleProvider } from '@/lib/firebase/client'

export type UserRole = 'client' | 'chef' | 'business' | 'admin' | 'kids' | 'influencer' | 'farmer'

export interface Profile {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    role: UserRole
    phone: string | null
}

export type AuthUser = FirebaseUser & {
    id: string
}

interface AuthContextType {
    user: AuthUser | null
    profile: Profile | null
    session: { user: AuthUser } | null
    loading: boolean
    role: UserRole | null
    signIn: (email: string, password: string) => Promise<{ error: string | null }>
    signInWithGoogle: () => Promise<{ error: string | null }>
    signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error: string | null }>
    signOut: () => Promise<void>
    refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchProfile = useCallback(async (userId: string, email: string, displayName?: string | null): Promise<Profile> => {
        try {
            const userDocRef = doc(db, 'users', userId)
            const userSnap = await getDoc(userDocRef)

            if (userSnap.exists()) {
                const data = userSnap.data()
                const prof: Profile = {
                    id: userId,
                    email: data.email || email,
                    full_name: data.full_name || data.name || displayName || null,
                    avatar_url: data.avatar_url || data.photoURL || null,
                    role: (data.role as UserRole) || 'client',
                    phone: data.phone || null,
                }
                setProfile(prof)
                return prof
            } else {
                // Initialize default profile if document doesn't exist
                const defaultProfile: Profile = {
                    id: userId,
                    email: email,
                    full_name: displayName || null,
                    avatar_url: null,
                    role: 'client',
                    phone: null,
                }
                try {
                    await setDoc(userDocRef, {
                        ...defaultProfile,
                        createdAt: serverTimestamp(),
                    }, { merge: true })
                } catch (e) {
                    console.warn('Could not create default user profile doc in Firestore:', e)
                }
                setProfile(defaultProfile)
                return defaultProfile
            }
        } catch (err) {
            console.error('Error fetching user profile from Firestore:', err)
            const fallbackProfile: Profile = {
                id: userId,
                email: email,
                full_name: displayName || null,
                avatar_url: null,
                role: 'client',
                phone: null,
            }
            setProfile(fallbackProfile)
            return fallbackProfile
        }
    }, [])

    const refreshProfile = useCallback(async () => {
        if (user) {
            await fetchProfile(user.uid, user.email || '', user.displayName)
        }
    }, [user, fetchProfile])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            if (fbUser) {
                const enhancedUser = Object.assign(fbUser, { id: fbUser.uid }) as AuthUser
                setUser(enhancedUser)
                await fetchProfile(fbUser.uid, fbUser.email || '', fbUser.displayName)
            } else {
                setUser(null)
                setProfile(null)
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [fetchProfile])

    const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            return { error: null }
        } catch (error: unknown) {
            const err = error as { code?: string; message?: string }
            let msg = err.message || 'Failed to sign in'
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                msg = 'Invalid email or password.'
            } else if (err.code === 'auth/too-many-requests') {
                msg = 'Too many failed login attempts. Please try again later.'
            }
            return { error: msg }
        }
    }

    const signInWithGoogle = async (): Promise<{ error: string | null }> => {
        try {
            const result = await signInWithPopup(auth, googleProvider)
            if (result.user) {
                await fetchProfile(result.user.uid, result.user.email || '', result.user.displayName)
            }
            return { error: null }
        } catch (error: unknown) {
            const err = error as { code?: string; message?: string }
            if (err.code === 'auth/popup-closed-by-user') {
                return { error: null }
            }
            return { error: err.message || 'Google sign-in failed' }
        }
    }

    const signUp = async (
        email: string,
        password: string,
        fullName: string,
        role: UserRole
    ): Promise<{ error: string | null }> => {
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password)
            if (cred.user) {
                try {
                    await fbUpdateProfile(cred.user, { displayName: fullName })
                } catch {
                    // non-fatal
                }

                const userDocRef = doc(db, 'users', cred.user.uid)
                await setDoc(userDocRef, {
                    id: cred.user.uid,
                    email,
                    full_name: fullName,
                    role,
                    phone: null,
                    avatar_url: null,
                    createdAt: serverTimestamp(),
                }, { merge: true })

                setProfile({
                    id: cred.user.uid,
                    email,
                    full_name: fullName,
                    avatar_url: null,
                    role,
                    phone: null,
                })
            }
            return { error: null }
        } catch (error: unknown) {
            const err = error as { code?: string; message?: string }
            let msg = err.message || 'Failed to sign up'
            if (err.code === 'auth/email-already-in-use') {
                msg = 'This email is already in use. Please sign in instead.'
            } else if (err.code === 'auth/weak-password') {
                msg = 'Password should be at least 6 characters.'
            }
            return { error: msg }
        }
    }

    const signOut = async () => {
        await fbSignOut(auth)
        setUser(null)
        setProfile(null)
    }

    const session = user ? { user } : null

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            session,
            loading,
            role: profile?.role ?? null,
            signIn,
            signInWithGoogle,
            signUp,
            signOut,
            refreshProfile,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
    return ctx
}

/** Derive dashboard URL from role */
export function dashboardHref(role: UserRole | null): string {
    if (role === 'chef') return '/chef-dashboard'
    if (role === 'business') return '/business-dashboard'
    return '/user-dashboard'
}
