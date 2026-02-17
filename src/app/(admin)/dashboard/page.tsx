"use client";

import { LayoutDashboard, ShoppingCart, Package, LogOut, ArrowUpRight, PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const hasFetched = useRef(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    newOrders: 0,
    totalProducts: 0
  });

  // ✅ createBrowserClient - cookies properly read කරයි
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (hasFetched.current) return;

    async function initDashboard() {
      try {
        // ✅ Auth check - proxy.ts already protect කරනවා
        // හැබැයි data fetch කිරීමට user id ඕනේ
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          window.location.href = "/login";
          return;
        }

        // Fetch Stats and Orders
        const [productRes, orderRes] = await Promise.all([
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('*').order('created_at', { ascending: false })
        ]);

        if (orderRes.data) {
          const orders = orderRes.data;
          const totalSales = orders.reduce((acc: number, o: any) => acc + (o.total_amount || 0), 0);
          const pendingOrders = orders.filter((o: any) => o.status === "Pending").length;

          setStats({
            totalSales,
            newOrders: pendingOrders,
            totalProducts: productRes.count || 0
          });
          setRecentOrders(orders.slice(0, 5));
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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 transition-colors">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 font-sans text-black dark:text-white transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-8 hidden md:block border-r border-gray-800 shrink-0">
        <h2 className="text-2xl font-black italic tracking-tighter mb-10 text-white underline decoration-blue-600 underline-offset-4">REINA ADMIN.</h2>
        <nav className="space-y-6">
          <Link href="/dashboard" className="flex items-center gap-3 text-blue-500 font-black transition-colors">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/add-product" className="flex items-center gap-3 text-gray-400 hover:text-white transition-all font-bold">
            <PlusCircle size={20} /> Add Product
          </Link>
          <Link href="/orders" className="flex items-center gap-3 text-gray-400 hover:text-white transition-all font-bold">
            <Package size={20} /> Orders
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-500 mt-20 font-black hover:text-red-400 transition-colors uppercase text-xs tracking-widest"
          >
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">Overview.</h1>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Slipper Store Live Performance</p>
          </div>
          <Link href="/add-product" className="bg-black dark:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 shadow-xl">
            <PlusCircle size={18} /> New Product
          </Link>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <StatCard title="Total Sales" value={`Rs. ${stats.totalSales.toLocaleString()}`} icon={<ShoppingCart />} color="blue" />
          <StatCard title="Active Orders" value={stats.newOrders.toString().padStart(2, '0')} icon={<Package />} color="orange" isClock />
          <StatCard title="Total Models" value={stats.totalProducts.toString()} icon={<LayoutDashboard />} color="purple" />
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm p-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Recent Orders.</h2>
            <Link href="/orders" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-600">Explore All →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 dark:border-slate-800 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="pb-6">Order Info</th>
                  <th className="pb-6">Customer</th>
                  <th className="pb-6">Status</th>
                  <th className="pb-6 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50/50 transition-colors">
                      <td className="py-6 font-mono text-[10px] text-gray-400 uppercase tracking-widest">#{order.id.slice(0, 8)}</td>
                      <td className="py-6 italic text-black dark:text-gray-200 font-black uppercase text-xs">{order.customer_name}</td>
                      <td className="py-6">
                        <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900/50">
                          {order.status}
                        </span>
                      </td>
                      <td className="py-6 text-right font-black text-blue-600 text-base">Rs. {order.total_amount?.toLocaleString()}</td>
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

function StatCard({ title, value, icon, color, isClock = false }: any) {
  const colorClasses: any = {
    blue: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
    orange: "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400",
    purple: "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400",
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 group">
      <div className={`${colorClasses[color]} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
      <div className="flex justify-between items-end">
        <h3 className="text-3xl font-black tracking-tighter dark:text-white">{value}</h3>
        <div className={`${colorClasses[color]} p-1 rounded-lg`}>
          {isClock ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ) : (
            <ArrowUpRight size={16} />
          )}
        </div>
      </div>
    </div>
  );
}