"use client";

import Link from "next/link";
import {
  ShoppingBag,
  ArrowRight,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ChevronDown,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState, useRef, CSSProperties } from "react";

// ─── Floating 3D Card ───────────────────────────────────────────────
function Card3D({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientY - r.top) / r.height - 0.5) * -18;
    const y = ((e.clientX - r.left) / r.width - 0.5) * 18;
    setRot({ x, y });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setRot({ x: 0, y: 0 });
        setHover(false);
      }}
      style={{
        transform: `perspective(900px) rotateX(${rot.x}deg) rotateY(${rot.y}deg) ${
          hover ? "scale(1.04)" : "scale(1)"
        }`,
        transition: hover
          ? "transform 0.1s ease-out"
          : "transform 0.5s ease-out",
        transformStyle: "preserve-3d",
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );
}

// ─── Animated Number ────────────────────────────────────────────────
function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let triggered = false;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          let start = 0;
          const step = end / 60;
          const timer = setInterval(() => {
            start += step;
            if (start >= end) {
              setVal(end);
              clearInterval(timer);
            } else {
              setVal(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [end]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

// ─── Static data ─────────────────────────────────────────────────────
const marqueeItems = [
  "Premium Quality",
  "Island Delivery",
  "Cash on Delivery",
  "Easy Returns",
  "500+ Happy Customers",
  "5★ Rated",
];

const features = [
  {
    icon: <Truck size={28} />,
    title: "Island Delivery",
    desc: "Cash on Delivery available islandwide across Sri Lanka. Order today, receive fast.",
    accent: "#f97316",
    glow: "rgba(249,115,22,0.2)",
    border: "rgba(249,115,22,0.2)",
    tag: "FREE COD",
  },
  {
    icon: <Shield size={28} />,
    title: "Quality Guaranteed",
    desc: "Every pair is made from premium materials tested for durability and long-lasting comfort.",
    accent: "#a855f7",
    glow: "rgba(168,85,247,0.2)",
    border: "rgba(168,85,247,0.2)",
    tag: "PREMIUM",
  },
  {
    icon: <RotateCcw size={28} />,
    title: "Easy Returns",
    desc: "Not 100% satisfied? We make returns simple and hassle-free. Your comfort comes first.",
    accent: "#22c55e",
    glow: "rgba(34,197,94,0.2)",
    border: "rgba(34,197,94,0.2)",
    tag: "NO HASSLE",
  },
];

const proofStats = [
  { icon: <Clock size={22} />, stat: "24hr", label: "Average Delivery", color: "#f97316" },
  { icon: <MapPin size={22} />, stat: "25+", label: "Districts Covered", color: "#a855f7" },
  { icon: <Star size={22} />, stat: "500+", label: "Happy Customers", color: "#fbbf24" },
  { icon: <CheckCircle size={22} />, stat: "100%", label: "Secure COD", color: "#22c55e" },
];

const products = [
  {
    name: "CloudWalk Pro",
    price: "LKR 2,499",
    badge: "NEW",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600",
    color: "#f97316",
  },
  {
    name: "Urban Slide X",
    price: "LKR 1,999",
    badge: "HOT",
    img: "https://images.unsplash.com/photo-1603487759130-107d643831b0?q=80&w=600",
    color: "#a855f7",
  },
  {
    name: "Luxe Comfort",
    price: "LKR 3,299",
    badge: "POPULAR",
    img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600",
    color: "#22c55e",
  },
];

const reviews = [
  {
    name: "Dilani P.",
    location: "Colombo",
    review: "Best slippers I have bought! Super comfortable and arrived super fast. Highly recommend!",
    stars: 5,
    avatar: "D",
  },
  {
    name: "Kasun R.",
    location: "Kandy",
    review: "Amazing quality for the price. COD option made it so convenient and stress-free to order.",
    stars: 5,
    avatar: "K",
  },
  {
    name: "Nimasha S.",
    location: "Galle",
    review: "Loved the design so much. Will definitely order again for my whole family next month!",
    stars: 5,
    avatar: "N",
  },
];

// ─── Main Component ──────────────────────────────────────────────────
export default function HomePage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
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
    <div style={{ background: "#050508", overflowX: "hidden", position: "relative" }}>

      {/* ══ GLOBAL STYLES ══════════════════════════════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .rn-root, .rn-root * { font-family: 'DM Sans', sans-serif; }
        .rn-display { font-family: 'Syne', sans-serif !important; }

        @keyframes rn-float {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          33%      { transform: translateY(-20px) rotate(2deg); }
          66%      { transform: translateY(-10px) rotate(-1deg); }
        }
        @keyframes rn-floatSlow {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-30px); }
        }
        @keyframes rn-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes rn-shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes rn-fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rn-scaleIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes rn-gradShift {
          0%,100% { background-position: 0% 50%; }
          50%     { background-position: 100% 50%; }
        }
        @keyframes rn-ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes rn-bounce {
          0%,100% { transform: translateX(-50%) translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
          50%     { transform: translateX(-50%) translateY(0);     animation-timing-function: cubic-bezier(0,0,0.2,1); }
        }

        .rn-float     { animation: rn-float     6s ease-in-out infinite; }
        .rn-floatSlow { animation: rn-floatSlow 8s ease-in-out infinite; }
        .rn-marquee   { animation: rn-marquee  25s linear infinite; }
        .rn-fadeUp    { animation: rn-fadeUp   0.8s ease-out both; }
        .rn-scaleIn   { animation: rn-scaleIn  0.7s ease-out both; }
        .rn-bounce    { animation: rn-bounce    1s infinite; }
        .rn-ping      { animation: rn-ping      1s cubic-bezier(0,0,0.2,1) infinite; }
        .rn-d1 { animation-delay: 0.1s; }
        .rn-d2 { animation-delay: 0.2s; }
        .rn-d3 { animation-delay: 0.3s; }
        .rn-d4 { animation-delay: 0.45s; }
        .rn-d5 { animation-delay: 0.55s; }

        .rn-glass {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .rn-shimmer {
          background: linear-gradient(90deg, #e2e8f0 0%, #ffffff 40%, #94a3b8 60%, #e2e8f0 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: rn-shimmer 4s linear infinite;
        }
        .rn-grad {
          background: linear-gradient(135deg, #f97316 0%, #fb923c 30%, #fbbf24 60%, #f97316 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: rn-gradShift 3s ease infinite;
        }
        .rn-noise::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 2;
        }
        .rn-shine { position: relative; overflow: hidden; }
        .rn-shine::after {
          content: '';
          position: absolute;
          top: -50%; left: -60%;
          width: 50%; height: 200%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
          transform: skewX(-20deg);
          transition: left 0.8s ease;
          pointer-events: none;
        }
        .rn-shine:hover::after { left: 120%; }
        .rn-gradbtn {
          background: linear-gradient(90deg, #f97316, #fb923c, #f97316);
          background-size: 200% 100%;
          animation: rn-gradShift 3s ease infinite;
        }
        .rn-hover-scale { transition: transform 0.3s ease; }
        .rn-hover-scale:hover { transform: scale(1.05); }
      `}</style>

      <div className="rn-root">

        {/* ══ HERO ══════════════════════════════════════════════════════ */}
        <div
          className="rn-noise"
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            isolation: "isolate",
          }}
        >
          {/* bg */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 120% 80% at 60% 40%, #1a0a2e 0%, #0d0618 30%, #050508 70%)",
          }} />

          {/* grid */}
          <div style={{
            position: "absolute", inset: 0,
            opacity: 0.06,
            backgroundImage: `linear-gradient(rgba(249,115,22,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.8) 1px,transparent 1px)`,
            backgroundSize: "80px 80px",
            transform: `translate(${mousePos.x * 0.3}px,${mousePos.y * 0.3}px)`,
            transition: "transform 0.2s ease-out",
          }} />

          {/* mouse glow */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: `radial-gradient(ellipse 60% 50% at calc(55% + ${mousePos.x * 1.5}px) calc(40% + ${mousePos.y * 1.5}px), rgba(249,115,22,.15) 0%, rgba(168,85,247,.08) 45%, transparent 75%)`,
            transition: "background 0.3s ease-out",
          }} />

          {/* orbs */}
          <div className="rn-floatSlow" style={{
            position: "absolute", top: 40, right: 40,
            width: 500, height: 500, borderRadius: "50%",
            opacity: 0.07,
            background: "radial-gradient(circle,#f97316 0%,transparent 65%)",
          }} />
          <div className="rn-floatSlow" style={{
            position: "absolute", bottom: -80, left: -80,
            width: 400, height: 400, borderRadius: "50%",
            opacity: 0.06, animationDelay: "3s",
            background: "radial-gradient(circle,#a855f7 0%,transparent 65%)",
          }} />

          {/* parallax image */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.06,
            backgroundImage: "url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070')",
            backgroundSize: "cover", backgroundPosition: "center",
            mixBlendMode: "luminosity",
            transform: `translateY(${scrollY * 0.25}px)`,
          }} />

          {/* content */}
          <div style={{
            position: "relative", zIndex: 10,
            textAlign: "center", padding: "5rem 1.5rem 0",
            maxWidth: 1152, margin: "0 auto",
            opacity: loaded ? 1 : 0, transition: "opacity 0.7s ease",
          }}>

            {/* badge */}
            <div className="rn-glass rn-fadeUp" style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              borderRadius: 9999, padding: "10px 20px", marginBottom: 40,
            }}>
              <span style={{ position: "relative", display: "flex", width: 8, height: 8 }}>
                <span className="rn-ping" style={{
                  position: "absolute", display: "inline-flex",
                  width: "100%", height: "100%", borderRadius: "50%",
                  background: "#fb923c", opacity: 0.75,
                }} />
                <span style={{
                  position: "relative", display: "inline-flex",
                  width: 8, height: 8, borderRadius: "50%", background: "#f97316",
                }} />
              </span>
              <span style={{
                color: "rgba(253,186,116,0.9)", fontSize: 10,
                fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.35em",
              }}>
                🇱🇰 Islandwide Cash on Delivery
              </span>
            </div>

            {/* heading */}
            <div style={{ marginBottom: 24, overflow: "hidden" }}>
              <h1 className="rn-display rn-fadeUp rn-d1" style={{
                fontWeight: 900, textTransform: "uppercase", lineHeight: 0.85, margin: 0,
              }}>
                <span className="rn-shimmer" style={{
                  display: "block", marginBottom: 8,
                  fontSize: "clamp(3rem,10vw,8rem)",
                }}>
                  Step Into
                </span>
                <span className="rn-grad" style={{
                  display: "block",
                  fontSize: "clamp(3.5rem,12vw,10rem)",
                }}>
                  Comfort.
                </span>
              </h1>
            </div>

            <p className="rn-fadeUp rn-d2" style={{
              color: "#94a3b8", fontSize: "clamp(1rem,2.5vw,1.2rem)",
              fontWeight: 300, maxWidth: 560, margin: "0 auto 16px",
              lineHeight: 1.7,
            }}>
              Sri Lanka&apos;s finest slippers — crafted for lasting style,{" "}
              <span style={{ color: "#fb923c", fontWeight: 600 }}>
                delivered to your door.
              </span>
            </p>

            {/* CTAs */}
            <div className="rn-fadeUp rn-d3" style={{
              display: "flex", flexWrap: "wrap", gap: 16,
              justifyContent: "center", alignItems: "center", marginBottom: 64,
            }}>
              <Link
                href="/collections"
                className="rn-hover-scale"
                style={{
                  position: "relative", display: "inline-flex",
                  alignItems: "center", gap: 12,
                  padding: "20px 40px", borderRadius: 16,
                  fontWeight: 700, textTransform: "uppercase",
                  fontSize: 14, letterSpacing: "0.1em",
                  overflow: "hidden", textDecoration: "none",
                  boxShadow: "0 0 40px rgba(249,115,22,.5),0 0 80px rgba(249,115,22,.15)",
                }}
              >
                <span style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(90deg,#ea580c,#f97316,#f59e0b)",
                }} />
                <ShoppingBag size={20} style={{ position: "relative", zIndex: 1, color: "#fff" }} />
                <span style={{ position: "relative", zIndex: 1, color: "#fff" }}>Shop Now</span>
                <ArrowRight size={16} style={{ position: "relative", zIndex: 1, color: "#fff" }} />
              </Link>

              <Link
                href="/track-order"
                className="rn-glass rn-hover-scale"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 12,
                  padding: "20px 40px", borderRadius: 16,
                  fontWeight: 700, textTransform: "uppercase",
                  fontSize: 14, letterSpacing: "0.1em",
                  color: "rgba(255,255,255,.8)", textDecoration: "none",
                }}
              >
                <MapPin size={16} style={{ color: "#fb923c" }} />
                Track My Order
              </Link>
            </div>

            {/* floating product */}
            <div className="rn-scaleIn rn-d4" style={{
              position: "relative", display: "flex",
              justifyContent: "center", marginBottom: 80,
            }}>
              <div className="rn-float" style={{
                position: "relative",
                filter: "drop-shadow(0 40px 80px rgba(249,115,22,.3))",
              }}>
                <div style={{
                  width: "clamp(18rem,30vw,24rem)",
                  height: "clamp(18rem,30vw,24rem)",
                  borderRadius: "50%", overflow: "hidden", position: "relative",
                  background: "radial-gradient(circle at 35% 35%,rgba(249,115,22,.15),transparent 60%)",
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1603487759130-107d643831b0?q=80&w=800"
                    alt="Premium Slippers"
                    style={{
                      width: "100%", height: "100%",
                      objectFit: "cover", objectPosition: "center",
                      mixBlendMode: "luminosity", opacity: 0.8,
                      transform: `translate(${mousePos.x * 0.06}px,${mousePos.y * 0.06}px) scale(1.1)`,
                    }}
                  />
                  <div style={{
                    position: "absolute", inset: 0, borderRadius: "50%",
                    background: "radial-gradient(circle at 30% 25%,rgba(255,255,255,.12),transparent 60%)",
                  }} />
                </div>

                {/* badge: rating */}
                <div className="rn-glass rn-float" style={{
                  position: "absolute", top: -16, right: -32,
                  borderRadius: 16, padding: "10px 16px",
                  display: "flex", alignItems: "center", gap: 8, animationDelay: "1s",
                }}>
                  <Star size={14} style={{ color: "#fbbf24", fill: "#fbbf24" }} />
                  <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>5.0 Rating</span>
                </div>

                {/* badge: delivery */}
                <div className="rn-glass rn-float" style={{
                  position: "absolute", bottom: -8, left: -32,
                  borderRadius: 16, padding: "10px 16px",
                  display: "flex", alignItems: "center", gap: 8, animationDelay: "2s",
                }}>
                  <Truck size={14} style={{ color: "#fb923c" }} />
                  <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>Fast Delivery</span>
                </div>

                {/* badge: COD */}
                <div className="rn-glass rn-float" style={{
                  position: "absolute", top: "50%", right: -64,
                  borderRadius: 16, padding: "10px 16px",
                  display: "flex", alignItems: "center", gap: 8, animationDelay: "0.5s",
                }}>
                  <CheckCircle size={14} style={{ color: "#4ade80" }} />
                  <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>COD</span>
                </div>
              </div>

              {/* glow shadow */}
              <div style={{
                position: "absolute", bottom: 0,
                left: "50%", transform: "translateX(-50%)",
                width: 256, height: 48, borderRadius: 9999,
                opacity: 0.4,
                background: "radial-gradient(ellipse,rgba(249,115,22,.6),transparent 70%)",
                filter: "blur(16px)",
              }} />
            </div>

            {/* stats */}
            <div className="rn-fadeUp rn-d5" style={{
              display: "grid", gridTemplateColumns: "repeat(2,1fr)",
              gap: 16, maxWidth: 672, margin: "0 auto",
            }}>
              {[
                { value: 500, suffix: "+", label: "Happy Customers" },
                { value: 50,  suffix: "+", label: "Slipper Models"  },
                { value: 24,  suffix: "hr",label: "Delivery"        },
                { value: 5,   suffix: "★", label: "Avg Rating"      },
              ].map((s) => (
                <div key={s.label} className="rn-glass" style={{
                  borderRadius: 16, padding: "20px", textAlign: "center",
                  cursor: "default",
                }}>
                  <div className="rn-display" style={{
                    fontSize: "1.875rem", fontWeight: 900, color: "#fff", marginBottom: 4,
                  }}>
                    <CountUp end={s.value} suffix={s.suffix} />
                  </div>
                  <div style={{
                    fontSize: 9, fontWeight: 700, textTransform: "uppercase",
                    letterSpacing: "0.2em", color: "#64748b",
                  }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* scroll hint */}
          <div className="rn-bounce" style={{
            position: "absolute", bottom: 32,
            left: "50%",
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: 8, opacity: 0.3,
          }}>
            <span style={{ fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.4em", color: "#64748b" }}>
              Scroll
            </span>
            <ChevronDown size={14} style={{ color: "#64748b" }} />
          </div>
        </div>

        {/* ══ MARQUEE ═══════════════════════════════════════════════════ */}
        <div style={{
          position: "relative", overflow: "hidden", padding: "16px 0",
          borderTop: "1px solid rgba(249,115,22,.2)",
          borderBottom: "1px solid rgba(249,115,22,.2)",
          background: "linear-gradient(90deg,#0d0110 0%,#1a0820 50%,#0d0110 100%)",
        }}>
          <div className="rn-marquee" style={{ display: "flex", whiteSpace: "nowrap", width: "max-content" }}>
            {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((b, i) => (
              <span key={i} style={{
                display: "inline-flex", alignItems: "center", gap: 16,
                padding: "0 40px", fontSize: "0.75rem", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.3em",
                color: "rgba(251,146,60,.7)",
              }}>
                <Sparkles size={10} style={{ color: "rgba(249,115,22,.5)" }} />
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* ══ FEATURES ══════════════════════════════════════════════════ */}
        <div style={{
          position: "relative", padding: "8rem 1.5rem", overflow: "hidden",
          background: "radial-gradient(ellipse 80% 60% at 50% 0%,#12061a 0%,#050508 60%)",
        }}>
          <div style={{ maxWidth: 1152, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 80 }}>
              <p style={{ color: "#f97316", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.5em", marginBottom: 16 }}>
                Why Choose Us
              </p>
              <h2 className="rn-display" style={{
                fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.05em", color: "#fff",
                fontSize: "clamp(2.5rem,7vw,5rem)", margin: 0,
              }}>
                Built <span className="rn-grad">Different</span>
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
              {features.map((f, i) => (
                <Card3D key={i} className="rn-shine" style={{ borderRadius: 24 }}>
                  <div style={{
                    position: "relative", height: "100%", padding: 32,
                    borderRadius: 24,
                    background: "linear-gradient(135deg,rgba(255,255,255,.04),rgba(255,255,255,.01))",
                    border: `1px solid ${f.border}`,
                    boxShadow: `0 0 40px -10px ${f.glow}`,
                    overflow: "hidden",
                  }}>
                    <div style={{
                      position: "absolute", top: 24, right: 24,
                      padding: "4px 10px", borderRadius: 8,
                      fontSize: 8, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em",
                      background: `${f.accent}22`, color: f.accent,
                      border: `1px solid ${f.accent}44`,
                    }}>
                      {f.tag}
                    </div>
                    <div style={{
                      width: 56, height: 56, borderRadius: 16,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: 24, background: `${f.accent}15`, color: f.accent,
                      boxShadow: `0 0 20px ${f.glow}`,
                    }}>
                      {f.icon}
                    </div>
                    <h3 className="rn-display" style={{
                      fontSize: "1.25rem", fontWeight: 900, textTransform: "uppercase",
                      letterSpacing: "-0.02em", color: "#fff", marginBottom: 12,
                    }}>
                      {f.title}
                    </h3>
                    <p style={{ color: "#94a3b8", fontSize: "0.875rem", lineHeight: 1.7, fontWeight: 300 }}>
                      {f.desc}
                    </p>
                  </div>
                </Card3D>
              ))}
            </div>
          </div>
        </div>

        {/* ══ SOCIAL PROOF ══════════════════════════════════════════════ */}
        <div style={{
          position: "relative", padding: "5rem 1.5rem", overflow: "hidden",
          background: "linear-gradient(135deg,#1a0530 0%,#0d0618 50%,#1a0820 100%)",
        }}>
          <div style={{
            position: "absolute", inset: 0, opacity: 0.05,
            backgroundImage: "linear-gradient(rgba(249,115,22,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.8) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 1024, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 32, textAlign: "center" }}>
              {proofStats.map((item, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: `${item.color}15`, color: item.color,
                  }}>
                    {item.icon}
                  </div>
                  <div className="rn-display" style={{ fontSize: "2.25rem", fontWeight: 900, color: "#fff" }}>
                    {item.stat}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "#64748b" }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ NEW ARRIVALS ══════════════════════════════════════════════ */}
        <div style={{
          position: "relative", padding: "8rem 1.5rem", overflow: "hidden",
          background: "radial-gradient(ellipse 60% 50% at 30% 50%,#12061a 0%,#050508 70%)",
        }}>
          <div style={{ maxWidth: 1152, margin: "0 auto" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 64, gap: 24 }}>
              <div>
                <p style={{ color: "#f97316", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.5em", marginBottom: 16 }}>
                  Fresh Drops
                </p>
                <h2 className="rn-display" style={{
                  fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.05em", color: "#fff",
                  fontSize: "clamp(2.5rem,6vw,4rem)", margin: 0,
                }}>
                  New <span className="rn-grad">Arrivals</span>
                </h2>
              </div>
              <Link href="/collections" className="rn-glass rn-hover-scale" style={{
                display: "inline-flex", alignItems: "center", gap: 12,
                padding: "16px 32px", borderRadius: 16,
                fontWeight: 700, textTransform: "uppercase",
                fontSize: 14, letterSpacing: "0.1em",
                color: "#fff", textDecoration: "none",
              }}>
                View All
                <ArrowRight size={16} style={{ color: "#fb923c" }} />
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
              {products.map((p, i) => (
                <Card3D key={i} style={{ borderRadius: 24 }}>
                  <div className="rn-glass rn-shine" style={{
                    position: "relative", borderRadius: 24, overflow: "hidden",
                  }}>
                    <div style={{
                      position: "absolute", top: 16, left: 16, zIndex: 20,
                      padding: "4px 12px", borderRadius: 12,
                      fontSize: 9, fontWeight: 900, textTransform: "uppercase",
                      letterSpacing: "0.1em", color: "#fff",
                      background: p.color, boxShadow: `0 0 20px ${p.color}80`,
                    }}>
                      {p.badge}
                    </div>
                    <div style={{ position: "relative", height: 224, overflow: "hidden" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.img}
                        alt={p.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
                      />
                      <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(to bottom,transparent 40%,rgba(5,5,8,.8) 100%)",
                      }} />
                    </div>
                    <div style={{ padding: 24 }}>
                      <h3 className="rn-display" style={{
                        fontSize: "1.125rem", fontWeight: 900, color: "#fff",
                        textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: 8,
                      }}>
                        {p.name}
                      </h3>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ color: "#fb923c", fontWeight: 700, fontSize: "1.125rem" }}>
                          {p.price}
                        </span>
                        <Link href="/collections" style={{
                          display: "inline-flex", alignItems: "center", gap: 8,
                          fontSize: 12, fontWeight: 700, textTransform: "uppercase",
                          letterSpacing: "0.1em", color: "#64748b", textDecoration: "none",
                        }}>
                          View <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card3D>
              ))}
            </div>
          </div>
        </div>

        {/* ══ REVIEWS ═══════════════════════════════════════════════════ */}
        <div style={{
          position: "relative", padding: "8rem 1.5rem", overflow: "hidden",
          background: "radial-gradient(ellipse 80% 60% at 70% 50%,#0a0218 0%,#050508 60%)",
        }}>
          <div style={{ maxWidth: 1152, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 80 }}>
              <p style={{ color: "#f97316", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.5em", marginBottom: 16 }}>
                Testimonials
              </p>
              <h2 className="rn-display" style={{
                fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.05em", color: "#fff",
                fontSize: "clamp(2.5rem,6vw,4rem)", margin: 0,
              }}>
                Customers <span className="rn-grad">Love Us</span>
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
              {reviews.map((t, i) => (
                <Card3D key={i} style={{ borderRadius: 24 }}>
                  <div className="rn-glass" style={{
                    position: "relative", borderRadius: 24, padding: 32, overflow: "hidden",
                  }}>
                    <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                      {Array.from({ length: t.stars }).map((_, j) => (
                        <Star key={j} size={14} style={{ color: "#fbbf24", fill: "#fbbf24" }} />
                      ))}
                    </div>
                    <div className="rn-display" style={{
                      position: "absolute", top: 24, right: 24,
                      fontSize: "3.75rem", fontWeight: 900, lineHeight: 1,
                      color: "rgba(249,115,22,.1)", userSelect: "none",
                    }}>
                      &ldquo;
                    </div>
                    <p style={{
                      color: "#cbd5e1", fontSize: "0.875rem", fontWeight: 300,
                      lineHeight: 1.7, marginBottom: 32, position: "relative", zIndex: 1,
                    }}>
                      &ldquo;{t.review}&rdquo;
                    </p>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 12, paddingTop: 24,
                      borderTop: "1px solid rgba(255,255,255,.06)",
                      position: "relative", zIndex: 1,
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 12,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: "0.875rem", fontWeight: 900,
                        background: "linear-gradient(135deg,#f97316,#a855f7)",
                        flexShrink: 0,
                      }}>
                        {t.avatar}
                      </div>
                      <div>
                        <p style={{ fontSize: "0.75rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em", color: "#fff", margin: 0 }}>
                          {t.name}
                        </p>
                        <p style={{ fontSize: 10, color: "#64748b", fontWeight: 500, display: "flex", alignItems: "center", gap: 4, margin: 0 }}>
                          <MapPin size={8} /> {t.location}
                        </p>
                      </div>
                      <div style={{ marginLeft: "auto" }}>
                        <span style={{
                          fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                          color: "rgba(74,222,128,.7)", background: "rgba(74,222,128,.1)",
                          padding: "4px 8px", borderRadius: 8,
                        }}>
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </Card3D>
              ))}
            </div>
          </div>
        </div>

        {/* ══ FINAL CTA ═════════════════════════════════════════════════ */}
        <div className="rn-noise" style={{
          position: "relative", padding: "10rem 1.5rem", overflow: "hidden",
          isolation: "isolate",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 100% 100% at 50% 50%,#1a0830 0%,#050508 70%)",
          }} />
          <div style={{
            position: "absolute", top: 0, left: "25%",
            width: 384, height: 384, borderRadius: "50%", opacity: 0.08,
            background: "radial-gradient(circle,#f97316 0%,transparent 70%)",
            filter: "blur(60px)",
          }} />
          <div style={{
            position: "absolute", bottom: 0, right: "25%",
            width: 320, height: 320, borderRadius: "50%", opacity: 0.06,
            background: "radial-gradient(circle,#a855f7 0%,transparent 70%)",
            filter: "blur(60px)",
          }} />
          <div style={{
            position: "absolute", inset: 0, opacity: 0.04,
            backgroundImage: "radial-gradient(circle,rgba(249,115,22,.8) 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }} />

          <div style={{ position: "relative", zIndex: 1, maxWidth: 768, margin: "0 auto", textAlign: "center" }}>
            <p style={{ color: "#fb923c", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.5em", marginBottom: 24 }}>
              Ready to Shop?
            </p>
            <h2 className="rn-display" style={{
              fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.05em",
              color: "#fff", lineHeight: 1,
              fontSize: "clamp(3.5rem,10vw,8rem)",
              textShadow: "0 0 80px rgba(249,115,22,.2)",
              marginBottom: 24,
            }}>
              Step Up<br />
              <span className="rn-grad">Today.</span>
            </h2>
            <p style={{ color: "#64748b", fontSize: "1.125rem", marginBottom: 48, fontWeight: 300, lineHeight: 1.7 }}>
              Browse our full collection. Find your perfect pair.<br />
              <span style={{ color: "#94a3b8" }}>Free Cash on Delivery across Sri Lanka.</span>
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
              <Link
                href="/collections"
                className="rn-hover-scale"
                style={{
                  position: "relative", display: "inline-flex",
                  alignItems: "center", gap: 12,
                  padding: "24px 56px", borderRadius: 16,
                  fontWeight: 700, textTransform: "uppercase",
                  fontSize: 14, letterSpacing: "0.1em",
                  overflow: "hidden", textDecoration: "none",
                  boxShadow: "0 0 50px rgba(249,115,22,.5),0 0 100px rgba(249,115,22,.2)",
                }}
              >
                <span className="rn-gradbtn" style={{ position: "absolute", inset: 0 }} />
                <ShoppingBag size={20} style={{ position: "relative", zIndex: 1, color: "#fff" }} />
                <span style={{ position: "relative", zIndex: 1, color: "#fff" }}>Explore Collection</span>
                <ArrowRight size={16} style={{ position: "relative", zIndex: 1, color: "#fff" }} />
              </Link>

              <Link
                href="/track-order"
                className="rn-glass rn-hover-scale"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 12,
                  padding: "24px 40px", borderRadius: 16,
                  fontWeight: 700, textTransform: "uppercase",
                  fontSize: 14, letterSpacing: "0.1em",
                  color: "rgba(255,255,255,.7)", textDecoration: "none",
                }}
              >
                <MapPin size={16} style={{ color: "#fb923c" }} />
                Track Order
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}