"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Loader2,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/core/configs/supabase-browser";
import { resolveUserRole } from "@/core/auth/auth-helpers";

type AdminSession = {
  email: string;
  fullName: string;
  role: string;
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<AdminSession | null>(null);
  const bgImageUrl = "/contact-bg.png";

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
        .select("role, email, full_name")
        .eq("id", user.id)
        .maybeSingle();

      const role = resolveUserRole(profile?.role, user.email);

      if (role !== "admin") {
        window.location.href = "/customer-dashboard";
        return;
      }

      setSessionInfo({
        email: profile?.email ?? user.email ?? "-",
        fullName: profile?.full_name ?? user.user_metadata?.full_name ?? "Admin User",
        role,
      });
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
        backgroundImage: `linear-gradient(rgba(2, 4, 8, 0.76), rgba(2, 4, 8, 0.9)), url("${bgImageUrl}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="sticky top-6 h-fit rounded-[28px] border border-white/12 bg-white/8 p-6 backdrop-blur-2xl lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-white/60">
              Reina Admin
            </p>
            <button
              onClick={logout}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/6 transition-all hover:bg-white/12"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>

          {sessionInfo && (
            <div className="mb-6 rounded-[24px] border border-cyan-300/18 bg-white/8 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-300/14 text-cyan-200">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-100/70">
                    {sessionInfo.role}
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {sessionInfo.fullName}
                  </p>
                </div>
              </div>
              <p className="mt-3 break-all text-xs text-white/60">{sessionInfo.email}</p>
            </div>
          )}

          <nav className="space-y-2">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${
                    active
                      ? "border-cyan-300/20 bg-white/14 shadow-lg shadow-cyan-950/10"
                      : "border-transparent bg-white/0 hover:border-white/10 hover:bg-white/7"
                  }`}
                >
                  <span className={`${active ? "text-cyan-200" : "text-cyan-100/80"}`}>{item.icon}</span>
                  <span className="text-sm font-medium tracking-[0.02em] text-white/85">
                    {item.label}
                  </span>
                </Link>
              );
            })}

            <Link href="/orders" className="hidden" aria-hidden>
              <FileText size={0} />
            </Link>
          </nav>
        </aside>

        <main className="lg:col-span-9">{children}</main>
      </div>
    </div>
  );
}
