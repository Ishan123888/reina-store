"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight, Star, Truck, Shield, Zap, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-950">

      {/* ══════════════════════════ HERO */}
      <section className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden">

        {/* Animated grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59,130,246,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)`,
            transition: "transform 0.15s ease-out",
          }}
        />

        {/* Central glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 60% at calc(50% + ${mousePos.x * 2}px) calc(50% + ${mousePos.y * 2}px), rgba(59,130,246,0.18) 0%, rgba(99,102,241,0.08) 50%, transparent 80%)`,
            transition: "background 0.3s ease-out",
          }}
        />

        {/* Floating orbs */}
        <div className="absolute top-24 left-16 w-72 h-72 rounded-full opacity-[0.08] animate-pulse"
          style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)", animationDuration: "4s" }} />
        <div className="absolute bottom-32 right-20 w-96 h-96 rounded-full opacity-[0.06] animate-pulse"
          style={{ background: "radial-gradient(circle, #818cf8 0%, transparent 70%)", animationDuration: "6s", animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full opacity-[0.05] animate-pulse"
          style={{ background: "radial-gradient(circle, #60a5fa 0%, transparent 70%)", animationDuration: "5s", animationDelay: "2s" }} />

        {/* Scroll parallax image */}
        <div
          className="absolute inset-0 opacity-[0.12] bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1603487759130-107d643831b0?q=80&w=2070')",
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">

          {/* Live badge */}
          <div className="inline-flex items-center gap-2.5 bg-blue-500/10 border border-blue-500/20 rounded-full px-5 py-2.5 mb-10 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-blue-300 text-[10px] font-black uppercase tracking-[0.3em]">
              Islandwide Cash on Delivery
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-black uppercase tracking-tighter leading-[0.9] mb-8">
            <span
              className="block text-6xl md:text-8xl lg:text-[10rem] text-white/90"
              style={{ textShadow: "0 0 80px rgba(59,130,246,0.3)" }}
            >
              Step Into
            </span>
            <span
              className="block text-7xl md:text-9xl lg:text-[11rem]"
              style={{
                background: "linear-gradient(135deg, #60a5fa 0%, #818cf8 45%, #c084fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 30px rgba(99,102,241,0.4))",
              }}
            >
              Comfort
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-lg mx-auto mb-12 leading-relaxed">
            Premium slippers crafted for style and durability.
            <br />
            <span className="text-blue-400 font-bold">Fast delivery</span> across Sri Lanka.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <Link
              href="/collections"
              className="group relative flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm overflow-hidden transition-all duration-300 hover:scale-105"
              style={{ boxShadow: "0 0 30px rgba(59,130,246,0.5), 0 0 60px rgba(59,130,246,0.2)" }}
            >
              {/* ✅ bg-linear-to-r (Tailwind v4) */}
              <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <ShoppingBag size={20} className="relative z-10 group-hover:-translate-y-0.5 transition-transform" />
              <span className="relative z-10">Shop Now</span>
              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/track-order"
              className="flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 hover:border-white/20 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              Track My Order
            </Link>
          </div>

          {/* Stats */}
          {/* ✅ border-white/6 (Tailwind v4) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-white/6 max-w-2xl mx-auto">
            {[
              { value: "500+", label: "Customers" },
              { value: "50+", label: "Models" },
              { value: "24hr", label: "Delivery" },
              { value: "5★", label: "Rating" },
            ].map((s) => (
              <div key={s.label} className="text-center group">
                <div
                  className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-1 group-hover:text-blue-400 transition-colors duration-300"
                  style={{ textShadow: "0 0 20px rgba(59,130,246,0.3)" }}
                >
                  {s.value}
                </div>
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce opacity-30">
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-500">Scroll</span>
          <ChevronDown size={14} className="text-gray-500" />
        </div>
      </section>

      {/* ══════════════════════════ WHY REINA */}
      <section className="bg-white dark:bg-slate-900 py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
              Why Choose Us
            </p>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">
              Built Different<span className="text-blue-600">.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Truck size={26} />,
                title: "Island Delivery",
                desc: "Cash on Delivery available across Sri Lanka. Order now, receive fast.",
                from: "from-blue-500/10",
                to: "to-blue-600/5",
                border: "border-blue-500/20 hover:border-blue-500/40",
                iconCls: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                glow: "rgba(59,130,246,0.15)",
              },
              {
                icon: <Shield size={26} />,
                title: "Quality Guaranteed",
                desc: "Premium materials tested for durability. Every pair built to last.",
                from: "from-purple-500/10",
                to: "to-purple-600/5",
                border: "border-purple-500/20 hover:border-purple-500/40",
                iconCls: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
                glow: "rgba(168,85,247,0.15)",
              },
              {
                icon: <Zap size={26} />,
                title: "Easy Returns",
                desc: "Not satisfied? Hassle-free returns. Your comfort is our priority.",
                from: "from-orange-500/10",
                to: "to-orange-600/5",
                border: "border-orange-500/20 hover:border-orange-500/40",
                iconCls: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
                glow: "rgba(249,115,22,0.15)",
              },
            ].map((f, i) => (
              // ✅ rounded-4xl + bg-linear-to-br (Tailwind v4)
              <div
                key={i}
                className={`relative p-8 rounded-4xl bg-linear-to-br ${f.from} ${f.to} border ${f.border} transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 group overflow-hidden`}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-4xl"
                  style={{ background: `radial-gradient(circle at 30% 20%, ${f.glow}, transparent 60%)` }}
                />
                <div className={`relative z-10 w-14 h-14 rounded-2xl ${f.iconCls} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  {f.icon}
                </div>
                <h3 className="relative z-10 text-lg font-black uppercase tracking-tight text-gray-900 dark:text-white mb-3">
                  {f.title}
                </h3>
                <p className="relative z-10 text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ NEW ARRIVALS */}
      <section className="bg-gray-50 dark:bg-slate-950 py-28 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
            Fresh Drops
          </p>
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-gray-900 dark:text-white mb-6">
            New Arrivals<span className="text-blue-600">.</span>
          </h2>
          <p className="text-gray-400 font-medium mb-12 max-w-md mx-auto">
            Check out our latest slipper designs. New styles added weekly.
          </p>
          <Link
            href="/collections"
            className="group inline-flex items-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            View All Products
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ══════════════════════════ REVIEWS */}
      <section className="bg-white dark:bg-slate-900 py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
              Testimonials
            </p>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">
              Customers Love Us<span className="text-blue-600">.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Dilani P.", location: "Colombo", review: "Best slippers I've bought! Super comfortable and arrived super fast.", stars: 5 },
              { name: "Kasun R.", location: "Kandy", review: "Amazing quality for the price. COD option made it so convenient!", stars: 5 },
              { name: "Nimasha S.", location: "Galle", review: "Loved the design. Will definitely order again for my whole family.", stars: 5 },
            ].map((t, i) => (
              // ✅ rounded-4xl + bg-linear-to-br + from-blue-500/3 (Tailwind v4)
              <div
                key={i}
                className="relative bg-white dark:bg-slate-800 p-8 rounded-4xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-4xl" />
                <div className="relative z-10">
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium leading-relaxed mb-6 italic">
                    "{t.review}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-50 dark:border-slate-700">
                    {/* ✅ bg-linear-to-br (Tailwind v4) */}
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">{t.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{t.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ CTA BANNER */}
      <section className="relative py-36 px-6 bg-slate-950 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 100% 80% at 50% 50%, rgba(59,130,246,0.12) 0%, rgba(99,102,241,0.06) 40%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(59,130,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-6">
            Ready?
          </p>
          <h2
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white mb-6 leading-none"
            style={{ textShadow: "0 0 60px rgba(59,130,246,0.3)" }}
          >
            Step Up<br />
            <span style={{
              background: "linear-gradient(135deg, #60a5fa, #818cf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Today.
            </span>
          </h2>
          <p className="text-gray-500 text-lg mb-12 font-medium">
            Browse our full collection and find your perfect pair.
          </p>
          <Link
            href="/collections"
            className="group inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-14 py-6 rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-300 hover:scale-105"
            style={{ boxShadow: "0 0 40px rgba(59,130,246,0.5), 0 0 80px rgba(59,130,246,0.2)" }}
          >
            <ShoppingBag size={20} />
            Explore Collection
            <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}