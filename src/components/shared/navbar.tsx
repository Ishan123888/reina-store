"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, Sun, Moon, Crown, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useTheme } from "next-themes";
import { createBrowserClient } from "@supabase/ssr";

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
  const { theme, setTheme } = useTheme();
  const { cartCount } = useCart();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Sign Out Function
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      // '/login' එකට redirect කරනවා. window.location පාවිච්චි කරන්නේ session එක සම්පූර්ණයෙන්ම clear වෙන්නයි.
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
        .single();

      if (!profile) {
        setUserProfile(null);
        return;
      }

      setUserProfile({
        id: user.id,
        role: (profile as any).role || "customer",
        full_name: (profile as any).full_name,
        email: (profile as any).email || user.email,
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
  }, []);

  const isAdmin = userProfile?.role === "admin";
  const displayName = userProfile?.full_name || userProfile?.email?.split("@")[0] || "User";

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
    ? (isAdmin ? "/dashboard" : "/customer-dashboard") 
    : "/login";

  return (
    <nav
      className={`sticky top-0 z-50 font-sans transition-all duration-500 ${
        scrolled
          ? "bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-black/30"
          : "bg-white/75 dark:bg-slate-950/75 backdrop-blur-lg"
      } border-b border-gray-100/40 dark:border-slate-800/40`}
    >
      <style>{`
        @keyframes badge-pop {
          0%   { transform: scale(0); }
          70%  { transform: scale(1.25); }
          100% { transform: scale(1); }
        }
        .badge-pop { animation: badge-pop 0.3s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>

      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full scale-[2.2] bg-blue-500/10 blur-2xl group-hover:bg-blue-400/25 group-hover:scale-[2.8] transition-all duration-700" />
            <div className="absolute inset-0 rounded-full scale-[1.5] bg-blue-500/15 blur-lg group-hover:bg-blue-400/35 group-hover:scale-[1.8] transition-all duration-500" />
            <div
              className="relative w-14 h-14 rounded-full overflow-hidden
              border-2 border-blue-400/60
              group-hover:border-blue-300/90
              bg-white dark:bg-slate-900
              shadow-[0_0_20px_rgba(59,130,246,0.35)]
              group-hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]
              group-hover:scale-110
              transition-all duration-500 ease-out z-10"
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

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 group"
            >
              {item.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-blue-600 to-indigo-600 rounded-full group-hover:w-3/4 transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 md:gap-2.5">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700/60 hover:scale-110 transition-all duration-300 outline-none"
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
              className="relative w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700/60 hover:scale-110 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-gray-500 dark:text-gray-400 transition-all duration-300 group"
            >
              <ShoppingCart size={15} className="group-hover:-translate-y-0.5 transition-transform" />
              {mounted && cartCount > 0 && (
                <span className="badge-pop absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black shadow-[0_2px_8px_rgba(59,130,246,0.5)]">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          <Link
            href={userIconHref}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700/60 text-gray-500 dark:text-gray-400 hover:scale-110 transition-all duration-300"
            title={userProfile ? `${displayName} (${isAdmin ? "Admin" : "Customer"})` : "Login"}
          >
            {isAdmin ? <Crown size={15} /> : <User size={15} />}
          </Link>

          {/* New Sign Out Button - Only visible when logged in */}
          {userProfile && (
            <button
              onClick={handleSignOut}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 transition-all duration-300 hover:scale-110"
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          )}

          <button
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700/60 text-gray-900 dark:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-gray-100/50 dark:border-slate-800/50 px-6 py-6 flex flex-col gap-5">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {/* Mobile Sign Out */}
          {userProfile && (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.25em] text-red-500 mt-2"
            >
              <LogOut size={15} /> Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}