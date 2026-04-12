"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Sparkles, LogIn, AlertCircle } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const validateForm = () => {
    if (!email || !password) return "Please fill in all fields.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address.";
    return null;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError(null);

    try {
      // 1. Authenticate User
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      });

      if (authError) {
        setError(authError.message === "Invalid login credentials" ? "Incorrect email or password." : authError.message);
        setLoading(false);
        return;
      }

      if (authData?.user) {
        // 2. Fetch Profile to check Role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", authData.user.id)
          .maybeSingle(); // error එකක් දෙන්නේ නැතුව null දෙනවා profile එක නැත්නම්

        if (profileError) {
          throw new Error("Error fetching user profile.");
        }

        if (!profile) {
          // Profile එකක් නැත්නම් session එක අයින් කරලා error එකක් පෙන්වනවා
          await supabase.auth.signOut();
          setError("User profile not found. Please contact support.");
          setLoading(false);
          return;
        }

        // 3. Optimized Redirect Logic
        const targetRoute = profile.role === "admin" ? "/dashboard" : "/collections";
        window.location.href = targetRoute;
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false); // මෙතනදී loading එක false කරන එක අනිවාර්යයි
    }
  };

  if (!mounted) return null;

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: "#020408", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px", fontFamily: "'Inter', sans-serif",
      backgroundImage: `radial-gradient(circle at 50% -20%, #111827, transparent), radial-gradient(circle at 0% 100%, #030712, transparent)`
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Syne:wght@700;800&display=swap');
        .glass-card { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
        .input-field { background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; width: 100%; padding: 12px 14px; border-radius: 10px; font-size: 14px; outline: none; transition: 0.2s; box-sizing: border-box; }
        .input-field:focus { border-color: #22d3ee; background: rgba(34, 211, 238, 0.05); box-shadow: 0 0 0 1px #22d3ee; }
        .btn-main { background: #fff; color: #000; width: 100%; padding: 12px; border: none; border-radius: 10px; font-weight: 600; font-size: 14px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-main:hover:not(:disabled) { background: #22d3ee; transform: translateY(-1px); }
        .btn-main:disabled { opacity: 0.6; cursor: not-allowed; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div className="glass-card" style={{ width: "100%", maxWidth: "380px", padding: "32px" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ width: 44, height: 44, background: "rgba(34, 211, 238, 0.1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Sparkles size={20} style={{ color: "#22d3ee" }} />
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.5rem", color: "#fff", margin: 0 }}>Welcome Back</h2>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>Sign in to continue to Reina</p>
        </div>

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "10px 12px", borderRadius: 8, fontSize: "12px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "6px", display: "block", fontWeight: 600, letterSpacing: "0.05em" }}>EMAIL</label>
            <input className="input-field" type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div>
            <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "6px", display: "block", fontWeight: 600, letterSpacing: "0.05em" }}>PASSWORD</label>
            <div style={{ position: "relative" }}>
              <input className="input-field" type={showPassword ? "text" : "password"} placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-main" disabled={loading} style={{ marginTop: "4px" }}>
            {loading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <>Sign In <LogIn size={16} /></>}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "24px" }}>
          New to Reina? <Link href="/register" style={{ color: "#22d3ee", textDecoration: "none", fontWeight: 600 }}>Create account</Link>
        </p>
      </div>
    </div>
  );
}