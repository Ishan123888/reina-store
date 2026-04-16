"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/core/configs/supabase-browser";
import { Loader2, Search, Users, LogOut, ShoppingBag, CreditCard, CheckCircle, User } from "lucide-react";
import { useRouter } from "next/navigation";

type CustomerRow = {
  id: string;
  email?: string | null;
  full_name?: string | null;
  phone?: string | null;
  address?: string | null;
  created_at?: string | null;
};

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CustomerRow | null>(null);
  
  const supabase = getSupabaseBrowserClient();

  // Sign Out Function
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      // '/login' එකට redirect කරනවා. window.location පාවිච්චි කරන්නේ session එක සම්පූර්ණයෙන්ම clear වෙන්නයි.
      window.location.href = "/login";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!error && data) {
          setProfile(data);
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-pink-300" size={36} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header with Sign Out Button */}
      <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/10 glass-panel">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">
            My <span className="text-pink-400">Dashboard.</span>
          </h1>
          <p className="text-white/40 font-bold text-xs uppercase tracking-widest mt-1">
            Manage your account & orders
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-lg shadow-red-500/5"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Profile */}
        <div className="lg:col-span-1 space-y-8">
          {/* Stats Card */}
          <div className="glass-panel rounded-3xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBag className="text-pink-400" size={20} />
              <h2 className="text-lg font-black uppercase italic text-white">Quick Stats</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-white/40 text-[10px] font-bold uppercase mb-1">Orders</p>
                <p className="text-2xl font-black text-white">0</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-white/40 text-[10px] font-bold uppercase mb-1">Delivered</p>
                <p className="text-2xl font-black text-pink-400">0</p>
              </div>
            </div>
          </div>

          {/* Profile Details Card with integrated Sign Out */}
          <div className="glass-panel rounded-3xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <User className="text-pink-400" size={20} />
              <h2 className="text-lg font-black uppercase italic text-white">Profile info</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Full Name</p>
                <p className="text-white font-bold">{profile?.full_name || "Not set"}</p>
              </div>
              <div>
                <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Email</p>
                <p className="text-white/70 font-medium text-sm">{profile?.email}</p>
              </div>
              <div>
                <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Phone</p>
                <p className="text-white/70 font-medium text-sm">{profile?.phone || "—"}</p>
              </div>
              <div className="pb-4 border-b border-white/5">
                <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Address</p>
                <p className="text-white/70 font-medium text-sm leading-relaxed truncate">{profile?.address || "—"}</p>
              </div>
              
              {/* Optional: Second Sign Out placement inside Profile */}
              <div className="pt-2 flex flex-col gap-2">
                 <button 
                  onClick={() => router.push('/shop')}
                  className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase hover:bg-white/10 transition-all"
                 >
                  Edit Profile
                 </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-2">
          <div className="glass-panel rounded-3xl p-8 border border-white/10 min-h-full">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <CreditCard className="text-pink-400" size={20} />
                <h2 className="text-lg font-black uppercase italic text-white">Order History</h2>
              </div>
              <span className="bg-pink-500/10 text-pink-400 text-[10px] font-black px-3 py-1 rounded-full border border-pink-500/20 uppercase tracking-widest">
                Recent Activity
              </span>
            </div>

            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/2">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="text-white/20" size={30} />
              </div>
              <p className="text-white/40 font-bold text-sm uppercase tracking-widest mb-2">No orders found</p>
              <p className="text-white/20 text-xs font-medium">Your recent purchases will appear here.</p>
              <button 
                onClick={() => router.push('/shop')}
                className="mt-6 px-8 py-3 bg-pink-500 text-white font-black uppercase italic tracking-tighter rounded-2xl hover:bg-pink-600 transition-all active:scale-95"
              >
                Start Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}