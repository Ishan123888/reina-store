"use client";

import { Search, Truck, Loader2, CheckCircle2, Clock, Package, MapPin, ChevronRight, Hash } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/core/configs/supabase-browser";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("orderId") || "";
  const [orderId, setOrderId] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const bgImageUrl = "https://i.imgur.com/6VS5Ue8.png";

  const fetchOrder = async (id: string) => {
    setError(null);
    setOrder(null);
    if (!id.trim()) {
      setError("Please enter a valid Order ID.");
      return;
    }
    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error: e } = await supabase.from("orders").select("*").eq("id", id.trim()).single();
      if (e) throw e;
      setOrder(data || null);
    } catch {
      setError("We couldn't find an order with that ID. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initial) fetchOrder(initial);
  }, [initial]);

  const statusConfig: Record<string, { color: string; bg: string; icon: any }> = {
    Pending: { color: "#fbbf24", bg: "rgba(251,191,36,0.1)", icon: Clock },
    Processing: { color: "#22d3ee", bg: "rgba(34,211,238,0.1)", icon: Package },
    Shipped: { color: "#818cf8", bg: "rgba(129,140,248,0.1)", icon: Truck },
    Delivered: { color: "#34d399", bg: "rgba(52,211,153,0.1)", icon: CheckCircle2 },
    Cancelled: { color: "#f87171", bg: "rgba(248,113,113,0.1)", icon: Clock },
  };
  const sc = statusConfig[order?.status] || statusConfig.Pending;

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#020408",
      backgroundImage: `linear-gradient(rgba(2, 4, 8, 0.92), rgba(2, 4, 8, 0.96)), url("${bgImageUrl}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      color: "#f8fafc",
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 24px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Syne:wght@600;700&display=swap');
        
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 32px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.4);
        }

        .input-group {
          position: relative;
          display: flex;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .input-group:focus-within {
          border-color: #22d3ee;
          background: rgba(255, 255, 255, 0.08);
        }

        .track-input {
          background: transparent;
          border: none;
          color: #fff;
          padding: 14px 18px;
          width: 100%;
          font-size: 14px;
          outline: none;
        }

        .search-btn {
          background: #22d3ee;
          color: #020408;
          border: none;
          padding: 0 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .search-btn:hover {
          background: #fff;
        }

        .info-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 6px;
          font-weight: 500;
        }

        .info-value {
          font-size: 15px;
          color: #fff;
          font-weight: 400;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
        }
      `}</style>

      <div className="glass-card">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ 
            width: 50, height: 50, borderRadius: "12px", 
            background: "rgba(34, 211, 238, 0.1)", 
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", color: "#22d3ee"
          }}>
            <Truck size={24} />
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, marginBottom: 8 }}>Track Order</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Enter your ID to see delivery updates</p>
        </div>

        {/* Search Box */}
        <div style={{ marginBottom: 32 }}>
          <div className="input-group">
            <input 
              className="track-input" 
              placeholder="Order ID (e.g. 1234-5678)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchOrder(orderId)}
            />
            <button className="search-btn" onClick={() => fetchOrder(orderId)}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            </button>
          </div>
          {error && <p style={{ color: "#f87171", fontSize: 12, marginTop: 10, textAlign: "center" }}>{error}</p>}
        </div>

        {/* Result Content */}
        {order ? (
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <p className="info-label">Current Status</p>
                <div className="status-badge" style={{ backgroundColor: sc.bg, color: sc.color }}>
                  <sc.icon size={14} />
                  {order.status}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p className="info-label">Total Amount</p>
                <p style={{ fontSize: 18, fontWeight: 600, color: "#22d3ee" }}>Rs. {order.total_amount?.toLocaleString()}</p>
              </div>
            </div>

            <div style={{ display: "grid", gap: 20 }}>
              <div style={{ background: "rgba(255,255,255,0.02)", padding: 16, borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                <p className="info-label">Tracking Number</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.8)" }}>
                  <Hash size={14} style={{ color: "#22d3ee" }} />
                  <span style={{ fontSize: 13, fontFamily: "monospace" }}>{order.id}</span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <p className="info-label">Customer</p>
                  <p className="info-value">{order.customer_name}</p>
                </div>
                <div>
                  <p className="info-label">Date</p>
                  <p className="info-value">{order.created_at ? new Date(order.created_at).toLocaleDateString() : "-"}</p>
                </div>
              </div>

              <div>
                <p className="info-label">Shipping Address</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <MapPin size={14} style={{ color: "#22d3ee", marginTop: 3, flexShrink: 0 }} />
                  <p className="info-value" style={{ fontSize: 13, lineHeight: 1.5, color: "rgba(255,255,255,0.7)" }}>{order.address}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          !loading && !error && (
            <div style={{ textAlign: "center", padding: "20px 0", color: "rgba(255,255,255,0.2)" }}>
              <Package size={40} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
              <p style={{ fontSize: 13 }}>Waiting for Order ID...</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default function TrackOrder() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", backgroundColor: "#020408", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={30} className="animate-spin" style={{ color: "#22d3ee" }} />
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}