import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_PREFIXES = ["/dashboard", "/add-product", "/orders", "/customers"];
const CUSTOMER_ONLY_PREFIXES = ["/customer-dashboard"];
const AUTH_REQUIRED_PREFIXES = [
  "/collections",
  "/product",
  "/cart",
  "/checkout",
  "/track-order",
  "/order-success",
];

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request: { headers: request.headers } });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  const needsAdmin = matchesPrefix(pathname, ADMIN_PREFIXES);
  const needsCustomer = matchesPrefix(pathname, CUSTOMER_ONLY_PREFIXES);
  const needsAuth =
    needsAdmin || needsCustomer || matchesPrefix(pathname, AUTH_REQUIRED_PREFIXES);
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (!needsAuth && !isAuthPage) {
    return response;
  }

  if (!user) {
    if (needsAuth) return redirectToLogin(request);
    return response;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = profile?.role === "admin" ? "admin" : "customer";

  if (isAuthPage) {
    const target = role === "admin" ? "/dashboard" : "/customer-dashboard";
    return NextResponse.redirect(new URL(target, request.url));
  }

  if (needsAdmin && role !== "admin") {
    return NextResponse.redirect(new URL("/customer-dashboard", request.url));
  }

  if (needsCustomer && role === "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (matchesPrefix(pathname, AUTH_REQUIRED_PREFIXES) && role === "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
