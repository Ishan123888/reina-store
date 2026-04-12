"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Printer, ArrowLeft, Loader2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/core/configs/supabase-browser";

export default function AdminInvoicePage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.from("orders").select("*").eq("id", id).single();
      setOrder(data || null);
      setLoading(false);
    }
    load();
  }, [id]);

  const items = useMemo(() => (Array.isArray(order?.items) ? order.items : []), [order]);
  const subtotal = useMemo(() => items.reduce((sum: number, i: any) => sum + (i.price || 0) * (i.quantity || 0), 0), [items]);
  const total = Number(order?.total_amount || 0);
  const shipping = Math.max(0, total - subtotal);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-pink-300" size={36} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-white/70">
        <p className="font-black uppercase tracking-widest text-xs">Invoice not found.</p>
        <Link href="/orders" className="inline-flex items-center gap-2 mt-6 text-pink-300 font-black uppercase tracking-widest text-[10px]">
          <ArrowLeft size={14} /> Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 print:hidden">
        <Link href="/orders" className="inline-flex items-center gap-2 text-white/70 hover:text-white font-black uppercase tracking-widest text-[10px]">
          <ArrowLeft size={14} /> Back to Orders
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-pink-500/15 border border-pink-500/25 text-pink-200 font-black uppercase tracking-widest text-[10px] hover:bg-pink-500/25 transition-all"
        >
          <Printer size={16} /> Print / Save PDF
        </button>
      </div>

      <div className="bg-white text-black rounded-3xl p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Invoice</h1>
            <p className="text-xs font-bold text-gray-500 mt-1">Reina Ladies Slipper Store</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</p>
            <p className="font-black text-sm break-all">{order.id}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-3">Status</p>
            <p className="font-black uppercase text-sm">{order.status || "Pending"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <div className="border rounded-2xl p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Bill To</p>
            <p className="font-black uppercase">{order.customer_name}</p>
            <p className="font-bold text-gray-600">{order.phone}</p>
            <p className="font-bold text-gray-600 whitespace-pre-line">{order.address}</p>
          </div>
          <div className="border rounded-2xl p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Payment</p>
            <p className="font-black uppercase">Cash on Delivery (COD)</p>
            <p className="font-bold text-gray-600">Shipping: Rs. {shipping.toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto border rounded-2xl">
          <table className="min-w-[720px] w-full text-left">
            <thead className="bg-gray-50">
              <tr className="text-[10px] uppercase tracking-widest text-gray-500">
                <th className="p-4 font-black">Item</th>
                <th className="p-4 font-black">Options</th>
                <th className="p-4 font-black">Qty</th>
                <th className="p-4 font-black">Unit</th>
                <th className="p-4 font-black text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i: any, idx: number) => (
                <tr key={`${i.id ?? "x"}-${idx}`} className="border-t">
                  <td className="p-4 font-bold">{i.name}</td>
                  <td className="p-4 text-sm text-gray-600 font-bold">
                    {i.color ? `Color: ${i.color}` : "—"}{i.color && i.size ? " • " : ""}{i.size ? `Size: ${i.size}` : ""}
                  </td>
                  <td className="p-4 font-bold">{i.quantity}</td>
                  <td className="p-4 font-bold">Rs. {(i.price || 0).toLocaleString()}</td>
                  <td className="p-4 font-black text-right">Rs. {((i.price || 0) * (i.quantity || 0)).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-end">
          <div className="w-full sm:w-[360px] space-y-2">
            <div className="flex justify-between text-gray-600 font-bold text-sm">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600 font-bold text-sm">
              <span>Shipping</span>
              <span>Rs. {shipping.toLocaleString()}</span>
            </div>
            <div className="pt-3 mt-2 border-t flex justify-between text-xl font-black">
              <span>Grand Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-xs font-bold text-gray-400">
          Thank you for shopping with Reina.
        </p>
      </div>
    </div>
  );
}

