"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Loader2,
  Package,
  PlusCircle,
  ShoppingCart,
  Users,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/core/configs/supabase-browser";

// Types නිවැරදි කිරීම
type OrderItem = {
  name: string;
  quantity: number;
};

type Order = {
  id: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[] | any; // JSON column එකක් නිසා any හෝ array විය හැක
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      const supabase = getSupabaseBrowserClient();

      try {
        // Promise.all පාවිච්චි කරලා එකපාර data ටික ගන්නවා
        const [productsRes, ordersRes, customerRes] = await Promise.all([
          supabase.from("products").select("id", { count: "exact", head: true }),
          supabase
            .from("orders")
            .select("id,customer_name,total_amount,status,created_at,items")
            .order("created_at", { ascending: false }),
          supabase
            .from("profiles")
            .select("id", { count: "exact", head: true })
            .eq("role", "customer"),
        ]);

        const orderRows = (ordersRes.data as Order[]) || [];
        
        // Stats ගණනය කිරීම
        const totalSales = orderRows.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
        const pendingOrders = orderRows.filter((o) => 
          o.status?.toLowerCase() === "pending"
        ).length;

        setOrders(orderRows.slice(0, 8)); // අන්තිම order 8ක් පෙන්වීමට
        setStats({
          totalSales,
          pendingOrders,
          totalProducts: productsRes.count || 0,
          totalCustomers: customerRes.count || 0,
        });
      } catch (error) {
        console.error("Dashboard data load error:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const cards = useMemo(
    () => [
      { 
        label: "Total Sales", 
        value: `Rs. ${stats.totalSales.toLocaleString()}`, 
        icon: <ShoppingCart size={16} /> 
      },
      { 
        label: "Pending Orders", 
        value: stats.pendingOrders.toString(), 
        icon: <Package size={16} /> 
      },
      { 
        label: "Products", 
        value: stats.totalProducts.toString(), 
        icon: <Boxes size={16} /> 
      },
      { 
        label: "Customers", 
        value: stats.totalCustomers.toString(), 
        icon: <Users size={16} /> 
      },
    ],
    [stats]
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-300" size={36} />
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-3xl p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-7">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-200/80 font-bold">Admin Overview</p>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter mt-2">Dashboard.</h1>
          <p className="text-white/50 text-sm mt-2">Monitor orders, customer registrations, and inventory activity.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/add-product"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-black uppercase tracking-widest text-[10px]"
          >
            <PlusCircle size={14} /> Add Slippers
          </Link>
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 border border-white/15 text-white font-black uppercase tracking-widest text-[10px]"
          >
            Manage Orders <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="glass-soft glass-hover rounded-2xl p-5">
            <div className="w-9 h-9 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-300 mb-3">
              {card.icon}
            </div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-white/50 font-bold">{card.label}</p>
            <p className="text-xl font-black mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="glass-soft rounded-2xl overflow-x-auto">
        <table className="min-w-190 w-full text-left">
          <thead className="bg-white/5">
            <tr className="text-[10px] uppercase tracking-[0.18em] text-white/50">
              <th className="p-4 font-black">Order</th>
              <th className="p-4 font-black">Customer</th>
              <th className="p-4 font-black">Items</th>
              <th className="p-4 font-black">Amount</th>
              <th className="p-4 font-black">Status</th>
              <th className="p-4 font-black">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td className="p-10 text-center text-white/50 font-bold" colSpan={6}>
                  No orders available.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-t border-white/10 hover:bg-white/5 transition-all">
                  <td className="p-4 font-bold text-cyan-300">#{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="p-4 font-bold text-white/80">{order.customer_name}</td>
                  <td className="p-4 font-bold text-white/60 text-xs">
                    {Array.isArray(order.items) 
                      ? order.items.slice(0, 2).map((item: any) => `${item.quantity}x ${item.name}`).join(", ") 
                      : "No items"}
                  </td>
                  <td className="p-4 font-black">Rs. {Number(order.total_amount || 0).toLocaleString()}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/10 border border-white/15">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-white/60 font-bold text-xs">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}