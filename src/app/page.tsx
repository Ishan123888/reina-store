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
} from "lucide-react";
import { useEffect, useState } from "react";

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category?: string;
}

// Data constants
const features = [
  {
    icon: <Truck className="w-7 h-7" />,
    title: "Fast Island Delivery",
    desc: "Cash on Delivery available islandwide. Quick and secure service.",
    accent: "#22d3ee",
    tag: "Islandwide",
  },
  {
    icon: <Shield className="w-7 h-7" />,
    title: "Premium Quality",
    desc: "High-quality materials tested for ultimate comfort and durability.",
    accent: "#818cf8",
    tag: "Premium",
  },
  {
    icon: <RotateCcw className="w-7 h-7" />,
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
  const bgImageUrl = "https://i.imgur.com/6VS5Ue8.png";

  useEffect(() => {
    async function getProducts() {
      try {
        const response = await fetch("/api/products?limit=6");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        setProducts(result.data || result || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    getProducts();
  }, []);

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#020408", 
      backgroundImage: `linear-gradient(rgba(2, 4, 8, 0.85), rgba(2, 4, 8, 0.95)), url("${bgImageUrl}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      color: "#f8fafc",
      fontFamily: "'Inter', sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Syne:wght@600;700;800&display=swap');
        
        .glass-panel {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 20px;
        }
        
        .hero-title {
          font-family: 'Syne', sans-serif;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .floating {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        .btn-glow:hover {
          box-shadow: 0 0 20px rgba(34, 211, 238, 0.3);
          transform: translateY(-1px);
        }

        .product-card:hover .product-img {
          transform: scale(1.05);
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 glass-panel border-cyan-500/10">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] font-semibold tracking-[0.2em] text-cyan-400 uppercase">Premium Collection 2026</span>
            </div>

            <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-bold">
              Walk on <br />
              <span className="text-cyan-400">Clouds.</span>
            </h1>

            <p className="text-base md:text-lg text-slate-400 max-w-md leading-relaxed font-normal">
              Experience the perfect fusion of Sri Lankan craftsmanship and modern luxury. Premium slippers designed for your daily comfort.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/collections" className="btn-glow px-8 py-3.5 bg-cyan-500 text-slate-950 font-semibold rounded-lg transition-all flex items-center gap-2">
                SHOP NOW <Zap size={16} />
              </Link>
              <Link href="/track-order" className="px-8 py-3.5 glass-panel font-medium hover:bg-white/5 transition-all rounded-lg">
                Track Order
              </Link>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="floating relative z-10 overflow-hidden rounded-3xl">
              <Image
                src={bgImageUrl}
                alt="Featured Product"
                width={600}
                height={600}
                priority
                className="drop-shadow-2xl rounded-3xl object-cover"
              />
            </div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto glass-panel p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center space-y-1">
              <div className="flex justify-center text-cyan-400/80 mb-2">{s.icon}</div>
              <div className="text-3xl font-bold hero-title">{s.stat}</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/1">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="glass-panel p-8 group hover:border-cyan-500/30 transition-all duration-500">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110" 
                     style={{ background: `${f.accent}10`, border: `1px solid ${f.accent}20` }}>
                  <div style={{ color: f.accent }}>{f.icon}</div>
                </div>
                <h3 className="text-xl font-semibold mb-3 hero-title">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">{f.desc}</p>
                <span className="text-[9px] font-bold px-2.5 py-1 bg-white/5 rounded-md tracking-wider text-slate-400 uppercase">
                  {f.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-bold hero-title">Trending <span className="text-cyan-400">Now.</span></h2>
              <p className="text-slate-400 font-light">Handpicked exclusive designs for modern elegance.</p>
            </div>
            <Link href="/collections" className="text-cyan-400 text-sm font-semibold flex items-center gap-2 group transition-all">
              EXPLORE ALL <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="h-64 glass-panel animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.slice(0, 3).map((p) => (
                <div key={p.id} className="product-card group">
                  <div className="glass-panel overflow-hidden aspect-4/5 relative border-none">
                    <Image
                      src={p.image_url || "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600"}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="product-img object-cover transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <Link href={`/product/${p.id}`} className="w-full py-3 bg-white text-slate-950 text-sm font-bold rounded-lg flex items-center justify-center gap-2">
                        VIEW DETAILS <ShoppingBag size={16} />
                      </Link>
                    </div>
                  </div>
                  <div className="mt-5 flex justify-between items-start px-1">
                    <div className="space-y-1">
                      <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">{p.category || "New Arrival"}</p>
                      <h3 className="text-lg font-medium text-slate-200">{p.name}</h3>
                    </div>
                    <p className="text-lg font-semibold text-white">Rs. {p.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto glass-panel p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-cyan-500/50 to-transparent" />
          <h2 className="text-4xl md:text-5xl font-bold hero-title mb-6">
            Step Into <span className="text-cyan-400">Luxury.</span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg max-w-lg mx-auto mb-10 font-light">
            Join over 500+ women who prioritize both style and comfort. Fast delivery and secure payments guaranteed.
          </p>
          <Link href="/collections" className="btn-glow inline-flex px-10 py-4 bg-cyan-500 text-slate-950 font-bold rounded-lg transition-all uppercase text-sm tracking-wider">
            Shop Collection
          </Link>
        </div>
      </section>
      
      <footer className="py-8 text-center text-slate-600 text-xs tracking-widest uppercase">
        &copy; 2026 Reina Store. All rights reserved.
      </footer>
    </div>
  );
}