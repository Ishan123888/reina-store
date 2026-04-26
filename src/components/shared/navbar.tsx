"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Menu,
  X,
  Sun,
  Moon,
  Crown,
  User,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useTheme } from "next-themes";
import { getSupabaseBrowserClient } from "@/core/configs/supabase-browser";
import {
  getDashboardPath,
  resolveUserRole,
} from "@/core/auth/auth-helpers";

interface UserProfile {
  id: string;
  role: string;
  full_name?: string | null;
  email?: string | null;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [supabase] = useState(() => getSupabaseBrowserClient());
  const { theme, setTheme } = useTheme();
  const { cartCount } = useCart();
  const navBackgroundImage = "/contact-bg.png";

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUserProfile(null);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, role, full_name, email")
        .eq("id", user.id)
        .maybeSingle();

      const role = resolveUserRole(profile?.role, user.email);

      setUserProfile({
        id: user.id,
        role,
        full_name: profile?.full_name ?? null,
        email: profile?.email ?? user.email ?? null,
      });
    }

    checkUser();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => checkUser());

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [supabase]);

  const isAdmin = userProfile?.role === "admin";
  const displayName =
    userProfile?.full_name || userProfile?.email?.split("@")[0] || "User";

  const navLinks = userProfile
    ? isAdmin
      ? [{ href: "/dashboard", label: "Admin Dashboard" }]
      : [
          { href: "/customer-dashboard", label: "My Dashboard" },
          { href: "/cart", label: "Cart" },
        ]
    : [
        { href: "/", label: "Home" },
        { href: "/collections", label: "Shop" },
        { href: "/track-order", label: "Track Order" },
        { href: "/contact", label: "Contact" },
      ];

  const userIconHref = userProfile
    ? getDashboardPath(userProfile.role as "admin" | "customer")
    : "/login";

  return (
    <nav
      className={`sticky top-0 z-50 overflow-hidden font-sans transition-all duration-500 ${
        scrolled
          ? "bg-white/72 dark:bg-slate-950/70 backdrop-blur-2xl shadow-xl shadow-slate-950/10 dark:shadow-black/30"
          : "bg-white/58 dark:bg-slate-950/52 backdrop-blur-xl"
      } border-b border-white/35 dark:border-white/10`}
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.88), rgba(255,255,255,0.72)), url("${navBackgroundImage}")`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 hidden dark:block"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(2,6,23,0.88), rgba(2,6,23,0.74)), url("${navBackgroundImage}")`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-white/20 dark:bg-slate-950/20" />

      <style>{`
        @keyframes badge-pop {
          0% { transform: scale(0); }
          70% { transform: scale(1.25); }
          100% { transform: scale(1); }
        }
        .badge-pop { animation: badge-pop 0.3s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>

      <div className="relative container mx-auto px-6 h-20 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full scale-[2.2] bg-blue-500/10 blur-2xl group-hover:bg-blue-400/25 group-hover:scale-[2.8] transition-all duration-700" />
            <div className="absolute inset-0 rounded-full scale-[1.5] bg-blue-500/15 blur-lg group-hover:bg-blue-400/35 group-hover:scale-[1.8] transition-all duration-500" />
            <div
              className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-blue-400/60 group-hover:border-blue-300/90 bg-white dark:bg-slate-900 shadow-[0_0_20px_rgba(59,130,246,0.35)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] group-hover:scale-110 transition-all duration-500 ease-out z-10"
            >
              <Image
                src="https://imgur.com/gQqHcDM.png"
                alt="Reina Logo"
                fill
                priority
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 rounded-full bg-linear-to-b from-white/20 via-transparent to-black/5 pointer-events-none" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-2 rounded-full bg-blue-500/20 blur-md group-hover:w-14 transition-all duration-500" />
          </div>

          <div className="flex flex-col justify-center -space-y-0.5">
            <span className="text-[9px] font-black uppercase tracking-[0.35em] leading-none text-transparent bg-clip-text bg-linear-to-r from-blue-500/70 to-indigo-500/70 dark:from-blue-400/70 dark:to-indigo-400/70 group-hover:from-blue-500 group-hover:to-indigo-500 transition-all duration-300">
              Premium Quality
            </span>
            <span className="text-xl md:text-[1.4rem] font-black tracking-tight uppercase italic leading-tight">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300">
                Reina
              </span>
              <span className="text-gray-900 dark:text-white"> Slippers</span>
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1 rounded-full border border-white/45 bg-white/45 px-2 py-1 shadow-lg shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/35 dark:shadow-black/20">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative rounded-full px-4 py-2 text-sm font-medium tracking-[0.02em] text-slate-700 dark:text-slate-200 transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-300 group"
            >
              {item.label}
              <span className="absolute bottom-1 left-1/2 h-px w-0 -translate-x-1/2 rounded-full bg-linear-to-r from-blue-500 to-cyan-400 transition-all duration-300 group-hover:w-2/3" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-2.5">
          {userProfile && (
            <div className="hidden lg:flex items-center gap-3 rounded-2xl border border-white/45 bg-white/50 px-3 py-2 shadow-lg shadow-slate-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/35 dark:shadow-black/20">
              <div className="text-right leading-tight">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  {userProfile.role}
                </p>
                <p className="max-w-45 truncate text-sm font-medium text-slate-900 dark:text-white">
                  {displayName}
                </p>
                <p className="max-w-45 truncate text-[11px] text-slate-500 dark:text-slate-400">
                  {userProfile.email}
                </p>
              </div>
            </div>
          )}

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/45 bg-white/55 text-slate-600 shadow-lg shadow-slate-950/5 backdrop-blur-xl transition-all duration-300 hover:scale-110 dark:border-white/10 dark:bg-slate-900/35 dark:text-slate-300 dark:shadow-black/20 outline-none"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun size={15} className="text-yellow-400" />
              ) : (
                <Moon size={15} className="text-slate-500" />
              )}
            </button>
          )}

          {!isAdmin && (
            <Link
              href="/cart"
              className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-white/45 bg-white/55 text-slate-600 shadow-lg shadow-slate-950/5 backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:bg-blue-50/80 dark:border-white/10 dark:bg-slate-900/35 dark:text-slate-300 dark:shadow-black/20 dark:hover:bg-blue-950/30"
            >
              <ShoppingCart
                size={15}
                className="group-hover:-translate-y-0.5 transition-transform"
              />
              {mounted && cartCount > 0 && (
                <span className="badge-pop absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black shadow-[0_2px_8px_rgba(59,130,246,0.5)]">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          <Link
            href={userIconHref}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/45 bg-white/55 text-slate-600 shadow-lg shadow-slate-950/5 backdrop-blur-xl transition-all duration-300 hover:scale-110 dark:border-white/10 dark:bg-slate-900/35 dark:text-slate-300 dark:shadow-black/20"
            title={
              userProfile
                ? `${displayName} (${isAdmin ? "Admin" : "Customer"})`
                : "Login"
            }
          >
            {isAdmin ? <Crown size={15} /> : <User size={15} />}
          </Link>

          {userProfile && (
            <button
              onClick={handleSignOut}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-red-200/60 bg-red-50/80 text-red-500 shadow-lg shadow-red-500/10 backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:bg-red-500 hover:text-white dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-500"
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          )}

          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/45 bg-white/55 text-slate-900 shadow-lg shadow-slate-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/35 dark:text-white dark:shadow-black/20 md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="relative border-t border-white/30 bg-white/68 px-6 py-6 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70 md:hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.4)), url("${navBackgroundImage}")`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
          <div className="pointer-events-none absolute inset-0 hidden dark:block bg-slate-950/35" />
          <div className="relative flex flex-col gap-5">
            {userProfile && (
              <div className="rounded-2xl border border-white/45 bg-white/45 px-4 py-3 shadow-lg shadow-slate-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-black/20">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  {userProfile.role}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                  {displayName}
                </p>
                <p className="mt-1 break-all text-xs text-slate-500 dark:text-slate-400">
                  {userProfile.email}
                </p>
              </div>
            )}

            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-2xl border border-white/40 bg-white/35 px-4 py-3 text-sm font-medium tracking-[0.02em] text-slate-700 shadow-lg shadow-slate-950/5 backdrop-blur-xl transition-colors hover:text-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:shadow-black/20 dark:hover:text-blue-300"
              >
                {item.label}
              </Link>
            ))}

            {userProfile && (
              <button
                onClick={handleSignOut}
                className="mt-2 flex items-center gap-3 rounded-2xl border border-red-200/60 bg-red-50/80 px-4 py-3 text-sm font-medium tracking-[0.02em] text-red-500 shadow-lg shadow-red-500/10 backdrop-blur-xl dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400"
              >
                <LogOut size={15} /> Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
