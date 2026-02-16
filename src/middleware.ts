import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // සටහන: මෙහිදී getUser() අත්‍යවශ්‍ය වේ
  const { data: { user } } = await supabase.auth.getUser()
  const url = request.nextUrl.clone()

  // 1. ලොග් වී නැතිනම් සහ Protected පාරක යනවා නම්
  const isDashboard = url.pathname.startsWith('/dashboard')
  if (!user && isDashboard) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. දැනටමත් ලොග් වී ඇත්නම් නැවත ලොගින් එකට යාම වැළැක්වීම
  if (user && url.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}