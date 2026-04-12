"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Loader2, PackageSearch, ArrowRight, Ruler, Palette, Sparkles, Filter, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CATEGORIES = ["All", "Casual", "Formal", "Sport", "Beach", "Home", "Kids", "Ladies", "Gents"];

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  description: string;
  colors: string[];
  sizes: string[];
}

export default function CollectionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const bgImageUrl = "https://i.imgur.com/6VS5Ue8.png";

  useEffect(() => {
    supabase.from("products").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { 
        setProducts(data || []); 
        setLoading(false); 
      });
  }, []);

  const filtered = activeCategory === "All" ? products : products.filter(p => p.category === activeCategory);

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#020408",
      backgroundImage: `linear-gradient(rgba(2, 4, 8, 0.9), rgba(2, 4, 8, 0.95)), url("${bgImageUrl}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      color: "#f8fafc",
      fontFamily: "'Inter', sans-serif",
      paddingBottom: 80,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Syne:wght@600;700&display=swap');
        
        .glass-header {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .product-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          transition: all 0.4s ease;
        }

        .product-card:hover {
          transform: translateY(-5px);
          border-color: rgba(34, 211, 238, 0.3);
          background: rgba(255, 255, 255, 0.05);
        }

        .cat-pill {
          padding: 8px 20px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: transparent;
          color: rgba(255, 255, 255, 0.6);
          transition: all 0.3s ease;
        }

        .cat-pill:hover, .cat-pill.active {
          background: #22d3ee;
          color: #020408;
          border-color: #22d3ee;
        }

        .tag {
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 500;
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.5);
        }

        .action-btn {
          width: 100%;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #fff;
          font-size: 12px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          background: #fff;
          color: #000;
        }

        .section-title {
          font-family: 'Syne', sans-serif;
          letter-spacing: -0.02em;
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        
        {/* Header Section */}
        <header style={{ marginBottom: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#22d3ee", marginBottom: 16 }}>
            <Sparkles size={16} />
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>
              Reina Exclusive
            </span>
          </div>
          <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", marginBottom: 16 }}>
            Explore <span style={{ color: "#22d3ee" }}>Collections.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", maxWidth: 500, lineHeight: 1.6, fontSize: 15 }}>
            Discover our curated range of premium footwear designed for comfort and crafted with elegance.
          </p>
        </header>

        {/* Filters */}
        <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: 10, 
          marginBottom: 40,
          padding: "24px",
          background: "rgba(255,255,255,0.02)",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 10, color: "rgba(255,255,255,0.3)" }}>
            <Filter size={16} />
            <span style={{ fontSize: 12, fontWeight: 600 }}>FILTER:</span>
          </div>
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              className={`cat-pill ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "100px 0", gap: 20 }}>
            <Loader2 size={30} className="animate-spin" style={{ color: "#22d3ee" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: 2 }}>LOADING ITEMS...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "100px 0", color: "rgba(255,255,255,0.2)" }}>
            <PackageSearch size={48} style={{ margin: "0 auto 20px" }} />
            <p>No products found in this category.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 30 }}>
            {filtered.map((p) => (
              <div key={p.id} className="product-card">
                {/* Product Image */}
                <Link href={`/product/${p.id}`} style={{ display: "block", position: "relative", height: 320, borderRadius: "16px 16px 0 0", overflow: "hidden" }}>
                  <Image 
                    src={p.image_url || "/placeholder.jpg"} 
                    alt={p.name} 
                    fill 
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="400px"
                  />
                  <div style={{ position: "absolute", top: 15, left: 15 }}>
                    <span style={{ background: "rgba(0,0,0,0.6)", padding: "4px 10px", borderRadius: "4px", fontSize: 10, fontWeight: 600, backdropFilter: "blur(5px)" }}>
                      {p.category}
                    </span>
                  </div>
                </Link>

                {/* Info */}
                <div style={{ padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 500, color: "#fff" }}>{p.name}</h3>
                    <span style={{ color: "#22d3ee", fontWeight: 600 }}>Rs. {p.price?.toLocaleString()}</span>
                  </div>

                  {/* Attributes */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                    {p.sizes?.length > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Ruler size={14} style={{ color: "rgba(255,255,255,0.2)" }} />
                        <div style={{ display: "flex", gap: 4 }}>
                          {p.sizes.slice(0, 4).map(s => <span key={s} className="tag">{s}</span>)}
                        </div>
                      </div>
                    )}
                    {p.colors?.length > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Palette size={14} style={{ color: "rgba(255,255,255,0.2)" }} />
                        <div style={{ display: "flex", gap: 4 }}>
                          {p.colors.slice(0, 3).map(c => <span key={c} className="tag">{c}</span>)}
                        </div>
                      </div>
                    )}
                  </div>

                  <Link href={`/product/${p.id}`} className="action-btn">
                    View Details <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.2)", fontSize: 12, letterSpacing: 1 }}>
        &copy; 2026 REINA STORE. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}