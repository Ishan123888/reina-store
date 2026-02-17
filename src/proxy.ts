import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export default async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  // Static/API routes skip
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  console.log('[PROXY]', pathname, '| user:', user?.email ?? 'NO USER', '| error: none')

  // ✅ RULE: Admin pages protect කිරීම පමණයි
  // /dashboard, /add-product, /orders → login නෑ නම් → /login
  // login ඇති නමුත් admin නොවේ → /collections
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/add-product') ||
    pathname.startsWith('/orders')
  ) {
    if (!user) {
      console.log('[PROXY] No user → /login')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'
    console.log('[PROXY] Role:', profile?.role, '| isAdmin:', isAdmin)

    if (!isAdmin) {
      console.log('[PROXY] Not admin → /collections')
      return NextResponse.redirect(new URL('/collections', request.url))
    }
  }

  // ✅ /login redirect loop නෑ — login page ඇතුළෙදී client-side role check කරලා redirect
  // proxy.ts ඇතුළෙ /login redirect කළොත් loop වෙනවා, ඒ නිසා ඉවත් කළා

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}