"use client";

import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Loader2, ChevronRight, Truck, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const bgImageUrl = "https://i.imgur.com/6VS5Ue8.png";

  useEffect(() => { setMounted(true); }, []);

  const deliveryFee = 350;
  const total = cartTotal + deliveryFee;

  if (!mounted) return null;

  if (cart.length === 0) return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#020408",
      backgroundImage: `linear-gradient(rgba(2, 4, 8, 0.9), rgba(2, 4, 8, 0.95)), url("${bgImageUrl}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 24,
      fontFamily: "'Inter', sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Syne:wght@700&display=swap');
        @keyframes float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }
        .float { animation: float 4s ease-in-out infinite }
      `}</style>
      <div className="float" style={{
        width: 80, height: 80, borderRadius: 20,
        background: "rgba(34, 211, 238, 0.1)",
        border: "1px solid rgba(34, 211, 238, 0.2)",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <ShoppingBag size={32} style={{ color: "#22d3ee" }} />
      </div>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "2rem", color: "#fff", marginBottom: 8 }}>Your Bag is Empty</h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>Ready to discover your next favorite pair?</p>
      </div>
      <Link href="/collections" style={{
        display: "flex", alignItems: "center", gap: 10, padding: "14px 32px", borderRadius: 8,
        background: "#22d3ee", color: "#020408", textDecoration: "none",
        fontWeight: 600, fontSize: 13, transition: "all 0.3s ease"
      }}>
        <ArrowLeft size={16}/> Back to Shop
      </Link>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#020408",
      backgroundImage: `linear-gradient(rgba(2, 4, 8, 0.92), rgba(2, 4, 8, 0.96)), url("${bgImageUrl}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      fontFamily: "'Inter', sans-serif",
      paddingBottom: 80,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Syne:wght@600;700&display=swap');
        
        .cart-item {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          gap: 20px;
          align-items: center;
          transition: all 0.3s ease;
        }

        .cart-item:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(34, 211, 238, 0.3);
        }

        .qty-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(0, 0, 0, 0.3);
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .qty-action {
          cursor: pointer;
          color: rgba(255, 255, 255, 0.4);
          transition: color 0.2s;
        }

        .qty-action:hover { color: #22d3ee; }

        .summary-card {
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 32px;
          position: sticky;
          top: 40px;
        }

        .checkout-btn {
          width: 100%;
          padding: 16px;
          background: #fff;
          color: #000;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .checkout-btn:hover:not(:disabled) {
          background: #22d3ee;
        }

        @media(max-width: 900px) {
          .grid-container { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
        
        {/* Header */}
        <header style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: 8 }}>
              Your <span style={{ color: "#22d3ee" }}>Bag.</span>
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
              {cart.length} item{cart.length !== 1 ? "s" : ""} selected
            </p>
          </div>
          <button onClick={clearCart} style={{
            background: "transparent", border: "none", color: "#f87171",
            fontSize: 12, fontWeight: 500, cursor: "pointer", opacity: 0.7
          }}>
            Clear Bag
          </button>
        </header>

        <div className="grid-container" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 32 }}>
          
          {/* Cart Items List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {cart.map((item) => (
              <div key={item.line_id} className="cart-item">
                <div style={{ position: "relative", width: 100, height: 100, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
                  <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>{item.name}</h3>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>
                    {item.color} / Size {item.size}
                  </p>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#22d3ee" }}>
                    Rs. {item.price?.toLocaleString()}
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
                  <button 
                    onClick={() => removeFromCart(item.line_id)}
                    style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.2)", cursor: "pointer" }}
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="qty-pill">
                    <Minus size={14} className="qty-action" onClick={() => updateQuantity(item.line_id, -1)} />
                    <span style={{ fontSize: 14, minWidth: 20, textAlign: "center" }}>{item.quantity}</span>
                    <Plus size={14} className="qty-action" onClick={() => updateQuantity(item.line_id, 1)} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Section */}
          <aside>
            <div className="summary-card">
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, marginBottom: 24 }}>Summary</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
                  <span>Subtotal</span>
                  <span>Rs. {cartTotal?.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
                  <span>Delivery Fee</span>
                  <span>Rs. {deliveryFee}</span>
                </div>
                <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", margin: "8px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 600 }}>
                  <span>Total</span>
                  <span style={{ color: "#22d3ee" }}>Rs. {total?.toLocaleString()}</span>
                </div>
              </div>

              <button 
                className="checkout-btn" 
                disabled={loading} 
                onClick={() => { setLoading(true); router.push("/checkout"); }}
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <>Continue to Checkout <ChevronRight size={18}/></>}
              </button>

              <div style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 20, opacity: 0.4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
                  <Truck size={14} /> <span>Fast Delivery</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
                  <ShieldCheck size={14} /> <span>Secure Payment</span>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}