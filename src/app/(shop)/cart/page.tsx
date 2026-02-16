"use client";

import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, PackageCheck, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CartPage() {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // Hydration error එක නැති කිරීමට
  useEffect(() => {
    setMounted(true);
  }, []);

  const deliveryFee = 350; 
  const total = cartTotal + deliveryFee;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Orders table එකට දත්ත ඇතුළත් කිරීම
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([{
          customer_name: formData.name,
          phone: formData.phone,
          address: formData.address,
          items: cart,
          total_amount: total,
          status: "Pending"
        }])
        .select();

      if (orderError) throw orderError;

      // 2. Stock Quantity අඩු කිරීම (සෑම Item එකක් සඳහාම)
      for (const item of cart) {
        const { data: product } = await supabase
          .from("products")
          .select("stock_quantity")
          .eq("id", item.id)
          .single();

        if (product) {
          const newStock = product.stock_quantity - item.quantity;
          await supabase
            .from("products")
            .update({ stock_quantity: newStock >= 0 ? newStock : 0 })
            .eq("id", item.id);
        }
      }

      alert("Reina Store: ඔබේ ඇණවුම සාර්ථකව ලැබුණා! ✅");
      clearCart();
      router.push("/collections");

    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (cart.length === 0) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-6 font-sans">
        <div className="relative">
          <div className="absolute -inset-4 bg-blue-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
          <ShoppingBag size={80} className="relative text-gray-300" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-gray-900 uppercase italic">Your bag is empty</h2>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Add some heat to your collection.</p>
        </div>
        <Link href="/collections" className="group flex items-center gap-2 bg-black text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all duration-300 shadow-xl shadow-gray-200">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-12 font-sans bg-white min-h-screen">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-5xl font-black text-gray-900 uppercase tracking-tighter italic">
          Your Bag<span className="text-blue-600">.</span>
        </h1>
        <button onClick={clearCart} className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors">
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-7 space-y-10">
          {cart.map((item) => (
            <div key={item.id} className="group flex gap-6 items-center border-b border-gray-50 pb-10 last:border-0">
              <div className="relative w-32 h-32 rounded-4xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                <Image src={item.image_url} alt={item.name} fill className="object-cover" />
              </div>
              
              <div className="grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-xl text-gray-900 uppercase tracking-tight">{item.name}</h3>
                    <p className="text-blue-600 font-black text-lg mt-1">Rs. {item.price.toLocaleString()}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)} 
                      className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white transition-all text-gray-400"
                    >
                      <Minus size={16} />
                    </button>
                    {/* min-w-[20px] වෙනුවට min-w-5 යොදාගන්නා ලදී */}
                    <span className="font-black text-gray-900 min-w-5 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)} 
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-black text-white hover:bg-blue-600 transition-all"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="font-black text-xl">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Checkout Summary */}
        <div className="lg:col-span-5">
          <div className="bg-gray-50 rounded-[3rem] p-10 h-fit sticky top-28 border border-gray-100 shadow-2xl shadow-gray-100/30">
            <h2 className="text-xl font-black mb-8 text-gray-900 uppercase italic tracking-widest">Order Details</h2>
            
            <div className="space-y-4 mb-10 pb-8 border-b border-gray-200">
              <div className="flex justify-between text-gray-400 font-black uppercase text-[10px] tracking-widest">
                <span>Subtotal</span>
                <span className="text-gray-900">Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400 font-black uppercase text-[10px] tracking-widest">
                <span>Shipping</span>
                <span className="text-green-600">Rs. {deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-3xl font-black text-gray-900 pt-4">
                <span>Total</span>
                <span className="text-blue-600 tracking-tighter">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleCheckout}>
              <input type="text" placeholder="FULL NAME" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-5 rounded-2xl bg-white border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" required />
              <input type="tel" placeholder="PHONE NUMBER" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-5 rounded-2xl bg-white border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" required />
              <textarea placeholder="SHIPPING ADDRESS" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-5 rounded-2xl bg-white border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none h-28 font-bold text-sm resize-none" required />
              
              <button disabled={loading} type="submit" className="w-full bg-black text-white py-6 rounded-3xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-blue-100 disabled:bg-gray-400">
                {loading ? <Loader2 className="animate-spin" /> : <>CONFIRM ORDER (COD) <PackageCheck size={24}/></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}