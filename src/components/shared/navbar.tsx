"use client";

import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCart,
  Menu,
  Search,
  X,
  Sun,
  Moon,
  Crown,
  User,
  ChevronDown,
  LogOut,
  Package,
  MapPin,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { useTheme } from 'next-themes';
import { createBrowserClient } from "@supabase/ssr";

interface UserProfile {
  id: string;
  role: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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
          .select("id, role, full_name, email, phone, address")
          .eq("id", user.id)
          .single();
        if (profile) {
          setUserProfile({
            id: user.id,
            role: (profile as any).role || 'customer',
            full_name: (profile as any).full_name,
            email: (profile as any).email || user.email,
            phone: (profile as any).phone,
            address: (profile as any).address,
          });
        } else {
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
    }

    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => checkUser());

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserProfile(null);
    setDropdownOpen(false);
    window.location.href = '/login';
  };

  const isAdmin = userProfile?.role === 'admin';
  const displayName = userProfile?.full_name || userProfile?.email?.split('@')[0] || 'User';
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <nav className={`sticky top-0 z-50 font-sans transition-all duration-500 ${
      scrolled
        ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-black/30'
        : 'bg-white/75 dark:bg-slate-950/75 backdrop-blur-lg'
    } border-b border-gray-100/40 dark:border-slate-800/40`}>

      <style>{`
        @keyframes dropdown-in {
          from { opacity: 0; transform: translateY(-8px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .dropdown-animate {
          animation: dropdown-in 0.18s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes badge-pop {
          0%   { transform: scale(0); }
          70%  { transform: scale(1.25); }
          100% { transform: scale(1); }
        }
        .badge-pop { animation: badge-pop 0.3s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>

      <div className="container mx-auto px-6 h-20 flex items-center justify-between">

        {/* ═══ LOGO ═══ */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full scale-[2.2] bg-blue-500/10 blur-2xl group-hover:bg-blue-400/25 group-hover:scale-[2.8] transition-all duration-700" />
            <div className="absolute inset-0 rounded-full scale-[1.5] bg-blue-500/15 blur-lg group-hover:bg-blue-400/35 group-hover:scale-[1.8] transition-all duration-500" />
            <div className="relative w-14 h-14 rounded-full overflow-hidden
              border-2 border-blue-400/60
              group-hover:border-blue-300/90
              bg-white dark:bg-slate-900
              shadow-[0_0_20px_rgba(59,130,246,0.35)]
              group-hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]
              group-hover:scale-110
              transition-all duration-500 ease-out z-10">
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
              className="relative px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 group"
            >
              {item.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-blue-600 to-indigo-600 rounded-full group-hover:w-3/4 transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2 md:gap-2.5">
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700/60 hover:scale-110 transition-all duration-300 outline-none"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={15} className="text-yellow-400" /> : <Moon size={15} className="text-slate-500" />}
            </button>
          )}

          {/* Search */}
          <button className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center bg-gray-100 dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700/60 hover:scale-110 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-gray-500 dark:text-gray-400 transition-all duration-300 outline-none">
            <Search size={15} />
          </button>

          {/* Cart */}
          <Link href="/cart" className="relative w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700/60 hover:scale-110 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-gray-500 dark:text-gray-400 transition-all duration-300 group">
            <ShoppingCart size={15} className="group-hover:-translate-y-0.5 transition-transform" />
            {mounted && cartCount > 0 && (
              <span className="badge-pop absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black shadow-[0_2px_8px_rgba(59,130,246,0.5)]">
                {cartCount}
              </span>
            )}
          </Link>

          {/* ════ USER PROFILE AREA ════ */}
          {mounted && (
            <>
              {userProfile ? (
                /* Logged In User */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 hover:scale-105 ${
                      isAdmin
                        ? 'bg-linear-to-r from-amber-400/20 to-orange-400/20 border-amber-400/40 hover:border-amber-400/70'
                        : 'bg-linear-to-r from-blue-500/10 to-indigo-500/10 border-blue-400/30 hover:border-blue-400/60'
                    }`}
                  >
                    {/* Avatar */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black text-white shadow-sm ${
                      isAdmin
                        ? 'bg-linear-to-br from-amber-400 to-orange-500'
                        : 'bg-linear-to-br from-blue-500 to-indigo-600'
                    }`}>
                      {firstLetter}
                    </div>

                    {/* Name + Role Label */}
                    <div className="hidden sm:flex flex-col items-start leading-none">
                      <div className="flex items-center gap-1">
                        {isAdmin && <Crown size={9} className="text-amber-500" />}
                        <span className={`text-[10px] font-black uppercase tracking-wide truncate max-w-20 ${
                          isAdmin ? 'text-amber-600 dark:text-amber-400' : 'text-gray-700 dark:text-gray-200'
                        }`}>
                          {displayName}
                        </span>
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-widest ${
                        isAdmin ? 'text-amber-500/70' : 'text-blue-500/70'
                      }`}>
                        {isAdmin ? '★ Admin' : 'Customer'}
                      </span>
                    </div>

                    <ChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* ════ DROPDOWN ════ */}
                  {dropdownOpen && (
                    <div className="dropdown-animate absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700/60 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden z-50">

                      {/* Header */}
                      <div className={`px-4 py-3 ${
                        isAdmin
                          ? 'bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-b border-amber-100 dark:border-amber-800/30'
                          : 'bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b border-blue-100 dark:border-blue-800/30'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white shadow-md ${
                            isAdmin
                              ? 'bg-linear-to-br from-amber-400 to-orange-500 shadow-amber-200 dark:shadow-amber-900/50'
                              : 'bg-linear-to-br from-blue-500 to-indigo-600 shadow-blue-200 dark:shadow-blue-900/50'
                          }`}>
                            {firstLetter}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              {isAdmin && <Crown size={11} className="text-amber-500 shrink-0" />}
                              <p className={`text-[11px] font-black uppercase tracking-wide truncate ${
                                isAdmin ? 'text-amber-700 dark:text-amber-300' : 'text-gray-800 dark:text-gray-100'
                              }`}>
                                {displayName}
                              </p>
                            </div>
                            <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full mt-0.5 ${
                              isAdmin
                                ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'
                                : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                            }`}>
                              {isAdmin ? '★ Administrator' : '● Customer'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* User Details */}
                      <div className="px-4 py-3 space-y-2 border-b border-gray-50 dark:border-slate-800">
                        {userProfile.email && (
                          <div className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-md bg-gray-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                              <User size={10} className="text-gray-400" />
                            </div>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate leading-tight pt-0.5">
                              {userProfile.email}
                            </p>
                          </div>
                        )}
                        {!isAdmin && userProfile.phone && (
                          <div className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-md bg-gray-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-[8px] text-gray-400">📞</span>
                            </div>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-tight pt-0.5">
                              {userProfile.phone}
                            </p>
                          </div>
                        )}
                        {!isAdmin && userProfile.address && (
                          <div className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-md bg-gray-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                              <MapPin size={10} className="text-gray-400" />
                            </div>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-tight pt-0.5 line-clamp-2">
                              {userProfile.address}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="p-2">
                        {isAdmin ? (
                          <Link
                            href="/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all duration-150 group"
                          >
                            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                              <Crown size={13} className="text-amber-500" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                Admin Dashboard
                              </p>
                              <p className="text-[8px] text-gray-400 font-medium">Manage store</p>
                            </div>
                          </Link>
                        ) : (
                          <Link
                            href="/track-order"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-150 group"
                          >
                            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                              <Package size={13} className="text-blue-500" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                Track My Orders
                              </p>
                              <p className="text-[8px] text-gray-400 font-medium">View order status</p>
                            </div>
                          </Link>
                        )}

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-150 group mt-1"
                        >
                          <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <LogOut size={13} className="text-red-400" />
                          </div>
                          <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-200 group-hover:text-red-500 transition-colors">
                              Sign Out
                            </p>
                            <p className="text-[8px] text-gray-400 font-medium">Logout from account</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Not Logged In */
                <Link
                  href="/login"
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700/60 text-gray-500 dark:text-gray-400 hover:scale-110 transition-all duration-300"
                >
                  <User size={15} />
                </Link>
              )}
            </>
          )}

          {/* Mobile Menu Toggle */}
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
              className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile User Info */}
          {mounted && userProfile && (
            <div className={`mt-2 p-3 rounded-2xl border ${
              isAdmin
                ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/30'
                : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/30'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white ${
                  isAdmin ? 'bg-linear-to-br from-amber-400 to-orange-500' : 'bg-linear-to-br from-blue-500 to-indigo-600'
                }`}>
                  {firstLetter}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {isAdmin && <Crown size={10} className="text-amber-500" />}
                    <p className={`text-[11px] font-black uppercase tracking-wide ${isAdmin ? 'text-amber-700 dark:text-amber-300' : 'text-gray-800 dark:text-gray-100'}`}>
                      {displayName}
                    </p>
                  </div>
                  <p className={`text-[9px] font-black uppercase tracking-widest ${isAdmin ? 'text-amber-500/70' : 'text-blue-500/70'}`}>
                    {isAdmin ? '★ Administrator' : '● Customer'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-center text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}