"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import { useSearchParams } from "next/navigation";
import {
  Clock,
  Hash,
  Loader2,
  MapPin,
  Package,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/core/configs/supabase-browser";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
};

type Order = {
  id: string;
  customer_name: string;
  address: string;
  status: string;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
};

const bgImageUrl = "https://i.imgur.com/6VS5Ue8.png";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || "";

  const [authLoading, setAuthLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState(initialOrderId);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setAuthLoading(false);
        return;
      }

      setUserId(user.id);

      const { data } = await supabase
        .from("orders")
        .select("id,customer_name,address,status,total_amount,created_at,items")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(12);

      const rows = (data as Order[]) || [];
      setOrders(rows);
      setAuthLoading(false);

      if (initialOrderId) {
        const matched = rows.find((o) => o.id === initialOrderId);
        if (matched) {
          setOrder(matched);
        } else {
          findOrder(initialOrderId, user.id);
        }
      }
    }

    init();
  }, [initialOrderId]);

  async function findOrder(id: string, uid = userId) {
    if (!uid) return;

    const cleanId = id.trim();
    if (!cleanId) {
      setError("Please enter a valid order ID.");
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error: findError } = await supabase
        .from("orders")
        .select("id,customer_name,address,status,total_amount,created_at,items")
        .eq("id", cleanId)
        .eq("user_id", uid)
        .single();

      if (findError || !data) throw new Error("not_found");
      setOrder(data as Order);
    } catch {
      setError("No order found for this account with that ID.");
    } finally {
      setLoading(false);
    }
  }

  const statusConfig: Record<string, { color: string; bg: string; icon: ComponentType<{ size?: number }> }> = {
    Pending: { color: "#fbbf24", bg: "rgba(251,191,36,0.12)", icon: Clock },
    Processing: { color: "#22d3ee", bg: "rgba(34,211,238,0.12)", icon: Package },
    Shipped: { color: "#818cf8", bg: "rgba(129,140,248,0.12)", icon: Truck },
    Delivered: { color: "#34d399", bg: "rgba(52,211,153,0.12)", icon: ShieldCheck },
    Cancelled: { color: "#f87171", bg: "rgba(248,113,113,0.12)", icon: Clock },
  };

  const statusTone = useMemo(
    () => (order ? statusConfig[order.status] || statusConfig.Pending : statusConfig.Pending),
    [order]
  );

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#020408" }}>
        <Loader2 size={34} className="animate-spin" style={{ color: "#22d3ee" }} />
      </div>
    );
  }

  if (!userId) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#020408",
          backgroundImage: `linear-gradient(rgba(2, 4, 8, 0.88), rgba(2, 4, 8, 0.95)), url("${bgImageUrl}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "grid",
          placeItems: "center",
          padding: 24,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 420,
            width: "100%",
            borderRadius: 22,
            padding: 30,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(18px)",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <h2 style={{ margin: "0 0 10px", fontFamily: "'Syne', sans-serif" }}>Login Required</h2>
          <p style={{ margin: "0 0 20px", color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
            Please sign in to track your own orders.
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            <Link
              href="/login"
              style={{
                textDecoration: "none",
                color: "#020408",
                background: "#22d3ee",
                borderRadius: 10,
                padding: "12px 14px",
                fontWeight: 700,
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Login
            </Link>
            <Link
              href="/register"
              style={{
                textDecoration: "none",
                color: "#fff",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 10,
                padding: "12px 14px",
                fontWeight: 700,
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#020408",
        backgroundImage: `linear-gradient(rgba(2, 4, 8, 0.9), rgba(2, 4, 8, 0.95)), url("${bgImageUrl}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        color: "#f8fafc",
        fontFamily: "'Inter', sans-serif",
        display: "grid",
        placeItems: "center",
        padding: "40px 20px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Syne:wght@600;700&display=swap');
        .glass-card {
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(22px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          width: 100%;
          max-width: 680px;
          padding: 26px;
        }
      `}</style>

      <div className="glass-card">
        <div style={{ marginBottom: 20 }}>
          <p style={{ margin: 0, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(34,211,238,0.7)", fontWeight: 700 }}>
            My Order Tracking
          </p>
          <h2 style={{ margin: "10px 0 6px", fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.5rem,4vw,2rem)" }}>
            Track your orders
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.52)" }}>
            Only orders from your logged-in account are visible.
          </p>
        </div>

        <div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
                padding: "0 12px",
              }}
            >
              <Hash size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
              <input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && findOrder(orderId)}
                placeholder="Enter your order ID"
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#fff",
                  height: 44,
                  fontSize: 13,
                }}
              />
            </div>
            <button
              onClick={() => findOrder(orderId)}
              style={{
                border: "none",
                borderRadius: 12,
                background: "#22d3ee",
                color: "#020408",
                width: 48,
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
              }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            </button>
          </div>

          {orders.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {orders.slice(0, 6).map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setOrderId(o.id);
                    setOrder(o);
                    setError(null);
                  }}
                  style={{
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.75)",
                    padding: "6px 10px",
                    borderRadius: 999,
                    fontSize: 11,
                    cursor: "pointer",
                  }}
                >
                  #{o.id.slice(0, 8).toUpperCase()}
                </button>
              ))}
            </div>
          )}

          {error && <p style={{ margin: 0, color: "#fca5a5", fontSize: 12 }}>{error}</p>}
        </div>

        {order ? (
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
              <div>
                <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.45)" }}>Order #{order.id.slice(0, 8).toUpperCase()}</p>
                <p style={{ margin: "5px 0 0", fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              <span
                style={{
                  background: statusTone.bg,
                  color: statusTone.color,
                  borderRadius: 999,
                  padding: "7px 12px",
                  fontSize: 11,
                  fontWeight: 700,
                  height: "fit-content",
                }}
              >
                {order.status}
              </span>
            </div>

            <div style={{ marginBottom: 14 }}>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Shipping Address
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <MapPin size={14} style={{ color: "#22d3ee", marginTop: 2 }} />
                <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.72)" }}>{order.address}</p>
              </div>
            </div>

            <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
              {(order.items || []).map((item, idx) => (
                <div
                  key={`${order.id}-${idx}`}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10,
                    padding: "9px 10px",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>{item.quantity}x {item.name}</p>
                    <p style={{ margin: "3px 0 0", fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
                      {item.color || "-"} {item.size ? `| Size ${item.size}` : ""}
                    </p>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: "#22d3ee", fontWeight: 700 }}>
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                Total: <span style={{ color: "#22d3ee" }}>Rs. {Number(order.total_amount || 0).toLocaleString()}</span>
              </p>
              <Link
                href={`/customer-dashboard`}
                style={{
                  color: "rgba(255,255,255,0.65)",
                  textDecoration: "none",
                  fontSize: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 9,
                  padding: "8px 10px",
                }}
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          !loading && (
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.1)",
                paddingTop: 18,
                color: "rgba(255,255,255,0.42)",
                fontSize: 13,
              }}
            >
              Select an order chip above or search by exact order ID.
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default function TrackOrder() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#020408" }}>
          <Loader2 size={32} className="animate-spin" style={{ color: "#22d3ee" }} />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
