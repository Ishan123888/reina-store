"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ShoppingCart, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) {
        setProduct(data);
        if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
      }
      setLoading(false);
    }
    getProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-black" size={40} />
    </div>
  );

  if (!product) return <div className="p-20 text-center">Product not found!</div>;

  return (
    <div className="max-w-7xl mx-auto p-8 lg:p-20 font-sans text-black">
      <Link href="/collections" className="flex items-center gap-2 text-gray-400 mb-12 hover:text-black font-bold text-[10px] uppercase tracking-widest">
        <ArrowLeft size={16} /> Back to Collections
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Product Image */}
        <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-gray-50 border border-gray-100">
          <Image src={product.image_url} alt={product.name} fill className="object-cover" />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <span className="text-blue-600 font-black uppercase text-xs tracking-[0.3em] mb-4">{product.category}</span>
          <h1 className="text-6xl font-black uppercase italic tracking-tighter mb-6 leading-none">{product.name}</h1>
          <p className="text-4xl font-black mb-8 text-gray-900">Rs. {product.price.toLocaleString()}</p>
          
          <div className="bg-gray-50 p-8 rounded-4xl border border-gray-100 mb-10">
             <p className="text-gray-500 font-bold leading-relaxed mb-6">{product.description || "Premium quality footwear designed for comfort and style."}</p>
             
             {/* Color Selection */}
             {product.colors?.length > 0 && (
               <div className="mb-8">
                 <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Select Color</p>
                 <div className="flex gap-3">
                   {product.colors.map((color: string) => (
                     <button 
                       key={color} 
                       onClick={() => setSelectedColor(color)}
                       className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${selectedColor === color ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-400'}`}
                     >
                       {color}
                     </button>
                   ))}
                 </div>
               </div>
             )}

             {/* Stock Info */}
             <div className="flex items-center gap-2 text-green-600 font-black text-xs uppercase tracking-widest">
               <CheckCircle2 size={16} /> {product.stock_quantity > 0 ? `${product.stock_quantity} Items in Stock` : "Out of Stock"}
             </div>
          </div>

          <button 
            disabled={product.stock_quantity === 0}
            onClick={() => addToCart({...product, selectedColor})}
            className="w-full bg-black text-white py-6 rounded-3xl font-black text-lg flex items-center justify-center gap-4 hover:bg-blue-600 transition-all shadow-2xl shadow-gray-200 disabled:bg-gray-300"
          >
            <ShoppingCart size={24} /> ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
}