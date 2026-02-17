"use client";

import Link from "next/link";
import { useState } from "react";
import { UserPlus, Mail, Lock, User, Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (formData.password.length < 6) {
        throw new Error("Password අවම වශයෙන් අකුරු 6ක් විය යුතුයි.");
      }

      // Step 1: Supabase Auth signup
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: { full_name: formData.name.trim() }
        }
      });

      if (authError) {
        if (authError.message.includes("already registered") || authError.message.includes("already been registered")) {
          throw new Error("මේ Email එක දැනටමත් register වෙලා. Login කරන්න.");
        }
        throw new Error(authError.message);
      }

      if (!authData.user) throw new Error("Registration failed.");

      // Step 2: profiles table insert
      await supabase
        .from("profiles")
        .upsert({
          id: authData.user.id,
          email: formData.email.trim(),
          role: "customer",
        });

      // ✅ Email confirm ON නිසා - success screen පෙන්නන්න
      setEmailSent(true);

    } catch (err: any) {
      setError(err.message || "Registration error.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Email sent success screen
  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-slate-950">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-2xl p-10 text-center">
          
          <div className="w-20 h-20 bg-green-50 dark:bg-green-950/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-500" size={40} />
          </div>
          
          <h2 className="text-3xl font-black uppercase tracking-tighter italic text-black dark:text-white mb-3">
            Almost There!
          </h2>
          
          <p className="text-gray-500 dark:text-gray-400 text-sm font-bold mb-2">
            Confirmation email sent to:
          </p>
          <p className="text-blue-600 font-black text-sm mb-8 bg-blue-50 dark:bg-blue-950/30 py-3 px-6 rounded-2xl inline-block">
            {formData.email}
          </p>
          
          <div className="space-y-3 text-left bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">ඊළඟ steps:</p>
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">1</span>
              <p className="text-xs font-bold text-gray-600 dark:text-gray-300">ඔබේ email inbox එක check කරන්න</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">2</span>
              <p className="text-xs font-bold text-gray-600 dark:text-gray-300">"Confirm your email" link එක click කරන්න</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">3</span>
              <p className="text-xs font-bold text-gray-600 dark:text-gray-300">Confirm කළාට පස්සේ login කරන්න</p>
            </div>
          </div>

          <Link
            href="/login"
            className="block w-full bg-black dark:bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all text-center"
          >
            Go to Login →
          </Link>
          
          <p className="text-[10px] text-gray-300 dark:text-gray-600 font-bold mt-4">
            Spam folder එකත් check කරන්න
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-2xl p-10">

          <div className="text-center mb-10">
            <h1 className="text-4xl font-black uppercase tracking-tighter italic text-black dark:text-white">
              Join Reina.
            </h1>
            <p className="text-blue-600 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">
              Create Your Account
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-bold text-center">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  type="text"
                  placeholder="Your Full Name"
                  required
                  disabled={isLoading}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-12 pr-5 py-5 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-black dark:text-white placeholder-gray-300 dark:placeholder-gray-600 transition-all disabled:opacity-60 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-5 py-5 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-black dark:text-white placeholder-gray-300 dark:placeholder-gray-600 transition-all disabled:opacity-60 text-sm"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  required
                  disabled={isLoading}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-14 py-5 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-black dark:text-white placeholder-gray-300 dark:placeholder-gray-600 transition-all disabled:opacity-60 text-sm"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.name || !formData.email || !formData.password}
              className="w-full bg-black dark:bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-6 text-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>Create Account <UserPlus size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              දැනටමත් account තියෙනවාද?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}