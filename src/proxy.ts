import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export default async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  // 1. Static/API routes skip කිරීම (Performance සඳහා)
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

  // User session එක ලබා ගැනීම
  const { data: { user } } = await supabase.auth.getUser()

  // ✅ RULE: Admin pages protect කිරීම පමණයි
  const isAdminPath = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/add-product') || 
    pathname.startsWith('/orders')

  if (isAdminPath) {
    // 1. User ලොග් වෙලා නැතිනම් /login පේජ් එකට යවන්න
    if (!user) {
      console.log('[PROXY] No user → Redirecting to /login')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      // 2. Profiles table එකෙන් Role එක ලබා ගැනීම
      // .single() පාවිච්චි කරද්දී දත්ත නැති වුණොත් හිර නොවෙන්නයි මෙතැන try-catch දාලා තියෙන්නේ
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle() // මෙතැන maybeSingle පාවිච්චි කිරීම වඩාත් සුදුසුයි loading හිර නොවෙන්න

      const isAdmin = profile?.role === 'admin'
      console.log(`[PROXY] Path: ${pathname} | User: ${user.email} | Role: ${profile?.role} | isAdmin: ${isAdmin}`)

      // 3. Admin කෙනෙක් නෙවෙයි නම් Dashboard එකට යන්න නොදී /collections වලට යවන්න
      if (error || !isAdmin) {
        console.log('[PROXY] Not admin or DB error → Redirecting to /collections')
        return NextResponse.redirect(new URL('/collections', request.url))
      }
    } catch (err) {
      console.error('[PROXY] Database fetch error:', err)
      return NextResponse.redirect(new URL('/collections', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}