"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Step 1: Email + Password login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !authData.user) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      // Step 2: profiles table එකෙන් role fetch කරනවා
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      // Step 3: Role based redirect
      // ✅ admin → /dashboard
      // ✅ customer (හෝ profile නෑ) → /collections
      if (profile?.role === "admin") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/collections";
      }

    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4 transition-colors duration-300">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic dark:text-white mb-2">
            Welcome Back.
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.25em]">
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm p-10">

          {/* Error */}
          {error && (
            <div className="mb-6 px-5 py-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-5 py-4 rounded-2xl
                  bg-gray-50 dark:bg-slate-800
                  border border-gray-200 dark:border-slate-700
                  text-black dark:text-white text-sm font-medium
                  placeholder-gray-300 dark:placeholder-gray-600
                  focus:outline-none focus:border-blue-500 dark:focus:border-blue-500
                  focus:ring-2 focus:ring-blue-500/20
                  transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-5 py-4 pr-14 rounded-2xl
                    bg-gray-50 dark:bg-slate-800
                    border border-gray-200 dark:border-slate-700
                    text-black dark:text-white text-sm font-medium
                    placeholder-gray-300 dark:placeholder-gray-600
                    focus:outline-none focus:border-blue-500 dark:focus:border-blue-500
                    focus:ring-2 focus:ring-blue-500/20
                    transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2
                    text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                    transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl
                bg-black dark:bg-blue-600 text-white
                font-black text-xs uppercase tracking-widest
                hover:bg-blue-600 dark:hover:bg-blue-500
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-300
                flex items-center justify-center gap-2
                shadow-xl hover:shadow-blue-500/25"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors">
                Register
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}