"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Clock3,
  Download,
  Loader2,
  LogOut,
  Package,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/core/configs/supabase-browser";
import { resolveUserRole } from "@/core/auth/auth-helpers";

type Profile = {
  id: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  role?: string | null;
};

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
};

type Order = {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
};

const bgImageUrl = "https://i.imgur.com/6VS5Ue8.png";

function normalizeOrderStatus(status?: string | null) {
  switch ((status || "").toLowerCase()) {
    case "pending":
      return "Pending";
    case "processing":
      return "Processing";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return status || "Pending";
  }
}

async function fetchOrdersForUser(supabase: ReturnType<typeof getSupabaseBrowserClient>, userId: string) {
  const modern = await supabase
    .from("orders")
    .select("id,status,total_amount,created_at,items")
    .eq("customer_id", userId)
    .order("created_at", { ascending: false });

  if (!modern.error && (modern.data?.length || 0) > 0) {
    return modern.data as Order[];
  }

  const legacy = await supabase
    .from("orders")
    .select("id,status,total_amount,created_at,items")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (!legacy.error) {
    return (legacy.data as Order[]) || [];
  }

  if (!modern.error) {
    return (modern.data as Order[]) || [];
  }

  throw legacy.error ?? modern.error;
}

export default function CustomerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("id,full_name,email,phone,address,role")
        .eq("id", user.id)
        .maybeSingle();

      const role = resolveUserRole(profileData?.role, user.email);
      if (role === "admin") {
        window.location.href = "/dashboard";
        return;
      }

      setProfile(
        (profileData as Profile | null) ?? {
          id: user.id,
          email: user.email,
          role: "customer",
        }
      );

      const orderData = await fetchOrdersForUser(supabase, user.id);
      setOrders(orderData);
      setLoading(false);
    }

    load();
  }, []);

  async function downloadInvoice(orderId: string) {
    setDownloading(orderId);
    try {
      const response = await fetch(`/api/invoices/${orderId}`);
      if (!response.ok) throw new Error("Failed to load invoice");
      const html = await response.text();
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${orderId.slice(0, 8).toUpperCase()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      alert("Unable to download invoice right now.");
    } finally {
      setDownloading(null);
    }
  }

  async function handleLogout() {
    setSigningOut(true);
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const pending = orders.filter((o) => normalizeOrderStatus(o.status) === "Pending").length;
    const delivered = orders.filter((o) => normalizeOrderStatus(o.status) === "Delivered").length;
    const spent = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
    return { totalOrders, pending, delivered, spent };
  }, [orders]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#020408",
          backgroundImage: `linear-gradient(rgba(2, 4, 8, 0.92), rgba(2, 4, 8, 0.96)), url("${bgImageUrl}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Loader2 size={36} className="animate-spin" style={{ color: "#22d3ee" }} />
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
        color: "#fff",
        padding: "50px 20px 70px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Syne:wght@600;700;800&display=swap');
        .glass {
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
        }
        .small-tag {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-weight: 700;
          color: rgba(255,255,255,0.4);
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gap: 24 }}>
        <div className="glass" style={{ padding: 28, display: "grid", gap: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <p className="small-tag">Customer Dashboard</p>
              <h1
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                  margin: "8px 0",
                }}
              >
                Welcome {profile?.full_name?.split(" ")[0] || "Customer"}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, margin: 0 }}>
                Your orders, billing details, and profile information in one place.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <Link
                href="/collections"
                style={{
                  textDecoration: "none",
                  color: "#020408",
                  background: "#22d3ee",
                  borderRadius: 12,
                  padding: "12px 16px",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Shop Now
              </Link>
              <Link
                href="/cart"
                style={{
                  textDecoration: "none",
                  color: "#fff",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  padding: "12px 16px",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                View Cart
              </Link>
              <button
                onClick={handleLogout}
                disabled={signingOut}
                style={{
                  color: "#fff",
                  background: "rgba(239,68,68,0.18)",
                  border: "1px solid rgba(248,113,113,0.24)",
                  borderRadius: 12,
                  padding: "12px 16px",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                }}
              >
                {signingOut ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}
                Logout
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
            <StatCard icon={<Package size={16} />} label="Total Orders" value={stats.totalOrders.toString()} />
            <StatCard icon={<Clock3 size={16} />} label="Pending" value={stats.pending.toString()} />
            <StatCard icon={<Truck size={16} />} label="Delivered" value={stats.delivered.toString()} />
            <StatCard icon={<ShoppingBag size={16} />} label="Total Spent" value={`Rs. ${stats.spent.toLocaleString()}`} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}>
          <div className="glass" style={{ padding: 20, height: "fit-content" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(34,211,238,0.12)",
                }}
              >
                <User size={17} style={{ color: "#22d3ee" }} />
              </div>
              <div>
                <p className="small-tag" style={{ margin: 0 }}>
                  Profile
                </p>
                <p style={{ margin: "4px 0 0", fontWeight: 600 }}>{profile?.full_name || "Customer"}</p>
              </div>
            </div>
            <ProfileRow label="Email" value={profile?.email || "-"} />
            <ProfileRow label="Phone" value={profile?.phone || "-"} />
            <ProfileRow label="Address" value={profile?.address || "-"} />
            <ProfileRow label="Role" value={profile?.role || "customer"} />
          </div>

          <div className="glass" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <p className="small-tag" style={{ margin: 0 }}>
                  Order History
                </p>
                <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
                  Only your account orders are visible here.
                </p>
              </div>
              <Link
                href="/track-order"
                style={{
                  color: "#22d3ee",
                  textDecoration: "none",
                  fontSize: 12,
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                Track Orders <ArrowRight size={14} />
              </Link>
            </div>

            {orders.length === 0 ? (
              <div
                style={{
                  border: "1px dashed rgba(255,255,255,0.18)",
                  borderRadius: 14,
                  padding: 32,
                  textAlign: "center",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 13,
                }}
              >
                No orders yet. Start from the collections page.
              </div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {orders.map((order) => (
                  <div
                    key={order.id}
                    style={{
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: 14,
                      padding: 14,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                      <div>
                        <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p style={{ margin: "6px 0 0", fontWeight: 700 }}>
                          Rs. {Number(order.total_amount || 0).toLocaleString()}
                        </p>
                        <p style={{ margin: "4px 0 0", fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>

                      <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
                        <StatusPill status={order.status} />
                        <button
                          onClick={() => downloadInvoice(order.id)}
                          disabled={downloading === order.id}
                          style={{
                            border: "1px solid rgba(34,211,238,0.35)",
                            color: "#22d3ee",
                            background: "rgba(34,211,238,0.08)",
                            borderRadius: 10,
                            padding: "8px 11px",
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            display: "inline-flex",
                            gap: 6,
                            alignItems: "center",
                          }}
                        >
                          {downloading === order.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Download size={12} />
                          )}
                          Invoice
                        </button>
                      </div>
                    </div>

                    <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 7 }}>
                      {(order.items || []).slice(0, 4).map((item, index) => (
                        <span
                          key={`${order.id}-${index}`}
                          style={{
                            fontSize: 11,
                            padding: "4px 8px",
                            borderRadius: 8,
                            background: "rgba(255,255,255,0.07)",
                            color: "rgba(255,255,255,0.75)",
                          }}
                        >
                          {item.quantity}x {item.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@media(max-width: 980px){div[style*="grid-template-columns: 320px 1fr"]{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.03)",
        borderRadius: 14,
        padding: "14px 16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#22d3ee", marginBottom: 6 }}>{icon}</div>
      <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{label}</p>
      <p style={{ margin: "5px 0 0", fontWeight: 700 }}>{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const normalizedStatus = normalizeOrderStatus(status);
  const map: Record<string, { fg: string; bg: string }> = {
    Pending: { fg: "#fbbf24", bg: "rgba(251,191,36,0.14)" },
    Processing: { fg: "#22d3ee", bg: "rgba(34,211,238,0.14)" },
    Shipped: { fg: "#60a5fa", bg: "rgba(96,165,250,0.14)" },
    Delivered: { fg: "#34d399", bg: "rgba(52,211,153,0.14)" },
    Cancelled: { fg: "#f87171", bg: "rgba(248,113,113,0.14)" },
  };
  const tone = map[normalizedStatus] ?? { fg: "#fff", bg: "rgba(255,255,255,0.16)" };

  return (
    <span
      style={{
        fontSize: 10,
        padding: "5px 10px",
        borderRadius: 999,
        fontWeight: 700,
        color: tone.fg,
        background: tone.bg,
      }}
    >
      {normalizedStatus}
    </span>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10, marginTop: 10 }}>
      <p style={{ margin: 0, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.16em", color: "rgba(255,255,255,0.45)" }}>
        {label}
      </p>
      <p style={{ margin: "6px 0 0", fontSize: 13, color: "rgba(255,255,255,0.85)" }}>{value}</p>
    </div>
  );
}
