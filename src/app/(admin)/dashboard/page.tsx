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
  items: OrderItem[];
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
      const supabase = getSupabaseBrowserClient();

      try {
        const [productsRes, ordersRes, customerRes] = await Promise.all([
          supabase.from("products").select("id", { count: "exact", head: true }),
          supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("profiles")
            .select("id", { count: "exact", head: true })
            .eq("role", "customer"),
        ]);

        const orderRows = (ordersRes.data as Order[]) || [];

        const totalSales = orderRows.reduce(
          (sum, o) => sum + Number(o.total_amount || 0),
          0
        );

        const pendingOrders = orderRows.filter(
          (o) => o.status?.toLowerCase() === "pending"
        ).length;

        setOrders(orderRows.slice(0, 6));
        setStats({
          totalSales,
          pendingOrders,
          totalProducts: productsRes.count || 0,
          totalCustomers: customerRes.count || 0,
        });
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
        icon: <ShoppingCart size={18} />,
      },
      {
        label: "Pending Orders",
        value: stats.pendingOrders,
        icon: <Package size={18} />,
      },
      {
        label: "Products",
        value: stats.totalProducts,
        icon: <Boxes size={18} />,
      },
      {
        label: "Customers",
        value: stats.totalCustomers,
        icon: <Users size={18} />,
      },
    ],
    [stats]
  );

  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === "pending")
      return "bg-yellow-400/10 text-yellow-300 border-yellow-400/20";
    if (s === "completed")
      return "bg-green-400/10 text-green-300 border-green-400/20";
    if (s === "cancelled")
      return "bg-red-400/10 text-red-300 border-red-400/20";
    return "bg-white/10 text-white/60 border-white/20";
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-400" size={34} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Overview of sales, orders and customers
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/add-product"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 text-white text-sm hover:bg-cyan-600 transition"
          >
            <PlusCircle size={16} /> Add Product
          </Link>

          <Link
            href="/orders"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-white text-sm hover:bg-white/5 transition"
          >
            Orders <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-cyan-400">{c.icon}</div>
            </div>
            <p className="text-sm text-slate-400">{c.label}</p>
            <p className="text-xl font-semibold text-white mt-1">
              {c.value}
            </p>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-sm font-medium text-white">
            Recent Orders
          </h2>
          <Link
            href="/orders"
            className="text-sm text-cyan-400 flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-400 text-xs">
              <tr>
                <th className="p-4 text-left">Order</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Items</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  <td className="p-4 text-cyan-400 font-medium">
                    #{o.id.slice(0, 6)}
                  </td>

                  <td className="p-4 text-white">
                    {o.customer_name}
                  </td>

                  <td className="p-4 text-slate-400 text-xs">
                    {Array.isArray(o.items)
                      ? o.items
                          .slice(0, 2)
                          .map(
                            (item) =>
                              `${item.quantity}x ${item.name}`
                          )
                          .join(", ")
                      : "-"}
                  </td>

                  <td className="p-4 text-white font-medium">
                    Rs. {Number(o.total_amount).toLocaleString()}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full border ${getStatusStyle(
                        o.status
                      )}`}
                    >
                      {o.status}
                    </span>
                  </td>

                  <td className="p-4 text-slate-400 text-xs">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}