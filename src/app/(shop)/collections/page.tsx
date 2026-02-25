"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ShoppingCart, Loader2, PackageSearch, ArrowRight, Ruler, Palette } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  description: string;
  colors: string[];
  sizes: string[];
}

export default function CollectionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-black mb-4" size={40} />
        <p className="font-black uppercase tracking-widest text-[10px]">Loading Collections...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto font-sans">
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-5xl font-black mb-2 text-gray-900 italic tracking-tighter uppercase">Our Collections.</h1>
        <p className="text-gray-500 font-bold uppercase text-xs tracking-[0.3em]">Premium Quality Slippers</p>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
          <PackageSearch className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 font-bold uppercase text-sm tracking-widest">තාම කිසිදු සෙරෙප්පුවක් ඇතුළත් කර නැත.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map(p => (
            <div key={p.id} className="group relative bg-white rounded-[2.5rem] p-4 border border-gray-100 hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
              
              {/* Product Image Section */}
              <Link href={`/product/${p.id}`}>
                {/* Fixed: rounded-[2rem] -> rounded-4xl */}
                <div className="relative w-full h-64 mb-5 overflow-hidden rounded-4xl bg-gray-50 cursor-pointer">
                  <Image 
                    src={p.image_url || "/placeholder-slipper.jpg"} 
                    alt={p.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute top-3 left-3">
                     <span className="bg-white/90 backdrop-blur-md text-black px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                       {p.category}
                     </span>
                  </div>
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <span className="bg-white text-black px-4 py-2 rounded-full text-[10px] font-black flex items-center gap-2">VIEW DETAILS <ArrowRight size={14}/></span>
                  </div>
                </div>
              </Link>

              {/* Product Details Section */}
              {/* Fixed: flex-grow -> grow */}
              <div className="px-2 grow">
                <h3 className="font-black text-xl text-gray-900 tracking-tight leading-tight mb-1 truncate">{p.name}</h3>
                <p className="text-blue-600 font-black text-2xl mb-4 text-nowrap">Rs. {p.price.toLocaleString()}</p>
                
                {/* Available Sizes & Colors Badges */}
                <div className="space-y-3 mb-6">
                  {/* Sizes */}
                  <div className="flex items-center gap-2">
                    <Ruler size={14} className="text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {p.sizes && p.sizes.length > 0 ? (
                        p.sizes.map(size => (
                          <span key={size} className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                            {size}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-gray-400">N/A</span>
                      )}
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="flex items-center gap-2">
                    <Palette size={14} className="text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {p.colors && p.colors.length > 0 ? (
                        p.colors.map(color => (
                          <span key={color} className="text-[10px] font-bold border border-gray-200 text-gray-500 px-2 py-0.5 rounded-md">
                            {color}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-gray-400">N/A</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="mt-auto pt-2 px-1">
                <button 
                  onClick={() => addToCart(p)}
                  className="w-full bg-black text-white py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-600 transition-all duration-300 font-black text-xs uppercase tracking-widest shadow-lg shadow-gray-200 active:scale-95"
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}