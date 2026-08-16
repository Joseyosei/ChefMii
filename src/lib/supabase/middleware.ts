import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

const PROTECTED_ROUTES = [
    '/user-dashboard',
    '/chef-dashboard',
    '/business-dashboard',
    '/farmer-dashboard',
    '/influencer-dashboard',
    '/kids-dashboard',
]

const ROLE_ROUTES: Record<string, string> = {
    'chef': '/chef-dashboard',
    'business': '/business-dashboard',
    'farmer': '/farmer-dashboard',
    'influencer': '/influencer-dashboard',
    'kids': '/kids-dashboard',
    'client': '/user-dashboard',
}

const AUTH_ROUTES = ['/login', '/register']

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo-chefmii.supabase.co'
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.demo'

    const supabase = createServerClient<Database>(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() { return request.cookies.getAll() },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    let user = null
    try {
        const { data } = await supabase.auth.getUser()
        user = data.user
    } catch {
        return supabaseResponse
    }

    const path = request.nextUrl.pathname

    // Redirect unauthenticated users away from protected pages
    const isProtected = PROTECTED_ROUTES.some(r => path.startsWith(r))
    if (isProtected && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('redirectTo', path)
        return NextResponse.redirect(url)
    }

    // Redirect logged-in users away from auth pages
    if (user && AUTH_ROUTES.some(r => path === r)) {
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            const role = (profile as { role?: string } | null)?.role ?? 'client'
            const url = request.nextUrl.clone()
            url.pathname = ROLE_ROUTES[role] || '/user-dashboard'
            return NextResponse.redirect(url)
        } catch {
            // Fallback if profiles lookup fails
        }
    }

    // For role-specific dashboard routes, verify user has correct role
    if (user) {
        const isRoleSpecificRoute = Object.values(ROLE_ROUTES).some(r => path.startsWith(r))
        if (isRoleSpecificRoute) {
            try {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()

                const userRole = (profile as { role?: string } | null)?.role ?? 'client'
                const expectedRoute = ROLE_ROUTES[userRole]
                if (!path.startsWith(expectedRoute)) {
                    const url = request.nextUrl.clone()
                    url.pathname = expectedRoute
                    return NextResponse.redirect(url)
                }
            } catch {
                // Fallback
            }
        }
    }

    return supabaseResponse
}

