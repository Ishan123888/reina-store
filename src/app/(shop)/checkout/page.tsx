"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { createClient } from "@supabase/supabase-js";
import { Loader2, CheckCircle2, PackageCheck } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CheckoutPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const savedData = localStorage.getItem("temp_checkout");
    if (!savedData) {
      router.push("/cart");
      return;
    }
    setOrderData(JSON.parse(savedData));
  }, [router]);

  const handleConfirmOrder = async () => {
    setLoading(true);
    try {
      // 1. Supabase එකට Order එක ඇතුළත් කිරීම
      const { error: orderError } = await supabase
        .from("orders")
        .insert([{
          customer_name: orderData.customer.name,
          phone: orderData.customer.phone,
          address: orderData.customer.address,
          items: orderData.items,
          total_amount: orderData.total,
          status: "Pending"
        }]);

      if (orderError) throw orderError;

      // 2. Stock අඩු කිරීම
      for (const item of orderData.items) {
        const { data: prod } = await supabase.from("products").select("stock_quantity").eq("id", item.id).single();
        if (prod) {
          await supabase.from("products").update({ stock_quantity: Math.max(0, prod.stock_quantity - item.quantity) }).eq("id", item.id);
        }
      }

      alert("Reina Store: ඔබේ ඇණවුම සාර්ථකව ලැබුණා! ✅");
      
      // 3. Clear Cart & Storage
      localStorage.removeItem("temp_checkout");
      clearCart();

      // 4. Navigate back to Collections
      router.push("/collections");

    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!orderData) return <div className="h-screen flex items-center justify-center font-black">LOADING...</div>;

  return (
    <div className="max-w-3xl mx-auto p-10 font-sans min-h-screen">
      <h1 className="text-4xl font-black uppercase italic mb-10 text-center">Review Your Order<span className="text-blue-600">.</span></h1>
      
      <div className="bg-gray-50 p-10 rounded-[3rem] border space-y-8">
        <div>
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Shipping To</h3>
          <p className="font-black text-xl uppercase">{orderData.customer.name}</p>
          <p className="font-bold text-gray-500">{orderData.customer.phone}</p>
          <p className="font-bold text-gray-500 uppercase">{orderData.customer.address}</p>
        </div>

        <div className="border-t pt-8">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Items</h3>
          {orderData.items.map((item: any) => (
            <div key={item.id} className="flex justify-between font-bold mb-2">
              <span className="uppercase text-sm">{item.quantity}x {item.name}</span>
              <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-8 space-y-2">
          <div className="flex justify-between text-gray-400 font-bold text-xs uppercase">
            <span>Subtotal</span>
            <span>Rs. {orderData.subtotal?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-400 font-bold text-xs uppercase">
            <span>Shipping</span>
            <span>Rs. 350</span>
          </div>
          <div className="flex justify-between text-3xl font-black pt-4">
            <span>Total</span>
            <span className="text-blue-600">Rs. {orderData.total.toLocaleString()}</span>
          </div>
        </div>

        <button 
          onClick={handleConfirmOrder}
          disabled={loading}
          className="w-full bg-black text-white py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 hover:bg-green-600 transition-all shadow-xl"
        >
          {loading ? <Loader2 className="animate-spin" /> : <>PLACE ORDER (COD) <PackageCheck size={28}/></>}
        </button>
      </div>
    </div>
  );
}