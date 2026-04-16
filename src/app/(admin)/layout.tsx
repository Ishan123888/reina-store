"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2, LayoutDashboard, Package, ShoppingCart, Users, FileText, LogOut } from "lucide-react";
import { getSupabaseBrowserClient } from "@/core/configs/supabase-browser";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const bgImageUrl = "https://i.imgur.com/6VS5Ue8.png";

  useEffect(() => {
    async function guard() {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if ((profile as any)?.role !== "admin") {
        window.location.href = "/";
        return;
      }

      setAllowed(true);
      setLoading(false);
    }

    guard();
  }, []);

  const logout = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0010]">
        <Loader2 className="animate-spin text-pink-400" size={36} />
      </div>
    );
  }

  if (!allowed) return null;

  const nav = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { href: "/add-product", label: "Products", icon: <Package size={18} /> },
    { href: "/orders", label: "Orders", icon: <ShoppingCart size={18} /> },
    { href: "/customers", label: "Customers", icon: <Users size={18} /> },
  ];

  return (
    <div
      className="min-h-screen text-white font-sans"
      style={{
        backgroundColor: "#020408",
        backgroundImage: `linear-gradient(rgba(2, 4, 8, 0.9), rgba(2, 4, 8, 0.95)), url("${bgImageUrl}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl h-fit sticky top-6">
          <div className="flex items-center justify-between mb-6">
            <p className="font-black uppercase tracking-widest text-[10px] text-white/60">Reina Admin</p>
            <button
              onClick={logout}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>

          <nav className="space-y-2">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${
                    active
                      ? "bg-white/10 border-white/20"
                      : "bg-white/0 border-white/0 hover:bg-white/5 hover:border-white/10"
                  }`}
                >
                  <span className="text-pink-300">{item.icon}</span>
                  <span className="font-black uppercase tracking-widest text-[10px] text-white/80">{item.label}</span>
                </Link>
              );
            })}

            <Link
              href="/orders"
              className="hidden"
              aria-hidden
            >
              <FileText size={0} />
            </Link>
          </nav>
        </aside>

        <main className="lg:col-span-9">{children}</main>
      </div>
    </div>
  );
}

