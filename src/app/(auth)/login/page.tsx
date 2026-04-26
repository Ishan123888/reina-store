"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/core/configs/supabase-browser";
import {
  getSafePostLoginPath,
  resolveUserRole,
} from "@/core/auth/auth-helpers";

const images = [
  "https://i.imgur.com/VG7Jjw0.jpeg",
  "https://i.imgur.com/nP2cWaY.jpeg",
  "https://imgur.com/K1YRX5o.png",
];

function LoginContent() {
  const searchParams = useSearchParams();
  const supabase = getSupabaseBrowserClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextPath = searchParams.get("next");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.user) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role, email, full_name")
      .eq("id", data.user.id)
      .maybeSingle();

    const role = resolveUserRole(profile?.role, data.user.email);

    if (profileError) {
      setError("Unable to read your account details right now.");
      setLoading(false);
      return;
    }

    const needsProfileSync =
      !profile ||
      profile.role !== role ||
      !profile.email ||
      !profile.full_name;

    if (needsProfileSync) {
      const { error: upsertError } = await supabase.from("profiles").upsert(
        {
          id: data.user.id,
          email: profile?.email ?? data.user.email ?? email,
          full_name:
            profile?.full_name ??
            (typeof data.user.user_metadata?.full_name === "string"
              ? data.user.user_metadata.full_name
              : null),
          role,
        },
        { onConflict: "id" }
      );

      if (upsertError) {
        setError("Unable to prepare your account. Please try again.");
        setLoading(false);
        return;
      }
    }

    window.location.href = getSafePostLoginPath(role, nextPath);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-slate-950">
      <div className="relative hidden md:block">
        {images.map((img, index) => (
          <Image
            key={img}
            src={img}
            alt=""
            fill
            className={`object-cover transition-opacity duration-1000 ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute bottom-12 left-12 text-white max-w-sm">
          <h2 className="text-3xl font-semibold mb-3">Reina Store</h2>
          <p className="text-sm text-white/70 leading-relaxed">
            Premium ladies slippers crafted for comfort and elegance. Experience
            modern fashion with a Sri Lankan touch.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-white">Sign in</h1>
            <p className="text-sm text-slate-400 mt-1">
              Use your account to continue to the correct dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-400/20 px-3 py-2 rounded-md">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full mb-6 py-2.5 rounded-lg bg-white hover:bg-gray-100 text-slate-900 font-medium transition flex items-center justify-center gap-3"
          >
            {googleLoading ? (
              <Loader2 className="animate-spin text-slate-900" size={20} />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.83z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.83c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-950 px-2 text-slate-400">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm text-slate-300">Email address</label>
              <input
                type="email"
                required
                className="w-full mt-1 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Password</label>
              <div className="relative mt-1">
                <input
                  type={show ? "text" : "password"}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShow((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-400">
                <input type="checkbox" className="accent-cyan-500" />
                Remember me
              </label>

              <Link
                href="/forgot-password"
                className="text-cyan-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" /> : "Sign in"}
            </button>
          </form>

          <p className="text-sm text-slate-400 text-center mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-cyan-400">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Loader2 className="animate-spin text-white" />}>
      <LoginContent />
    </Suspense>
  );
}
