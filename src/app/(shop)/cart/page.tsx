"use client";

import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Loader2, ChevronRight, Truck, ShieldCheck, CreditCard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });

  useEffect(() => { setMounted(true); }, []);

  const deliveryFee = 350; 
  const total = cartTotal + deliveryFee;

  const handleProceed = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { customer: formData, items: cart, total, subtotal: cartTotal, deliveryFee };
      localStorage.setItem("temp_checkout", JSON.stringify(data));
      router.push("/checkout");
    } catch (error) {
      console.error(error);
      alert("Error navigating to checkout.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (cart.length === 0) {
    return (
      <div className="h-[90vh] flex flex-col items-center justify-center space-y-8 font-sans bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-50 via-white to-white">
        <div className="relative group">
          <div className="absolute -inset-10 bg-blue-400 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50">
            <ShoppingBag size={100} className="text-gray-200" strokeWidth={1} />
          </div>
        </div>
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter">Your Bag is Empty</h2>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em]">Ready to upgrade your style?</p>
        </div>
        <Link href="/collections" className="group flex items-center gap-4 bg-black text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95">
          <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" />
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans pb-20">
      {/* Top Header Section */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center lg:text-left">
        <h1 className="text-6xl lg:text-8xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">
          Your Bag<span className="text-blue-600">.</span>
        </h1>
        <div className="mt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.5em]">Review your selection & provide delivery info</p>
          <button onClick={clearCart} className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-all hover:scale-105">
            Clear Entire Bag
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Items (3D Card Style) */}
        <div className="lg:col-span-7 space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col sm:flex-row items-center gap-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative w-44 h-44 rounded-4xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 transform group-hover:scale-105 transition-transform duration-500 shadow-inner">
                <Image src={item.image_url} alt={item.name} fill className="object-cover" />
              </div>
              
              <div className="grow w-full text-center sm:text-left">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-2xl text-gray-900 uppercase tracking-tight italic">{item.name}</h3>
                  <button onClick={() => removeFromCart(item.id)} className="p-3 text-gray-300 hover:text-red-500 transition-all hover:bg-red-50 rounded-2xl">
                    <Trash2 size={22} />
                  </button>
                </div>
                
                <p className="text-blue-600 font-black text-2xl mb-6">Rs. {item.price.toLocaleString()}</p>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-50 pt-6">
                  <div className="flex items-center gap-6 bg-gray-50/80 backdrop-blur-md p-2 rounded-2xl border border-gray-100 shadow-inner">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white transition-all text-gray-400 hover:text-black">
                      <Minus size={18} />
                    </button>
                    <span className="font-black text-xl text-gray-900 min-w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-black text-white hover:bg-blue-600 transition-all shadow-lg active:scale-90">
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Subtotal</p>
                    <p className="font-black text-2xl text-gray-900 italic">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Checkout Sidebar */}
        <div className="lg:col-span-5">
          {/* Changed sticky/relative conflict here */}
          <div className="bg-white rounded-[3.5rem] p-10 sticky top-10 border border-gray-100 shadow-[0_40px_100px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -z-10"></div>
            
            <h2 className="text-2xl font-black mb-10 text-gray-900 uppercase italic tracking-tighter flex items-center gap-3">
              Delivery Details <Truck className="text-blue-600" />
            </h2>
            
            <form className="space-y-5" onSubmit={handleProceed}>
              <div className="space-y-4">
                <input type="text" placeholder="Your Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-6 rounded-3xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm uppercase placeholder:text-gray-300 shadow-inner" required />
                <input type="tel" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-6 rounded-3xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm placeholder:text-gray-300 shadow-inner" required />
                <textarea placeholder="Complete Delivery Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-6 rounded-3xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-600 transition-all h-32 font-bold text-sm resize-none uppercase placeholder:text-gray-300 shadow-inner" required />
              </div>
              
              <div className="bg-gray-50/50 rounded-3xl p-6 space-y-3 mt-8 border border-gray-50">
                <div className="flex justify-between text-gray-400 font-black uppercase text-[10px] tracking-[0.2em]">
                  <span>Bag Subtotal</span>
                  <span className="text-gray-900">Rs. {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400 font-black uppercase text-[10px] tracking-[0.2em]">
                  <span>Shipping Fee</span>
                  <span className="text-green-600">Rs. {deliveryFee.toLocaleString()}</span>
                </div>
                <div className="pt-4 mt-2 border-t border-gray-200 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Grand Total</p>
                    <p className="text-4xl font-black text-gray-900 italic tracking-tighter">Rs. {total.toLocaleString()}</p>
                  </div>
                  <ShieldCheck className="text-green-500 mb-1" size={32} strokeWidth={2.5} />
                </div>
              </div>

              <button disabled={loading} type="submit" className="group w-full bg-black text-white py-7 rounded-4xl font-black text-lg flex items-center justify-center gap-4 hover:bg-blue-600 transition-all duration-500 shadow-2xl shadow-blue-100 mt-6 active:scale-95 disabled:bg-gray-300">
                {loading ? <Loader2 className="animate-spin" /> : <>PROCEED TO CHECKOUT <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" /></>}
              </button>

              <div className="flex items-center justify-center gap-6 mt-8 opacity-20">
                <Truck size={20} />
                <CreditCard size={20} />
                <ShieldCheck size={20} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}