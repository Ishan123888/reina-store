"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Package, Truck, CheckCircle, Clock, ExternalLink, Loader2, Search } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setOrders(data || []);
    setLoading(false);
  }

  async function updateStatus(orderId: string, newStatus: string) {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (!error) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  }

  const filteredOrders = filter === "All" ? orders : orders.filter(o => o.status === filter);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-black" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 lg:p-12 font-sans text-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">Manage Orders.</h1>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-2">Incoming Customer Requests</p>
          </div>

          <div className="flex gap-2 bg-white p-2 rounded-3xl shadow-sm border border-gray-100 overflow-x-auto">
            {["All", "Pending", "Shipped", "Delivered"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all ${filter === s ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-black'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-gray-200">
              <Package className="mx-auto text-gray-200 mb-4" size={48} />
              <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No orders found.</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500">
                <div className="flex flex-col lg:flex-row justify-between gap-8">
                  
                  {/* Customer Info */}
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-gray-300 font-bold text-[10px] uppercase">#{order.id.slice(0, 8)}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-black uppercase tracking-tight">{order.customer_name}</h2>
                      <p className="text-gray-500 font-bold text-sm">{order.phone}</p>
                      <p className="text-gray-400 text-xs mt-2 font-medium leading-relaxed max-w-sm">{order.address}</p>
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div className="flex-1 bg-gray-50 rounded-3xl p-6 border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Ordered Items</p>
                    <div className="space-y-3">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-xs font-bold uppercase">
                          <span className="text-gray-900">{item.quantity}x {item.name}</span>
                          <span className="text-gray-400">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="pt-3 border-t border-gray-200 flex justify-between items-center mt-3">
                        <span className="font-black text-xs uppercase">Total Paid</span>
                        <span className="text-blue-600 font-black text-lg">Rs. {order.total_amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col justify-center gap-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-1">Change Status</p>
                    <div className="flex flex-row lg:flex-col gap-2">
                      <button 
                        onClick={() => updateStatus(order.id, "Shipped")}
                        className="flex-1 lg:w-40 bg-white border border-gray-200 hover:border-blue-600 hover:text-blue-600 p-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                      >
                        <Truck size={14} /> Shipped
                      </button>
                      <button 
                        onClick={() => updateStatus(order.id, "Delivered")}
                        className="flex-1 lg:w-40 bg-white border border-gray-200 hover:border-green-600 hover:text-green-600 p-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={14} /> Delivered
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}