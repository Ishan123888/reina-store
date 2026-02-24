"use client";

import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  LogOut,
  ArrowUpRight,
  PlusCircle,
  Loader2,
  Clock,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const hasFetched = useRef(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    newOrders: 0,
    totalProducts: 0,
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (hasFetched.current) return;

    async function initDashboard() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          window.location.href = "/login";
          return;
        }

        const [productRes, orderRes] = await Promise.all([
          supabase
            .from("products")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false }),
        ]);

        if (orderRes.data) {
          const orders = orderRes.data;
          const totalSales = orders.reduce(
            (acc: number, o: any) => acc + (o.total_amount || 0),
            0
          );
          const pendingOrders = orders.filter(
            (o: any) => o.status === "Pending"
          ).length;

          setStats({
            totalSales,
            newOrders: pendingOrders,
            totalProducts: productRes.count || 0,
          });
          setRecentOrders(orders.slice(0, 6));
        }

        hasFetched.current = true;
      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    }

    initDashboard();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center",
        background: "#0d0010",
      }}>
        <style>{`
          @keyframes db-spin { to { transform: rotate(360deg); } }
          .db-spinner { animation: db-spin 0.8s linear infinite; }
        `}</style>
        <div style={{ textAlign: "center" }}>
          <Loader2
            className="db-spinner"
            size={36}
            style={{ color: "#f472b6", margin: "0 auto 16px" }}
          />
          <p style={{
            color: "#f472b6", fontSize: 12,
            fontWeight: 500, letterSpacing: "0.1em",
          }}>
            Loading Dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: "#0d0010",
      fontFamily: "sans-serif",
    }}>
      <style>{`
        @keyframes db-fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .db-fadeUp { animation: db-fadeUp 0.5s ease-out both; }
        
        .db-glass {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.07);
        }

        .db-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.9rem;
          text-decoration: none;
          color: rgba(255,255,255,0.6);
          transition: all 0.2s ease;
        }
        .db-nav-link:hover {
          color: #fff;
          background: rgba(244,114,182,0.1);
        }
        .db-nav-link.active {
          color: #f472b6;
          background: rgba(244,114,182,0.1);
        }

        .db-stat-card {
          border-radius: 16px;
          padding: 24px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
        }

        .db-table-row {
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .db-add-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          color: #fff;
          background: #ec4899;
          transition: opacity 0.2s;
        }
        .db-add-btn:hover {
          opacity: 0.9;
        }
      `}</style>

      {/* SIDEBAR */}
      <aside style={{
        width: 240, flexShrink: 0,
        padding: "30px 20px",
        background: "rgba(0,0,0,0.2)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh",
      }}>
        {/* Brand */}
        <div style={{ marginBottom: 40, paddingLeft: 10 }}>
          <h2 style={{
            fontSize: "1.5rem", fontWeight: 700, color: "#f472b6",
          }}>
            REINA
          </h2>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
          <Link href="/dashboard" className="db-nav-link active">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link href="/add-product" className="db-nav-link">
            <PlusCircle size={18} />
            Add Product
          </Link>

          <Link href="/orders" className="db-nav-link">
            <Package size={18} />
            Orders
          </Link>

          <div style={{ marginTop: "auto", paddingTop: 20 }}>
            <button onClick={handleLogout} className="db-nav-link" style={{ border: "none", background: "none", width: "100%", cursor: "pointer", color: "#f87171" }}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
        
        {/* Header */}
        <header className="db-fadeUp" style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 40,
        }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#fff", margin: 0 }}>
              Overview
            </h1>
          </div>
          <Link href="/add-product" className="db-add-btn">
            <PlusCircle size={18} />
            New Product
          </Link>
        </header>

        {/* Stats */}
        <div className="db-fadeUp" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20, marginBottom: 40,
        }}>
          <div className="db-stat-card">
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 10 }}>Total Sales</p>
            <h3 style={{ fontSize: "1.8rem", color: "#fff", margin: 0 }}>
              Rs. {stats.totalSales.toLocaleString()}
            </h3>
          </div>

          <div className="db-stat-card">
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 10 }}>Active Orders</p>
            <h3 style={{ fontSize: "1.8rem", color: "#fbbf24", margin: 0 }}>
              {stats.newOrders}
            </h3>
          </div>

          <div className="db-stat-card">
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 10 }}>Total Products</p>
            <h3 style={{ fontSize: "1.8rem", color: "#a78bfa", margin: 0 }}>
              {stats.totalProducts}
            </h3>
          </div>
        </div>

        {/* Table */}
        <div className="db-glass db-fadeUp" style={{ borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <h2 style={{ fontSize: "1.1rem", color: "#fff", margin: 0 }}>Recent Orders</h2>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                  {["Order ID", "Customer", "Amount", "Status", "Date"].map((h) => (
                    <th key={h} style={{
                      padding: "15px 24px", textAlign: "left",
                      fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 600,
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                      No orders available
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="db-table-row">
                      <td style={{ padding: "15px 24px", color: "#f472b6", fontSize: 13 }}>
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td style={{ padding: "15px 24px", color: "#fff", fontSize: 14 }}>
                        {order.customer_name}
                      </td>
                      <td style={{ padding: "15px 24px", color: "#fff", fontWeight: 600 }}>
                        Rs. {order.total_amount?.toLocaleString()}
                      </td>
                      <td style={{ padding: "15px 24px" }}>
                        <StatusBadge status={order.status} />
                      </td>
                      <td style={{ padding: "15px 24px", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    Pending: { bg: "rgba(251,191,36,0.1)", color: "#fbbf24" },
    Delivered: { bg: "rgba(52,211,153,0.1)", color: "#34d399" },
    Cancelled: { bg: "rgba(248,113,113,0.1)", color: "#f87171" },
  };

  const s = styles[status] ?? { bg: "rgba(255,255,255,0.05)", color: "#fff" };

  return (
    <span style={{
      padding: "4px 10px", borderRadius: "6px",
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 600,
    }}>
      {status}
    </span>
  );
}