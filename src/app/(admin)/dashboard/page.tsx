"use client";

import { LayoutDashboard, ShoppingCart, Package, LogOut, ArrowUpRight, PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    newOrders: 0,
    totalProducts: 0
  });

  useEffect(() => {
    async function initDashboard() {
      try {
        // Security Check: User ගේ Role එක පරීක්ෂා කිරීම
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          window.location.assign("/login");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role !== "admin") {
          window.location.assign("/collections");
          return;
        }

        // දත්ත ලබා ගැනීම (Fetching Data)
        const { count: productCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        const { data: orders, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (orderError) throw orderError;

        if (orders) {
          const totalSales = orders.reduce((acc, order) => acc + (order.total_amount || 0), 0);
          const pendingOrders = orders.filter(o => o.status === "Pending").length;

          setStats({
            totalSales,
            newOrders: pendingOrders,
            totalProducts: productCount || 0
          });
          setRecentOrders(orders.slice(0, 5));
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    initDashboard();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.assign("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-black" size={40} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-8 hidden md:block border-r border-gray-800">
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
          <div className="flex items-center gap-4">
            <Link href="/add-product" className="bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 shadow-xl">
              <PlusCircle size={18} /> New Product
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <StatCard title="Total Sales" value={`Rs. ${stats.totalSales.toLocaleString()}`} icon={<ShoppingCart />} color="blue" />
          <StatCard title="Active Orders" value={stats.newOrders.toString().padStart(2, '0')} icon={<Package />} color="orange" isClock />
          <StatCard title="Total Models" value={stats.totalProducts.toString()} icon={<LayoutDashboard />} color="purple" />
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Recent Orders.</h2>
            <Link href="/orders" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-600">Explore All →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="pb-6">Order Info</th>
                  <th className="pb-6">Customer</th>
                  <th className="pb-6">Status</th>
                  <th className="pb-6 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-6 font-mono text-[10px] text-gray-400 uppercase tracking-widest">#{order.id.slice(0, 8)}</td>
                    <td className="py-6 italic text-black font-black uppercase text-xs">{order.customer_name}</td>
                    <td className="py-6">
                      <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border bg-orange-50 text-orange-600 border-orange-100">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-6 text-right font-black text-blue-600 text-base">Rs. {order.total_amount?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

// Sub-component for Stats to keep code clean
function StatCard({ title, value, icon, color, isClock = false }: any) {
  const colorClasses: any = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
      <div className={`${colorClasses[color]} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
      <div className="flex justify-between items-end">
        <h3 className="text-3xl font-black tracking-tighter">{value}</h3>
        <div className={`${colorClasses[color]} p-1 rounded-lg`}>
          {isClock ? <ClockIcon size={16} /> : <ArrowUpRight size={16} />}
        </div>
      </div>
    </div>
  );
}

function ClockIcon({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}