"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/core/configs/supabase-browser";
import { useSearchParams } from "next/navigation";

/* Background images */
const images = [
  "https://i.imgur.com/VG7Jjw0.jpeg",
  "https://i.imgur.com/nP2cWaY.jpeg",
  "https://imgur.com/K1YRX5o.png",
];

function LoginContent() {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(0);

  /* Image auto change */
  useEffect(() => {
    const i = setInterval(() => {
      setCurrentImage((p) => (p + 1) % images.length);
    }, 4000);
    return () => clearInterval(i);
  }, []);

  const supabase = getSupabaseBrowserClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    const isAdmin = profile?.role === "admin";
    let redirect = isAdmin ? "/dashboard" : "/customer-dashboard";

    const next = searchParams.get("next");
    if (next && next.startsWith("/")) redirect = next;

    window.location.href = redirect;
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-slate-950">

      {/* LEFT — IMAGE */}
      <div className="relative hidden md:block">
        {images.map((img, i) => (
          <Image
            key={i}
            src={img}
            alt=""
            fill
            className={`object-cover transition-opacity duration-1000 ${
              i === currentImage ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* text */}
        <div className="absolute bottom-12 left-12 text-white max-w-sm">
          <h2 className="text-3xl font-semibold mb-3">
            Reina Store
          </h2>
          <p className="text-sm text-white/70 leading-relaxed">
            Premium ladies slippers crafted for comfort and elegance.
            Experience modern fashion with Sri Lankan touch.
          </p>
        </div>
      </div>

      {/* RIGHT — FORM */}
      <div className="flex items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-white">
              Sign in
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Enter your credentials to continue
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-400/20 px-3 py-2 rounded-md">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-sm text-slate-300">
                Email address
              </label>
              <input
                type="email"
                className="w-full mt-1 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-slate-300">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={show ? "text" : "password"}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Options */}
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

            {/* Button */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-medium transition"
            >
              {loading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-slate-400 text-center mt-8">
            Don’t have an account?{" "}
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