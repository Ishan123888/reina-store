"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  ArrowRight,
  Star,
  Truck,
  Shield,
  RotateCcw,
  MapPin,
  Clock,
  CheckCircle,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { getSupabaseBrowserClient } from "@/core/configs/supabase-browser";

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category?: string;
}

// Hero carousel slides — Ladies Slippers Only
const heroSlides = [
  {
    src: "https://i.imgur.com/VG7Jjw0.jpeg",
    alt: "Elegant ladies slippers — Reina Store",
  },
  {
    src: "https://i.imgur.com/nP2cWaY.jpeg",
    alt: "Premium women slippers — Reina Store",
  },
  {
    src: "https://imgur.com/K1YRX5o.png",
    alt: "Luxury slipper collection — Reina Store",
  },
];

// Data constants
const features = [
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Fast Island Delivery",
    desc: "Cash on Delivery available islandwide. Quick and secure service.",
    accent: "#22d3ee",
    tag: "Islandwide",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Premium Quality",
    desc: "High-quality materials tested for ultimate comfort and durability.",
    accent: "#818cf8",
    tag: "Premium",
  },
  {
    icon: <RotateCcw className="w-6 h-6" />,
    title: "Easy Returns",
    desc: "Hassle-free 7-day returns. Your satisfaction is our priority.",
    accent: "#34d399",
    tag: "Trusted",
  },
];

const stats = [
  { icon: <Clock className="w-5 h-5" />, stat: "24hr", label: "Avg Delivery" },
  { icon: <MapPin className="w-5 h-5" />, stat: "25+", label: "Districts" },
  { icon: <Star className="w-5 h-5" />, stat: "500+", label: "Customers" },
  { icon: <CheckCircle className="w-5 h-5" />, stat: "100%", label: "Secure COD" },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const totalSlides = heroSlides.length;

  // Advance to next slide (left direction — slides move left)
  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSlideDirection("right");
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setTimeout(() => setIsTransitioning(false), 850);
  }, [isTransitioning, totalSlides]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSlideDirection("left");
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setTimeout(() => setIsTransitioning(false), 850);
  }, [isTransitioning, totalSlides]);

  // Auto-play every 4.2s
  useEffect(() => {
    autoPlayRef.current = setInterval(nextSlide, 4200);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [nextSlide]);

  // Reset timer on manual nav
  const handleManualNav = (fn: () => void) => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    fn();
    autoPlayRef.current = setInterval(nextSlide, 4200);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setSlideDirection(index > currentSlide ? "right" : "left");
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 850);
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(nextSlide, 4200);
  };

  useEffect(() => {
    async function init() {
      try {
        const supabase = getSupabaseBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsAuthenticated(false);
          setProducts([]);
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);
        const response = await fetch("/api/products?limit=6");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        setProducts(result.data || result || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-slate-950">

      {/* ===================== HERO ===================== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* ── Carousel: sliding track (left ↔ right) ── */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="flex h-full transition-transform duration-850 ease-[cubic-bezier(0.77,0,0.18,1)] will-change-transform"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {heroSlides.map((slide, i) => (
              <div
                key={i}
                className="relative min-w-full h-full shrink-0 overflow-hidden"
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className={`object-cover object-center transition-transform duration-8000 ease-out ${
                    i === currentSlide ? "scale-[1.06]" : "scale-100"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Cinematic overlays */}
          <div className="absolute inset-0 bg-linear-to-b from-slate-950/65 via-slate-950/35 to-slate-950/90 z-10" />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950/55 via-transparent to-slate-950/55 z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-t from-slate-950 to-transparent z-10" />
        </div>

        {/* Ambient glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-75 bg-cyan-500/8 blur-[120px] rounded-full pointer-events-none z-10" />
        <div className="absolute bottom-1/4 left-1/4 w-75 h-75 bg-indigo-500/8 blur-[100px] rounded-full pointer-events-none z-10" />

        {/* ── Left Nav Arrow ── */}
        <button
          onClick={() => handleManualNav(prevSlide)}
          aria-label="Previous slide"
          className="absolute left-7 top-1/2 -translate-y-1/2 z-30 w-13.5 h-13.5 rounded-full flex items-center justify-center border border-white/15 bg-white/5 backdrop-blur-sm text-white/60 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:shadow-[0_0_24px_rgba(34,211,238,0.2)] transition-all duration-250 active:scale-95"
        >
          <ChevronLeft size={22} />
        </button>

        {/* ── Right Nav Arrow ── */}
        <button
          onClick={() => handleManualNav(nextSlide)}
          aria-label="Next slide"
          className="absolute right-7 top-1/2 -translate-y-1/2 z-30 w-13.5 h-13.5 rounded-full flex items-center justify-center border border-white/15 bg-white/5 backdrop-blur-sm text-white/60 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:shadow-[0_0_24px_rgba(34,211,238,0.2)] transition-all duration-250 active:scale-95"
        >
          <ChevronRight size={22} />
        </button>

        {/* Hero content */}
        <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-normal tracking-[0.25em] text-cyan-400 uppercase">
              Premium Collection 2026
            </span>
          </div>

          {/* Headline */}
          <h1 className="hero-title text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] font-normal leading-none tracking-tight mb-6">
            Walk on{" "}
            <span className="relative inline-block">
              <span className="text-cyan-400">Clouds.</span>
              <span className="absolute -bottom-2 left-0 right-0 h-px bg-linear-to-r from-transparent via-cyan-400/60 to-transparent" />
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-base md:text-lg text-slate-300/75 max-w-xl leading-relaxed font-light mb-10">
            Experience the perfect fusion of Sri Lankan craftsmanship and modern luxury.
            Premium slippers designed for your daily comfort.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/collections"
                  className="btn-primary-modern btn-glow inline-flex items-center gap-2 px-10 py-4 text-sm font-normal tracking-widest uppercase rounded-lg"
                >
                  Shop Now <Zap size={15} />
                </Link>
                <Link
                  href="/customer-dashboard"
                  className="btn-outline-modern inline-flex items-center gap-2 px-8 py-4 text-sm font-normal tracking-wider uppercase rounded-lg"
                >
                  My Dashboard <ArrowRight size={15} />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn-primary-modern btn-glow inline-flex items-center gap-2 px-10 py-4 text-sm font-normal tracking-widest uppercase rounded-lg"
                >
                  Login <Zap size={15} />
                </Link>
                <Link
                  href="/register"
                  className="btn-outline-modern inline-flex items-center gap-2 px-8 py-4 text-sm font-normal tracking-wider uppercase rounded-lg"
                >
                  Create Account <ArrowRight size={15} />
                </Link>
              </>
            )}
          </div>

          {/* Scroll hint */}
          <div className="mt-20 flex flex-col items-center gap-2 opacity-40">
            <span className="text-[9px] tracking-[0.3em] uppercase text-slate-400 font-light">
              Scroll
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400 animate-bounce" />
          </div>
        </div>

        {/* ── Dots ── */}
        <div className="absolute bottom-14 left-0 right-0 z-20 flex items-center justify-center gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="transition-all duration-400"
              style={{
                width: i === currentSlide ? "26px" : "6px",
                height: "5px",
                borderRadius: "3px",
                background:
                  i === currentSlide
                    ? "#22d3ee"
                    : "rgba(255,255,255,0.28)",
                boxShadow:
                  i === currentSlide
                    ? "0 0 10px rgba(34,211,238,0.55)"
                    : "none",
                border: "none",
                cursor: "pointer",
                outline: "none",
              }}
            />
          ))}
        </div>

        {/* ── Slide counter top-right ── */}
        <div className="absolute top-24 right-8 z-20 flex items-center gap-2 opacity-40">
          <span className="text-white text-sm font-light tabular-nums">
            {String(currentSlide + 1).padStart(2, "0")}
          </span>
          <div className="w-12 h-px bg-white/30 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-cyan-400 transition-all duration-700"
              style={{
                width: `${((currentSlide + 1) / totalSlides) * 100}%`,
              }}
            />
          </div>
          <span className="text-white/40 text-sm font-light tabular-nums">
            {String(totalSlides).padStart(2, "0")}
          </span>
        </div>

        {/* ── Slide label bottom-left ── */}
        <div className="absolute bottom-14 left-8 z-20">
          <span className="text-[9px] tracking-[0.25em] uppercase text-white/30 font-light">
            Reina Store &nbsp;/&nbsp; Ladies Collection
          </span>
        </div>
      </section>

      {/* ===================== STATS ===================== */}
      <section className="relative z-10 py-8 px-6 bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="w-full h-px bg-linear-to-r from-transparent via-slate-700/60 to-transparent mb-10" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2">
                <div className="text-cyan-400/70">{s.icon}</div>
                <div className="text-3xl font-normal hero-title tracking-tight">
                  {s.stat}
                </div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-light">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          <div className="w-full h-px bg-linear-to-r from-transparent via-slate-700/60 to-transparent mt-10" />
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section className="py-24 px-6 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <p className="text-[10px] tracking-[0.3em] uppercase text-cyan-400/80 font-normal">
              Why Reina
            </p>
            <h2 className="text-4xl md:text-5xl font-normal hero-title">
              Built Around <span className="text-cyan-400">You.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="glass-soft glass-hover p-8 group flex flex-col items-start"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110"
                  style={{
                    background: `${f.accent}12`,
                    border: `1px solid ${f.accent}25`,
                  }}
                >
                  <div style={{ color: f.accent }}>{f.icon}</div>
                </div>
                <h3 className="text-lg font-normal mb-3 hero-title">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light flex-1">
                  {f.desc}
                </p>
                <span
                  className="text-[9px] font-normal px-3 py-1.5 rounded-md tracking-[0.15em] uppercase"
                  style={{
                    background: `${f.accent}10`,
                    color: f.accent,
                    border: `1px solid ${f.accent}20`,
                  }}
                >
                  {f.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== PRODUCTS ===================== */}
      <section className="py-24 px-6 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="space-y-2">
              <p className="text-[10px] tracking-[0.3em] uppercase text-cyan-400/80 font-normal">
                New Drops
              </p>
              <h2 className="text-4xl md:text-5xl font-normal hero-title">
                Trending <span className="text-cyan-400">Now.</span>
              </h2>
              <p className="text-slate-400 font-light text-sm">
                Handpicked exclusive designs for modern elegance.
              </p>
            </div>
            <Link
              href="/collections"
              className="self-start md:self-auto text-cyan-400 text-sm font-normal flex items-center gap-2 group transition-all hover:gap-3"
            >
              Explore All{" "}
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          {!loading && isAuthenticated === false ? (
            <div className="glass-panel p-14 text-center flex flex-col items-center gap-6">
              <ShoppingBag className="w-10 h-10 text-slate-600" />
              <div className="space-y-2">
                <h3 className="text-2xl font-normal hero-title">Members Only</h3>
                <p className="text-slate-400 text-sm max-w-sm font-light">
                  Login or register to browse our exclusive slipper collections.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                <Link
                  href="/login"
                  className="btn-outline-modern px-7 py-3 rounded-lg text-sm font-normal"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn-primary-modern px-7 py-3 rounded-lg text-sm font-normal"
                >
                  Register
                </Link>
              </div>
            </div>
          ) : loading || isAuthenticated === null ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-80 glass-panel animate-pulse rounded-2xl"
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.slice(0, 3).map((p) => (
                <div key={p.id} className="product-card group">
                  <div className="glass-panel overflow-hidden aspect-4/5 relative rounded-2xl border-none">
                    <Image
                      src={
                        p.image_url ||
                        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600"
                      }
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-5 left-5 right-5 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <Link
                        href={`/product/${p.id}`}
                        className="w-full py-3.5 bg-white text-slate-950 text-xs font-normal tracking-widest uppercase rounded-xl flex items-center justify-center gap-2"
                      >
                        View Details <ShoppingBag size={14} />
                      </Link>
                    </div>
                  </div>
                  <div className="mt-5 flex justify-between items-start px-1">
                    <div className="space-y-1">
                      <p className="text-[9px] text-cyan-400 font-normal uppercase tracking-widest">
                        {p.category || "New Arrival"}
                      </p>
                      <h3 className="text-base font-normal text-slate-200">
                        {p.name}
                      </h3>
                    </div>
                    <p className="text-base font-normal text-white whitespace-nowrap">
                      Rs. {p.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel p-10 text-center text-slate-500 text-sm font-light">
              No products available right now.
            </div>
          )}
        </div>
      </section>

      {/* ===================== CTA BANNER ===================== */}
      <section className="py-32 px-6 bg-slate-950">
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <Image
              src={heroSlides[currentSlide].src}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center opacity-15 transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" />
          </div>
          <div className="absolute top-0 left-12 right-12 h-px bg-linear-to-r from-transparent via-cyan-500/50 to-transparent" />

          <div className="relative z-10 py-20 px-8 md:px-20 text-center flex flex-col items-center gap-6">
            <p className="text-[10px] tracking-[0.3em] uppercase text-cyan-400/80 font-normal">
              Join the Community
            </p>
            <h2 className="text-4xl md:text-6xl font-normal hero-title leading-tight">
              Step Into <span className="text-cyan-400">Luxury.</span>
            </h2>
            <p className="text-slate-400 text-base max-w-md font-light leading-relaxed">
              Join over 500+ women who prioritize both style and comfort. Fast
              delivery and secure payments guaranteed.
            </p>
            <Link
              href="/collections"
              className="btn-primary-modern btn-glow inline-flex items-center gap-2 px-12 py-4 text-sm font-normal uppercase tracking-widest rounded-xl mt-2"
            >
              Shop Collection <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center bg-slate-950 border-t border-slate-800/50">
        <p className="text-slate-600 text-[10px] tracking-[0.25em] uppercase font-light">
          &copy; 2026 Reina Store. All rights reserved.
        </p>
      </footer>
    </div>
  );
}