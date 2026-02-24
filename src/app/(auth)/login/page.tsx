"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, LogIn, Sparkles } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { useTheme } from "next-themes";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // Navbar එකේ ඇති theme එක ලබා ගැනීම
  const { theme, resolvedTheme } = useTheme();

  // Hydration error එක මගහැරීමට (Next.js client-side mounted ද කියා බැලීම)
  useEffect(() => {
    setMounted(true);
  }, []);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !authData.user) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single();

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

  // වර්තමාන theme එක Dark ද කියා පරීක්ෂා කිරීම
  const isDarkMode = mounted && (theme === "dark" || resolvedTheme === "dark");

  // UI Colors based on Theme
  const ui = {
    bg: isDarkMode 
      ? "linear-gradient(135deg, #0d0010 0%, #1a0018 50%, #0d0010 100%)" 
      : "linear-gradient(135deg, #fff5f7 0%, #fce7f3 50%, #fff5f7 100%)",
    cardBg: isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.85)",
    cardBorder: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(236, 72, 153, 0.2)",
    textColor: isDarkMode ? "#ffffff" : "#1a0018",
    labelColor: isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
    inputBg: isDarkMode ? "rgba(255, 255, 255, 0.03)" : "#ffffff",
    inputBorder: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(236, 72, 153, 0.2)",
    shadow: isDarkMode ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" : "0 20px 40px rgba(236, 72, 153, 0.15)",
  };

  if (!mounted) return null; // Hydration ගැටළු මගහැරීමට

  return (
    <div style={{
      minHeight: "calc(100vh - 80px)", // Navbar එකට ඉඩ තබා
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: ui.bg,
      fontFamily: "sans-serif",
      padding: "20px",
      transition: "all 0.5s ease"
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-card {
          animation: fadeIn 0.8s ease-out;
        }
        .input-focus:focus {
          border-color: #ec4899 !important;
          box-shadow: 0 0 15px rgba(236, 72, 153, 0.2);
          outline: none;
        }
        .btn-pink {
          background: linear-gradient(135deg, #be185d, #ec4899, #f472b6);
          transition: transform 0.2s, box-shadow 0.2s;
          border: none;
          color: white;
        }
        .btn-pink:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(236, 72, 153, 0.4);
        }
      `}</style>

      <div className="login-card" style={{
        width: "100%",
        maxWidth: "420px",
        background: ui.cardBg,
        backdropFilter: "blur(20px)",
        border: `1px solid ${ui.cardBorder}`,
        boxShadow: ui.shadow,
        borderRadius: "32px",
        padding: "48px 32px",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.5s ease"
      }}>
        <div style={{
          position: "absolute",
          top: "-10%",
          right: "-10%",
          width: "150px",
          height: "150px",
          background: "rgba(236, 72, 153, 0.2)",
          filter: "blur(50px)",
          borderRadius: "50%"
        }} />

        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Sparkles size={16} style={{ color: "#ec4899" }} />
            <span style={{ color: "#ec4899", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Secure Login
            </span>
          </div>
          <h1 style={{ 
            color: ui.textColor, 
            fontSize: "2.5rem", 
            fontWeight: 800, 
            margin: 0,
            letterSpacing: "-0.02em" 
          }}>
            Welcome Back
          </h1>
        </div>

        {error && (
          <div style={{
            background: "rgba(248, 113, 113, 0.1)",
            border: "1px solid rgba(248, 113, 113, 0.2)",
            color: "#f87171",
            padding: "12px 16px",
            borderRadius: "12px",
            fontSize: "13px",
            marginBottom: "24px",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ color: ui.labelColor, fontSize: "11px", fontWeight: 600, textTransform: "uppercase", paddingLeft: "4px" }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@example.com"
              className="input-focus"
              style={{
                background: ui.inputBg,
                border: `1px solid ${ui.inputBorder}`,
                borderRadius: "16px",
                padding: "16px",
                color: ui.textColor,
                fontSize: "14px",
                transition: "all 0.3s"
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ color: ui.labelColor, fontSize: "11px", fontWeight: 600, textTransform: "uppercase", paddingLeft: "4px" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="input-focus"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: ui.inputBg,
                  border: `1px solid ${ui.inputBorder}`,
                  borderRadius: "16px",
                  padding: "16px",
                  paddingRight: "50px",
                  color: ui.textColor,
                  fontSize: "14px",
                  transition: "all 0.3s"
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: ui.labelColor,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-pink"
            style={{
              marginTop: "10px",
              padding: "16px",
              borderRadius: "16px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <LogIn size={18} />
                SIGN IN
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <p style={{ color: ui.labelColor, fontSize: "12px" }}>
            Don't have an account?{" "}
            <Link href="/register" style={{ 
              color: "#ec4899", 
              textDecoration: "none", 
              fontWeight: 600,
              marginLeft: "4px"
            }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}