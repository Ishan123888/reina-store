"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, User, Menu, Search, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useTheme } from 'next-themes';
import { createBrowserClient } from "@supabase/ssr";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const { cartCount } = useCart();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        setUserRole(profile?.role || 'customer');
      } else {
        setUserRole(null);
      }
    }

    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => checkUser());
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ✅ SIMPLE & CORRECT LOGIC:
  // User icon සෑම විටම /login වෙත යවනවා
  // Login page ඇතුළෙදී role check කරලා redirect කරනවා
  // (admin styled differently just visually)

  return (
    <nav className={`sticky top-0 z-50 font-sans transition-all duration-500 ${
      scrolled
        ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-black/30'
        : 'bg-white/75 dark:bg-slate-950/75 backdrop-blur-lg'
    } border-b border-gray-100/40 dark:border-slate-800/40`}>

      <div className="container mx-auto px-6 h-20 flex items-center justify-between">

        {/* ═══ LOGO ═══ */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full scale-[2.2]
              bg-blue-500/10 blur-2xl
              group-hover:bg-blue-400/25 group-hover:scale-[2.8]
              transition-all duration-700" />
            <div className="absolute inset-0 rounded-full scale-[1.5]
              bg-blue-500/15 blur-lg
              group-hover:bg-blue-400/35 group-hover:scale-[1.8]
              transition-all duration-500" />
            <div className="absolute inset-0 rounded-full scale-[1.15]
              bg-linear-to-br from-blue-400/30 to-indigo-600/20 blur-md
              group-hover:from-blue-300/50 group-hover:to-indigo-500/35
              group-hover:scale-[1.3]
              transition-all duration-400" />
            <div className="absolute inset-0 rounded-full
              border border-blue-400/30
              group-hover:border-blue-300/60
              group-hover:rotate-180
              transition-all duration-1200 ease-in-out" />
            <div className="relative w-14 h-14 rounded-full overflow-hidden
              border-2 border-blue-400/60
              group-hover:border-blue-300/90
              bg-linear-to-br from-white via-blue-50/80 to-white
              dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900
              shadow-[0_0_0_1px_rgba(59,130,246,0.15),0_0_20px_rgba(59,130,246,0.35),0_0_40px_rgba(59,130,246,0.15),0_8px_25px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-1px_0_rgba(0,0,0,0.05)]
              group-hover:shadow-[0_0_0_1px_rgba(59,130,246,0.4),0_0_30px_rgba(59,130,246,0.6),0_0_60px_rgba(99,102,241,0.3),0_0_90px_rgba(59,130,246,0.15),0_12px_35px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(0,0,0,0.05)]
              group-hover:scale-110
              transition-all duration-500 ease-out">
              <Image
                src="https://i.imgur.com/9sBrxmb.png"
                alt="Reina Logo"
                fill
                priority
                unoptimized
                className="object-contain p-2.5 drop-shadow-sm group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 rounded-full
                bg-linear-to-b from-white/40 via-transparent to-transparent
                group-hover:from-white/60
                transition-all duration-500 pointer-events-none" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2
              w-10 h-2 rounded-full bg-blue-500/20 blur-md
              group-hover:w-14 group-hover:bg-blue-400/40 group-hover:blur-lg
              transition-all duration-500" />
            <div className="absolute top-1.5 right-2.5
              w-2 h-2 rounded-full bg-white/70
              group-hover:bg-white/90 group-hover:w-2.5 group-hover:h-2.5
              blur-[1px] transition-all duration-300 pointer-events-none" />
          </div>

          <div className="flex flex-col justify-center -space-y-0.5">
            <span className="text-[9px] font-black uppercase tracking-[0.35em] leading-none
              text-transparent bg-clip-text
              bg-linear-to-r from-blue-500/70 to-indigo-500/70
              dark:from-blue-400/70 dark:to-indigo-400/70
              group-hover:from-blue-500 group-hover:to-indigo-500
              transition-all duration-300">
              Premium Quality
            </span>
            <span className="text-xl md:text-[1.4rem] font-black tracking-tight uppercase italic leading-tight">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600
                dark:from-blue-400 dark:to-indigo-400
                group-hover:from-blue-500 group-hover:to-purple-600
                transition-all duration-300">
                Reina
              </span>
              <span className="text-gray-900 dark:text-white"> Slippers</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { href: "/", label: "Home" },
            { href: "/collections", label: "Shop" },
            { href: "/track-order", label: "Track Order" },
            { href: "/contact", label: "Contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em]
                text-gray-500 dark:text-gray-400
                hover:text-blue-600 dark:hover:text-blue-400
                transition-colors duration-200 group"
            >
              {item.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5
                bg-linear-to-r from-blue-600 to-indigo-600 rounded-full
                group-hover:w-3/4 transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2 md:gap-2.5">

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 rounded-full flex items-center justify-center
                bg-gray-100 dark:bg-slate-800
                border border-gray-200/60 dark:border-slate-700/60
                shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]
                dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)]
                hover:scale-110 hover:shadow-[0_4px_14px_rgba(0,0,0,0.1)]
                transition-all duration-300 outline-none"
              aria-label="Toggle Theme"
            >
              {theme === 'dark'
                ? <Sun size={15} className="text-yellow-400" />
                : <Moon size={15} className="text-slate-500" />
              }
            </button>
          )}

          {/* Search */}
          <button className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center
            bg-gray-100 dark:bg-slate-800
            border border-gray-200/60 dark:border-slate-700/60
            shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]
            dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)]
            hover:scale-110 hover:bg-blue-50 dark:hover:bg-blue-950/30
            hover:border-blue-200 dark:hover:border-blue-800
            hover:text-blue-600 dark:hover:text-blue-400
            text-gray-500 dark:text-gray-400
            transition-all duration-300 outline-none">
            <Search size={15} />
          </button>

          {/* Cart */}
          <Link href="/cart"
            className="relative w-9 h-9 rounded-full flex items-center justify-center
              bg-gray-100 dark:bg-slate-800
              border border-gray-200/60 dark:border-slate-700/60
              shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]
              dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)]
              hover:scale-110 hover:bg-blue-50 dark:hover:bg-blue-950/30
              hover:border-blue-200 dark:hover:border-blue-800
              hover:text-blue-600 dark:hover:text-blue-400
              text-gray-500 dark:text-gray-400
              transition-all duration-300 group">
            <ShoppingCart size={15} className="group-hover:-translate-y-0.5 transition-transform" />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] w-4 h-4
                rounded-full flex items-center justify-center font-black
                shadow-[0_2px_8px_rgba(59,130,246,0.5)]">
                {cartCount}
              </span>
            )}
          </Link>

          {/* ✅ User Icon - ALWAYS goes to /login
              Login page ඇතුළෙදී role check → admin=/dashboard, customer=/collections
              Admin නම් visually blue glow style show කරනවා */}
          <Link
            href="/login"
            className={`w-9 h-9 rounded-full flex items-center justify-center
              border transition-all duration-300 hover:scale-110
              ${mounted && userRole === 'admin'
                ? 'bg-linear-to-br from-blue-500 to-indigo-600 border-blue-400/50 text-white shadow-[0_2px_15px_rgba(59,130,246,0.5),0_0_30px_rgba(99,102,241,0.2)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.7),0_0_40px_rgba(99,102,241,0.3)]'
                : 'bg-gray-100 dark:bg-slate-800 border-gray-200/60 dark:border-slate-700/60 text-gray-500 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-200 shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]'
              }`}
          >
            <User size={15} />
          </Link>

          {/* Mobile Toggle */}
          <button
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center
              bg-gray-100 dark:bg-slate-800
              border border-gray-200/60 dark:border-slate-700/60
              shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]
              dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]
              hover:scale-110 transition-all duration-300 outline-none
              text-gray-900 dark:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl
          border-t border-gray-100/50 dark:border-slate-800/50
          px-6 py-6 flex flex-col gap-5">
          {[
            { href: "/", label: "Home" },
            { href: "/collections", label: "Shop" },
            { href: "/track-order", label: "Track Order" },
            { href: "/contact", label: "Contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-black uppercase tracking-[0.25em]
                text-gray-600 dark:text-gray-400
                hover:text-blue-600 dark:hover:text-blue-400
                transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}