"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/core/configs/supabase-browser";
import { Loader2, Search, Users } from "lucide-react";

type CustomerRow = {
  id: string;
  email?: string | null;
  full_name?: string | null;
  phone?: string | null;
  address?: string | null;
  created_at?: string | null;
};

export default function AdminCustomersPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<CustomerRow[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("id,email,full_name,phone,address,created_at,role")
        .eq("role", "customer")
        .order("created_at", { ascending: false });

      if (!error) {
        setRows((data as any[])?.map((r) => ({
          id: r.id,
          email: r.email,
          full_name: r.full_name,
          phone: r.phone,
          address: r.address,
          created_at: r.created_at,
        })) || []);
      } else {
        // fallback for older schemas (profiles without extra columns)
        const { data: data2 } = await supabase
          .from("profiles")
          .select("id,email,created_at,role")
          .eq("role", "customer")
          .order("created_at", { ascending: false });
        setRows((data2 as any[])?.map((r) => ({ id: r.id, email: r.email, created_at: r.created_at })) || []);
      }

      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.email, r.full_name, r.phone, r.address, r.id].some((v) => String(v || "").toLowerCase().includes(q))
    );
  }, [rows, query]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-pink-300" size={36} />
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
            <Users className="text-pink-300" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Customers.</h1>
            <p className="text-white/50 font-bold text-xs uppercase tracking-widest">
              Registered customer list
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-90">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name / email / phone"
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none text-white placeholder:text-white/40 font-bold text-sm"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-white/60 font-bold">
          No customers found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-225 w-full text-left">
            <thead className="bg-white/5">
              <tr className="text-[10px] uppercase tracking-widest text-white/50">
                <th className="p-4 font-black">Name</th>
                <th className="p-4 font-black">Email</th>
                <th className="p-4 font-black">Phone</th>
                <th className="p-4 font-black">Address</th>
                <th className="p-4 font-black">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-white/10 hover:bg-white/5 transition-all">
                  <td className="p-4 font-black text-white/90">{r.full_name || "—"}</td>
                  <td className="p-4 font-bold text-white/70">{r.email || "—"}</td>
                  <td className="p-4 font-bold text-white/70">{r.phone || "—"}</td>
                  <td className="p-4 font-bold text-white/70 max-w-90 truncate">{r.address || "—"}</td>
                  <td className="p-4 font-bold text-white/50">
                    {r.created_at ? new Date(r.created_at).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

