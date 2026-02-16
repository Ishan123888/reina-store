"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr"; // ssr පැකේජය භාවිතා කරන්න
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Browser එකට ගැලපෙන Supabase Client එක
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Supabase Auth හරහා ලොග් වීම (මෙය ස්වයංක්‍රීයව Cookies සකසයි)
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Profile එකෙන් Role එක ලබා ගැනීම
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        throw new Error("පරිශීලක පැතිකඩ සොයාගත නොහැක.");
      }

      // 3. Role එක අනුව Hard Redirect කිරීම
      // window.location.assign මඟින් Middleware එකට අලුත්ම Cookies කියවීමට ඉඩ සලසයි
      if (profile.role === "admin") {
        window.location.assign("/dashboard");
      } else {
        window.location.assign("/collections");
      }

    } catch (error: any) {
      alert(error.message || "Login failed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-sans bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl p-10 text-black">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Reina Store.</h1>
          <p className="text-blue-600 font-bold uppercase text-[10px] tracking-widest mt-2">
            Secure Access
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase ml-2 text-gray-400">Email Address</label>
            <input 
              type="email" 
              placeholder="admin@example.com" 
              required
              className="w-full p-5 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black transition-all font-medium text-black"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase ml-2 text-gray-400">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required
              className="w-full p-5 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black transition-all font-medium text-black"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={isLoading} 
            className="w-full bg-black text-white py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl disabled:bg-gray-400 flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Authenticate"}
          </button>
        </form>
      </div>
    </div>
  );
}