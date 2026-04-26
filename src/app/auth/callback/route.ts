import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getDashboardPath, resolveUserRole } from "@/core/auth/auth-helpers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  const { error, data } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data?.user) {
    return NextResponse.redirect(`${origin}/login?error=auth_error`);
  }

  const user = data.user;
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, email, full_name, phone, address")
    .eq("id", user.id)
    .maybeSingle();

  const resolvedRole = resolveUserRole(profile?.role, user.email);
  const profilePayload = {
    id: user.id,
    email: profile?.email ?? user.email ?? null,
    full_name:
      profile?.full_name ??
      (typeof user.user_metadata?.full_name === "string"
        ? user.user_metadata.full_name
        : null),
    phone:
      profile?.phone ??
      (typeof user.user_metadata?.phone === "string"
        ? user.user_metadata.phone
        : null),
    address:
      profile?.address ??
      (typeof user.user_metadata?.address === "string"
        ? user.user_metadata.address
        : null),
    role: resolvedRole,
  };

  const needsProfileSync =
    !profile ||
    profile.role !== resolvedRole ||
    !profile.email ||
    !profile.full_name;

  if (needsProfileSync) {
    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert(profilePayload, { onConflict: "id" });

    if (upsertError) {
      console.error("Critical: Profile creation failed", upsertError);
      return NextResponse.redirect(`${origin}/login?error=db_error`);
    }
  }

  return NextResponse.redirect(`${origin}${getDashboardPath(resolvedRole)}`);
}
