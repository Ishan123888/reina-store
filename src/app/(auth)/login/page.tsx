"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Sparkles, LogIn, AlertCircle } from "lucide-react";
import { getSupabaseBrowserClient } from "@/core/configs/supabase-browser";
import { useSearchParams, useRouter } from "next/navigation";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const supabase = getSupabaseBrowserClient();

  const validateForm = () => {
    if (!email || !password) return "Please fill in all fields.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return "Please enter a valid email address.";
    return null;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Auth Login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setLoading(false);
        setError(
          authError.message === "Invalid login credentials"
            ? "No account found or password is incorrect."
            : authError.message
        );
        return;
      }

      if (!authData?.user) {
        setLoading(false);
        return;
      }

      // 2. Fetch User Profile & Role
      // මෙතනදී අපි 'maybeSingle' පාවිච්චි කරන්නේ පේළියක් නැති වුණොත් error එකක් නොවී null ලැබෙන්නයි.
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single(); 

      if (profileError) {
        console.error("Database Error:", profileError);
        // RLS Policy එක නැති වුණොත් හෝ Table එකේ row එක නැති වුණොත් මෙතනට එනවා
        setError("Permission denied or Profile not found. Please check Supabase RLS.");
        setLoading(false);
        return;
      }

      // 3. Redirect Logic
      const isAdmin = (profile?.role || "").toLowerCase() === "admin";
      const requestedRoute = searchParams.get("next");
      
      let targetRoute = isAdmin ? "/dashboard" : "/customer-dashboard";

      // පරණ route එකක් තිබුණොත් ඒකට යවනවා
      if (requestedRoute && requestedRoute.startsWith("/") && !requestedRoute.startsWith("//")) {
        targetRoute = requestedRoute;
      }

      console.log("Login Success. Redirecting to:", targetRoute);
      
      // Next.js router එක සමහර වෙලාවට session එක update කරගන්න පරක්කු වෙන නිසා 
      // window.location පාවිච්චි කිරීම වඩාත් විශ්වාසදායකයි
      window.location.href = targetRoute;
      
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="app-surface min-h-screen flex items-center justify-center p-5">
      <div className="glass-panel w-full max-w-[24rem] p-8 rounded-[1.25rem]">
        <div className="text-center mb-7">
          <div className="w-11 h-11 rounded-xl bg-cyan-400/10 flex items-center justify-center mx-auto mb-4 border border-cyan-300/15">
            <Sparkles size={20} className="text-cyan-400" />
          </div>
          <h2 className="section-title text-2xl text-white italic font-black uppercase tracking-tighter">Welcome Back</h2>
          <p className="text-xs text-white/45 mt-1 font-medium">Sign in to continue to Reina</p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-400/25 bg-red-500/10 text-red-300 text-[11px] px-3 py-2 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={14} className="shrink-0" /> 
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] text-white/60 mb-1.5 block font-black tracking-widest uppercase">Email Address</label>
            <input
              className="input-modern"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-[10px] text-white/60 mb-1.5 block font-black tracking-widest uppercase">Password</label>
            <div className="relative">
              <input
                className="input-modern pr-10"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary-modern w-full py-3 mt-2 flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <span className="font-black uppercase tracking-widest text-[11px]">Sign In Now</span>
                <LogIn size={16} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-white/45 mt-8 font-medium">
          New to Reina Store? {" "}
          <Link href="/register" className="text-cyan-400 hover:underline decoration-cyan-400/30 underline-offset-4 transition-all">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="app-surface min-h-screen flex items-center justify-center">
          <Loader2 size={34} className="animate-spin text-cyan-300" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}